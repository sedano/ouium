angular.module('ouium')

  .controller('SearchController', function (SearchService, GeoService, UserService, $rootScope, $scope) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    $scope.$on('$ionicView.beforeEnter', function (e) {
      if (angular.equals({}, $rootScope.user)) {
        UserService.loadUserProfile().then(function (result) {
          vm.user = $rootScope.user || {};
        })
      } else {
        vm.user = $rootScope.isAuthenticated ? $rootScope.user : {};
      }
    });

    var vm = this;
    vm.items = [];

    vm.search = function () {
      if (vm.coordinates) {
        console.log("Coordinates found: ", vm.coordinates);
        searchServer(vm.coordinates, vm.distance);
      } else {
        console.log("Coordinates not found");
        GeoService.geocode({ address: vm.address }).then(function (result) {
          vm.coordinates = result.coordinates;
          console.log("New coordinates: ", vm.coordinates);
          searchServer(vm.coordinates, vm.distance)
        });
      }
    };

    function searchServer(coordinates, distance) {
      SearchService.searchNear({
        maxDistance: distance || 5000,
        coordinates: coordinates || [0, 0]
      }).then(function (result) {
        console.log(result)
        vm.items = result;
      }, function (error) {
        console.log(error)
      })
    }

    vm.geolocate = function () {
      GeoService.getCurrentPosition().then(function (position) {
        GeoService.geocode({ location: position }).then(function (result) {
          vm.address = result.formatted_address;
          vm.coordinates = result.coordinates;
          vm.search();
        });
      }, function (error) {
        $ionicPopup.alert({
          title: 'Location service unavailable',
          template: error.msg
        });
      });
    }

    vm.clear = function () {
      if (vm.items.length) {
        console.log("Clearing")
        vm.items = [];
      }
      vm.coordinates = null;
    };

  })