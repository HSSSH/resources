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
        .controller("sucTabSetController", ['$rootScope', '$scope', '$timeout', function($rootScope, $scope, $timeout) {
            var preActiveIndex; // 前一个标签页索引
            var preActiveLength;
            var ctrl = this;
            ctrl.tabs = [];

            ctrl.maxWidth = $(".sucTabUl").width();

            //重新计算tab页标题栏宽度
            ctrl.calcWidth = function() {
                var totalNum = ctrl.tabs.length;
                var totalLength = 0;
                $('.sucTabUl>a').each(function(i, ele) {
                    totalLength += $(ele).outerWidth() < 140 ? 140: $(ele).outerWidth();
                });
                if (totalLength > ctrl.maxWidth) {
                    var activeEle = $(".sucTabUl>a[index='" + ctrl.active + "']");
                    var notActiveEles = $(".sucTabUl>a:not([index='" + ctrl.active + "'])");
                    console.log(activeEle.outerWidth());
                    console.log(activeEle.attr('maxWidth'));
                    if (!activeEle.attr('maxWidth')) {
                        activeEle.attr('maxWidth', activeEle.outerWidth() || '');
                    } else if (activeEle.outerWidth() && activeEle.attr('maxWidth') < activeEle.outerWidth()) {
                        activeEle.attr('maxWidth', activeEle.outerWidth());
                    }
                    var otherLength = Math.floor((ctrl.maxWidth - activeEle.attr('maxWidth')) / (totalNum - 1) - 5);
                    notActiveEles.css("width", otherLength);    
                    notActiveEles.removeClass("suc-tab-min-width");
                    notActiveEles.find('i').hide();
                    activeEle.css("width", activeEle.attr('maxWidth'));    
                    activeEle.find('i').show();
                } else {
                    $(".sucTabUl>a").addClass("suc-tab-min-width");
                    $(".sucTabUl>a>i").show();
                }        
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
                ctrl.active = tab.index; //存储当前选中项的索引               

                tab.onSelect&&tab.onSelect();
                ctrl.calcWidth();

            }

            //关闭选项卡
            ctrl.closeTab = function(tab, args) {
                var len = ctrl.tabs.length;
                if (len == 1) {
                    return;
                }
                tab.ele.remove(); //移除标题
                ctrl.tabs.forEach(function(item, index) {
                    if (item.index == tab.index) {

                        //如果要关闭的是当前tab页，先传递出关闭后当选的tab页，再关闭此tab页
                        if (tab.active == true) {
                            var newActiveTabIndex;
                            if (preActiveIndex) {
                                newActiveTabIndex = getIndexByKeyInArr(ctrl.originalTabs, 'index', preActiveIndex);
                            } 
                            if (!newActiveTabIndex && newActiveTabIndex != 0) {
                                newActiveTabIndex = index === len - 1 ? index - 1 : index + 1;
                            }                       
                            ctrl.select(ctrl.tabs[newActiveTabIndex]);                           
                        }

                        ctrl.tabs.splice(index, 1); //移除对应内容
                        var indexOriginal = getIndexByKeyInArr(ctrl.originalTabs, 'index', tab.index);
                        if (indexOriginal) {
                             var tabDeleted = ctrl.originalTabs.splice(indexOriginal, 1)[0];        
                             tabDeleted.closeCallback && tabDeleted.closeCallback(args);
                        }                      
                        return;
                    }
                });

                tab.onClose();               

                ctrl.calcWidth();
            }
            //外部调用的新建标签页方法
            ctrl.addTabOuter = function(tab) {
                if (tab.content) {
                    var flag = 0;
                    ctrl.originalTabs.forEach(function(item) {
                        //已存在
                        if (item.index == tab.index) {
                            flag = 1;
                            ctrl.select(item);
                            return;
                        }
                    });
                    if (flag == 0) {
                        ctrl.originalTabs.push(tab);
                    }
                }
            }

            //外部调用的更新tab方法
            ctrl.updateTabOuter = function(tab) {               
                var index = getIndexByKeyInArr(ctrl.tabs, 'index', tab.index);
                index && ctrl.tabs.splice(index, 1);
                index = getIndexByKeyInArr(ctrl.originalTabs, 'index', tab.index);
                index && (ctrl.originalTabs[index] = tab);
            }
            //外部调用的关闭tab方法
            ctrl.closeTabOuter = function(tab, args) {
                for (var i = 0, len = ctrl.tabs.length; i < len; i++) {
                    if (ctrl.tabs[i].index == tab.index && !ctrl.tabs[i].static) {
                        ctrl.closeTab(ctrl.tabs[i], args);
                        break;
                    }
                }           
            };

            //动态更改选中项
            $scope.$watch('tabset.active', function(val, oval) {
                if (angular.isDefined(val)) {
                    ctrl.tabs.forEach(function(item, index) {
                        if (item.index == val) {
                            preActiveIndex = oval;
                            ctrl.select(item);
                        }
                    });
                }
            });
            
            function getIndexByKeyInArr(arr, key, value) {
                for (var i = 0; i < arr.length; i++)
                    if (arr[i][key] == value) {
                        return i;
                    }
                return null;
            }
        }])
        .directive("sucTabSet", function() {
            return {
                restrict: 'EA',
                transclude: true,
                replace: true,
                bindToController: {
                    active: '=?',
                    originalTabs: '=?'
                },
                controller: 'sucTabSetController',
                controllerAs: 'tabset',
                template: '<div class="sucTabOuter">' +
                    '<div class="sucTabUl" ng-transclude></div>' +
                    '<div class="sucTabCon">' +
                    '<div ng-repeat="tab in tabset.tabs" ng-show="tab.active" class="suc-tab-pane" template-url="{{tab.content}}"  suc-tab-content-transclude="tab"></div>' +
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
                    static: '=', 
                    icon: '@',
                    index: '@',
                    controller: '@',
                    resolve: '=',
                    onSelect: '&select', //对外暴露选中后回调方法
                    onClose: '&close' //对外暴露关闭后回调方法
                },
                template: '<a ng-class="{\'active\':active}" ng-click="select($event)">' +
                    '<img ng-src="{{icon}}">' +
                    '<abbr title="{{heading}}" ng-bind="heading"></abbr>' +
                    '<i ng-click="closeTab($event)" ng-if="!static"></i>' +
                    '</a>',
                controller: function() {
                    //Empty controller so other directives can require being 'under' a tab
                },
                controllerAs: 'tab',
                link: function(scope, element, attr, tabsetCtrl, transclude) {
                    //判读是否已存在
                    var flag = 0;
                    tabsetCtrl.tabs.forEach(function(item) {
                        if (item.index == scope.index) {
                            flag = 1;
                            return;
                        }
                    });
                    if (flag == 1) {
                        console.error("标签页不能重复！");
                        return;
                    }

                    scope.ele = element;
                    scope.select = function(evt) {
                        tabsetCtrl.select(scope);
                    }

                    scope.closeTab = function(evt) {
                            !scope.static && tabsetCtrl.closeTab(scope);
                        }                    

                    scope.$transcludeFn = transclude; //transclude 是一个包含sucTab指令需嵌入的子元素的链接函数
                    tabsetCtrl.addTab(scope);
                }
            }
        })
        .directive("sucTabContentTransclude", ['$controller', '$q', '$injector', function($controller, $q, $injector) {
            return {
                restrict: 'A',
                require: '^sucTabSet',             
                link: function(scope, elm, attrs) {
                    var tab = scope.$eval(attrs.sucTabContentTransclude);
                   
                    if (tab.controller) {
                        var promises = [];
                        tab.resolve = tab.resolve || [];
                        var ctrlLocals = {};
                        promises = getResolvePromises(tab.resolve);
                      
                        $q.all(promises).then(function(res) {
                            var index = 0;
                            angular.forEach(tab.resolve, function(value, key) {
                                ctrlLocals[key] = res[index++]; //把resolve植入ctrlLocals
                            });
                            ctrlLocals.$scope = tab.$parent;
                            $controller(tab.controller, ctrlLocals);                                             
                        });
                    }
                    
                   tab.$transcludeFn(tab.$parent, function(contents) {
                       elm.empty();
                       elm.append(contents);                                
                   });
                    
                    function getResolvePromises(resolves) {//获取resolves promise对象
                        var promisesArr = [];
                        angular.forEach(resolves, function(value) {
                          if (angular.isFunction(value) || angular.isArray(value)) {
                            promisesArr.push($q.when($injector.invoke(value)));//$q.when()把对象封装成promise对象
                          } else if (angular.isString(value)) {
                            promisesArr.push($q.when($injector.get(value)));
                          } else {
                            promisesArr.push($q.when(value));
                          }
                        });
                        return promisesArr;
                      }

                }
            }
        }])
}));
