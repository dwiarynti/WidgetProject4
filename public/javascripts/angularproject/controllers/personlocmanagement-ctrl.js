angular.module('app').controller('personlocmanagementcontroller',
    ['$scope', '$rootScope','personlocResource', 'roomdevResource', 'roomResource',
        function ($scope, $rootScope, personlocResource, roomdevResource, roomResource) {
            var personlocresource = new personlocResource();
            var roomdevresource = new roomdevResource();
            var roomresource = new roomResource();
            $scope.personlocList = [];
            $scope.deleteuuid = "";
            $scope.editmode = false;
            $scope.listdevice = [];
            $scope.roomList = [];
            $scope.personlocobj = {
                    uuid :"",
                    datecreate : "",
                    lastseen  : "",
                    geolocation : 0,
                    room: "",
                    site : 0,
                    zone : 0
                };
            
            var date = new Date();

            $scope.getAllPersonLoc = function(){
                personlocresource.$getall(function(data){
                    $scope.personlocList = data.obj;
                });
            }
            
            $scope.getdevicemobile = function(){
                roomdevresource.$getdevicemobile(function(data){
                    $scope.listdevice = data.obj;
                });
            }

            $scope.getRoom = function(){
                roomresource.$getall(function(data){
                    $scope.roomList = data.obj;
                });
            }

            $scope.init = function(){
                $scope.getAllPersonLoc();
                $scope.getdevicemobile();
                $scope.getRoom();
            }

            $scope.init();

            $scope.Add = function(){
                $("#modal-add").modal('show');
            }

            $scope.Save = function(){
                personlocresource.personobj = $scope.personlocobj;
                personlocresource.personobj.datecreate = new Date();
                personlocresource.personobj.lastseen = new Date();
                personlocresource.$create(function(data){
                    if(data.success)
                        $scope.init();
                        $("#modal-add").modal('hide'); 
                        $scope.personlocobj = {
                            uuid :"",
                            datecreate : "",
                            lastseen  : "",
                            geolocation : "",
                            room: "",
                            site : "",
                            zone : ""
                        };
                });
            }

            $scope.turnoffaddmode = function(index){
                $scope.personlocList.splice(index,1);
            }

            $scope.Edit=function(obj){
                obj.editmode = true;
            }
            
            $scope.turnoffeditmode = function(obj){
                $scope.editmode = false;
                obj.editmode = false;
            }

            $scope.Update = function(obj){
                obj.datamodified = date;
                obj.changeby = $rootScope.userobj.id;
                obj.changebyname = $rootScope.userobj.username;
                personlocresource.personobj = obj;
                personlocresource.$update(function(data){
                    if(data.success)
                        $scope.init();
                    
                });
            }
            
            $scope.btnDeleteClick = function(obj){
                $("#modal-delete").modal('show');
                $scope.deleteuuid = obj.uuid;
            }
            
            $scope.Delete = function(){
                personlocresource.personobj = {uuid:$scope.deleteuuid};
                personlocresource.$delete(function(data){
                    if(data.success)
                        $scope.init();
                        $("#modal-delete").modal('hide');
                });
            }

        }
    ]);