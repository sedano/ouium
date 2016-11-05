angular.module('ouium')
  .controller('ProfileController', function (UserService, GeoService, $rootScope, $ionicPopup, $ionicHistory, $ionicLoading, $scope) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    $scope.$on('$ionicView.beforeEnter', function (e) {
      vm.user = $rootScope.isAuthenticated ? $rootScope.user : {};
    });

    var vm = this;

    GeoService.getCurrentPosition().then(function (position) {
      console.log(position);
    })

    vm.updateProfile = function (user) {
      user = JSON.stringify(user).toLowerCase();
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