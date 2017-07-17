(function () {
    "use strict";
    angular.module('app').factory('personlocResource',
    ["$resource", personlocResource]);

    function personlocResource($resource) {
        return $resource("/api/personloc/:action/:_id",
               { _id: '@_id' },
               {
                 create: {method:'POST', params:{action:'create'}},
                 getall: {method:'GET', params:{action:'getall'}},
                 getbyid: {method:'GET', params:{action:'get'}},

               });
    }
}());