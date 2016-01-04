'use strict';

angular.module('sgPrayerApp', ['ngRoute'])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
	.when('/', {
		templateUrl: '/main'
	})
	.when('/update/:group', {
		templateUrl: '/views/update',
		controller: 'UpdateCtrl',
		controllerAs: 'updateCtrl'
	})
	.when('/summary/:group', {
		templateUrl: '/main'
	})
	.when('/:group', {
		templateUrl: '/main'
	});
	$locationProvider.html5Mode(true);
}]);
