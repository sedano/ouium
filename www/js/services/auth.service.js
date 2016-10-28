angular.module('ouium')
  .service('AuthService', function ($q, $http, $rootScope) {
    var LOCAL_TOKEN_KEY = 'ouium';
    var API_ENDPOINT = {
      url: 'http://ouium.herokuapp.com/auth'
    }
    $rootScope.isAuthenticated = false;
    var authToken;

    function loadUserCredentials() {
      var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
      if (token) {
        useCredentials(token);
      }
    }

    function storeUserCredentials(token) {
      window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
      useCredentials(token);
    }

    function useCredentials(token) {
      $rootScope.isAuthenticated = true;
      authToken = token;

      // Set the token as header for your requests!
      $http.defaults.headers.common.Authorization = authToken;
    }

    function destroyUserCredentials() {
      authToken = undefined;
      $rootScope.isAuthenticated = false;
      $http.defaults.headers.common.Authorization = undefined;
      window.localStorage.clear();
    }

    var signup = function (user) {
      return $q(function (resolve, reject) {
        $http.post(API_ENDPOINT.url + '/signup', user).then(function (result) {
          if (result.data.success) {
            resolve(result.data.msg);
          } else {
            reject(result.data.msg);
          }
        });
      });
    };

    var login = function (user) {
      return $q(function (resolve, reject) {
        $http.post(API_ENDPOINT.url + '/login', user).then(function (result) {
          if (result.data.success) {
            storeUserCredentials(result.data.token);
            resolve(result.data.msg);
          } else {
            reject(result.data.msg);
          }
        });
      });
    };

    var logout = function () {
      destroyUserCredentials();
    };

    loadUserCredentials();

    return {
      login: login,
      signup: signup,
      logout: logout,
      isAuthenticated: function () { return isAuthenticated; },
    };
  })

// .factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
//   return {
//     responseError: function (response) {
//       $rootScope.$broadcast({
//         401: AUTH_EVENTS.notAuthenticated,
//       }[response.status], response);
//       return $q.reject(response);
//     }
//   };
// })

// .config(function ($httpProvider) {
//   $httpProvider.interceptors.push('AuthInterceptor');
// });