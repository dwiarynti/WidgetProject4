"use strict";

angular.module('app').controller('mvp-devicedialogcontroller',
    ['$scope', '$rootScope', '$filter', 'dataService','roomResource',
    function ($scope, $rootScope, $filter, dataService, roomResource) {
        $scope.configuration = {
            "siteid":$scope.item.widgetSettings.configuration.siteid != undefined ? $scope.item.widgetSettings.configuration.siteid : 0,
            "cols":$scope.item.widgetSettings.configuration.cols != undefined ? $scope.item.widgetSettings.configuration.cols : [],
            "rows": $scope.item.widgetSettings.configuration.rows,
            "selectRowsStatus": $scope.item.widgetSettings.configuration.selectRowsStatus
        };
    }]);