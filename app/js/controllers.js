'use strict';

/* Controllers */

angular.module('controllers', []).
    controller('LinksController', ['$scope', 'linksService', function($scope, linksService) {
        console.log('LinksController...');
            
        $scope.links = [];


        var getAll = function(){
            linksService.getAll(function(response){
                console.log(response);
                $scope.links = response.links;
            }, function(){
                console.log('LinksController.getLinks failure....')
            });
        };

        getAll();
        
    }]).
    controller('FeedsController', ['$scope', 'feedsService', function($scope, feedsService) {
        console.log('FeedsController...');
            
        $scope.feeds = [];
        $scope.feed = {};

        var saveOrUpdate = function(){
            console.log('FeedsControll.saveOrUpdate...')
            console.log($scope.feed);
            var request = { feed: $scope.feed };

            feedsService.saveOrUpdate(request, function(response){

            }, 
            function(){
                console.log('FeedsController.saveOrUpdate failure....')
            });
        }
        
        var getAll = function(){
            feedsService.getFeeds(function(response){
                console.log(response);
                $scope.feeds = response.feeds;
            }, function(){
                console.log('FeedsController.getFeeds failure....')
            });
        };
        


    }]);