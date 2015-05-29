/**
 * Created by Don on 1/31/2015.
 */

var rM = {
    config: {                                                   //railgun-Masochist Angular部分配置选项
        indexRouteConfig: {                                     //首页路由统一配置
            templateUrl: 'partials/index.html',
            controller: 'postCtrl'
        },
        panelRouteConfig: {                                     //控制面板路由统一配置
            templateUrl: 'partials/panel.html',
            controller: 'panelCtrl'
        },
        pageRouteConfig: {                                       //自定义页面路由统一配置
            templateUrl: 'partials/page.html',
            controller: 'pageCtrl'
        }
    }
};

angular.module('rM', ['ngRoute', 'ngAnimate']).

    config(['$controllerProvider', '$routeProvider',
        function ($controllerProvider, $routeProvider) {
            $routeProvider.
                when('/', rM.config.indexRouteConfig).
                when('/login', rM.config.indexRouteConfig).
                when('/register', rM.config.indexRouteConfig).
                when('/register/:code', rM.config.indexRouteConfig).
                when('/panel', rM.config.panelRouteConfig).
                when('/panel/pay', rM.config.panelRouteConfig).
                when('/panel/help', rM.config.panelRouteConfig).
                when('/panel/:ndAction/:rdAction', rM.config.panelRouteConfig).
                when('/panel/:ndAction/:rdAction/:thAction', rM.config.panelRouteConfig).
                when('/panel/:ndAction/:rdAction/:thAction/:fiAction', rM.config.panelRouteConfig).
                when('/panel/:ndAction', rM.config.pageRouteConfig).
                when('/:customCommand', rM.config.pageRouteConfig).
                otherwise({redirectTo: '/'})
        }]).

    controller('postCtrl', function ($location) {
        //卖个萌
    }).
    controller('panelCtrl', function ($scope, $location, $http) {
        $scope.parseLocation = function () {
            return $location.path().split('/').splice(1)
        };

        $scope.checkLocation = function (locationTarget, position) {
            return $scope.parseLocation()[position] === locationTarget;
        };

        $scope.removeMd = function (text) {
            return text.split('.md')[0];
        };

        $scope.location = $scope.parseLocation();

        if ($scope.location[1] === 'help') {
            $scope.helpContent = 'loading';

            if ($scope.location[3] === undefined)
                $scope.helpContent = error;

            $http.get('dbs/guide/' + $scope.location[2] + '/' + $scope.location[3] + '.md').
                success(function (data) {
                    $scope.helpContent = markdown.toHTML(data);
                }).
                error(function () {
                    $scope.helpContent = 'not found!'
                });

            $http.get('dbs/guide/context.json').
                success(function (data) {
                    $scope.helpContext = data;
                }).
                error(function () {
                    console.log('error,cant get the context file!')
                })
        }
    }).
    controller('headerCtrl', function ($scope, $location, $routeParams) {
        function indexStatus() {
            var path = $location.path();
            if (path.match(/^\/login\/?/) !== null)
                $scope.indexStatus = 'login';
            else if (path.match(/^\/register\/?/) !== null)
                $scope.indexStatus = 'register';
            else if (path.match(/^\/?/) !== null)
                $scope.indexStatus = 'intro';

            if ($routeParams.code)
                $scope.promoCode = $routeParams.code;
            else
                $scope.promoCode = '';
        }

        $scope.getClass = function () {
            var currentPath = $location.path();

            var headerClass;
            if (currentPath.match(/^\/login|^\/register|^\/$/) !== null)
                headerClass = 'index';
            else if (currentPath.match(/^\/panel/) !== null)
                headerClass = 'panel';
            else
                headerClass = 'page';

            indexStatus();
            return headerClass;
        };

        $scope.cancelInput = function (event) {
            if (losses._STATUS_.loading)
                return false;

            $location.path('./#/');
            $scope.getClass();

            event.preventDefault();
        }
    }).
    controller('pageCtrl', function ($location, $scope, $http) {
        var location = $location.path().split('/')[1];
        $scope.pageContent = 'loading...';
        $scope.isPanel = (location === 'panel');

        if ($scope.isPanel) {
            $http.get('partials/panel/' + $location.path().split('/')[2] + '.html').
                success(function (data) {
                    $scope.pageContent = data;
                }).
                error(function () {
                    $scope.pageContent = 'error, cant get the page file.'
                })
        } else {
            $http.get('dbs/page/context.json').
                success(function (data) {
                    if (data[location]) {
                        var fileName = data[location].fileName;
                        $http.get('dbs/page/' + fileName).
                            success(function (fileContent) {
                                var parseType = data[location]['parse'] ? data[location]['parse'] : 'markdown';
                                $scope.pageContent = (parseType === 'markdown') ? markdown.toHTML(fileContent) : fileContent;
                            }).
                            error(function () {
                                $scope.pageContent = 'error, cant get the page file.'
                            })
                    } else {
                        $scope.pageContent = 'error, page not found.'
                    }
                }
            ).
                error(function () {
                    $scope.pageContent = 'error, cant get the context.'
                });
        }
    }).

    directive('paymentIcon', function () {
        return {
            restrict: 'E',
            require: '?ngModel',
            template: '<label>' +
            '<input class="payment-input" type="radio" name="payment" ng-model="model" value="{{value}}">' +
            '<i class="payment_wrapper" style="background:url(\'{{payIcon}}\') no-repeat center;"></i>' +
            '</label>',
            scope: {value: '@value', payIcon: '@payIcon', model: '='},
            replace: false
        };

    }).

    filter('trustHtml', function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    });

(function () {
    var body = $(document.body);
    var highlight = $(".highlight");
    var nav = $("header > nav");
    nav.find("li").mouseenter((function () {
        var timeoutId;

        return function () {
            var $this = $(this);

            if (timeoutId)
                clearTimeout(timeoutId);

            highlight.css("left", $this.position().left).width($this.width());

            if (body.hasClass("touch_screen")) {
                timeoutId = setTimeout(function () {
                    highlight.css("left", 1000);
                }, 500);
            }
        }
    })());
    nav.mouseleave(function () {
        if (!body.hasClass("touch_screen"))
            highlight.css("left", 1000);
    });

    $('#close').on('click', function () {
        $('#highlight').slideUp();
    });
})();