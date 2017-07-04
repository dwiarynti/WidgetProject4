angular.module('app').controller('mpv-sitecontroller',
    ['$scope', '$rootScope','deviceResource', 'roomResource',
        function ($scope, $rootScope, deviceResource, roomResource) {
            $scope.deviceList = [];
            var roomresource = new roomResource();
            var deviceresource = new deviceResource();
            var siteid = "001";
            $scope.obj = "";
                   
            $scope.getWdigetValue = function(){
                roomresource.$getbyid({_id:$scope.$parent.item.widgetSettings.configuration.datasource},function(data){
                    if(data.success){
                        $scope.obj = data.obj.name;
                    }
                });
            }

            if($scope.$parent.item.widgetSettings.configuration.datasource != undefined){
                $scope.getWdigetValue();
            }else{
                $scope.obj = $rootScope.number.site == 0 ? 'label':'label'+$rootScope.number.site;
                $rootScope.number.site = $rootScope.number.site +1;
            }


            $scope.$watch(function () {
                return $scope.$parent.item.widgetSettings.configuration.datasource;
            }, function () {
                if($scope.$parent.item.widgetSettings.configuration.datasource != undefined){
                    $scope.getWdigetValue();
                }
            });
        }
    ]);