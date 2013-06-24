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
               console.log(response)
            }, function(response){
                console.log('LinksController.getLinks failure.... %o', response)
            });
        };
        
    }]).
    controller('FeedsController', ['$scope', 'feedsService', '$filter', function($scope, feedsService, $filter) {
        console.log('FeedsController...');
            
        $scope.feedsData = [];
        var group = $filter('group');
        var orderBy = $filter('orderBy');
        var feeds = {};
        $scope.feed = {};
       
        $scope.getAll = function(){
            console.log('FeedsController.getAll...');
            feedsService.getAll(function(response){
                //console.log(response);
                feeds = response.feeds;
                getFeedsFromGoogle();
            
            }, function(){
                console.log('FeedsController.getFeeds failure....')
            });

        };
        
        var getFeedsFromGoogle = function(){
            for (var i=0; i<feeds.length;i++){
                var feed = new google.feeds.Feed(feeds[i].url);
                feed.load(function(result) {
                    if (!result.error && result.feed) {
                      $scope.feedsData.push(result.feed);
                    }
                });
            }; 
        };   
       
        $scope.toStringSort = function(arg) {
            return ""+arg.position;
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
                $scope.feed = {};
                $scope.getAll();
            }, 
            function(response){
                console.log('FeedsController.saveOrUpdate failure....')
                console.log(response)
            });
        };
    }])   
    .controller('WeatherController', ['$scope', 'weatherService', function($scope, weatherService) {
        console.log('WeatherController...');
            
            $scope.currentConditions = {};
            $scope.radarImage = null;
            $scope.position = {};
            $scope.showAlertsIcon = false;
            $scope.forecast = [];
            $scope.showForecast = false;
            $scope.radar = null;
            $scope.alerts = [];

            $scope.getPosition = function(load){
                if (navigator.geolocation){
                    navigator.geolocation.getCurrentPosition(function(pos){
                        if (load){
                            getCurrentConditions(pos);
                            getAlerts(pos);
                            getForecast(pos);
                            getRadar(pos);
                        }
                        $scope.position = pos;
                    });
                    return true;        
                }else{
                    console.log("Geolocation is not supported by this browser.");
                    return false
                }
            };

            var getCurrentConditions = function(position){
                console.log("WeatherController.getCurrentConditions Sending service call...")
                weatherService.getCurrentConditions(position, function(response){
                    $scope.currentConditions = response.current_observation;
                }, function(){
                    console.log("WeatherController.getCurrentConditions Failed to retieve data.")
                } );
            };
            
            var getRadar = function(position){
                console.log("WeatherController.getRadar Clicked...")
                $scope.radar = weatherService.getRadarImage(position);
                console.log($scope.radar)
            };

            var getAlerts = function(position){
                weatherService.getAlerts(position, 
                    function(response){
                        if (response.alerts && response.alerts.length > 0){
                            $scope.showAlertsIcon = true;
                            $scope.alerts = response.alerts;
                        }
                    }, 
                    function(){})
            }

            var getForecast = function(position){
                weatherService.getForecast(position, 
                    function(response){
                        if (!response.forecast)
                            return;
                        
                        var day = response.forecast.simpleforecast.forecastday;
                        for (var i=0; i<=3; i++){
                            $scope.forecast.push(day[i]);
                        }
                    
                     }, 
                    function(){

                    });
            }

            $scope.setShowForecast = function(){
                $scope.showForecast = $scope.showForecast?false:true
            }
            
    }]);














