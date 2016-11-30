angular.module('ouium')
    .service('MapService', function ($q, $rootScope) {

        var markers = [];
        var bounds = new google.maps.LatLngBounds();

        var addMarkers = function (items, map) {
            for (let i = 0, len = items.length; i < len; i++) {
                addMarker(items[i].location.coordinates, map);
            }
            map.fitBounds(bounds);
            map.panToBounds(bounds);
        }

        // Deletes all markers in the array by removing references to them.
        var deleteMarkers = function () {
            clearMarkers();
            markers = [];
            bounds = new google.maps.LatLngBounds();
        }

        // Adds a marker to the map and push to the array.
        var addMarker = function (location, map) {
            latLng = getMapLatLng(location);
            bounds.extend(latLng);
            var marker = new google.maps.Marker({
                position: latLng,
                map: map
            });
            markers.push(marker);
        }

        // Sets the map on all markers in the array.
        function setMapOnAll(map) {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
            }
        }

        // Removes the markers from the map, but keeps them in the array.
        function clearMarkers() {
            setMapOnAll(null);
        }

        // Shows any markers currently in the array.
        function showMarkers() {
            setMapOnAll(map);
        }

        function getMapLatLng(array) {
            return {
                lat: array[0],
                lng: array[1]
            }
        }
        return {
            addMarkers: addMarkers,
            addMarker: addMarker,
            deleteMarkers: deleteMarkers
        };
    })