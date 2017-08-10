angular.module('app').controller('devicemanagementcontroller',
    ['$scope','roomdevResource', 'roomResource', 'personResource',
        function ($scope, roomdevResource, roomResource, personResource) {
            var roomdevresource = new roomdevResource();
            var roomresource = new roomResource();
            var personresource = new personResource();

            $scope.devicetypes = ["fixed", "mobile"];
            $scope.deviceslist = [];
            $scope.deviceobj = {
                euid:"",
                type:"",
                room:0,
                person:0,
                device : [{euid:""}]
            };
            $scope.roomlist =[];
            $scope.personlist =[];
            $scope.action = "";
            $scope.errormessage = "";

            $scope.init = function(){
                roomdevresource.$getAll(function(data){
                    if(data.success)
                        $scope.deviceslist = data.obj;
                        $scope.getroom();
                        $scope.getperson();
                });
            }

            $scope.init();            

            $scope.btnAddClick = function()
            {
                $scope.deviceobj.type = "fixed";
                $scope.action = "Add";
                $scope.errormessage = "";
                $("#modal-add").modal('show');
            }

            $scope.getroom = function(){
                roomresource.$getall(function(data){
                    if(data.success)
                        $scope.roomlist = data.obj;                   
                });
            }

            $scope.getperson = function(){
                personresource.$getAll(function(data){
                    if(data.success)
                        $scope.personlist = data.obj;                   
                });
            }

            $scope.closemodaladd = function(){
                $("#modal-add").modal('hide');
                $scope.deviceobj = {
                    euid:"",
                    type:"",
                    room:0,
                    person:0,
                    device : [{euid:""}]
                };
            }

            $scope.closemodaledit = function(){
                $("#modal-edit").modal('hide');
                $scope.deviceobj = {
                    euid:"",
                    type:"",
                    room:0,
                    person:0,
                    device : [{euid:""}]
                };
            }

            $scope.Save = function(){
                roomdevresource.deviceobj = $scope.deviceobj;
                roomdevresource.$create(function(data){
                    if(data.success){
                        $scope.init();
                        $scope.closemodaladd();
                    }else{
                        $scope.errormessage = data.messages;
                    }
                });
            }

            $scope.btnEditClick = function(obj){
                obj.prevdeviceobj = angular.copy(obj);
                // $scope.deviceobj = obj;
                $scope.deviceobj = angular.copy(obj);
                $scope.action = "Edit";        
                $scope.errormessage = "";        
                $("#modal-edit").modal('show');                
            }

            $scope.Update = function(){
                roomdevresource.deviceobj = $scope.deviceobj;
                roomdevresource.$update(function(data){
                    if(data.success){
                        $scope.init();
                        $scope.closemodaledit();
                    }
                });
            }
            
            $scope.isSelectedItem = function(itemA, itemB){
                return itemA == itemB ? true:false;
            }
            
            $scope.btnDeleteClick = function(obj){
                $scope.deviceobj = obj; 
                $("#modal-delete").modal('show');                
            }

            $scope.Delete = function(){
                roomdevresource.deviceobj = $scope.deviceobj;
                roomdevresource.$delete(function(data){
                    if(data.success){
                        $scope.init(); 
                        $scope.deviceobj={};
                        $("#modal-delete").modal('hide');
                    }
                });
            }

            $scope.adddevice = function(){
                $scope.deviceobj.device.push({euid:""});
            }


        }
    ]);