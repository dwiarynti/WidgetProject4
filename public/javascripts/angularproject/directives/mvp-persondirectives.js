"use strict";

angular.module('app').directive('mvpperson', [function () {
    return {
        scope: {
        },
        controller: "mpv-personcontroller",
        templateUrl: '/javascripts/angularproject/partialviews/mvp-person.html'
    }
}]);