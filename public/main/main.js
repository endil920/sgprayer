
angular.module('sgPrayerApp')
.controller('MainCtrl', ['$routeParams', '$location', function($routeParams, $location) {
	var view = this;
	view.group = $location.path().slice(1);
}]);
