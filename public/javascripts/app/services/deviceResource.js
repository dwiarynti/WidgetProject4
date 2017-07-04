(function () {
    "use strict";
    angular.module('app').factory('deviceResource',
    ["$resource", deviceResource]);

    function deviceResource($resource) {
        return $resource("/api/device/:action/:_id",
               { _id: '@_id' },
               {
                 init: {method:'GET', params:{action:'getbysite'}},
                 distinct: {method:'GET', params:{action:'distinct'}},
                 filter: {method:'POST', params:{action:'filter'}}
               });
    }
}());