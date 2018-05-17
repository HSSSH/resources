define(['app'], function(app) {
    //当前项目控制器
    app.controller('currentCtrl',['$scope', '$http', '$uibModal','selectOptionSer','dialogWindow','allOpenWindow',function($scope, $http,$uibModal,selectOptionSer,dialogWindow,allOpenWindow) {
        $scope.searchItem = {
            dwmc:'',//单位名称
            htbh:'',//合同编号
            sscq:'',//城区
            tddj:'',//土地等级
            pzyt:'',//批准用途
            syxz:'',//使用现状
            tdzh:'',//土地证号
            jd:'',//街道
            mph:'',//门牌号
            zxyjje:'',//最小应缴金额
            zdyjje:'',//最大应缴金额
            zxhjyjje:'',//最小合计应缴金额
            zdhjyjje:'',//最大合计应缴金额
            zxlrrq:'',//最小录入日期
            zdlrrq:''//最大录入日期
        };

        //分页
        $scope.page = {
            totalCount: 0,
            pageNo: 1,
            pageSize: Math.floor(($("div.projectInfo").parent()[0].offsetHeight - 210) / 40)
        };

        $scope.citySelect = [];//城区
        $scope.landGradeSelct = [];//土地等级
        $scope.approveUseSelect=[];//批准用途
        $scope.useStatusSelect=[];//使用现状
        $scope.landLocationSelect=[];//土地坐落

        //获取当前项目列表信息
        $scope.currentList = function () {
            $http.get("/project/currentproject?pageNo="+$scope.page.pageNo+"&pageSize="+$scope.page.pageSize,{params:$scope.searchItem}).then(function (result) {
                $scope.list = result.data.dataList;
                $scope.page.totalCount = result.data.totalCount;
                $scope.page.pageSize = result.data.pageSize;
            })
        };

        $scope.myDateFormat = function (item,key) {
            selectOptionSer.myDateFormat(item,key);
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

        $scope.openModal = function (type,item) {
            allOpenWindow.openModal(type,item);
        };

        //发送审核
        $scope.sendCheck = function (item) {
            dialogWindow.confirm('提示','确认发送审核?',function () {
                $http.get("/project/auditing?objectId="+item.objectId).then(function (result) {
                    console.log(result.data);
                    $scope.currentList();
                })
            });
        };
        $scope.deleteItem = function (item) {
            if(item.htqdqk == '合同已签'){
                dialogWindow.confirm('提示','该项目合同已签，确认进行删除审批流程?',function () {
                    $http.get("/project/deleteproject?objectId="+item.objectId).then(function (result) {
                        console.log(result.data);
                        if(result.data){
                            dialogWindow.confirm('提示','发送审核成功');
                        }
                        else {
                            dialogWindow.confirm('提示','发送审核失败');
                        }
                        $scope.currentList();
                    })
                })
            }
            else {
                dialogWindow.confirm('提示','确认删除?',function () {
                    $http.get("/project/deleteproject?objectId="+item.objectId).then(function (result) {
                        console.log(result.data);
                        if(result.data){
                            dialogWindow.confirm('提示','删除成功');
                        }
                        else {
                            dialogWindow.confirm('提示','删除失败');
                        }
                        $scope.currentList();
                    })
                });
            }
        };
        $scope.areaSelected = function() {
            $scope.landLocationSelect = [];
            selectOptionSer.getLandLocation($scope.landLocationSelect, false, $scope.searchItem.sscq);
        };
    }]);

    //附件控制器
    app.controller("attachmentCtrl", ["$scope", "$uibModalInstance","$uibModal", "$http",'selectOptionSer','dialogWindow','objectId', function ($scope, $uibModalInstance,$uibModal, $http,selectOptionSer,dialogWindow,objectId) {
        $scope.searchItem={
            fileType:{     //附件类型
                OBJECTID: '',
                FJLX: '所有附件'
            }
        };
        $scope.attachmentTypeSelect = [];//附件类型

        $scope.all = {
            choose :false
        };
        $scope.selectList = [];
        //分页
        $scope.page = {
            totalCount: 0,
            pageNo: 1,
            pageSize: Math.floor(($("div.projectInfo").parent()[0].offsetHeight - 210) / 40)
        };

        //单选
        $scope.singleChoose = function (item) {
            item.choose = !item.choose;
            if(item.choose){
                $scope.selectList.push({id:item.id,path:item.path});
                for(var index = 0;index<$scope.list.length;index++){
                    if($scope.list[index].choose == false){
                        $scope.all.choose = false;
                        return;
                    }
                }
                $scope.all.choose = true;
            }
            else{
                for(var j = 0;j<$scope.selectList.length;j++){
                    if($scope.selectList[j].id == item.id){
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
            for(var index = 0;index<$scope.list.length;index++){
                if($scope.all.choose) {
                    $scope.selectList.push({id:$scope.list[index].id,path:$scope.list[index].path});
                    $scope.list[index].choose = true;
                }
                else {
                    $scope.list[index].choose = false;
                }
            }
        };
        $scope.downloadSingle = function (item) {
            window.open(encodeURI("/project/download?path="+item.path));
            return;
        };
        $scope.downloadMultiple = function () {
            for(var j = 0;j<$scope.selectList.length;j++){
                $scope.downloadSingle($scope.selectList[j].path);
            }
        };
        //预览
        $scope.viewFile = function (item) {
            var format = item.fjmc.split(".");
            var sam = format[format.length-1].toLowerCase();
            if(sam=='jpg'||sam=='jpeg'||sam=='gif'||sam=='png'||sam == 'bmp'){
                $http.get("/project/showfj?id="+item.id).then(function (result) {
                    if(result.status == 200){
                        window.open("/project/showfj?id="+item.id);
                    }
                }, function (res){
                    dialogWindow.confirm('提示', '文件无法预览！');
                });
            }
            else {
                dialogWindow.confirm('提示', '该附件不支持预览，请下载查看！');
                return;
            }
        };

        //获取附件类型列表信息
        $scope.attachmentTypeList = function () {
            $http.get("/project/queryfj?pageNo="+$scope.page.pageNo+"&pageSize="+$scope.page.pageSize+"&objectId="+objectId+"&fjlxId="+$scope.searchItem.fileType.OBJECTID).then(function (result) {
                $scope.list = result.data.dataList;
                $scope.page.totalCount = result.data.totalCount;
                $scope.page.pageSize = result.data.pageSize;
                for(var index = 0;index<$scope.list.length;index++){
                    $scope.list[index].choose = false;
                }
            })
        };

        function init() {
            //获取附件类型下拉框选项
            selectOptionSer.getAttachmentType($scope.attachmentTypeSelect).then(function () {
                $scope.searchItem.fileType = $scope.attachmentTypeSelect[0];
            });
            //获取附件类型列表信息
            $scope.attachmentTypeList();
        }
        init();

        //文件上传
        $scope.upload = function () {
            if($scope.searchItem.fileType.OBJECTID == '') {
                dialogWindow.confirm('提示', '请先选择一个分类后再上传！');
                return;
            }
            $uibModal.open({
                templateUrl: '../../partials/projectInfo/popup/uploadFile.html',
                controller: 'uploadFile',
                size: 'lg',
                backdrop: 'static',
                resolve: {
                    objectId:function () {
                        return objectId
                    },
                    fileType:function () {
                        return angular.copy($scope.searchItem.fileType);
                    }
                }
            }).result.then(function(data) {
                $scope.attachmentTypeList();
            }, function() {
            })
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };

    }]);

    //上传文件控制器
    app.controller("uploadFile", ["$scope", "$uibModalInstance", "$http","selectOptionSer","objectId","fileType","FileUploader","dialogWindow" ,function ($scope, $uibModalInstance, $http,selectOptionSer,objectId,fileType,FileUploader,dialogWindow) {
        $scope.fileTypeName = fileType.FJLX;

        var uploader = $scope.uploader = new FileUploader({
            url: '/project/upload?objectId='+objectId+'&fjlxId='+fileType.OBJECTID
        });
        // FILTERS
        // a sync filter
        uploader.filters.push({
            name: 'syncFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                console.log('syncFilter');
                return this.queue.length < 10;
            }
        });
        // an async filter
        uploader.filters.push({
            name: 'asyncFilter',
            fn: function (item /*{File|FileLikeObject}*/, options, deferred) {
                console.log('asyncFilter');
                setTimeout(deferred.resolve, 1e3);
            }
        });
        // CALLBACKS
        uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function (fileItem) {
            if(fileItem.file.size == 0){
                dialogWindow.confirm('提示','文件:'+fileItem.file.name+'为空，不能上传!');
                fileItem.remove();
            }
            if(fileItem.file.size > 10000000){
                dialogWindow.confirm('提示','文件:'+fileItem.file.name+'过大，不能上传!');
                fileItem.remove();
            }
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function (addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function (item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function (fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function (progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function (fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function (fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function () {
            console.info('onCompleteAll');
        };
        console.info('uploader', uploader);

        $scope.closeWindow = function () {
            $uibModalInstance.close();
        };
    }]);

    //到期项目控制器
    app.controller('remindCtrl',['$scope', '$http','selectOptionSer','dialogWindow','allOpenWindow',function($scope, $http,selectOptionSer,dialogWindow,allOpenWindow) {
        $scope.searchItem = {
            dwmc: '',//单位名称
            htbh: '',//合同编号
            sscq: '',//城区
            tddj: '',//土地等级
            pzyt: '',//批准用途
            syxz: '',//使用现状
            jd: '',//街道
            mph: '',//门牌号
            zxyjje: '',//最小应缴金额
            zdyjje: '',//最大应缴金额
            zxhjyjje: '',//最小合计应缴金额
            zdhjyjje: '',//最大合计应缴金额
            htdqqk:'',//合同到期情况
            zxhtjsrq:'',//最小合同到期日期
            zdhtjsrq:''//最大合同到期日期
        };

        //分页
        $scope.page = {
            totalCount: 0,
            pageNo: 1,
            pageSize: Math.floor(($("div.projectInfo").parent()[0].offsetHeight - 210) / 40)
        };
        //分页
        $scope.page = {
            totalCount: 0,
            pageNo: 1,
            pageSize: Math.floor(($("div.projectInfo").parent()[0].offsetHeight - 210) / 40)
        };
        $scope.citySelect = [];//城区
        $scope.landGradeSelct = [];//土地等级
        $scope.approveUseSelect = []; //批准用途
        $scope.useStatusSelect = [];//使用现状
        $scope.landLocationSelect = [];//土地坐落
        $scope.contractExpirationSelect = [];//合同到期情况

        //获取到期项目提醒列表信息
        $scope.remindList = function () {
            $http.get("/project/expireproject?pageNo="+$scope.page.pageNo+"&pageSize="+$scope.page.pageSize,{params: $scope.searchItem}).then(function (result) {
                $scope.list = result.data.dataList;
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

        $scope.notKeep = function (item) {
            dialogWindow.confirm('提示','确认不续签?',function () {
                $http.post('/project/discontinued',item).then(function (result) {
                    console.log(result.data);
                    $scope.remindList();
                })
            });
        };
        $scope.areaSelected = function() {
            $scope.landLocationSelect = [];
            selectOptionSer.getLandLocation($scope.landLocationSelect, false, $scope.searchItem.sscq);
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
            //土地坐落下拉框选项
            selectOptionSer.getLandLocation($scope.landLocationSelect);
            //合同到期情况下拉框选项
            selectOptionSer.getContractExpiration($scope.contractExpirationSelect);
            //获取到期项目提醒列表信息
            $scope.remindList();
        }

        init();
    }]);

    //历史项目控制器
    app.controller('historyCtrl',['$scope', '$http','selectOptionSer','allOpenWindow',function($scope, $http,selectOptionSer,allOpenWindow) {
        $scope.searchItem = {
            dwmc: '',//单位名称
            htbh: '',//合同编号
            tdzh:'',//土地证号
            sscq: '',//城区
            jd: '',//街道
            mph: '',//门牌号
            zxhtrq:'',//最小合同签订日期
            zdhtrq:'',//最大合同签订日期
            zxhtjsrq:'',//最小合同到期日期
            zdhtjsrq:''//最大合同到期日期
        };
        //分页
        $scope.page = {
            totalCount: 0,
            pageNo: 1,
            pageSize: Math.floor(($("div.projectInfo").parent()[0].offsetHeight - 210) / 40)
        };
        $scope.citySelect = [];//城区
        $scope.landLocationSelect = [];//土地坐落

        //获取历史项目列表信息
        $scope.historyList = function () {
            $http.get("/project/historycontract?pageNo="+$scope.page.pageNo+"&pageSize="+$scope.page.pageSize, {params: $scope.searchItem}).then(function (result) {
                $scope.list = result.data.dataList;
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

        $scope.areaSelected = function() {
            $scope.landLocationSelect = [];
            selectOptionSer.getLandLocation($scope.landLocationSelect, false, $scope.searchItem.sscq);
        };

        function init() {
            //获取城区下拉框选项
            selectOptionSer.getCity($scope.citySelect);
            //土地坐落下拉框选项
            selectOptionSer.getLandLocation($scope.landLocationSelect);
            //获取历史项目列表信息
            $scope.historyList();
        }

        init();
    }]);

    //合同已签确认控制器
    app.controller('contractSignCtrl',['$scope', '$http','dialogWindow','allOpenWindow',function($scope, $http,dialogWindow,allOpenWindow) {
        $scope.searchItem = {
            dwmc: '',//单位名称
            htbh: ''//合同编号
        };

        //分页
        $scope.page = {
            totalCount: 0,
            pageNo: 1,
            pageSize: Math.floor(($("div.projectInfo").parent()[0].offsetHeight - 210) / 40)
        };

        //获取合同已签确认列表信息
        $scope.contractSignList = function () {
            $http.get("/project/confirmationcontract?pageNo="+$scope.page.pageNo+"&pageSize="+$scope.page.pageSize,{params: $scope.searchItem}).then(function (result) {
                $scope.list = result.data.dataList;
                $scope.page.totalCount = result.data.totalCount;
                $scope.page.pageSize = result.data.pageSize;
            })
        };

        $scope.openModal = function (type,item) {
            allOpenWindow.openModal(type,item);
        };

        $scope.signEnsure = function (item) {
            dialogWindow.confirm('提示','确认已签?',function () {
                $http.post('/project/surecontract',item).then(function (result) {
                    console.log(result.data);
                    $scope.contractSignList();
                })
            });
        };

        function init() {
            //获取合同已签确认列表信息
            $scope.contractSignList();
        }

        init();
    }]);

    //合同删除确认控制器
    app.controller('contractDeleteCtrl',['$scope', '$http','selectOptionSer','dialogWindow','allOpenWindow',function($scope, $http,selectOptionSer,dialogWindow,allOpenWindow) {
        $scope.searchItem = {
            dwmc: '',//单位名称
            htbh: '',//合同编号
            sscq: '',//城区
            tddj: '',//土地等级
            pzyt: '',//批准用途
            syxz: '',//使用现状
            tdzh: '',//土地证号
            jd: '',//街道
            mph: '',//门牌号
            zxyjje: '',//最小应缴金额
            zdyjje: '',//最大应缴金额
            zxhjyjje: '',//最小合计应缴金额
            zdhjyjje: '',//最大合计应缴金额
            zxtjrq: '',//最小提交日期
            zdtjrq: ''//最大提交日期
        };

        //分页
        $scope.page = {
            totalCount: 0,
            pageNo: 1,
            pageSize: Math.floor(($("div.projectInfo").parent()[0].offsetHeight - 210) / 40)
        };

        $scope.landGradeSelct = [];//土地等级
        $scope.approveUseSelect = [];//批准用途
        $scope.useStatusSelect = [];//使用现状
        $scope.landLocationSelect = [];//土地坐落

        //获取合同删除确认列表信息
        $scope.contractDeleteList = function () {
            $http.get("/project/querydeletecontract?pageNo="+$scope.page.pageNo+"&pageSize="+$scope.page.pageSize, {params: $scope.searchItem}).then(function (result) {
                $scope.list = result.data.dataList;
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

        $scope.deleteEnsure = function (item) {
            dialogWindow.confirm('提示','确认删除?',function () {
                $http.post('/project/suredelete',item).then(function (result) {
                    console.log(result.data);
                    $scope.contractDeleteList();
                })
            });
        };

        function init() {
            //获取土地等级下拉框
            selectOptionSer.getLandGrade($scope.landGradeSelct);
            //获取批准用途下拉框选项
            selectOptionSer.getApproveUse($scope.approveUseSelect);
            //获取使用现状下拉框选项
            selectOptionSer.getUseStatus($scope.useStatusSelect);
            //土地坐落
            selectOptionSer.getLandLocation($scope.landLocationSelect);
            //获取合同删除确认列表信息
            $scope.contractDeleteList();
        }

        init();
    }]);

    //合同页面
    app.controller('contractCtrl',['$scope','$http','$uibModalInstance','$filter','item', function($scope,$http, $uibModalInstance,$filter,item) {
        $scope.data = {};
        $http.get("/project/gethtxx?objectId="+item.objectId).then(function (result) {
            $scope.data = result.data;
            $scope.data.tdxx.chineseNum1 = intToChinese($scope.data.tdxx.nsydj);
            $scope.data.tdxx.chineseNum2 = intToChinese($scope.data.tdxx.nyjje);
            $scope.data.tdxx.chineseNum3 = intToChinese($scope.data.hjyjje);
            $scope.data.htrqYear = $filter('dateCutPart')($scope.data.htrq,0);
            $scope.data.htrqMonth = $filter('dateCutPart')($scope.data.htrq,1);
            $scope.data.htrqDay = $filter('dateCutPart')($scope.data.htrq,2);
        });

        $scope.close = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.print = function () {
            if (document.getElementById("contractStartTime") && document.getElementById("contractEndTime")) {
                document.getElementById("contractStartTime").innerHTML = $scope.contractModule.formatTime($scope.contractModule.contractStartTime);
                document.getElementById("contractEndTime").innerHTML = $scope.contractModule.formatTime($scope.contractModule.contractEndTime);
            }
            var LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));
            LODOP.PRINT_INIT("打印表格");
            LODOP.SET_PRINT_STYLE("FontSize", 15);
            var style = "<style>" + document.getElementById("style").innerHTML + "</style>";
            var htm = style + "<body>" + document.getElementById("content").innerHTML + "</body>";
            LODOP.ADD_PRINT_HTM(40, 30, 750, 1200, htm);
            LODOP.PREVIEW();
        };

        function intToChinese(n) {
            if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
                return "数据非法";
            var unit = "千百拾亿千百拾万千百拾元角分", str = "";
            n += "00";
            var p = n.indexOf('.');
            if (p >= 0)
                n = n.substring(0, p) + n.substr(p+1, 2);
            unit = unit.substr(unit.length - n.length);
            for (var i=0; i < n.length; i++)
                str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
            return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
        }
    }]);
    //通知页面
    app.controller('noticeCtrl',['$scope','$http','$uibModalInstance','item', function($scope,$http, $uibModalInstance,item) {
        $scope.data = item;
        $scope.currentTime = new Date();

        $scope.close = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.print = function () {
            if (document.getElementById("contractStartTime") && document.getElementById("contractEndTime")) {
                document.getElementById("contractStartTime").innerHTML = $scope.contractModule.formatTime($scope.contractModule.contractStartTime);
                document.getElementById("contractEndTime").innerHTML = $scope.contractModule.formatTime($scope.contractModule.contractEndTime);
            }
            var LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));
            LODOP.PRINT_INIT("打印表格");
            LODOP.SET_PRINT_STYLE("FontSize", 15);
            var style = "<style>" + document.getElementById("style").innerHTML + "</style>";
            var htm = style + "<body>" + document.getElementById("content").innerHTML + "</body>";
            LODOP.ADD_PRINT_HTM(40, 30, 750, 1200, htm);
            LODOP.PREVIEW();
        };
    }]);
    app.filter('dateFormateChe',[function () {
        return function (date) {
            if(date){
                var list = date.split('-');
                return list[0] + '年' + list[1] + '月' + list[2] + '日';
            }
        }
    }]);
    app.filter('dateCutPart',[function () {
        return function (date,num) {
            if(date){
                var list = date.split('-');
                return list[num];
            }
        }
    }]);
});