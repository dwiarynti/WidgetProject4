"use strict";

angular.module('app').directive('mvpdevice', [function () {
    return {
        scope: {
        },
        controller: "mpv-devicecontroller",
        controllerAs: 'demo',
        templateUrl: '/javascripts/angularproject/widgets/mvp-device/mvp-device.html'
    }
}]);