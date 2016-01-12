
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
	view.submit = function() {
		$http.post("/addgroup", {group: view.newGroupName, meetingDay: daysMap[view.day]}).then(function(response) {

			if (response.data) {
				view.confirmation = "Group " + view.newGroupName + " registered at " + "www.church.longlined.com/" + window.encodeURIComponent(view.newGroupName);
				view.msg = false;
				view.lnk = "/" + view.newGroupName;
			} else {
				view.msg = "it looks like that group already exists!";
				view.confirmation = false;
			}

			view.day = '';
			view.newGroupName = '';

		});
	}
}]);
