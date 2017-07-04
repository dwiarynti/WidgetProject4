"use strict";

angular.module('app').controller('mvp-locationdialogcontroller',
    ['$scope', '$filter', 'dataService','widgetmanagementResource',
    function ($scope, $filter, dataService, widgetmanagementResource) {
        var widgetmanagementresource = new widgetmanagementResource();

        $scope.configuration = {
            "datasource":{}, 
            "fieldname":[], 
            "returneddatatype":"list"
        };
        $scope.fieldnamelist = [];

        $scope.getDataSourceFeilds = function(){
            if($scope.configuration.datasource != "")
            {
                var datasourcetype = typeof($scope.configuration.datasource);
                var datasource = datasourcetype != "string" ? $scope.configuration.datasource : JSON.parse($scope.configuration.datasource);

                angular.forEach(datasource.field, function (fieldname) {
                    var isSelected = $filter('filter')($scope.configuration.fieldname,function(selectedfieldname){
                        return selectedfieldname === fieldname
                    })[0] != undefined ? true:false;
                    console.log($filter('filter')($scope.configuration.fieldname,function(selectedfieldname){
                        return selectedfieldname === fieldname
                    })[0]);
                    $scope.fieldnamelist.push({"key":fieldname, "isSelected":isSelected});
                });
            }

        }

        $scope.init = function(){  
            if(Object.keys($scope.$parent.item.widgetSettings.configuration).length > 0)
                $scope.configuration = $scope.$parent.item.widgetSettings.configuration;
                $scope.getDataSourceFeilds();
        }

        $scope.init();

        $scope.saveSettings = function () {

            //getdatatype
            var datasourcetype = typeof($scope.configuration.datasource);
            $scope.configuration.datasource = datasourcetype != "string" ? $scope.configuration.datasource : JSON.parse($scope.configuration.datasource);
            $scope.item.widgetSettings.configuration = $scope.configuration; 
            console.log($scope.item.widgetSettings.configuration);
            $scope.$close();
        };
        
        $scope.getDataSource = function(){
            widgetmanagementresource.$get(function(data){
                if(data.success)
                    $scope.datasourcelist = data.obj

            });
        }

        $scope.getDataSource();

        
        $scope.isSelectedItem = function(itemA, itemB){
            return itemA == itemB ? true:false;
        }

        $scope.pushSelectedTransactionType = function (obj) {
            if(obj.isSelected)
                $scope.configuration.fieldname.push(obj.key);
            else
                $scope.configuration.fieldname.splice(obj.key,1);
            
            console.log($scope.configuration.fieldname);
        }
    }]);