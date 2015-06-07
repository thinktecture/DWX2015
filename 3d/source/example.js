/// <reference path="../typings/jquery/jquery.d.ts"/>
/// <reference path="../typings/signalr/signalr.d.ts"/>
/// <reference path="../typings/stats/stats.d.ts"/>
/// <reference path="../typings/threejs/three.d.ts"/>
/// <reference path="../typings/threejs/three-trackballcontrols.d.ts"/>
/// <reference path="../typings/tween.js/tween.js.d.ts"/>

(function () {
	
	var EARTH_RADIUS = 5;
	var MOON_RADIUS = EARTH_RADIUS * 0.27;
	var MOON_DISTANCE = EARTH_RADIUS * 5; //approx. EARTH_RADIUS * 30 in reality
	var VISUALIZER_EDGE_LENGTH = 0.75;
	var VISUALIZER_DEPTH_FACTOR = EARTH_RADIUS / 75;
	var NINETY_DEGREES_IN_RAD = degToRad(90);
	
	var data;
	var container, camera, scene, renderer, controls, stats;
	
	var visualizers = {};
	var visualizerMappings = {
		"NorthAmerica": {
			position: getPositionOnSphere(-40, -110),
			rotation: new THREE.Vector3(degToRad(90-110), 0, degToRad(40)),
			color: 0xffff00
		},
		"SouthAmerica": {
			position: getPositionOnSphere(20, -80),
			rotation: new THREE.Vector3(degToRad(90-80), 0, degToRad(90+20)),
			color: 0x00ff00
		},
		"Asia": {
			position: getPositionOnSphere(55, 75),
			rotation: new THREE.Vector3(degToRad(90-75), 0, degToRad(55-90)),
			color: 0x0000ff
		},
		"Africa": {
			position: getPositionOnSphere(-90,0),
			rotation: new THREE.Vector3(NINETY_DEGREES_IN_RAD, 0, 0),
			color: 0xff00ff
		},
		"Europe": {
			position: getPositionOnSphere(100, 50),
			rotation: new THREE.Vector3(degToRad(90-50), 0, degToRad(100-90)),
			color: 0xf0000f
		},
		"Australia": {
			position: getPositionOnSphere(-25, 110),
			rotation: new THREE.Vector3(degToRad(110-90), 0, degToRad(-90-25)),
			color: 0x0ffff0
		},
		"Antarctica": {
			position: new THREE.Vector3(0, -EARTH_RADIUS, 0),
			rotation: new THREE.Vector3(0, 0, degToRad(-180)),
			color: 0xf00f00
		},
		"Moon": {
			position: new THREE.Vector3(MOON_DISTANCE, MOON_RADIUS, 0),
			rotation: new THREE.Vector3(0, 0, 0),
			color: 0xf000f0
		}
	};
	
	function getPositionOnSphere(s, t) {
		var r = EARTH_RADIUS;
		s = degToRad(s);
		t = degToRad(t);
		
		var x = r * Math.cos(s) * Math.sin(t);
		var y = r * Math.sin(s) * Math.sin(t);
		var z = r * Math.cos(t);

		return new THREE.Vector3(x, y, z);
	}
	
	function degToRad(deg) {
		return deg * Math.PI / 180;
	}
	
	init();
	setupSignalR();
	animate();
	
	window.addEventListener('resize', onResize);
	
	function setupSignalR() {
		var hubConnection = $.hubConnection('http://10.211.55.3:8080');
		var proxy = hubConnection.createHubProxy('GummibearHub');

		hubConnection.logging = true;
		hubConnection.start().done(function () {
			proxy.invoke('GetCurrentConsumption').done(function (result) {
				data = result;
				redrawData();
			});
		});
		
		proxy.on('UpdateConsumption', function (continent, newValue) { 
			if (data) {
		    	data[continent] = newValue;
				redrawContinent(continent, newValue);
			}
		});
	}
	
	function redrawData() {
		for(var continent in data) {
			redrawContinent(continent, data[continent]);
		}
	}
	
	function redrawContinent(continent, newValue) {
		var visualizer = visualizers[continent];
		
		if (!visualizer) {
			visualizers[continent] = visualizer = getVisualizer(continent);
		}
		
		new TWEEN.Tween({y: visualizer.scale.y})
			.to({y: newValue * VISUALIZER_DEPTH_FACTOR}, 1000)
			.easing(TWEEN.Easing.Elastic.InOut)
			.onUpdate(function () {
				visualizer.scale.y = this.y;
			})
			.start();
	}
	
	function getVisualizer(continent) {
		var mapping = visualizerMappings[continent];
	
		var geometry = new THREE.BoxGeometry(VISUALIZER_EDGE_LENGTH, VISUALIZER_EDGE_LENGTH, VISUALIZER_EDGE_LENGTH);
		geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, VISUALIZER_EDGE_LENGTH / 2, 0 ) );
		var material = new THREE.MeshLambertMaterial({color: mapping.color});
		var mesh = new THREE.Mesh(geometry, material);
		
		mesh.position.set(mapping.position.x, mapping.position.y, mapping.position.z);
		mesh.rotation.setFromVector3(mapping.rotation);
		
		scene.add(mesh);
		
		return mesh;
	}
	
	function init() {
		stats = new Stats();
		document.body.appendChild(stats.domElement);
		
		container = document.getElementById('container');
		
		camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 500);
		camera.position.set(0, 0, 30);
		
		scene = new THREE.Scene();
		
		// Earth Sphere
		var textureLoader = new THREE.TextureLoader();
		textureLoader.load('assets/earth.jpg', function (texture) {
			var geometry = new THREE.SphereGeometry(EARTH_RADIUS, 32, 32);
			var material = new THREE.MeshLambertMaterial({map: texture});
			var sphere = new THREE.Mesh(geometry, material);
			sphere.rotation.y = 250 * Math.PI / 180;
			scene.add(sphere);
		});
		
		// Moon Sphere
		textureLoader.load('assets/moon.jpg', function (texture) {
			var geometry = new THREE.SphereGeometry(MOON_RADIUS, 32, 32);
			var material = new THREE.MeshLambertMaterial({map: texture});
			var sphere = new THREE.Mesh(geometry, material);
			sphere.position.set(MOON_DISTANCE, 0, 0);
			sphere.rotation.y = 180 * Math.PI / 180;
			scene.add(sphere);
		});
		
		// Lights
		var ambientLight = new THREE.AmbientLight(0xcccccc);
		scene.add(ambientLight);
		
		var spotLight = new THREE.PointLight(0xffffff);
		spotLight.position.set(0, 0, 500);
		scene.add(spotLight);
		
		// Stars
		var starsCount = 2500;
		var stars = new THREE.Geometry();
		var starMaterial = new THREE.PointCloudMaterial({color: 0xffffff});
		
		for (var i = 0; i < starsCount; i++) {
			var x = Math.random() * 1000 - 500;
			var y = Math.random() * 1000 - 500;
			var z = Math.random() * 1000 - 500;
			
			var star = new THREE.Vector3(x, y, z);
			
			stars.vertices.push(star);
		}
		
		var pointCloud = new THREE.PointCloud(stars, starMaterial);
		scene.add(pointCloud);
		
		renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(0x000000);
		container.appendChild(renderer.domElement);
		
		controls = new THREE.TrackballControls(camera);
	}
	
	function animate() {
		window.requestAnimationFrame(animate);
		
		stats.update();
		controls.update();
		TWEEN.update();
		
		renderer.render(scene, camera);
	}
	
	function onResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
	    camera.updateProjectionMatrix();
		
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
	
})();