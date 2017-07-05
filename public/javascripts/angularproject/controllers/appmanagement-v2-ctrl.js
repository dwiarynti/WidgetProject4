angular.module('app').controller('appmanagemet-v2controller',
    ['$scope','$location', '$window', 'widgetmanagementResource', 'passingdataservice', '$rootScope',
        function ($scope, $location, $window, widgetmanagementResource, passingdataservice, $rootScope) {
            var widgetmanagementresource = new widgetmanagementResource();

            $scope.PageList=[];
            $scope.init = function(){
                widgetmanagementresource.$getall(function(data){
                    $scope.PageList = data.obj;
                });
            }

            $scope.init();

            $scope.Edit = function(obj){
                obj.editmode = true;
            }
            
            //
            $scope.Add = function(){
                var newapp = {"euid":0, "appname":"", "appstatus":true, "widget":[]};
                passingdataservice.applicationObj = newapp;
                $location.path('appcomposert-v2');
                
            }

            $scope.Update = function(obj){
                widgetmanagementresource.euid = obj.euid;
                widgetmanagementresource.appname = obj.appname;
                widgetmanagementresource.appstatus = obj.appstatus;
                widgetmanagementresource.widget = obj.widget;
                widgetmanagementresource.$update(function(data){
                    if(data.success){
                        $scope.turnoffeditmode(obj);
                        
                        //Reinit menu
                        $rootScope.addedNewApp = true;
                    }
                });
            }
            
            $scope.turnoffaddmode = function(index){
                $scope.PageList.splice(index,1);
            }

            $scope.turnoffeditmode = function(obj){
                obj.editmode = false;    
            }

            $scope.ComposePage = function(obj){
                passingdataservice.applicationObj = obj;
                $location.path('appcomposert-v2');
            }

            $scope.Disable = function(obj){
                widgetmanagementresource.euid = obj.euid;
                widgetmanagementresource.appname = obj.appname;
                widgetmanagementresource.appstatus = obj.appstatus == true ?false:true;
                widgetmanagementresource.widget = obj.widget;
                widgetmanagementresource.$update(function(data){
                    if(data.success){
                        $window.alert("Data updated successfully");
                        $scope.init();
                    }
                });
            }
        }
    ]);