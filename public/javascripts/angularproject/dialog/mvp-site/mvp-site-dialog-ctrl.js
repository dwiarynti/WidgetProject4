"use strict";

angular.module('app').controller('mvp-sitedialogcontroller',
    ['$scope', '$filter', 'dataService','roomResource',
    function ($scope, $filter, dataService, roomResource) {
        // var sitesiteresource = new sitesiteResource();
        var roomresource = new roomResource();

        $scope.configuration = {
            "datasource":0,
        };

        $scope.datasourcelist = [];
        $scope.fieldnamelist = [];
        $scope.fieldvalue = [];
        $scope.returneddatatypes = ["list", "singledata"];
        // var siteid = "001";

        $scope.init = function(){
            // $scope.$parent.item.widgetSettings.configuration.conditions.datasource = JSON.parse($scope.$parent.item.widgetSettings.configuration.conditions.datasource);       
            if($scope.$parent.item.widgetSettings.configuration != undefined)
                $scope.configuration = $scope.$parent.item.widgetSettings.configuration;
        }

        $scope.init();

        $scope.saveSettings = function () {
            $scope.configuration.datasource = parseInt($scope.configuration.datasource);
            $scope.item.widgetSettings.configuration = $scope.configuration; 
            $scope.$close();
        };
        
        $scope.getDataSource = function(){
            roomresource.$getsite(function(data){
                console.log(data);
                if(data.success)
                    $scope.datasourcelist = data.obj

            });
        }



        $scope.getDataSource();

        
        $scope.isSelectedItem = function(itemA, itemB){
            return itemA == itemB ? true:false;
        }
    }]);