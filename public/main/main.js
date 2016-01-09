
angular.module('sgPrayerApp')
.controller('MainCtrl', ['$routeParams', '$location', '$http', function($routeParams, $location, $http) {
	var view = this;

	view.group = $location.path().slice(1);
	var daysMap = {};
	view.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]; 
	view.days.forEach(function(day, index) {
		daysMap[day] = index + 1;
	});
	console.log(daysMap);
	view.submit = function() {
		$http.post("/addgroup", {group: view.newGroupName, meetingDay: daysMap[view.day]}).then(function(message) {
			console.log(message);
			if (message) {
				view.msg = "Group " + view.newGroupName + " successfully registered. You meet on " + view.day + "s.";
			} else {
				view.msg = "it looks like that group already exists!";
			}
			view.lnk = "/" + view.newGroupName;
			view.day = '';
			view.newGroupName = '';

		});
	}
}]);
