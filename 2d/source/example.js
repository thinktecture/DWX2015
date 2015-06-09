/// <reference path="../typings/chartjs/chart.d.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/leaflet/leaflet.d.ts" />
/// <reference path="../typings/signalr/signalr.d.ts" />

(function() {
    var SIGNAL_R_ENDPOINT = 'http://192.168.0.100:8080';
    var MAX_VALUE = 100;
    
    var pane;
    var charts = {};
    var mappings = {
        "NorthAmerica": {
            label: "North America",
            color: "hotpink",
		},
		"SouthAmerica": {
            label: "South America",
            color: "lime",
		},
		"Asia": {
            label: "Asia",
            color: "teal",
		},
		"Africa": {
            label: "Africa",
            color: "tomato",
		},
		"Europe": {
            label: "Europe",
            color: "cornflowerblue",
		},
		"Australia": {
            label: "Australia",
            color: "chocolate",
		},
		"Antarctica": {
            label: "Antarctica",
            color: "sandybrown",
		},
    };
    
    setupSignalR();
    initLeaflet();
    initCharts();
       
    function setupSignalR() {
        var hubConnection = $.hubConnection(SIGNAL_R_ENDPOINT);
        var proxy = hubConnection.createHubProxy('GummibearHub');
        
        proxy.on('UpdateConsumption', function (continent, newValue) { 
        	setNewValue(continent, newValue);
        });
        
        hubConnection.logging = true;
        hubConnection.start().done(function () {
        	proxy.invoke('GetCurrentConsumption').done(function (result) {
        		for(var continent in result) {
                    setNewValue(continent, result[continent]);
                }
        	});
        });
    }
    
    function setNewValue(continent, newValue) {
        var chart = charts[continent];
        if (chart) {
            chart.segments[0].value = newValue;
            chart.segments[1].value = MAX_VALUE - newValue;
            
            chart.update();
        }
    };
    
    function initLeaflet() {
        var map = L.map('container', {
            center: L.latLng(30, 10),
            zoom: 2
        });
        
        var isRetina = !!window.devicePixelRatio && window.devicePixelRatio > 1;
        var retinaSuffix = isRetina ? '@2x' : '';    
        
        L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}' + retinaSuffix + '.png', {
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
        }).addTo(map);
        
        pane = map.getPanes().overlayPane;
    }
    
    function initCharts() {
        for(var continent in mappings) {
            if (mappings.hasOwnProperty(continent)) {
                createChart(continent);
            }
        }
    }
    
    function createChart(continent) {
        var mapping = mappings[continent];
        var element = document.createElement('canvas');
        element.setAttribute('id', continent);
        pane.appendChild(element);
               
        var context = element.getContext('2d');
        var chart = new Chart(context).Pie([{
            color: mapping.color,
            label: mapping.label,
            value: 0,
            highlight: "black"
        }, {
            color: "transparent",
            label: 'Not consumed',
            value: 100,
            highlight: "white"            
        }]);
        charts[continent] = chart;
        
    }
})();