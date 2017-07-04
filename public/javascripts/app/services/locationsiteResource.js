(function () {
    "use strict";
    angular.module('app').factory('locationsiteResource',
    ["$resource", locationsiteResource]);

    function locationsiteResource($resource) {
        return $resource("/api/locationsite/:action/:_id",
               { _id: '@_id' },
               {
                 getall: {method:'GET', params:{action:'getall'}},
                 getbysite: {method:'GET', params:{action:'getbysite'}},
                 distinct: {method:'GET', params:{action:'distinct'}},
                 filter: {method:'POST', params:{action:'filter'}}
               })
    }
}());