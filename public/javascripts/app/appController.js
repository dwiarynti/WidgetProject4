"use strict";

angular.module('app').controller('appController',
    ['$scope', '$rootScope', '$location', 'appmanagementResource', 'userResource','authsettingResource','notificationmanagementResource', 'widgetmanagementResource',
        function ($scope, $rootScope, $location, appmanagementResource, userResource, authsettingResource, notificationmanagementResource, widgetmanagementResource) {
            var userresource = new userResource();            
            var appmanagementresource = new appmanagementResource();  
            var authsettingresource = new authsettingResource();                    
            var notificationmanagementresource = new notificationmanagementResource();
            var widgetmanagementresource = new widgetmanagementResource();



            $scope.state = 'unauthorized';
            $scope.loginobj = {username:"", password:""};
            $scope.registerobj = {username:"", password:""};
            $scope.menuItems = [];
            $rootScope.userobj = {id:0,authorized:"", username:"", role:"", siteid:""};
            $scope.errmessage = "";
            $rootScope.authenticationStatus = true;
            $scope.notificationnumber = 0;

            //check authentication status (on/off)
            authsettingresource.$init(function(data){
                // 
                if(data.success){
                    $scope.state = data.obj ? 'unauthorized':'authorized';
                    $rootScope.authenticationStatus = data.obj;
                    $scope.notificationnumber = data.totalnotif;
                    if(data.obj){
                        $scope.getSession();
                    }else{
                        $scope.initMenu();
                    }
                }
            });

            $scope.getSession = function(){
                userresource.$session(function(data){
                    // 
                    $scope.state = data.result.authorized;
                    $rootScope.userobj.role = data.result.role
                    $rootScope.userobj.username = data.result.username;
                    $rootScope.userobj.id = data.result.userid;
                    $rootScope.userobj.siteid = data.result.siteid;
                    $scope.loginobj.username = data.result.username;
                    if($rootScope.userobj.role == "User"){
                        $scope.getUserPage($rootScope.userobj.id);
                    }else{
                        $scope.initMenu($rootScope.userobj.role);
                        
                    }
                });
            }

            $scope.signIn = function () {
                userresource.username = $scope.loginobj.username;
                userresource.password = $scope.loginobj.password;
                userresource.$login(function(data){
   
                    if(data.success){
                        $location.path( "/home" );
                        $rootScope.userobj = data.obj;
                        $scope.notificationnumber = data.obj.totalnotif;
                        $scope.state = 'authorized';
                        if(data.obj.role == "User"){
                             $scope.getUserPage(data.obj.id);
                        }
                        else{
                            $scope.initMenu(data.obj.role);
                            
                        }
                        $scope.errmessage = "";         
                        
                    }else{
                        $scope.errmessage = data.obj;
                    }
                });
                
            };

            $scope.signUp = function(){
                userresource.username = $scope.registerobj.username;
                userresource.password = $scope.registerobj.password;
                userresource.$register(function(data){
                    
                    if(data.success){
                        $scope.state = 'authorized';
                        $scope.errmessage = "";         
                        $scope.loginobj = $scope.registerobj;           
                    }else{
                        $scope.errmessage = data.message;
                    }
                });                
            }

            $scope.getUserPage = function(userid){
                appmanagementresource.$getbyuser({_id:userid},function(data){
                    // 
                    $scope.menuItems=[];
                    angular.forEach(data.obj, function (obj) {
                        $scope.menuItems.push({
                            label: obj.pagename, href: '/prevpage/' + obj.id, icon: 'fa-dashboard', isGroup: false, submenuItems: []
                        });
                    });
                });
            }




            $rootScope.addedNewApp = false;

            $scope.$watch(function(){ return $rootScope.addedNewApp }, function () {
                if ($rootScope.addedNewApp){
                    if($rootScope.userobj.role == "User"){
                        $scope.getUserPage($rootScope.userobj.id);
                    }else{
                        $scope.initMenu($rootScope.userobj.role);                        
                    }
                }
                    // $scope.initMenu();
            });

            // Init       
            $scope.initMenu = function (role) {

                $scope.menuItems = [
                    // { label: 'Dashboard', href: '/dashboard', icon: 'fa-dashboard', isGroup: false, submenuItems: [] },
                    // { label: 'Raft Guides', href: '/guides', icon: 'fa-user', isGroup: false, submenuItems: [] },
                    // {
                    //     label: 'Equipment', href: '', icon: 'fa-gears', isGroup: true, submenuItems: [
                    //         { label: 'Rafts', href: '/rafts', icon: 'fa-unlink' },
                    //         { label: 'Paddles', href: '/paddles', icon: 'fa-magic' }
                    //     ]
                    // },
                    { label: 'App Management', href: '/appmanagement', icon: 'fa-user', isGroup: false, submenuItems: [] },
                    { label: 'App Management V2', href: '/appmanagement-v2', icon: 'fa-user', isGroup: false, submenuItems: [] },
                    { label: 'User Management', href: '/usermanagement', icon: 'fa-user', isGroup: false, submenuItems: [] },
                    { label: 'Auth Setting', href: '/authsetting', icon: 'fa-wrench', isGroup: false, submenuItems: [] },
                    { label: 'Notif Management', href: '/notificationmanagement', icon: 'fa-wrench', isGroup: false, submenuItems: [] },
                    { label: 'Loc Management', href: '/locationmanagement', icon: 'fa-wrench', isGroup: false, submenuItems: [] },
                    { label: 'People Management', href: '/peoplemanagement', icon: 'fa-wrench', isGroup: false, submenuItems: [] },
                    { label: 'Device Management', href: '/devicemanagement', icon: 'fa-wrench', isGroup: false, submenuItems: [] },

                ];
                if(role == "Super Admin"){
                    $scope.menuItems.push({ label: 'Site Management', href: '/sitemanagement', icon: 'fa-wrench', isGroup: false, submenuItems: [] });
                }


                appmanagementresource.$init(function (data) {

                    var applist = { label: 'App List', href: '', icon: 'fa-gears', isGroup: true, submenuItems: [] };

                    if (data.success) {

                        var list = data.obj;

                        angular.forEach(list, function (item) {
                            if (item.pagestatus) {
                                applist.submenuItems.push({ label: item.pagename, href: '/prevpage/' + item.id, icon: 'fa-dashboard' });
                            }
                        });

                    }

                    $scope.menuItems.push(applist);

                    $rootScope.addedNewApp = false;
                });

                //application list widget v2
                widgetmanagementresource.$getall(function (data) {

                    var applist = { label: 'App List V2', href: '', icon: 'fa-gears', isGroup: true, submenuItems: [] };

                    if (data.success) {

                        var list = data.obj;

                        angular.forEach(list, function (item) {
                            if (item.appstatus) {
                                applist.submenuItems.push({ label: item.appname, href: '/application/' + item.euid, icon: 'fa-dashboard' });
                            }
                        });

                    }

                    $scope.menuItems.push(applist);

                    $rootScope.addedNewApp = false;
                });
            }

            // $scope.getNotification = function(){
            //     notificationmanagementresource.$getAll(function(data){
            //         if(data.success){
            //             $rootScope.notificationList = data.obj;
            //         }
                    
            //     });
            // }
            // $scope.test = "aaaa";
            // $scope.notificationtemplate = '/javascripts/angularproject/partialviews/notificationmanagement.html';
            //Menu init when app run
            // $scope.initMenu();   
        }
    ]);