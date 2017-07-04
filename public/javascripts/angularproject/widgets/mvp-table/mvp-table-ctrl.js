angular.module('app').controller('mpv-tablecontroller',
    ['$scope','deviceResource', 'widgetmanagementResource',
        function ($scope, deviceResource, widgetmanagementResource) {
            $scope.deviceList = [];
            var widgetmanagementresource = new widgetmanagementResource();
            var deviceresource = new deviceResource();
            var siteid = "001";
            $scope.listobj = [];
            $scope.listobj = [{
                    "Field1": "-",
                    "Field2": "-",
                    "Field3": "-",
                    "Field4": "-"
                }, {
                    "Field1": "-",
                    "Field2": "-",
                    "Field3": "-",
                    "Field4": "-"
                }];

            // if($scope.$parent.item.widgetSettings.configuration.conditions != undefined){
            //     widgetmanagementresource.conditions = $scope.$parent.item.widgetSettings.configuration.conditions;
            //     widgetmanagementresource.$getdata(function(data){
            //         if(data.success){
            //             $scope.obj = data.obj;
            //         }
            //     });
            // }

            $scope.$watch(function () {
                return $scope.$parent.item.widgetSettings.selectedfilter;
            }, function () {
                var selectedfilter = $scope.$parent.item.widgetSettings.selectedfilter;
                deviceresource.devicename = selectedfilter != ""?selectedfilter:null;
                deviceresource.$filter({_id:siteid}, function(data){
                    $scope.deviceList = data.obj;
                });
            });

            $scope.setting = function(){
                
            }



        }
    ]);