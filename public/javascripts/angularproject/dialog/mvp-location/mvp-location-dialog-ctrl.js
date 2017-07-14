"use strict";

angular.module('app').controller('mvp-locationdialogcontroller',
    ['$scope', '$rootScope', '$filter', 'dataService','roomResource',
    function ($scope, $rootScope, $filter, dataService, roomResource) {
        var roomresource = new roomResource();
        $scope.listapplicationwidget = $scope.$parent.$parent.$parent.$parent.applicationObj.widget;
        $rootScope.isSingleSiteUpdated = false;
        $scope.configuration = {
            "siteid":$scope.item.widgetSettings.configuration.siteid != undefined ? $scope.item.widgetSettings.configuration.siteid : 0,
            "cols":$scope.item.widgetSettings.configuration.cols != undefined ? $scope.item.widgetSettings.configuration.cols : [],
            "rows": $scope.item.widgetSettings.configuration.rows,
            "selectRowsStatus": $scope.item.widgetSettings.configuration.selectRowsStatus
        };
        $scope.fieldnamelist = [];
        $scope.sitelist = $rootScope.sitelist;
        
        $scope.saveSettings = function () {
            $scope.configuration.siteid = parseInt($scope.configuration.siteid);
            $scope.item.widgetSettings.configuration = $scope.configuration; 

            $rootScope.initwidget.location = true;
            $scope.$close();
        };

        
        $scope.isSelectedItem = function(itemA, itemB){
            return itemA == itemB ? true:false;
        }

        $scope.pushSelectedTransactionType = function (obj) {
            if(obj.isSelected)
                $scope.configuration.fieldname.push(obj.key);
            else
                $scope.configuration.fieldname.splice(obj.key,1);
        }

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