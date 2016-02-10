
angular.module('sgPrayerApp')
.controller('UpdateCtrl', ['$routeParams', '$http', 'SummaryDispatcher', function($routeParams, $http, SummaryDispatcher) {
	var view = this;
	view.group = $routeParams.group;
	view.submitting = false;
	view.submit = function() {
		if(view.message) {
			console.log('submitting ' + view.name + ', ' + view.message);

			SummaryDispatcher.updateDataEvent.onNext({name: view.name, message: view.message, local: true});

			view.submitting = true;
			$http.post('/addrequest/' + view.group, {name: view.name, message: view.message}).then(function(success) {

				socket.emit('requestSubmit',
					{name: view.name, message: view.message});
				view.name = '';
				view.message = '';
				view.confirmation = 'Submitted!';
				view.errorMsg = '';
				view.submitting = false;

			}
			, function(error) {
				view.confirmation = '';
				view.errorMsg = 'request failed to submit. Please try again.';
				console.log('did fail with message ' + error);
				view.submitting = false;
			});
		}
	};
	view.isBlank = function() {
		return view.message === '' && view.name ==='';
	};
}])
.directive('addModule', function() {
	return {
		restrict: 'E',
scope: {
	modalId: '@'
},
bindToController: true,
controller: 'UpdateCtrl',
controllerAs: 'updateCtrl',
templateUrl: 'add/add.html'

};
});
