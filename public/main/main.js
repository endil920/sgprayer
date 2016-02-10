
angular.module('sgPrayerApp')
.controller('MainCtrl', ['$routeParams', '$location', '$http', function($routeParams, $location, $http) {
	var view = this;

	view.group = $location.path().slice(1);
	var daysMap = {};
	view.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]; 
	view.days.forEach(function(day, index) {
		daysMap[day] = index + 1;
	});

	view.isGroupValid = function() {
		return view.group && view.group !== 'about';
	};

}]);
