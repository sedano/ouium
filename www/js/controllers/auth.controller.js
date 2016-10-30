angular.module('ouium')

  .controller('AuthController', function (AuthService, UserService, $state, $rootScope, $ionicPopup, $ionicHistory, $ionicLoading, $scope) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    $scope.$on('$ionicView.beforeEnter', function (e) {
      vm.user = $rootScope.isAuthenticated ? $rootScope.user : {};
    });
    var vm = this;

    // Form data for the login view
    vm.login = function () {
      $ionicLoading.show({ hideOnStateChange: true });
      AuthService.login(vm.user).then(function () {
        $ionicHistory.goBack();
      }, function (err) {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: 'Login failed!',
          template: err
        });
      });
    };

    // Form data for the signup view
    vm.signup = function () {
      $ionicLoading.show({ hideOnStateChange: true });
      AuthService.signup(vm.user).then(function (msg) {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: 'User created!',
          template: msg
        }).then(function (res) {
          vm.login()
        });
      }, function (err) {
        $ionicPopup.alert({
          title: 'Sign up failed!',
          template: err
        });
      });
    };

    vm.updateProfile = function (user) {
      UserService.updateUserProfile(user).then(function (msg) {
        $ionicPopup.alert({
          title: 'Profile updated!',
          template: msg
        }).then(function (res) {
          $ionicHistory.goBack();
        });
      }, function (err) {
        $ionicPopup.alert({
          title: 'Profile update failed!',
          template: err
        });
      });
    }

  });