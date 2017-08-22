angular.module('app').controller('usermanagementcontroller',
    ['$scope','$location', 'userResource' ,'passingdataservice', '$rootScope','appmanagementResource','$filter','siteResource', 'widgetmanagementResource',
        function ($scope, $location, userResource, passingdataservice, $rootScope, appmanagementResource, $filter,siteResource, widgetmanagementResource) {
           var userresource = new userResource();
           var appmanagementresource = new appmanagementResource();
           var siteresource = new siteResource();
           var widgetmanagementresource = new widgetmanagementResource();
           
           $scope.pagelist = [];
           $scope.sitelist = [];
           $scope.pagelistEditMode = [];
            $scope.roles =[
                {"rolename": "Admin"}, 
                {"rolename": "User"},
                {"rolename": "Super Admin"}
                ];
            $scope.userobject = {
                "username":"",
                "password":"",
                "role":"",
                "pages":[]
            }
            $scope.selecteduser = {};
            $scope.deleteuserid =0;
            $scope.errormessage = "";
            $scope.userlist = [];
            $scope.init = function(){
                userresource.$getall().then(function(data){
                    
                    $scope.userlist = data.obj;
                    console.log(data.obj)
                });
                $scope.getPageList();
                $scope.getSiteList();
            }

            $scope.getSiteList = function(){
                siteresource.$getall().then(function(data){
                    $scope.sitelist = data.obj;
                });
            }

            $scope.getPageList = function(){
                widgetmanagementresource.$getall().then(function(data){
                    console.log(data.obj);
                    $scope.pagelist = data.obj;
                    $scope.pagelistEditMode = data.obj;
                });
            }

            $scope.init();
            $scope.btnAddClick = function()
            {
                $scope.userobject = {
                    "username":"",
                    "password":"",
                    "role":"",
                    "pages":[],
                    "siteid":""
                }
                $("#modal-add").modal('show');
            }



            $scope.Save = function(){
                console.log($scope.userobject);
                userresource.username = $scope.userobject.username;
                userresource.password = $scope.userobject.password;
                userresource.role = $scope.userobject.role;
                userresource.pages = $scope.userobject.pages;
                userresource.siteid = $scope.userobject.siteid;
                userresource.$create().then(function(data){
                    
                    if(data.success){
                        $("#modal-add").modal('hide');   
                        $scope.init();                     
                    }else{
                        $scope.errormessage = data.message;
                    }

                });
            }

            $scope.pushSelectedTransactionType = function(obj, active, mode){
                if (active){
                    if(mode=="add"){
                        $scope.userobject.pages.push(obj.euid);
                    }else{
                        $scope.selecteduser.pages.push(obj.euid);
                    }
                }
                else{
                    if(mode=="add"){
                        $scope.userobject.pages.splice($scope.userobject.pages.indexOf(obj.euid), 1);
                    }else{
                        $scope.selecteduser.pages.splice($scope.userobject.pages.indexOf(obj.euid), 1);
                    }
                }             
                
            }

            $scope.btnEditClick = function(obj){
                $("#modal-edit").modal('show');
                
                angular.forEach($scope.pagelistEditMode, function (pageobj) {
                    var selectedpages = $filter('filter')(obj.pages,function(item){
                        return pageobj.euid === item
                    })[0];
                    
                    pageobj.selected = selectedpages != undefined ? true:false;
                });
                $scope.selecteduser = obj;
            }

            $scope.btnDeleteClick = function(obj){
                $("#modal-delete").modal('show');
                $scope.deleteuserid = obj.id;
            }

            $scope.isSelectedItem =function(itemA, itemB){
                return itemA == itemB ? true:false;
            }
            
            $scope.Update = function(){
                console.log($scope.selecteduser);
                userresource.id = $scope.selecteduser.id;
                userresource.username = $scope.selecteduser.username;
                userresource.password= $scope.selecteduser.password;
                userresource.role= $scope.selecteduser.role;
                userresource.pages= $scope.selecteduser.pages;
                userresource.siteid = $scope.selecteduser.siteid;                
                userresource.$update().then(function(data){
                    if(data.success){
                        $("#modal-edit").modal('hide');
                        $scope.init();
                    }
                });
            }

            $scope.Delete = function(){
                userresource.id = $scope.deleteuserid;                
                userresource.$delete().then(function(data){
                    if(data.success){
                        $("#modal-delete").modal('hide');
                        $scope.init();
                        
                    }
                });
            }

            $scope.closemodaledit = function(){
                $("#modal-edit").modal('hide');
                $scope.init();
            }

        }
    ]);