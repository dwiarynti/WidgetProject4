"use strict";

angular.module('app').directive('mvppersondevice', [function () {
    return {
        scope: {
        },
        controller: "mpv-persondevicecontroller",
        templateUrl: '/javascripts/angularproject/partialviews/mvp-persondevice.html'
    }
}]);