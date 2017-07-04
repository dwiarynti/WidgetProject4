(function () {
    "use strict";
    angular.module('app').factory('authsettingResource',
    ["$resource", authsettingResource]);

    function authsettingResource($resource) {
        return $resource("/api/auth/:action/:_id",
               { _id: '@_id' },
               {
                 init: {method:'GET', params:{action:'init'}},
                 update: {method:'POST', params:{action:'update'}}      
               })
    }
}());