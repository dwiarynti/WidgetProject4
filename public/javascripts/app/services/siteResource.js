(function () {
    "use strict";
    angular.module('app').factory('siteResource',
    ["$resource", siteResource]);

    function siteResource($resource) {
        return $resource("/api/site/:action/:_id",
               { _id: '@_id' },
               {
                    getall: {method:'GET', params:{action:'getall'}}                
               });
    }
}());