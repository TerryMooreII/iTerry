'use strict';

/* Services */

var WEB_SERVICE_URL = 'http://localhost/home/api/index.php';

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

        
        linksService.saveOrUpdate = function(request, onSuccess, onFailure){
            $http.post(WEB_SERVICE_URL + '/links')
                .onSuccess(onSuccess).onFailure(onFailure);
        }

        linksService.delete = function(id, onSuccess, onFailure){
            $http.delete(WEB_SERVICE_URL + '/links/' + id)
                .onSuccess(onSuccess).onFailure(onFailure);
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
            $http.post(WEB_SERVICE_URL + '/feeds')
                .onSuccess(onSuccess).onFailure(onFailure);
        }

        feedsService.delete = function(id, onSuccess, onFailure){
            $http.delete(WEB_SERVICE_URL + '/feeds/' + id)
                .onSuccess(onSuccess).onFailure(onFailure);
        }

        return feedsService;

    }]);
