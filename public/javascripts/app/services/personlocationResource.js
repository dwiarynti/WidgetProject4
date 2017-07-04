(function () {
    "use strict";
    angular.module('app').factory('personlocationResource',
    ["$resource", personlocationResource]);

    function personlocationResource($resource) {
        return $resource("/api/personlocation/:action/:_id",
               { _id: '@_id' },
               {
                 filter: {method:'POST', params:{action:'filter'}},
                 distinct: {method:'GET', params:{action:'distinct'}},

               });
    }
}());