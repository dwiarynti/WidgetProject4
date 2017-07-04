"use strict";

angular.module('app').config(['$routeProvider', function ($routeProvider) {

    var routes = [
        {
            url: '/dashboard',
            config: {
                template: '<wwa-dashboard></wwa-dashboard>'
            }
        },
        {
            url: '/guides',
            config: {
                template: '<wwa-guides></wwa-guides>'
            }
        },
        {
            url: '/home',
            config: {
                template: '<div><h1>WELCOME</h1></div>'
            }
        },
        {
            url: '/appmanagement',
            config: {
                templateUrl: '/javascripts/angularproject/partialviews/appmanagement.html'
            }
        },
        {
            url: '/appmanagement-v2',
            config: {
                templateUrl: '/javascripts/angularproject/partialviews/appmanagement-v2.html'
            }
        },
        {
            url: '/appcomposer',
            config: {
                templateUrl: '/javascripts/angularproject/partialviews/appcomposer.html'
            }
        },
        {
            url: '/appcomposert-v2',
            config: {
                templateUrl: '/javascripts/angularproject/partialviews/appcomposer-v2.html'
            }
        },
        {
            url: '/prevpage/:id',
            config: {
                templateUrl: '/javascripts/angularproject/partialviews/previewpage.html'
            }
        },
        {
            url: '/application/:euid',
            config: {
                templateUrl: '/javascripts/angularproject/partialviews/application.html'
            }
        },
        {
            url: '/usermanagement',
            config: {
                templateUrl: '/javascripts/angularproject/partialviews/usermanagement.html'
            }
        },
        {
            url: '/notificationmanagement',
            config: {
                templateUrl: '/javascripts/angularproject/partialviews/notificationmanagement.html'
            }
        },
        {
            url: '/authsetting',
            config: {
                templateUrl: '/javascripts/angularproject/partialviews/authsetting.html'
            }
        },
        {
            url: '/sitemanagement',
            config: {
                templateUrl: '/javascripts/angularproject/partialviews/sitemanagement.html'
            }
        },
        {
            url: '/devicemanagement',
            config: {
                templateUrl: '/javascripts/angularproject/partialviews/devicemanagement.html'
            }
        },
        {
            url: '/locationmanagement',
            config: {
                templateUrl: '/javascripts/angularproject/partialviews/locationmanagement.html'
            }
        },
        {
            url: '/peoplemanagement',
            config: {
                templateUrl: '/javascripts/angularproject/partialviews/peoplemanagement.html'
            }
        },
    ];

    routes.forEach(function (route) {
        $routeProvider.when(route.url, route.config);
    });

    $routeProvider.otherwise({ redirectTo: '/home' });

}]);