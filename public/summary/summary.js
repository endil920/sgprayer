
angular.module('sgPrayerApp')
.controller('SummaryCtrl', ['$routeParams', '$http', function($routeParams, $http) {
	var view = this;
	var group = $routeParams.group;
	$http.get('/requestsPreviousWeek/' + group).then(function(response) {
		view.summaryData = response.data; 
		view.requests = view.summaryData.requests;
		view.startDate = view.summaryData.startDate;
		view.endDate = view.summaryData.endDate;
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
