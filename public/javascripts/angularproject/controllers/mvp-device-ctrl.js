angular.module('app').controller('mpv-devicecontroller',
    ['$scope','deviceResource',
        function ($scope, deviceResource) {
            $scope.deviceList = [];
            var deviceresource = new deviceResource();
            var siteid = "001";


            $scope.$watch(function () {
                return $scope.$parent.item.widgetSettings.selectedfilter;
            }, function () {
                var selectedfilter = $scope.$parent.item.widgetSettings.selectedfilter;
                deviceresource.devicename = selectedfilter != ""?selectedfilter:null;
                deviceresource.$filter({_id:siteid}, function(data){
                    $scope.deviceList = data.obj;
                });
            });



        }
    ]);