(function () {
    "use strict";
    angular.module('app').factory('roomResource',
    ["$resource", roomResource]);

    function roomResource($resource) {
        return $resource("/api/room/:action/:_id",
               { _id: '@_id' },
               {
                    create: {method:'POST', params:{action:'create'}},                
                    getall: {method:'GET', params:{action:'getall'}},                
                    getbyid: {method:'GET', params:{action:'get'}},                
                    gettyperoom: {method:'GET', params:{action:'gettyperoom'}},                
                    update: {method:'POST', params:{action:'update'}},                
                    delete: {method:'POST', params:{action:'delete'}},  
                                  
               });
    }
}());