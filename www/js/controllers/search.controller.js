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
      console.log("Searching")
      SearchService.searchNear({
        maxDistance: 5000,
        coordinates: vm.user.location.coordinates
      }).then(function (result) {
        console.log(result)
        vm.items = result;
      }, function (error) {
        console.log(error)
      })

    };

    vm.clear = function () {
      if (vm.items.length) {
        console.log("Clearing")
        vm.items = [];
      }
    };

  })