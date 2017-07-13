"use strict";

angular.module('app').controller('mvp-devicedialogcontroller',
    ['$scope', '$rootScope', '$filter', 'dataService','roomResource',
    function ($scope, $rootScope, $filter, dataService, roomResource) {
        var roomresource = new roomResource();
        $scope.listapplicationwidget = $scope.$parent.$parent.$parent.$parent.applicationObj.widget;
        $rootScope.isSingleSiteUpdated = false;
        $scope.configuration = {
            "siteid":$scope.item.widgetSettings.configuration.siteid != undefined ? $scope.item.widgetSettings.configuration.siteid : 0,
            "cols":$scope.item.widgetSettings.configuration.cols != undefined ? $scope.item.widgetSettings.configuration.cols : []
        };
        $scope.fieldnamelist = [];
        $scope.sitelist = $rootScope.sitelist;
        // console.log($scope.sitelist);
        // $scope.init = function(){  
        //         var sitewidgets = $filter('filter')($scope.listapplicationwidget,function(widget){
        //                 return widget.widgetSettings.name === 'site'
        //         });
        //         angular.forEach(sitewidgets, function(widget) {
        //             roomresource.$getbyid({_id:widget.widgetSettings.configuration.datasource}, function(data){
        //                 if(data.success){
                            
        //                     $scope.sitelist.push(data.obj);
        //                 }
        //             });
        //         }, this);
        // }

        // $scope.init();

        $scope.saveSettings = function () {
            $scope.configuration.siteid = parseInt($scope.configuration.siteid);
            $scope.item.widgetSettings.configuration = $scope.configuration; 
            $rootScope.isSingleSiteUpdated = true;
            // console.log($scope.item.widgetSettings.configuration);
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
            
            // console.log($scope.configuration.fieldname);
        }

        
            // $scope.$watch(function () {
            //     return $scope.$parent.$parent.$parent.$parent.applicationObj.widget;
            // }, function () {
            //     $scope.listapplicationwidget = $scope.$parent.$parent.$parent.$parent.applicationObj.widget;
            //     $scope.init();
            // });



    }]);