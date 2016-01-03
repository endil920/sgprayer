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
		templateUrl: '/views/summary',
		controller: 'SummaryCtrl',
		controllerAs: 'summaryCtrl'
	});
	$locationProvider.html5Mode(true);
}])
.controller('MainCtrl', ['$routeParams', '$location', function($routeParams, $location) {
	var view = this;
	view.group = $location.path().slice(1);
}])
.controller('UpdateCtrl', ['$routeParams', '$http', function($routeParams, $http) {
	var view = this;
	view.group = $routeParams.group;
	view.submit = function() {
		console.log('submitting ' + view.name + ', ' + view.message);
		$http.post('/addrequest/' + view.group, {name: view.name, message: view.message}).then(function(success) {
			view.name = '';
			view.message = '';
		}, function(error) {
			console.log('did fail with message ' + error);	
		});
	};
}])
.controller('SummaryCtrl', ['$routeParams', '$http', function($routeParams, $http) {
	var view = this;
	var group = $routeParams.group;
	$http.get('/requestsPreviousWeek/' + group).then(function(response) {
		view.requests = response.data; 
		console.log(view.requests);
	});	
	view.group = $routeParams.group;

}]);
