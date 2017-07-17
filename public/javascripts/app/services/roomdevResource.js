(function () {
    "use strict";
    angular.module('app').factory('roomdevResource',
    ["$resource", roomdevResource]);

    function roomdevResource($resource) {
        return $resource("/api/roomdev/:action/:_id",
               { _id: '@_id' },
               {
                 create: {method:'POST', params:{action:'create'}},
                 update: {method:'POST', params:{action:'update'}},
                 delete: {method:'POST', params:{action:'delete'}},
                 getAll: {method:'GET', params:{action:'getall'}},
                 getdevicefix: {method:'GET', params:{action:'getdevicefix'}},
                 getdevicemobile: {method:'GET', params:{action:'getdevicemobile'}},
                 getbylocation: {method:'GET', params:{action:'getbylocation'}},
               })
    }
}());