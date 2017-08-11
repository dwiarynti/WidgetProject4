angular.module('app').controller('applicationcontroller',
    ['$scope', '$rootScope', '$routeParams', 'widgetmanagementResource',
        function ($scope, $rootScope, $routeParams, widgetmanagementResource) {
            $rootScope.widgetviewmode = true;
            var widgetmanagementresource = new widgetmanagementResource();
            $scope.applicationObj = {};

            widgetmanagementresource.$getappbyid({_id:$routeParams.euid}).then(function(data){
                $scope.applicationObj = data.obj;

            });
            
            $scope.gridsterOpts = {
                columns: 20,
                margins: [20, 20],
                outerMargin: false,
                pushing: true,
                floating: false,
                swapping: false,
                draggable: {
                    enabled: false
                },
                resizable: {
                    enabled: false
                },
                rowHeight: 'match'
            };
        }]);