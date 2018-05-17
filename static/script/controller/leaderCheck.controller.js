define(['app'], function(app) {
    app.controller('leaderCheckWaitCtrl',['$scope', '$http', '$rootScope','$state','selectOptionSer','dialogWindow','allOpenWindow',function($scope, $http, $rootScope,$state,selectOptionSer,dialogWindow,allOpenWindow){
        $scope.searchItem = {
            dwmc:'',//单位名称
            htbh:'',//合同编号
            tdzh:'',//土地证号
            jd:'',//街道
            mph:'',//门牌号
            tddj:'',//土地等级
            pzyt:'',//批准用途
            syxz:'',//使用现状
            zxyjje:'',//最小应缴金额
            zdyjje:'',//最大应缴金额
            zxhjyjje:'',//最小合计应缴金额
            zdhjyjje:'',//最大合计应缴金额
            zxtjrq:'',//最小录入日期
            zdtjrq:''//最大录入日期
        };
        $scope.all = {
            choose :false
        };
        $scope.selectList = [];
        //分页
        $scope.page = {
            totalCount: 0,
            pageNo: 1,
            pageSize: Math.floor(($("div.query").parent().parent()[0].offsetHeight - 210) / 40)
        };
        $scope.citySelect = [];//城区
        $scope.landGradeSelct = [];//土地等级
        $scope.approveUseSelect=[];//批准用途
        $scope.useStatusSelect=[];//使用现状
        $scope.landLocationSelect=[];//土地坐落

        //获取当前项目列表信息
        $scope.currentList = function () {
            $http.get("/leaderaudit/tobeaudit?pageNo="+$scope.page.pageNo+"&pageSize="+$scope.page.pageSize,{params:$scope.searchItem}).then(function (result) {
                $scope.waitingContract = result.data.dataList;
                $scope.page.totalCount = result.data.totalCount;
                $scope.page.pageSize = result.data.pageSize;
                for(var index = 0;index<$scope.waitingContract.length;index++){
                    $scope.waitingContract[index].choose = false;
                }
            })
        };

        //单选
        $scope.singleChoose = function (item) {
            item.choose = !item.choose;
            if(item.choose){
                $scope.selectList.push({id:item.objectId,remark:''});
                for(var index = 0;index<$scope.waitingContract.length;index++){
                    if($scope.waitingContract[index].choose == false){
                        $scope.all.choose = false;
                        return;
                    }
                }
                $scope.all.choose = true;
            }
            else{
                for(var j = 0;j<$scope.selectList.length;j++){
                    if($scope.selectList[j].id == item.objectId){
                        $scope.selectList.splice(j,1);
                    }
                }
                $scope.all.choose = false;
            }
        };
        //全选
        $scope.allChoose = function () {
            $scope.selectList = [];
            $scope.all.choose = !$scope.all.choose;
            for(var index = 0;index<$scope.waitingContract.length;index++){
                if($scope.all.choose) {
                    $scope.selectList.push({id:$scope.waitingContract[index].objectId,remark:''});
                    $scope.waitingContract[index].choose = true;
                }
                else {
                    $scope.waitingContract[index].choose = false;
                }
            }
        };
        $scope.passSingle = function (item,flag) {
            var str = '确认不通过?';
            var url = "/leaderaudit/auditnotpassone";
            if(flag){
                str = '确认通过?';
                url = "/leaderaudit/auditpassone";
                dialogWindow.confirm('提示',str,function () {
                    $http.post(url,{
                        "id": item.objectId,
                        "remark": ''
                    }).then(function (result) {
                        console.log(result.data);
                        dialogWindow.confirm('提示',result.data?'操作成功':'操作失败');
                        $scope.currentList();
                    })
                });
            }
            else {
                dialogWindow.inputConfirm(str,'回退理由:',function (remark) {
                    $http.post(url,{
                        "id": item.objectId,
                        "remark": remark
                    }).then(function (result) {
                        console.log(result.data);
                        dialogWindow.confirm('提示',result.data?'操作成功':'操作失败');
                        $scope.currentList();
                    })
                });
            }
        };
        $scope.passMultiple = function (flag) {
            var str = '批量确认不通过?';
            var url = "/leaderaudit/auditnotpassmore";
            if(flag){
                str = '批量确认通过?';
                url = "/leaderaudit/auditpassmore";
                dialogWindow.confirm('提示',str,function () {
                    $http.post(url,$scope.selectList).then(function (result) {
                        console.log(result.data);
                        dialogWindow.confirm('提示',result.data?'操作成功':'操作失败');
                        $scope.currentList();
                    })
                });
            }
            else {
                dialogWindow.inputConfirm(str,'回退理由:',function (remark) {
                    for(var j = 0;j<$scope.selectList.length;j++){
                        $scope.selectList[j].remark = remark;
                    }
                    $http.post(url,$scope.selectList).then(function (result) {
                        console.log(result.data);
                        dialogWindow.confirm('提示',result.data?'操作成功':'操作失败');
                        $scope.currentList();
                    })
                });
            }
        };
        $scope.myDateFormat = function (item,key) {
            selectOptionSer.myDateFormat(item,key);
        };
        $scope.openModal = function (type,item) {
            allOpenWindow.openModal(type,item);
        };
        function init() {
            //获取城区下拉框选项
            selectOptionSer.getCity($scope.citySelect);
            //获取土地等级下拉框
            selectOptionSer.getLandGrade($scope.landGradeSelct);
            //获取批准用途下拉框选项
            selectOptionSer.getApproveUse($scope.approveUseSelect);
            //获取使用现状下拉框选项
            selectOptionSer.getUseStatus($scope.useStatusSelect);
            //土地坐落
            selectOptionSer.getLandLocation($scope.landLocationSelect);
            //获取当前项目列表信息
            $scope.currentList();
        }
        init();
    }]);
    app.controller('leaderCheckPassCtrl',['$scope', '$http', '$rootScope','$state','selectOptionSer','dialogWindow','allOpenWindow',function($scope, $http, $rootScope,$state,selectOptionSer,dialogWindow,allOpenWindow){
        $scope.searchItem = {
            dwmc:'',//单位名称
            htbh:'',//合同编号
            tdzh:'',//土地证号
            jd:'',//街道
            mph:'',//门牌号
            tddj:'',//土地等级
            pzyt:'',//批准用途
            syxz:'',//使用现状
            zxyjje:'',//最小应缴金额
            zdyjje:'',//最大应缴金额
            zxhjyjje:'',//最小合计应缴金额
            zdhjyjje:'',//最大合计应缴金额
            zxtjrq:'',//最小录入日期
            zdtjrq:''//最大录入日期
        };
        //分页
        $scope.page = {
            totalCount: 0,
            pageNo: 1,
            pageSize: Math.floor(($("div.query").parent().parent()[0].offsetHeight - 210) / 40)
        };
        $scope.citySelect = [];//城区
        $scope.landGradeSelct = [];//土地等级
        $scope.approveUseSelect=[];//批准用途
        $scope.useStatusSelect=[];//使用现状
        $scope.landLocationSelect=[];//土地坐落

        //获取当前项目列表信息
        $scope.currentList = function () {
            $http.get("/leaderaudit/passaudit?pageNo="+$scope.page.pageNo+"&pageSize="+$scope.page.pageSize,{params:$scope.searchItem}).then(function (result) {
                $scope.passContract = result.data.dataList;
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
            //获取城区下拉框选项
            selectOptionSer.getCity($scope.citySelect);
            //获取土地等级下拉框
            selectOptionSer.getLandGrade($scope.landGradeSelct);
            //获取批准用途下拉框选项
            selectOptionSer.getApproveUse($scope.approveUseSelect);
            //获取使用现状下拉框选项
            selectOptionSer.getUseStatus($scope.useStatusSelect);
            //土地坐落
            selectOptionSer.getLandLocation($scope.landLocationSelect);
            //获取当前项目列表信息
            $scope.currentList();
        }
        init();
    }]);
    app.controller('leaderCheckRejectCtrl',['$scope', '$http', '$rootScope','$state','selectOptionSer','dialogWindow','allOpenWindow',function($scope, $http, $rootScope,$state,selectOptionSer,dialogWindow,allOpenWindow){
        $scope.searchItem = {
            dwmc:'',//单位名称
            htbh:'',//合同编号
            tdzh:'',//土地证号
            jd:'',//街道
            mph:'',//门牌号
            tddj:'',//土地等级
            pzyt:'',//批准用途
            syxz:'',//使用现状
            zxyjje:'',//最小应缴金额
            zdyjje:'',//最大应缴金额
            zxhjyjje:'',//最小合计应缴金额
            zdhjyjje:'',//最大合计应缴金额
            zxtjrq:'',//最小录入日期
            zdtjrq:''//最大录入日期
        };
        //分页
        $scope.page = {
            totalCount: 0,
            pageNo: 1,
            pageSize: Math.floor(($("div.query").parent().parent()[0].offsetHeight - 210) / 40)
        };
        $scope.citySelect = [];//城区
        $scope.landGradeSelct = [];//土地等级
        $scope.approveUseSelect=[];//批准用途
        $scope.useStatusSelect=[];//使用现状
        $scope.landLocationSelect=[];//土地坐落

        //获取当前项目列表信息
        $scope.currentList = function () {
            $http.get("/leaderaudit/notpassaudit?pageNo="+$scope.page.pageNo+"&pageSize="+$scope.page.pageSize,{params:$scope.searchItem}).then(function (result) {
                $scope.rejectContract = result.data.dataList;
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
            //获取城区下拉框选项
            selectOptionSer.getCity($scope.citySelect);
            //获取土地等级下拉框
            selectOptionSer.getLandGrade($scope.landGradeSelct);
            //获取批准用途下拉框选项
            selectOptionSer.getApproveUse($scope.approveUseSelect);
            //获取使用现状下拉框选项
            selectOptionSer.getUseStatus($scope.useStatusSelect);
            //土地坐落
            selectOptionSer.getLandLocation($scope.landLocationSelect);
            //获取当前项目列表信息
            $scope.currentList();
        }
        init();
    }]);
    app.controller('leaderCheckDeleteCtrl',['$scope', '$http', '$rootScope','$state','selectOptionSer','dialogWindow','allOpenWindow',function($scope, $http, $rootScope,$state,selectOptionSer,dialogWindow,allOpenWindow){
        $scope.searchItem = {
            dwmc:'',//单位名称
            htbh:'',//合同编号
            tdzh:'',//土地证号
            jd:'',//街道
            mph:'',//门牌号
            tddj:'',//土地等级
            pzyt:'',//批准用途
            syxz:'',//使用现状
            zxyjje:'',//最小应缴金额
            zdyjje:'',//最大应缴金额
            zxhjyjje:'',//最小合计应缴金额
            zdhjyjje:'',//最大合计应缴金额
            zxtjrq:'',//最小录入日期
            zdtjrq:''//最大录入日期
        };
        $scope.all = {
            choose :false
        };
        $scope.selectList = [];
        //分页
        $scope.page = {
            totalCount: 0,
            pageNo: 1,
            pageSize: Math.floor(($("div.query").parent().parent()[0].offsetHeight - 210) / 40)
        };
        $scope.citySelect = [];//城区
        $scope.landGradeSelct = [];//土地等级
        $scope.approveUseSelect=[];//批准用途
        $scope.useStatusSelect=[];//使用现状
        $scope.landLocationSelect=[];//土地坐落

        //获取当前项目列表信息
        $scope.currentList = function () {
            $http.get("/leaderaudit/tobedelete?pageNo="+$scope.page.pageNo+"&pageSize="+$scope.page.pageSize,{params:$scope.searchItem}).then(function (result) {
                $scope.deleteContract = result.data.dataList;
                $scope.page.totalCount = result.data.totalCount;
                $scope.page.pageSize = result.data.pageSize;
                for(var index = 0;index<$scope.deleteContract.length;index++){
                    $scope.deleteContract[index].choose = false;
                }
            })
        };

        //单选
        $scope.singleChoose = function (item) {
            item.choose = !item.choose;
            if(item.choose){
                $scope.selectList.push({id:item.objectId,remark:''});
                for(var index = 0;index<$scope.deleteContract.length;index++){
                    if($scope.deleteContract[index].choose == false){
                        $scope.all.choose = false;
                        return;
                    }
                }
                $scope.all.choose = true;
            }
            else{
                for(var j = 0;j<$scope.selectList.length;j++){
                    if($scope.selectList[j].id == item.objectId){
                        $scope.selectList.splice(j,1);
                    }
                }
                $scope.all.choose = false;
            }
        };
        //全选
        $scope.allChoose = function () {
            $scope.selectList = [];
            $scope.all.choose = !$scope.all.choose;
            for(var index = 0;index<$scope.deleteContract.length;index++){
                if($scope.all.choose) {
                    $scope.selectList.push({id:$scope.deleteContract[index].objectId,remark:''});
                    $scope.deleteContract[index].choose = true;
                }
                else {
                    $scope.deleteContract[index].choose = false;
                }
            }
        };
        $scope.passSingle = function (item,flag) {
            var str = '确认不通过?';
            var url = "/leaderaudit/deletenotpassone";
            if(flag){
                str = '确认通过?';
                url = "/leaderaudit/deletepassone";
            }
            dialogWindow.confirm('提示',str,function () {
                $http.post(url,{
                    "id": item.objectId,
                    "remark": ''
                }).then(function (result) {
                    console.log(result.data);
                    dialogWindow.confirm('提示',result.data?'操作成功':'操作失败');
                    $scope.currentList();
                })
            });
        };
        $scope.passMultiple = function (flag) {
            var str = '批量确认不通过?';
            var url = "/leaderaudit/deletenotpassmore";
            if(flag){
                str = '批量确认通过?';
                url = "/leaderaudit/deletepassmore";
            }
            dialogWindow.confirm('提示',str,function () {
                $http.post(url,$scope.selectList).then(function (result) {
                    console.log(result.data);
                    dialogWindow.confirm('提示',result.data?'操作成功':'操作失败');
                    $scope.currentList();
                })
            });
        };
        $scope.myDateFormat = function (item,key) {
            selectOptionSer.myDateFormat(item,key);
        };
        $scope.openModal = function (type,item) {
            allOpenWindow.openModal(type,item);
        };
        function init() {
            //获取城区下拉框选项
            selectOptionSer.getCity($scope.citySelect);
            //获取土地等级下拉框
            selectOptionSer.getLandGrade($scope.landGradeSelct);
            //获取批准用途下拉框选项
            selectOptionSer.getApproveUse($scope.approveUseSelect);
            //获取使用现状下拉框选项
            selectOptionSer.getUseStatus($scope.useStatusSelect);
            //土地坐落
            selectOptionSer.getLandLocation($scope.landLocationSelect);
            //获取当前项目列表信息
            $scope.currentList();
        }
        init();
    }])
});