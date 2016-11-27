angular.module('ouium')
  .controller('ProfileController', function (UserService, GeoService, $rootScope, $ionicPopup, $ionicHistory, $ionicLoading, $scope) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    $scope.$on('$ionicView.enter', function (e) {
      if (angular.equals({}, $rootScope.user)) {
        UserService.loadUserProfile().then(function (result) {
          vm.user = $rootScope.user || {};
        })
      } else {
        vm.user = $rootScope.isAuthenticated ? $rootScope.user : {};
      }
    });

    var vm = this;

    vm.geolocate = function () {
      GeoService.getCurrentPosition().then(function (position) {
        GeoService.geocode({ location: position }).then(function (result) {
          vm.detailsForm.street.$setDirty();
          vm.user.address = {};
          vm.user.address.street = result.street;
          vm.user.address.city = result.city;
          vm.user.address.country = result.country;
          vm.user.address.countryCode = result.countryCode;
          vm.user.location = {};
          vm.user.location.coordinates = result.coordinates;
        });
      }, function (error) {
        $ionicPopup.alert({
          title: 'Location service unavailable',
          template: error.msg
        });
      });
    }

    vm.updateProfile = function () {
      validateAddress(saveProfile);
    }

    var saveProfile = function (profile) {
      $ionicLoading.show();
      var user = JSON.stringify(profile).toLowerCase();
      UserService.updateUserProfile(user).then(function (msg) {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: 'Profile updated!',
          template: msg
        }).then(function (res) {
          console.log($ionicHistory.backView());
          if ($ionicHistory.backView().stateId == 'app.profile') {
            $ionicHistory.goBack(-2);
          } else {
            $ionicHistory.goBack();
          }
        });
      }, function (err) {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: 'Profile update failed!',
          template: err
        });
      });
    }

    function validateAddress(callback) {
      GeoService.geocode({ address: `${vm.user.address.street},${vm.user.address.city},${vm.user.address.country}` }).then(function (result) {
        $ionicPopup.confirm({
          title: 'Address found',
          template: `<h3>Please confirm your address</h3><p>Street: ${result.street}</p><p>City: ${result.city}</p><p>Country: ${result.country}</p>`
        }).then(function (res) {
          if (res) {
            vm.user.address = {};
            vm.user.address.location = {};
            vm.user.address.street = result.street;
            vm.user.address.city = result.city;
            vm.user.address.country = result.country;
            vm.user.address.countryCode = result.countryCode;
            vm.user.location = {};
            vm.user.location.coordinates = result.coordinates;
            callback(vm.user)
          } else {
          }
        });

      });
    }

  });