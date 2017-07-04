(function () {
    "use strict";
    angular.module('app').factory('appmanagementResource',
    ["$resource", appmanagementResource]);

    function appmanagementResource($resource) {
        return $resource("/api/appmanagement/:action/:_id",
               { _id: '@_id' },
               {
                 init: {method:'GET', params:{action:'getall'}},
                 create: {method:'POST', params:{action:'create'}},
                 update: {method:'POST', params:{action:'update'}},
                 get: {method:'GET'},
                 getbyuser: {method:'GET', params:{action:'getbyuser'}},      
               })
    }
}());