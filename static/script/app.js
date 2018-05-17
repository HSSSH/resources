define(
    [
        'angular',
        'angularAnimate',
        'angularUiRouter',
        'angularZhcsDirective',
        'angularZhcsService',
        'bootstrap',
        'uiBootstrapTpls',
        'angularFileUpload',
        'authox'
    ],
    function (angular) {
        var app = angular.module('app', ['ngAnimate', 'ui.bootstrap', 'angular-zhcs-service', 'ui.router', 'angular-zhcs-directive','angularFileUpload','authox']);
        app.constant('leftMenu', [
            {
                "name": "土地信息",
                "state": "landInfo",
                "url": "/landInfo",
                "templateUrl": "partials/landInfo.html",
                "authox":"TDXX|access",
                "children": [
                    {
                        "name": "未征土地",
                        "imgSrc": "images/menuLogo/为证土地.png",
                        "state": "landInfo.noUse",
                        "url": "/noUse",
                        "authox":"TDXX|TDXX_WZTDCX",
                        "views": {
                            'hint1@': {
                                "templateUrl": "partials/landInfo/noUse.html"
                            }
                        },
                        "noRouteChildren": [
                            {
                                "state": "landInfo.noUse.add",
                                "url": "/noUseAdd?number?update",
                                "views": {
                                    'hint1@': {
                                        "templateUrl": "partials/landInfo/noUse/add.html"
                                    }
                                }
                            }
                        ]
                    },
                    {
                        "name": "已征土地",
                        "imgSrc": "images/menuLogo/已征土地.png",
                        "state": "landInfo.used",
                        "url": "/used",
                        "authox":"TDXX|TDXX_YZTDCX",
                        "views": {
                            'hint1@': {
                                "templateUrl": "partials/landInfo/used.html"
                            }
                        },
                        "noRouteChildren": [
                            {
                                "state": "landInfo.used.add",
                                "url": "/noUseAdd?number?update",
                                "views": {
                                    'hint1@': {
                                        "templateUrl": "partials/landInfo/noUse/add.html"
                                    }
                                }
                            }
                        ]
                    }
                ]
            }, {
                "name": "项目信息",
                "state": "projectInfo",
                "url": "/projectInfo",
                "templateUrl": "partials/projectInfo.html",
                "authox":"XMXX|access",
                "children": [
                    {
                        "name": "当前项目",
                        "imgSrc": "images/menuLogo/当前项目.png",
                        "state": "projectInfo.current",
                        "url": "/current",
                        "authox":"XMXX|XMXX_DQXM_CX",
                        "views": {
                            'hint2@': {
                                "templateUrl": "partials/projectInfo/current.html"
                            }
                        },
                        "noRouteChildren": [
                            {
                                "state": "projectInfo.current.add",
                                "url": "/noUseAdd?number?update",
                                "views": {
                                    'hint2@': {
                                        "templateUrl": "partials/landInfo/noUse/add.html"
                                    }
                                }
                            }
                        ]
                    },
                    {
                        "name": "到期项目提醒",
                        "imgSrc": "images/menuLogo/到期项目提醒.png",
                        "state": "projectInfo.remind",
                        "url": "/remind",
                        "authox":"XMXX|XMXX_DQXMTX_CX",
                        "views": {
                            'hint2@': {
                                "templateUrl": "partials/projectInfo/remind.html"
                            }
                        },
                        "noRouteChildren": [
                            {
                                "state": "projectInfo.remind.add",
                                "url": "/noUseAdd?number?update",
                                "views": {
                                    'hint2@': {
                                        "templateUrl": "partials/landInfo/noUse/add.html"
                                    }
                                }
                            }
                        ]
                    },
                    {
                        "name": "历史项目",
                        "imgSrc": "images/menuLogo/历史项目.png",
                        "state": "projectInfo.history",
                        "url": "/history",
                        "authox":"XMXX|XMXX_LSXM_CX",
                        "views": {
                            'hint2@': {
                                "templateUrl": "partials/projectInfo/history.html"
                            }
                        }
                    },
                    {
                        "name": "合同已签确认",
                        "imgSrc": "images/menuLogo/合同已签确认.png",
                        "state": "projectInfo.contractSign",
                        "url": "/contractSign",
                        "authox":"XMXX|XMXX_HTYQQR",
                        "views": {
                            'hint2@': {
                                "templateUrl": "partials/projectInfo/contractSign.html"
                            }
                        }
                    },
                    {
                        "name": "合同删除确认",
                        "imgSrc": "images/menuLogo/合同删除确认.png",
                        "state": "projectInfo.contractDelete",
                        "url": "/contractDelete",
                        "authox":"XMXX|XMXX_HTSCQR",
                        "views": {
                            'hint2@': {
                                "templateUrl": "partials/projectInfo/contractDelete.html"
                            }
                        }
                    }
                ]
            }, {
                "name": "科室负责人审核",
                "state": "check",
                "url": "/check",
                "templateUrl": "partials/check.html",
                "authox":"KSFZRSH|access",
                "children": [
                    {
                        "name": "待审核",
                        "imgSrc": "images/menuLogo/待审核.png",
                        "state": "check.waiting",
                        "url": "/waiting",
                        "authox":"KSFZRSH|KSFZRSH_DSH",
                        "views": {
                            'hint3@': {
                                "templateUrl": "partials/check/waiting.html"
                            }
                        }
                    },
                    {
                        "name": "审核已通过",
                        "imgSrc": "images/menuLogo/审核已通过.png",
                        "state": "check.pass",
                        "url": "/pass",
                        "authox":"KSFZRSH|KSFZRSH_YTG",
                        "views": {
                            'hint3@': {
                                "templateUrl": "partials/check/pass.html"
                            }
                        }
                    },
                    {
                        "name": "审核未通过",
                        "imgSrc": "images/menuLogo/审核未通过.png",
                        "state": "check.reject",
                        "url": "/reject",
                        "authox":"KSFZRSH|KSFZRSH_WTG",
                        "views": {
                            'hint3@': {
                                "templateUrl": "partials/check/reject.html"
                            }
                        }
                    },
                    {
                        "name": "合同删除审核",
                        "imgSrc": "images/menuLogo/合同删除审核.png",
                        "state": "check.delete",
                        "url": "/delete",
                        "authox":"KSFZRSH|KSFZRSH_HTSCSH",
                        "views": {
                            'hint3@': {
                                "templateUrl": "partials/check/delete.html"
                            }
                        }
                    }
                ]
            }, {
                "name": "分局领导审核",
                "state": "leaderCheck",
                "url": "/leaderCheck",
                "templateUrl": "partials/leaderCheck.html",
                "authox":"FJLDSH|access",
                "children": [
                    {
                        "name": "待审核",
                        "imgSrc": "images/menuLogo/待审核.png",
                        "state": "leaderCheck.waiting",
                        "url": "/waiting",
                        "authox":"FJLDSH|FJLDSH_DSH",
                        "views": {
                            'hint4@': {
                                "templateUrl": "partials/leaderCheck/waiting.html"
                            }
                        }
                    },
                    {
                        "name": "审核已通过",
                        "imgSrc": "images/menuLogo/审核已通过.png",
                        "state": "leaderCheck.pass",
                        "url": "/pass",
                        "authox":"FJLDSH|FJLDSH_YTG",
                        "views": {
                            'hint4@': {
                                "templateUrl": "partials/leaderCheck/pass.html"
                            }
                        }
                    },
                    {
                        "name": "审核未通过",
                        "imgSrc": "images/menuLogo/审核未通过.png",
                        "state": "leaderCheck.reject",
                        "url": "/reject",
                        "authox":"FJLDSH|FJLDSH_WTG",
                        "views": {
                            'hint4@': {
                                "templateUrl": "partials/leaderCheck/reject.html"
                            }
                        }
                    },
                    {
                        "name": "合同删除审核",
                        "imgSrc": "images/menuLogo/合同删除审核.png",
                        "state": "leaderCheck.delete",
                        "url": "/delete",
                        "authox":"FJLDSH|FJLDSH_HTSCSH",
                        "views": {
                            'hint4@': {
                                "templateUrl": "partials/leaderCheck/delete.html"
                            }
                        }
                    }
                ]
            },{
                "name": "缴费情况",
                "state": "payment",
                "url": "/payment",
                "templateUrl": "partials/payment.html",
                "authox":"JFXX|access",
                "children": [
                    {
                        "name": "未缴费项目",
                        "imgSrc": "images/menuLogo/未缴费项目.png",
                        "state": "payment.notPay",
                        "url": "/notPay",
                        "authox":"JFXX|JFXX_WJFXM",
                        "views": {
                            'hint5@': {
                                "templateUrl": "partials/payment/notPay.html"
                            }
                        }
                    },
                    {
                        "name": "已缴费项目",
                        "imgSrc": "images/menuLogo/已缴费项目.png",
                        "state": "payment.paid",
                        "url": "/paid",
                        "authox":"JFXX|JFXX_YJFXM",
                        "views": {
                            'hint5@': {
                                "templateUrl": "partials/payment/paid.html"
                            }
                        }
                    }
                ]
            },{
                "name": "统计报表",
                "state": "countTable",
                "url": "/countTable",
                "templateUrl": "partials/countTable.html",
                "authox":"TJBB|access",
                "children": [
                    {
                        "name": "月报表",
                        "imgSrc": "images/menuLogo/月报表.png",
                        "state": "countTable.monthTable",
                        "url": "/monthTable",
                        "authox":"TJBB|TJBB_YBB",
                        "views": {
                            'hint9@': {
                                "templateUrl": "partials/countTable/monthTable.html"
                            }
                        }
                    },{
                        "name": "台账",
                        "imgSrc": "images/menuLogo/台账.png",
                        "state": "countTable.historyLog",
                        "url": "/historyLog",
                        "authox":"TJBB|TJBB_TZ",
                        "views": {
                            'hint9@': {
                                "templateUrl": "partials/countTable/historyLog.html"
                            }
                        }
                    },{
                        "name": "市局统计汇总表",
                        "imgSrc": "images/menuLogo/汇总表.png",
                        "state": "countTable.analyze",
                        "url": "/analyze",
                        "authox":"TJBB|TJBB_SJTJHZB",
                        "views": {
                            'hint9@': {
                                "templateUrl": "partials/countTable/analyze.html"
                            }
                        }
                    }
                ]
            },{
                "name": "基础数据管理",
                "state": "basicDataManagement",
                "url": "/basicDataManagement",
                "templateUrl": "partials/basicDataManagement.html",
                "authox":"JCSJ|access",
                "children": [
                    {
                        "name": "年收益标准",
                        "imgSrc": "images/menuLogo/年收益标准.png",
                        "state": "basicDataManagement.annualYieldStandard",
                        "url": "/annualYieldStandard",
                        "authox":"JCSJ|JCSJ_NSYBZ",
                        "views": {
                            'hint6@': {
                                "templateUrl": "partials/basicDataManagement/annualYieldStandard.html"
                            }
                        }
                    },
                    {
                        "name": "提醒时间",
                        "imgSrc": "images/menuLogo/提醒时间.png",
                        "state": "basicDataManagement.remindTime",
                        "url": "/remindTime",
                        "authox":"JCSJ|JCSJ_TXSJ",
                        "views": {
                            'hint6@': {
                                "templateUrl": "partials/basicDataManagement/remindTime.html"
                            }
                        }
                    }
                ]
            }, {
                "name": "已删除记录",
                "state": "deletionLog",
                "url": "/deletionLog",
                "templateUrl": "partials/deletionLog.html",
                "authox":"SCJLCX|access",
                "children": [
                    {
                        "name": "土地删除记录",
                        "imgSrc": "images/menuLogo/土地删除记录.png",
                        "state": "deletionLog.land",
                        "url": "/land",
                        "authox":"SCJLCX|SCJLCX_TDCX",
                        "views": {
                            'hint7@': {
                                "templateUrl": "partials/deletionLog/land.html"
                            }
                        },
                        "noRouteChildren": [
                            {
                                "state": "deletionLog.land.add",
                                "url": "/noUseAdd?number?update",
                                "views": {
                                    'hint7@': {
                                        "templateUrl": "partials/landInfo/noUse/add.html"
                                    }
                                }
                            }
                        ]
                    },
                    {
                        "name": "合同删除记录",
                        "imgSrc": "images/menuLogo/合同删除记录.png",
                        "state": "deletionLog.contract",
                        "url": "/contract",
                        "authox":"SCJLCX|SCJLCX_XMCX",
                        "views": {
                            'hint7@': {
                                "templateUrl": "partials/deletionLog/contract.html"
                            }
                        }
                    }
                ]
            }, {
                "name": "系统管理",
                "state": "systemManagement",
                "url": "/systemManagement",
                "templateUrl": "partials/systemManagement.html",
                "authox":"XTGL|access",
                "children": [
                    {
                        "name": "修改密码",
                        "imgSrc": "images/menuLogo/修改密码.png",
                        "state": "systemManagement.passwordModification",
                        "url": "/passwordModification",
                        "authox":"XTGL|XTGL_MMXG",
                        "views": {
                            'hint8@': {
                                "templateUrl": "partials/systemManagement/passwordModification.html"
                            }
                        }
                    }
                ]
            }, {
                "name": "权限管理",
                "state": "system",
                "url" : "/system",
                "templateUrl" : "partials/system.html",
                "authox":"authox|manage",
                "children": [
                    {
                        "name": "用户管理",
                        "state": "system.user",
                        "url" : "/user",
                        "imgSrc": "images/menuLogo/汇总表.png",
                        "authox":"authox|manage",
                        "views": {
                            'hint10@': {
                                "templateUrl": "partials/authority/system/user.html"
                            }
                        },
                        "noRouteChildren": [
                            {
                                "state": "system.user.select",
                                "url" : "/:key",
                                "views": {
                                    'hint10@': {
                                        "templateUrl": "partials/authority/system/user/userSelect.html"
                                    }
                                }
                            }
                        ]
                    },
                    {
                        "name": "群组管理",
                        "state": "system.group",
                        "url" : "/group",
                        "imgSrc": "images/menuLogo/汇总表.png",
                        "authox":"authox|manage",
                        "views": {
                            'hint10@': {
                                "templateUrl": "partials/authority/system/group.html"
                            }
                        },
                        "noRouteChildren": [
                            {
                                "state": "system.group.select",
                                "url" : "/:key",
                                "views": {
                                    'hint10@': {
                                        "templateUrl": "partials/authority/system/group/groupSelect.html"
                                    }
                                }
                            }
                        ]
                    },
                    // {
                    //     "name": "角色管理",
                    //     "state": "system.role",
                    //     "url" : "/role",
                    //     "imgSrc": "images/menuLogo/汇总表.png",
                    //     "authox":"authox|manage",
                    //     "views": {
                    //         'hint10@': {
                    //             "templateUrl": "partials/authority/system/role.html"
                    //         }
                    //     },
                    //     "noRouteChildren": [
                    //         {
                    //             "state": "system.role.select",
                    //             "url" : "/:key",
                    //             "views": {
                    //                 'hint10@': {
                    //                     "templateUrl": "partials/authority/system/role/roleSelect.html"
                    //                 }
                    //             }
                    //         }
                    //     ]
                    // },
                    {
                        "name": "角色管理",
                        "state": "system.role2",
                        "url" : "/role2",
                        "imgSrc": "images/menuLogo/汇总表.png",
                        "authox":"authox|manage",
                        "views": {
                            'hint10@': {
                                "templateUrl": "partials/authority/system/role2.html"
                            }
                        },
                        "noRouteChildren": [
                            {
                                "state": "system.role2.select",
                                "url" : "/:key",
                                "views": {
                                    'hint10@': {
                                        "templateUrl": "partials/authority/system/role/role2Select.html"
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        ]);
        return app;
    }
);
