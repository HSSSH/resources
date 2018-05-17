/**
 * @ version 1.0.0
 *  插件封装
 *  zhcsEcharts
 *  zhcsTree
 *  zhcsSlim
 *  zhcsPerfectScrollbar
 *  zhcsDatePicker
 *  
 *  html元素功能增强
 *  zhcsClickWaiting 点击button更改button状态,用于保存、提交、查询等按钮
 *  zhcsAutoFocus 表单导航 enter键焦点后移 → 键焦点后移和 ← 焦点前移
 *  zhcsAutoSearch 搜索栏自动触发查询 select值更改触发查询 input输入完毕enter触发查询
 *  zhcsEnablemove 使div元素可拖拽移动
 *  zhcsSideBar 使div容器可调整宽度
 *  
 *  组件增强
 *  zhcsMySwitch
 *  zhcsRadio
 * 
 * */
define(['angular', 'wDatePicker', 'slimscroll', 'ztree', 'jquery'], function (angular) {
    var module = angular.module('angular-zhcs-directive', []);
    module.directive('zhcsEcharts', function () {
        return {
            restrict: 'A',
            scope: {
                options: '='
            },
            link: function (scope, element, attrs) {
                var chart;

                function isOwnEmpty(obj) {
                    for (var name in obj) {
                        if (obj.hasOwnProperty(name)) {
                            return false;
                        }
                    }
                    return true;
                }

                scope.$watch('options', function (n, o) {
                    if (scope.options && typeof(o) == "undefined") {
                        init();
                    }
                    if (scope.options && typeof(o) != "undefined") { 
                        chart.setOption(scope.options);
                    }
                }, true);

                function dispose() {
                    if (chart) {
                        chart.dispose();
                        $(window).unbind('resize.' + attrs.zhcsEcharts);
                    }
                }

                function init() {
                    dispose();
                    // 安全监测，未显示却加载则不init
                    if (element.height()) {
                        chart = echarts.init(element[0]);
                        chart.showLoading({
                            text: '正在努力读取数据中……'
                        });
                        if (isOwnEmpty(scope.options)) {
                            chart.showLoading({
                                text: '正在努力读取数据中……'
                            });
                            return;
                        }                    
                        // 为echarts对象加载数据
                        chart.setOption(scope.options);
                        chart.hideLoading();
                        $(window).bind('resize.' + attrs.zhcsEcharts, function () {
                            console.log(attrs.zhcsEcharts);
                            chart.resize();
                        });
                    }
                }

                init();
                scope.$on('$destroy', function () {
                    dispose();
                });
            }
        }
    });
    
    /**
     * @author zjf
     * @des 点击按钮更改按钮状态
     * */
    module.directive("zhcsClickWaiting", [function() {
    	return {
    		restrict: 'A',
    		scope: {
    			waiting: '='
    		},
    		link: function(scope, ele, attr) {
    			var originalHtml = ele.html();
    			var watcher = scope.$watch('waiting', function(n, o) {
                	if (n) {
                		ele.html('<i class="fa fa-spin fa-spinner"></i>');
                	} else if (o != undefined) {
                		ele.html(originalHtml);
                	}
                });
    			
    			scope.$on('$destroy', function() {
    				watcher();
    			});
    		}
    	}
    }]);

    /**
     * @author zjf
     * @des 搜索栏输入框回车搜索、下拉框选中自动搜索
     * */
    module.directive("zhcsAutoSearch", [function() {
    	return {
    		restrict: 'A',
            scope: true,
    		controller: ['$scope', '$attrs', '$parse', function($scope, $attrs, $parse) {
            	$scope.$inputs = [];
            	$scope.$selects = [];
            	$scope.$search = function() {
            		$parse($attrs.search)($scope.$parent);//angular.bind($scope, $parse($attrs.search));
            	}
            }],
    		link: function(scope, ele, attr) {
    			scope.$inputs = ele.find("input:enabled");
    			scope.$selects = ele.find("select");
    			
    			auto(scope.$inputs, scope.$selects);
    		    scope.$on('autoSearchInputs', function() {
    		    	auto(scope.$inputs, scope.$selects);
                });
    			
    			function auto(inputs, selects) {
    				selects.each(function(index, select) {
    					function enterSearch(e) {
    						scope.$apply(scope.$search);                 
    	         	    }					
    					$(select).unbind('change', enterSearch);
    		      		$(select).change(enterSearch);
    				});
    				
    				inputs.each(function(index, input) {
    		      		function autoSearch(e) {
    	         		    e = window.event || e;
    	                    var k = e.keyCode || e.which;
    	                    if (k == 13) {
    	                    	scope.$apply(scope.$search);
    	                    	input.blur();
    	                    }                    
    	         	   }
    	      		  $(input).unbind('keypress', autoSearch);
    	      		  $(input).keypress(autoSearch);
    		    	})
    			}			
    		}
    	}
    }]);
    module.directive("zhcsAutoSearchIndex", [function() { 
        return {
            restrict: 'A',
            link: function(scope, ele, attrs) {
            	if (attrs.eleType == 'input') {
            		scope.$inputs && scope.$inputs.splice(attrs.autoSearchIndex, 0, ele[0]);
            	} else if (attrs.eleType == 'select') {
            		scope.$selects && scope.$selects.splice(attrs.autoSearchIndex, 0, ele[0]);
            	}       	
            	scope.$emit('autoSearchInputs');
            }
        }    
    }]);

    /**
     * @author zjf
     * @des 表单焦点导航
     * */
    module.directive("zhcsAutoFocus", [function() { 
        return {
            restrict: 'A',
            controller: ['$scope', function($scope) {
            	$scope.$inputs = [];
            }],
            link: function(scope, ele, attrs) {
            	if (!ele.context) {
            		ele = $(ele);
            	}
               scope.$inputs = ele.find("input[type='text']:enabled,input[type='number']:enabled,textarea:enabled");
               focus(scope.$inputs);
               scope.$inputs[0] && scope.$inputs[0].focus();    
                    
               scope.$on('autoFocusInputs', function() {
            	   focus(scope.$inputs);
                   scope.$inputs[0] && scope.$inputs[0].focus();    
               });
               
               function focus(inputs) {
              	 inputs.each(function(index, input) {
              		function autoFocus(e) {
    	         		   e = window.event || e;
    	                    var k = e.keyCode || e.which;
    	                    if (k == 13 || k == 40) {
    	                 	   inputs[index+1] && inputs[index+1].focus &&  inputs[index+1].focus();
    	                    }
    	                    if (k == 38) {
    	                 	   inputs[index-1] && inputs[index-1].focus &&  inputs[index-1].focus();
    	                    }
    	         	   }
              		 $(input).unbind('keyup', autoFocus);
              		 $(input).keyup(autoFocus);
            	   })
              }
              
            }
        
        }    
    }]);
    module.directive("zhcsAutoFocusIndex", [function() { 
        return {
            restrict: 'A',
            link: function(scope, ele, attrs) {
            	scope.$inputs && scope.$inputs.splice(attrs.autoFocusIndex, 0, ele[0]);
            	scope.$emit('autoFocusInputs');
            }
        }    
    }]);
    /**
     * @author zjf
     * @des 拖拽移动定位元素
     * */
    module.directive("zhcsEnablemove", [function() { 
        return {
            restrict: 'A',
            link: function(scope, ele, attrs) {
                var move = {
                    oldX: "",
                    oldY: "",
                    left: "",
                    top: "",
                    enablemove: false,
                    ele: ele.context || ele[0]
                };

                function mousemoveHandler(evt) {
                    evt.preventDefault(); //消除移动时鼠标选中文本
                    var dx = parseInt(evt.clientX - move.oldX);
                    var dy = parseInt(evt.clientY - move.oldY);
                    that.style.left = (move.left + dx) + 'px';
                    that.style.top = (move.top + dy) + 'px';
                };

                function mouseupHandler(evt) {
                    document.body.removeEventListener('mousemove', mousemoveHandler);
                    document.body.removeEventListener('mouseup', mouseupHandler);
                };
                var that = move.ele;
                that.onmousedown = function(evt) {
                    move.oldX = evt.clientX;
                    move.oldY = evt.clientY;
                    move.enablemove = true;
                    if (that.currentStyle) {
                        move.left = angular.element(that).position().left;
                        move.top = angular.element(that).position().top;
                    } else {
                        var divStyle = document.defaultView.getComputedStyle(that, null);
                        move.left = parseInt(divStyle.left);
                        move.top = parseInt(divStyle.top);
                    }  
                    var target = evt.srcElement || evt.target;
                    if (target.dataset.move) {
                        document.body.addEventListener('mousemove', mousemoveHandler);
                        document.body.addEventListener('mouseup', mouseupHandler);
                    }

                };
            }
        }
    }]);

    /**
     * @author zjf
     * @des 使div容器可拖拽调整宽度
     * */
    module.directive("zhcsSideBar", function () {
        return {
            restrict: "EA",
            replace: true,
            scope: {
                options: '=',
            },
            template: "<div style='cursor:e-resize'></div>",
            link: function (scope, element) {
                var move = {
                    oldX: 0,
                    newX: 0,
                };
                var target = {left: {width: 0}, right: {width: 0}, total: 0};
                var adjustW = scope.options.adjustW ? scope.options.adjustW : 0;
                var limit = [0, 9999];

                function mousedownHandler(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    move.oldX = e.clientX;
                    target.left.width = $('#' + scope.options.targetId_left).width();
                    target.right.width = $('#' + scope.options.targetId_right).width();
                    $(document).bind("mousemove", mousemoveHandler);
                    $(document).bind("mouseup", mouseupHandler);
                    if (scope.options.start && typeof(scope.options.start) == 'function') {
                        scope.options.start();
                    }
                }

                function mousemoveHandler(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    move.newX = e.clientX;
                    var dx = move.newX - move.oldX;
                    if (target.left.width + dx >= limit[0] && target.left.width + dx <= limit[1]) {
                        $('#' + scope.options.targetId_left).width(target.left.width + dx);
                        $('#' + scope.options.targetId_right).width(target.right.width - dx);
                    }
                    if (scope.options.move && typeof(scope.options.move) == 'function') {
                        scope.options.move();
                    }
                }

                function mouseupHandler(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $(document).unbind("mousemove", mousemoveHandler);
                    $(document).unbind("mouseup", mouseupHandler);
                    target.left.width = $('#' + scope.options.targetId_left).width();
                    target.right.width = $('#' + scope.options.targetId_right).width();
                    if (scope.options.stop && typeof(scope.options.stop) == 'function') {
                        scope.options.stop();
                    }
                }

                function resizeHandler(e) {
                    totalW = $("#" + scope.options.containerId).width() - adjustW;
                    $("#" + scope.options.targetId_right).width(totalW - target.left.width);
                    if (scope.options.stop && typeof(scope.options.stop) == 'function') {
                        scope.options.stop();
                    }
                }

                var init = function () {
                    target.left.width = $('#' + scope.options.targetId_left).width();
                    target.right.width = $('#' + scope.options.targetId_right).width();
                    totalW = $("#" + scope.options.containerId) - adjustW;
                    if (scope.options.limit) {
                        limit[0] = scope.options.limit[0] ? scope.options.limit[0] : limit[0];
                        limit[1] = scope.options.limit[1] ? scope.options.limit[1] : limit[1];
                    }
                    element.bind('mousedown', mousedownHandler);
                    $(window).bind('resize', resizeHandler);
                }

                scope.$on("$destroy", function () {
                    $(window).unbind('resize', resizeHandler);
                })

                init();


            }
        }
    });


    //滚动条 支持Chrome FireFox Opera IE6+
    module.directive('cgsSlim', [function () {
        return {
            restrict: 'AC',
            scope: {
                options: '='
            },
            link: function (scope, element, attrs) {
                var options;
                if (scope.options) {
                    options = scope.options;
                } else options = {
                    height: '490px',
                    size: '7px'
                };
                $(element).slimscroll(options);
            }
        }
    }]);
    
    /**
     * My97 datePicker
     * @author linyh
     * ------------------------------------------------------------------
     */
    module.directive('zhcsDatePicker',['$filter', function ($filter) {
        return {
            require: '?ngModel',
            restrict: 'A',
            link: function (scope, element, attrs, ngModel) {
                if (!element.context) {
                    element = $(element[0]);
                }
                if (typeof WdatePicker == 'function') {
                    var options = {};
                    options.dateFmt = attrs.dateFmt ? attrs.dateFmt : 'yyyy-MM-dd HH:mm:ss';
                    options.autoUpdateOnChanged = false;
                    scope.$watch(attrs.minDate, function (n, o) {//设定可选的最小日期  by wangtj
                        options.minDate = $filter('date')(n, options.dateFmt);
                    });
                    scope.$watch(attrs.maxDate, function (n, o) {//设定可选的最大日期  by wangtj
                        options.maxDate = $filter('date')(n, options.dateFmt);
                    });
                    options.onpicked = function (dp) {
                        var object = dp.cal.newdate;
                        var date = new Date(object.y, object.M - 1, object.d, object.H, object.m, object.s);
                        if (!!ngModel)
                            ngModel.$setViewValue(date);
                    };
                    options.onpicking = function (dp) {
                        var object = dp.cal.newdate;
                        var date = new Date(object.y, object.M - 1, object.d, object.H, object.m, object.s);
                        if (!!ngModel)
                            ngModel.$setViewValue(date);
                    };
                    options.oncleared = function (dp) {
                        if (!!ngModel)
                            ngModel.$setViewValue(null);
                    };
                    scope.$watch(attrs.ngModel, function (n, o) {
                        element.val($filter('date')(n, options.dateFmt));
                    });
                    var wdateFun = function () {
                        WdatePicker(options);
                        /*options.onpicked(e);*/
                    };
                    element.focus && element.focus(wdateFun);
                    element.click && element.click(wdateFun);
                    if (attrs.readonly) {
                        element.keydown(function (e) {
                            e.preventDefault();
                        });
                    }
                }
            }
        }
    }])
    /**
     * ztree
     * @author hecb
     * ------------------------------------------------------------------
     */
    .directive('zhcsTree', function ($http) {
        return {
            require: '^ngModel',
            restrict: 'A',
            scope: {
                zNodes: '=',
                zSettings: '='
            },
            link: function (scope, element, attrs, ngModel) {
                function initTree() {
                    if (!!scope.zNodes && !!scope.zSettings) {
                        var zObj = $.fn.zTree.init(element, scope.zSettings, scope.zNodes);
                        var zTreeObj = $.fn.zTree.getZTreeObj(attrs['id']);
                        if (scope.zSettings.expandAll) zTreeObj.expandAll(true);
                        if (!!ngModel) {
                            ngModel.$setViewValue(zObj);
                        }
                    }
                }

                scope.$watch('zNodes', function (o, n) {
                    initTree();
                });
                scope.$watch('zSettings', function (o, n) {
                    initTree();
                })
                scope.$on('$destroy', function () {
                    var zTreeObj = $.fn.zTree.getZTreeObj(attrs['id']);
                    if (!!zTreeObj) {
                        zTreeObj.destroy();
                    }
                });
            }
        };
    })

    /*
    *通过var-src中的路径将原标签中的src属性替换，用变量控制
    * */
    .directive('varSrc', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(attrs.varSrc, function (n, o) {
                    element[0].setAttribute("src", n);
                })
            }
        }
    })
    .directive('zhcsTreet', function ($timeout) {
        return {
            restrict: 'A',
            scope: {
                treeContent: '='
            },
            link: function (scope, element, attrs) {
                function nodeOnChange() {
                    $("#" + attrs['id'] + " div:visible:odd").css('background-color', '#E5F2FB');
                    $("#" + attrs['id'] + " div:visible:even").css('background-color', 'white');
                };
                var timer;
                scope.$watch('treeContent', function (o, n) {
                    timer = $timeout(nodeOnChange, 100, true);
                    timer.then(function () {
                        console.log("Timer resolved!")
                    }, function () {
                        console.log("Timer rejected!")
                    });
                })
                scope.$on('$destroy', function () {
                    $timeout.cancel(timer);
                });
            }
        };
    })
    /************自定义开关*************/
    .directive('zhcsMySwitch', function () {
        return {
            restrict: 'E',
            scope: {
                controlItem: '=',
                statusKey: '@',
                endCallBack: '&'
            },
            template: '<div class="slide-switch" ng-class="{\'switchOpen\':controlItem[statusKey]}" ng-click="switch(controlItem)"><div></div></div>',
            link: function ($scope, $element, $attrs, $ctrls) {
                $scope.switch = function (item) {
                    if (typeof item[$scope.statusKey] == "boolean") {
                        item[$scope.statusKey] = !item[$scope.statusKey];
                    }
                    if (typeof item[$scope.statusKey] == "number") {
                        item[$scope.statusKey] = 1 - item[$scope.statusKey];
                    }
                    if (item[$scope.statusKey] == null) {
                        item[$scope.statusKey] = true;
                    }
                    $scope.endCallBack();
                }
            }
        }
    })
    /**********模拟单选框组************/
    .directive('zhcsRadio', function ($interval, dateFilter) {
        return {
            restrict: 'EA',
            require: '?ngModel',
            scope: {
                items: '=',
                curItem: '=ngModel'
            },
            template: ' <ul class="my-radio-list">\
            <li ng-repeat="item in items" ng-click="select(item,$index)" ng-class="{\'selected\':item.des==curItem}">\
            <div></div><span>{{item.name}}</span></li></ul>',
            link: function (scope, element, attrs, ctrls) {
                var $ul = $(element).children('ul');
                scope.select = function (item, index) {
                    ctrls.$setViewValue(item.des);
                    $ul.children('li.selected').removeClass('selected');
                    $ul.children('li').eq(index).addClass('selected');
                };
            }
        }
    })
    //功能更强大的滚动条，支持横向纵向以及共同使用
    .directive('zhcsPerfectScrollbar', ['$parse', '$window', function ($parse, $window) {
        var psOptions = [
            'handlers',
            'wheelSpeed',
            'wheelPropagation',
            'swipePropagation',
            'minScrollbarLength',
            'maxScrollbarLength',
            'useBothWheelAxes',
            'useKeyboard',
            'suppressScrollX',
            'suppressScrollY',
            'scrollXMarginOffset',
            'scrollYMarginOffset',
            'theme'
        ];

        return {
            restrict: 'EA',
            transclude: true,
            template: '<div style="position: relative"><div ng-transclude></div></div>',
            replace: true,
            //
            link: function ($scope, $elem, $attr) {
                var jqWindow = angular.element($window);
                var options = {};

                for (var i = 0, l = psOptions.length; i < l; i++) {
                    var opt = psOptions[i];

                    if ($attr[opt] !== undefined) {
                        options[opt] = $parse($attr[opt])();
                    }
                }

                $scope.$evalAsync(function () {
                    $elem.perfectScrollbar(options);
                    var onScrollHandler = $parse($attr.onScroll);

                    $elem.scroll(function () {
                        var scrollTop = $elem.scrollTop();
                        var scrollHeight = $elem.prop('scrollHeight') - $elem.height();
                        var scrollLeft = $elem.scrollLeft();
                        var scrollWidth = $elem.prop('scrollWidth') - $elem.width();

                        $scope.$apply(function () {
                            onScrollHandler($scope, {
                                scrollTop: scrollTop,
                                scrollHeight: scrollHeight,
                                scrollLeft: scrollLeft,
                                scrollWidth: scrollWidth
                            });
                        });
                    });
                });

                // Automatically update when content height changes
                $scope.$watch(function () {
                    return $elem.prop('scrollHeight');
                }, function (newValue, oldValue) {
                    if (newValue) {
                        update('contentSizeChange');
                    }
                });

                function update(event) {
                    $scope.$evalAsync(function () {
                        if ($attr.scrollDown == 'true' && event != 'mouseenter') {
                            setTimeout(function () {
                                $($elem).scrollTop($($elem).prop("scrollHeight"));
                            }, 100);
                        }

                        $elem.perfectScrollbar('update');
                    });
                }

                // This is necessary when you don't watch anything with the scrollbar
                $elem.on('mouseenter', function () {
                    update('mouseenter');
                });

                // Possible future improvement: check the type here and use the appropriate watch for non-arrays
                if ($attr.refreshOnChange) {
                    $scope.$watchCollection($attr.refreshOnChange, function () {
                        update();
                    });
                }

                // Rebuild on window resize
                if ($attr.refreshOnResize) {
                    jqWindow.on('resize', function () {
                        update();
                    });
                }

                if ($attr.updateOn) {
                    $attr.updateOn.split(' ').forEach(function (eventName) {
                        $scope.$on(eventName, update);
                    });
                }

                // Unbind resize event and destroy instance
                $elem.on('$destroy', function () {
                    jqWindow.off('resize', function () {
                        update();
                    });

                    $elem.perfectScrollbar('destroy');
                });
            }
        };
    }]);
});