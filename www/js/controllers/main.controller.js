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
      vm.go('app.main')
    };

    vm.login = function () {
      $scope.modal.show();
    };

    vm.go = function (state) {
      $state.go(state);
    };

    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });

    vm.closeLogin = function () {
      $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
      // Execute action
    });

  })