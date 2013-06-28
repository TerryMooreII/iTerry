'use strict';

/* Services */

var WEB_SERVICE_URL = 'http://localhost/home/api/index.php';
//var WEB_SERVICE_URL = 'http://terrymooreii.com/iTerry/api/index.php';
var WUNDERGROUND_URL = 'http://api.wunderground.com/api/fddd0e97a864818a';
var GOOGLE_AUTOCOMPLETE_URL = 'http://suggestqueries.google.com/complete/search';

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
            var height = 320;
            var width = 520;
            var radius = 100;
            return WUNDERGROUND_URL +'/radar/image.gif?centerlat=' + lat + '&centerlon=' + lon + '&radius=' + radius + '&width=' + width + 'height=' + height + '&newmaps=1' 
        };

        weatherService.getForecast = function(position, onSuccess, onFailure){
            var lon = position.coords.longitude; 
            var lat = position.coords.latitude;
            $http.jsonp(WUNDERGROUND_URL + '/forecast/q/' + lat + ',' + lon + '.json?callback=JSON_CALLBACK')
                .success(onSuccess).error(onFailure);  
        }

        weatherService.getAlerts = function(position, onSuccess, onFailure ){
            var lon = position.coords.longitude; 
            var lat = position.coords.latitude;
            $http.jsonp(WUNDERGROUND_URL + '/alerts/q/' + lat + ',' + lon + '.json?callback=JSON_CALLBACK')
                .success(onSuccess).error(onFailure);  
        }

        return  weatherService;
    }]).
    service('searchService', ['$http',  function($http){
        console.log('SearchService...'); 
        
        var searchService = {};
        
        searchService.test = function(term, onSuccess, onFailure){
             $http.jsonp(GOOGLE_AUTOCOMPLETE_URL + '?' + 'q=' + term + '&client=chrome&callback=JSON_CALLBACK')
                .success(onSuccess).error(onFailure)
        }

        return searchService;
    }]).
    service('localStorageService', ['$http',  function($http){
        console.log('LocalStorageService...')
        var EXPIRED_MINUTES = 15;
        var localStorageService = {};

        var hasLocalStorage = function(){
            if(typeof(Storage)!=="undefined")
                return true;
            else 
                return false;
        };

        localStorageService.saveItem = function(key, value, addTimestamp){
            if(!hasLocalStorage || !key || !value)
                return false;

            if ( typeof value === 'object'){
                if (addTimestamp){
                    value._loaded = new Date().getTime();
                }
                value = JSON.stringify(value);
            }

            localStorage.setItem(key, value);

        };

        localStorageService.getItem = function(key){
            if (!hasLocalStorage || !key)
                return false;

            var value = localStorage.getItem(key);

            try {

                value = JSON.parse(value);

                if (isExpired(value)){
                    value = null;
                }

            }catch(e){
                console.log('Unable to parse localstorage or not needed')
            }
            
            return value;
            
        };

        localStorageService.removeItem = function(key){
            if (!hasLocalStorage || !key)
                return false;

            localStorage.removeItem(key);  
        };

        var isExpired = function(value){
            if (!value || !value._loaded){
                return true;
            }
            var currentTime = new Date().getTime();
            var expired = EXPIRED_MINUTES * 60 * 1000;

            if (currentTime - value._loaded > expired)
                return true;
            else 
                return false;

        }

        return localStorageService;
    }])    
;










