angular.module('app').controller('mpv-devicecontroller',
    ['$scope', '$rootScope', '$filter','roomdevResource', 'roomResource', "NgTableParams",
        function ($scope, $rootScope, $filter, roomdevResource, roomResource,NgTableParams) {
            var roomdevresource = new roomdevResource();
            $scope.listobj = [];
            $scope.cols = [];
            $scope.locationwidgets = [];
            $scope.listapplicationwidget = $scope.$parent.$parent.$parent.$parent.applicationObj.widget;

            $scope.widgetdata = $scope.$parent.item; 
console.log($scope.widgetdata);
            $scope.getAllDevice = function(){
                roomdevresource.$getAll(function(data){
                    if(data.success)
                        $scope.listobj = data.obj;
                        $scope.showSeveralLocationRows(data.obj);
                        $scope.setTable();
                });
            }

            $scope.getDevicebyLocation = function(locationList){
                angular.forEach(locationList, function(location){
                    //getroomdev by location
                    // roomdevresource.$getAll(function(data){
                    //     if(data.success)
                            $scope.listobj = [];
                            $scope.showSeveralLocationRows([]);
                            $scope.setTable();
                    // });
                });
            }

            var self = this;
            $scope.setTable = function(){
                self.tableParams = new NgTableParams({
                    count: $scope.listobj.length
                }, {
                    counts: [],
                    dataset: $scope.listobj
                });
                // console.log($scope.listobj);
                $scope.getcolumn();
            }

            $scope.getcolumn = function(){
                if( $scope.widgetdata.widgetSettings.configuration.cols.length > 0){
                    $scope.cols = $scope.widgetdata.widgetSettings.configuration.cols;
                }
                else{
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

            $scope.showSeveralLocationRows = function(newLocationData){
                var count  = 0;
                    angular.forEach(newLocationData, function(data){
                        var selectRowsStatus = $scope.widgetdata.widgetSettings.configuration.selectRowsStatus;
                        if($scope.widgetdata.widgetSettings.configuration.rows.length == 0){
                            data.display = count <= 2 ? true:false;
                        }else{
                            var obj = $filter('filter')($scope.widgetdata.widgetSettings.configuration.rows, function(row){
                                return data.euid === row.euid
                            })[0];
                            if(obj != null){
                                data.display = !obj.display && count <= 2 && !selectRowsStatus ? true : obj.display;
                            }else{
                                data.display = false;
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

            $scope.init = function(){
                var getselectedLocation = $scope.getLocationWidget();
                if(getselectedLocation.length > 0){
                    $scope.getDevicebyLocation(getselectedLocation);
                }else{
                    $scope.getAllDevice();                    
                }
                
            }

            $scope.$watchCollection(
                function () {return $scope.widgetdata.widgetSettings.configuration.initializeStatus;}
            ,  function (newValue,oldValue) {
                console.log(newValue);
                $scope.init();
                $scope.widgetdata.widgetSettings.configuration.initializeStatus = false;
            });

            $scope.init();

        }
    ]);