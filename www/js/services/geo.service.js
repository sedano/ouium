angular.module('ouium')
  .service('GeoService', function ($q, $rootScope) {

    var options = { timeout: 10000, enableHighAccuracy: true };

    var getCurrentPosition = function () {
      var q = $q.defer();

      navigator.geolocation.getCurrentPosition(function (result) {
        q.resolve(result);
      }, function (err) {
        q.reject(err);
      }, options);

      return q.promise;
    }


    return {
      getCurrentPosition: getCurrentPosition
    };
  })