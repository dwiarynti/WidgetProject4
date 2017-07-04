"use strict";

angular.module('app').controller('mvp-persondevicedialogcontroller',
    ['$scope', 'dataService', 'persondeviceResource', 
    function ($scope, dataService, persondeviceResource) {
        var persondeviceresource = new persondeviceResource();
        $scope.selectedfilter;
        $scope.filterobj = [];
        var siteid = "001";
        persondeviceresource.$distinct({_id:siteid}, function(data){
                console.log(data);
                $scope.filterobj= data.obj;
        });

        $scope.saveSettings = function () {
            $scope.item.widgetSettings.selectedfilter = $scope.selectedfilter;
            console.log($scope.item);
            // $scope.item.widgetSettings.id = $scope.selectedEmployee.id;
            // $scope.$parent.selectedfilteroption = $scope.selectedfilteroption;
            $scope.$close();
        };
    }]);