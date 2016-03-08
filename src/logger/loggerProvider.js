/**
 * Created by OmriK on 08/03/16.
 */

(function() {
    //'use strict';

    angular
        .module('logger')
        .provider('logger', logger);

    /* @ngInject */
    function logger() {
        var debug = true,
            self = this,
            styles = 'background: #222; color: #8BC34A;',
            method_name;


        /**
         * @name loggerProvider#setStyle
         * @description
         * @param {String} string contain css rules.
         * @param {Boolean} Override default style.
         * @returns {*} current value if used as getter or itself (chaining) if used as setter
         */

        this.setStyle = function(style, override) {
            styles = (override) ? style : styles + style;
            return this;
        };
        /**
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

        this.$get = ['$window', '$location', function($window, $location) {
            return {
                /**
                 * @name logger#log
                 *
                 * @description
                 * Write a log message
                 */
                log: (function() {
                    var fn = consoleLog('log');

                    return function() {
                        if (_isEnabled()) {
                            fn.apply(self, arguments);
                        }
                    };
                }()),

                /**
                 * @name logger#info
                 *
                 * @description
                 * Write an information message
                 */
                info: (function() {
                    var fn = consoleLog('info');

                    return function() {
                        if (_isEnabled()) {
                            fn.apply(self, arguments);
                        }
                    };
                }()),

                /**
                 * @name logger#warn
                 *
                 * @description
                 * Write a warning message
                 */
                warn: consoleLog('warn'),

                /**
                 * @name logger#error
                 *
                 * @description
                 * Write an error message
                 */
                error: consoleLog('error'),

                /**
                 * @name logger#debug
                 *
                 * @description
                 * Write a debug message
                 */
                debug: (function() {
                    var fn = consoleLog('debug');

                    return function() {
                        if (_isEnabled()) {
                            fn.apply(self, arguments);
                        }
                    };
                }())
            };

            /**
             * @name logger#debug
             *
             * @description
             * Write a debug message
             */

            function _isEnabled() {
                var queryParam = $location.search() || {};
                return ('debugEnabled' in queryParam) || debug;
                //if ('debugEnabled' in queryParam) {
                //    return true;
                //}
            }



            function _addPrefix(arguments) {
                if (method_name.length > 0) {
                    arguments[0] = method_name + ': ' + arguments[0];
                }
                arguments[0] = "%c " + arguments[0];
                return arguments;
            }



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
                        method_name = arguments.callee.caller.name || '';
                        angular.forEach(arguments, function(arg) {
                            args.push(arg);
                        });

                        args.splice(1,0, styles);
                        args = _addPrefix(args);
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



