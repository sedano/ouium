angular.module('ouium')

  .controller('AuthController', function (AuthService, $state, $ionicPopup, $ionicHistory, $scope) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    $scope.$on('$ionicView.enter', function (e) {
      vm.user = {};
    });
    var vm = this;

    // Form data for the login view
    vm.login = function () {
      AuthService.login(vm.user).then(function (msg) {
        $ionicHistory.goBack();
      }, function (errMsg) {
        $ionicPopup.alert({
          title: 'Login failed!',
          template: errMsg
        });
      });
    };

    // Form data for the signup view
    vm.signup = function () {
      AuthService.signup(vm.user).then(function (msg) {
        $ionicPopup.alert({
          title: 'User created!',
          template: msg
        }).then(function (res) {
          vm.login();
        });
      }, function (errMsg) {
        $ionicPopup.alert({
          title: 'Sign up failed!',
          template: errMsg
        });
      });
    };
  })

