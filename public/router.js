'use strict';

angular.module('sgPrayerApp', ['ngRoute'])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
$routeProvider
.when('/', {
	templateUrl: './register/register.html',
	controller: 'RegisterCtrl',
	controllerAs: 'regCtrl'
})
.when('/about', {
	templateUrl: './views/about.html'
})
.when('/:group', {
	templateUrl: './main/main.html',
	controller: 'MainCtrl',
	controllerAs: 'mainCtrl'

})
.otherwise({
redirectTo: './main/main.html'
});
$locationProvider.html5Mode(true);
}]);
