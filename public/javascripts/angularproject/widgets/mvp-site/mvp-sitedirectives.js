"use strict";

angular.module('app').directive('mvpsite', [function () {
    return {
        scope: {
        },
        controller: "mpv-sitecontroller",
        templateUrl: '/javascripts/angularproject/widgets/mvp-site/mvp-site.html'
    }
}]);