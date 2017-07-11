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
            $scope.widgetdata = $scope.$parent.item;
            $rootScope.initwidget = false;

            $scope.getcolumn = function(){
                if( $scope.widgetdata.widgetSettings.configuration.cols.length > 0){
                    $scope.cols = $scope.widgetdata.widgetSettings.configuration.cols;
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
                    $scope.widgetdata.widgetSettings.configuration.cols = $scope.cols;
                }
            }

            $scope.getSiteId = function(params) {
                var siteid = 0;
                if($scope.sitewidgets.length > 0){
                    var siteid1 = $scope.widgetdata.widgetSettings.configuration.siteid; //old
                    var siteid2 = $scope.sitewidgets[0].widgetSettings.configuration.datasource; //new
                    if((siteid1 == siteid2 && $scope.sitewidgets.length == 1) || (siteid1 != siteid2 && $scope.sitewidgets.length == 1)){
                        siteid = siteid2 != undefined ? siteid2 : 0;
                    }else if(siteid1 != 0){
                        siteid = siteid1;
                    }
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
                    $scope.showSeveralLocationRows(data.obj);
                    $scope.setTable();
                });
            }

            $scope.getLocationbySite = function(siteid){
                roomresource.$getloc({_id:siteid}, function(data){
                    if(data.success){
                        $scope.listobj = data.obj;
                        $scope.showSeveralLocationRows(data.obj);
                        $scope.setTable();
                    }
                });
            }

            $scope.getSites = function(){
                $scope.sitewidgets = $filter('filter')($scope.listapplicationwidget,function(widget){
                    return widget.widgetSettings.name === 'site'
                });
                if($scope.sitewidgets.length != 0){
                    $rootScope.sitelist = [];
                }
                angular.forEach($scope.sitewidgets, function(widget) {
                    if(widget.widgetSettings.configuration.datasource != undefined){
                    roomresource.$getbyid({_id:widget.widgetSettings.configuration.datasource}, function(data){
                        if(data.success){
                            var isRedundantdata = $filter('filter')($rootScope.sitelist,function(site){
                                        return site.uuid === data.obj.uuid
                                    }).length > 0 ? true:false;
                            if(!isRedundantdata){
                                $rootScope.sitelist.push(data.obj);
                            }
                        }
                    });
                    }

                });
            }

            $scope.showSeveralLocationRows = function(newLocationData){
                var count  = 0;
                if($scope.widgetdata.widgetSettings.configuration.rows.length == 0){
                    angular.forEach(newLocationData, function(data){
                        if(data.display == undefined){
                            count = count +1;
                            data.display = false;
                            // data.display = count < 3 ? true:false;
                        }
                    }); 
                }else {
                    angular.forEach(newLocationData, function(data){
                        var obj = $filter('filter')($scope.widgetdata.widgetSettings.configuration.rows, function(row){
                            return data.uuid === row.uuid
                        })[0];
                        data.display = obj != null ? obj.display:false;
                    }); 
                }
                $scope.widgetdata.widgetSettings.configuration.rows = newLocationData;
            }

            $scope.$watchCollection(
                function () {return $rootScope.initwidget;}
            ,  function (newValue,oldValue) {
                $scope.init();
            });

            $scope.init = function(){
                $scope.getSites();
                $scope.getLocationData();
            }

            $scope.init();
        }
    ]);