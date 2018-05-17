/*
 * @des js 打包配置
 * */
({
    baseUrl: './static',
    waitSeconds: 0,
    paths: {
            'jquery': 'js/jquery-3.2.1.min',
            'polyfill': 'js/polyfill.min', 
            'angular': 'js/angular.min',
            'angularAnimate': 'js/angular-animate',
            'angularSanitize': 'js/angular-sanitize.min',
              
             'angularUiRouter': 'js/angular-ui-router.min',
             'router': 'script/router',
        
            'bootstrap': 'js/bootstrap.min',
            'uiBootstrapTpls': 'js/ui-bootstrap-tpls.min',

            

        

            'angularCgsUtil': 'script/directive/angular-cgs-utils',
            'wDatePicker': 'plugin/My97DatePicker/WdatePicker',
            'slimscroll': 'js/jquery.slimscroll',
            'ztree': 'plugin/ztree/js/jquery.ztree.all-3.5.min',

            'app': 'script/app',  
            'appCtrl': 'script/controller/app.controller',
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
              
            'angularUiRouter': {
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
           
            'angularCgsUtil': {
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
            }
        }
    },
    //findNestedDependencies: true,
    optimize: "uglify", //压缩js
    name: 'js/requireMainBuild', //入口启动文件
    out: './resources/js/build.min.js' //打包后输出文件
});