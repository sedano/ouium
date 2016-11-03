// Ionic Ouium App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'ouium' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'ouium.controllers' is found in controllers.js
angular.module('ouium', ['ionic'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'MainController',
        controllerAs: 'MainCtrl'
      })

      .state('app.main', {
        url: '/main',
        views: {
          'menuContent': {
            templateUrl: 'templates/main.html'
          }
        }
      })

      .state('app.login', {
        url: '/login',
        views: {
          'menuContent': {
            templateUrl: 'templates/login.html',
            controller: 'AuthController',
            controllerAs: 'AuthCtrl'
          }
        }
      })

      .state('app.signup', {
        url: '/signup',
        views: {
          'menuContent': {
            templateUrl: 'templates/signup.html',
            controller: 'AuthController',
            controllerAs: 'AuthCtrl'
          }
        }
      })

      .state('app.search', {
        url: '/search',
        views: {
          'menuContent': {
            templateUrl: 'templates/search.html',
            controller: 'SearchController',
            controllerAs: 'SearchCtrl'
          }
        }
      })

      .state('app.profile', {
        url: '/profile',
        views: {
          'menuContent': {
            templateUrl: 'templates/profile.html',
            controller: 'AuthController',
            controllerAs: 'AuthCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/main');
  })

  .filter('capitalize', function () {
    return function (input) {
      if (isNaN(input)) {
        var splitInput = input.toLowerCase().split(' ');
        for (let i = 0; i < splitInput.length; i++) {
          splitInput[i] = splitInput[i].charAt(0).toUpperCase() + splitInput[i].substring(1);
        }
        return splitInput.join(' ');
      } else {
        return input;
      }
    }
  });
