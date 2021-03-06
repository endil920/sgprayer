
angular.module('sgPrayerApp')
.factory('SummaryStore', ['$routeParams', 'SummaryDispatcher', '$rootScope', function($routeParams, SummaryDispatcher, $rootScope) {
  function Store(dispatcher) {
    var view = this;
    view.current = true;
    view.loading = true;
    view.group = $routeParams.group;

    dispatcher.loadedEvent.subscribe(function() {
      view.loading = false;
    });

    dispatcher.dataEvent.subscribe(function(data) {
      view.summaryData = data.summaryData;
      view.requests = data.requests;
      view.startDate = data.startDate;
      view.endDate = data.endDate;
    });

    dispatcher.updateDataEvent.subscribe(function(newData) {
      view.requests.push(newData);
      if (!newData.local) {
        $rootScope.$digest();
      }
    });

    dispatcher.prayForEvent.subscribe(function(wrappedId) {
      view.requests.filter(function(r) {
        return r._id === wrappedId.id;
      }).map(function(r) {
        r.prayedCount = r.prayedCount == null ? 1 : r.prayedCount + 1;
        if (wrappedId.reRender) {
          $rootScope.$digest();
        }
      });
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
  var loadedEvent = new Rx.Subject();
  var dataEvent = new Rx.Subject();
  var updateDataEvent = new Rx.Subject();
  var prayForEvent = new Rx.Subject();
  var currentEvent = new Rx.Subject();
  return {
    loadedEvent: loadedEvent,
    dataEvent: dataEvent,
    updateDataEvent: updateDataEvent,
    currentEvent: currentEvent,
    prayForEvent: prayForEvent
  }
})
.service('checkGroup', ['$q', '$http', function($q, $http) {
  return {
    check: function(group) {
      var deferred = $q.defer();
      $http.get('/groups/' + group).then(function(response) {
        if (response.data) {
          deferred.resolve(response.data);
        } else {
          deferred.reject(response.data);
        }
      });
      return deferred.promise;
    }
  };
}])
.service('getRequests', ['$http', 'SummaryDispatcher', function($http, SummaryDispatcher) {
  return  {
    fetch: function(base, group, date) {
      var year = date.getFullYear();
      var month = date.getMonth();
      var day = date.getDate();
console.log("year: " + year + ", month: " + month + ", day: " + day);
      $http.get('/' + base + '/' + group + '/year/' + year
                + '/month/' + month + '/day/' + day).then(function(response) {
                console.log(response.data);
console.log('that is the data from the response for getting pqs');
        SummaryDispatcher.loadedEvent.onNext();
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
               , 'checkGroup'
               , 'getRequests'
               , 'SummaryDispatcher'
               , 'SummaryStore'
               , function($routeParams, $http, checkGroup, getRequests, SummaryDispatcher, SummaryStore) {

                 var view = this;
                 var group = $routeParams.group;
                 var date = new Date();

                 view.store = SummaryStore.create(SummaryDispatcher);

                 checkGroup.check(group).then(function() {

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

                   view.prayFor = function(request) {
                     $http.post('/prayfor/' + request._id);
                     socket.emit('prayFor', request._id);
                   };

                   socket.on('addRequest', function(data) {
                     SummaryDispatcher.updateDataEvent.onNext(data);
                   });

                   socket.on('prayFor', function(id) {
                     SummaryDispatcher.prayForEvent.onNext({id: id, reRender: true});
                   });

                 }, function() {
                   console.log('rejected!!');
                   SummaryDispatcher.loadedEvent.onNext();
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
      author: '=',
      prayFor: '&',
      count: '='
    },
    templateUrl: 'summary/request-box.html',
    transclude: true
  };
});
