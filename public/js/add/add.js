
angular.module('sgPrayerApp')
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
}]);
