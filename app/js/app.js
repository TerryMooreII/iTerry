'use strict';


// Declare app level module which depends on filters, and services
angular.module('home', ['myApp.filters', 'services', 'myApp.directives', 'controllers', '$strap.directives', 'ngDragDrop']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/index.html', {templateUrl: 'partials/feeds.html', controller: 'ReaderController'});
    $routeProvider.when('/modify-feeds.html', {templateUrl: 'partials/modify-feeds.html', controller: 'FeedsController'});
    $routeProvider.otherwise({redirectTo: '/index.html'});
  }])
  .factory('MyUtil', function() {
    return {
        getFavicon: function(str1, err) {
	       if (str1 !== null && str1 !== '' && str1 !== undefined){
        		var url = str1.split('/');
				return url[0] + '//' + url[2] + '/favicon.ico';
        	}    
        	return err;
        }, 
        formatDate: function(date){
        	if (date !== null && date !== undefined){
        		var arr = date.split('-');
        		return arr[0];
        	}	
        	return date;
        }
    }
});