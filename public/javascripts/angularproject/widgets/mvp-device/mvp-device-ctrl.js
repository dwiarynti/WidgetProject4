angular.module('app').controller('mpv-devicecontroller',
    ['$scope', '$rootScope', '$filter','roomdevResource', 'roomResource', "NgTableParams",
        function ($scope, $rootScope, $filter, roomdevResource, roomResource,NgTableParams) {
            var roomdevresource = new roomdevResource();
            $scope.listobj = [];
            $scope.cols = [];
            $scope.locationwidgets = [];
            $scope.listapplicationwidget = $scope.$parent.$parent.$parent.$parent.applicationObj.widget;
            $scope.backuplist = [];

            $scope.widgetdata = $scope.$parent.item; 
            $scope.getAllDevice = function(){
                $scope.widgetdata.widgetSettings.configuration.initializeStatus = false;
                roomdevresource.$getAll(function(data){
                    if(data.success)
                        $scope.listobj = data.obj;
                        $scope.widgetdata.widgetSettings.configuration.backuplist = angular.copy($scope.listobj); 
                         $scope.putDashforEmptyValue($scope.listobj);                   
                        $scope.showSeveralLocationRows(data.obj);
                        $scope.setTable();
                });
            }

            $scope.getDevicebyLocation = function(locationList){
                // $scope.listobj = [];
                $scope.listobj = $scope.widgetdata.widgetSettings.configuration.initializeStatus ? []:$scope.listobj;
                $scope.widgetdata.widgetSettings.configuration.initializeStatus = false;
                angular.forEach(locationList, function(locdata){
                    //getroomdev by location
                    // console.log(location);
                    roomdevresource.$getbylocation({_id:locdata.uuid},function(data){
                        if(data.success)
                            angular.forEach(data.obj, function(obj){
                                var isDataExisted = $filter('filter')($scope.listobj, function(existedobj){
                                    return obj.euid === existedobj.euid
                                });
                                if(isDataExisted.length == 0){
                                    $scope.listobj.push(obj);
                                }
                            });
                    });
                });
                console.log($scope.listobj);
            }

            var self = this;
            $scope.setTable = function(){
                self.tableParams = new NgTableParams({
                    count: $scope.listobj.length
                }, {
                    counts: [],
                    dataset: $scope.listobj
                });
                $scope.getcolumn();
            }

            $scope.getcolumn = function(){
                if( $scope.widgetdata.widgetSettings.configuration.cols.length > 0){
                    $scope.cols = $scope.widgetdata.widgetSettings.configuration.cols;
                }
                else{
                    if($scope.listobj.length > 0){
                        var getListFieldName = Object.keys($scope.listobj[0]);
                        var count  = 0;
                        angular.forEach(getListFieldName, function(fieldName){
                            if(fieldName != 'display'){
                                if(count < 5)
                                    $scope.cols.push({field:fieldName, title: fieldName, show:true});
                                else
                                    $scope.cols.push({field:fieldName, title: fieldName, show:false});
                                count = count +1;
                            }

                        });
                        $scope.widgetdata.widgetSettings.configuration.cols = $scope.cols;
                    }

                }
            }

            $scope.putDashforEmptyValue = function(data){
                if(data.length > 0 ){
                    var fieldname = Object.keys(data[0]);
                    angular.forEach(fieldname, function(dta){
                        angular.forEach(data, function(obj){
                            if(obj.euid != ''){
                                obj[dta] = obj[dta] != 0 || obj[dta] != '' ?obj[dta]:"-";
                            }
                        });
                    });
                }
            }

            $scope.showSeveralLocationRows = function(newLocationData){
                var count  = 0;
                    angular.forEach(newLocationData, function(data){
                        var selectRowsStatus = $scope.widgetdata.widgetSettings.configuration.selectRowsStatus;
                        if($scope.widgetdata.widgetSettings.configuration.rows.length == 0){
                            data.display = count <= 4 ? true:false;
                        }else{
                            var obj = $filter('filter')($scope.widgetdata.widgetSettings.configuration.rows, function(row){
                                return data.euid === row.euid
                            })[0];
                            if(obj != null && obj.euid != ''){
                                // obj.display = 
                                data.display = (!obj.display || obj.display == undefined) && count <= 4 && !selectRowsStatus ? true : obj.display;
                            }else{
                                data.display = count <= 4 ? true : false;
                            }
                        }
                        count = data.display == true ? count +1:count;
                    }); 
                $scope.widgetdata.widgetSettings.configuration.rows = newLocationData;
            }

            $scope.getLocationWidget = function(){
                $scope.locationwidgets = $filter('filter')($scope.listapplicationwidget,function(widget){
                    return widget.widgetSettings.name === 'location'
                });
                var selectedLocationRow = [];
                angular.forEach($scope.locationwidgets, function(widget){
                    var rows = widget.widgetSettings.configuration.rows;
                    angular.forEach(rows, function(row){
                        if(row.display){
                            selectedLocationRow.push(row);
                        }
                    });
                });
                return selectedLocationRow;
            }

            $scope.filterdevicebydevicetype = function(){
                var datatype = $scope.widgetdata.widgetSettings.configuration.devicetype;
                var newobj = [];
                $scope.listobj = $filter('filter')($scope.listobj, function(obj){
                                    return obj.type === datatype
                                });
                console.log($scope.listobj);
            }

            $scope.init = function(){
                var getselectedLocation = $scope.getLocationWidget();
                if(getselectedLocation.length > 0){
                    $scope.getDevicebyLocation(getselectedLocation);
                    $scope.$watchCollection(
                        function () {return $scope.listobj;}
                    ,  function (newValue,oldValue) {
                        if($scope.listobj.length > 0){
                            $scope.widgetdata.widgetSettings.configuration.backuplist = angular.copy($scope.listobj);
                        }
                        if($scope.widgetdata.widgetSettings.configuration.devicetype != ''){
                            $scope.filterdevicebydevicetype();
                        }
                         $scope.putDashforEmptyValue($scope.listobj);
                        $scope.showSeveralLocationRows($scope.listobj);
                        $scope.setTable();
                    });
                }else{
                    $scope.getAllDevice();   
                                     
                }
            }

            $scope.$watchCollection(
                function () {return $scope.widgetdata.widgetSettings.configuration.initializeStatus;}
            ,  function (newValue,oldValue) {
                // console.log(newValue);
                console.log($scope.widgetdata.widgetSettings.configuration.devicetype);
                if($scope.widgetdata.widgetSettings.configuration.initializeStatus){
                    $scope.init();
                }
                
            });

            $scope.init();

        }
    ]);