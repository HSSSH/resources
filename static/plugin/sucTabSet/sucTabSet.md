@author zjf
## 1 开始使用sucTabset，按以下步骤引入

### 1.1 把 `sucTabSet` 文件夹放到 `static/script/directive` 路径下

### 1.2 在 `requireMain.js` 中配置 `sucTabSet` 模块依赖
```javascript
var config = {
        baseUrl: './', 
        waitSeconds: 260,
        paths: { 
            'jquery': 'js/jquery-2.1.3.min',
            'polyfill': 'js/polyfill.min', 
            'angular': 'js/angular.min',
            'sucTabSet': 'script/directive/sucTabSet/sucTabDynamic', //配置路径
            'app': 'script/app',
            'appCtrl': 'script/controller/appController',
            'tabCtrl': 'scropt/controller/tabPageController',
            ...
        },
        shim: { 
            'angular': {
                exports: 'angular',
                deps: ['jquery']
            },
            'sucTabSet': { 
                deps: ['angular']
            },
            ...
        }
    };
    require.config(config);

    require(['jquery', 'angular', 'polyfill', 'app', 'appCtrl', 'tabCtrl'], function($, angular) {
        angular.bootstrap(document, ['demo']); 
    });
```

### 1.3 在 `app.js` 中定义依赖 `sucTabSet` 模块，并且在angular.module中注入tabs-dynamic
```javascript
/*
* @file app.js
*/
define(
    [
        'angular',
        'sucTabSet' //sucTabSet为requireJs定义的模块名
    ],
    function(angular) {

        var app = angular.module('demo', ['tabs-dynamic']);  // tabs-dynamic 为sucTabSet模块内定义的angular模块
        app.config(['$httpProvider', function($httpProvider) {
            ...
        }]);
        return app;
    }
);

```

### 1.4 在 最顶级的 controller 中，一般是 `appController.js` 中配置初始化要打开的标签页
```javascript
/*
* @file appController.js
*/
define(['app'], function(app) {
    app.controller('appCtrl', ['$scope', function($scope) {
        $scope.tabs = [{
            index: '1', //标签页唯一索引，不得重复
            title: "标签页1", //标签页标题，
            static: false, //默认值为false，若设为true，则该标签页不可关闭，关闭按钮隐藏
            controller: 'tabCtrl', //标签页controller，设置该参数时不需要在页面上写 ng-controller 指令
            resolve: { //给标签页controller注入的参数，传参方式类似$uibModal.open() 的 resolve 配置项
                params1: 'gggg', //直接传入变量
                params2: function() { //通过函数返回一个变量值
                    return {
                        name: 'hhh',
                        sex: 'mail',
                        age: '23'
                    }
                },
                params3: function() { //传递一个promise
                    return $http.get(url);
                }
             },
             content: "partials/tab.html" //标签页模版
        }, {
            
        }, ...];
    }]);
});

```
```javascript
/*
* @file tabPageController.js
*/
define(['app'], function(app) {
    app.controller('tabCtrl', ['$scope', 'params1', 'params2', 'params3', function($scope, params1, params2, params3) {
        console.log(params1); 
        console.log(params1);
        console.log(params1);
    }]);
});
```

### 1.5 在 `app.html` 页面中使用指令标签
```html

<suc-tab-set active="selectedIndex" original-tabs="tabs"><!-- selectedIndex为当前显示的tab页索引index，tabs是appCtrl里初始配置的$scope.tabs数组-->
	<suc-tab ng-repeat="tab in tabs" index='{{tab.index}}' heading='{{tab.title}}' icon='{{tab.icon}}'  static='tab.static' controller='{{tab.controller}}' resolve="tab.resolve">
		<div ng-include="tab.content" class="main-content"></div>
	</suc-tab>
</suc-tab-set>
```
### 1.6 在 `app.html` 中引入 `sucTabset.css`
```html
<link rel="stylesheet" href="script/directive/sucTabSet/sucTabset.css"/>
```

## 2 对外暴露的接口方法说明
 `tabset` 是定义在 sucTabSet模块内部的对象，对外暴露挂载在 `suc-tab-set` 所在的父scope 上，在外部可通过 $scope.tabset 访问，通过 $scope.tabset 可调用新建/更新/关闭tab页的方法。
### 2.1 新建一个标签页
`$scope.tabset.addTabOuter` 新建一个标签页并将之显示为当前标签页，若该标签页已经存在，则直接切换显示该标签页。  

```javascript
/*
* @ method $scope.tabset.addTabOuter(tab);
* @ param {object} tab 配置tab页的参数
* @ param {string} tab.index tab页的唯一索引
* @ param {string} tab.title tab页的标题
* @ param {boolen} tab.static tab页是否不可关闭，默认false可关闭
* @ param {string} tab.controller tab页的controller名称
* @ param {string} tab.content 模板路径
* @ param {object} tab.resolve 给tabcontroller注入的参数，类似 $uibModal 的resolve 
* @ param {function} tab.closeCallback 关闭tab页的调用的回调方法
* 
*/
$scope.tabset.addTabOuter({
             index: '1-1', 
             title: "标签页",
             static: false,
             controller: 'tab1Ctrl', 
             resolve: { 

             },
             content: "partials/business/tab1.html" //标签页模版
});
```

### 2.2 更新已经打开的标签页
调用 `$scope.tabset.updateTabOuter` 方法可刷新该标签页，若标签页不存在，则无效。
```javasctipt
var tab = {...}; //tab参数值和$scope.tabset.addTabOuter的参数值类似
$scope.tabset.updateTabOuter(tab);
```

### 2.3 关闭存在的标签页
```javascript
var tab = {index: '1'}; //只需传递要关闭的标签页的index索引
$scope.tabset.closeTabOuter(tab);
```