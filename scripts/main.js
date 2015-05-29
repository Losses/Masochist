/**
 * Created by Don on 1/31/2015.
 */

var globalAngular = {};

angular.module('rM', ['ngRoute', 'ngAnimate']).

    config(['$controllerProvider', '$routeProvider',
        function ($controllerProvider, $routeProvider) {
            $routeProvider.
                when('/', {
                    templateUrl: 'partials/index.html',
                    controller: 'postCtrl'
                }).when('/login', {
                    templateUrl: 'partials/index.html',
                    controller: 'postCtrl'
                }).when('/register', {
                    templateUrl: 'partials/index.html',
                    controller: 'postCtrl'
                }).when('/register/:code', {
                    templateUrl: 'partials/index.html',
                    controller: 'postCtrl'
                }).
                when('/panel', {
                    templateUrl: 'partials/panel.html',
                    controller: 'panelCtrl'
                }).
                when('/panel/:ndAction', {
                    templateUrl: 'partials/panel.html',
                    controller: 'panelCtrl'
                }).
                when('/panel/:ndAction/:rdAction', {
                    templateUrl: 'partials/panel.html',
                    controller: 'panelCtrl'
                }).
                when('/panel/:ndAction/:rdAction/:thAction', {
                    templateUrl: 'partials/panel.html',
                    controller: 'panelCtrl'
                }).
                when('/panel/:ndAction/:rdAction/:thAction/:fiAction', {
                    templateUrl: 'partials/panel.html',
                    controller: 'panelCtrl'
                }).
                when('/:customCommand', {
                    templateUrl: 'partials/page.html',
                    controller: 'pageCtrl'
                }).
                otherwise({redirectTo: '/'})
        }]).

    controller('postCtrl', function ($location) {
        globalAngular.$location = $location;

        var currentPath = $location.path() /*nxt line*/
            , intro = $('#intro');

        function showForm(type) {
            var loginForm = $(type);

            intro.addClass('flow_up')
                .removeClass('flow_down');

            loginForm.addClass('flow_up')
                .removeClass('flow_down');
        }

        function hideForm(type) {
            var loginForm = $(type);

            loginForm.removeClass('flow_up paused')
                .addClass('flow_down');
        }

        var loginForm = $('#login_form');

        if (currentPath.match(/^\/login\/?/) !== null) {
            showForm('#login_form');
            hideForm('#register_form');
        }
        else if (currentPath.match(/^\/register\/?/) !== null) {
            showForm('#register_form');
            hideForm('#login_form');
        }
        else if (currentPath.match(/^\/?/) !== null) {
            intro.addClass('flow_down')
                .removeClass('flow_up');

            hideForm('#register_form');
            hideForm('#login_form');
        }
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
    controller('headerCtrl', function ($scope, $location) {
        $scope.getClass = function () {
            var currentPath = $location.path();

            var headerClass;
            if (currentPath.match(/^\/login|^\/register|^\/$/) !== null)
                headerClass = 'index';
            else if (currentPath.match(/^\/panel/) !== null)
                headerClass = 'panel';
            else
                headerClass = 'page';

            return headerClass;
        };
    }).
    controller('pageCtrl', function ($location, $scope, $http) {
        var location = $location.path().split('/')[1];

        $scope.pageContent = 'loading...';

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
                    $scope.pageContent = 'error, page not found'
                }
            }
        ).
            error(function () {
                $scope.pageContent = 'error, cant get the context.'
            });
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