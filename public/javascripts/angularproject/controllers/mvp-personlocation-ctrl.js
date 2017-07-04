angular.module('app').controller('mpv-personlocationcontroller',
    ['$scope','personlocationResource',
        function ($scope, personlocationResource) {
            $scope.personlocationList = [];
            var personlocationresource = new personlocationResource();
            var siteid = "001";

            $scope.$watch(function () {
                return $scope.$parent.item.widgetSettings.selectedfilter;
            }, function () {
                var selectedfilter = $scope.$parent.item.widgetSettings.selectedfilter;
                personlocationresource.devicename  = selectedfilter || null;
                personlocationresource.$filter({_id:siteid}, function(data){
                    $scope.personlocationList = data.obj;
                });
            });
        }
    ]);