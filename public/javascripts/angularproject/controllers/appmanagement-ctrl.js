angular.module('app').controller('appmanagemetcontroller',
    ['$scope','$location', 'appmanagementResource', 'passingdataservice', '$rootScope',
        function ($scope, $location, appmanagementResource, passingdataservice, $rootScope) {
            var appmanagementresource = new appmanagementResource();
            // var passingdataservice = new passingdataservice();
            $scope.PageList=[];
            appmanagementresource.$init(function(data){
                $scope.PageList = data.obj;
                angular.forEach($scope.PageList,function(item) {
                    item.editmode = false;
                             
                });
            });
            // $scope.PageList = [
            //     {"id":1, "PageName":"Page A", "Status":true, "editmode":false},
            //     {"id":2, "PageName":"page B", "Status":true, "editmode":false},
            //     {"id":3, "PageName":"page C", "Status":false, "editmode":false},
            //     {"id":4, "PageName":"page D", "Status":false, "editmode":false},
            // ];
            $scope.Edit = function(obj){
                obj.editmode = true;
            }
            $scope.Add = function(){
                $scope.PageList.push({"id":0, "pagename":"", "pagestatus":true, "widget":[], "editmode":true});
            }

            $scope.Save = function(){

            }

            $scope.Update = function(obj){
                appmanagementresource.id = obj.id;
                appmanagementresource.pagename = obj.pagename;
                appmanagementresource.pagestatus = obj.pagestatus;
                appmanagementresource.widget = obj.widget;
                appmanagementresource.$update(function(data){
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
                passingdataservice.appmanagementobj = obj;
                $location.path('appcomposer');
            }
        }
    ]);