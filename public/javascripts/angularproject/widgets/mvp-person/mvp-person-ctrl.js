angular.module('app').controller('mpv-personcontroller',
    ['$scope', '$rootScope', '$filter', "NgTableParams", "personResource",
        function ($scope, $rootScope, $filter, NgTableParams, personResource) {
            var personresource = new personResource();
            $scope.listobj = [];

            $scope.widgetdata = $scope.$parent.item; 

            $scope.getAllPerson = function(){
                personresource.$getAll(function(data){
                    if(data.success){
                        $scope.listobj = data.obj;
                        $scope.showSeveralLocationRows(data.obj);
                        $scope.setTable();
                    }
                });
            }

            $scope.getPersonbyDevice = function(){

            }

            var self = this;
            $scope.setTable = function(){
                self.tableParams = new NgTableParams({
                    count: $scope.listobj.length
                }, {
                    counts: [],
                    dataset: $scope.listobj
                });
                console.log($scope.listobj);
                $scope.getcolumn();
            }

            $scope.showSeveralLocationRows = function(newLocationData){
                var count  = 0;
                    angular.forEach(newLocationData, function(data){
                        var selectRowsStatus = $scope.widgetdata.widgetSettings.configuration.selectRowsStatus;
                        if($scope.widgetdata.widgetSettings.configuration.rows.length == 0){
                            data.display = count <= 2 ? true:false;
                        }else{
                            var obj = $filter('filter')($scope.widgetdata.widgetSettings.configuration.rows, function(row){
                                return data.uuid === row.uuid
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

            $scope.init = function(){
                $scope.getAllPerson();
            }
        }
    ]);