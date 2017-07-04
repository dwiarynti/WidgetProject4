"use strict";

angular.module('app').controller('mvp-devicedialogcontroller',
    ['$scope', 'dataService','deviceResource', 
    function ($scope, dataService, deviceResource) {
        var deviceresource = new deviceResource();
        var siteid = "001";
        $scope.filterobj = [];
        $scope.selectedfilter = "";
        deviceresource.$distinct({_id:siteid}, function(data){
                console.log(data);
                $scope.filterobj= data.obj;
            });

        $scope.saveSettings = function () {
            $scope.item.widgetSettings.selectedfilter = $scope.selectedfilter;
            $scope.$close();
        };
    }]);