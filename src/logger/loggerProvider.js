/**
 * Created by OmriK on 08/03/16.
 */

(function() {
    'use strict';

    angular
        .module('logger')
        .provider('logger', logger);

    /* @ngInject */
    function logger() {
        var debug = true,
            self = this,
            styles = 'background: #222; color: #bada55';


        this.setStyle = function(style) {
            styles = style;
            return this;
        };
        /**
         * @ngdoc method
         * @name $logProvider#debugEnabled
         * @description
         * @param {boolean=} flag enable or disable debug level messages
         * @returns {*} current value if used as getter or itself (chaining) if used as setter
         */
        this.debugEnabled = function(flag) {
            if (angular.isDefined(flag)) {
                debug = flag;
                return this;
            } else {
                return debug;
            }
        };

        this.$get = ['$window', function($window) {
            return {
                /**
                 * @ngdoc method
                 * @name $log#log
                 *
                 * @description
                 * Write a log message
                 */
                log: consoleLog('log'),

                /**
                 * @ngdoc method
                 * @name $log#info
                 *
                 * @description
                 * Write an information message
                 */
                info: consoleLog('info'),

                /**
                 * @ngdoc method
                 * @name $log#warn
                 *
                 * @description
                 * Write a warning message
                 */
                warn: consoleLog('warn'),

                /**
                 * @ngdoc method
                 * @name $log#error
                 *
                 * @description
                 * Write an error message
                 */
                error: consoleLog('error'),

                /**
                 * @ngdoc method
                 * @name $log#debug
                 *
                 * @description
                 * Write a debug message
                 */
                debug: (function() {
                    var fn = consoleLog('debug');

                    return function() {
                        if (debug) {
                            fn.apply(self, arguments);
                        }
                    };
                }())
            };


            function consoleLog(type) {
                var console = $window.console || {},
                    logFn = console[type] || console.log || noop,
                    hasApply = false;

                // Note: reading logFn.apply throws an error in IE11 in IE8 document mode.
                // The reason behind this is that console.log has type "object" in IE8...
                try {
                    hasApply = !!logFn.apply;
                } catch (e) {}

                if (hasApply) {
                    return function() {
                        var args = [];
                        angular.forEach(arguments, function(arg) {
                            args.push(arg);
                        });
                        args[0] = "%c " + args[0] + " %s"
                        args.splice(1,0, styles);
                        return logFn.apply(console, args);
                    };
                }

                // we are IE which either doesn't have window.console => this is noop and we do nothing,
                // or we are IE where console.log doesn't have apply so we log at least first 2 args
                return function(arg1, arg2) {
                    logFn(arg1, arg2 == null ? '' : arg2);
                };
            }
        }];
    }

})();



