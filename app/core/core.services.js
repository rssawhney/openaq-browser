(function() {
    'use strict'

    angular
        .module('app.core')
        .service('URLService', URLService);

    function URLService() {
        this.getOpenAQUrl = function(name) {
            if (name == undefined) { throw new Error('API endpoint required.') };
            var API_ROOT = "https://api.openaq.org/v1/";
            var availablePoints = ['cities', 'countries', 'latest', 'locations', 'measurements'];
            if (availablePoints.indexOf(name) < 0) { throw new Error('API endpoint unavailable.'); };
            return API_ROOT + name;
        };

        this.updateUrl = function(uri, key, value) {
            if (uri.hasQuery(key)) {
                uri.removeQuery(key);
            };
            if (value) {
                uri.addSearch(key, value);
            };

            return uri.toString();
        };
    };
})();
