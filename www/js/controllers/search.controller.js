angular.module('ouium')

  .controller('SearchController', function (SearchService, GeoService, UserService, MapService, $rootScope, $scope, $ionicModal) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    $scope.$on('$ionicView.enter', function (e) {
      if (angular.equals({}, $rootScope.user)) {
        UserService.loadUserProfile().then(function (result) {
          vm.user = $rootScope.user || {};
          loadUserLocation(vm.user);
        })
      } else {
        vm.user = $rootScope.isAuthenticated ? $rootScope.user : {};
        loadUserLocation(vm.user);
      }
    });

    var vm = this;
    vm.items = [];

    function loadUserLocation(user) {
      if (user) {
        vm.address = `${user.address.city}, ${user.address.country}`;
        vm.coordinates = user.location.coordinates;
      } else {
        vm.address = "";
        vm.coordinates = undefined;
      }
    }

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
      }, $rootScope.isAuthenticated).then(function (result) {
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
      vm.coordinates = undefined;
      MapService.deleteMarkers();
    };

    //Google Maps modal
    // var latLng = new google.maps.LatLng(0,0);

    $ionicModal.fromTemplateUrl('templates/map.html', {
      scope: $scope,
      animation: 'slide-in-right'
    }).then(function (modal) {
      $scope.modal = modal;
    });

    vm.openMap = function () {
      $scope.modal.show();
      console.log(vm.coordinates);
      latLng = getMapLatLng(vm.coordinates);
      if (vm.map) {
        vm.map.setCenter(latLng)
      } else {
        var mapOptions = {
          center: latLng,
          zoom: 12,
          maxZoom: 18
        };
        vm.map = new google.maps.Map(document.getElementById("map"), mapOptions);
      }
      MapService.addMyMarker(vm.coordinates, vm.map)
      MapService.addMarkers(vm.items, vm.map)
    }

    vm.closeMap = function () {
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

    function getMapLatLng(array) {
      return {
        lat: array[0],
        lng: array[1]
      }
    }

  })