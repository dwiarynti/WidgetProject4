angular.module('app').controller('mpv-locationcontroller',
    ['$scope', '$rootScope', '$filter','deviceResource', 'roomResource', "NgTableParams",
        function ($scope, $rootScope, $filter, deviceResource, roomResource,NgTableParams) {
            $scope.deviceList = [];
            var roomresource = new roomResource();
            var deviceresource = new deviceResource();
            var siteid = "001";
            $scope.listobj = [];
            $scope.listapplicationwidget = $scope.$parent.$parent.$parent.$parent.applicationObj.widget;
            
            $scope.cols = [];
            $rootScope.cols = [];
            $scope.tableParams = {};
            $rootScope.sitelist = [];
            $scope.sitewidgets = [];

            $scope.getcolumn = function(){
                if( $scope.$parent.item.widgetSettings.configuration.cols.length > 0){
                    $scope.cols = $scope.$parent.item.widgetSettings.configuration.cols;
                }
                else{
                    var getListFieldName = Object.keys($scope.listobj[0]);
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
            }

            $scope.getSiteId = function(params) {
                var siteid = 0;
                if($scope.$parent.item.widgetSettings.configuration.siteid != 0){
                    siteid = $scope.$parent.item.widgetSettings.configuration.siteid;
                }else if($scope.sitewidgets.length == 1){
                    siteid = $scope.sitewidgets[0].widgetSettings.configuration.datasource;
                }else{
                    
                }
                return siteid;
            }

            $scope.getLocationData = function(){
                var siteid = $scope.getSiteId();
                if(siteid != 0)
                    $scope.getLocationbySite(siteid);
                else
                    $scope.getAllLocation();
            }

            $scope.$watch(
                function () {return $scope.$parent.item.widgetSettings.configuration;}, function () {
                $scope.getLocationData();
            });

            $scope.$watch(
                function () {return  $scope.$parent.$parent.$parent.$parent.applicationObj.widget;}
            ,  function () {
                $scope.getSites();
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

            $scope.getLocationbySite = function(siteid){
                roomresource.$getloc({_id:siteid}, function(data){
                    if(data.success){
                        $scope.listobj = data.obj;
                        $scope.setTable();
                    }
                });
            }

            $scope.getSites = function(){
                $scope.sitewidgets = $filter('filter')($scope.listapplicationwidget,function(widget){
                    return widget.widgetSettings.name === 'site'
                });
                console.log($scope.sitewidgets)
                if($scope.sitewidgets.length != 0){
                    $rootScope.sitelist = [];
                }
                angular.forEach($scope.sitewidgets, function(widget) {
                    roomresource.$getbyid({_id:widget.widgetSettings.configuration.datasource}, function(data){
                        if(data.success){
                            $rootScope.sitelist.push(data.obj);
                        }
                    });
                }, this);
            }
            // $scope.getSites();
        }
    ]);