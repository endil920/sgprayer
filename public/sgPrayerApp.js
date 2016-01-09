'use strict';

angular.module('sgPrayerApp', ['ngRoute'])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
	.when('/', {
		templateUrl: './views/main.html'
	})
	.when('/:group/update', {
		template: '<add-module></add-module>',
		
	
	})
	.when('/:group/summary', {
		templateUrl: './views/main.html'
	})
	.when('/about', {
		templateUrl: './views/about.html'
	})
	.when('/:group', {
		templateUrl: './views/main.html'
	})
	.otherwise({
		redirectTo: './views/main.html'
	});
	$locationProvider.html5Mode(true);
}]);
