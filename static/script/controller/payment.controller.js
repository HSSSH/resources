define(['app'], function(app) {
    app.controller('notPayController',['$scope', '$http', '$rootScope','$state','selectOptionSer','dialogWindow','allOpenWindow',function($scope, $http, $rootScope,$state,selectOptionSer,dialogWindow,allOpenWindow) {
        $scope.searchItem = {
            dwmc:'',//单位名称
            htbh:'',//合同编号,
            sscq:'',//城区
            jd:'',//街道
            mph:'',//门牌号
            jkbs:''//缴款标识
        };
        //分页
        $scope.page = {
            totalCount: 0,
            pageNo: 1,
            pageSize: Math.floor(($("div.query").parent().parent()[0].offsetHeight - 210) / 40)
        };
        $scope.citySelect = [];//城区
        $scope.landLocationSelect=[];//土地坐落
        $scope.payTypeSelect=[];//缴款标识

        //获取当前项目列表信息
        $scope.currentList = function () {
            $http.get("/payment/unpay?pageNo="+$scope.page.pageNo+"&pageSize="+$scope.page.pageSize,{params:$scope.searchItem}).then(function (result) {
                $scope.noPayList = result.data.dataList;
                $scope.page.totalCount = result.data.totalCount;
                $scope.page.pageSize = result.data.pageSize;
            })
        };

        $scope.openModal = function (type,item) {
            allOpenWindow.openModal(type,item);
        };

        $scope.areaSelected = function() {
            $scope.landLocationSelect = [];
            selectOptionSer.getLandLocation($scope.landLocationSelect, false, $scope.searchItem.sscq);
        };

        function init() {
            //获取城区下拉框选项
            selectOptionSer.getCity($scope.citySelect);
            //土地坐落
            selectOptionSer.getLandLocation($scope.landLocationSelect);
            //缴款标识
            selectOptionSer.getPaymentType($scope.payTypeSelect);
            //获取当前项目列表信息
            $scope.currentList();
        }
        init();
    }]);
    app.controller('paidController',['$scope', '$http', '$rootScope','$state','selectOptionSer','dialogWindow','allOpenWindow',function($scope, $http, $rootScope,$state,selectOptionSer,dialogWindow,allOpenWindow) {
        $scope.searchItem = {
            dwmc:'',//单位名称
            htbh:'',//合同编号,
            sscq:'',//城区
            jd:'',//街道
            mph:''//门牌号
        };
        //分页
        $scope.page = {
            totalCount: 0,
            pageNo: 1,
            pageSize: Math.floor(($("div.query").parent().parent()[0].offsetHeight - 210) / 40)
        };
        $scope.citySelect = [];//城区
        $scope.landLocationSelect=[];//土地坐落

        //获取当前项目列表信息
        $scope.currentList = function () {
            $http.get("/payment/alreadypay?pageNo="+$scope.page.pageNo+"&pageSize="+$scope.page.pageSize,{params:$scope.searchItem}).then(function (result) {
                $scope.payList = result.data.dataList;
                $scope.page.totalCount = result.data.totalCount;
                $scope.page.pageSize = result.data.pageSize;
            })
        };

        $scope.areaSelected = function() {
            $scope.landLocationSelect = [];
            selectOptionSer.getLandLocation($scope.landLocationSelect, false, $scope.searchItem.sscq);
        };

        function init() {
            //获取城区下拉框选项
            selectOptionSer.getCity($scope.citySelect);
            //土地坐落
            selectOptionSer.getLandLocation($scope.landLocationSelect);
            //获取当前项目列表信息
            $scope.currentList();
        }
        init();
    }]);
});