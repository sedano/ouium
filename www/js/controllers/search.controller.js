angular.module('ouium')

  .controller('SearchController', function ($scope, $rootScope, $state, $ionicModal, $timeout, AuthService, UserService) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    $scope.$on("$ionicView.beforeEnter", function () {
    });

    var vm = this;

    vm.items = [];

    vm.search = function () {
      console.log("Searching")
      for (let i = 1; i < 101; i++) {
        vm.items.push({
          img: "https://dummyimage.com/100x100/"+Math.floor(Math.random()*16777215).toString(16)+"/fff&text=" + i,
          title: "User " + i,
          description: "I'm user #" + i + " and I'm not a clone"
        });
      }
    };

    vm.clear = function () {
      if (vm.items.length) {
        console.log("Clearing")
        vm.items = [];
      }
    };

  })