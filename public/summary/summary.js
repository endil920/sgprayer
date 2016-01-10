
angular.module('sgPrayerApp')
.controller('SummaryCtrl', ['$routeParams', '$http', '$rootScope', function($routeParams, $http, $rootScope) {
	var view = this;
	var group = $routeParams.group;
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth();
	var day = date.getDate();

	$http.get('/requestsPreviousWeek/' + group + '/year/' + year 
		+ '/month/' + month + '/day/' + day).then(function(response) {

		view.summaryData = response.data; 
		view.requests = view.summaryData.requests;
		view.startDate = view.summaryData.startDate;
		console.log(view.requests);
		console.log('those were the requests');
		window.requests = view.requests;

		view.endDate = view.summaryData.endDate;
		console.log('the start date should be ' + view.startDate);	
		console.log('the end date should be ' + view.endDate);
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
