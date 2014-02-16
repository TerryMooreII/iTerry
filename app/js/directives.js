'use strict';

/* Directives */


angular.module('myApp.directives', [])

.directive('hide', function(){
	return {
		restrict: 'AEC',
		link: function(scope, element, attrs){
			$(element).hide();
		}
	}
})