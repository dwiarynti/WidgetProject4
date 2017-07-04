"use strict";

angular.module('app').controller('mvp-persondialogcontroller',
    ['$scope', 'dataService',
    function ($scope, dataService) {
        $scope.selectedfilterby = "";
        $scope.objmodel = {"FilterOption":[
            {"OptionName":"Zone"},
            {"OptionName":"person"},
            {"OptionName":"Site"},
        ]};
        console.log($scope.selectedfilterby);
    }]);