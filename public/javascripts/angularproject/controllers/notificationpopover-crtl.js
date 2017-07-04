angular.module('app').controller('notificationpopovercontroller',
    ['$scope','$rootScope', 'notificationmanagementResource',
        function ($scope, $rootScope, notificationmanagementResource, ) {
            // $scope.notificationPopoverList = [];
            // var notificationmanagementresource = new notificationmanagementResource();

            // $scope.getactivenotificationpopoverbysite = function(){
            //     notificationmanagementresource.$getbysitedate({_id:$rootScope.userobj.siteid},function(data){
            //         $scope.notificationPopoverList = data.obj;
            //         $scope.$parent.$parent.notificationnumber = data.obj.length;

            //     });
            // }
            
            // $scope.getallactivenotificationpopover = function(){
            //     notificationmanagementresource.$getbydate(function(data){
            //         $scope.notificationPopoverList = data.obj;
            //         $scope.$parent.$parent.notificationnumber = data.obj.length;                    
            //     });
            // }


            // //init
            // if($rootScope.userobj.role== "Super Admin"){
            //     $scope.getallactivenotificationpopover();
            // }else{
            //     $scope.getactivenotificationpopoverbysite();
            // }

            
        }
    ]);