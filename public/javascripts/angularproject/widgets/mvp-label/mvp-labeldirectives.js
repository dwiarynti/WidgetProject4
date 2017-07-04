"use strict";

angular.module('app').directive('mvplabel', [function () {
    return {
        scope: {
        },
        controller: "mpv-labelcontroller",
        templateUrl: '/javascripts/angularproject/widgets/mvp-label/mvp-label.html'
    }
}]);