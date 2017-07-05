"use strict";

angular.module('app').controller('mvp-locationdialogcontroller',
    ['$scope', '$rootScope', '$filter', 'dataService','roomResource',
    function ($scope, $rootScope, $filter, dataService, roomResource) {
        var roomresource = new roomResource();
        $scope.listapplicationwidget = $scope.$parent.$parent.$parent.$parent.applicationObj.widget;

        $scope.configuration = {
            "siteid":$scope.item.widgetSettings.configuration.siteid != undefined ? $scope.item.widgetSettings.configuration.siteid : 0,
            "cols":$scope.item.widgetSettings.configuration.cols != undefined ? $scope.item.widgetSettings.configuration.cols : []
        };
        $scope.fieldnamelist = [];
        $scope.sitelist = [];
        // $scope.cols = $rootScope.cols;
        // $scope.getDataSourceFeilds = function(){
        //     if($scope.configuration.datasource != "")
        //     {
        //         var datasourcetype = typeof($scope.configuration.datasource);
        //         var datasource = datasourcetype != "string" ? $scope.configuration.datasource : JSON.parse($scope.configuration.datasource);

        //         // angular.forEach(datasource.field, function (fieldname) {
        //         //     var isSelected = $filter('filter')($scope.configuration.fieldname,function(selectedfieldname){
        //         //         return selectedfieldname === fieldname
        //         //     })[0] != undefined ? true:false;
        //         //     console.log($filter('filter')($scope.configuration.fieldname,function(selectedfieldname){
        //         //         return selectedfieldname === fieldname
        //         //     })[0]);
        //         //     $scope.fieldnamelist.push({"key":fieldname, "isSelected":isSelected});
        //         // });
        //     }

        // }

        $scope.init = function(){  
                var sitewidgets = $filter('filter')($scope.listapplicationwidget,function(widget){
                        return widget.widgetSettings.name === 'site'
                });
                angular.forEach(sitewidgets, function(widget) {
                    roomresource.$getbyid({_id:widget.widgetSettings.configuration.datasource}, function(data){
                        if(data.success){
                            
                            $scope.sitelist.push(data.obj);
                        }
                    });
                }, this);
        }

        $scope.init();

        $scope.saveSettings = function () {
            $scope.configuration.siteid = parseInt($scope.configuration.siteid);
            $scope.item.widgetSettings.configuration = $scope.configuration; 
            console.log($scope.item.widgetSettings.configuration);
            $scope.$close();
        };
        
        $scope.getDataSource = function(){
            // roomResource.$get(function(data){
            //     if(data.success)
            //         $scope.datasourcelist = data.obj

            // });
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