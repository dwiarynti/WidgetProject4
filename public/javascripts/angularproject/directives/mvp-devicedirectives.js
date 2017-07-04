"use strict";

angular.module('app').directive('mvpdevice', [function () {
    return {
        scope: {
        },
        controller: "mpv-devicecontroller",
        templateUrl: '/javascripts/angularproject/partialviews/mvp-device.html'
    }
}]);