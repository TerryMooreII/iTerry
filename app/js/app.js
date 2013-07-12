'use strict';


// Declare app level module which depends on filters, and services
angular.module('home', ['myApp.filters', 'services', 'myApp.directives', 'controllers', '$strap.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/index.html', {templateUrl: 'partials/feeds.html', controller: 'FeedsController'});
    $routeProvider.when('/modify-feeds.html', {templateUrl: 'partials/modify-feeds.html', controller: 'FeedsController'});
    $routeProvider.otherwise({redirectTo: '/index.html'});
  }]);
