"use strict";

angular.module('app').directive('mvpperson', [function () {
    return {
        scope: {
        },
        controller: "mpv-personcontroller",
        controllerAs: 'demo',
        templateUrl: '/javascripts/angularproject/widgets/mvp-person/mvp-person.html'
    }
}]);