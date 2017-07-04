(function () {
    "use strict";
    angular.module('common.services').factory('employeeResource',
    ["$resource", employeeResource]);

    function employeeResource($resource) {
        return $resource("/api/employee/:action/:_id",
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