(function(root, factory) {
    if (typeof require === 'function' && typeof exports === 'object') {
        // CommonJS
        exports.sucTabset = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD.
        define(function() {
            return root.sucTabset = factory();
        });
    } else {
        // Browser globals
        root.sucTabset = factory();
    }
}(this, function() {
    angular.module("tabs-dynamic", [])
        .controller("sucTabSetController", function($rootScope, $scope) {
            var ctrl = this;
            ctrl.tabs = [];

            ctrl.maxWidth = $(".sucTabUl").width();

            //重新计算tab页标题栏宽度
            ctrl.calcWidth = function() {
                var totalNum = ctrl.tabs.length;

                if (ctrl.maxWidth / totalNum <= 70) { //选项卡宽度小于70，非活动页关闭按钮隐藏
                    $(".sucTabUl>a:not(.active)>i").hide();
                    $(".sucTabUl>a.active>i").show();
                } else {
                    $(".sucTabUl>a>i").show();
                }
                $(".sucTabUl>a").css("width", ctrl.maxWidth / totalNum > 165 ? 165 : ctrl.maxWidth / totalNum);
            }

            $(window).resize(function() {
                ctrl.maxWidth = $(".sucTabUl").width();
                ctrl.calcWidth();
            });

            //新增选项卡
            ctrl.addTab = function(tab) {
                ctrl.tabs.push(tab);
                ctrl.select(tab);

                ctrl.calcWidth();
            }

            //选中选项卡
            ctrl.select = function(tab) {
                ctrl.tabs.forEach(function(item) {
                    item.active = false;
                });
                tab.active = true;
                ctrl.active = tab.heading; //存储当前选中项的标题

                switch (tab.heading) {
                    case '运行监控':
                        $rootScope.hasCallList = true;
                        break;
                    case '指挥调度':
                        $rootScope.hasCallList = true;
                        break;
                    case '警情管理':
                        $rootScope.hasCallList = $rootScope.alarmManagePage == 'emergencyCmd' ? true : false;
                        break;
                    default:
                        $rootScope.hasCallList = false;
                        break;
                }

                tab.onSelect();
                ctrl.calcWidth();

            }

            //关闭选项卡
            ctrl.closeTab = function(tab) {
                var len = ctrl.tabs.length;
                if (len == 1) {
                    return;
                }
                tab.ele.remove(); //移除标题
                ctrl.tabs.forEach(function(item, index) {
                    if (item.heading == tab.heading) {

                        //如果要关闭的是当前tab页，先传递出关闭后当选的tab页，再关闭此tab页
                        if (tab.active == true) {
                            var newActiveTabIndex = index === len - 1 ? index - 1 : index + 1;
                            ctrl.select(ctrl.tabs[newActiveTabIndex]);
                        }

                        ctrl.tabs.splice(index, 1); //移除对应内容
                        return;
                    }
                });

                tab.onClose();

                ctrl.calcWidth();
            }

            //动态更改选中项
            $scope.$watch('tabset.active', function(val) {
                if (angular.isDefined(val)) {
                    ctrl.tabs.forEach(function(item, index) {
                        if (item.heading == val) {
                            ctrl.select(item);

                        }
                    });
                }
            });
        })
        .directive("sucTabSet", function() {
            return {
                restrict: 'EA',
                transclude: true,
                replace: true,
                bindToController: {
                    active: '=?'
                },
                controller: 'sucTabSetController',
                controllerAs: 'tabset',
                template: '<div class="sucTabOuter">' +
                    '<div class="sucTabUl" ng-transclude></div>' +
                    '<div class="sucTabCon">' +
                    '<div ng-repeat="tab in tabset.tabs" ng-show="tab.active" class="suc-tab-pane" suc-tab-content-transclude="tab"></div>' +
                    '</div>' +
                    '</div>',
                link: function(scope, element, attr) {

                }
            }
        })
        .directive("sucTab", function() {
            return {
                require: "^sucTabSet",
                restrict: 'EA',
                transclude: true,
                replace: true,
                scope: {
                    heading: '@',
                    onSelect: '&select',
                    onClose: '&close'
                },
                template: '<a ng-class="{\'active\':active}" ng-click="select($event)">' +
                    '<abbr title="{{heading}}" ng-bind="heading"></abbr>' +
                    '<i ng-click="closeTab($event)"></i>' +
                    '</a>',
                controller: function() {
                    //Empty controller so other directives can require being 'under' a tab
                },
                controllerAs: 'tab',
                link: function(scope, element, attr, tabsetCtrl, transclude) {
                    //判读是否已存在
                    var flag = 0;
                    tabsetCtrl.tabs.forEach(function(item) {
                        if (item.heading == scope.heading) {
                            flag = 1;
                            return;
                        }
                    });
                    if (flag == 1) {
                        console.error("标题栏不能重复！");
                        return;
                    }

                    scope.ele = element;
                    scope.select = function(evt) {
                        tabsetCtrl.select(scope);
                    }

                    scope.closeTab = function(evt) {
                            tabsetCtrl.closeTab(scope);
                        }
                        //                    scope.$on('$destroy', function () {
                        //                        tabsetCtrl.closeTab(scope);
                        //                    });

                    tabsetCtrl.addTab(scope);

                    scope.$transcludeFn = transclude;
                }
            }
        })
        .directive("sucTabContentTransclude", function() {
            return {
                restrict: 'A',
                require: '^sucTabSet',
                link: function(scope, elm, attrs) {
                    var tab = scope.$eval(attrs.sucTabContentTransclude);

                    tab.$transcludeFn(tab.$parent, function(contents) {
                        angular.forEach(contents, function(node) {
                            elm.append(node);
                        });
                    });
                }
            }
        })
}));
