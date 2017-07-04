"use strict";

angular.module('app').directive('mvppersonlocation', [function () {
    return {
        scope: {
        },
        controller: "mpv-personlocationcontroller",
        templateUrl: '/javascripts/angularproject/partialviews/mvp-personlocation.html'
    }
}]);