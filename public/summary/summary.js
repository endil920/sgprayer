
angular.module('sgPrayerApp')
.controller('SummaryCtrl', ['$routeParams', '$http', '$rootScope', function($routeParams, $http, $rootScope) {
	var view = this;
	var group = $routeParams.group;
	$http.get('/requestsPreviousWeek/' + group).then(function(response) {
		console.log(response);
		view.summaryData = response.data; 
		view.requests = view.summaryData.requests;
		view.startDate = view.summaryData.startDate;
		view.endDate = view.summaryData.endDate;
		console.log(view.requests);
		socket.emit('join', group);
	});	
	view.group = $routeParams.group;
	socket.on('addRequest', function(data) {
		console.log('hey there');
		view.requests.push(data);
		console.log(view.requests);
		$rootScope.$digest();
	});

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
