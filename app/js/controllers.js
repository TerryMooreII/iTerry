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
        $scope.feeds = {};
        $scope.feed = {};
        $scope.categories;
        $scope.newCategory;

        var FEEDS_CACHE = 'feeds-cache';

        $scope.init = function(){
            $scope.getAll();
            $scope.getCategories();
        }

        $scope.getAll = function(){
            console.log('FeedsController.getAll...');
            
            feedsService.getAll(function(response){
                $scope.feeds = response.feeds;
                getFeedsFromGoogle();
            
            }, function(){
                console.log('FeedsController.getFeeds failure....')
            });

        };

        $scope.getCategories = function(){
            categoryService.get(function(response){
                    console.log('FeedsdController.getCategories Getting categories.')
                    $scope.categories = response.categories;
                }, 
                function(){
                    console.log('ModifyFeedsdController.getCategories Getting categories failed.')
                })
        }


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
            var feeds = $scope.feeds;
            
            for (var i=0; i<feeds.length;i++){
                var feed = new google.feeds.Feed(feeds[i].url);
                feed.load(callback(feeds[i]));
            }; 
        };   
        
        var callback = function(feed) {
            return function(result) {
                if (!result.error && result.feed) {
                    result.feed.db = feed;
                    $scope.feedsData.push(result.feed);
                    var feedsCache = {};
                    feedsCache.feedsData = $scope.feedsData
                    localStorageService.saveItem(FEEDS_CACHE, feedsCache, true);
                }
            };
        }
        

        $scope.toStringSort = function(arg) {
            return "" + arg.position;
        };

        $scope.$watch('feedsData', function(feedsData){   
            var result = $filter('orderBy')(feedsData, function(arg) {
                return ""+arg.position;
            });
            result = group(result, 3);
            result.sort()
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

        $scope.addCategory = function(){
            console.log('ModifyFeedsdController.addCategory...');
            console.log("New Category Name: " + $scope.newCategory)

            if (!$scope.newCategory)
                return;

            categoryService.add($scope.newCategory,
                function(response){
                    $scope.init();
                    $scope.newCategory = null;
                }, function(response){
                    console.log('ModifyFeedsdController.addCategory failure....')
                    console.log(response);
                });

        };

        $scope.updateFeedCategory = function(feedId, categoryId){
            console.log('Feed Id: ' + feedId);
            console.log('Category Id: ' + categoryId);

            var request = {
                feedId:feedId, 
                categoryId: categoryId
            }

            feedsService.update(request, function(response){
                //$scope.feeds = response.feeds;
            
            }, function(){
                console.log('ModifyFeedsdController.getFeeds failure....')
            });
        }

    }]).
    controller('ReaderController', ['$scope', 'readerService', '$filter', 'localStorageService', 'categoryService', '$timeout', 'MyUtil',
     function($scope, readerService, $filter, localStorageService, categoryService, $timeout, MyUtil) {

        console.log("Controllers.ReaderController Starting...");

        $scope.feedUrl = '';
        $scope.message = '';
        $scope.feeds = [];
        $scope.feedData = null;
        var categories = [];


        $scope.MyUtil = MyUtil;

        var getAll = function(){
            console.log('ReaderController.getAll...');
            
            readerService.getAll(function(response){
                
                $scope.feeds = _.groupBy(response.feeds, 'category');
                console.log($scope.feeds)

            }, function(){
                console.log('ReaderController.getFeeds failure....')
            });

        };

        $scope.showFeedSummary = function(feedUrl){
            readerService.getFeedFromGoogle(feedUrl, function(json){
                console.log(json);
                if (!json || json.responseStatus !== 200)
                    return;

                $scope.feedData = json.responseData.feed;
            })
        };

        $scope.showFullStory = function(entry){
            $scope.story = entry;

            addTweetBtn();
        }

        //this needs to turn to a directive
        var addTweetBtn = function(){
            $('#tweet').empty().addClass('tweet-btn');

            new twttr.widgets.createShareButton(
                $scope.story.link,
                $('#tweet')[0],
                function(el) {}, {
                    count: 'none',
                    text: $scope.story.title
                }
            );
            
        }

        $scope.confirmDelete = function(id, type){
            if (type === undefined)
                return

            var type = type.toLowerCase();

            var ask = confirm('Delete '+ type +'?');
            if (ask){
                if (type === 'category')
                    $scope.removeCategory(id);
                else
                    $scope.removeFeed(id);
            }   
        }


        $scope.removeCategory = function(id){

            categoryService.delete(id, function(){
                getAll();
            }, function(){

            });
        };

        $scope.removeFeed = function(id){

            readerService.delete(id, function(){
                getAll();
            }, function(){

            });
        };

        $scope.addFeed = function(){
            readerService.getFeedFromGoogle($scope.feedUrl, function(json){
                if (json === null || json.responseStatus !== 200 ){
                    $timeout(function(){$scope.message = 'Invalid Feed Url';}, 1000);
                    return;
                }
                var feed = json.responseData.feed;
                var request = {
                    title: feed.title,
                    url: feed.link,
                    feedUrl: feed.feedUrl
                };

                readerService.add(request, function(data){
                    $scope.feedUrl = '';
                    getAll();   
                }, 
                function(data){
                    $timeout(function(){$scope.message = 'Error adding Feed.'}, 1000);
                    console.log('Error %o', data);
                });
            }, 
            function(){
                $scope.message = 'Unable to get feed.'
            });
        };
      
        $scope.dropSuccessHandler = function($event,index,array){
            console.log('success handler')
            //array.splice(index,1);
        };
        
        $scope.onDrop = function($event,$data,categoryTitle){

            var categoryId =  $scope.getCategoryId(categoryTitle);
            readerService.update({feedId:$data.id, categoryId:categoryId}, 
                function(){
                    getAll();
                })  
        };

        var getCategories = function(){
            categoryService.get(function(data){
                categories = _.indexBy(data.categories, 'title');
            })
        }

        $scope.getCategoryId = function(title){
            return categories[title].category_id;
        }

        $scope.addCategory = function(){
            console.log('ModifyFeedsdController.addCategory...');
            console.log("New Category Name: " + $scope.category)

            if (!$scope.category)
                return;

            categoryService.add($scope.category,
                function(response){
                    $scope.category = null;
                    getAll();
                    getCategories();
                }, function(response){
                    console.log('ReaderController.addCategory failure....')
                    console.log(response);
                });

        };

        getAll();
        getCategories();

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
                console.log("WeatherController.getRadar...");
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
                            $scope.alerts = response;
                            $scope.alerts.showAlertsIcon = true;
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
    }])
 ;














