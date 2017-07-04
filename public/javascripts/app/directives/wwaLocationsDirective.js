"use strict";

angular.module('app').directive('wwaLocations', [function () {
    return {
        scope: {
        },
        // template: '<h1>Location Page</h1>'
        template: '<mvp-location></mvp-location>'
        
    }
}]);