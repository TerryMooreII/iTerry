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

.directive('tlmiiAdd', function(){
	return {
		restrict: 'AEC',
		link: function(scope, element, attrs){
			var $self = $(element);
			var $form = $self.next('form');

			$(element).on('click', function(){
				var $this = $(this);
				//$this.hide();
				$form.show();
				
			});

			$(document).on('mouseup', function(e){
			    var container = $form;

			    if (!container.is(e.target)
			        && container.has(e.target).length === 0){
			        $self.show();
			        $form.hide();
			    }
			});
		}
	}	
})	

.directive('tlmiiCollapsed', function(){
	return {
		restrict: 'AEC',
		link: function(scope, element, attrs){
			$(element).on('click', function(){
				var $this = $(this);
				var $icon = $this.children('i').first();

				$(".folder").each(function(){
					var $this = $(this);
					var $icon = $this.children('i').first();
					$this.next('ul').hide();
					$icon.addClass('icon-chevron-right');
					$icon.removeClass('icon-chevron-down');
					attrs.tlmiiCollapsed = "true";
				})

				$this.next('ul').show();
				$icon.removeClass('icon-chevron-right');
				$icon.addClass('icon-chevron-down');
				attrs.tlmiiCollapsed = "false";
			});
		}
	}
})	


