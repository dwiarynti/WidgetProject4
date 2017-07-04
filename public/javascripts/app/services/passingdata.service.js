(function () {
	"use strict";
	angular
        .module("common.services")
        .factory('passingdataservice', function () {
        	var obj = {};
        	var addObj = obj;

        	var getObj = function () {
        		return addObj;
        	}

        	return {
        		addObj: addObj,
        		getObj: getObj
        	};


        });

})();