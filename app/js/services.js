'use strict';

/* Services */

var WEB_SERVICE_URL = 'http://localhost/home/api/index.php';
var WUNDERGROUND_URL = 'http://api.wunderground.com/api/fddd0e97a864818a';

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('services', []).
    service('linksService', ['$http',  function($http){
        console.log('linksService...'); 
        
        var linksService = {};
        
        linksService.getAll = function(onSuccess, onFailure){
            $http.get(WEB_SERVICE_URL + '/links')
                .success(onSuccess).error(onFailure)
        };

        linksService.get = function(id, onSuccess, onFailure){
            $http.get(WEB_SERVICE_URL + '/links/' + id)
                .success(onSuccess).error(onFailure)
        };

        1
        linksService.saveOrUpdate = function(request, onSuccess, onFailure){
            $http.post(WEB_SERVICE_URL + '/links', request)
                .success(onSuccess).error(onFailure);
        }

        linksService.delete = function(id, onSuccess, onFailure){
            $http.delete(WEB_SERVICE_URL + '/links/' + id)
                .success(onSuccess).error(onFailure);
        }

        return linksService;

    }]).
    service('feedsService', ['$http',  function($http){
        console.log('feedsService...'); 
        
        var feedsService = {};
        
        feedsService.getAll = function(onSuccess, onFailure){
            $http.get(WEB_SERVICE_URL + '/feeds')
                .success(onSuccess).error(onFailure)
        };

        feedsService.get = function(id, onSuccess, onFailure){
            $http.get(WEB_SERVICE_URL + '/feeds/' + id)
                .success(onSuccess).error(onFailure)
        };

        feedsService.saveOrUpdate = function(request, onSuccess, onFailure){
            $http.post(WEB_SERVICE_URL + '/feeds', request)
                .success(onSuccess).error(onFailure);
        };

        feedsService.delete = function(id, onSuccess, onFailure){
            $http.delete(WEB_SERVICE_URL + '/feeds/' + id)
                .success(onSuccess).error(onFailure);
        };
        
        return feedsService;

    }]).
    service('categoryService', ['$http',  function($http){
        var categoryService = {}
        
        categoryService.get = function(query, onSuccess, onFailure){
            $http.get(WEB_SERVICE_URL + '/categories/' + query)
                .success(onSuccess).error(onFailure);
        };


        return categoryService;
    }]).
    service('weatherService', ['$http',  function($http){
        var weatherService = {};

        weatherService.getCurrentConditions = function(position, onSuccess, onFailure){
            console.log('weatherService.getCurrentConditions In...')
            var lon = position.coords.longitude; 
            var lat = position.coords.latitude;
            
            $http.jsonp(WUNDERGROUND_URL + '/conditions/q/' + lat + ',' + lon + '.json?callback=JSON_CALLBACK')
                .success(onSuccess).error(onFailure);
        };

        weatherService.getRadarImage = function(position){
            var lon = position.coords.longitude; 
            var lat = position.coords.latitude;
            var height = 280;
            var width = 280;
            var radius = 100;
            return WUNDERGROUND_URL +'/radar/image.gif?centerlat=' + lat + '&centerlon=' + lon + '&radius=' + radius + '&width=' + width + 'height=' + height + '&newmaps=1' 
        };

        weatherService.getAlerts = function(position, onSuccess, onFailure ){
            var lon = position.coords.longitude; 
            var lat = position.coords.latitude;
            $http.jsonp(WUNDERGROUND_URL + '/alerts/q/' + lat + ',' + lon + '.json?callback=JSON_CALLBACK')
                .success(onSuccess).error(onFailure);  
        }

        return  weatherService;
    }]);










