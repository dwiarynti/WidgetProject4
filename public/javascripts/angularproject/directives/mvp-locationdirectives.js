"use strict";

angular.module('app').directive('mvplocation', [function () {
    return {
        scope: {
        },
        controller: "mpv-locationcontroller",
        templateUrl: '/javascripts/angularproject/partialviews/mvp-location.html'
    }
}]);