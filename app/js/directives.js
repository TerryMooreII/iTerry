'use strict';

/* Directives */


angular.module('myApp.directives', [])

.directive('tlmiiScrollTop', function(){
	return {
		restrict: 'AEC',
		link: function(scope, element, attrs){
			$(element).on('click', function(){
				if (attrs.tlmiiScrollTop)
				$(attrs.tlmiiScrollTop).scrollTop(0);
			});
		}
	}
})	