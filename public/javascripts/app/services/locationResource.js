(function () {
    "use strict";
    angular.module('app').factory('locationResource',
    ["$resource", locationResource]);

    function locationResource($resource) {
        return $resource("/api/location/:action/:_id",
               { _id: '@_id' },
               {
                 getAll: { method: 'GET',params:{action:'GetAll'}},
                 add: {method:'POST', params: {action:'Create'}},
                 get: {method:'GET'},
                 update: {method:'POST',params:{action:'Update'}},
                 delete: {method:'POST',params:{action:'Delete'}}
               })
    }
}());