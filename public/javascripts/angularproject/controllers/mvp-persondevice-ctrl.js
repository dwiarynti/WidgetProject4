angular.module('app').controller('mpv-persondevicecontroller',
    ['$scope','persondeviceResource',
        function ($scope, persondeviceResource) {
            $scope.persondeviceList = [];
            var persondeviceresource = new persondeviceResource();
            var siteid = "001";
            $scope.$watch(function () {
                return $scope.$parent.item.widgetSettings.selectedfilter;
            }, function () {
                var selectedfilter = $scope.$parent.item.widgetSettings.selectedfilter;
                persondeviceresource.devicename = selectedfilter != ""?selectedfilter:null;
                persondeviceresource.$filter({_id:siteid}, function(data){
                    $scope.persondeviceList = data.obj;
                });
            });

        }
    ]);