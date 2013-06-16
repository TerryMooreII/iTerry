'use strict';

/* Controllers */

angular.module('controllers', []).
    controller('LinksController', ['$scope', 'linksService', function($scope, linksService) {
        console.log('LinksController...');
            
        $scope.links = [];


        var getAll = function(){
            linksService.getAll(function(response){
                //console.log(response);
                $scope.links = response.links;
            }, function(){
                console.log('LinksController.getLinks failure....')
            });
        };

        getAll();
        
    }]).
    controller('FeedsController', ['$scope', 'feedsService', function($scope, feedsService) {
        console.log('FeedsController...');
            
         var feeds = [];
        $scope.feed = {};
        $scope.feedsData = [];

        $scope.saveOrUpdate = function(){
            console.log('FeedsControll.saveOrUpdate...')
            console.log($scope.feed);
            var request = { feed: $scope.feed };

            feedsService.saveOrUpdate(request, function(response){

            }, 
            function(){
                console.log('FeedsController.saveOrUpdate failure....')
            });
        };
        
        var getAll = function(){
            // feedsService.getFeeds(function(response){
            //     console.log(response);
            //     $scope.feeds = response.feeds;

            // }, function(){
            //     console.log('FeedsController.getFeeds failure....')
            // });
            feeds.push('https://news.ycombinator.com/rss');
            feeds.push('http://rss.slashdot.org/Slashdot/slashdot');
            feeds.push('https://news.ycombinator.com/rss');
            feeds.push('http://rss.slashdot.org/Slashdot/slashdot');
            feeds.push('https://news.ycombinator.com/rss');
            feeds.push('http://rss.slashdot.org/Slashdot/slashdot');
            feeds.push('https://news.ycombinator.com/rss');
            feeds.push('http://rss.slashdot.org/Slashdot/slashdot');
            feeds.push('https://news.ycombinator.com/rss');
            feeds.push('http://rss.slashdot.org/Slashdot/slashdot');
            feeds.push('https://news.ycombinator.com/rss');
            feeds.push('http://rss.slashdot.org/Slashdot/slashdot');
            getFeedsFromGoogle();
        };
        
        var getFeedsFromGoogle = function(){
            for (var i=0; i<feeds.length;i++){
                var feed = new google.feeds.Feed(feeds[i]);
                feed.load(function(result) {
                    if (!result.error && result.feed) {
                      $scope.feedsData.push(result.feed);
                    }
                });
            }; 
            setTimeout(function(){
            console.log($scope.feedsData)
        }, 1000)
        };   
        
        getAll();

    }])
    .
    controller('WeatherController', ['$scope', 'weatherService', function($scope, weatherService) {
        console.log('WeatherController...');
            
            $scope.currentConditions = {};
            $scope.radarImage = null;
            $scope.position = {};
            $scope.showAlertsIcon = false;

            var getPosition = function(){
                if (navigator.geolocation){
                    navigator.geolocation.getCurrentPosition(function(pos){
                        getCurrentConditions(pos);
                        getAlerts(pos);
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
            
            $scope.getRadar = function(){
                console.log("WeatherController.getRadar Clicked...")
                var radarImage = weatherService.getRadarImage($scope.position);
                var src = '<img src="' + radarImage + '" />';
                $('.icon-cloud').popover({ placement:'bottom', content: src, html:true });
            };

            var getAlerts = function(position){
                weatherService.getAlerts(position, 
                    function(response){
                        if (response.alerts && response.alerts.length > 0){
                            $scope.showAlertsIcon = true;
                            $scope.alerts = response.alerts;
                            //TODO create a directive that will display the alert
                           // $('.icon-cloud').popover({ placement:'bottom', title: 'Radar', content: src, html:true });              
                        }
                    }, 
                    function(){})
            }

            getPosition();
            
            

    }]);














