angular.module('app').controller('locationmanagementcontroller',
    ['$scope', '$filter', '$rootScope', 'roomResource',
        function ($scope, $filter, $rootScope, roomResource) {
            var roomresource = new roomResource();
            $scope.roomList = {flat:[], tree:[]};
            $scope.deleteuuid = "";
            $scope.areatype = [
                {level:1, name:"site"},
                {level:2, name:"area"}, 
                {level:3, name:"building"},
                {level:4, name:"floor"},
                {level:5, name:"room"},
                {level:6, name:"closet"},
                ];
            $scope.parentList = [];
            $scope.selectedareatype = "";
            $scope.errormessage = "";
            $scope.action = "";
            $scope.getlocflatdata_obj = [];
            $scope.locationobj = locationobj();

            function locationobj() {
                return {
                    uuid :"",
                    name:"",
                    parent:0,
                    datecreated:date,
                    datemodified : "",
                    changeby : "",
                    changebyname :"",
                    areatype : "",
                    shortaddress: "",
                    fulladdress:"",
                    Location :"",
                    disable : false
                };
            }
            
            var date = new Date();

            $scope.convertlisttotree = function(data){
                var ltt = new LTT(data, {
                    key_id: 'uuid',
                    key_parent: 'parent',
                    key_child : 'children'
                });
                var tree = ltt.GetTree();
                return tree;
            }

            $scope.init = function(){
                roomresource.$getall(function(data){
                    console.log(data.obj);
                    $scope.roomList.flat = data.obj;
                    $scope.roomList.tree = $scope.convertlisttotree(data.obj);
                    // $scope.getlocflatdata();
                });
            }

            $scope.init();

            $scope.Add = function(){
                console.log($scope.colDefs);
                $scope.action = "Add";
                $("#modal-add").modal('show');
            }

            $scope.closemodal = function(){
                $("#modal-add").modal('hide');
                $scope.locationobj = locationobj();
            }

            $scope.Save = function(obj){
                obj.areatype  = obj.areatype != "" ? $filter('filter')($scope.areatype, function (type) { return parseInt(obj.areatype) === type.level })[0].name:"";
                obj.parent = parseInt(obj.parent);
                $scope.concatShortAddress(obj);
                if((obj.areatype != "site" && obj.parent == 0) || obj.areatype== ""){
                    $scope.errormessage = obj.areatype== "" ? "Please select area type": "Please select parent";
                }else{
                    $scope.errormessage = "";
                    roomresource.roomobj = obj;
                    roomresource.$create(function(data){
                        if(data.success)
                            $scope.closemodal();
                            $scope.init();
                    });
                }
            }

            $scope.Edit=function(obj){
                obj.editmode = true;
                console.log(obj);
                var areatypelevel = $scope.getAreatypeLevel(obj.areatype);
                $scope.getParent(areatypelevel);
            }
            
            $scope.turnoffeditmode = function(obj){
                obj.editmode = false;
            }

            $scope.Update = function(obj){
                $scope.concatShortAddress(obj);                
                obj.datamodified = date;
                obj.changeby = $rootScope.userobj.id;
                obj.changebyname = $rootScope.userobj.username;
                obj.parent = parseInt(obj.parent);                
                roomresource.roomobj = obj;
                roomresource.$update(function(data){
                    if(data.success)
                        $scope.closemodal();
                        $scope.init();
                });
            }
            
            $scope.btnDeleteClick = function(obj){
                $("#modal-delete").modal('show');
                $scope.deleteuuid = obj.uuid;
            }
            
            $scope.Delete = function(){
                roomresource.roomobj = {uuid:$scope.deleteuuid};
                roomresource.$delete(function(data){
                    if(data.success)
                        $scope.init();
                        $("#modal-delete").modal('hide');
                });
            }

            $scope.getParent = function(level){
                $scope.parentList = [];
                level = parseInt(level);
                var getparentlevel = $filter('filter')($scope.areatype, function (type) { return type.level == level-1 })[0];
                if(getparentlevel != undefined){
                    // $scope.getlocflatdata();
                    var data = $filter('filter')($scope.roomList.flat, function (room) { return room.areatype === getparentlevel.name });
                    console.log(data);
                    if(data.length != 0){
                        $scope.parentList.push.apply($scope.parentList, data);
                    }
                }
            }
            
            $scope.isSelectedItem =function(itemA, itemB){
                return itemA == itemB ? true:false;
            }

            $scope.getAreatypeLevel = function(areatype){
                return $filter('filter')($scope.areatype, function (type) { return type.name === areatype })[0].level;
            }

            $scope.getParentData = function(parentuuid){
                var getParent = $filter('filter')($scope.roomList.flat, function (room) { return room.uuid === parseInt(parentuuid) })[0];
                var getlevel = $filter('filter')($scope.areatype, function (areatype) { return areatype.name === getParent.areatype })[0];
                return {parentobj:getParent, level:getlevel.level};
            }

            $scope.concatShortAddressHierarchy = function(parentuuid, obj){
                var fulladdress = "";
                var getParentData = $scope.getParentData(parentuuid);
                fulladdress = getParentData.parentobj.shortaddress;
                var numberofloop = getParentData.level-1;
                for(i=0;i<numberofloop;i++){
                    getParentData = $scope.getParentData(getParentData.parentobj.parent);
                    numberofloop = getParentData.level-1;
                    if(fulladdress == ""){
                        fulladdress = getParentData.parentobj.shortaddress;
                    }else if(getParentData.parentobj.shortaddress == ""){
                        fulladdress = fulladdress;
                    }else{
                        fulladdress = fulladdress +" - "+ getParentData.parentobj.shortaddress;
                    }
                }
                obj.fulladdress=fulladdress;
                console.log(fulladdress);
            }

            $scope.concatShortAddress=function(obj){
                if(obj.fulladdress == ""){
                    obj.fulladdress = obj.shortaddress;
                }else if(obj.shortaddress == ""){
                    obj.fulladdress = obj.fulladdress;
                }else{
                    obj.fulladdress = obj.fulladdress +" - "+ obj.shortaddress;
                }
                // obj.fulladdress = obj.shortaddress +" - "+ obj.fulladdress;
            }



///sample 1
    $scope.locmanagementcontrol = {};

    $scope.locmanagementcontrol.edit = function(obj){
        $scope.action = "Edit";
        $scope.locationobj = angular.copy(obj);
        var areatypelevel = $scope.getAreatypeLevel(obj.areatype);
        $scope.getParent(areatypelevel);
        $("#modal-add").modal('show');
    }

    $scope.locmanagementcontrol.btnDeleteClick = function(obj){
        $("#modal-delete").modal('show');
        $scope.deleteuuid = obj.uuid;
    }

    $scope.locmanagementcontrol.scope = this;

    $scope.colDefs = [
    // { field: "name", displayName: "Name" },
    { field: "areatype", displayName: "Area Type",  },
    { field: "parentname", displayName: "Parent" },
    { field: "shortaddress", displayName: "Short Address" },
    { field: "fulladdress", displayName: "Full Address" },
    {
      field: "Action",
      displayName: "Action",
      cellTemplate: '<a ng-click="treeControl.edit(row.branch)" class="link" style="cursor: pointer">Edit</a> | <a ng-click="treeControl.btnDeleteClick(row.branch)" class="link" style="cursor: pointer">Delete</a>'
    }];
    $scope.expandingProperty = {
        field: "name",
        displayName: "Name",
        filterable: true
    };
    
    // $scope.expandingProperty = {};  //Create a scope object to hold custom property to first column


///end sample 1
$scope.tree_file = [
    {Path:"aa", size: 12, mtime:"qqqe"},
    {Path:"aa", size: 12, mtime:"qqqe"},
    {Path:"aa", size: 12, mtime:"qqqe"},
    {Path:"aa", size: 12, mtime:"qqqe"},
];

$scope.expanding_property_files = {
      field: "Path",
      displayName: "Path",
      cellTemplate: "<span title='{{row.branch.RealPath}}' >{{ row.branch[expandingProperty.field] }}</span>"
};
$scope.col_defs_files = [
        {
          field: "size",
          displayName: "Size",
        //   cellTemplate: "<span width='40' >{{ row.branch[col.field] }}</span>"
        },
        {
          field: "mtime",
          displayName: "Date"
        }
 ];

  //end
        }
    ]);