angular.module('app').controller('appcomposercontroller',
    ['$scope', '$window', '$location','widgetResource', 'passingdataservice', 'appmanagementResource', 'dataService', '$rootScope',
        function ($scope, $window, $location, widgetResource, passingdataservice, appmanagementResource, dataService, $rootScope) {
            $scope.appmanagementobj={};
            var widgetresource = new widgetResource();
            var appmanagementresource = new appmanagementResource();
            $scope.gridsterOpts = {
                columns: 12,
                margins: [20, 20],
                outerMargin: false,
                pushing: true,
                floating: false,
                swapping: false
            };
            $scope.widgetDefinitions = [];
            dataService.getWidgetDefinition().then(function(data){
                $scope.widgetDefinitions = data;
            });

            $scope.init = function(){
                if(passingdataservice.appmanagementobj != undefined){
                    $scope.appmanagementobj = passingdataservice.appmanagementobj;
                    angular.forEach($scope.appmanagementobj.widget, function (item) {
                        item.widgetSettings.viewmode = false;
                    });
                    $scope.$parent.widgets = $scope.appmanagementobj.widget;
                }else{
                    $location.path('appmanagement');
                }

            }

            $scope.init();
            


            $scope.addNewWidget = function (widget) {
                var newWidget = angular.copy(widget.settings);
                $scope.appmanagementobj.widget.push(newWidget);
            }

            $scope.Save = function(){
                appmanagementresource.pagename = $scope.appmanagementobj.pagename;
                appmanagementresource.pagestatus = $scope.appmanagementobj.pagestatus;
                appmanagementresource.widget = $scope.appmanagementobj.widget;

                appmanagementresource.$create(function(data){
                    $window.alert("Data saved successfully");
                    
                    $scope.appmanagementobj = data.obj;
                    //Reinit menu
                    $rootScope.addedNewApp = true;
                });


            }

            $scope.Update = function(){
                appmanagementresource.id = $scope.appmanagementobj.id;
                appmanagementresource.pagename = $scope.appmanagementobj.pagename;
                appmanagementresource.pagestatus = $scope.appmanagementobj.pagestatus;
                appmanagementresource.widget = $scope.appmanagementobj.widget;
                appmanagementresource.$update(function(data){
                    $window.alert("Data saved successfully");
                    // 
                });
            }
            
            $scope.ViewPage = function(){
                // window.open($location.path('/prevpage/', {id:$scope.appmanagementobj.id}));
                $location.path('prevpage/'+$scope.appmanagementobj.id);
            }

        }]);