angular.module('app').controller('appcomposer-v2controller',
    ['$scope', '$rootScope', '$window', '$location', 'dataService','passingdataservice', 'widgetmanagementResource',
        function ($scope, $rootScope, $window, $location, dataService, passingdataservice, widgetmanagementResource) {
            $scope.appmanagementv2obj={};
            var widgetmanagementresource = new widgetmanagementResource();
            $rootScope.widgetviewmode = false;

            $scope.gridsterOpts = {
                columns: 13,
                margins: [30, 20],
                outerMargin: false,
                pushing: true,
                floating: false,
                swapping: false
            };


            $scope.widgetDefinitions = [];
            dataService.getWidgetForm().then(function(data){
                $scope.widgetDefinitions = data;
            });
            

            $scope.init = function(){
                if(passingdataservice.appmanagementv2obj != undefined){
                    $scope.appmanagementv2obj = passingdataservice.appmanagementv2obj;
                }else{
                    $location.path('appmanagement-v2');
                }
            }

            $scope.init();


            $scope.addNewWidget = function (widget) {
                var newWidget = angular.copy(widget.settings);
                $scope.appmanagementv2obj.widget.push(newWidget);
            }


            $scope.ViewPage = function(){
                // window.open($location.path('/prevpage/', {id:$scope.appmanagementv2obj.euid}));
                $location.path('application/'+$scope.appmanagementv2obj.euid);
            }

            $scope.Save = function(){
                widgetmanagementresource.appname = $scope.appmanagementv2obj.appname;
                widgetmanagementresource.appstatus = $scope.appmanagementv2obj.appstatus;
                widgetmanagementresource.widget = $scope.appmanagementv2obj.widget;

                widgetmanagementresource.$create(function(data){
                    if(data.success){
                        $window.alert("Data saved successfully");
                    }
                    
                    // $scope.appmanagementv2obj = data.obj;
                    //Reinit menu
                    // $rootScope.addedNewApp = true;
                });
            }

            $scope.Update = function(){
                widgetmanagementresource.euid = $scope.appmanagementv2obj.euid;
                widgetmanagementresource.appname = $scope.appmanagementv2obj.appname;
                widgetmanagementresource.appstatus = $scope.appmanagementv2obj.appstatus;
                widgetmanagementresource.widget = $scope.appmanagementv2obj.widget;
                widgetmanagementresource.$update(function(data){
                    if(data.success){
                        $window.alert("Data updated successfully");
                    }
                });
            }

        }]);