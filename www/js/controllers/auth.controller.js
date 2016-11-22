angular.module('ouium')

  .controller('AuthController', function (AuthService, $ionicPopup, $ionicLoading, $state) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    // $scope.$on('$ionicView.beforeEnter', function (e) {
    //   vm.user = $rootScope.isAuthenticated ? $rootScope.user : {};
    // });

    var vm = this;

    // Form data for the login view
    vm.login = function () {
      $ionicLoading.show({ hideOnStateChange: true});
      vm.user.email = vm.user.email.toLowerCase();
      AuthService.login(vm.user).then(function () {
        vm.closeLogin();
        $state.go('app.main', {}, {reload:true})
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
  });