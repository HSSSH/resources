angular.module('ui.colorpicker', ['openlayers-directive','ui.slider'])
    .directive('colorPicker', ['$compile', 'olHelpers', function($compile, olHelpers) {
        return {
            restrict: 'EA',
            scope: {
                currentStyle: '=',
                colorKey: '@',
                endCallBack: "&"
            },
            link: function(scope, element, attrs, ngModel) {
            	var colorRgb = olHelpers.colorRgb;
                var defaultColor = scope.currentStyle[scope.colorKey] || '#fff';
                scope.lineWidth = attrs.lineWidth || '2px';

                var defaultOptions = {
                    clearText: '默认颜色',
                    defaultColor: defaultColor,
                    latestText: '最近使用',
                    commonText: '主题颜色',
                    commonColor: [
                        [
                            '#ffffff', '#000000', '#eeece1', '#1f497d', '#4f81bd',
                            '#c0504d', '#9bbb59', '#8064a2', '#4bacc6', '#f79646'
                        ],
                        [
                            '#f2f2f2', '#808080', '#ddd8c2', '#c6d9f1', '#dbe5f1',
                            '#f2dbdb', '#eaf1dd', '#e5dfec', '#daeef3', '#fde9d9'
                        ],
                        [
                            '#d9d9d9', '#595959', '#c4bc96', '#8db3e2', '#b8cce4',
                            '#e5b8b7', '#d6e3bc', '#ccc0d9', '#b6dde8', '#fbd4b4'
                        ],
                        [
                            '#bfbfbf', '#404040', '#938953', '#548dd4', '#95b3d7',
                            '#d99594', '#c2d69b', '#b2a1c7', '#92cddc', '#fabf8f'
                        ],
                        [
                            '#a6a6a6', '#262626', '#4a442a', '#17365d', '#365f91',
                            '#943634', '#76923c', '#5f497a', '#31849b', '#e36c0a'
                        ],
                        [
                            '#7f7f7f', '#0d0d0d', '#1c1a10', '#0f243e', '#243f60',
                            '#622423', '#4e6128', '#3f3151', '#205867', '#974706'
                        ]
                    ],
                    standardText: '标准颜色',
                    standardColor: [
                        '#c00000', '#ff0000', '#ffc000', '#ffff00', '#92d050',
                        '#00b050', '#00b0f0', '#0070c0', '#002060', '#7030a0'
                    ],
                    moreText: '更多颜色..',
                    commonWidth: ['2', '3', '4', '5']
                };


                var pickerInputId = (+new Date() * 1e6 + Math.floor(Math.random() * 1e6)).toString(36);

                var template = '<div class="colorpicker-container" tabindex="-1" ng-click="keepPickerOpen($event)">'
                    + '<div class="colorpicker-toolbar">'
                    // + '<div class="colorpicker-clear" ng-bind="defaultOptions.clearText"'
                    // + ' ng-click="selectColorAndClose(setColor() || defaultOptions.defaultColor)"></div>'
                    + '<div class="colorpicker-preview" ng-style="{ \'background-color\': hoveredColor }"'
                    +' title="颜色预览"></div>'
                    + '</div>'
                    // +'<div class="colorpicker-opacity">'
                    // +'<div class="colorpicker-title">透明度</div>'
                    // +'<div class="opacitySlider"><div id="slider" ui-slider="slider.options" min="0"  max="1" ng-model="slider.realProgress"></div></div>'
                    // +'</div>'
                    + '<div class="colorpicker-title" ng-bind="defaultOptions.latestText" ng-if="latestColor.length > 0"></div>'
                    + '<div class="colorpicker-latestcolor colorpicker-colors">'
                    + '<span class="colorpicker-colors-item"'
                    + ' ng-repeat="color in latestColor"'
                    + ' ng-style="{\'background-color\': color, \'border-color\': color}"'
                    + ' ng-click="selectColorAndClose(color)"'
                    + ' ></span>'
                    + '</div>'
                    + '<div class="colorpicker-title" ng-bind="defaultOptions.commonText"></div>'
                    + '<div class="colorpicker-commoncolor">'
                    + '<div class="colorpicker-colors colorpicker-colors-line{{$index}}"'
                    + ' ng-repeat="line in defaultOptions.commonColor">'
                    + '<span class="colorpicker-colors-item"'
                    + ' ng-repeat="color in line"'
                    + ' ng-style="{\'background-color\': color, \'border-color\': color}"'
                    + ' ng-click="selectColorAndClose(color)"'
                    + ' ></span>'
                    + '</div>'
                    + '</div>'
                    + '<div class="colorpicker-title" ng-bind="defaultOptions.standardText"></div>'
                    + '<div class="colorpicker-standardcolor colorpicker-colors">'
                    + '<span class="colorpicker-colors-item"'
                    + ' ng-repeat="color in defaultOptions.standardColor"'
                    + ' ng-style="{\'background-color\': color, \'border-color\': color}"'
                    + ' ng-click="selectColorAndClose(color)"'
                    + ' ></span>'
                    + '</div>'
                    // + '<div class="colorpicker-title colorpicker-morecolor" ng-if="isSupportNativeColorPicker">'
                    // + '<label for="native-color-picker'+ pickerInputId +'" ng-bind="defaultOptions.moreText"></label>'
                    // + '<input id="native-color-picker'+ pickerInputId +'" class="native-color-picker" type="color"'
                    // + ' ng-model="nativeColor"'
                    // + ' ng-change="selectColor(nativeColor);" />'
                    // + '</div>'
                    + "<div class='colorpicker-line' style='display:none;'>" 
            	    +"<div class='colorpicker-title'>线型<i class='fa fa-caret-right'></i></div>"
            	    +"<div class='lineWidth'><div ng-class='{true:\"active\"}[item==lineWidth]' ng-repeat='item in defaultOptions.commonWidth' ng-click='selectWidth(item)'>"
            	    +"<span ng-bind='item'></span> px<i></i></div></div>"
                    + '</div>';
            		+"</div>";

                var $ = angular.element;
                var colorpickerTemplate = $(template);
                var position = angular.isDefined(attrs.colorpickerPosition) ? attrs.colorpickerPosition : 'bottom';

                scope.defaultOptions = defaultOptions;
                
                // scope.slider = {
                // 		options:{
    				// 		orientation: 'horizontal',
    				// 	    range: 'min',
    				// 	    min: 0,
    				// 	    max:1,
    				// 	    step: 0.01,
    				// 	    slide:function( event, ui ) {//滑动时
    				// 	    	 var temp = colorRgb(scope.hoveredColor).split(",");
    				// 	    	 scope.hoveredColor = "rgba("+temp[0]+","+temp[1]+","+temp[2]+","+scope.slider.realProgress+")";
    				// 	    	 if( !!ngModel )
    				// 					ngModel.$setViewValue({color:scope.hoveredColor,width:scope.lineWidth});
    				// 	    	 scope.$apply();
    				// 	    }
    				// 	},
    				// 	realProgress:1
                // }
                
                //改变透明度slider的背景颜色
                // scope.changeSlidercolor = function(color){
                // 	var rgbArr = colorRgb(color).split(",");
                //     var startRgba = "rgba("+rgbArr[0]+","+rgbArr[1]+","+rgbArr[2]+",0)",
                //     	endRgb ="rgb("+rgbArr[0]+","+rgbArr[1]+","+rgbArr[2]+")" ;
                //
                //     colorpickerTemplate.find("#slider").css({
                //     	"background":"linear-gradient(to right, "+startRgba+", "+endRgb+")",
                //     	"filter": "progid:DXImageTransform.Microsoft.gradient (GradientType=1, startColorstr="+startRgba+", endColorstr="+endRgb+")"
                //     });
                // }
                // scope.changeSlidercolor(defaultColor);

                scope.isSupportNativeColorPicker = isSupportNativeColorPicker();
                scope.latestColor = getLatestColor();

                scope.selectWidth = selectWidth;
                scope.selectColor = selectColor;
                scope.previewColor = previewColor;
                scope.selectColorAndClose = selectColorAndClose;
                scope.keepPickerOpen = keepPickerOpen;

                // used in the previewer
                scope.hoveredColor = defaultOptions.defaultColor;
		    	 if( !!ngModel )
						ngModel.$setViewValue({color:scope.hoveredColor,width:scope.lineWidth});

                // append the template to body
                $compile(colorpickerTemplate)(scope);
                $(document.body).append(colorpickerTemplate);

                element.on('click', openColorPicker);
                $(document).on('click', closeColorPicker);

                scope.$on('openColorPicker', openColorPicker);
                scope.$on('closeColorPicker', closeColorPicker);

                // window 发生 resize 的时候重新计算位置
                if (window.attachEvent) {
                    window.attachEvent('onresize', reCalculatePostion);
                } else if (window.addEventListener) {
                    window.addEventListener('resize',reCalculatePostion);
                }

                function reCalculatePostion () {
                    var newPostion = getColorpickerTemplatePosition(element);
                    colorpickerTemplate.css(newPostion);
                }


                function isPickerEnable() {
                    return angular.isDefined(attrs.disabled) ? !attrs.disabled : true;
                }
                
                function selectWidth(width){
                	scope.lineWidth = width;
			    	 if( !!ngModel )
							ngModel.$setViewValue({color:scope.hoveredColor,width:scope.lineWidth});
                }

                function selectColor(color) {
                    
                    //scope.hoveredColor = color;
			    	 var temp = colorRgb(color).split(",");
			    	 if(!temp[3]){
			    		 scope.hoveredColor = "rgba("+temp[0]+","+temp[1]+","+temp[2]+",1)";
				    	 // scope.slider.realProgress = 1;
			    	 }else{
			    		 scope.hoveredColor = color;
				    	 // scope.slider.realProgress = temp[3];
			    	 }

			    	 //改变透明度进度条的背景色和值
			    	 // scope.changeSlidercolor(scope.hoveredColor);
			    	 
	                //scope.$emit('colorPicked', scope.hoveredColor);
			    	 if( !!ngModel )
							ngModel.$setViewValue({color:scope.hoveredColor,width:scope.lineWidth});

                    // 设置“最近使用颜色”
                    setLatestColor(scope.hoveredColor);
                    scope.latestColor = getLatestColor();
                    scope.currentStyle[scope.colorKey] = scope.hoveredColor;
                }

                function selectColorAndClose(color) {
                    selectColor(color);
                    closeColorPicker();
                    scope.endCallBack();
                }

                function previewColor(color) {
                   // scope.hoveredColor = color;
			    	 var temp = colorRgb(color).split(",");
			    	 // scope.hoveredColor = "rgba("+temp[0]+","+temp[1]+","+temp[2]+","+scope.slider.realProgress+")";
			    	 scope.hoveredColor = "rgba("+temp[0]+","+temp[1]+","+temp[2]+",1)";

         			//改变透明度进度条的背景色和值
                     // scope.changeSlidercolor(scope.hoveredColor);
                     // scope.slider.realProgress = temp[3]||1;
                }

                function closeColorPicker() {
                    colorpickerTemplate.css('display', 'none');
            		element.removeClass("active");
//            		scope.slider.realProgress = 1;
//                    scope.hoveredColor = scope.setColor() || attrs.defaultColor || '#fff';
                    //scope.$apply();
                }

                function openColorPicker(e) {
                    var enable = isPickerEnable();

                    if (enable) {
                    	if(colorpickerTemplate.css('display')=="block"){
                    		closeColorPicker();
                    		return;
                    	}
                        e.stopPropagation();

                        //关闭其他 
                        $(".font-color").removeClass("active");
                        $(".colorpicker-container").css('display', 'none');
                        
                		element.addClass("active");
                		
                		//打开颜色选择器，设置该图形的当前颜色和线段粗细
                		// var nowVal = scope.hoveredColor;
                		// if(nowVal){
                		// 	scope.hoveredColor = nowVal.color;
                		//
                		// 	//改变透明度进度条的背景色和值
                		// 	// scope.changeSlidercolor(scope.hoveredColor);
                         //    // scope.slider.realProgress = colorRgb(nowVal.color).split(",")[3]||1;
                    		//
                    		// if(nowVal.width){
                    		// 	scope.lineWidth = nowVal.width;
                    		// }
                    		// scope.$apply();
                		// }
                		
                		if(attrs.lineWidth){
                			colorpickerTemplate.find(".colorpicker-line").css('display', 'block');
                		}
                        var templatePostion = getColorpickerTemplatePosition(element);

                        colorpickerTemplate.css(templatePostion);
                        colorpickerTemplate.css('display', 'block');
                        colorpickerTemplate[0].focus();
                    }
                }

                function keepPickerOpen(e) {
                    e.stopPropagation();
                }

                // 特性检测
                function isSupportNativeColorPicker() {
                    var i = document.createElement('input');
                    i.setAttribute('type', 'color');

                    return i.type !== 'text';
                }

                /**
                 * 获取 UIMemory对象
                 * @returns {object} uiMemory 对象
                 */
                function getUIMemory() {
                    var uiMemory = window.localStorage.getItem('ui-color-picker');

                    if (!uiMemory) {
                        return null;
                    }

                    try {
                        uiMemory = JSON.parse(uiMemory)
                    } catch(e) {
                        return null;
                    }

                    return uiMemory;
                }

                function getLatestColor() {
                    var uiMemory = getUIMemory();

                    return uiMemory ? uiMemory.latestColor : [];
                }

                function setLatestColor(color) {
                    var uiMemory = getUIMemory() || {};
                    var latest = getLatestColor();


                    if (latest && latest instanceof Array) {
                        var idx = latest.indexOf(color);

                        if (idx != -1) {
                            latest.splice(idx, 1);
                        }
                        latest.unshift(color);

                    } else {
                        latest = [color];
                    }

                    if (latest.length > 10) {
                        latest = latest.slice(0, 10);
                    }

                    uiMemory.latestColor = latest;

                    window.localStorage.setItem('ui-color-picker', JSON.stringify(uiMemory));
                }

                function getOffset(elem, fixedPosition) {
                    var x = 0,
                        y = 0,
                        scrollX = 0,
                        scrollY = 0;
                    while (elem && !isNaN(elem.offsetLeft) && !isNaN(elem.offsetTop)) {
                        x += elem.offsetLeft;
                        y += elem.offsetTop;
                        if (!fixedPosition && elem.tagName === 'BODY') {
                            scrollX += document.documentElement.scrollLeft || elem.scrollLeft;
                            scrollY += document.documentElement.scrollTop || elem.scrollTop;
                        } else {
                            scrollX += elem.scrollLeft;
                            scrollY += elem.scrollTop;
                        }
                        elem = elem.offsetParent;
                    }
                    return {
                        top: y,
                        left: x,
                        scrollX: scrollX,
                        scrollY: scrollY
                    };
                }


                function getColorpickerTemplatePosition (element) {
                    var
                        positionValue,
                        positionOffset = getOffset(element[0]);

                    //if(angular.isDefined(attrs.colorpickerParent)) {
                    //    positionOffset.left = 0;
                    //    positionOffset.top = 0;
                    //}

                    if (position === 'top') {
                        positionValue =  {
                            'top': positionOffset.top - 147,
                            'left': positionOffset.left
                        };
                    } else if (position === 'right') {
                        positionValue = {
                            'top': positionOffset.top,
                            'left': positionOffset.left + 45
                        };
                    } else if (position === 'bottom') {
                        positionValue = {
                            'top': positionOffset.top + element[0].offsetHeight + 2,
                            'left': positionOffset.left
                        };
                    } else if (position === 'left') {
                        positionValue = {
                            'top': positionOffset.top,
                            'left': positionOffset.left - 150
                        };
                    }else if(position === 'auto'){
                        positionValue = {
                            'top': positionOffset.top,
                            'left': positionOffset.left + 45
                        };
                    	if($(window).width()-positionOffset.left<245){
                    		positionValue.left = positionOffset.left - 200
                    	}
                    	if($(window).height()-positionOffset.top<colorpickerTemplate.outerHeight()){
                    		positionValue.top = $(window).height()-colorpickerTemplate.outerHeight();
                    	}
                    }
                    return {
                        'top': positionValue.top + 'px',
                        'left': positionValue.left + 'px'
                    };
                }

            }
        }
    }]);