'use strict';

/* Controllers */

angular.module('controllers', []).
    controller('LinksController', ['$scope', 'linksService', function($scope, linksService) {
        console.log('LinksController...');
            
        $scope.links = [];
        $scope.link = {};

        $scope.saveOrUpdate = function(){
            console.log('LinksControll.saveOrUpdate...')

            var request = { link: $scope.link };

            linksService.saveOrUpdate(request, function(response){
                console.log('LinksController.saveOrUpdate Saved Successfully....');
                $scope.link = {};
                $scope.getAll();
            }, 
            function(response){
                console.log('LinksController.saveOrUpdate failure....')
                console.log(response)
            });
        }; 

        $scope.getAll = function(){
            $scope.links = [];
            linksService.getAll(function(response){
               $scope.links = response.links;
            }, function(response){
                console.log('LinksController.getLinks failure.... %o', response)
            });

        };
        
    }]).
    controller('FeedsController', ['$scope', 'feedsService', '$filter', 'localStorageService', 'categoryService', function($scope, feedsService, $filter, localStorageService, categoryService) {
        console.log('FeedsController...');
            
        $scope.feedsData = [];
        var group = $filter('group');
        var orderBy = $filter('orderBy');
        var feeds = {};
        $scope.feed = {};
       
        var FEEDS_CACHE = {};

        $scope.getAll = function(){
            console.log('FeedsController.getAll...');
            
            feedsService.getAll(function(response){
                feeds = response.feeds;
                getFeedsFromGoogle();
            
            }, function(){
                console.log('FeedsController.getFeeds failure....')
            });

        };


        $scope.getFeed = function(id){
            console.log('FeedsController.getFeed by id ' + id + '...');
            
            feedsService.get(id, function(response){
                
                $scope.feed = response.feed;
                
            }, function(){
                console.log('FeedsController.getFeeds failure....')
            });

        };        
        
        var getFeedsFromGoogle = function(){
            var cache = localStorageService.getItem(FEEDS_CACHE);

            if ( cache ){
                $scope.feedsData = localStorageService.getItem(FEEDS_CACHE).feedsData;
                return;
            }

            console.log("FeedsController.getFeedsFromGoogle Loading feeds from Service");

            for (var i=0; i<feeds.length;i++){
                
                var feed = new google.feeds.Feed(feeds[i].url);
                feed.load(function(result) {
                    if (!result.error && result.feed) {
                        $scope.feedsData.push(result.feed);
                        var feedsCache = {};
                        feedsCache.feedsData = $scope.feedsData
                        localStorageService.saveItem(FEEDS_CACHE, feedsCache, true);
                    }
                });
            }; 
        };   
       
        $scope.toStringSort = function(arg) {
            return "" + arg.position;
        };

        $scope.$watch('feedsData', function(feedsData){   
            var result = $filter('orderBy')(feedsData, function(arg) {
                return ""+arg.position;
            });
            result = group(result, 3);
            $scope.feedsDataDisplay = result;
        }, true);

        
        $scope.saveOrUpdate = function(){
            console.log('FeedsControll.saveOrUpdate...')
            var request = { feed: $scope.feed };
            feedsService.saveOrUpdate(request, function(response){
                console.log('FeedsController.saveOrUpdate Saved Successfully....')
                console.log(response);
                localStorageService.removeItem(FEEDS_CACHE);
                $scope.feed = {};
                $scope.getAll();
            }, 
            function(response){
                console.log('FeedsController.saveOrUpdate failure....')
                console.log(response)
            });
        };

    }])   
    .controller('WeatherController', ['$scope', 'weatherService', 'localStorageService', function($scope, weatherService, localStorageService) {
        console.log('WeatherController...');
            
            $scope.currentConditions = {};
            $scope.radarImage = null;
            $scope.position = {};
            $scope.showAlertsIcon = false;
            $scope.forecast = {};
            $scope.showForecast = false;
            $scope.radar = {};
            $scope.alerts = {};

            var CURRENT_CONDITIONS = 'weather-current-conditions';
            var ALERTS = 'weather-alerts';
            var FORECAST = 'weather-forecast';
            var RADAR = 'weather-radar';

            $scope.getPosition = function(load){
                if (navigator.geolocation){
                    navigator.geolocation.getCurrentPosition(function(pos){
                        if (load){
                            getCurrentConditions(pos);
                            getAlerts(pos);
                            getForecast(pos);
                            getRadar(pos)
                        }
                        $scope.position = pos;
                    });
                    return true;        
                }else{
                    console.log("Geolocation is not supported by this browser.");
                    return false;
                }
            };

            var getCurrentConditions = function(position){
                
                var cache = localStorageService.getItem(CURRENT_CONDITIONS);
                if ( cache ){
                    console.log("WeatherController.getCurrentConditions Loading current conditions from cache");
                    $scope.currentConditions = localStorageService.getItem(CURRENT_CONDITIONS);
                    return;
                }              

                console.log("WeatherController.getCurrentConditions Sending service call...")
                
                weatherService.getCurrentConditions(position, function(response){
                    console.log("WeatherController.getCurrentConditions Loading current conditions from service");
                    $scope.currentConditions = response.current_observation;
                    localStorageService.saveItem(CURRENT_CONDITIONS, $scope.currentConditions, true);
                }, function(){
                    console.log("WeatherController.getCurrentConditions Failed to retieve data.")
                } );
            };
            
            var getRadar = function(position){
                console.log("WeatherController.getRadar Clicked...");
                var cache = localStorageService.getItem(RADAR);
                if ( cache ){
                    console.log("WeatherController.getRadar Loading radar images from cache");
                    $scope.radar = localStorageService.getItem(RADAR);
                    return;
                }              

                $scope.radar.image = weatherService.getRadarImage(position);
                localStorageService.saveItem(RADAR, $scope.radar, true);   

            };

            var getAlerts = function(position){

                var cache = localStorageService.getItem(ALERTS);
                if ( cache ){
                    console.log("WeatherController.getAlerts Loading alerts from cache");
                    $scope.alerts = localStorageService.getItem(ALERTS);
                    return;
                }              

                weatherService.getAlerts(position, 
                    function(response){
                        console.log("WeatherController.getAlerts Loading alerts from service");
                        if (response && response.alerts.length > 0){
                            $scope.showAlertsIcon = true;
                            $scope.alerts = response;
                        }
                        localStorageService.saveItem(ALERTS, $scope.alerts, true);
                    }, 
                    function(){})
            }

            var getForecast = function(position){
                var cache = localStorageService.getItem(FORECAST);
                if ( cache ){
                    console.log("WeatherController.getForecast Loading forecast from cache");
                    $scope.forecast = localStorageService.getItem(FORECAST);
                    return;
                }              

                weatherService.getForecast(position, 
                    function(response){
                        console.log("WeatherController.getForecast Loading forecast from service");
                        if (!response.forecast)
                            return;
                        
                        var day = response.forecast.simpleforecast.forecastday;
                        $scope.forecast.days = []
                        for (var i=0; i<=3; i++){
                            $scope.forecast.days.push(day[i]);
                        }
                        localStorageService.saveItem(FORECAST, $scope.forecast, true);
                    
                     }, 
                    function(){

                    });
            }

            $scope.setShowForecast = function(){
                $scope.showForecast = $scope.showForecast?false:true
            }
            
    }])
    .controller('SearchController', ['$scope', 'searchService', function($scope, searchService) {
        
        $scope.query = undefined;
        $scope.results = null;

        $scope.search = function(){
            searchService.search($scope.query, 
            function(response){
                console.log('SearchController.search Results...')
                console.log(response[1]);
                $scope.results = response[1];
            }, 
            function(){
                console.log('SearchController.search Error...')
            });    
        }
        

    }]);














