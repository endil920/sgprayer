
angular.module('sgPrayerApp')
    .controller('RegisterCtrl', ['$routeParams', '$location', '$http', function($routeParams, $location, $http) {
        var view = this;

        view.group = $location.path().slice(1);
        var daysMap = {};
        view.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        view.days.forEach(function(day, index) {
            daysMap[day] = index + 1;
        });

        view.submit = function() {
            var groupName = view.newGroupName.toLowerCase().replace(/\s/g, "-");
            $http.post("/addgroup", {group: groupName, meetingDay: daysMap[view.day]}).then(function(response) {

                if (response.data) {
                    view.confirmation = "Group " + view.newGroupName + " registered at " + window.location.host + "/" + window.encodeURIComponent(groupName);
                    view.msg = false;
                    view.lnk = "/" + groupName;
                } else {
                    view.msg = "it looks like that group already exists!";
                    view.confirmation = false;
                }

                view.day = '';
                view.newGroupName = '';

            });
        }
	view.isBlank = function() {return !view.day || !view.newGroupName;};
    }]);
