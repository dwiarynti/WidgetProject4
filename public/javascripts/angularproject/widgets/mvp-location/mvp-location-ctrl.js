angular.module('app').controller('mpv-locationcontroller',
    ['$scope', '$rootScope', '$filter','deviceResource', 'roomResource', "NgTableParams",
        function ($scope, $rootScope, $filter, deviceResource, roomResource,NgTableParams) {
            $scope.deviceList = [];
            var roomresource = new roomResource();
            var deviceresource = new deviceResource();
            $scope.listapplicationwidget = $scope.$parent.$parent.$parent.$parent.applicationObj.widget;
            var siteid = "001";
            $scope.listobj = [];
            
            $scope.cols = [];
            $rootScope.cols = [];
            $scope.tableParams = {};

            $scope.getcolumn = function(){
                var getListFieldName = Object.keys($scope.listobj[0]);
                if($scope.$parent.item.widgetSettings.configuration.cols != undefined)
                    $scope.cols = $scope.$parent.item.widgetSettings.configuration.cols;
                else
                    var number = 5;
                    var count  = 0;
                    angular.forEach(getListFieldName, function(fieldName){
                        if(count < 5)
                            $scope.cols.push({field:fieldName, title: fieldName, show:true});
                        else
                            $scope.cols.push({field:fieldName, title: fieldName, show:false});
                        count = count +1;
                    });
                    $scope.$parent.item.widgetSettings.configuration.cols = $scope.cols;
            }


            $scope.$watch(function () {
                return $scope.$parent.item.widgetSettings.configuration;
            }, function () {
                if($scope.$parent.item.widgetSettings.configuration.siteid != undefined)
                    $scope.getLocationbySite();
                else
                    $scope.getAllLocation();
            });
            var self = this;
            $scope.setTable = function(){
                self.tableParams = new NgTableParams({}, {
                    counts: [],
                    dataset: $scope.listobj
                });
                $scope.getcolumn();
            }

            $scope.getAllLocation = function(){
                roomresource.$getall(function(data){
                    $scope.listobj = data.obj;
                    $scope.setTable();
                });
            }

            $scope.getLocationbySite = function(){
                roomresource.$getloc({_id:$scope.$parent.item.widgetSettings.configuration.siteid}, function(data){
                    if(data.success){
                        $scope.listobj = data.obj;
                        $scope.setTable();
                    }
                });
            }
        }
    ]);