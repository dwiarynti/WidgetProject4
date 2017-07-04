"use strict";

angular.module('app').controller('mvp-labeldialogcontroller',
    ['$scope', '$filter', 'dataService','widgetmanagementResource',
    function ($scope, $filter, dataService, widgetmanagementResource) {
        // var labelsiteresource = new labelsiteResource();
        var widgetmanagementresource = new widgetmanagementResource();

        $scope.configuration = {
            "placeholder":"", 
            "datasource":{}, 
            "fieldname":"", 
            "conditions":[],
            "returneddatatype":""
        };

        $scope.datasourcelist = [];
        $scope.fieldnamelist = [];
        $scope.fieldvalue = [];
        $scope.returneddatatypes = ["list", "singledata"];
        // var siteid = "001";

        $scope.getDataSourceFeilds = function(){
            if($scope.configuration.datasource != "")
            {
                var datasourcetype = typeof($scope.configuration.datasource);
                var datasource = datasourcetype != "string" ? $scope.configuration.datasource : JSON.parse($scope.configuration.datasource);
                $scope.fieldnamelist = datasource.field;
            }

        }

        $scope.init = function(){
            // $scope.$parent.item.widgetSettings.configuration.conditions.datasource = JSON.parse($scope.$parent.item.widgetSettings.configuration.conditions.datasource);       
            if($scope.$parent.item.widgetSettings.configuration.conditions != undefined)
                $scope.configuration = $scope.$parent.item.widgetSettings.configuration.conditions;
                $scope.getDataSourceFeilds();
        }

        $scope.init();

        $scope.saveSettings = function () {
            // $scope.configuration.datasource = JSON.parse($scope.configuration.datasource);
            $scope.configuration.returneddatatype = "singledata";
            var datasourcetype = typeof($scope.configuration.datasource);
            $scope.configuration.datasource = datasourcetype != "string" ? $scope.configuration.datasource : JSON.parse($scope.configuration.datasource);
            $scope.item.widgetSettings.configuration.conditions = $scope.configuration; 
            $scope.$close();
        };

        $scope.addcondition = function(){
            $scope.configuration.conditions.push({
                "fieldname":"",
                "value":"",
                "fieldvalue":[],
            })
        }
        
        $scope.getDataSource = function(){
            widgetmanagementresource.$get(function(data){
                if(data.success)
                    $scope.datasourcelist = data.obj

            });
        }



        $scope.getDataSource();

        $scope.getValue=function(obj, conditionobj){
            conditionobj.fieldvalue = [];
                angular.forEach($scope.datasourcelist, function (datasource) {
                    if(datasource.data != undefined)
                        angular.forEach(datasource.data, function (data) {
                            if(data.hasOwnProperty(obj))
                                conditionobj.fieldvalue.push(data[obj])
                        });

                });
        }
        
        $scope.isSelectedItem = function(itemA, itemB){
            return itemA == itemB ? true:false;
        }
    }]);