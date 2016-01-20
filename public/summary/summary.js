
angular.module('sgPrayerApp')
.controller('SummaryCtrl', ['$routeParams', '$http', '$rootScope', 'getRequests', function($routeParams, $http, $rootScope, getRequests) {
    var view = this;
    var group = $routeParams.group;
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();

    view.current = true;

    getRequests.fetch('requestsThisWeek', group, year, month, day, view);	
    socket.emit('join', group);
    view.showLast = function() {
        getRequests.fetch('requestsLastWeek', group, year, month, day, view);	
        view.current = false;
        socket.emit('leave', group);
    };	

    view.showCurrent = function() {
        getRequests.fetch('requestsThisWeek', group, year, month, day, view);	
        view.current = true;
        socket.emit('join', group);
    };	

    view.group = $routeParams.group;
    socket.on('addRequest', function(data) {
        console.log('hey there');
        view.requests.push(data);
        console.log(view.requests);
        $rootScope.$digest();
    });

}])
.service('getRequests', ['$http', function($http) {
    return  {
        fetch: function(base, group, year, month, day, view) {
                   $http.get('/' + base + '/' + group + '/year/' + year 
                       + '/month/' + month + '/day/' + day).then(function(response) {

                       view.summaryData = response.data; 
                       view.requests = view.summaryData.requests;
                       view.startDate = view.summaryData.startDate;
                       view.endDate = view.summaryData.endDate;
                       console.log('the start date should be ' + view.startDate);	
                       console.log('the end date should be ' + view.endDate);

                   });	
               }
    }

}])
.directive('requestsSummary', function() {
    return {
        restrict: 'E',
bindToController: true,
controller: 'SummaryCtrl',
controllerAs: 'summaryCtrl',
templateUrl: 'summary/summary.html'
    };
})
.directive('requestBox', function() {
    return {
        scope: {
                   author: '='
               },
        templateUrl: 'summary/requestBox.html',
        transclude: true
    };
});
