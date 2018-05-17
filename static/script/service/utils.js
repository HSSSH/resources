angular.module('utils', []).factory('utils', ['$filter', function($filter) {
    var utils = {
            getObjByKeyInArr: getObjByKeyInArr,
            deleteObjByKeyInArr: deleteObjByKeyInArr,
            getItemInArr: getItemInArr,
            changeObjByKeyInArr: changeObjByKeyInArr,
            deepClone: deepClone,
            isEmptyObj: isEmptyObj,
            getUrlPrmt: getUrlPrmt,
            toTimeStr: toTimeStr,
            generateTreeData: generateTreeData,
            debounce: debounce,
            throttle: throttle
    };

    function toTimeStr(time) {
        if (!time) {
            return '';
        }
        try{
            var time = new Date(time);
            if(time == 'Invalid Date'){
                var time = new Date(parseInt(time));
                if(time == 'Invalid Date'){
                    var time = new Date(Date.parse(time));
                }
            }
        }catch(e){
            console.log("时间转换失败");
            return false;
        }
        return $filter("date")(time, "yyyy-MM-dd HH:mm").toString();
    }

    //数组中查找某key值为value的对象
    function getObjByKeyInArr(arr, key, value) {
        for (var i = 0; i < arr.length; i++)
            if (arr[i][key] == value) {
                return arr[i];
            }
        return null;
    }

    function getItemInArr(arr, value) {
        for (var i = 0; i < arr.length; i++)
            if (arr[i] == value) {
                return arr[i];
            }
        return null;
    }

    //数组中删除某key值为value的对象(多个)
    function deleteObjByKeyInArr(arr, key, value) {
        for (var len = arr.length, i = len - 1; i >= 0; i--)
            if (arr[i][key] == value) {
                arr.splice(i, 1);
            }
        return null;
    }
    
    function changeObjByKeyInArr(arr, key, value, obj) {
   	 for (var i = 0; i < arr.length; i++)
            if (arr[i][key] == value) {
           	  var target = arr[i];
            	arr.splice(i, 1, obj);
           	 return {index: i, target: target};
            }
        return false;
   }

    //深拷贝
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

    //判断是否空对象
    function isEmptyObj(obj) {
        if (!obj || typeof obj !== 'object') {
            return false;
        } else {
            return !Object.keys(obj).length;  //Object.keys() 为 es5 方法
        }
    }

    //获取url参数
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

    /*
    *@param {array} data 原始数数组
    *@param {object} keys 父子数据条目id标识键名
    *@param {string} keys.id 数据id标识的键名
    *@param {string} keys.pid 数据父条目id标识的键名
    *@param {string} topId 根节点的父id标识
    *@return {array} 返回的树形结构数据
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
    //函数防抖，无再次触发delay毫秒后执行，用于scroll，resize等操作
    function debounce(fn, delay){
        var timer = null;
        return function(){
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function(){
                fn.apply(context, args);
            }, delay);
        };
     }
     //函数节流，间隔delay毫秒执行
     function throttle(fn, delay){
            var timer;
            return function(){
                var args = arguments;
                if(!timer){
                    timer = setTimeout(function() {
                        timer = null;
                    }, delay);
                    return fn.apply(this, args);
                }
            }
        }

    return utils;

}]).filter("timeLength", function () {
    return function (seconds) {
        if(seconds >= 0) {
            var h, m, s;
            if (seconds >= 3600) {
                h = (seconds - seconds % 3600) / 3600;
                seconds = seconds % 3600;
            }
            if (seconds >= 60) {
                m = (seconds - seconds % 60) / 60;
                seconds = seconds % 60;
            }
            s = seconds;
            h = !!h ? h : "00";
            m = !!m ? m : "00";
            s = !!s ? s : "00";
            return h + ":" + m + ":" + s;
        } else {
            return 0;
        }
    }
});
