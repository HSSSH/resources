define(['app','angularZhcsDirective'], function(app) {
    app.controller('appCtrl',['$scope', '$http', '$rootScope','$state', '$sce', '$filter','$interval','$q','leftMenu', function($scope, $http, $rootScope,$state, $sce, $filter,$interval,$q,leftMenu) {
        $scope.websiteInformationModule = {
            websiteName: "杭州市土地年收益征收管理信息系统"
        };
        $scope.menuData = leftMenu;
        $scope.currentMenu = {};
        $scope.menu = {};
        var mainState = ["foldChild"];
        var goToState = {};
        $scope.menuSize = {
            size: '5px',
            position: 'left',
            height: 'calc(100% - 20px)'
        };
        $scope.suc = {user:'', group:'', role:''};
        function init() {
            for (var i = 0; i < $scope.menuData.length; i++) {
                mainState.push($scope.menuData[i].state);
                $scope.menu[$scope.menuData[i].state] = (i == 0);
            }
            $scope.currentMenu = $scope.menuData[0];
            addGoToState($scope.menuData);
            getCurrentUser();
            $http.get("/userauth/session").then(function (result1) {
                updateAll();
            });
        }

        $scope.chooseUpMenu = function (menu) {
            $scope.currentMenu = menu;
        };
        $scope.logout = function () {
            window.location.href='logout';
        };
        $scope.$on('$stateChangeStart', function (evt, toState) {
            var state = toState.name;
            for (var key in $scope.menu) {
                if(key == state.split(".")[0]) {
                    $scope.menu[key] = true;
                    for (var i = 0; i < $scope.menuData.length; i++) {
                        if($scope.menuData[i].state == key){
                            $scope.currentMenu = $scope.menuData[i];
                        }
                    }
                }
                else $scope.menu[key] = false;
            }
            if (goToState[state]) {
                $state.go(goToState[state]);
                evt.preventDefault();
            }
        });

        function getCurrentUser() {
        }
        function addGoToState(menu) {
            for (var item in menu) {
                if (menu[item].children) {
                    goToState[menu[item].state] = menu[item].children[0].state;
                    addGoToState(menu[item].children);
                }
            }
        }

        var interval1,interval2;     //通知提醒闪烁控制
        $scope.notice = {
            unPayNumber:0,
            expireNumber:0
        };
        $scope.remind = {
            showBt1:true,
            showBt2:true
        };
        function updateRemind(url,numKey) {
            var deferred = $q.defer();
            $http.get(url).then(function (result) {
                $scope.notice[numKey] = result.data[numKey];
                deferred.resolve($scope.notice[numKey]);
            });
            return deferred.promise;
        }

        function updateAll() {
            updateRemind("/payment/unpaynumber","unPayNumber").then(function (num) {
                if(num == 0 && interval1){
                    $interval.cancel(interval1);
                }
                else if(num > 0 && interval1 == undefined){
                    interval1 = $interval(function () {
                        $scope.remind.showBt1 = !$scope.remind.showBt1;
                    },1000);
                }
            });
            updateRemind("/payment/expirenumber","expireNumber").then(function (num) {
                if(num == 0 && interval2){
                    $interval.cancel(interval2);
                }
                else if(num > 0 && interval2 == undefined){
                    interval2 = $interval(function () {
                        $scope.remind.showBt2 = !$scope.remind.showBt2;
                    },1000);
                }
            });
        }

        var getNotice = $interval(function () {
            updateAll();
        },300*1000);

        init();

        $scope.ff = function () {
            $http.get("rest/authox/objectOps").then(function (result1) {
                $http.get("/rest/authox/operations").then(function (result2) {
                    for(var item in result1.data){
                        result1.data[item].chn = result2.data[result1.data[item].opcode];
                    }
                    console.log(result1.data);
                });
            });
        }
    }]);
});