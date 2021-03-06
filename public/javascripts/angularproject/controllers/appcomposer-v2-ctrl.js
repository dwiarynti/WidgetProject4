angular.module('app').controller('appcomposer-v2controller',
    ['$scope', '$rootScope', '$window', '$location', 'dataService','passingdataservice', 'widgetmanagementResource',
        function ($scope, $rootScope, $window, $location, dataService, passingdataservice, widgetmanagementResource) {
            $scope.applicationObj={};
            var widgetmanagementresource = new widgetmanagementResource();
            $rootScope.widgetviewmode = false;
            $rootScope.number = {
                site:0
            };     
            $rootScope.listSiteWidget = [];
            $rootScope.isSingleSiteUpdated = false;

            $rootScope.initwidget = {location:false};
            $scope.errmsg = '';

            $scope.gridsterOpts = {
                columns: 13,
                margins: [10, 20],
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
                if($scope.applicationObj.appname == ''){
                    $scope.errmsg = 'Application name is required';
                }else{
                    $scope.errmsg = '';
                    widgetmanagementresource.appname = $scope.applicationObj.appname;
                    widgetmanagementresource.appstatus = $scope.applicationObj.appstatus;
                    widgetmanagementresource.widget = $scope.applicationObj.widget;

                    widgetmanagementresource.$create().then(function(data){
                        if(data.success){
                            $scope.applicationObj = data.obj;
                            $window.alert("Data saved successfully");
                        }
                        //Reinit menu
                        $rootScope.addedNewApp = true;
                    });
                }
                
            }

            $scope.Update = function(){
                widgetmanagementresource.euid = $scope.applicationObj.euid;
                widgetmanagementresource.appname = $scope.applicationObj.appname;
                widgetmanagementresource.appstatus = $scope.applicationObj.appstatus;
                widgetmanagementresource.widget = $scope.applicationObj.widget;
                widgetmanagementresource.$update().then(function(data){
                    if(data.success){
                        $window.alert("Data updated successfully");
                    }
                });
            }

        }]);