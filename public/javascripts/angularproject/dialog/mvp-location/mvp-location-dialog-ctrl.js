"use strict";

angular.module('app').controller('mvp-locationdialogcontroller',
    ['$scope', '$rootScope', '$filter', 'dataService','roomResource',
    function ($scope, $rootScope, $filter, dataService, roomResource) {
        var roomresource = new roomResource();
        $scope.listapplicationwidget = $scope.$parent.$parent.$parent.$parent.applicationObj.widget;
        $rootScope.isSingleSiteUpdated = false;
        $scope.convertlisttotree = function(data){
                var ltt = new LTT(data, {
                    key_id: 'uuid',
                    key_parent: 'parent',
                    key_child : 'children'
                });
                var tree = ltt.GetTree();
                return tree;
            }
        $scope.configuration = {
            "siteid":$scope.item.widgetSettings.configuration.siteid != undefined ? $scope.item.widgetSettings.configuration.siteid : 0,
            "cols":$scope.item.widgetSettings.configuration.cols != undefined ? $scope.item.widgetSettings.configuration.cols : [],
            "rows": $scope.item.widgetSettings.configuration.rows,
            "selectedrows": $scope.convertlisttotree($scope.item.widgetSettings.configuration.selectedrows),
            "selectRowsStatus": $scope.item.widgetSettings.configuration.selectRowsStatus
        };
        console.log($scope.item.widgetSettings);
        $scope.convertedrows = $scope.convertlisttotree($scope.item.widgetSettings.configuration.rows);
        $scope.fieldnamelist = [];
        $scope.sitelist = $rootScope.sitelist;


        $scope.locmanagementcontrol = {};
        $scope.locmanagementcontrol.selectSingleRow = function(){
            $scope.configuration.selectRowsStatus = true;
        }
        $scope.locmanagementcontrol.scope = this;
        $scope.locmanagementcontrol.filterselectedrows = function(){
             $scope.configuration.selectedrows =  $filter('filter')($scope.configuration.rows, function(row){return row.display === true});
        }

        $scope.colDefs = [
            {
                // field: "",
                displayName: "All",
                cellTemplate: '<input type="checkbox" ng-model-options="{ getterSetter: true }" ng-model="row.branch.display" ng-change="treeControl.selectSingleRow()"/></td>'
            },
            // { field: "uuid", displayName: "UUID" },
            { field: "name", displayName: "Name" },
            { field: "areatype", displayName: "Area Type" },
            { field: "parentname", displayName: "Parent" },
        ];
        $scope.columnlist = [
            {field:"name", show:true},
            {field:"areatype", show:true},
            {field:"parentname", show:true},
            {field:"shortaddress", show:true},
            {field:"fulladdress", show:true},
            {field:"Location", show:false},
            {field:"changeby", show:false},
            {field:"changebyname", show:false},
            {field:"datemodified", show:false},
            {field:"disable", show:false},
            {field:"parent", show:false},
            {field:"uuid", show:false},
        ];
        $scope.colsoption = [];
        $scope.cols = function(){
            // var columnlist = Object.keys($scope.item.widgetSettings.configuration.rows[0]);
            angular.forEach($scope.columnlist, function(columnobj){
                var getdisplayedcolumn = $filter('filter')($scope.item.widgetSettings.configuration.cols,function(obj){
                    return obj.field === columnobj.field
                })[0];
                if(getdisplayedcolumn != undefined){
                    $scope.colsoption.push({field:getdisplayedcolumn.field, title:getdisplayedcolumn.field , show:true});                    
                }else{
                    $scope.colsoption.push({field:columnobj.field, title:columnobj.field , show:false});
                }
            });
        }
        $scope.cols();

        $scope.expandingProperty = {};  //Create a scope object to hold custom property to first column
        
        $scope.saveSettings = function () {
            $scope.configuration.siteid = parseInt($scope.configuration.siteid);
            $scope.item.widgetSettings.configuration = $scope.configuration; 
            $scope.locmanagementcontrol.filterselectedrows();
            $scope.item.widgetSettings.configuration.initializeStatus = true;
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

        $scope.updatecolumn = function(obj){
            var getdisplayedcolumn = $filter('filter')($scope.item.widgetSettings.configuration.cols,function(col){
                    return col.field === obj.field
                })[0];
            if(obj.show && getdisplayedcolumn == undefined){
                $scope.item.widgetSettings.configuration.cols.push({ field: obj.title, displayName: obj.title });
            }else{
                $scope.item.widgetSettings.configuration.cols.splice($scope.item.widgetSettings.configuration.cols.indexOf(getdisplayedcolumn), 1);
            }
        }
    }]);