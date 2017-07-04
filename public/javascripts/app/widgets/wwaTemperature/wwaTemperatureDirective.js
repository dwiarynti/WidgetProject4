"use strict";

angular.module('app').directive('wwaTemperature',
    ['dataService' , 'locationResource',
    function (dataService, locationResource) {
        return {
            templateUrl: '/javascripts/app/widgets/wwaTemperature/wwaTemperatureTemplate.html',
            link: function (scope, el, attrs) {
                scope.isLoaded = false;
                scope.hasError = false;
                scope.selectedLocation = null;

                var locationresource = new locationResource();

                scope.loadLocation = function () {
                    scope.hasError = false;

                    locationresource.$get({ _id: scope.item.widgetSettings.id }).then(function (data) {
                        
                        scope.selectedLocation = data.obj;
                        scope.isLoaded = true;
                        scope.hasError = false;

                    });

                    // dataService.getLocation(scope.item.widgetSettings.id)
                    // .then(function (data) {
                    //     // success
                    //     scope.selectedLocation = data;
                    //     scope.isLoaded = true;
                    //     scope.hasError = false;
                    // }, function (data) {
                    //     // error
                    //     scope.hasError = true;
                    // });
                };

                scope.loadLocation();
            }
        };
}]);