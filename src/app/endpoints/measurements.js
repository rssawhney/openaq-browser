(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .controller('MeasurementsController', MeasurementsController);

    function MeasurementsController($http, $scope, URLService, dataService) {
        var uri = URI(URLService.getUrl('measurements'));
        var params = {};
        $scope.query_url = uri.toString();
        $scope.limit = 10;
        $scope.page = 1;
        $scope.order_by = "date";
        $scope.sort = "desc";
        $scope.busy = 0;

        $scope.updateUrl = function(model) {
            $scope.query_url = URLService.updateUrl(uri, model, $scope[model]);
            params[model] = $scope[model];
        };

        var setDefaults = function(uri) {
            var defaultFields = [
                'limit',
                'page',
                'order_by',
                'sort'
            ];

            for (var i in defaultFields) {
                $scope.updateUrl(defaultFields[i]);
            }
        };
        setDefaults();
        
        $scope.get_locations = function() {
            var params = {};
            if($scope.country) {
                params.country = $scope.country;
            }
            if($scope.city){
                params.city = $scope.city;
            }

            return dataService.locations(params)
                .then(function(data) {
                    $scope.locations = data.results;
                });
        };

        $scope.get_cities = function() {
            var params = {};
            if($scope.country){
                params.country = $scope.country;
            }

            return dataService.cities(params)
                .then(function(data) {
                    $scope.cities = data.results;
                });
        };

        $scope.get_countries = function() {
            return dataService.countries()
                .then(function(data) {
                    $scope.countries = data.results;
                });
        };
        $scope.get_countries();

        $scope.fetch = function() {
            $scope.busy = 1;

            return dataService.measurements()
                .then(function(data) {
                    $scope.results = data.results;
                    $scope.found = data.meta.found;
                    $scope.limit = data.meta.limit;
                    $scope.busy = 0;
                });
        };

        $scope.submit = function() {
            $scope.fetch();
        };

        $scope.get_csv = function() {
            $scope.busy = 1;

            $scope.query_url += "&format=csv";

            $http.get($scope.query_url).success(function(data) {
                // http://stackoverflow.com/a/31871521
                var anchor = angular.element('<a/>');
                anchor.css({display: 'none'}); // Make sure it's not visible
                angular.element(document.body).append(anchor); // Attach to document

                anchor.attr({
                    href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data),
                    target: '_blank',
                    download: 'filename.csv'
                })[0].click();

                anchor.remove(); // Clean it up afterwards
                $scope.busy = 0;
            });
        };
    }
})();
