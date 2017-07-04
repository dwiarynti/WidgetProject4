(function () {
    "use strict";
    angular.module('app').factory('personResource',
    ["$resource", personResource]);

    function personResource($resource) {
        return $resource("/api/person/:action/:_id",
               { _id: '@_id' },
               {
                 init: {method:'GET', params:{action:'getbysite'}},
                 create: {method:'POST', params:{action:'create'}},
                 getAll: {method:'GET', params:{action:'getall'}},
                 update: {method:'POST', params:{action:'update'}},
                 delete: {method:'POST', params:{action:'delete'}}
               })
    }
}());