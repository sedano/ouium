angular.module('ouium')

  .controller('AuthController', function (AuthService, $state, $ionicPopup, $ionicHistory, $ionicLoading, $scope) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    $scope.$on('$ionicView.enter', function (e) {
      // vm.user = {};
    });
    var vm = this;

    // Form data for the login view
    vm.login = function () {
      $ionicLoading.show({ hideOnStateChange: true });
      AuthService.login(vm.user).then(function (data) {
        console.log(data);
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
      AuthService.signup(vm.user).then(function (msg) {
        $ionicPopup.alert({
          title: 'User created!',
          template: msg
        }).then(function (res) {
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $state.go('app.details');
        });
      }, function (errMsg) {
        $ionicPopup.alert({
          title: 'Sign up failed!',
          template: errMsg
        });
      });
    };

    vm.updateProfile = function () {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('app.main');
    }
  })

