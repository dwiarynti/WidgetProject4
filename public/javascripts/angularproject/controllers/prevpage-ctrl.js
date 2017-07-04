angular.module('app').controller('prewpagecontroller',
    ['$scope', '$routeParams', 'appmanagementResource',
        function ($scope, $routeParams, appmanagementResource) {

            var appmanagementresource = new appmanagementResource();
            $scope.pervpageObj = {};

            appmanagementresource.$get({_id:$routeParams.id}, function(data){
                angular.forEach(data.obj.widget, function (item) {
                    item.widgetSettings.viewmode = true;
                });
                $scope.pervpageObj = data.obj;

            });
            
            $scope.gridsterOpts = {
                columns: 12,
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
                }
            };
        }]);