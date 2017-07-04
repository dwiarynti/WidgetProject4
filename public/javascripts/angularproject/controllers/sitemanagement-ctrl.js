angular.module('app').controller('sitemanagementcontroller',
    ['$scope', '$window','siteResource',
        function ($scope, $window, siteResource) {
            var siteresource = new siteResource();
            $scope.sitelist = [];

            $scope.init = function(){
                siteresource.$getall(function(data){
                    angular.forEach(data.obj,function(item) {
                        item.editmode = false;
                    });
                    $scope.sitelist = data.obj;
                });
            }

            $scope.init();


            $scope.Add = function(){
                $scope.sitelist.push({"id":0, "sitename":"", "editmode":true});
            }
            
            $scope.Save = function(obj){
                //
                $scope.init();
            }
            
            $scope.Edit = function(obj){
                obj.editmode = true;
                obj.datetime="";
            }
            
            $scope.Update = function(obj){
                $scope.turnoffeditmode(obj);

                //
            }
            
            $scope.turnoffeditmode = function(obj){
                $scope.init();
                // obj.editmode = false;
            }

            $scope.btnDeleteClick = function(obj){
                $("#modal-delete").modal('show');
                $scope.deleteuserid = obj.id;
            }
            
            $scope.Delete = function(){
                $("#modal-delete").modal('hide');
                $scope.init();
            }
        }
    ])