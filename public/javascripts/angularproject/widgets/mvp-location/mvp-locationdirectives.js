"use strict";

angular.module('app').directive('mvplocation', [function () {
    return {
        scope: {
        },
        controller: "mpv-locationcontroller",
        templateUrl: '/javascripts/angularproject/widgets/mvp-location/mvp-location.html'
    }
}]);