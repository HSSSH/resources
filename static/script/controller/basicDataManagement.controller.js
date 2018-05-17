define(['app'], function(app) {
    app.controller('annualYieldStandardCtrl',['$scope', '$http','dialogWindow',function($scope, $http,dialogWindow){
        function init() {
            $scope.listData = [];
            $scope.level = [];
            var head = [];
            $http.get("/Basic/ndjquery").then(function (result) {
                var allList = result.data;
                for(var index =0 ;index<allList.length;index++){
                    var flag = false;
                    for(var j = 0;j<head.length;j++){
                        if(allList[index].pzyt.id == head[j].id){
                            $scope.listData[j].push(allList[index]);
                            flag = true;
                        }
                    }
                    if(!flag){
                        head.push(allList[index].pzyt);
                        $scope.listData[(head.length - 1)] = [];
                        $scope.listData[(head.length - 1)].push(allList[index]);
                    }
                }
                console.log($scope.listData);
                for(var k =0;k< $scope.listData[0].length;k++){
                    $scope.level.push($scope.listData[0][k].tddj);
                }
            });
        }
        init();

        $scope.save = function () {
            console.log($scope.listData);
            dialogWindow.confirm('提示','确定保存',function () {
                var list = [];
                for(var k = 0;k < $scope.listData.length;k++){
                    for(var i = 0;i<$scope.listData[k].length;i++){
                        list.push($scope.listData[k][i]);
                    }
                }
                $http.post("/Basic/ndjupdate",list).then(function (result) {
                    console.log(result.data);
                    if(result.data){
                        dialogWindow.confirm('提示','更新成功');
                        init();
                    }
                    else {
                        dialogWindow.confirm('提示','更新失败');
                    }
                })
            })
        }
    }]);
    app.controller('remindTimeSetCtrl',['$scope', '$http','dialogWindow','allOpenWindow',function($scope, $http,dialogWindow,allOpenWindow){
        function init() {
            $http.get("/Basic/qtcsquery").then(function (result) {
                $scope.data = result.data[0];
            })
        }
        init();

        $scope.save = function () {
            dialogWindow.confirm('提示','确定保存',function () {
                $http.post("/Basic/qtcsupdate",$scope.data).then(function (result) {
                    console.log(result.data);
                    if(result.data){
                        dialogWindow.confirm('提示','更新成功');
                        init();
                    }
                    else {
                        dialogWindow.confirm('提示','更新失败');
                    }
                })
            });
        }
    }]);
});