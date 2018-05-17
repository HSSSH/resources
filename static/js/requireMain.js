'use strict';

(function(win) {
    //配置baseUrl

    /*
     * 文件依赖
     */
    var config = {
        baseUrl: './',
        waitSeconds: 0,
        paths: {
            'jquery': 'js/jquery-3.2.1.min',
            'printw': 'js/jQuery.print.min',
            'polyfill': 'js/polyfill.min',
            'angular': 'js/angular.min',
            'angularAnimate': 'js/angular-animate.min',
            'angularSanitize': 'js/angular-sanitize.min',
            'angularFileUpload':'js/angular-file-upload.min',

            'angularUiRouter': 'js/angular-ui-router.min',
            'router': 'script/router',

            'bootstrap': 'js/bootstrap.min',
            'uiBootstrapTpls': 'js/ui-bootstrap-tpls.min',
            'jquery-ui': 'js/jquery-ui.min',

            'angularZhcsDirective': 'script/directive/zhcs.angular.directiveUtils-1.0.0',
            'angularZhcsService': 'script/service/zhcs.angular.serviceUtils-1.0.0',
            'wDatePicker': 'plugin/My97DatePicker/WdatePicker',
            'slimscroll': 'js/jquery.slimscroll',
            'ztree': 'plugin/ztree/js/jquery.ztree.all-3.5.min',
            'app': 'script/app',
            'appCtrl': 'script/controller/app.controller',
            'appService': 'script/service/app.service',
            'landInfoCtrl': 'script/controller/landInfo.controller',
            'projectInfoCtrl': 'script/controller/projectInfo.controller',
            'checkCtrl': 'script/controller/check.controller',
            'leaderCheckCtrl': 'script/controller/leaderCheck.controller',
            'paymentCtrl': 'script/controller/payment.controller',
            'basicDataCtrl': 'script/controller/basicDataManagement.controller',
            'deletionLogCtrl': 'script/controller/deletionLog.controller',
            'systemManagementCtrl': 'script/controller/systemManagement.controller',
            'countTableCtrl': 'script/controller/countTable.controller',

            //权限综合管理
            'authox':'plugin/authox/authox-ng',
            'sucHelpers': 'partials/authority/script/sucHelpers',
            'sysCtrl': 'partials/authority/script/sysController',
            'userCtrl': 'partials/authority/script/userController',
            'groupCtrl': 'partials/authority/script/groupController',
            'roleCtrl': 'partials/authority/script/roleController',
            'role2Ctrl': 'partials/authority/script/role2Controller'
        },
        shim: {

            'angular': {
                exports: 'angular',
                deps: ['jquery']
            },
            'angularAnimate': {
                deps: ['angular']
            },
            'angularSanitize': {
                deps: ['angular']
            },
           'wDatePicker': {
                deps: ['jquery']
            },
            'ztree': {
                deps: ['jquery']
            },
            'slimscroll': {
                deps: ['jquery']
            },

            'angularUiRouter': {
                deps: ['angular']
            },
            'authox': {
                deps: ['angular']   //依赖什么模块
            },
            'angularZhcsDirective': {
                deps: ['angular', 'wDatePicker', 'jquery', 'ztree', 'jquery-ui', 'slimscroll']
            },
            'bootstrap': {
                deps: ['jquery']
            },
            'uiBootstrapTpls': {
                deps: ['angular']
            },
            'jquery-ui': {
                deps: ['jquery']
            },
            'angularFileUpload':{
                deps: ['angular']
            }
        }
    };
    require.config(config);
    require(['jquery', 'angular', 'polyfill', 'app',  'router',  'appCtrl','appService','landInfoCtrl', 'projectInfoCtrl','checkCtrl','leaderCheckCtrl', 'paymentCtrl', 'basicDataCtrl',
        'deletionLogCtrl', 'systemManagementCtrl', 'countTableCtrl','sysCtrl','userCtrl','groupCtrl','roleCtrl','role2Ctrl'], function($, angular) {

        var str = '<script src="js/LodopFuncs.js"></script>' +
            '<object  id="LODOP_OB" classid="clsid:2105C259-1E0C-4534-8141-A753534CB4CA" width=0 height=0 style="position: absolute;">'+
            '<embed id="LODOP_EM" type="application/x-print-lodop" width=0 height=0 ></embed>'+
            '</object>';
        $('body[ng-controller="appCtrl"]').append(str);


        angular.bootstrap(document, ['app']); //动态方式启动angular
    });
})(window);
