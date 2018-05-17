define(['app'], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', 'leftMenu', function ($stateProvider, $urlRouterProvider, $httpProvider, leftMenu) {
        $urlRouterProvider.when("", "/landInfo").otherwise("/");
        provideState(leftMenu);
        function provideState(allState) {
            if (allState.length > 0) {
                angular.forEach(allState, function (each) {
                    $stateProvider
                        .state(each.state, {
                            url: each.url,
                            params: each.params,
                            templateUrl: each.templateUrl,
                            views: each.views
                        });
                    if (each.children) provideState(each.children);
                    else if(each.noRouteChildren) provideState(each.noRouteChildren);
                });
            }
        }
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        // Enables Request.IsAjaxRequest() in ASP.NET MVC
        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
        // Disable IE ajax request caching
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
        $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Wed, 21 Apr 2000 13:14:21 GMT';
        // $httpProvider.interceptors.push(['$q', '$window', function ($q, $window) {
        //     return {
        //         'request': function (config) {
        //             return config;
        //         },
        //
        //         'requestError': function (rejection) {
        //             if (canRecover(rejection)) {
        //                 return responseOrNewPromise
        //             }
        //             return $q.reject(rejection);
        //         },
        //
        //         'response': function (response) {
        //             return response;
        //         },
        //         'responseError': function (rejection) {
        //             if (rejection.status === 401) {
        //                 console.log('401');
        //                 $window.location.href = 'login?expired';
        //             }
        //             return $q.reject(rejection);
        //         }
        //     };
        // }]);
    }]);
});
