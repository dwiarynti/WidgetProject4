"use strict";

angular.module('app').directive('wwaInventory',
    ['dataService', 'locationResource',
    function (dataService, locationResource) {
        return {
            templateUrl: '/javascripts/app/widgets/wwaInventory/wwaInventoryTemplate.html',
            link: function (scope, el, attrs) {
                scope.selectedLocation = null;
                var locationresource = new locationResource();
                locationresource.$get({ _id: scope.item.widgetSettings.id }).then(function (data) {
                        
                        scope.selectedLocation = data.obj;

                });

                // dataService.getLocation(scope.item.widgetSettings.id)
                //     .then(function (data) {
                //         scope.selectedLocation = data;
                //     });
            }
        };
    }]);