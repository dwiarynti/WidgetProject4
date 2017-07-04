"use strict";

angular.module('app').factory('dataService',
    ['$timeout',
    function ($timeout) {

    var locations = [
        {
            id: 1000,
            name: 'Raquette River',
            temperature: 55,
            guides: 20,
            rafts: 18,
            vests: 200,
            image: 'river1.png'
        },
        {
            id: 1001,
            name: 'Black River',
            temperature: 53,
            guides: 36,
            rafts: 22,
            vests: 250,
            image: 'river2.png'
        },
        {
            id: 1002,
            name: 'Hudson River',
            temperature: 58,
            guides: 56,
            rafts: 40,
            vests: 500,
            image: 'river3.png'
        },
        {
            id: 1003,
            name: 'Hudson Gorge',
            temperature: 39,
            guides: 8,
            rafts: 10,
            vests: 40,
            image: 'river4.png'
        },
        {
            id: 1004,
            name: 'Saranac River',
            temperature: 32,
            guides: 8,
            rafts: 8,
            vests: 100,
            image: 'river1.png'
        },
        {
            id: 1005,
            name: 'Black Creek',
            temperature: 34,
            guides: 22,
            rafts: 12,
            vests: 230,
            image: 'river2.png'
        },
        {
            id: 1006,
            name: 'Batten Kill',
            temperature: 54,
            guides: 20,
            rafts: 24,
            vests: 420,
            image: 'river3.png'
        },
        {
            id: 1007,
            name: 'Ausable River',
            temperature: 38,
            guides: 12,
            rafts: 8,
            vests: 225,
            image: 'river4.png'
        }
    ];

    var employees = [
        {
            id: 5000,
            name: 'Andy Chatterton',
            location: 'Raquette River',
            image: 'employee-andy.png'
        },
        {
            id: 5001,
            name: 'April Donaldson',
            location: 'Saranac River',
            image: 'employee-april.png'
        },
        {
            id: 5002,
            name: 'Don Morgan',
            location: 'Black Creek',
            image: 'employee-don.png'
        },
        {
            id: 5003,
            name: 'Tom Sullivan',
            location: 'Ausable River',
            image: 'employee-tom.png'
        },
        {
            id: 5004,
            name: 'Kathy Fletcher',
            location: 'Batten Kill',
            image: 'employee-kathy.png'
        }
    ];

    var widgetDefinitions = [
                // {
                //     title: 'Temperature',
                //     settings: {
                //         sizeX: 3,
                //         sizeY: 3,
                //         minSizeX: 2,
                //         minSizeY: 2,
                //         template: '<wwa-temperature></wwa-temperature>',
                //         widgetSettings: {
                //             id: 1000,
                //             templateUrl: '/javascripts/app/dialogs/wwaSelectLocationTemplate.html',
                //             controller: 'wwaSelectLocationController'
                //         }
                //     }
                // },
                // {
                //     title: 'Inventory',
                //     settings: {
                //         sizeX: 5,
                //         sizeY: 3,
                //         minSizeX: 2,
                //         minSizeY: 2,
                //         template: '<wwa-inventory></wwa-inventory>',
                //         widgetSettings: {
                //             id: 1002,
                //             templateUrl: '/javascripts/app/dialogs/wwaSelectLocationTemplate.html',
                //             controller: 'wwaSelectLocationController'
                //         }
                //     }
                // },
                // {
                //     title: 'Employee',
                //     settings: {
                //         sizeX: 5,
                //         sizeY: 3,
                //         minSizeX: 2,
                //         minSizeY: 2,
                //         template: '<wwa-employee></wwa-employee>',
                //         widgetSettings: {
                //             id: 5000,
                //             templateUrl: '/javascripts/app/dialogs/wwaSelectEmployeeTemplate.html',
                //             controller: 'wwaSelectEmployeeController'
                //         }
                //     }
                // },
                {
                    title: 'Location',
                    settings: {
                        sizeX: 5,
                        sizeY: 3,
                        minSizeX: 2,
                        minSizeY: 2,
                        template: '<mvplocation></mvplocation>',
                        widgetSettings: {
                            id: 5003,
                            selectedfilter:{by:"", option:""},
                            templateUrl: '/javascripts/angularproject/dialog/mvp-location/mvp-location-dialog.html',
                            controller: 'mvp-locationdialogcontroller'
                        }
                    }
                },
                {
                    title: 'Person',
                    settings: {
                        sizeX: 5,
                        sizeY: 3,
                        minSizeX: 2,
                        minSizeY: 2,
                        template: '<mvpperson></mvpperson>',
                        widgetSettings: {
                            id: 5003,
                            selectedfilter :"",
                            templateUrl: '',
                            controller: ''
                        }
                    }
                }, 
                {
                    title: 'Device',
                    settings: {
                        sizeX: 5,
                        sizeY: 3,
                        minSizeX: 2,
                        minSizeY: 2,
                        template: '<mvpdevice></mvpdevice>',
                        widgetSettings: {
                            id: 5003,
                            selectedfilter :null,
                            templateUrl: '/javascripts/angularproject/dialog/mvp-device/mvp-device-dialog.html',
                            controller: 'mvp-devicedialogcontroller'
                        }
                    }
                },
                {
                    title: 'Person Device',
                    settings: {
                        sizeX: 5,
                        sizeY: 3,
                        minSizeX: 2,
                        minSizeY: 2,
                        template: '<mvppersondevice></mvppersondevice>',
                        widgetSettings: {
                            id: 5003,
                            selectedfilter :null,
                            templateUrl: '/javascripts/angularproject/dialog/mvp-persondevice/mvp-persondevice-dialog.html',
                            controller: 'mvp-persondevicedialogcontroller'
                        }
                    }
                },
                {
                    title: 'Person Location',
                    settings: {
                        sizeX: 5,
                        sizeY: 3,
                        minSizeX: 2,
                        minSizeY: 2,
                        template: '<mvppersonlocation></mvppersonlocation>',
                        widgetSettings: {
                            id: 5003,
                            selectedfilter :null,
                            templateUrl: '/javascripts/angularproject/dialog/mvp-personlocation/mvp-personlocation-dialog.html',
                            controller: 'mvp-personlocationdialogcontroller'
                        }
                    }
                }
            ];

    var widgetform = [
                {
                    title: 'Site',
                    settings: {
                        sizeX: 3,
                        sizeY: 0,
                        minSizeX: 3,
                        minSizeY: 0,
                        template: '<mvpsite class="col-md-10" style="padding: 0px;"></mvpsite>',
                        widgetSettings: {
                            id: 5003,
                            configuration:{},
                            templateUrl: '/javascripts/angularproject/dialog/mvp-site/mvp-site-dialog.html',
                            controller: 'mvp-sitedialogcontroller',
                            settingiconstatus :true
                        }
                    }
                },
                // {
                //     title: 'Label',
                //     settings: {
                //         sizeX: 2,
                //         sizeY: 0,
                //         minSizeX: 2,
                //         minSizeY: 0,
                //         template: '<mvplabel></mvplabel>',
                //         widgetSettings: {
                //             id: 5003,
                //             configuration:{},
                //             templateUrl: '/javascripts/angularproject/dialog/mvp-label/mvp-label-dialog.html',
                //             controller: 'mvp-labeldialogcontroller',
                //             tempname : "label",
                //             settingiconstatus :false                            
                //         }
                //     }
                // },
                {
                    title: 'Location',
                    settings: {
                        sizeX: 6,
                        sizeY: 2,
                        minSizeX: 5,
                        minSizeY: 2,
                        template: '<mvplocation></mvplocation>',
                        widgetSettings: {
                            id: 5003,
                            configuration:{},
                            templateUrl: '/javascripts/angularproject/dialog/mvp-location/mvp-location-dialog.html',
                            controller: 'mvp-locationdialogcontroller',
                            // tempname : "table",
                            settingiconstatus :true                            
                        }
                    }
                },
            ];

    var getLocations = function () {
        return $timeout(function () {
            return locations;
        }, 500);
    };

    var getLocation = function (id) {
        var timeout = $timeout(function () {
            //$timeout.cancel(timeout);
            //return undefined;
            for (var i = 0; i < locations.length; i++)
                if (locations[i].id == id)
                    return locations[i];
            return undefined;
        }, 300);

        return timeout;
    };

    var getEmployees = function () {
        return $timeout(function () {
            return employees;
        }, 500);
    };

    var getEmployee = function (id) {
        return $timeout(function () {
            for (var i = 0; i < employees.length; i++)
                if (employees[i].id == id)
                    return employees[i];
            return undefined;
        }, 300);
    };

    var getWidgetDefinition = function(){
        return $timeout(function(){
            return widgetDefinitions},300);
    }

    var getWidgetForm = function(){
        return $timeout(function(){
            return widgetform},300);
    }


    return {
        getLocations: getLocations,
        getLocation: getLocation,
        getEmployees: getEmployees,
        getEmployee: getEmployee,
        getWidgetDefinition: getWidgetDefinition,
        getWidgetForm: getWidgetForm
    };
}]);