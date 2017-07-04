"use strict";

angular.module('app').directive('mvptext', [function () {
    return {
        scope: {
        },
        controller: "mpv-textcontroller",
        templateUrl: '/javascripts/angularproject/widgets/mvp-text/mvp-text.html'
    }
}]);