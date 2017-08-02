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
                person:0
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
                    console.log(data);
                    if(data.success)
                        $scope.personlist = data.obj;                   
                });
            }

            $scope.closemodal = function(){
                $("#modal-add").modal('hide');
                $scope.deviceobj = {
                    euid:"",
                    type:"",
                    room:0,
                    person:0
                };
            }

            $scope.Save = function(){
                roomdevresource.deviceobj = $scope.deviceobj;
                roomdevresource.$create(function(data){
                    console.log(data);
                    if(data.success){
                        $scope.init();
                        $scope.closemodal();
                    }else{
                        $scope.errormessage = data.messages;
                    }
                });
            }

            $scope.btnEditClick = function(obj){
                $scope.deviceobj = obj;
                $scope.action = "Edit";        
                $scope.errormessage = "";        
                $("#modal-add").modal('show');                
            }

            $scope.Update = function(){
                roomdevresource.deviceobj = $scope.deviceobj;
                roomdevresource.$update(function(data){
                    if(data.success){
                        $scope.init();
                        $scope.closemodal();
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


        }
    ]);