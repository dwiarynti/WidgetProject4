angular.module('app').controller('authsettingcontroller',
    ['$scope', '$window','authsettingResource',
        function ($scope, $window, authsettingResource) {
            var authsettingresource = new authsettingResource();
            $scope.obj = false;

            authsettingresource.$init(function(data){
                $scope.obj = data.obj;
            });

            $scope.updateAuthenticationSetting = function(){
                authsettingresource.auth = $scope.obj;
                authsettingresource.$update(function(data){
                    if(data.success){
                        $window.alert("Data saved successfully");
                    }
                });
            }

        }]);