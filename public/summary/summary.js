
angular.module('sgPrayerApp')
.controller('SummaryCtrl', ['$routeParams', '$http', function($routeParams, $http) {
	var view = this;
	var group = $routeParams.group;
	$http.get('/requestsPreviousWeek/' + group).then(function(response) {
		view.requests = response.data; 
		console.log(view.requests);
	});	
	view.group = $routeParams.group;

}])
.directive('requestsSummary', function() {
	return {
		restrict: 'E',
bindToController: true,
controller: 'SummaryCtrl',
controllerAs: 'summaryCtrl',
templateUrl: 'summary/summary.html'
	};
});
