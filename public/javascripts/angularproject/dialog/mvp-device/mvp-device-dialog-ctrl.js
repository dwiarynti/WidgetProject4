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

        $scope.saveSettings = function () {
            // $scope.configuration.siteid = parseInt($scope.configuration.siteid);
            $scope.item.widgetSettings.configuration = $scope.configuration; 
            $rootScope.initwidget.location = true;
            $scope.$close();
        };

        $scope.selectAllRows = function(){
            $scope.configuration.selectRowsStatus = true;
            var displayedRows = $filter('filter')($scope.configuration.rows, function(row){return row.display === true});
            angular.forEach($scope.configuration.rows, function(row) {
                row.display = displayedRows.length == $scope.configuration.rows.length ? false : true;                
            });
        }
        
        $scope.selectSingleRow = function(){
            $scope.configuration.selectRowsStatus = true;
        }
    }]);

