"use strict";

angular.module('app').directive('mvptable', [function () {
    return {
        scope: {
        },
        controller: "mpv-tablecontroller",
        templateUrl: '/javascripts/angularproject/widgets/mvp-table/mvp-table.html'
    }
}]);