"use strict";

angular.module('app').controller('mvp-devicedialogcontroller',
    ['$scope', '$rootScope', '$filter', 'dataService','roomResource',
    function ($scope, $rootScope, $filter, dataService, roomResource) {
        $scope.configuration = {
            "siteid":$scope.item.widgetSettings.configuration.siteid != undefined ? $scope.item.widgetSettings.configuration.siteid : 0,
            "cols":$scope.item.widgetSettings.configuration.cols != undefined ? $scope.item.widgetSettings.configuration.cols : [],
            "rows": $scope.item.widgetSettings.configuration.rows,
            "backuplist": $scope.item.widgetSettings.configuration.backuplist,
            "selectRowsStatus": $scope.item.widgetSettings.configuration.selectRowsStatus,
            "devicetype": $scope.item.widgetSettings.configuration.devicetype,
        };

        $scope.devicetype = ["all","fixed", "mobile"];

        // console.log($scope.configuration);

        $scope.saveSettings = function () {
            // $scope.configuration.siteid = parseInt($scope.configuration.siteid);
            $scope.item.widgetSettings.configuration = $scope.configuration; 
            $scope.item.widgetSettings.configuration.initializeStatus = true;
            // $rootScope.initwidget.location = true;
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

        $scope.isSelectedItem = function(itemA, itemB){
            return itemA == itemB ? true:false;
        }
        // $scope.reinitwidget = function(){
        //     $scope.item.widgetSettings.configuration.initializeStatus = true;
        // }

        $scope.test = function(datatype){
            console.log($scope.configuration.backuplist);
            if(datatype == 'fixed' || datatype == 'mobile'){
                $scope.configuration.rows = $filter('filter')($scope.configuration.backuplist, function(obj){
                    return obj.type === datatype
                });
            }else{
                $scope.configuration.rows = $scope.configuration.backuplist;
                // console.log($scope.configuration.rows);
            }

        }
    }]);

