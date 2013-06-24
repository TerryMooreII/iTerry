'use strict';


// Declare app level module which depends on filters, and services
angular.module('home', ['myApp.filters', 'services', 'myApp.directives', 'controllers', '$strap.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/index.html', {templateUrl: 'partials/list.html', controller: 'LinksController'});
    $routeProvider.otherwise({redirectTo: '/index.html'});
  }]);
