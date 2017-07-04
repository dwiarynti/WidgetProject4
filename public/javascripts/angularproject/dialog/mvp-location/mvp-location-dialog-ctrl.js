"use strict";

angular.module('app').controller('mvp-locationdialogcontroller',
    ['$scope', 'dataService', 'locationsiteResource',
    function ($scope, dataService, locationsiteResource) {
        var locationsiteresource = new locationsiteResource();
        $scope.selectedfilter = {"by":"", "option":""};
        // $scope.selectedfilteroption = "";
        $scope.filteroptions = {};
        $scope.objmodel = {"FilterOption":[
            {"OptionName":"Zone"},
            {"OptionName":"Location"},
        ]};
        
        var siteid = "001";
        locationsiteresource.$distinct({_id:siteid}, function(data){
            // $scope.objmodel = data.obj;
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

        // console.log($scope.selectedfilterby);
    }]);