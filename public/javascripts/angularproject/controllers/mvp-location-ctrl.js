angular.module('app').controller('mpv-locationcontroller',
    ['$scope', 'locationsiteResource',
        function ($scope, locationsiteResource) {
            $scope.LocationList = [];
            var locationsiteresource = new locationsiteResource();
            // var selectedfilter = $scope.$parent.item.widgetSettings.selectedfilter;            
            $scope.getAllLocationSite = function(){
                locationsiteresource.$getbysite({_id:siteid}, function(data){
                                        
                    $scope.LocationList = data.obj;
                });
            }

            $scope.getFilteredLocationSite = function(){
                var selectedfilter = $scope.$parent.item.widgetSettings.selectedfilter;                 
                var locationsiteresource = new locationsiteResource();
                locationsiteresource.locationname = selectedfilter.by == "Location"? selectedfilter.option : null;
                locationsiteresource.zone = selectedfilter.by == "Zone" ? selectedfilter.option : null;
                
                locationsiteresource.$filter({_id:siteid}, function(data){
                    
                    $scope.LocationList = data.obj;
                });
            }
            

            var siteid = "001";
            $scope.$watch(function () {
                return $scope.$parent.item.widgetSettings.selectedfilter;
            }, function () {
                var selectedfilter = $scope.$parent.item.widgetSettings.selectedfilter;
                if(selectedfilter.by != "" && selectedfilter.option != ""){
                    $scope.getFilteredLocationSite();
                }else{
                    $scope.getAllLocationSite();
                }
            })

            // $scope.$watch($scope.$parent.item.widgetSettings.selectedfilter, function () {
            //     if(selectedfilter.by != "" && selectedfilter.option != ""){
            //         $scope.getFilteredLocationSite();
            //     }else{
            //         $scope.getAllLocationSite();
            //     }
            // }, true);

        }
    ]);