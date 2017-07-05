"use strict";

angular.module('app').directive('mvplocation', [function () {
    return {
        scope: {
        },
        controller: "mpv-locationcontroller",
        controllerAs: 'demo',
        templateUrl: '/javascripts/angularproject/widgets/mvp-location/mvp-location.html'
    }
}]);