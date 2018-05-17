/*
 * 通用的指令集合
 */
define(['app', 'wDatePicker', 'slimscroll', 'ztree'], function (module) {

	/**
	 * @author zjf
	 * @des 点击按钮更改按钮状态
	 * */
	module.directive("clickWaiting", [function() {
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
	module.directive("autoSearch", [function() {
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
	/**
	 * @author zjf
	 * @des 表单焦点导航
	 * */
	module.directive("autoFocus", [function() { 
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
	/**
	 * @author zjf
	 * @des 查询数据状态提示
	 * */
	module.directive("loadSign", ['$compile', function($compile) { 
		return {
	        restrict: 'A',
	        scope: {
	            loadState: '='
	        },
	        link: function (scope, ele, attrs) {
	        	var v = checkIEVersion();
	        	if (v && v <= 9) {
	        		var html = '<img src="images/globalUse/loading.gif">';        		
	        	} else {
	        		var html = '<div ng-include="\'script/directive/loading.html\'" style="width: 50px;"></div>'; 
	        	}       	
	            var parentEle = document.createElement('div');
	            parentEle.style.zIndex = 2;
	            if (attrs.setPosition == 'fixed') {
	                parentEle.style.position = 'fixed';
	                parentEle.style.top = '50%';
	                parentEle.style.left = '50%';
	            } else {
	                parentEle.style.position = attrs.setPosition || 'absolute';
	                parentEle.style.top = 'calc(50% - 50px)';
	                parentEle.style.left = 'calc(50% - 50px)';
	            }
	            parentEle.innerHTML = html;
	            $compile(parentEle)(scope);
	            (ele.context || ele[0]).style.position = 'relative';
	            (ele.context || ele[0]).appendChild(parentEle);
	            var watcher = scope.$watch('loadState', function(state) {
	            	if (!state) {
	            		parentEle.style.display = 'none';
	            	} else {
	            		parentEle.style.display = 'block';
	            	}
	            });
	            
	            scope.$on('$destroy', function() {
					watcher();
				});

	            function checkIEVersion() {
					if(!!window.ActiveXObject || "ActiveXObject" in window){
						var ua = navigator.userAgent.toLowerCase();
				        var s;
				        var str;
				        (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? str = s[1] :((s = ua.match(/msie ([\d.]+)/)) ? str = s[1]:"12");
						str = parseFloat(str).toFixed(0);
				        return str;			
					}
					return false;
				}
	        }
	    }
	}]);
    /**
     * echarts
     * ------------------------------------------------------------------
     */
    module.directive('cgsEcharts', function(){
        return {
            restrict: 'A',
            scope: {
                options: '='
            },
            link: function(scope, element, attrs) {
                var chart;
                function isOwnEmpty(obj) {
                    for(var name in obj) {
                        if(obj.hasOwnProperty(name)) {
                            return false;
                        }
                    }
                    return true;
                }
                scope.$watch('options', function(n, o) {
                    if(scope.options&&typeof(o)=="undefined") {
                        init();
                    }
                    if(scope.options&&typeof(o)!="undefined"){ //检测options属性(数据)是否变化 by hzh
                        chart.setOption(scope.options);
                    }
                },true);
                function dispose(){
                    if(chart) {
                        chart.dispose();
                        $(window).unbind('resize.'+attrs.cgsEcharts);
                    }
                }
                function init() {
                    dispose();
                    // 安全监测，未显示却加载则不init
                    if(element.height()) {
                        chart = echarts.init(element[0]);
                        chart.showLoading({
                            text:'正在努力读取数据中……'
                        });
                        if(isOwnEmpty(scope.options)){
                            chart.showLoading({
                                text:'正在努力读取数据中……'
                            });
                            return;
                        }
                        // 为echarts对象加载数据
                        chart.setOption(scope.options);
                        chart.hideLoading();
                        $(window).bind('resize.'+attrs.cgsEcharts,function() {
                            console.log(attrs.cgsEcharts);
                            chart.resize();
                        });
                    }
                }
                init();
                scope.$on('$destroy', function() {
                    dispose();
                });
            }
        }
    });
    module.directive('repeatFinish', function () {
        return {
            link: function (scope, element, attr) {
                console.log(scope.$index)
                if (scope.$last == true) {
                    console.log('ng-repeat执行完毕')
                    scope.$eval(attr.repeatFinish)
                }
            }
        }
    })

    //滚动条 支持Chrome FireFox Opera IE6+
    module.directive('cgsSlim', [
	function () {
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
    //滚动条 edited by zjf
    module.directive('cgsSlimz', [
	function () {
            return {
                restrict: 'AC',
                scope: {
                    options: '='
                },
                link: function (scope, element, attrs) {
                    var options;
                    var watcher = scope.$watch('options', function () {
                        if (scope.options) {
                            options = scope.options;
                        } else options = {
                            height: '490px',
                            size: '7px'
                        };
                        for (var i in options) {
                            if (options[i]) {
                                $(element).slimscroll(options);
                                break;
                            }
                        }
                    }, true);
                    scope.$on('$destroy', function () {
                        if (watcher) {
                            watcher = null;
                        }
                    });
                }
            }
	}]);
    /**
     * My97 datePicker
     * @author linyh
     * ------------------------------------------------------------------
     */
    module.directive('cgsDatePicker', function(dateFilter) {
        return{
            require : '?ngModel',
            restrict: 'A',
            link: function(scope, element, attrs, ngModel) {
                if(typeof WdatePicker == 'function' && ngModel) {
                    var options = {};
                    options.dateFmt = attrs.dateFmt?attrs.dateFmt: 'yyyy-MM-dd HH:mm:ss';
                    scope.$watch(attrs.minDate, function(n, o){//设定可选的最小日期  by wangtj
                        options.minDate = dateFilter(n, options.dateFmt);
                    });
                    scope.$watch(attrs.maxDate, function(n, o){//设定可选的最大日期  by wangtj
                        options.maxDate = dateFilter(n, options.dateFmt);
                    });
                    options.onpicked = function(dp) {
                        var object = dp.cal.newdate;
                        var date = new Date(object.y, object.M - 1, object.d, object.H, object.m, object.s);
                        ngModel.$setViewValue(date);
                    };

                  options.Hchanged = function (dp) {
                      var object = dp.cal.newdate;
                      var date = new Date(object.y, object.M - 1, object.d, object.H, object.m, object.s);
                      if (!!ngModel)
                          ngModel.$setViewValue(date);
                  };
                  options.mchanged = function (dp) {
                      var object = dp.cal.newdate;
                      var date = new Date(object.y, object.M - 1, object.d, object.H, object.m, object.s);
                      if (!!ngModel)
                          ngModel.$setViewValue(date);
                  };
                  
                    options.oncleared = function(dp) {
                        ngModel.$setViewValue(null);
                    };
                    scope.$watch(attrs.ngModel, function(n, o) {
                        element.val(dateFilter(n, options.dateFmt));
                    });
                    var wdateFun = function() {
                        WdatePicker(options);
                    };
                    element.focus(wdateFun);
                    element.click(wdateFun);
                }
            }
        }
    });
        /**********模拟单选框组************/
        module.directive('cgsRadio', function($interval, dateFilter) {
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
                link: function(scope, element, attrs, ctrls) {
                    var $ul = $(element).children('ul');
                    scope.select = function(item, index) {
                        ctrls.$setViewValue(item.des);
                        $ul.children('li.selected').removeClass('selected');
                        $ul.children('li').eq(index).addClass('selected');
                    };
                }
            }
        });
        /**
         * 字符串截断	字符串超过len长度时，截取前len - 1个字符，并加上…
         * @author hucj
         * ------------------------------------------------------------------
         */
        module.filter('textEllipsis',function() {
            return function(s, len) {
                return (s && s.length > len)?(s.substring(0, len - 1) + '…'):s;
            }
        });
        /************自定义开关*************/
        module.directive('cgsMySwitch', function() {
            return {
                restrict: 'E',
                scope: {
                    controlItem: '=',
                    statusKey:'@',
                    endCallBack: '&'
                },
                template: '<div class="slide-switch" ng-class="{\'switchOpen\':controlItem[statusKey]}" ng-click="switch(controlItem)"><div></div></div>',
                link: function($scope, $element, $attrs, $ctrls) {
                    $scope.switch = function (item) {
                        if(typeof item[$scope.statusKey] == "boolean"){
                            item[$scope.statusKey] = !item[$scope.statusKey];
                        }
                        if(typeof item[$scope.statusKey] == "number"){
                            item[$scope.statusKey] = 1 - item[$scope.statusKey];
                        }
                        if(item[$scope.statusKey] == null){
                            item[$scope.statusKey] = true;
                        }
                        $scope.endCallBack();
                    }
                }
            }
        });
        /**
         * ztree
         * @author hecb
         * ------------------------------------------------------------------
         */
        module.directive('cgsTree', function ($http) {
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
                            if(scope.zSettings.expandAll) zTreeObj.expandAll(true);
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
        });
        module.filter("ellipsis", function () {
            return function (string, length) {
                var out = "";
                if (string) {
                    if (string.length > length) {
                        out = string.substr(0, length) + "...";
                    } else {
                        out = string;
                    }
                }
                return out;
            }
        });
});