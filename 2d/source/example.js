/// <reference path="../typings/chartjs/chart.d.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/leaflet/leaflet.d.ts" />
/// <reference path="../typings/signalr/signalr.d.ts" />

(function() {
    var SIGNAL_R_ENDPOINT = 'http://192.168.178.29:6060';
    var MAX_VALUE = 100;
    var PIE_CHARTS_WIDTH = 300;
    var PIE_CHARTS_HEIGHT = 150;
    var PIXEL_UNIT = 'px';
    
    var map;
    var charts = {};
    var elements = {};
    var mappings = {
        "NorthAmerica": {
            label: "North America",
            color: "hotpink",
            coordinates: [52.348763, -109.335938]
		},
		"SouthAmerica": {
            label: "South America",
            color: "lime",
            coordinates: [-16.172473, -57.656250]
		},
		"Asia": {
            label: "Asia",
            color: "teal",
            coordinates: [56.692442, 88.593750]
		},
		"Africa": {
            label: "Africa",
            color: "tomato",
            coordinates: [0, 20.07202]
		},
		"Europe": {
            label: "Europe",
            color: "cornflowerblue",
            coordinates: [50.44701, 9.52515]
		},
		"Australia": {
            label: "Australia",
            color: "chocolate",
            coordinates: [-24.786735, 134.648438]
		},
		"Antarctica": {
            label: "Antarctica",
            color: "sandybrown",
            coordinates: [-81.000889, 51.152344]
		}
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
        map = L.map('container', {
            center: L.latLng(30, 10),
            zoom: 2
        });
        
        var retinaSuffix = L.Browser.retina ? '@2x' : '';    
        
        L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}' + retinaSuffix + '.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            minZoom: 2
        }).addTo(map);
    }
    
    function initCharts() {
        var pane = map.getPanes().overlayPane;
        
        for(var continent in mappings) {
            if (mappings.hasOwnProperty(continent)) {
                createChart(continent, pane);
            }
        }
        
        repositionCharts();
        map.on('zoomend', repositionCharts);
        map.on('zoomstart', hideCharts);
    }
    
    function createChart(continent, pane) {
        var mapping = mappings[continent];
        var element = document.createElement('canvas');
        element.setAttribute('id', continent);
        element.style.height = PIE_CHARTS_HEIGHT + PIXEL_UNIT;
        element.style.width = PIE_CHARTS_WIDTH + PIXEL_UNIT;
        element.style.position = 'absolute';
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
        elements[continent] = element;
    }
    
    function repositionCharts() {
        for(var continent in elements) {
            if (elements.hasOwnProperty(continent)) {
                var mapping = mappings[continent];
                var element = elements[continent];
                
                var layerPoint = map.latLngToLayerPoint(mapping.coordinates);
                layerPoint.x -= PIE_CHARTS_WIDTH/2;
                layerPoint.y -= PIE_CHARTS_HEIGHT/2;
                L.DomUtil.setPosition(element, layerPoint);
                
                if (element.hasAttribute('hide')) {
                    element.removeAttribute('hide');
                }
            }
        }
    }
    
    function hideCharts() {
        for(var continent in elements) {
            if (elements.hasOwnProperty(continent)) {
                var element = elements[continent];
                element.setAttribute('hide', 'hide');
            }
        }
    }
})();