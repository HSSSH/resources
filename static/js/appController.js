define(['app', 'angularCgsUtil'], function (app) {
    app.controller("appCtrl", function ($scope, $http, $rootScope, $state, $uibModal,modules) {
        $scope.suc = {};
        $scope.modules = modules;
        $scope.module = {
                content: null,
                toggleModule: function(module) {
                    $state.go(module.sub[0].state);
                }
       };
       $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
    	   switch (toState.name){
                case "all.park.content":
                    $state.go("all.park.content.docMag");
                    break;
                case "all.park.equip":
                    $state.go("all.park.equip.operating");
                    break;
            }
        })
    });
});