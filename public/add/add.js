
angular.module('sgPrayerApp')
.controller('UpdateCtrl', ['$routeParams', '$http', function($routeParams, $http) {
	var view = this;
	view.group = $routeParams.group;
	view.submit = function() {
		console.log('submitting ' + view.name + ', ' + view.message);
		$http.post('/addrequest/' + view.group, {name: view.name, message: view.message}).then(function(success) {

			socket.emit('requestSubmit', 
				{name: view.name, message: view.message});
			view.name = '';
			view.message = '';
			view.confirmation = 'your request has been submitted. click on weekly requests to view all';
			view.errorMsg = '';
		}, function(error) {
			view.confirmation = '';
			view.errorMsg = 'request failed to submit. Please try again.';
			console.log('did fail with message ' + error);	
		});
	};
	view.isBlank = function() {
		return view.message === '' && view.name ==='';
	};
}]);
