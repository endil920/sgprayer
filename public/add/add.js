
angular.module('sgPrayerApp')
.controller('UpdateCtrl', ['$routeParams', '$http', 'SummaryDispatcher', function($routeParams, $http, SummaryDispatcher) {
	var view = this;
	view.group = $routeParams.group;
	view.submitting = false;
	view.submit = function() {
		if(view.message) {

			view.submitting = true;
			$http.post('/addrequest/' + view.group, {name: view.name, message: view.message}).then(function(content) {
				socket.emit('requestSubmit',
                    {name: content.data.name, message: content.data.message, _id: content.data._id});
				view.name = '';
				view.message = '';
				view.confirmation = 'Submitted!';
				view.errorMsg = '';
				view.submitting = false;

			}
			, function(error) {
				view.confirmation = '';
				view.errorMsg = 'request failed to submit. Please try again.';
				view.submitting = false;
			});
		}
	};
	view.isBlank = function() {
		return !view.message || !view.name;
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
