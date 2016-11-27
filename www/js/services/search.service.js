angular.module('ouium')
  .service('SearchService', function ($q, $http) {
    var API_ENDPOINT = {
      url: 'http://ouium.herokuapp.com/search'
      // url: 'http://localhost:8100/search'
    }

    var searchNear = function (query, auth) {
      var route = auth ? "/auth" : "/";
      return $q(function (resolve, reject) {
        $http.post(API_ENDPOINT.url + route, query).then(function (result) {
          if (result.data.success) {
            resolve(result.data.results);
          } else {
            reject(result.data.msg);
          }
        });
      });
    };

    return {
      searchNear: searchNear
    };
  })