angular.module('app').controller('devicemanagementcontroller',
    ['$scope', '$filter','roomdevResource', 'roomResource', 'personResource',
        function ($scope, $filter, roomdevResource, roomResource, personResource) {
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
            $scope.roomlist_tree =[];
            $scope.personlist =[];
            $scope.action = "";
            $scope.errormessage = "";
            $scope.selected = {};

            $scope.init = function(){
                roomdevresource.$getAll().then(function(data){
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

            $scope.treeData = function(data){
                var ltt = new LTT(data, {
                    key_id: 'uuid',
                    key_parent: 'parent',
                    key_child : 'children'
                });
                var tree = ltt.GetTree();
                return tree;
            }

            $scope.getroom = function(){
                roomresource.$getall().then(function(data){
                    if(data.success)
                        $scope.roomlist = data.obj; 
                        $scope.roomlist_tree =  $scope.treeData(data.obj);
                        // $scope.selected =  $scope.roomlist_tree[0];
                });
            }

            $scope.getperson = function(){
                personresource.$getAll().then(function(data){
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
                roomdevresource.$create().then(function(data){
                    if(data.success){
                        $scope.init();
                        $scope.closemodaladd();
                    }else{
                        $scope.errormessage = data.messages;
                    }
                });
            }

            $scope.getselectedroom = function(locationid){
                // $scope.roomlist_tree
                return $filter('filter')($scope.roomlist, function(room){return room.uuid === locationid})[0];

            }

            $scope.btnEditClick = function(obj){
                console.log($scope.roomlist);
                obj.prevdeviceobj = angular.copy(obj);
                // $scope.deviceobj = obj;
                $scope.deviceobj = angular.copy(obj);
                $scope.action = "Edit";        
                $scope.errormessage = "";        
                $("#modal-edit").modal('show');   
                $scope.selected = $scope.getselectedroom(parseInt(obj.room));           
            }

            $scope.Update = function(){
                roomdevresource.deviceobj = $scope.deviceobj;
                roomdevresource.$update().then(function(data){
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
                roomdevresource.$delete().then(function(data){
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
// $scope.treeData = 
// [
//   { "id": 1, "name": "Option 1", "children": [
//     { "id": 2, "name": "Option 1.1", "children": [
//       { "id": 3, "name": "Option 1.1.1"},
//       { "id": 4, "name": "Option 1.1.2"}
//     ]}
//   ]},
//   { "id": 5, "name": "Option 2" },
//   { "id": 6, "name": "Option 2.1" }
// ];

        }
    ]);