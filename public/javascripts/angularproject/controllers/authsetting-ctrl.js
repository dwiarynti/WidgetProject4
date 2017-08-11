angular.module('app').controller('authsettingcontroller',
    ['$scope', '$window','authsettingResource',
        function ($scope, $window, authsettingResource) {
            var authsettingresource = new authsettingResource();
            $scope.obj = false;

            authsettingresource.$init().then(function(data){
                $scope.obj = data.obj;
            });

            $scope.updateAuthenticationSetting = function(){
                authsettingresource.auth = $scope.obj;
                authsettingresource.$update().then(function(data){
                    if(data.success){
                        $window.alert("Data saved successfully");
                    }
                });
            }

        }]);