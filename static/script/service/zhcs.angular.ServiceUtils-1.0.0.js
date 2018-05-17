define(['angular'], function(angular) {
	angular.module('angular-zhcs-service', []).factory('zhcsUtils', [function() {
	    var utils = {
	            getObjByKeyInArr: getObjByKeyInArr, //从数组中获取对象
	            changeObjByKeyInArr: changeObjByKeyInArr, //替换数组中特定对象
	            deleteObjByKeyInArr: deleteObjByKeyInArr, //删除数组中某个对象
	            getItemInArr: getItemInArr, //从数组中获取元素
	            deleteItemInArr: deleteItemInArr, //从数组中删除元素,
	            
	            deepClone: deepClone, //深拷贝
	            isEmptyObj: isEmptyObj, //判断是否空对象
	            
	            randomNum: randomNum, //生成[min, max]范围内随机数
	            randomColor: randomColor, //生成随机颜色
	            
	            millisecondPassTime: millisecondPassTime, //获取某个时间距离现在的时长(毫秒值)
	            formatRemainTime: formatRemainTime,  //计算现在距离${endTime的}的剩余时间毫秒值
	            toMillisecond: toMillisecond, //格式化'HH:mm:ss'为毫秒值
	            formatSeconds: formatSeconds, //格式化毫秒值为'HH:mm:ss'
	            
	            getUrlPrmt: getUrlPrmt, //获取url上的参数
	            getExplore: getExplore, //获取浏览器信息
	            getKeyNameBykeycode: getKeyNameBykeycode, //根据键值获取键名
	            generateTreeData: generateTreeData, //把数组型数据转换成树形结构
	            
	            debounce: debounce, //函数防抖
	            throttle: throttle //函数节流,      
	    };
	    
	   
	    // 获取数组中key值为value的对象
	    function getObjByKeyInArr(arr, key, value) {
	        for (var i = 0; i < arr.length; i++)
	            if (arr[i][key] === value) {
	                return arr[i];
	            }
	        return null;
	    }
	    
	    function changeObjByKeyInArr(arr, key, value, obj) {
	    	 for (var i = 0; i < arr.length; i++)
	             if (arr[i][key] === value) {
	            	 arr.splice(i, 1, obj);
	            	 return obj;
	             }
	         return false;
	    }

	    // 获取数组中的指定对象
	    function getItemInArr(arr, item) {
	        for (var i = 0; i < arr.length; i++)
	            if (arr[i] === item) {
	                return arr[i];
	            }
	        return null;
	    }

	    // 删除数组中的指定对象
	    function deleteItemInArr(arr, item) {
	    	for (var i = 0; i < arr.length; i++)
	            if (arr[i] === item) {
	                return arr.splice(i, 1);
	            }
	        return false;
	    }

	    // 删除数组中key值为value的对象(多个)
	    function deleteObjByKeyInArr(arr, key, value) {
	        var count = 0;
	        for (var len = arr.length, i = len - 1; i >= 0; i--)
	            if (arr[i][key] === value) {
	                arr.splice(i, 1);
	                count += 1;
	            }
	        return count;
	    }

	    // 深拷贝
	    function deepClone(values) {
	        var copy;
	        if (null == values || 'object' != typeof values) {
	            return values;
	        }
	        if (values instanceof Date) {
	            copy = new Date();
	            copy.setTime(values.getTime());
	            return copy;
	        }
	        if (values instanceof Array) {
	            copy = [];
	            for (var i = 0, len = values.length; i < len; i++) {
	                copy[i] = deepClone(values[i]);
	            }
	            return copy;
	        }
	        if (values instanceof Object) {
	            copy = {};
	            for (var attr in values) {
	                if (values.hasOwnProperty(attr)) {
	                    copy[attr] = deepClone(values[attr]);
	                }
	                return copy;
	            }
	        }
	    }

	    // 判断是否空对象
	    function isEmptyObj(obj) {
	        if (!obj || typeof obj !== 'object') {
	            return false;
	        } else {
	            return !Object.keys(obj).length; // Object.keys() 为 es5 方法
	        }
	    }

	    // 获取url参数
	    function getUrlPrmt(url) {
	        url = url ? url : window.location.href;
	        var _pa = url.substring(url.indexOf('?') + 1), _arrS = _pa.split('&'), _rs = {};
	        for (var i = 0, _len = _arrS.length; i < _len; i++) {
	            var pos = _arrS[i].indexOf('=');
	            if (pos == -1) {
	                continue;
	            }
	            var name = _arrS[i].substring(0, pos), value = window.decodeURIComponent(_arrS[i].substring(pos + 1));
	            _rs[name] = value;
	        }
	        return _rs;
	    }
	    
	    /**
	     * 
	     * @desc 生成指定范围随机数
	     * @param  {Number} min 
	     * @param  {Number} max 
	     * @return {Number} 
	     */
	    function randomNum(min, max) {
	        return Math.floor(min + Math.random() * (max - min));
	    }
	    
	    /**
	     * 
	     * @desc 随机生成颜色
	     * @return {String} 
	     */
	    function randomColor() {
	        return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
	    }
	    
	    /**
	     * @desc   计算${startTime}距现在的时间毫秒值
	     * @param  {Date} startTime 
	     * @return {number}
	     */
	    function millisecondPassTime(startTime) {
	    	 if (!startTime) return;
	    	 var currentTime = Date.parse(new Date());
	    	 var startTimeMis;
	         try{
	        	 startTimeMis = new Date(startTime);
	             if(startTimeMis == 'Invalid Date'){
	            	 startTimeMis = new Date(parseInt(startTime));
	                 if(startTimeMis == 'Invalid Date'){
	                	 startTimeMis = new Date(Date.parse(startTime));
	                 }
	             }
	         }catch(e){             
	             return false;
	         }
	         return currentTime - startTimeMis;
	            day = parseInt(time / (1000 * 60 * 60 * 24)),
	            hour = parseInt(time / (1000 * 60 * 60)),
	            min = parseInt(time / (1000 * 60)),
	            month = parseInt(day / 30),
	            year = parseInt(month / 12);      
	    }
	    
	    /**
	     * 
	     * @desc   计算现在距离${endTime的}剩余时间毫秒值
	     * @param  {Date} endTime  
	     * @return {String}
	     */
	    function formatRemainTime(endTime) {
	        var startDate = new Date(); //开始时间
	        var endDate;//结束时间
	        try{
	        	endDate = new Date(startTime);
	            if(endDate == 'Invalid Date'){
	            	endDate = new Date(parseInt(startTime));
	                if(endDate == 'Invalid Date'){
	                	endDate = new Date(Date.parse(startTime));
	                }
	            }
	        }catch(e){             
	            return false;
	        }
	        return endDate.getTime() - startDate.getTime(); //时间差        
	    }
	    
	    /**
	     * @desc   将{timeStr} 'HH:mm:ss' 格式的时长转成毫秒值
	     * @param  {string} timeStr 
	     * @return {number}
	     */
	    function toMillisecond(timeStr) {
	    	var arr = timeStr.split(':').reverse().map(function(item) {
	    		return parseInt(item, 10);
	    	});
	    	var miss = 0;
	    	for (var i = 0, len = arr.length; i < len; i++) {
	    		var Multiple = [1, 60, 60 * 60];
	    		miss += arr[i] * 60 * Multiple[i];
	    	}
	    	return miss;
	    }
	    /**
	     * @desc   将{seconds} 毫秒值的时长转成'HH:mm:ss'格式
	     * @param  {number} seconds 
	     * @return {string}
	     */
	    function toSeconds(seconds) {
	        if(seconds >= 0) {
	            var h, m, s;
	            if (seconds >= 3600) {
	                h = (seconds - seconds % 3600) / 3600;
	                h = h>=10 ? h : "0"+h; // 小时数小于10则在数字前加0
	                seconds = seconds % 3600;
	            }
	            if (seconds >= 60) {
	                m = (seconds - seconds % 60) / 60;
	                m = m>=10 ? m : "0"+m; // 分钟数小于10则在数字前加0
	                seconds = seconds % 60;
	            }
	            s = seconds>=10 ? seconds : "0"+seconds; // 秒数小于10则在数字前加0
	            h = !!h ? h : "00";
	            m = !!m ? m : "00";
	            s = !!s ? s : "00";
	            return h + ":" + m + ":" + s;
	        } else {
	            return -1;
	        }
	    }

	    /**
	     * @param {array} data 原始数数组
	     * @param {object} keys 父子数据条目id标识键名
	     * @param {string} keys.id 数据id标识的键名
	     * @param {string} keys.pid 数据父条目id标识的键名
	     * @param {string} topId 根节点的父id标识
	     * @return {array} 返回的树形结构数据
	     */
	    function generateTreeData(data, keys, topId) {
	        var treeData = {$id: topId, sub: []};
	        var getSub = function (parent, data) {
	            for(var len = data.length, i = len-1; i >= 0; i--){
	                if(parent.$id == data[i][keys['pid']]){
	                    var item = {};
	                    for(var j in data[i]){
	                        item[j] = data[i][j];
	                    }
	                    item.$id = data[i][keys['id']];
	                    item.sub = [];
	                    parent.sub.unshift(item);
	                    data.splice(i, 1);
	                }
	            }
	            if(data.length == 0){
	                return;
	            }
	            for(var k = 0, len1 = parent.sub.length; k < len1; k++){
	                getSub(parent.sub[k], data);
	            }
	        };
	        getSub(treeData, data);
	        return treeData;
	    }

	    // 函数防抖，无再次触发delay毫秒后执行，用于scroll，resize等操作
	    function debounce(fn, delay){
	        return function(){
	            var context = this, args = arguments;
	            if (fn.timer) clearTimeout(fn.timer);
	            fn.timer = setTimeout(function(){
	                fn.apply(context, args);
	            }, delay);
	        };
	     }

	    // 函数节流，间隔delay毫秒执行
	    function throttle(fn, delay){
	        var timer;
	        return function(){
	            var args = arguments;
	            if(!fn.timer){
	            	fn.timer = setTimeout(function() {
	            		fn.timer = null;
	                }, delay);
	                return fn.apply(this, args);
	            }
	        }
	    }
	    
	    /**
	     * 
	     * @desc 获取浏览器类型和版本
	     * @return {String} 
	     */
	    function getExplore() {
	        var sys = {},
	            ua = navigator.userAgent.toLowerCase(),
	            s;
	        (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? sys.ie = s[1]:
	            (s = ua.match(/msie ([\d\.]+)/)) ? sys.ie = s[1] :
	            (s = ua.match(/edge\/([\d\.]+)/)) ? sys.edge = s[1] :
	            (s = ua.match(/firefox\/([\d\.]+)/)) ? sys.firefox = s[1] :
	            (s = ua.match(/(?:opera|opr).([\d\.]+)/)) ? sys.opera = s[1] :
	            (s = ua.match(/chrome\/([\d\.]+)/)) ? sys.chrome = s[1] :
	            (s = ua.match(/version\/([\d\.]+).*safari/)) ? sys.safari = s[1] : 0;
	        // 根据关系进行判断
	        if (sys.ie) return ('IE: ' + sys.ie)
	        if (sys.edge) return ('EDGE: ' + sys.edge)
	        if (sys.firefox) return ('Firefox: ' + sys.firefox)
	        if (sys.chrome) return ('Chrome: ' + sys.chrome)
	        if (sys.opera) return ('Opera: ' + sys.opera)
	        if (sys.safari) return ('Safari: ' + sys.safari)
	        return 'Unkonwn'
	    }
	    
	    var keyCodeMap = {
	    	    8: 'Backspace',
	    	    9: 'Tab',
	    	    13: 'Enter',
	    	    16: 'Shift',
	    	    17: 'Ctrl',
	    	    18: 'Alt',
	    	    19: 'Pause',
	    	    20: 'Caps Lock',
	    	    27: 'Escape',
	    	    32: 'Space',
	    	    33: 'Page Up',
	    	    34: 'Page Down',
	    	    35: 'End',
	    	    36: 'Home',
	    	    37: 'Left',
	    	    38: 'Up',
	    	    39: 'Right',
	    	    40: 'Down',
	    	    42: 'Print Screen',
	    	    45: 'Insert',
	    	    46: 'Delete',

	    	    48: '0',
	    	    49: '1',
	    	    50: '2',
	    	    51: '3',
	    	    52: '4',
	    	    53: '5',
	    	    54: '6',
	    	    55: '7',
	    	    56: '8',
	    	    57: '9',

	    	    65: 'A',
	    	    66: 'B',
	    	    67: 'C',
	    	    68: 'D',
	    	    69: 'E',
	    	    70: 'F',
	    	    71: 'G',
	    	    72: 'H',
	    	    73: 'I',
	    	    74: 'J',
	    	    75: 'K',
	    	    76: 'L',
	    	    77: 'M',
	    	    78: 'N',
	    	    79: 'O',
	    	    80: 'P',
	    	    81: 'Q',
	    	    82: 'R',
	    	    83: 'S',
	    	    84: 'T',
	    	    85: 'U',
	    	    86: 'V',
	    	    87: 'W',
	    	    88: 'X',
	    	    89: 'Y',
	    	    90: 'Z',

	    	    91: 'Windows',
	    	    93: 'Right Click',

	    	    96: 'Numpad 0',
	    	    97: 'Numpad 1',
	    	    98: 'Numpad 2',
	    	    99: 'Numpad 3',
	    	    100: 'Numpad 4',
	    	    101: 'Numpad 5',
	    	    102: 'Numpad 6',
	    	    103: 'Numpad 7',
	    	    104: 'Numpad 8',
	    	    105: 'Numpad 9',
	    	    106: 'Numpad *',
	    	    107: 'Numpad +',
	    	    109: 'Numpad -',
	    	    110: 'Numpad .',
	    	    111: 'Numpad /',

	    	    112: 'F1',
	    	    113: 'F2',
	    	    114: 'F3',
	    	    115: 'F4',
	    	    116: 'F5',
	    	    117: 'F6',
	    	    118: 'F7',
	    	    119: 'F8',
	    	    120: 'F9',
	    	    121: 'F10',
	    	    122: 'F11',
	    	    123: 'F12',

	    	    144: 'Num Lock',
	    	    145: 'Scroll Lock',
	    	    182: 'My Computer',
	    	    183: 'My Calculator',
	    	    186: ';',
	    	    187: '=',
	    	    188: ',',
	    	    189: '-',
	    	    190: '.',
	    	    191: '/',
	    	    192: '`',
	    	    219: '[',
	    	    220: '\\',
	    	    221: ']',
	    	    222: '\''
	    	};
	    	/**
	    	 * @desc 根据keycode获得键名
	    	 * @param  {Number} keycode 
	    	 * @return {String}
	    	 */
	    	function getKeyNameBykeycode(keycode) {
	    	    if (keyCodeMap[keycode]) {
	    	        return keyCodeMap[keycode];
	    	    } else {
	    	        console.log('Unknow Key(Key Code:' + keycode + ')');
	    	        return '';
	    	    }
	    	};

	    return utils;
	}])
});