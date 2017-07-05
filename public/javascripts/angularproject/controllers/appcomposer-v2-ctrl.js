angular.module('app').controller('appcomposer-v2controller',
    ['$scope', '$rootScope', '$window', '$location', 'dataService','passingdataservice', 'widgetmanagementResource',
        function ($scope, $rootScope, $window, $location, dataService, passingdataservice, widgetmanagementResource) {
            $scope.applicationObj={};
            var widgetmanagementresource = new widgetmanagementResource();
            $rootScope.widgetviewmode = false;
            $rootScope.number = {
                site:0
            };     

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
                if(passingdataservice.applicationObj != undefined){
                    $scope.applicationObj = passingdataservice.applicationObj;
                }else{
                    $location.path('appmanagement-v2');
                }
            }

            $scope.init();


            $scope.addNewWidget = function (widget) {
                var newWidget = angular.copy(widget.settings);
                $scope.applicationObj.widget.push(newWidget);
            }


            $scope.ViewPage = function(){
                // window.open($location.path('/prevpage/', {id:$scope.applicationObj.euid}));
                $location.path('application/'+$scope.applicationObj.euid);
            }

            $scope.Save = function(){
                widgetmanagementresource.appname = $scope.applicationObj.appname;
                widgetmanagementresource.appstatus = $scope.applicationObj.appstatus;
                widgetmanagementresource.widget = $scope.applicationObj.widget;

                widgetmanagementresource.$create(function(data){
                    if(data.success){
                        $window.alert("Data saved successfully");
                    }
                    
                    // $scope.applicationObj = data.obj;
                    //Reinit menu
                    // $rootScope.addedNewApp = true;
                });
            }

            $scope.Update = function(){
                widgetmanagementresource.euid = $scope.applicationObj.euid;
                widgetmanagementresource.appname = $scope.applicationObj.appname;
                widgetmanagementresource.appstatus = $scope.applicationObj.appstatus;
                widgetmanagementresource.widget = $scope.applicationObj.widget;
                widgetmanagementresource.$update(function(data){
                    if(data.success){
                        $window.alert("Data updated successfully");
                    }
                });
            }

        }]);