(function () {
    "use strict";
    angular.module('app').factory('widgetmanagementResource',
    ["$resource", widgetmanagementResource]);

    function widgetmanagementResource($resource) {
        return $resource("/api/widgetmanagement/:action/:_id",
               { _id: '@_id' },
               {
                 get: { method: 'GET',params:{action:'datasource'}},
                 create: { method: 'POST',params:{action:'create'}},
                 update: { method: 'POST',params:{action:'update'}},
                 getall: { method: 'GET',params:{action:'getall'}},
                 getappbyid: { method: 'GET',params:{action:'getbyid'}},
                 getdata: { method: 'POST',params:{action:'getdata'}},
               });
    }
}());