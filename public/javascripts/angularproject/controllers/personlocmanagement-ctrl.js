angular.module('app').controller('personlocmanagementcontroller',
    ['$scope', '$rootScope','personlocResource', 'roomdevResource',
        function ($scope, $rootScope, personlocResource, roomdevResource) {
            var personlocresource = new personlocResource();
            var roomdevresource = new roomdevResource();
            $scope.personlocList = [];
            $scope.deleteuuid = "";
            $scope.editmode = false;
            $scope.listdevice = [];
            $scope.personlocobj = {
                    uuid :"",
                    datecreate : "",
                    lastseen  : "",
                    geolocation : "",
                    room: "",
                    site : "",
                    zone : "",
                    editmode:true
                };
            
            var date = new Date();

            $scope.init = function(){
                personlocresource.$getall(function(data){
                    console.log(data.obj);
                    $scope.personlocList = data.obj;
                });
            }
            
            $scope.getdevicemobile = function(){
                roomdevresource.$getdevicemobile(function(data){
                    $scope.listdevice = data.obj;
                    console.log($scope.listdevice);
                });
            }

            $scope.init();
            $scope.getdevicemobile();

            $scope.Add = function(){
                $("#modal-add").modal('show');
            }

            $scope.Save = function(obj){
                console.log(obj);
                personlocresource.personobj = obj;
                personlocresource.$create(function(data){
                    if(data.success)
                        $scope.init();
                        
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