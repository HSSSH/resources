define(['app'], function (app) {
    app.controller('landInfoNoUsedController', ['$scope', '$http', '$rootScope', '$state', '$uibModal', 'selectOptionSer', 'dialogWindow', function ($scope, $http, $rootScope, $state, $uibModal, selectOptionSer, dialogWindow) {
        $scope.searchItem = {
            dwmc: '',//单位名称
            tdzh: '',
            sscq: '',//城区
            jd: '',
            mph: '',
            tddj: '',//土地等级
            pzyt: ''//批准用途
        };
        $scope.page = {
            totalCount: 0,
            pageNo: 1,
            pageSize: Math.floor(($("div.query").parent().parent()[0].offsetHeight - 210) / 40)
        };
        $scope.currentList = function () {
            $http.get("/land/wzquery?pageNo=" + $scope.page.pageNo + "&pageSize=" + $scope.page.pageSize, {params: $scope.searchItem}).then(function (result) {
                $scope.queryData = result.data.dataList;
                $scope.page.totalCount = result.data.totalCount;
                $scope.page.pageSize = result.data.pageSize;
            })
        };
        $scope.params = {
            "isAddLand": true,
            currentIndex: 0
        };
        $scope.openModal = function (type, item,flag) {
            var LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));
            if (LODOP) {
                switch (type) {
                    case "declare":
                        $uibModal.open({
                            templateUrl: 'partials/landInfo/attachment.html',
                            controller: 'modalBoxCtrl',
                            size: 'A4',
                            backdrop: 'static',
                            resolve: {
                                item: function () {
                                    return angular.copy(item);
                                }
                            }
                        });
                        break;
                    case "inform":
                        $uibModal.open({
                            templateUrl: 'partials/landInfo/inform.html',
                            controller: 'modalBoxCtrl',
                            size: 'A4',
                            backdrop: 'static',
                            resolve: {
                                item: function () {
                                    return angular.copy(item);
                                }
                            }
                        });
                        break;
                    case "approval":
                        if (item.zybs == 2) {
                            dialogWindow.confirm("提示", "项目已存在，请在当前项目页面查看！");
                        }
                        else {
                            if(flag == "add"){
                                item.addProject = true;
                            }
                            $uibModal.open({
                                templateUrl: 'partials/landInfo/approval.html',
                                controller: 'modalBoxCtrl',
                                backdrop: 'static',
                                size: 'A4',
                                resolve: {
                                    item: function () {
                                        return angular.copy(item);
                                    }
                                }
                            }).result.then(function (data) {
                                $scope.currentList();
                            }, function () {
                            });
                        }
                        break;
                    case "approvalDetail":
                        $uibModal.open({
                            templateUrl: 'partials/landInfo/approvalDetail.html',
                            controller: 'modalBoxCtrl',
                            backdrop: 'static',
                            size: 'A4',
                            resolve: {
                                item: function () {
                                    return angular.copy(item);
                                }
                            }
                        }).result.then(function (data) {
                        }, function () {
                        });
                }
            }
        };
        $scope.citySelect = [];//城区
        $scope.landGradeSelct = [];//土地等级
        $scope.approveUseSelect = [];//批准用途
        $scope.useStatusSelect = [];//使用现状
        $scope.landLocationSelect = [];//土地坐落
        $scope.delete = function (item) {
            if (item.zybs == 2) {
                dialogWindow.confirm("提示", "确认删除该土地信息和对应项目信息？");
            }
            else {
                dialogWindow.confirm("删除确认", "是否删除该土地信息？", function () {
                    $http.post("/land/delete", item).then(function (success) {
                        dialogWindow.confirm("提示", "删除成功！");
                    }, function (error) {
                        dialogWindow.confirm("提示", "删除失败！");
                    });
                });
            }
        };
        $scope.updateModule = {
            projectExistError: function () {
                dialogWindow.confirm("提示", "项目已存在，不能修改土地信息！");
            }
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
            //土地坐落
            selectOptionSer.getLandLocation($scope.landLocationSelect);
            //获取当前项目列表信息
            $scope.currentList();
        }
        init();
    }]);
    app.controller('landInfoUsedController', ['$scope', '$http', '$rootScope', '$state', '$uibModal', 'selectOptionSer', 'allOpenWindow', function ($scope, $http, $rootScope, $state, $uibModal, selectOptionSer, allOpenWindow) {
        $scope.page = {
            totalCount: 0,
            pageNo: 1,
            pageSize: Math.floor(($("div.query").parent().parent()[0].offsetHeight - 210) / 40)
        };
        $scope.searchItem = {
            dwmc: '',//单位名称
            tdzh: '',
            sscq: '',//城区
            jd: '',
            mph: '',
            tddj: '',//土地等级
            pzyt: '',//批准用途
            startTime: '',
            endTime: ''
        };
        $scope.myDateFormat = function (item, key) {
            selectOptionSer.myDateFormat(item, key);
        };
        $scope.currentList = function () {
            $http.get("/land/yzquery?pageNo=" + $scope.page.pageNo + "&pageSize=" + $scope.page.pageSize, {params: $scope.searchItem}).then(function (result) {
                $scope.queryData = result.data.dataList;
                $scope.page.totalCount = result.data.totalCount;
                $scope.page.pageSize = result.data.pageSize;
            });
        };
        $scope.params = {
            "isAddLand": true
        };
        $scope.openModal = function (type, item) {
            allOpenWindow.openModal(type, item);
            // switch (type) {
            //     case "declare":
            //         $uibModal.open({
            //             templateUrl: 'partials/landInfo/attachment.html',
            //             controller: 'modalBoxCtrl',
            //             backdrop: 'static'
            //         });
            //         break;
            //     case "inform":
            //         $uibModal.open({
            //             templateUrl: 'partials/landInfo/inform.html',
            //             controller: 'modalBoxCtrl',
            //             backdrop: 'static'
            //         });
            //         break;
            //     case "approval":
            //         $uibModal.open({
            //             templateUrl: 'partials/landInfo/approval.html',
            //             controller: 'modalBoxCtrl',
            //             backdrop: 'static'
            //         });
            //         break;
            // }
        };
        $scope.citySelect = [];//城区
        $scope.landGradeSelct = [];//土地等级
        $scope.approveUseSelect = [];//批准用途
        $scope.useStatusSelect = [];//使用现状
        $scope.landLocationSelect = [];//土地坐落
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
            //土地坐落
            selectOptionSer.getLandLocation($scope.landLocationSelect);
            $scope.currentList();
        }
        init();
    }]);
    app.controller('addLandController', ['$scope', '$http', '$rootScope', '$state', 'selectOptionSer', 'dialogWindow', function ($scope, $http, $rootScope, $state, selectOptionSer, dialogWindow) {
        $scope.params = {
            number: $state.params.number,
            update: $state.params.update,
            add: false,
            dkh: undefined,
            jzjzmj: undefined,
            jztdmj: undefined,
            rjl: undefined,
            syqlx: undefined
        };
        if ($scope.params.number && !$scope.params.update) {
            $("input").prop('disabled', true);
            $("select").prop('disabled', true);
        }
        $scope.getLandDetail = function () {
            if (!$scope.params.number) {
                $scope.params.add = true;
                var landDetailString = "{\"dkh\":\"\",\"tddj\":{\"tddj\":\"1\",\"id\":1},\"dwmc\":\"\",\"pzytqt\":null,\"jzzmj\":null,\"bzc\":\"\",\"jdxx\":{\"jdmc\":\"紫阳街道\",\"xzqh\":{\"cq\":\"上城区\",\"id\":1},\"id\":1},\"pznsybz\":\"21\",\"lxdz\":\"\",\"pzyt\":{\"pzyt\":\"商业用地\",\"id\":1},\"jztdmj\":1523,\"bz\":null,\"syqlx\":{\"syqlx\":\"出让\",\"id\":1},\"objectId\":0,\"nsydj\":97,\"jzmj\":5751.75,\"deletePerson\":null,\"xzqh\":{\"cq\":\"上城区\",\"id\":1},\"lxdh\":\"\",\"mph\":\"\",\"xzyt\":{\"pzyt\":\"商业用地\",\"id\":1},\"lxr\":\"\",\"tdzh\":null,\"zybs\":\"0\",\"deleteReason\":null,\"rjl\":3.77,\"xznsybz\":\"118\",\"deleteTime\":null,\"tdzmj\":null,\"jzjzmj\":5751.75,\"xmlx\":\"非市场类\",\"nyjje\":557919.75,\"zslx\":{\"zslx\":\"划拨土地出租\",\"id\":1}}";
                $scope.landDetail = JSON.parse(landDetailString);
                //获取地块号
                $http.get("/land/dkh").then(function (res) {
                    $scope.params.dkh = res.data[0].dkh;
                });
            }
            else {
                $http.get("/land/queryInfo?id=" + $scope.params.number).then(function (result) {
                    $scope.landDetail = result.data;
                    $scope.params.jzjzmj = $scope.landDetail.jzjzmj;
                    $scope.params.jztdmj = $scope.landDetail.jztdmj;
                    $scope.params.rjl = $scope.landDetail.rjl;
                    $scope.params.dkh = result.data.dkh;
                    // $scope.params.syqlx = $scope.landDetail.syqlx;

                });
            }
        };
        $scope.checkBeforeSave = function() {
            var inputEmpty = $("input.ng-empty");
            inputEmpty.each(function() {
                if (!$(this).parent().prev().hasClass("not-required") && !$(this).hasClass("not-required")) {
                    dialogWindow.confirm("提示", $(this).parent().prev().text() + "还没有填!");
                    return false;
                }
            });
            var syqlxId = $scope.landDetail.syqlx.id;
            var zslxId = $scope.landDetail.zslx.id;
            var pzytId = $scope.landDetail.pzyt.id;
            var xzytId = $scope.landDetail.xzyt.id;
            if (syqlxId == 1 && zslxId != 4) {
                dialogWindow.confirm("提示", "使用权类型和征收类型选项冲突，请检查！");
                return false;
            }
            if (syqlxId == 2 && zslxId != 1 && zslxId != 2 && zslxId != 3) {
                dialogWindow.confirm("提示", "使用权类型和征收类型选项冲突，请检查！");
                return false;
            }
            if (pzytId == xzytId && (zslxId == 4 || zslxId == 3)) {
                dialogWindow.confirm("提示", "征收类型和用途选项冲突，请检查！");
                return false;
            }
            if (pzytId != xzytId && (zslxId == 1 || zslxId == 2)) {
                dialogWindow.confirm("提示", "征收类型和用途选项冲突，请检查！");
                return false;
            }
            return true;
        };
        $scope.save = function () {
            if ($scope.checkBeforeSave()) {
                dialogWindow.confirm("确认", "是否保存该土地信息？", function () {
                    // var xzyt = {pzyt: $scope.landDetail.pzyt.PZYT, id: $scope.landDetail.pzyt.OBJECTID};
                    // $scope.landDetail.xzyt = xzyt;
                    // var xzqh = {cq: $scope.landDetail.jdxx.xzqh.CQ, id: $scope.landDetail.jdxx.xzqh.OBJECTID};
                    // $scope.landDetail.jdxx.xzqh = xzqh;
                    // var tddj = {tddj: $scope.landDetail.tddj.TDDJ, id: $scope.landDetail.tddj.OBJECTID};
                    // $scope.landDetail.tddj = tddj;
                    // var pzyt = {pzyt: $scope.landDetail.pzyt.PZYT, id: $scope.landDetail.pzyt.OBJECTID};
                    // $scope.landDetail.pzyt = pzyt;
                    // var syqlx = {syqlx: $scope.landDetail.syqlx.SYQLX, id: $scope.landDetail.syqlx.OBJECTID};
                    // $scope.landDetail.syqlx = syqlx;
                    // var zslx = {zslx: $scope.landDetail.zslx.ZSLX, id: $scope.landDetail.zslx.OBJECTID};
                    // $scope.landDetail.zslx = zslx;
                    $scope.landDetail.rjl = $scope.params.rjl;
                    for (var i = 0; i < $scope.landLocationSelect.length; i++) {
                        if ($scope.landLocationSelect[i].OBJECTID == $scope.landDetail.jdxx.id) {
                            $scope.landDetail.jdxx.jdmc = $scope.landLocationSelect[i].JDMC;
                            break;
                        }
                    }
                    $scope.landDetail.jzjzmj = $scope.params.jzjzmj;
                    $scope.landDetail.jztdmj = $scope.params.jztdmj;
                    if ($scope.params.rjl >= 1) {
                        $scope.landDetail.jzmj = $scope.params.jzjzmj;
                    }
                    else {
                        $scope.landDetail.jzmj = $scope.params.jztdmj;
                    }
                    selectionFixed($scope.landGradeSelct, $scope.landDetail.tddj.id, "tddj", $scope.landDetail.tddj);
                    selectionFixed($scope.approveUseSelect, $scope.landDetail.pzyt.id, "pzyt", $scope.landDetail.pzyt);
                    selectionFixed($scope.useStatusSelect, $scope.landDetail.xzyt.id, "pzyt", $scope.landDetail.xzyt);
                    selectionFixed($scope.collectionTypeSelect, $scope.landDetail.zslx.id, "zslx", $scope.landDetail.zslx);
                    selectionFixed($scope.usageTypeSelect, $scope.landDetail.syqlx.id, "syqlx", $scope.landDetail.syqlx);
                    selectionFixed($scope.citySelect, $scope.landDetail.jdxx.id, "jdmc", $scope.landDetail.jdxx);
                    for (var i = 0; i < $scope.citySelect.length; i++) {
                        if ($scope.citySelect[i].OBJECTID == $scope.landDetail.jdxx.xzqh.id) {
                            $scope.landDetail.jdxx.xzqh.cq = $scope.citySelect[i].CQ;
                        }
                    }
                    for (var i = 0; i < $scope.landLocationSelect.length; i++) {
                        if ($scope.landLocationSelect[i].OBJECTID == $scope.landDetail.jdxx.id) {
                            $scope.landDetail.jdxx.jdmc = $scope.landLocationSelect[i].JDMC;
                        }
                    }
                    $scope.landDetail.xzqh.id = $scope.landDetail.jdxx.xzqh.id;
                    $scope.landDetail.xzqh.cq = $scope.landDetail.jdxx.xzqh.cq;
                    $scope.landDetail.dkh = $scope.params.dkh;
                    function selectionFixed(selection, id, key, obj) {
                        for (var i = 0; i < selection.length; i++) {
                            if (id == selection[i].OBJECTID) {
                                obj[key] = selection[i][key.toUpperCase()];
                                break;
                            }
                        }
                    }
                    if ($scope.params.add) {
                        $http.post("/land/add", $scope.landDetail)
                            .then(function (value) {
                                console.log(value);
                                if (value.data == true) {
                                    dialogWindow.confirm("反馈", "保存成功！");
                                }
                                else {
                                    dialogWindow.confirm("反馈", "根据现有政策计算得应缴年收益单价为负数，请检查！");
                                }
                            }, function (error) {
                                dialogWindow.confirm("反馈", "出错了！");
                            });
                    }
                    else {
                        $http.post("/land/update", $scope.landDetail)
                            .then(function (value) {
                                if (value.data == true) {
                                    dialogWindow.confirm("反馈", "保存成功！");
                                }
                                else {
                                    dialogWindow.confirm("反馈", "出错了！");
                                }
                            }, function (error) {
                                dialogWindow.confirm("反馈", "出错了！");
                            });
                    }
                });
            }
        };
        $scope.citySelect = [];//城区
        $scope.landGradeSelct = [];//土地等级
        $scope.approveUseSelect = [];//批准用途
        $scope.useStatusSelect = [];//使用现状
        $scope.landLocationSelect = [];//土地坐落
        $scope.usageTypeSelect = [];//使用权类型
        $scope.collectionTypeSelect = [];//征收类型
        $scope.checkLandArea = function () {
            if (!$scope.landDetail.tdzmj || !$scope.landDetail.jzzmj) {
                dialogWindow.confirm("提示", "请先输入建筑总面积和土地总面积！");
            }
        };
        $scope.computeJZArea = function (which) {
            if (which == "jianzhu") {
                $scope.params.jztdmj = Math.floor($scope.params.jzjzmj*$scope.landDetail.tdzmj/$scope.landDetail.jzzmj * 100) / 100;
            }
            else {
                $scope.params.jzjzmj = Math.floor(($scope.params.jztdmj*$scope.landDetail.jzzmj/$scope.landDetail.tdzmj) *100) /100;
            }
        };
        $scope.computeRJL = function () {
            if ($scope.landDetail.jzzmj && $scope.landDetail.tdzmj) {
                $scope.params.rjl = ($scope.landDetail.jzzmj / $scope.landDetail.tdzmj).toFixed(2);
            }
        };
        $scope.validNumber = function(event) {
            if (!event.originalEvent.key.match(/[1-9.e]/)) {
                dialogWindow.confirm("提示", "请输入数字！");
            }
        };
        $scope.areaSelected = function() {
            $scope.landLocationSelect = [];
            selectOptionSer.getLandLocation($scope.landLocationSelect, true, $scope.landDetail.jdxx.xzqh.id);
        };
        function init() {
            //获取城区下拉框选项
            selectOptionSer.getCity($scope.citySelect, true);
            //获取土地等级下拉框
            selectOptionSer.getLandGrade($scope.landGradeSelct, true);
            //获取批准用途下拉框选项
            selectOptionSer.getApproveUse($scope.approveUseSelect, true);
            //获取使用现状下拉框选项
            selectOptionSer.getUseStatus($scope.useStatusSelect, true);
            //土地坐落
            selectOptionSer.getLandLocation($scope.landLocationSelect, true);
            //获取当前项目列表信息
            selectOptionSer.getUsageType($scope.usageTypeSelect, true);
            //获取使用权类型列表信息
            selectOptionSer.getCollectionType($scope.collectionTypeSelect, true);
            // $http({
            //     method: 'GET',
            //     url: '/land/dkh',
            //     transformResponse: function(res) {
            //         return res
            //     }
            // }).then(function (res) {
            //     // result还不确定是哪个赋值给地块号
            //     $scope.params.dkh = res;
            // });
            //获取使用权类型列表信息
            $scope.getLandDetail();
        }
        init();
    }]);
    app.controller("modalBoxCtrl", ["$scope", "$uibModalInstance", "$uibModal", "item", "$http", "dialogWindow",function ($scope, $uibModalInstance, $uibModal, item, $http, dialogWindow) {
        $scope.item = item;
        $scope.currentDate = new Date();
        $scope.approvalDetail = {};
        $scope.contractModule = {
            contractStartTime: undefined,
            contractEndTime: undefined,
            contractTime: undefined,
            contractValue: '',
            jbyj: "该宗地权属清楚，资料齐全，经实地踏勘，符合杭政办函[2012]282号文件办理条件，拟同意报批。",
            shyj: undefined,
            spyj: undefined,
            bz: undefined,
            computeTime: function () {
                var startTime = $scope.contractModule.contractStartTime;
                var endTime = $scope.contractModule.contractEndTime;
                $scope.contractModule.contractTime = $scope.contractModule.getMonthScope(startTime, endTime);
                if($scope.contractModule.contractTime!=0){
                    $scope.contractModule.contractValue = ($scope.item.nyjje * $scope.contractModule.contractTime / 12).toFixed(2);
                }
            },
            getMonthScope: function (startTime, endTime) {
                var totalMonths = 0;
                var smallPart = 0;
                if(startTime && endTime){
                    var startYear = startTime .getFullYear(); //获取完整的年份(4位)
                    var startMonth = startTime .getMonth()+1; //获取当前月份(0-11,0代表1月)
                    var startDay = startTime .getDate(); //获取当前日(1-31)
                    var endYear = endTime .getFullYear(); //获取完整的年份(4位)
                    var endMonth = endTime .getMonth()+1; //获取当前月份(0-11,0代表1月)
                    var endDay = endTime .getDate(); //获取当前日(1-31)

                    if(endDay >= startDay - 1){
                        totalMonths = (endYear - startYear)*12+(endMonth - startMonth);
                        smallPart = ((endDay - startDay+1) / 30).toFixed(2);
                    }
                    else {
                        totalMonths = (endYear - startYear)*12+(endMonth - startMonth)-1;
                        var dayRemains = 0;
                        if (endMonth - 1 == 2) {
                            if ((endMonth - 1) % 4 == 0) { //29
                                dayRemains = 29;
                            } else { //28
                                dayRemains = 28;
                            }
                        } else if ((endMonth - 1) % 2 == 0) { //30
                            dayRemains = 30;
                        } else {  //31
                            dayRemains = 31;
                        }
                        smallPart = (((dayRemains - startDay + 1) + endDay) / 30).toFixed(2)

                    }
                }
                var num = totalMonths+parseFloat(smallPart);
                console.log(num);
                return num;
            },
            formatTime: function (time) {
                var dateObj = new Date(time);
                var year = dateObj.getFullYear();
                var month = dateObj.getMonth() + 1;
                var day = dateObj.getDate();
                return year + "年" + month + "月" + day + "日";
            },
            getApprovalDetail: function () {
                $http.get("/project/gethtxx?objectId=" + $scope.item.objectId).then(function (result) {
                    $scope.approvalDetail = result.data;
                });
            }
        };
        $scope.declareModule = {
            startTime: undefined,
            endTime: undefined,
            params: {
                tdid: $scope.item.objectId
            },
            getContractTime: function () {
                $http.get("/land/htsj", {params: $scope.declareModule.params}).then(function (result) {
                    $scope.declareModule.startTime = result.data[0].startTime;
                    $scope.declareModule.endTime = result.data[0].endTime;
                });
            }
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
        $scope.print = function (type) {
            if (document.getElementById("contractStartTime") && document.getElementById("contractEndTime")) {
                document.getElementById("contractStartTime").innerHTML = $scope.contractModule.formatTime($scope.contractModule.contractStartTime);
                document.getElementById("contractEndTime").innerHTML = $scope.contractModule.formatTime($scope.contractModule.contractEndTime);
                deleteReminder(document.getElementById("jbyj"), '填写（非必须）：');
                deleteReminder(document.getElementById("shyj"), '填写（非必须）：');
                deleteReminder(document.getElementById("spyj"), '填写（非必须）：');
                deleteReminder(document.getElementById("bz"), '填写（非必须）：');

                function deleteReminder(elem, reminder) {
                    var text = elem.innerHTML;
                    var position = text.indexOf(reminder);
                    var reminderLenght = reminder.length;
                    if (position >= 0) {
                        s = text.substr(0, position) + text.substr(position + reminderLenght);
                        elem.innerHTML = s;
                    }
                }
            }
            var LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));
            LODOP.PRINT_INIT("打印表格");
            LODOP.SET_PRINT_STYLE("FontSize", 15);
            var style = "<style>" + document.getElementById("style").innerHTML + "</style>";
            var htm = style + "<body>" + document.getElementById("content").innerHTML + "</body>";
            switch (type) {
                case "inform":
                    LODOP.ADD_PRINT_HTM(120, 100, 593, 910, htm);
                    break;
                default:
                    LODOP.ADD_PRINT_HTM(120, 100, 593, 910, htm);
            }
            LODOP.PREVIEW();

        };
        $scope.checkBeforeSaveContract = function() {
            var startTime = $scope.contractModule.contractStartTime;
            var endTime = $scope.contractModule.contractEndTime;
            if (!startTime || !endTime || startTime.getTime() > endTime.getTime()) {
                dialogWindow.confirm("提示","合同时间未正确填写！");
                return false;
            }
            if (!Number.isInteger($scope.contractModule.contractTime)) {
                // dialogWindow.confirm("提示","合同年限范围输入不满足整数个月数，是否确认保存？", function() {
                // }, function() {
                //     return false;
                // });
            }
            return true;
        };
        $scope.saveContract = function () {
            if ($scope.checkBeforeSaveContract()) {
                dialogWindow.confirm("确认", "保存到数据库吗？", function () {
                    var data = {
                        htksrq: $scope.contractModule.contractStartTime,
                        htjsrq: $scope.contractModule.contractEndTime,
                        jbyj: $scope.contractModule.jbyj,
                        kzyj: $scope.contractModule.kzyj,
                        jldyj: $scope.contractModule.jldyj,
                        bz: $scope.contractModule.bz,
                        tdxx: $scope.item,
                        hjyjje: $scope.contractModule.contractValue,
                        tdqlr: $scope.item.dwmc,
                        lxdh: $scope.item.lxdh,
                        htnx: $scope.contractModule.contractTime,
                        htbh: $scope.approvalDetail.htbh
                    };
                    $http({
                        url: "/project/addproject",
                        method: "post",
                        data: data
                    }).then(function (value) {
                        if (value.data == true) {
                            dialogWindow.confirm("提示", "保存成功！");
                        }
                        else {
                            dialogWindow.confirm("提示", "保存失败！");
                        }
                    }, function (error) {
                        dialogWindow.confirm("提示", "保存失败！");
                    });
                });
            }
        };
        $scope.init = function () {
            if($scope.item.addProject){
                $http.get("/project/createhtbh").then(function (result) {
                    $scope.approvalDetail.htbh = result.data.htbh;
                });
            }
            else {
                $scope.contractModule.getApprovalDetail();
                $scope.declareModule.getContractTime();
            }
        };
        $scope.init();
    }]);
});