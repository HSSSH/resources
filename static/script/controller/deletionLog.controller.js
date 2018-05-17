define(['app'], function(app) {
    app.controller('landDeleteController',['$scope', '$http', '$rootScope','$state','selectOptionSer','dialogWindow','allOpenWindow',function($scope, $http, $rootScope,$state,selectOptionSer,dialogWindow,allOpenWindow) {
        $scope.searchItem = {
            dwmc:'',//单位名称
            tdzh:'',//土地证号
            jd:'',//街道
            mph:'',//门牌号
            tddj:'',//土地等级
            pzyt:'',//批准用途
            startTime:'',
            endTime:''
        };
        //分页
        $scope.page = {
            totalCount: 0,
            pageNo: 1,
            pageSize: Math.floor(($("div.query").parent().parent()[0].offsetHeight - 210) / 40)
        };
        $scope.landGradeSelct = [];//土地等级
        $scope.approveUseSelect=[];//批准用途
        $scope.landLocationSelect=[];//土地坐落

        //获取当前项目列表信息
        $scope.currentList = function () {
            $http.get("/deleterecord/tdxxrecord?pageNo="+$scope.page.pageNo+"&pageSize="+$scope.page.pageSize,{params:$scope.searchItem}).then(function (result) {
                $scope.recordList = result.data.dataList;
                $scope.page.totalCount = result.data.totalCount;
                $scope.page.pageSize = result.data.pageSize;
            })
        };
        $scope.myDateFormat = function (item,key) {
            selectOptionSer.myDateFormat(item,key);
        };
        $scope.openModal = function (type,item) {
            allOpenWindow.openModal(type,item);
        };
        function init() {
            //获取土地等级下拉框
            selectOptionSer.getLandGrade($scope.landGradeSelct);
            //获取批准用途下拉框选项
            selectOptionSer.getApproveUse($scope.approveUseSelect);
            //土地坐落
            selectOptionSer.getLandLocation($scope.landLocationSelect);
            //获取当前项目列表信息
            $scope.currentList();
        }
        init();
    }]);
    app.controller('contractDeleteController',['$scope', '$http', '$rootScope','$state','selectOptionSer','dialogWindow','allOpenWindow',function($scope, $http, $rootScope,$state,selectOptionSer,dialogWindow,allOpenWindow) {
        $scope.searchItem = {
            dwmc:'',//单位名称
            htbh:'',//合同编号
            tdzh:'',//土地证号
            jd:'',//街道
            mph:'',//门牌号
            tddj:'',//土地等级
            pzyt:'',//批准用途
            startTime:'',
            endTime:''
        };
        //分页
        $scope.page = {
            totalCount: 0,
            pageNo: 1,
            pageSize: Math.floor(($("div.query").parent().parent()[0].offsetHeight - 210) / 40)
        };
        $scope.landGradeSelct = [];//土地等级
        $scope.approveUseSelect=[];//批准用途
        $scope.landLocationSelect=[];//土地坐落

        //获取当前项目列表信息
        $scope.currentList = function () {
            $http.get("/deleterecord/htxxrecord?pageNo="+$scope.page.pageNo+"&pageSize="+$scope.page.pageSize,{params:$scope.searchItem}).then(function (result) {
                $scope.recordList = result.data.dataList;
                $scope.page.totalCount = result.data.totalCount;
                $scope.page.pageSize = result.data.pageSize;
            })
        };
        $scope.myDateFormat = function (item,key) {
            selectOptionSer.myDateFormat(item,key);
        };
        $scope.openModal = function (type,item) {
            allOpenWindow.openModal(type,item);
        };
        function init() {
            //获取土地等级下拉框
            selectOptionSer.getLandGrade($scope.landGradeSelct);
            //获取批准用途下拉框选项
            selectOptionSer.getApproveUse($scope.approveUseSelect);
            //土地坐落
            selectOptionSer.getLandLocation($scope.landLocationSelect);
            //获取当前项目列表信息
            $scope.currentList();
        }
        init();
    }]);
});