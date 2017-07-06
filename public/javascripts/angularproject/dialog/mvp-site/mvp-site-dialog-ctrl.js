"use strict";

angular.module('app').controller('mvp-sitedialogcontroller',
    ['$scope', '$rootScope', '$filter', 'dataService','roomResource',
    function ($scope, $rootScope, $filter, dataService, roomResource) {
        var roomresource = new roomResource();

        $scope.configuration = {
            "datasource":0,
        };

        $scope.datasourcelist = [];
        $scope.fieldnamelist = [];
        $scope.fieldvalue = [];
        $scope.returneddatatypes = ["list", "singledata"];
        $scope.listapplicationwidget = $scope.$parent.$parent.$parent.$parent.applicationObj.widget;
        $rootScope.isSingleSiteUpdated = false;
        $scope.init = function(){
            if($scope.$parent.item.widgetSettings.configuration != undefined)
                $scope.configuration = $scope.$parent.item.widgetSettings.configuration;
        }

        $scope.init();

        $scope.saveSettings = function () {
            $scope.configuration.datasource = parseInt($scope.configuration.datasource);
            $scope.item.widgetSettings.configuration = $scope.configuration; 
            $scope.updatesitelist();
            $scope.$close();
        };
        
        $scope.getDataSource = function(){
            roomresource.$getsite(function(data){
                // console.log(data);
                if(data.success)
                    $scope.datasourcelist = data.obj

            });
        }

        $scope.getDataSource();

        $scope.isSelectedItem = function(itemA, itemB){
            return itemA == itemB ? true:false;
        }

        $scope.updatesitelist = function(){
                $scope.sitewidgets = $filter('filter')($scope.listapplicationwidget,function(widget){
                    return widget.widgetSettings.name === 'site'
                });
                $rootScope.isSingleSiteUpdated = true;
                // if($scope.sitewidgets.length == 1){
                    
                // }
            }
    }]);