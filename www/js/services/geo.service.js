angular.module('ouium')
    .service('GeoService', function($q, $rootScope) {

        var options = { timeout: 10000, enableHighAccuracy: true };
        var geocoder = new google.maps.Geocoder();

        function getAddressComponent(address, component, short) {
            var element = null;
            angular.forEach(address.address_components, function(address_component) {
                if (address_component.types[0] == component) {
                    element = (short) ? address_component.short_name : address_component.long_name;
                }
            })
            return element;
        }

        var getCurrentPosition = function() {
            var q = $q.defer();

            navigator.geolocation.getCurrentPosition(function(result) {
                var crd = result.coords;
                var latlng = new google.maps.LatLng(crd.latitude, crd.longitude);
                q.resolve(latlng);
            }, function(err) {
                q.reject(err);
            }, options);

            return q.promise;
        }

        var geocode = function(query) {
            var q = $q.defer();
            var result = {};
            geocoder.geocode(query, function(results, status) {
                if (status == 'OK') {
                    result.formatted_address = results[0].formatted_address;
                    result.coordinates = [results[0].geometry.location.lat(),results[0].geometry.location.lng()];
                    result.city = getAddressComponent(results[0], 'locality');
                    result.street = getAddressComponent(results[0], 'route') + " " + getAddressComponent(results[0], 'street_number');
                    result.countryCode = getAddressComponent(results[0], 'country', true);
                    result.country = getAddressComponent(results[0], 'country');
                    q.resolve(result);
                } else {
                    q.reject(status);
                }
            });

            return q.promise;
        }

        return {
            getCurrentPosition: getCurrentPosition,
            geocode: geocode
        };
    })