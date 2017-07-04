angular.module('app').controller('notificationmanagementcontroller',
    ['$scope','$location', 'notificationmanagementResource', 'passingdataservice', '$rootScope', 'locationsiteResource','$filter','siteResource',
        function ($scope, $location, notificationmanagementResource, passingdataservice, $rootScope, locationsiteResource, $filter, siteResource) {
            var notificationmanagementresource = new notificationmanagementResource();
            var locationsiteresource = new locationsiteResource();
            var siteresource = new siteResource();
            $scope.notificationList=[];
            $scope.notificationPopoverList=[];
            $scope.locationList=[];
            $scope.siteList=[];
            $scope.deleteuserid = 0;
            $scope.userobj = $rootScope.userobj;
            var siteid = $rootScope.userobj.siteid;

            $scope.getAllNotification = function(){
                notificationmanagementresource.$getAll(function(data){
                    
                    angular.forEach(data.obj.messages, function(obj) {

                            obj.editmode = false;
                            obj.datetimeORI = obj.datetime;
                        }, this);
                        $scope.notificationList= data.obj.messages;
                        $scope.$parent.$parent.notificationnumber = data.obj.totalnotif;
                    });
                    locationsiteresource.$getall( function(data){        
                        $scope.locationList = data.obj;
                    });    
            }

            $scope.getNotificationbySite = function(){
                notificationmanagementresource.$getbysite({_id:siteid}, function(data){
                    console.log(data);
                        angular.forEach(data.obj.messages, function(obj) {
                            obj.editmode = false;
                            obj.datetimeORI = obj.datetime;
                        }, this);
                        $scope.notificationList= data.obj.messages;
                        $scope.$parent.$parent.notificationnumber = data.obj.totalnotif;
                    });
                    locationsiteresource.$getbysite({_id:siteid}, function(data){        
                        $scope.locationList = data.obj;
                    });
            }

            $scope.getAllSite = function(){
                siteresource.$getall(function(data){
                    $scope.siteList = data.obj;
                });
            }
            $scope.getactivenotificationpopoverbysite = function(){
                notificationmanagementresource.$getbysitedate({_id:$rootScope.userobj.siteid},function(data){
                    $scope.notificationPopoverList = data.obj;
                    $scope.$parent.$parent.notificationnumber = data.obj.length;

                });
            }
            
            $scope.getallactivenotificationpopover = function(){
                notificationmanagementresource.$getbydate(function(data){
                    $scope.notificationPopoverList = data.obj;
                    $scope.$parent.$parent.notificationnumber = data.obj.length;                    
                });
            }


            $scope.init = function(){
                if(!$rootScope.authenticationStatus || siteid == ""){
                    $scope.getAllNotification();
                    if(siteid == ""){
                        $scope.getAllSite();
                    }
                }else{
                    $scope.getNotificationbySite();
                }

                //notification popover
                if($rootScope.userobj.role== "Super Admin" || !$rootScope.authenticationStatus){
                    $scope.getallactivenotificationpopover();
                }else{
                    $scope.getactivenotificationpopoverbysite();
                }
            }


            $scope.init();
            $scope.Edit = function(obj){
                obj.editmode = true;
                obj.datetime="";
            }
            $scope.Add = function(){
                $scope.notificationList.push({"id":0, "datetime":"", "date":"","time":"", "topic":"", "siteid":siteid, "locationid":"", "editmode":true});
            }

            $scope.Save = function(obj){
                notificationmanagementresource.datetime = obj.datetime;
                notificationmanagementresource.topic = obj.topic;
                notificationmanagementresource.siteid = obj.siteid;
                notificationmanagementresource.locationid = obj.locationid;
                notificationmanagementresource.$create(function(data){
                    if(data.success){
                        $scope.init();
                    }
                });
            }

            $scope.Update = function(obj){
                obj.datetime = obj.datetime == "" && obj.datetimeORI != ""?obj.datetimeORI:obj.datetime;
                
                notificationmanagementresource.id = obj.id;
                notificationmanagementresource.datetime = obj.datetime;
                notificationmanagementresource.topic = obj.topic;
                notificationmanagementresource.siteid = obj.siteid;
                notificationmanagementresource.locationid = obj.locationid;
                notificationmanagementresource.$update(function(data){
                    
                    if(data.success){
                        $scope.turnoffeditmode(obj);
                        $scope.init();
                    }
                });
            }
            
            $scope.turnoffaddmode = function(index){
                $scope.notificationList.splice(index,1);
            }

            $scope.turnoffeditmode = function(obj){
                obj.editmode = false;    
                obj.datetime =obj.datetimeORI;
            }

            $scope.ComposePage = function(obj){
                passingdataservice.notificationmanagementobj = obj;
                $location.path('appcomposer');
            }
            
            $scope.btnDeleteClick = function(obj){
                $("#modal-delete").modal('show');
                $scope.deleteuserid = obj.id;
            }
            
            $scope.Delete = function(){
                notificationmanagementresource.id = $scope.deleteuserid;                
                notificationmanagementresource.$delete(function(data){
                    if(data.success){
                        $("#modal-delete").modal('hide');
                        $scope.init();
                        
                    }
                });
            }
            $scope.isSelectedItem =function(itemA, itemB){
                return itemA == itemB ? true:false;
            }


            $scope.getactivenotificationpopoverbysite = function(){
                notificationmanagementresource.$getbysitedate({_id:$rootScope.userobj.siteid},function(data){
                    $scope.notificationPopoverList = data.obj;
                    $scope.$parent.$parent.notificationnumber = data.obj.length;

                });
            }
            
            $scope.getallactivenotificationpopover = function(){
                notificationmanagementresource.$getbydate(function(data){
                    $scope.notificationPopoverList = data.obj;
                    $scope.$parent.$parent.notificationnumber = data.obj.length;                    
                });
            }


        }
    ]);