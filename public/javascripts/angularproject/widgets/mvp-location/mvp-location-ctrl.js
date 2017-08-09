angular.module('app').controller('mpv-locationcontroller',
    ['$scope', '$rootScope', '$filter','deviceResource', 'roomResource', "NgTableParams", "DTOptionsBuilder", "DTColumnBuilder", "$resource",
        function ($scope, $rootScope, $filter, deviceResource, roomResource,NgTableParams, DTOptionsBuilder, DTColumnBuilder, $resource) {
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

            $scope.locmanagementcontrol = {};

            $scope.colDefs = $scope.widgetdata.widgetSettings.configuration.cols.length > 0 ? 
                $scope.widgetdata.widgetSettings.configuration.cols : 
                [
                    { field: "areatype", displayName: "Area Type" },
                    { field: "parentname", displayName: "Parent" },
                    { field: "shortaddress", displayName: "Short Address" },
                    { field: "fulladdress", displayName: "Full Address" }
                ];
            $scope.expandingProperty = {
                field: "name",
                displayName: "Name",
                filterable: true
            };
            
            $scope.getcolumn = function(){
                if( $scope.widgetdata.widgetSettings.configuration.cols.length > 0){
                    $scope.cols = $scope.widgetdata.widgetSettings.configuration.cols;
                    $scope.colDefs = $scope.widgetdata.widgetSettings.configuration.cols;
                }
                else{
                    $scope.cols = $scope.colDefs;
                    $scope.widgetdata.widgetSettings.configuration.cols = $scope.cols;
                }
            }

            $scope.getSiteId = function() {
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

            $scope.reinitDeviceWidget = function(){
                var othersWidget = $filter('filter')($scope.listapplicationwidget,function(widget){
                    return widget.widgetSettings.name !== 'site' && widget.widgetSettings.name !== 'location'
                });
                angular.forEach(othersWidget, function(widget) {
                    widget.widgetSettings.configuration.initializeStatus = true;
                });
            }
            

            $scope.putDashforEmptyValue = function(){
                if($scope.listobj.length > 0){
                    var fieldname = Object.keys($scope.listobj[0]);
                    angular.forEach(fieldname, function(dta){
                        angular.forEach($scope.listobj, function(obj){
                            if(obj.uuid != ''){
                                obj[dta] = obj[dta] != 0 || obj[dta] != '' ?obj[dta]:"-";
                            }
                        });
                    });

                }

            }
            //promise sample
            // $scope.getAllLocation = function(){
            //     roomResource.getall().$promise.then(function(data){
            //         $scope.listobj = data.obj;
            //         $scope.showSeveralLocationRows(data.obj);
            //     });
            // }

            $scope.getAllLocation = function(){
                roomresource.$getall(function(data){
                    $scope.listobj = data.obj;
                    $scope.putDashforEmptyValue();
                    $scope.showSeveralLocationRows(data.obj);
                    $scope.getcolumn();
                    $scope.reinitDeviceWidget();
                    $scope.widgetdata.widgetSettings.configuration.initializeStatus = false;
                });
            }

            $scope.getLocationbySite = function(siteid){
                roomresource.$getloc({_id:siteid}, function(data){
                    if(data.success){
                        $scope.listobj = data.obj;
                        $scope.putDashforEmptyValue();
                        $scope.showSeveralLocationRows(data.obj);
                        $scope.getcolumn();
                        $scope.reinitDeviceWidget();
                        $scope.widgetdata.widgetSettings.configuration.initializeStatus = false;
                    }
                });
            }

            //get widget site
            $scope.getSites = function(){
                $scope.sitewidgets = $filter('filter')($scope.listapplicationwidget,function(widget){
                    return widget.widgetSettings.name === 'site'
                });

                $rootScope.sitelist = [];
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

            $scope.convertlisttotree = function(data){
                var ltt = new LTT(data, {
                    key_id: 'uuid',
                    key_parent: 'parent',
                    key_child : 'children'
                });
                var tree = ltt.GetTree();
                return tree;
            }

            $scope.showSeveralLocationRows = function(newLocationData){
                if($scope.widgetdata.widgetSettings.configuration.selectedrows.length > 0 && !$scope.widgetdata.widgetSettings.configuration.initializeStatus){
                    $scope.listobj = $scope.convertlisttotree($scope.widgetdata.widgetSettings.configuration.selectedrows);  
                    angular.forEach(newLocationData, function(data){
                        var getselectedrows = $filter('filter')($scope.widgetdata.widgetSettings.configuration.rows,function(row){
                            return data.uuid === row.uuid
                        })[0];
                        data.display = getselectedrows != undefined ? getselectedrows.display : false;
                    }); 
                    $scope.widgetdata.widgetSettings.configuration.rows = newLocationData
                }else{
                    angular.forEach(newLocationData, function(data){
                        data.display = true;
                    });
                    $scope.listobj = $scope.convertlisttotree(newLocationData);                
                    $scope.widgetdata.widgetSettings.configuration.selectedrows = newLocationData;
                    $scope.widgetdata.widgetSettings.configuration.rows = newLocationData;
                }
                
                console.log($scope.widgetdata.widgetSettings.configuration.rows);
            }

            $scope.$watchCollection(
                function () {return $scope.widgetdata.widgetSettings.configuration.initializeStatus;}
            ,  function (newValue,oldValue) {
                if($scope.widgetdata.widgetSettings.configuration.initializeStatus){
                    $scope.init();
                    
                }
            });

            $scope.init = function(){
                $scope.getSites();
                $scope.getLocationData();
            }

            $scope.init();
        }
    ]);