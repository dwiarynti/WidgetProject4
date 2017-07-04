"use strict";

angular.module('app').controller('mvp-personlocationdialogcontroller',
    ['$scope', 'dataService','personlocationResource', 
    function ($scope, dataService, personlocationResource) {
        var personlocationresource = new personlocationResource();
        $scope.filteroptions = [];
        $scope.selectedfilter = "";
        var siteid = "001";
        personlocationresource.$distinct({_id:siteid}, function(data){
            // // $scope.objmodel = data.obj;
            $scope.filteroptions = data.obj;
            console.log(data.obj);
        });

        $scope.saveSettings = function () {
            $scope.item.widgetSettings.selectedfilter = $scope.selectedfilter;
            console.log($scope.item);
            // $scope.item.widgetSettings.id = $scope.selectedEmployee.id;
            // $scope.$parent.selectedfilteroption = $scope.selectedfilteroption;
            $scope.$close();
        };
    }]);