(function () {
    "use strict";
    angular.module('app').factory('widgetResource',
    ["$resource", widgetResource]);

    function widgetResource($resource) {
        return $resource("/api/widget/:action/:_id",
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