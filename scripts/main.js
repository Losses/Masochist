/**
 * Created by Don on 1/31/2015.
 */

var a;

angular.module('rM', ['ngRoute', 'ngAnimate']).

    config(['$controllerProvider', '$routeProvider',
        function ($controllerProvider, $routeProvider) {
            $routeProvider.
                when('/', {
                    templateUrl: 'partials/index.html',
                    controller: 'postCtrl'
                }).
                when('/panel', {
                    templateUrl: 'partials/panel.html',
                    controller: 'panelCtrl'
                }).
                otherwise({redirectTo: '/'})
        }]).

    controller('postCtrl', function () {
        console.log('!');
    }).
    controller('panelCtrl', function ($scope) {
        //
    }).
    controller('headerCtrl', function ($scope, $location) {

        $scope.getClass = function () {
            var headerClass;
            switch ($location.path()) {
                case '/':
                    headerClass = 'index';
                    break;
                case '/panel':
                    headerClass = 'panel';
                    break;
            }
            return headerClass;
        };
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