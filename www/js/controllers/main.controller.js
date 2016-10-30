angular.module('ouium')

  .controller('MainController', function ($scope, $rootScope, $state, $ionicModal, $timeout, AuthService, UserService) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    $scope.$on("$ionicView.beforeEnter", function () {
      if ($rootScope.isAuthenticated)
        UserService.loadUserProfile().then(function (result) { });
    });

    var vm = this;
    vm.logout = function () {
      AuthService.logout();
    };

  })