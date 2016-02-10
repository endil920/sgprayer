
angular.module('sgPrayerApp')
.factory('SummaryStore', ['$routeParams', 'SummaryDispatcher', '$rootScope', function($routeParams, SummaryDispatcher, $rootScope) {
  function Store(dispatcher) {
    var view = this;
    view.current = true;

    view.group = $routeParams.group;

    dispatcher.dataEvent.subscribe(function(data) {
      view.summaryData = data.summaryData;
      view.requests = data.requests;
      view.startDate = data.startDate;
      view.endDate = data.endDate;
    });

    dispatcher.updateDataEvent.subscribe(function(newData) {
      view.requests.push(newData);
      console.log(newData);
      if (!newData.local) {
        $rootScope.$digest();
      }
    });

    dispatcher.currentEvent.subscribe(function(isCurrent) {
      view.current = isCurrent;
    });

  }
  return {
    create: function(dispatcher) {
      return new Store(dispatcher);
    }
  }
}])
.factory('SummaryDispatcher', function() {
  var dataEvent = new Rx.Subject();
  var updateDataEvent = new Rx.Subject();
  var currentEvent = new Rx.Subject();
  return {
    dataEvent: dataEvent,
    updateDataEvent: updateDataEvent,
    currentEvent: currentEvent
  }
})
.service('getRequests', ['$http', 'SummaryDispatcher', function($http, SummaryDispatcher) {
  return  {
    fetch: function(base, group, date) {
      var year = date.getFullYear();
      var month = date.getMonth();
      var day = date.getDate();

      $http.get('/' + base + '/' + group + '/year/' + year
                + '/month/' + month + '/day/' + day).then(function(response) {

        SummaryDispatcher.dataEvent.onNext({
          summaryData: response.data
          , requests: response.data.requests
          , startDate: response.data.startDate
          , endDate: response.data.endDate
        });
      });
    }
  }
}])
.controller('SummaryCtrl'
            , ['$routeParams'
               , '$http'
               , 'getRequests'
               , 'SummaryDispatcher'
               , 'SummaryStore'
               , function($routeParams, $http, getRequests, SummaryDispatcher, SummaryStore) {

                 var view = this;
                 var group = $routeParams.group;
                 var date = new Date();

                 view.store = SummaryStore.create(SummaryDispatcher);

                 getRequests.fetch('requestsThisWeek', group, date);

                 socket.emit('join', group);

                 view.showLast = function() {
                   getRequests.fetch('requestsLastWeek', group, date);

                   SummaryDispatcher.currentEvent.onNext(false);

                   socket.emit('leave', group);
                 };

                 view.showCurrent = function() {
                   getRequests.fetch('requestsThisWeek', group, date);

                   SummaryDispatcher.currentEvent.onNext(true);
                   socket.emit('join', group);
                 };

                 socket.on('addRequest', function(data) {
                   SummaryDispatcher.updateDataEvent.onNext(data);
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
})
.directive('requestBox', function() {
  return {
    scope: {
      author: '='
    },
    templateUrl: 'summary/request-box.html',
    transclude: true
  };
});
