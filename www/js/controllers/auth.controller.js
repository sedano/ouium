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
    vm.login = function (popup, nextState) {
      $ionicLoading.show({ hideOnStateChange: true, duration: 3000 });
      vm.user.email = vm.user.email.toLowerCase();
      AuthService.login(vm.user).then(function () {
        vm.user.password = "";
        if (popup) {
          vm.closeLogin();
          $state.go($state.current, {}, { reload: true })
        }
        $state.go(nextState || 'app.main', {}, { reload: true })
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
      $ionicLoading.show({ hideOnStateChange: true, duration: 3000 });
      AuthService.signup(vm.user).then(function (msg) {
        $ionicLoading.hide();
        // A confirm dialog
        $ionicPopup.confirm({
          title: 'User Created',
          template: 'Do you want to complete your profile now?',
          cancelText: 'Later',
          okText: 'Yes',
        }).then(function (res) {
          if (res) {
            vm.login(false, 'app.profile');
          } else {
            vm.login();
          }
        });
      }, function (err) {
        $ionicLoading.hide();
        vm.user = null;
        $ionicPopup.alert({
          title: 'Sign up failed!',
          template: err
        });
      });
    };
  });