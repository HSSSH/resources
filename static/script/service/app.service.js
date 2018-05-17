define(['app'], function (app) {
    app.service('selectOptionSer', ['$http', '$filter','$q', function ($http, $filter,$q) {
        var service = {
            //城区
            savedCityList:[],
            getCity: function (optionList, withoutAllOption) {
                if(service.savedCityList.length == 0){
                    $http.get("/common/cq").then(function (data) {
                        data.data.unshift({
                            OBJECTID: '',
                            CQ: '全部'
                        });
                        for (var index = 0; index < data.data.length; index++) {
                            optionList.push(data.data[index]);
                            service.savedCityList.push((data.data[index]));
                        }
                    })
                }
                else {
                    for (var index = 0; index < service.savedCityList.length; index++) {
                        optionList.push(service.savedCityList[index]);
                    }
                }
                if (withoutAllOption) {
                    optionList.shift();
                }
            },
            //土地等级
            savedLandGradeList:[],
            getLandGrade: function (optionList, withoutAllOption) {
                if(service.savedLandGradeList.length == 0){
                    $http.get("/common/tddj").then(function (data) {
                        data.data.unshift({
                            OBJECTID: '',
                            TDDJ: '全部'
                        });
                        for (var index = 0; index < data.data.length; index++) {
                            optionList.push(data.data[index]);
                            service.savedLandGradeList.push((data.data[index]));
                        }
                    })
                }
                else {
                    for (var index = 0; index < service.savedLandGradeList.length; index++) {
                        optionList.push(service.savedLandGradeList[index]);
                    }
                }
                if (withoutAllOption) {
                    optionList.shift();
                }
            },
            //批准用途
            savedApproveUseList:[],
            getApproveUse: function (optionList, withoutAllOption) {
                if(service.savedApproveUseList.length == 0){
                    $http.get("/common/pzyt").then(function (data) {
                        data.data.unshift({
                            OBJECTID: '',
                            PZYT: '全部'
                        });
                        for (var index = 0; index < data.data.length; index++) {
                            optionList.push(data.data[index]);
                            service.savedApproveUseList.push((data.data[index]));
                        }
                    })
                }
                else {
                    for (var index = 0; index < service.savedApproveUseList.length; index++) {
                        optionList.push(service.savedApproveUseList[index]);
                    }
                }
                if (withoutAllOption) {
                    optionList.shift();
                }
            },
            //使用现状
            savedUseStatusList:[],
            getUseStatus: function (optionList, withoutAllOption) {
                if(service.savedUseStatusList.length == 0){
                    $http.get("/common/pzyt").then(function (data) {
                        data.data.unshift({
                            OBJECTID: '',
                            PZYT: '全部'
                        });
                        for (var index = 0; index < data.data.length; index++) {
                            optionList.push(data.data[index]);
                            service.savedUseStatusList.push((data.data[index]));
                        }
                    })
                }
                else {
                    for (var index = 0; index < service.savedUseStatusList.length; index++) {
                        optionList.push(service.savedUseStatusList[index]);
                    }
                }
                if (withoutAllOption) {
                    optionList.shift();
                }
            },
            //土地坐落
            savedLandLocationList:[],
            getLandLocation: function (optionList, withoutAllOption, id) {
                var path = "/common/jdxx";
                if (id) {
                    path = "/common/jdxx?id=" + id;
                }
                if(service.savedLandLocationList.length == 0||id){
                    $http.get(path).then(function (data) {
                        data.data.unshift({
                            OBJECTID: '',
                            JDMC: '全部'
                        });
                        for (var index = 0; index < data.data.length; index++) {
                            var obj = data.data[index];
                            if (obj.CQ) {
                                delete(obj.CQ);
                            }
                            optionList.push(obj);
                            service.savedLandLocationList.push((obj));
                        }
                    })
                }
                else {
                    for (var index = 0; index < service.savedLandLocationList.length; index++) {
                        optionList.push(service.savedLandLocationList[index]);
                    }
                }
                if (withoutAllOption) {
                    optionList.shift();
                }
            },
            //合同到期情况
            savedContractExpirationList:[],
            getContractExpiration: function (optionList, withoutAllOption) {
                if(service.savedContractExpirationList.length == 0){
                    $http.get("/common/htdqqk").then(function (data) {
                        data.data.unshift({
                            OBJECTID: '',
                            HTDQQK: '全部'
                        });
                        for (var index = 0; index < data.data.length; index++) {
                            optionList.push(data.data[index]);
                            service.savedContractExpirationList.push((data.data[index]));
                        }
                    })
                }
                else {
                    for (var index = 0; index < service.savedContractExpirationList.length; index++) {
                        optionList.push(service.savedContractExpirationList[index]);
                    }
                }
                if (withoutAllOption) {
                    optionList.shift();
                }
            },
            //附件类型
            getAttachmentType: function (optionList, withoutAllOption) {
                var deferred=$q.defer();
                $http.get("/common/fjlx").then(function (data) {
                    data.data.unshift({
                        OBJECTID: '',
                        FJLX: '所有附件'
                    });
                    for (var index = 0; index < data.data.length; index++) {
                        optionList.push(data.data[index]);
                    }
					deferred.resolve();

                });
                return deferred.promise;
            },
            //缴款标识
            savedPaymentTypeList:[],
            getPaymentType: function (optionList, withoutAllOption) {
                if(service.savedPaymentTypeList.length == 0){
                    $http.get("/common/jkbs").then(function (data) {
                        data.data.unshift({
                            OBJECTID: '',
                            JKBS: '全部'
                        });
                        for (var index = 0; index < data.data.length; index++) {
                            optionList.push(data.data[index]);
                            service.savedPaymentTypeList.push((data.data[index]));
                        }
                    })
                }
                else {
                    for (var index = 0; index < service.savedPaymentTypeList.length; index++) {
                        optionList.push(service.savedPaymentTypeList[index]);
                    }
                }
                if (withoutAllOption) {
                    optionList.shift();
                }
            },
            //使用权类型
            savedUsageTypeList:[],
            getUsageType: function (optionList, withoutAllOption) {
                if(service.savedUsageTypeList.length == 0){
                    $http.get("/common/xyqlx").then(function (data) {
                        data.data.unshift({
                            OBJECTID: '',
                            SYQLX: '全部'
                        });
                        for (var index = 0; index < data.data.length; index++) {
                            optionList.push(data.data[index]);
                            service.savedUsageTypeList.push((data.data[index]));
                        }
                    })
                }
                else {
                    for (var index = 0; index < service.savedUsageTypeList.length; index++) {
                        optionList.push(service.savedUsageTypeList[index]);
                    }
                }
                if (withoutAllOption) {
                    optionList.shift();
                }
            },
            //征收类型
            savedCollectionTypeList:[],
            getCollectionType: function (optionList, withoutAllOption) {
                if(service.savedCollectionTypeList.length == 0){
                    $http.get("/common/zslx").then(function (data) {
                        data.data.unshift({
                            OBJECTID: '',
                            ZSLX: '全部'
                        });
                        for (var index = 0; index < data.data.length; index++) {
                            optionList.push(data.data[index]);
                            service.savedCollectionTypeList.push((data.data[index]));
                        }
                    })
                }
                else {
                    for (var index = 0; index < service.savedCollectionTypeList.length; index++) {
                        optionList.push(service.savedCollectionTypeList[index]);
                    }
                }
                if (withoutAllOption) {
                    optionList.shift();
                }
            },
            //日期格式化
            myDateFormat: function (item, key) {
                if (item[key] && item[key] != '') {
                    item[key] = $filter('date')(item[key], 'yyyy-MM-dd');
                }
            }

        };
        return service;
    }]);
    app.service('dialogWindow', ['$uibModal', function ($uibModal) {
        var dialog = {
            confirm: function (title, msg, closeCallback, dismissCallback) {
                closeCallback = typeof closeCallback == 'function' ? closeCallback : function () {
                };
                dismissCallback = typeof dismissCallback == 'function' ? dismissCallback : function () {
                };
                $uibModal.open({
                    templateUrl: 'partials/dialogWindow/confirm.html',
                    controller: 'dialogServiceConfirmCtrl',
                    size: 'sm',
                    backdrop: 'static',
                    resolve: {
                        title: function () {
                            return title;
                        },
                        msg: function () {
                            return msg;
                        }
                    }
                }).result.then(closeCallback, dismissCallback);
            },
            inputConfirm: function (title, msg, closeCallback, dismissCallback) {
                closeCallback = typeof closeCallback == 'function' ? closeCallback : function () {
                };
                dismissCallback = typeof dismissCallback == 'function' ? dismissCallback : function () {
                };
                $uibModal.open({
                    templateUrl: 'partials/dialogWindow/inputConfirm.html',
                    controller: 'dialogInputConfirmCtrl',
                    size: 'sm',
                    backdrop: 'static',
                    resolve: {
                        title: function () {
                            return title;
                        },
                        msg: function () {
                            return msg;
                        }
                    }
                }).result.then(closeCallback, dismissCallback);
            }
        };
        return dialog;
    }]);
    app.controller('dialogServiceConfirmCtrl', ['$scope', '$uibModalInstance', 'title', 'msg', function ($scope, $uibModalInstance, title, msg) {
        $scope.title = title ? title : '确认框';
        $scope.msg = msg;

        $scope.ok = function () {
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);
    app.controller('dialogInputConfirmCtrl', ['$scope', '$uibModalInstance', 'title', 'msg', function ($scope, $uibModalInstance, title, msg) {
        $scope.title = title ? title : '确认框';
        $scope.msg = msg;
        $scope.data = '';

        $scope.ok = function () {
            $uibModalInstance.close($scope.data);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);
    app.service('allOpenWindow', ['$uibModal', function ($uibModal) {
        var window = {
            openModal: function (type, item,flag) {
                var LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));
                if (LODOP) {
                    switch (type) {
                        case "attachment"://附件
                            $uibModal.open({
                                templateUrl: 'partials/projectInfo/popup/attachment.html',
                                controller: 'attachmentCtrl',
                                size: 'mySize',
                                backdrop: 'static',
                                resolve: {
                                    objectId: function () {
                                        return item.objectId
                                    }
                                }
                            }).result.then(function (data) {
                            }, function () {
                            });
                            break;
                        case "approval"://审批表
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
                            }, function () {
                            });
                            break;
                        case "approvalDetail"://查看审批表详情
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
                            break;
                        case "contract"://合同
                            $uibModal.open({
                                templateUrl: 'partials/landInfo/contract.html',
                                controller: 'contractCtrl',
                                backdrop: 'static',
                                size: 'A4',
                                resolve: {
                                    item: function () {
                                        return angular.copy(item);
                                    }
                                }
                            });
                            break;
                        case "declare":  //申报表
                            $uibModal.open({
                                templateUrl: 'partials/landInfo/attachment.html',
                                controller: 'modalBoxCtrl',
                                backdrop: 'static',
                                size: 'A4',
                                resolve: {
                                    item: function () {
                                        return angular.copy(item);
                                    }
                                }
                            });
                            break;
                        case "keepNotice":  //续办通知
                            $uibModal.open({
                                templateUrl: 'partials/projectInfo/popup/keepNotice.html',
                                controller: 'noticeCtrl',
                                backdrop: 'static',
                                size: 'A4',
                                resolve: {
                                    item: function () {
                                        return angular.copy(item);
                                    }
                                }
                            });
                            break;
                        case "pressMoneyNotice":  //催款通知
                            $uibModal.open({
                                templateUrl: 'partials/projectInfo/popup/pressMoneyNotice.html',
                                controller: 'noticeCtrl',
                                backdrop: 'static',
                                size: 'A4',
                                resolve: {
                                    item: function () {
                                        return angular.copy(item);
                                    }
                                }
                            });
                            break;
                    }
                }
            }
        };
        return window;
    }])
});
