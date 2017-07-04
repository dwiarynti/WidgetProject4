"use strict";

angular.module('app').directive('wwaEmployee',
    ['dataService', 'employeeResource',
    function (dataService, employeeResource) {
        return {
            templateUrl: '/javascripts/app/widgets/wwaEmployee/wwaEmployeeTemplate.html',
            link: function (scope, el, attrs) {
                scope.selectedEmployee = null;
                var employeeresource = new employeeResource();

                employeeresource.$get({ _id: scope.item.widgetSettings.id }).then(function (data) {
                        
                        scope.selectedEmployee = data.obj;

                });

                // dataService.getEmployee(scope.item.widgetSettings.id)
                //     .then(function (data) {
                //         scope.selectedEmployee = data;
                //     });
            }
        };
    }]);