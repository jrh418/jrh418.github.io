angular.module("blt_config", [])
.constant("config", {"defaultLogLevel":"debug","debug":true,"html5mode":false})
.constant("breakpoints", {"sm":0,"md":600,"lg":900,"xl":1200,"xxl":1800});

angular.module("blt_appProfile", [])
.constant("data", {"protocol":"wamp","retryMax":1,"retryDelay":100})
.constant("auth", {"authService":"DevAuthService"})
.constant("servers", {"wamp":{"url":"ws://localhost:8080","realm":"wamp_realm"}})
.constant("database", {"name":"EXAMPLE_DB","version":"1.0","createFromLocation":1});

angular.module("blt_dataRoutes", [])
.constant("routes", {});

angular.module("blt_appViews", [])
.constant("views", []);

(function() {
  'use strict';

  /**
   * @name ngBoltJS
   * @description This is the root module for ngBoltJS. It loads the core
   * module, configuration modules, and optional component modules. The
   * optional configuration modules are added to the ngBoltJS module
   * in the javascript.js gulp task during the gulp build.
   */
  angular.module('ngBolt', ["blt_core","blt_auth","blt_checkboxradio","blt_classificationbar","blt_counter","blt_datepicker","blt_fileloader","blt_login","blt_modal","blt_notifications","blt_panel","blt_dropdown","blt_textfield","blt_toggleswitch","blt_view","blt_data"])
    .config(configFn)
    .run(run);

  /**
   * @function configFn
   * @description Sets configurations to the ngBoltJS module
   * @param {Object} $animateProvider The AngularJs [ngAnimate provider](https://docs.angularjs.org/api/ng/provider/$animateProvider)
   */
  function configFn( $animateProvider ) {
    // use 'blt-animate' class name on elements to animate with ngAnimate.
    $animateProvider.classNameFilter(/blt-animate/);
  }

  configFn.$inject = ['$animateProvider'];

  function run( BltApi ) {
    BltApi.debug('ngBoltJS: running.');
  }

  run.$inject = ["BltApi"];
})();

/**
 * @ngdoc module
 * @name blt_core
 * @sortorder 1
 * @description Contains core functionality and components for ngBoltJS
 *
 * @requires https://docs.angularjs.org/api/ng/service/$animate
 * @requires https://github.com/sparkalow/angular-truncate
 * @requires bltAppProfile
 */
(function() {
  'use strict';

  angular.module('blt_core', [
    // Configuration modules
    'blt_config',
    'blt_dataRoutes',
    'blt_appProfile',
    'blt_appViews',

    // Angular modules
    'ngAnimate',

    // 3rd-party modules
    'truncate'
  ])
    .run(run);

  function run( BltApi ) {
    BltApi.debug('blt_core: running.');
  }

  run.$inject = ["BltApi"];
})();
(function() {
  'use strict';

  angular.module('blt_core')
    .factory('BltApi', BltApi);

  BltApi.$inject = ['$window', 'config', '$location'];

  /**
   * @ngdoc service
   * @name BltApi
   * @module blt_core
   *
   * @description
   * Application-wide API for communicating between components and providing helper functions.
   *
   * @requires https://docs.angularjs.org/api/ng/service/$window
   * @requires https://docs.angularjs.org/api/ng/service/$location
   * @requires blt_config
   */
  function BltApi( $window, config, $location ) {

    var subscriptions = {};
    var logLevels = ['trace', 'debug', 'info', 'warn', 'error'];
    var currentLogLevel;
    var registered = {};

    var factory = {};

    factory.subscribe = subscribe;
    factory.unsubscribe = unsubscribe;
    factory.publish = publish;
    factory.switchViews = switchViews;
    factory.getCurrentView = getCurrentView;
    factory.uuid = uuid;

    factory.trace = angular.noop;
    factory.log = angular.noop;
    factory.debug = angular.noop;
    factory.info = angular.noop;
    factory.warn = angular.noop;
    factory.error = angular.noop;

    factory.setLogLevel = setLogLevel;
    factory.getLogLevel = getLogLevel;
    factory.clearLogLevel = clearLogLevel;

    factory.getMillisFromEpoch = getMillisFromEpoch;
    factory.convertToId = convertToId;
    factory.register = register;
    factory.unregister = unregister;

    init();

    return factory;

    //// PUBLIC API ///////////////////////////////////////////////////////////

    /**
     * @ngdoc method
     * @name BltApi#subscribe
     *
     * @summary Registers callbacks to a message
     *
     * @description
     * The subscribe method registers messages to trigger a function when the subscription is called. This is useful
     * when needing to set up lines of communication between controllers and directives, or when needing to complete
     * some function upon completion of an asynchronous function. Subscriptions should be made in the activate method
     * of a controller's function.
     *
     * <div class="note-info">
     * **Note** Subscription callback methods are not watched by Angular, therefore any changes to the model must be
     * wrapped in a $timeout so that they are digested by Angular and the view is updated.
     * </div>
     *
     * @param {String} name The name of the subscription. You can subscribe more than one callback to the same name.
     * If the subscription is made in a controller, the name should reflect the 
     * [controllerAs](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#controlleras-controller-syntax)
     * name of the controller (e.g. `name: 'main'` for controller 'MainController').
     *
     * @param {Function} callback The function for handling the published message.
     *
     * @example
     * <example name="subscribe">
     *   <javascript>
     *     angular.module('bltDocs')
     *       .controller('MyController', MyController)
     *     ;
     *     MyController.$inject = ['BltApi', '$timeout'];
     *     function MyController(bltApi, $timeout){
     *        var ctrl = this;
     *
     *        // Define controller methods and properties
     *        activate();
     *        function activate(){
     *            bltApi.subscribe('MyCtrl', function(msg){
     *
     *              // Handle simple string msg
     *              if( msg == 'new item'){
     *                  // Must use timeout so Angular digests changes to the model.
     *                  $timeout(function(){
     *                      ctrl.currentItem = {};
     *                      ctrl.createNewItem();
     *                  });
     *
     *              // Handle more complex message
     *              } else if( msg.action == 'edit item'){
     *                  $timeout(function(){
     *                      ctrl.currentItem = msg.data;
     *                      ctrl.editItem();
     *                  });
     *              }
     *          };
     *        }
     *     }
     *   </javascript>
     * </example>
     *
     */
    function subscribe( name, callback ) {

      // Save subscription if it doesn't already exist
      if ( !subscriptions[name] ) {
        subscriptions[name] = [];
      }

      // Add callback to subscription
      subscriptions[name].push(callback);

      factory.debug('Subscribed: ', name);
    }

    /**
     * @ngdoc method
     * @name BltApi#unsubscribe
     *
     * @summary Removes callbacks registered to a message.
     *
     * @description
     * The unsubscribe method removes all subscriptions of the provided name. When the scope of a controller or
     * directive is destroyed, it is considered best practice to unsubscribe any subscriptions made in that controller
     * or directive. They will be re-subscribed when they are added back to the scope.
     *
     * <div class="note-warning">
     * **Warning** The unsubscribe method will delete all subscriptions registered to a particular name regardless if
     * that subscription was made from the controller or directive being destroyed. To prevent the unwanted deletion of
     * subscriptions made to the same name but from a different controller/directive, use unique names on subscriptions
     * made from different controllers or directives.
     * </div>
     *
     * @param {String} name The name of the {@link BltApi#subscribe subscription} you wish to delete.
     * @param {Function} [callback] An optional callback function to run after the subscription has been deleted.
     *
     * @example
     * <example name="unsubscribe">
     *   <javascript>
     *     angular.module('bltDocs')
     *       .controller('MyController', MyController)
     *     ;
     *     MyController.$inject = ['BltApi', '$timeout', '$scope'];
     *     function MyController(bltApi, $timeout, $scope){
     *         var ctrl = this;
     *         // Define controller methods and properties
     *         activate();
     *         function activate(){
     *             // set up a subscription
     *             bltApi.subscribe('MyCtrl', function(msg){
     *                 if( msg == 'new item' ){
     *                     $timeout(function(){
     *                         ctrl.createNewItem();
     *                     });
     *                 }
     *             };
     *             // Listen to the scopes $destroy event to run clean up functions
     *             $scope.$on('$destroy', destroy);
     *         }
     *         function destroy(){
     *             // Unsubscribe subscriptions set up in activate function and run a callback function.
     *             bltApi.unsubscribe('MyCtrl', function(){
     *                 console.log("successfully unsubscribed all subscriptions to 'MyCtrl'.");
     *             });
     *             // Delete the ctrl object ('MyCtrl' would be what was set using controllerAs in the HTML template).
     *             delete $scope.MyCtrl;
     *         }
     *     }
     *   </javascript>
     * </example>
     *
     *
     */
    function unsubscribe( name, callback ) {
      if ( subscriptions[name] !== undefined ) {
        delete subscriptions[name];
      }

      factory.debug('Unsubscribed: ' + name);

      if ( typeof callback === 'function' ) {
        callback.call(this);
      }
    }

    /**
     * @ngdoc method
     * @name BltApi#publish
     *
     * @summary Publishes a message.
     *
     * @description The publish method provides a built-in ability to interact with ngBoltJS components from within a
     * controller or custom directive as well as send custom messages between ngBoltJS application modules.
     *
     * @param {String} name The name of the subscription you are publishing too. If opening a modal or panel,
     * this will be the id of the modal or panel, otherwise it will be the name you passed to
     * {@link BltApi#subscribe BltApi.subscribe}.
     *
     * @param {String|Object} msg A string or object to be passed to the callback of the subscription you are publishing to. If opening a modal or panel, `msg` will be 'open'. Likewise, if closing a panel or modal, it will be 'close'. If publishing to a custom subscription, this will be the string or object you expect to handle.
     *
     * @example
     * <example name="publish">
     *   <javascript>
     *     angular.module('bltDocs')
     *       .controller('MyController', MyController)
     *     ;
     *     MyController.$inject = ['BltApi', '$timeout'];
     *     function MyController(bltApi, $timeout){
     *       var ctrl = this;
     *       // Define controller methods and properties and activate
     *       publishExample(){
     *         // Open a modal with id of 'myModal'
     *         bltApi.publish('myModal', 'open');
     *         // Close a panel with id of 'myPanel'
     *         bltApi.publish('myPanel', 'close');
     *         // Publish a message to a custom subscription (see BltApi.subscribe below)
     *         var msg = {
     *           action: 'edit item',
     *           data: {...}
     *         }
     *         bltApi.publish('MyCtrl', msg);
     *       }
     *     }
     *   </javascript>
     * </example>
     *
     */
    function publish( name, msg ) {

      // Save the subscription as an empty array if it was not previously saved
      if ( !subscriptions[name] ) {
        subscriptions[name] = [];
      }

      // Send message in a callback
      subscriptions[name].forEach(function( cb ) {
        cb(msg);
      });

      factory.debug('Published: ' + name + '\n', msg);
    }

    /**
     * @ngdoc method
     * @name BltApi#switchViews
     *
     * @summary Updates $location.path() and/or $location.searchParams().
     *
     * @description
     * Updates $location with the provided path and searchParmas. If only `path` is provided,
     * [$location.path()](https://docs.angularjs.org/api/ng/service/$location) will be called, if `searchParams` are
     * included, [$location.url()](https://docs.angularjs.org/api/ng/service/$location) is called. If `searchParams` is
     * an emtpy object, any search parameters on the current url will be removed.
     *
     * <div class="note-info">
     * **NOTE** If the current URL has search parameters but only `path` is passed as a parameter, only the path will
     * change and the search parameters will still be applied to the URL. This can be useful when switching views when
     * filtering by some value(s).
     * </div>
     *
     * See {@link blt_appViews} for more information on defining views.
     *
     * @param {string} path The path of the view you want to open.
     * @param {object} [searchParams] Search parameters to append to the supplied path. If the object is empty, search parameters will be removed.
     *
     * @example <caption>Change view</caption>
     * <example name="switchViews1">
     *   <javascript>
     *     // Will change url to: http://example.com/some/path
     *     bltApi.switchViews('/some/path');
     *   </javascript>
     * </example>
     *
     *
     * @example <caption>Change view with search parameters</caption>
     * <example name="switchViews2">
     *   <javascript>
     *     // Will change url to: http://example.com/some/path?foo=value1&bar=value2
     *     bltApi.switchViews('/some/path', {foo: 'value1': bar: 'value2'});
     *   </javascript>
     * </example>
     *
     * @example <caption>Change view and clear search parameters</caption>
     * <example name="switchViews3">
     *   <javascript>
     *     // Given the URL: http://example.com/some/path?foo=value1&bar=value2
     *     // Will change the URL to: http://example.com/some/other/path
     *     bltApi.switchViews('some/other/path', {});
     *   </javascript>
     * </example>
     *
     * @example <caption>Change view and don't reset search parameters</caption>
     * <example name="switchViews4">
     *   <javascript>
     *     // Given the URL: http://example.com/some/path?foo=value1&bar=value2
     *     // Will change the URL to: http://example.com/some/other/path?foo=value1&bar=value2
     *     bltApi.switchViews('some/other/path');
     *   </javascript>
     * </example>
     *
     * @example <caption>Stay on current view, but reset search parameters</caption>
     * <example name="switchViews5">
     *   <javascript>
     *      // Given the URL: http://example.com/some/path?foo=value1&bar=value2
     *      // Will change the URL to: http://example.com/some/path
     *      bltApi.switchViews(null, {});
     *   </javascript>
     * </example>
     *
     */
    function switchViews( path, searchParams ) {
      if ( path === null ) {
        // Reset search parameters
        if ( searchParams && Object.keys(searchParams).length == 0 ) {
          $location.url($location.path());
          // Add or update search parameters.
        } else if ( searchParams ) {
          $location.search = searchParams
        }
      } else {
        // Switch views and reset search parameters
        if ( searchParams && Object.keys(searchParams).length == 0 ) {
          try {
            $location.url(path);
          } catch( e ) {
            factory.error('There was error trying to switch views. See localhost:9001/core.BltApi.html on how to switch views.', e);
          }
          // Switch views and add/update search parameters.
        } else if ( searchParams ) {
          try {
            $location.path(path).search(searchParams);
          } catch( e ) {
            factory.error('There was error trying to switch views. See localhost:9001/core.BltApi.html on how to switch views.', e);
          }

          // Switch views and do nothing with search parameters.
        } else {
          try {
            $location.path(path);
          } catch( e ) {
            factory.error('There was error trying to switch views. See localhost:9001/core.BltApi.html on how to switch views.', e);
          }
        }
      }

    }

    /**
     * @ngdoc method
     * @name BltApi#getCurrentView
     *
     * @summary Gets the current view information.
     *
     * @description
     * Returns the url information of the current view. Returns the absolute url if no getter is set.
     *
     * @param {string} [getter] Getter method to call from Angular's [$location](https://docs.angularjs.org/api/ng/service/$location) service.
     *
     * @returns {string} The result of the called getter method.
     */
    function getCurrentView( getter ) {
      getter = getter || 'absUrl'
      return $location[getter]();
    }

    /**
     * @ngdoc method
     * @name BltApi#uuid
     *
     * @summary Gets a UUID.
     *
     * @description Generates and returns a [Version 4 universally unique identifier](https://en.wikipedia.org/wiki/Universally_unique_identifier) conforming to [RFC 4122](https://tools.ietf.org/html/rfc4122).
     *
     * @returns {string} Generated UUID
     */
    function uuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function( c ) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    /**
     * @ngdoc method
     * @name BltApi#setLogLevel
     *
     * @summary Sets application-wide console logging level.
     *
     * @description
     * Sets the application-wide log level, affecting the logs that are printed to the console when invoking any of the
     * following BltApi logging functions: `trace`, `debug`, `info`, `warn` and `error`. The levels are listed in
     * order of precedence from lowest to highest. When the log level is set, the log levels that are enabled include
     * that specific level and any level of higher precedence. If you set the level to 'info', the levels enabled will
     * be `info`, `warn` and `debug`.
     *
     * <div class="note-info">
     * **Note** The log level set does NOT affect the BltApi `log` function. That function will log to the console
     * regardless of the log level assigned.
     * </div>
     *
     * <div class="note-info">
     * **Note** The log level that is assigned will remain in affect until the user clears it via the
     * {@link BltApi#clearLogLevel} method. This will persist across browser and user sessions.
     * </div>
     *
     * @param {number} level The log level to assign.
     *
     * @returns {boolean} Whether or not the given log level was successfully applied.
     */
    function setLogLevel( level ) {
      if ( assignLogLevel(level) ) {
        $window.localStorage.setItem('loglevel', level);
        return true;
      }
      return false;
    }

    /**
     * @ngdoc method
     * @name BltApi#clearLogLevel
     *
     * @summary Resets the current console logging level.
     *
     * @description Clears the saved log level and re-assigns the default log level.
     */
    function clearLogLevel() {
      $window.localStorage.removeItem('loglevel');
      loadInitialLogLevel();
    }

    /**
     * @ngdoc method
     * @name BltApi#getLogLevel
     *
     * @summary Returns the current log level.
     *
     * @description Returns the current log level.
     *
     * @returns {string} The current log level.
     */
    function getLogLevel() {
      return currentLogLevel;
    }

    /**
     * @ngdoc method
     * @name BltApi#getMillisFromEpoch
     *
     * @summary Converts date to milliseconds from epoch.
     *
     * @description
     * Attempts to convert the given date parameter to milliseconds from epoch. Acceptable formats include:
     *    * `number` - will be interpreted as ms from epoch.
     *    * `string` - will attempt to interpret as a formatted string, or a string containing ms from epoch if that
     * fails
     *    * `date` - will be converted to ms from epoch using `date.getTime()`
     *    * `function` - will convert the output of the given date function to ms from epoch.
     *    * `null` - if no parameter is provided, will return current ms from epoch. `new Date().getTime()`
     *
     * @param {Object|Number|String|Function} [date] The date or date-like object to convert to ms from epoch.
     *
     * @returns {number} Milliseconds from epoch.
     */
    function getMillisFromEpoch( date ) {
      if ( angular.isUndefined(date) ) {
        return new Date().getTime();
      } else if ( angular.isDate(date) ) {
        return date.getTime();
      } else if ( angular.isNumber(date) ) {
        if ( isFinite(date) ) {
          return new Date(date).getTime();
        } else {
          factory.warn("Could not convert given number to ms from epoch: %s", date);
        }
      } else if ( angular.isString(date) ) {
        if ( isNaN(date) ) {
          try {
            return new Date(date).getTime();
          } catch( error ) {
            factory.warn("Could not convert given string to ms from epoch: %s", date);
          }
        } else {
          return new Date(parseInt(date)).getTime();
        }
      } else if ( angular.isFunction(date) ) {
        return getMillisFromEpoch(date());
      } else {
        factory.warn("Could not convert given date to ms from epoch: %s", angular.toJson(date));
      }
      return undefined;
    }

    /**
     * @ngdoc method
     * @name BltApi#convertToId
     *
     * @summary Converts string to lowercase delimited string.
     *
     * @description Generates an id as a delimited string.
     *
     * @param  {string} Text string to convert to id.
     * @param  {string} Delimeter The character to use as a delimeter.
     * @return {string} The generated id.
     */
    function convertToId( text, delimeter ) {
      if ( delimeter === undefined ) {
        delimeter = '-';
      }

      var re = new RegExp('[^a-z0-9\\' + delimeter + ']', 'gmi');
      return text.toLowerCase().replace(/ /g, delimeter).replace(re, "");
    }

    /**
     * @ngdoc method
     * @name BltApi#register
     *
     * @summary Adds component to global space.
     *
     * @description Register an angular controller, service, or factory as a global object on the window. Will only
     * succeed if the {@link blt_config config debug setting} is set to true.
     *
     * @param  {obj} obj  The object to register to the global window object.
     * @param  {string} name The name to use as the key on the window object.
     */
    function register( obj, name ) {
      if ( config.debug ) {
        if ( name === null || name === undefined ) {
          console.warn('[name] was undefined or null. %s was not registered.', obj);
        } else {
          window[name] = obj;
          registered[name] = obj;
        }
      }
    }

    /**
     * @ngdoc method
     * @name BltApi#unregister
     *
     * @summary Removes component from global space.
     *
     * @description Removes the Angular controller, service, or factory from the window if anything
     * was registered by that the given name.
     *
     * @param  {string} name The name that was used as the key on the window object.
     */
    function unregister( name ) {
      if ( config.debug ) {
        if ( name === null || name === undefined ) {
          console.warn('[name] was undefined or null. Nothing was unregistered.');
        } else if ( registered.hasOwnProperty(name) ) {
          delete registered[name];
          delete window[name];
        } else {
          console.warn('[name] was not previously registered through the BltApi. You can only unregister global objects' +
            'that were registered view the BltApi#register function. Nothing was unregistered.');
        }
      }
    }

    //// Private API //////////////////////////////////////////////////////////

    /**
     * @private
     * @function init
     * @description Initializes BltApi by disabling logging if debug is false, setting the log level and registering the api to the window global object.
     */
    function init() {
      if ( config.debug === false ) {
        disableLogging();
      }

      loadInitialLogLevel();

      register(factory, 'api');
    }

    /**
     * @private
     * @function assignLogLevel
     * @description If the given log level is one of our assignable log levels, assigns that level to the log system.
     *
     * @param level - The level to set.
     *
     * @returns {boolean} Whether or not the given log level was assigned successfully to the system.
     */
    function assignLogLevel( level ) {
      var idx = logLevels.indexOf(level);
      if ( idx >= 0 ) {
        if ( level != currentLogLevel ) {
          currentLogLevel = level;
          factory.trace = idx == 0 ? console.trace ? console.trace.bind(console) : console.debug.bind(console) : angular.noop;
          factory.debug = idx <= 1 ? console.debug.bind(console) : angular.noop;
          factory.log = idx <= 1 ? console.log.bind(console) : angular.noop;
          factory.info = idx <= 2 ? console.info.bind(console) : angular.noop;
          factory.warn = idx <= 3 ? console.warn.bind(console) : angular.noop;
          factory.error = idx <= 4 ? console.error.bind(console) : angular.noop;
        }
        return true;
      } else {
        console.warn("Invalid log level: %s. Valid levels are: %s", level, angular.toJson(logLevels));
        return false;
      }
    }

    /**
     * @private
     * @function loadInitialLogLevel
     * @description Loads the log level from either localStorage if it exists there, or from the {@link blt_config} module.
     */
    function loadInitialLogLevel() {
      var initialLogLevel = $window.localStorage.getItem('loglevel');
      if ( !initialLogLevel ) {
        initialLogLevel = config.defaultLogLevel;
        console.info("Loading default log level from profile: %s", initialLogLevel);
      } else {
        console.info("Loading previously assigned log level: %s", initialLogLevel);
      }
      assignLogLevel(initialLogLevel);
    }

    /**
     * @private
     * @function disableLogging
     * @description Disables all logging when the profile debug setting is set to false. This is best practice for production builds
     * to prevent unwanted data from being accessible from the developer tools console.
     */
    function disableLogging() {
      console.warn('Logging disabled because config.debug was false.');

      console.log(console);
      console.log = angular.noop;
      console.trace = angular.noop;
      console.debug = angular.noop;
      console.info = angular.noop;
      console.warn = angular.noop;
      console.error = angular.noop;
    }
  }
})();

/**
 * @ngdoc module
 * @name blt_appProfile
 * @module blt_appProfile
 * @since 1.0.0
 * @sortorder 2
 *
 * @description
 * Application profiles define settings for the {@link BltData Data API} and
 * {@link BltAuth Auth API} as well provide a mechanism for overriding global
 * build settings. Multiple profiles may be defined for an application and are
 * placed in the `config/profiles` directory in the project root. For example,
 * your application can have a `development` profile that defines a different
 * data and authentication settings than is used in a `production` environment.
 *
 * <div class="note-tip">
 * **Tip** Profiles are read by the Gulp build process and incorporated into
 * your application as an angular module, so there is no need to distribute
 * them with your application.
 * </div>
 *
 * ## Creating Profiles
 *
 * You can create a profile by adding a uniquely named JSON file in the profiles
 * directory. If you are using the ngBoltJS Boilerplate template, you will notice
 * that one named `development` has been provided.
 *
 * A profile is composed of five sections:
 *  * [data](#data)
 *  * [auth](#auth)
 *  * [servers](#servers)
 *  * [database](#database)
 *  * [build](#build) (optional)
 *
 * ## Accessing Profile Data
 *
 * You can access profile data from within your app by injecting the `blt_appProfile` module into your module, or by
 * accessing the `blt_appProfile` module directly using the angular injector interface. The following examples show
 * equivalent code to access the `auth` attribute of the profile configuration.
 *
 * ```javascript
 * angular.module('myModule', ['blt_appProfile'])
 *   .controller('MyController', MyController)
 * ;
 *
 * MyController.$inject = ['auth'];
 *
 * function MyController(auth) {
 *   ...
 * }
 * ```
 *
 * ```javascript
 * var $profile = angular.injector(['blt_appProfile']);
 * var auth = $profile.get('auth');
 * ```
 *
 * ### Data
 *
 * The data section of a configuration profile defines the data source and
 * reconnection parameters of the data service.
 *
 * | Property | Type | Description |
 * | -------- | ---- | ----------- |
 * | `protocol` | string | This property defines which supported data source the data service will use to make requests. Allowed values are: `rest`, `wamp`, and `sqlite`. Any other values will result in a configuration error, rendering the data service inoperable. |
 * | `retryMax` | integer | Controls how many times the data service will retry when attempting to connect to a data source. Setting the property to any negative value will cause the data service to retry connecting indefinitely. |
 * | `retryDelay` | integer | Controls how long, in milliseconds, the data service will wait between retry attempts. The value supplied must be an integer equal to or greater than zero. Any other values may result in undefined behavior. |
 *
 * ### Auth
 *
 * The auth object of a profile defines the authentication service and settings
 * for the {@link BltAuth Auth API}.
 *
 * | Property | Type | Description |
 * | -------- | ---- | ----------- |
 * | `authService` | string | The name of the angular service to use for authetication. E.g. `DevAuthService` |
 * | `wampAuthMethod` | string | (Optional) Required when using the `WampAuthService`. Allowed values are: `ticket` and `wampcra` |
 * | `authKey` | string | (Optional) A key to pass the authetication service when not using a user login form |
 * | `authSecret` | string | (Optional) A secret to pass the authentication service when not using a user login form |
 *
 * ### Servers
 *
 * The servers section of a configuration profile defines the non-database remote
 * data sources of the data service. Currently, we only support WAMP.
 *
 * | Property | Type | Description |
 * | -------- | ---- | ----------- |
 * | `wamp` | object | The WAMP server configuration object |
 * | `wamp.url` | string | Defines the address of the remote WAMP server to which the data service will attempt to connect. E.g. `ws://some.wamp.server/` |
 * | `wamp.realm` | string | Defines the realm to which the data service should join. E.g. `some_realm` |
 *
 * ### Database
 *
 * The database configuration section defines both the SQLite and Web SQL data
 * sources.
 *
 * | Property | Type | Description |
 * | -------- | ---- | ----------- |
 * | `name` | string | Defines the name of the database to which the data service will attempt to connect. E.g. `MY_DATABASE` |
 * | `version` | string | TODO: add description |
 * | `createFromLocation` | integer | TODO: add description |
 *
 * ### Build
 *
 * The build configuration sections allows you to override global build settings
 * for a particular profile. For example, in a production profile, you may wish
 * to minify all of the generated assets. To do so, you would set the `minify`
 * property to `true`.
 *
 * For full list of build properties, see {@link blt_config}.
 *
 * ## Example
 <caption><code>development.json</code></caption>
 ```json
 {
   "data": {
     "protocol": "wamp",
     "retryMax": 1,
     "retryDelay": 100
   },
   "auth": {
     "authService": "DevAuthService"
   },
   "servers": {
     "wamp": {
       "url": "ws://localhost:8080",
       "realm": "wamp_realm"
     }
   },
   "database": {
     "name": "EXAMPLE_DB",
     "version": "1.0",
     "createFromLocation": 1
   },
   "build": {
     "generateBoltDocs": false,
     "docsLogLevel" : "warn"
   }
 }
 ```
 *
 */
/**
 * @ngdoc module
 * @name blt_appViews
 * @module blt_appViews
 * @sortorder 3
 *
 * @description
 * * [Overview](#overview)
 * * [Defining Views](#defining-views)
 * * [Html5Mode](#html5mode)
 *
 * ----------------------------------------------------------------------------
 *
 * ## Overview
 *
 * The views module is automatically generated from the `views.json` configuration
 * file during the application build process. The views are added to the Angular
 * [$routeProvider](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider)
 * during run-time. Angular will use these views to load html partials into your
 * application based on the current path of the URL. For more information on how
 * Angular handles view routing, see [ngRoute](https://docs.angularjs.org/api/ngRoute).
 *
 * ----------------------------------------------------------------------------
 *
 * ## Defining Views
 *
 * You define views by adding them to the `views` array in the `views.json` configuration
 * file. Each view object has three properties:
 *
 * | Property | Type | Description |
 * |----------|------|-------------|
 * | `path`   | string | Path parameter passed to [$routeProvider#when](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider) |
 * | `route`  | object | Route parameter passed to [$routeProvider#when](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider) |
 * | `animation` | string | (Optional) Animation to use when entering and leaving. Valid values are: `fade` and `slide`. |
 *
 * ### Example View Definition
 *
 * ```json
 *  "views": [
 *    {
 *      "path": "/forms",
 *      "route": {
 *         "templateUrl": "partials/forms/forms.template.html",
 *         "controller": "FormsController",
 *         "controllerAs": "ctrl"
 *      },
 *      "animation": "fade"
 *    }
 *  ]
 * ```
 *
 * <div class="note-info">
 * **Note** ngBoltJS does not currently support $routeProvider#otherwise.
 * </div>
 *
 * ----------------------------------------------------------------------------
 *
 * ## Html5Mode
 *
 * To use Angular's [$location](https://docs.angularjs.org/guide/$location) service
 * HTML5 mode you need to set the `html5mode` property in your {@link blt_config build configuration}
 * file to `true` as well as set a value for `baseUrl`.
 *
 * ### html5mode in production
 *
 * The ngBoltJS development server provides HTML5 history API functionality so refreshing will work
 * in `html5mode`. However, in production, you will need to add a configuration file or middleware
 * to redirect all requests to `index.html`.
 *
 * For example, when hosted on apache servers, you can include a `.htaccess` file at the application
 * root.
 *
 * ```
 * RewriteEngine on
 * RewriteCond %{REQUEST_FILENAME} -s [OR]
 * RewriteCond %{REQUEST_FILENAME} -l [OR]
 * RewriteCond %{REQUEST_FILENAME} -d
 * RewriteRule ^.*$ - [NC,L]
 *
 * RewriteRule ^(.*) /index.html [NC,L]
 * ```
 */
/**
 * @ngdoc module
 * @name blt_config
 * @module blt_config
 * @sortorder 2
 *
 * @description
 * The `blt_config` module is generated automatically during the application gulp
 * build from the `build.json` config file and injected into ngBoltJS's core module.
 * These settings define ngBoltJS's configuration and are accessible in your
 * application from the `config` constant.
 *
 * The properties in the `build.json` file can be overriden by matching properties
 * in a `build` object in your {@link blt_appProfile application's profile}.
 * Because you can have multiple profiles, you can have different configurations
 * for each profile. This is useful when wanting to override development settings
 * when deploying to a production environment.
 *
 * The properties exposed in the build configuration are listed below.
 *
 * ## Properties
 *
 * | Property | Default | Description |
 * |----------|---------|-------------|
 * | appSrc | `ng-bolt-app` | The file path of the root directory of your application's source code. |
 * | port | `9000` | The port number on your app's local dev server. |
 * | docsPort | `9001` | The port number on the documentation app's local dev server. |
 * | debug | `true` | Toggle console logging. |
 * | defaultLogLevel | `debug` | The default logging level (`trace`, `debug`, `info`, `warn`, `error`). Log message below the set level will be turned off. E.g. if the level is 'warn' only `console.warn` and `console.error` messages will be displayed. |
 * | generateBoltDocs | `true` | Generate ngBoltJS documentation during a build. |
 * | generateAppDocs | `true` | Generate your application's documentation during a build. |
 * | buildDest | `build` | The file path to place all generated app files during a gulp build. |
 * | docsDest | `build/docs` | The file path to place all generated documenation files during a gulp build. |
 * | html5mode | `false` | Toggle Angular's [html5mode](https://docs.angularjs.org/guide/$location). |
 * | baseUrl | `'/'` | The value of the `href` attribute on the HTML `base` tag. Required when `html5mode` is true. |
 * | logoUrl | `images/logo.png` | The relative file path of your applications logo to use for the login screen. |
 * | packagePath | `./package.json` | The file path of your application's `package.json` file. |
 * | servce | `true` | Toggle a local server during the build. |
 * | gzip | `false` | Gzip generated assets during a build. |
 * | cleanIgnore | `Array` | An array of file paths to ignore when deleting files in a build directory before a build. |
 * | breakpoints | `Object` | Object of breakpoint values. |
 * | libraries | `Object` | Object of file paths of static libraries to include in the build files. |
 * | components | `Object` | An object of [components](#components) that can be set to be used in your application. |
 *
 * ## Breakpoints
 *
 * Breakpoints provide support for media queries and enable you to adjust your application's
 * layout depending on the viewport width. See {@link breakpoints Media Query Support Guide}.
 *
 * | Property | Default | Description |
 * |----------|---------|-------------|
 * | `breakpoints.sm`     | 0px     | The minimum viewport width for small screens. |
 * | `breakpoints.md`     | 600px   | The minimum viewport width for medium screens. |
 * | `breakpoints.lg`     | 900px   | The minimum viewport width for large screens. |
 * | `breakpoints.xl`     | 1200px  | The minimum viewport width for xlarge screens. |
 * | `breakpoints.xxl`    | 1800px  | The minimum viewport width for xxlarge screens. |
 *
 * ## Libraries
 *
 * Libaries allow you to bundle third-party libraries into your application's assets.
 * See the {@link configuration#using-third-party-libraries Build Configuration Guide}.
 *
 * | Property | Type | Description |
 * | -------- | ---- | ----------- |
 * | libraries.css | `[]` | An array of file paths of CSS libraries to include in `app.css`. |
 * | libraries.js | `[]` | An array of file paths of JS libaries to include in `app.js`. |
 * | libraries.fonts | `[]` | An array of file paths of font libraries to include in app's assets. |
 * | libraries.static | `[]` | An array of objects and/or strings. If the item is a string, it represents a file path that will copied directly into the root of your build output. If the item is an object it can contain two properties, `src` and `dest`. The `src` property is a string file path relative to your project root. The `dest` directory is a directory, relative to the root of your build output directory where the asset(s) defined in the `src` property will be copied. |
 *
 * ## Components
 *
 * Most ngBoltJS components can be optionally included in your application's compiled code. If you know you will not
 * need certain components for your application, you can set them to `false` and reduce the file size of your generated
 * application code.
 *
 * | Component | Default | Description |
 * |-----------|---------|-------------|
 * | auth | `true` | Use {@link blt_auth} module in your application. |
 * | appbar | `true` | Use {@link blt_appbar} module in your application. |
 * | cards | `true` | Use {@link blt_card} module in your application. |
 * | checkboxradio | `true` | Use {@link blt_checkboxradio} module in your application. |
 * | classificationbar | `true` | Use {@link blt_classificationbar} module in your application. |
 * | counter | `true` | Use {@link blt_counter} module in your application. |
 * | datepicker | `true` | Use {@link blt_datepicker} module in your application. |
 * | fileloader | `true` | Use {@link blt_fileloader} module in your application. |
 * | lists | `true` | Use {@link blt_list} module in your application. |
 * | login | `true` | Use {@link blt_login} module in your application. |
 * | menu | `true` | Use {@link blt_menu} module in your application. |
 * | modal | `true` | Use {@link blt_modal} module in your application. |
 * | notifications | `true` | Use {@link blt_notifications} module in your application. |
 * | panel | `true` | Use {@link blt_panel} module in your application. |
 * | dropdown | `true` | Use {@link blt_dropdown} module in your application. |
 * | tables | `true` | Use {@link blt_table} module in your application. |
 * | tabs | `true` | Use {@link blt_tab} module in your application. |
 * | textfield | `true` | Use {@link blt_textfield} module in your application. |
 * | toggleswitch | `true` | Use {@link blt_toggleswitch} module in your application. |
 * | view | `true` | Use {@link blt_view} module in your application. |
 * | data | `Object` | A list of data services to use in your application. |
 * | data.http | `true` | Use the http data service in your application. |
 * | data.sqlite | `true` | Use the sqlite data service in your application. |
 * | data.wamp | `true` | Use the wamp data service in your application. |
 */
(function() {
  'use strict';

  angular.module('blt_core')
    .directive('bltClose', bltClose)
    .directive('bltOpen', bltOpen)
    .directive('bltOpenView', bltOpenView)
    .directive('bltValidate', bltValidate)
    .directive('bltMain', bltMain)
    .directive('bltAutofocus', bltAttrDirective('Autofocus'))
    .directive('bltRequired', bltAttrDirective('Required'))
    .directive('bltTabindex', bltAttrDirective('Tabindex', true))
    .directive('bltMax', bltAttrDirective('Max', true))
    .directive('bltMin', bltAttrDirective('Min', true))
    .directive('bltMaxlength', bltAttrDirective('Maxlength', true))
    .directive('bltMinlength', bltAttrDirective('Minlength', true))
    .directive('bltStep', bltAttrDirective('Step', true))
    .directive('bltPattern', bltAttrDirective('Pattern', true))
    .directive('bltAutocorrect', bltAttrDirective('Autocorrect', true))
    .directive('bltAutocomplete', bltAttrDirective('Autocomplete', true))
    .directive('bltSpellcheck', bltAttrDirective('Spellcheck', true));

  /**
   * @ngdoc directive
   * @name bltClose
   * @module blt_core
   * @restrict A
   *
   * @description
   * Closes modals and panels. To close a modal or panel, pass the
   * `id` of the modal or panel as the value of the directive. This directive
   * should be used on an ngBoltJS {@link bltButton button} in place of an
   * [ng-click](https://docs.angularjs.org/api/ng/directive/ngClick).
   *
   * <div class="note-info">
   * **Note** If other functions need to be triggered when closing a component,
   * use `ng-click`. Call a function in your controller and use
   * `{@link BltApi#publish}` to close the component instead.
   * </div>
   *
   * <div class="note-tip">
   * **Tip** If the close button is a child element of a modal or panel, you do
   * not need to pass the id of the modal or panel.
   * </div>
   *
   * @requires BltApi
   *
   * @example <caption>Close a panel with an id of 'myPanel'</caption>
   * <example>
   *   <javascript>
   *      <button class="btn-text" blt-close="myPanel">Close Panel</button>
   *   </javascript>
   * </example>
   *
   * @example <caption>Close panel from within panel</caption>
   * <example>
   *   <javascript>
   *     <blt-panel>
   *     ...
   *     <button class="btn-text" blt-close="">Close</button>
   *     ...
   *     </blt-panel>
   *   </javascript>
   * </example>
   * @todo move into a separate file.
   */
  function bltClose( api ) {
    var directive = {
      restrict: 'A',
      link: linkFn
    };

    return directive;

    /**
     * @private
     * @function linkFn
     * @description Publish a close message to the `id` set on the bltClose attribute or navigate up the DOM tree
     * to get the components `id` if the bltClose attribute has no value. If the bltClose directive is
     * include on the component that it closes no id needs to be set.
     *
     * @param {object} scope Our isolate scope instance.
     * @param {angular.element} element [Angular element](https://docs.angularjs.org/api/ng/function/angular.element) of the outermost directive element
     * @param {object} attrs The raw html attributes that are attached to our directive element.
     */
    function linkFn( scope, element, attrs ) {

      var targetId = '';

      if ( attrs.bltClose ) {
        targetId = attrs.bltClose;
      } else {
        var parentElement = false;
        var tempElement = element.parent();

        while ( parentElement === false ) {
          if ( tempElement[0].nodeName == 'BODY' ) {
            parentElement = '';
          }

          if ( typeof tempElement.attr('blt-closable') !== 'undefined' && tempElement.attr('blt-closable') !== false ) {
            parentElement = tempElement;
          }

          tempElement = tempElement.parent();
        }

        targetId = parentElement.attr('id');
      }

      // Close targeted element
      element.on('click', function( e ) {
        api.publish(targetId, 'close');
        e.preventDefault();
      });
    }
  }

  bltClose.$inject = ['BltApi'];

  /**
   * @ngdoc directive
   * @name bltOpen
   * @module blt_core
   * @restrict A
   *
   * @description
   * Use `blt-open` to open modals and directives. To open a modal or panel, pass the `id` of the modal or
   * panel as the value of the directive. This directive should be used on an ngBoltJS {@link bltButton button} in place
   * of an [ng-click](https://docs.angularjs.org/api/ng/directive/ngClick).
   *
   * <div class="note-info">
   * **Note** If other functions need to be triggered when closing a component, use `ng-click`. Call a function in your
   * controller and use `{@link BltApi#publish}` to open the component instead.
   * </div>
   *
   * @requires BltApi
   *
   * @example <caption>Open a modal with an `id` of 'myModal'</caption>
   * <example>
   *   <javascript>
   *     <button class="btn-text" blt-open="myModal">Open Modal</button>
   *   </javascript>
   * </example>
   * @todo move into a separate file
   */
  function bltOpen( api ) {
    var directive = {
      restrict: 'A',
      link: linkFn
    };

    return directive;

    /**
     * @private
     * @function linkFn
     * @description Publishs an open message to open the component whose id is the value of the bltOpen attribute when clicked.
     *
     * @param {object} scope Our isolate scope instance.
     * @param {element} element [Angular element](https://docs.angularjs.org/api/ng/function/angular.element) of the outermost directive element
     * @param {object} attrs The raw html attributes that are attached to our directive element.
     */
    function linkFn( scope, element, attrs ) {
      element.on('click', function( e ) {
        api.publish(attrs.bltOpen, 'open');
        e.preventDefault();
      });

    }
  }

  bltOpen.$inject = ['BltApi'];

  /**
   * @ngdoc directive
   * @name bltOpenView
   * @module blt_core
   * @restrict A
   *
   * @description
   * Opens a new view and closes the current one. To open a view, pass the `path` of the view as the value
   * of the directive. This directive should be used on an ngBoltJS {@link bltButton button} in place of an
   * [ng-click](https://docs.angularjs.org/api/ng/directive/ngClick).
   *
   * <div class="note-info">
   * **Note** If other functions need to be triggered before opening views, or if you need to pass other paramaters to
   * the route, use `ng-click`. Call a function in your controller and use {@link BltApi#switchViews}.
   * </div>
   *
   * @requires BltApi
   *
   * @deprecated Use the `href` attribute or `ngHref` directive on an HTML `<a>` tag instead.
   *
   * @param {string} path The string of the path to pass to {@link BltApi#switchViews}.
   *
   * @example <caption>Open a view with a path of '/my-view'</caption>
   * <example>
   *   <javascript>
   *     <button class="btn-text" blt-open-view="/my-view">Open View</button>
   *   </javascript>
   * </example>
   * @todo move into a separate file
   */
  function bltOpenView( api ) {
    var directive = {
      restrict: 'A',
      link: linkFn
    };

    return directive;

    /**
     * @private
     * @function linkFn
     * @description Calls {@link BltApi#switchViews} and passes the path of the view set as the
     * value of the `bltOpenView` attribute.
     *
     * @param {object} scope Our isolate scope instance.
     * @param {element} element [Angular element](https://docs.angularjs.org/api/ng/function/angular.element) of the outermost directive element
     * @param {object} attrs The raw html attributes that are attached to our directive element.
     */
    function linkFn( scope, element, attrs ) {

      element.on('click', function( e ) {
        api.switchViews(attrs.bltOpenView);
        e.preventDefault();
      });

    }
  }

  bltOpenView.$inject = ['BltApi'];

  /**
   * @ngdoc directive
   * @name bltValidate
   * @module blt_core
   * @restrict A
   *
   * @description
   * Adds custom validators onto form controls. To add a custom validator, add a validator object
   * in your controller and pass as the value of the directive. Your validation function will be added to the
   * ngModelController async or sync validators depending on the validator type. Angular will run the validator in
   * addition to its built-in validators on form controls. For more information on custom Angular validators, see their
   * [documentation](https://docs.angularjs.org/api/ng/type/ngModel.NgModelController).
   *
   * @example
   * <example runnable="true">
   *   <javascript name="custom-validator.controller.js">
   *     angular.module("bltDocs")
   *       .controller("BltValidateCtrl", function(){
   *         var ctrl = this;
   *         ctrl.customValidator = {
   *           name: 'test', // The name of your custom validator object
   *           type: 'sync', // The type of validator: async or sync. See the Angular docs for more information.
   *           msg: "We're looking for 'Test'.", // The error message if invalid
   *           validationFn: function(modelValue, viewValue){ // The function to run to determine validity
   *             if( viewValue === 'Test' ){
   *               return true;
   *             } else {
   *               return false;
   *             }
   *           }
   *         };
   *       });
   *   </javascript>
   *   <html name="custom-validator.template.html">
   *     <div ng-controller="BltValidateCtrl as Example">
   *       <form class="form" name="myForm" novalidate>
   *           <blt-textfield data-name="validationTest"
   *                          data-label="Validation Test"
   *                          data-model="Example.myForm.validationTest"
   *                          data-type="text"
   *                          data-required="true"
   *                          data-validate="Example.customValidator">
   *           </blt-textfield>
   *       </form>
   *     </div>
   *   </html>
   * </example>
   *
   * @todo bltValidate
   */
  function bltValidate() {
    var directive = {
      require: 'ngModel',
      restrict: 'A',
      scope: {
        validator: '=bltValidate'
      },
      link: linkFn
    };

    return directive;

    /**
     * @private
     * @function linkFn
     * @description Checks that the validator is a function and then adds it to the ngModelController async or sync validators
     * depending on type. Angular will run the validator in addtion to its built-in validators on form controls.
     *
     * @param {scope} scope Our isolate scope instance.
     * @param {element} element Angular.element of the outermost directive element
     * @param {Object} attrs The raw html attributes that are attached to our directive element.
     * @param {controller} form Reference to the ngModelController.
     */
    function linkFn( scope, element, attrs, ctrl ) {
      // Register custom validators
      if ( scope.validator ) {
        if ( typeof scope.validator.validationFn !== 'function' ) {
          // Throw error if validationFn is not a function
          throw new Error(scope.validator + ' validationFn is not a function.');
        } else {
          if ( scope.validator.type === 'sync' ) {
            // Add to $validators if not async.
            ctrl.$validators[scope.validator.name] = scope.validator.validationFn;
          } else if ( scope.validator.type === 'async' ) {
            // Add to $asyncValidators if async.
            ctrl.$asyncValidators[scope.validator.name] = scope.validator.validationFn;
          }
        }
      }
    }
  }

  /**
   * @ngdoc directive
   * @name bltMain
   * @module blt_core
   * @restrict E
   *
   * @description
   * Defines the main container of an ngBoltJS application and includes the `main.template.html` file.
   * The bltMain directive communicates with {@link bltLogin} and is displayed depending on the logged in state.
   *
   * @requires BltApi
   * @requires https://docs.angularjs.org/api/ng/service/$timeout
   *
   * @todo move into separate file.
   */
  function bltMain( api, $timeout ) {
    var directive = {
      restrict: 'E',
      scope: {},
      template: '<div ng-show="show" ng-controller="MainController as Main" class="grid-frame grid-vertical" ng-include="\'partials/main/main.template.html\'"></div>',
      link: linkFn
    };

    return directive;

    /**
     * @private
     * @function linkFn
     * @todo Add description
     */
    function linkFn( scope ) {

      scope.show = false;
      var loginAnswerReceived = false;

      api.subscribe('login', onLoginMessage);

      api.publish('login', 'state_query');

      $timeout(function() {
        if ( !loginAnswerReceived ) {
          scope.show = true;
        }
      }, 250);

      function onLoginMessage( msg ) {
        if ( msg == "show" || msg == "showing" ) {
          loginAnswerReceived = true;
          $timeout(function() {
            scope.show = false;
          }, 300);
        } else if ( msg == "hide" || msg == "hidden" ) {
          loginAnswerReceived = true;
          scope.show = true;
        }
      }
    }
  }

  bltMain.$inject = ['BltApi', '$timeout'];

  /**
   * @private
   * @name bltAttrDirective
   * @module blt_core
   * @restrict A
   *
   * @description This function produces a blt attribute directive function to be returned to the .directive() function
   * during directive creation. This provides a small utility that can be used to instantiate a multitude of ngBoltJS
   * directives that will dynamically add or remove the given html attributes from the element based on the value of
   * the ngBoltJS directive attribute.
   *
   * For the html attribute to be added to the element, the value of the blt attribute must not equal False. (!== false)
   *
   * If/when the value of the attribute is not equal to false, the html attribute is added to the element. The value
   * that is assigned to the html attribute depends on the second argument to this function. If the second argument
   * is true, then the value of the ngBoltJS attribute is applied to the html attribute. Otherwise the html attribute
   * is set equal to its own name.
   *
   * @param {String} name The name of the html attribute that we're overriding.
   * @param {Boolean} useBltAttrValue If true, the value of the ngBoltJS attribute will be applied to the html attribute when it is non-false and added to the element.
   */
  function bltAttrDirective( name, useBltAttrValue ) {
    var bltAttrName = "blt" + name;
    var htmlAttrName = name.toLowerCase();

    function bltAttr( $compile, $timeout ) {

      var watchRegistered = false;

      var directive = {
        restrict: 'A',
        link: linkFn
      };

      return directive;

      /**
       * Watch the ngBoltJS attribute value and conditionally apply the corresponding html attribute to our parent
       * element, depending on that ngBoltJS attribute value. (e.g. bltTabindex corresponds to the tabindex attribute.)
       */
      function linkFn( scope, element, attr ) {
        if ( !watchRegistered ) {
          watchRegistered = true;
          scope.$watch(function() {
            return attr[bltAttrName];
          }, function() {
            assignBltAttrValue(scope, element, attr);
          })
        }
        assignBltAttrValue(scope, element, attr);
      }

      /**
       * Assign the value of the blt attribute to the html attribute if necessary. If we assign a value to the html
       * attribute, recompile the element so angular picks up the new attributes / values.
       * @param scope
       * @param element
       * @param attr
       */
      function assignBltAttrValue( scope, element, attr ) {
        if ( angular.isDefined(attr[bltAttrName]) && attr[bltAttrName] !== 'false' && attr[bltAttrName] != "" ) {
          if ( useBltAttrValue ) {
            if ( attr[htmlAttrName] != attr[bltAttrName] ) {
              element.attr(htmlAttrName, attr[bltAttrName]);
              $timeout(function() {
                $compile(element)(scope)
              });
            }
          } else if ( !attr.hasOwnProperty(htmlAttrName) ) {
            element.attr(htmlAttrName, htmlAttrName);
            $timeout(function() {
              $compile(element)(scope)
            });
          }
        } else if ( attr.hasOwnProperty(htmlAttrName) ) {
          element.removeAttr(htmlAttrName);
          $timeout(function() {
            $compile(element)(scope)
          });
        }
      }
    }

    bltAttr.$inject = ['$compile', '$timeout']

    return bltAttr;
  }

})();

/**
 * @ngdoc module
 * @name blt_dataRoutes
 * @module blt_dataRoutes
 * @sortorder 3
 *
 * @description
 * The routes module is automatically generated from the `routes.json` file
 * found in the `config` directory in your applications project root. It defines
 * a series of uniquely named routes that the data service will use to resolve
 * calls from application code. Since the data service acts very much like a
 * software router, this file can be considered the heart of the data service's
 * ability to correctly identify which route to select and resolve calls from
 * based on the application {@link blt_appProfile profile} specifications.
 *
 * ## Creating Routes
 *
 * Create a routes file is as simple as creating a new, specially named JSON file -
 * `routes.json` - in the 'config' directory under your application project's root.
 * The routes file is read by the Gulp build process and incorporated into the
 * application, so there is no need to distribute the routes file with your
 * application.
 *
 * <div class="note-info">
 * **Note** The routes file must define an object, `routes`, that contains all
 * application-specific routes. See the example for details and use it as a starting
 * point.
 * </div>
 *
 * | Property | Type | Description |
 * | -------- | ---- | ----------- |
 * | `routes` | object | Collection of Routes |
 *
 * ## Defining a Route
 * Think of each route like a specification for how the data service should
 * interface with a data source, what arguments to pass to that source, and what to
 * return from the call. Each route should have a descriptive, unique name. The
 * route definition is divided into several categories that describe how to execute
 * the call, keyed by the protocol the data service is using.
 *
 * <div class="note-tip">
 * **Best Practice** Using the data service in an application data source is fairly
 * trivial. However, if you are planning on deploying to different environments that
 * will use different data sources, think **very** carefully about the format your
 * application's data sources will return. To ensure that no platform-specific code
 * needs to be written in your application, take steps to ensure that your data
 * sources will return the same type of data in an identical format. (e.g., as an
 * array, object, or plain text).
 * </div>
 *
 * | Property | Type | Description |
 * | -------- | ---- | ----------- |
 * | `routes.<Route>` | object | A uniquely named Route |
 *
 * ---
 *
 * ### `Route.return`
 *
 * The data service can return data from a route call in several formats. Depending
 * on the data protocol, this may automatically transform data into the appropriate
 * format from the data returned from the call to the route. This may or may not be
 * allowed, depending on the protocol. See the following table for what return data
 * types are allowed with which protocols.
 *
 * | Return Value | WAMP | REST | SQLite | Description |
 * | ------------ | ---- | ---- | ------ | ----------- |
 * | `object`     | Yes  | Yes  | Yes    | Returns a JavaScript object if it was able to be parsed from the data returned from the call. **When using the `object` return type with SQLite, this will return the first returned row from the query as an object.** |
 * | `array`      | Yes  | Yes  | Yes    | This will return an array of JavaScript objects or primitives. |
 * | `text`       | Yes  | Yes  | No     | This will return plain text from the data returned from the call. **Any calls made to an SQLite route with a `text` return type will automatically fail.**
 *
 * | Property | Type | Description |
 * | -------- | ---- | ----------- |
 * | `Route.return` | string | The return type can be one of the three values in the table above. When interacting with external data sources, the data service will make an attempt to convert the data returned from the data source to the defined return type if it can. If it cannot make the conversion, the raw data will be returned as a fallback. |
 *
 * <div class="note-info">
 * **Note** If an unknown return type is supplied to the route, the data service
 * will default to returning an object.
 * </div>
 *
 * ---
 *
 * ### `Route.<Protocol>`
 *
 * Each route also contains a category for each protocol that the route supports
 * whose names match the protocol declared in the application profile. Unused
 * protocols can be safely excluded from the route destination.
 *
 *
 * #### REST Protocol
 *
 * | Property | Type | Description |
 * | -------- | ---- | ----------- |
 * | `rest.url` | string | The URL at which the data service should direct the request. |
 * | `rest.type` | string | The method types the data service should make. This is one of the standard HTTP method types (e.g., GET, POST, etc...). |
 * | `rest.params` | array | Array of strings that name the properties to extract from the object passed to the data service call that are to be sent as the REST request query parameters. This will extract and pass them to the REST endpoint in the order defined in the array. |
 * | `rest.body` | array | Array of strings that name the properties to extract from the object passed to the data service call that are to be sent as the REST request body. This will extract and pass them to the REST endpoint in the order defined in the array. |
 *
 * **Example REST Properties**
 * ```json
 * "rest": {
 *    "url": "/some/endpoint/url",
 *    "type": "GET",
 *    "params": ["someData"],
 *    "body": ["moreData"]
 * }
 * ```
 *
 * **Dynamic URL Generation**
 *
 * The data service also supports dynamic URL generation by substituting keywords in
 * the configuration URL with the values of properties of the object passed to the
 * call. The to-be replaced keywords must be prefixed with a `$` followed by any
 * valid object property name. The data service will attempt to extract the value of
 * a parameter contained in the passed object, replacing the keyword with the value.
 *
 * For example, say that your application made the following call:
 *
 * ```javascript
 * dataApi.call("uniquelyNamedRoute", {value: "details", field: "users", query: "username"});
 * ```
 *
 * and the route definition was defined as (abridged):
 *
 * ```json
 * "rest": {
 *    "url": "/get/$value/from/$field"
 * }
 * ```
 *
 * The data service would then extract the parameters of the object passed to the
 * call and replace the keywords in the defined URL. In this case, the data service
 * would construct the following URL and make the request against it:
 *
 * ```
 * /get/details/from/users
 * ```
 *
 * <div class="note-warning">
 * **Important** Be aware that the data service will not pass parameters as query parameters that have been used to replace keywords in the URL. For example, in the above call only the `query` property would be forwarded to the REST endpoint as a query parameter.
 * </div>
 *
 * #### WAMP Protocol
 *
 * | Property | Type | Description |
 * | -------- | ---- | ----------- |
 * | `wamp.rpc` | string | The URL of the WAMP remote procedure endpoint at which the data service should direct the request. |
 * | `wamp.args` | array | An array of strings that name the properties to extract from the object passed to the data service call that are to be sent as an array of ordered arguments to the remote procedure. |
 * | `wamp.kargs` | array | An array of strings that name the properties to extract from the object passed to the data service call that are to be sent as part of an object containing keyword arguments to the remote procedure call. |
 *
 * **Example WAMP properties
 * ```json
 * "wamp": {
 *    "rpc": "f.some.rpc.endpoint",
 *    "args": ["someData"],
 *    "kargs": ["moreData"]
 * }
 * ```
 *
 * #### SQLite Protocol
 *
 * | Property | Type | Description |
 * | -------- | ---- | ----------- |
 * | `sqlite.query` | string | Defines the SQL query that the data service should execute. |
 * | `args` | array | An array of strings that name the properties to extract from the object passed to the data service call that are to be sent as part of the query. |
 *
 * ** Example SQLite properties
 * ```json
 * "sqlite": {
 *    "query": "INSERT INTO EXAMPLE_ROUTES (aCol, bCol) VALUES (?,?);"
 *    "args": ["someData", "moreData"]
 * }
 * ```
 *
 * ## Example Route
 *
 * Below is an example routes file that you may copy and modify to include in your
 * application.
 *
 * ```json
 * {
 *  "routes": {
 *    "uniquelyNamedExample": {
 *      "return": "object",
 *      "rest": {
 *        "url": "/some/endpoint/url",
 *        "type": "POST",
 *        "params": ["someData"],
 *        "body": ["moreData"]
 *      },
 *      "wamp": {
 *        "rpc": "f.some.rpc.endpoint",
 *        "args": ["someData"],
 *        "kargs": ["moreData"]
 *      },
 *      "sqlite": {
 *        "query": "INSERT INTO EXAMPLE_ROUTES (aCol, bCol) VALUES (?,?);"
 *        "args": ["someData", "moreData"]
 *      }
 *    }
 *  }
 * }
 * ```
 */
(function() {
  'use strict';

  angular
    .module('blt_core')
    .directive('bltIfBp', bltIfBp);

  bltIfBp.$inject = ['BltApi', '$window', 'breakpoints', '$compile', '$animate'];

  /**
   * @ngdoc directive
   * @name bltIfBp
   * @module blt_core
   * @restrict A
   *
   * @since 2.0.0
   *
   * @description
   * Provides [ng-if](https://docs.angularjs.org/api/ng/directive/ngIf) functionality tied to viewport width via
   * a set of defined media-query breakpoints. These breakpoints are as follows: 'sm', 'md', 'lg', 'xl', and 'xxl'.
   * Breakpoints can be used in this directive by assigning a string or model reference to the directive. The
   * assignment of a breakpoint can also include a direction: 'down', 'up' or 'only'. If no direction is defined, the
   * breakpoint is interpreted as 'only'. It is important to note that, like ng-if, the blt-if-bp directive will add or
   * remove your element from the DOM based on the breakpoint configuration and viewport width.
   *
   * @example
   * <caption>The following example demonstrates the various ways in which a breakpoint can be
   * specified. To view the various breakpoints in action, please resize your browser window.</caption>
   * <example runnable="true">
   * <javascript name="BPCtrl">
   *   angular.module('bltDocs')
   *     .controller('BPCtrl', function(){
   *       var ctrl = this;
   *       ctrl.bp = {
   *         bp: 'md',
   *         dir: 'down'
   *        }
   *     });
   * </javascript>
   * <html>
   *   <div class="grid-content text-center" ng-controller="BPCtrl as ctrl">
   *     <div blt-if-bp="ctrl.bp">
   *       <h2 class="font-title">Medium or Smaller Viewport Display</h2>
   *     </div>
   *     <div blt-if-bp="lg">
   *       <h2 class="font-title">Large Viewport Display Only</h2>
   *     </div>
   *     <div blt-if-bp='{bp: "xl", dir: "up"}'>
   *       <h2 class="font-title">Extra Large or Larger Viewport Display</h2>
   *     </div>
   *   </div>
   * </html>
   * </example>
   *
   * @requires BltApi
   * @requires https://docs.angularjs.org/api/ng/service/$window
   * @requires blt_config#breakpoints
   * @requires https://docs.angularjs.org/api/ng/service/$compile
   * @requires https://docs.angularjs.org/api/ng/service/$animate
   */
  function bltIfBp( bltApi, $window, breakpoints, $compile, $animate ) {

    // Valid breakpoint names and directions.
    var breakpointnames = ['sm', 'md', 'lg', 'xl', 'xxl'];
    var directions = {
      down: 'down',
      only: 'only',
      up: 'up'
    }

    var directive = {
      multiElement: true,
      transclude: 'element',
      priority: 601,
      terminal: true,
      restrict: 'A',
      $$tlb: true,
      scope: {
        bltIfBp: '='
      },
      link: linkFn
    };

    return directive;

    function linkFn( $scope, $element, $attr, ctrl, $transclude ) {

      var block, childScope, previousElements, mediaQuery, minWidth, maxWidth;

      if ( !$window.matchMedia || !angular.isFunction($window.matchMedia) ) {
        bltApi.warn("window.matchMedia not found. blt-if-bp functionality will not be available in this browser.");
        return;
      }

      // Determine whether the value was given inline or as part of our scope. If it's inline the attribute will be
      // a string that contains object notation '{' and '}' or is simply one of our breakpoint names. Otherwise, we'll
      // assume that it's coming from the scope.
      var fromScope = true;
      if ( !angular.isDefined($scope.bltIfBp) && breakpointnames.indexOf($attr.bltIfBp) >= 0 ||
        ($attr.bltIfBp.indexOf('{') >= 0 && $attr.bltIfBp.indexOf('}') > 0) ) {
        fromScope = false;
      }

      // Set up unregister hook.
      $scope.$on('$destroy', function() {
        if ( mediaQuery ) {
          mediaQuery.removeListener(evaluateBreakpoint);
        }
      });

      // If our value is coming from scope, set up a listener to react to changes.
      if ( fromScope ) {
        $scope.$watch(function() {
          return $scope.bltIfBp
        }, function( value ) {
          registerBreakpoint(value);

        });
      } else { // Otherwise just register the breakpoint we have set in our attribute.
        registerBreakpoint($attr.bltIfBp);
      }

      /**
       * @private
       * @function registerBreakpoint
       *
       * @description
       * Registers the given breakpoint settings with this element. Based on these settings,
       * we'll set up our min and max width values. If the browser support media queries, we'll register a media query
       * with this min and/or max value and set up a listener to respond to changes in that query. The value passed in
       * can be a simple string naming one of the predefined breakpoints, or a JSON Object or JSON String representing
       * our breakpoint settings. The breakpoint settings format is as follows:
       *
       * ```js
       * {
       *    bp: 'sm', //One of our predefined breakpoint names.
       *    dir: 'up' //One of 'down','up', or 'only'.
       * }
       * ```
       *
       * @param value The breakpoint value to register. Can be a simple string naming one of the predefined breakpoints,
       * or a JSON Object or JSON String representing our breakpoint settings.
       */
      function registerBreakpoint( value ) {
        // Convert value into object format if necessary.
        var bp = {};
        if ( angular.isObject(value) ) { // Value already is an object.
          bp = value;
        } else if ( value.indexOf('{') >= 0 && value.indexOf('}') > 0 ) { // Value appears to be a JSON string.
          //Convert to valid json string, then to a JSON object. DON'T use eval because we can guarantee safe input.
          bp = angular.fromJson(value.replace(/(['"])?([a-zA-Z0-9]+)(['"])?:/g, '"$2":'));
        } else { // If value is anything else, we'll just try to use it directly as the breakpoint.
          bp.bp = value;
        }
        // If no direction was set, default to 'only'
        bp.dir = bp.dir || 'only';

        // Evaluate min and max widths based on breakpoint settings.
        var bpIdx = breakpointnames.indexOf(bp.bp);
        if ( bpIdx >= 0 ) {
          //We'll set a max width if the direction is down or only.
          if ( bp.dir == directions.down || bp.dir == directions.only ) {
            // and we're not already on the largest breakpoint.
            if ( bpIdx < breakpointnames.length - 1 ) {
              maxWidth = breakpoints[breakpointnames[bpIdx + 1]] - 1;
            }
          }
          // We'll set a min width if the direction is up or only.
          if ( bp.dir == directions.up || bp.dir == directions.only ) {
            // and we're not already on the smallest breakpoint.
            if ( bpIdx > 0 ) {
              minWidth = breakpoints[bp.bp];
            }
          }
        }

        // If matchMedia is available, set up a media query and register for changes. Otherwise we'll depend on window
        // resize events.
        if ( $window.matchMedia && angular.isFunction($window.matchMedia) ) {
          if ( mediaQuery ) {
            mediaQuery.removeListener(evaluateBreakpoint);
          }
          var match = 'screen';
          if ( angular.isDefined(minWidth) ) {
            match += ' and (min-width: ' + minWidth + 'px)';
          }
          if ( angular.isDefined(maxWidth) ) {
            match += ' and (max-width: ' + maxWidth + 'px)';
          }
          mediaQuery = $window.matchMedia(match);
          mediaQuery.addListener(evaluateBreakpoint);
        }

        // Trigger a breakpoint evaluation.
        evaluateBreakpoint();
      }

      /**
       * @private
       * @function getBlockNodes
       *
       * @description
       * Builds a jqlite element containing all sibling elements in the given node set. Stolen from angular ng-if
       * implementation.
       *
       * @param nodes jqlite element containing a set of notes.
       * @returns {Object}
       */
      function getBlockNodes( nodes ) {
        var node = nodes[0];
        var endNode = nodes[nodes.length - 1];
        var blockNodes = [node];
        do {
          node = node.nextSibling;
          if ( !node ) break;
          blockNodes.push(node);
        } while ( node !== endNode );
        return angular.element(blockNodes);
      }

      /**
       * @private
       * @function matches
       *
       * @description Check to see if the current viewport matches our breakpoint settings.
       *
       * @returns {boolean} True if the current viewport patches our breakpoint settings. False otherwise.
       */
      function matches() {
        if ( mediaQuery ) {
          return mediaQuery.matches;
        } else {
          var px = $window.innerWidth;
          return (!angular.isDefined(minWidth) || px >= minWidth)
            && (!angular.isDefined(maxWidth) || px <= maxWidth);
        }
      }

      /**
       * @private
       * @function evaluateBreakpoint
       *
       * @description Update UI state based on breakpoint and current viewport size.
       */
      function evaluateBreakpoint() {
        if ( matches() ) {
          if ( !childScope ) {
            $transclude(function( clone, newScope ) {
              childScope = newScope;
              clone[clone.length++] = $compile.$$createComment('end bltIfBp', $attr.bltIfBp);
              // Note: We only need the first/last node of the cloned nodes.
              // However, we need to keep the reference to the jqlite wrapper as it might be changed later
              // by a directive with templateUrl when its template arrives.
              block = {
                clone: clone
              };
              $animate.enter(clone, $element.parent(), $element);
            });
          }
        } else {
          if ( previousElements ) {
            previousElements.remove();
            previousElements = null;
          }
          if ( childScope ) {
            childScope.$destroy();
            childScope = null;
          }
          if ( block ) {
            previousElements = getBlockNodes(block.clone);
            $animate.leave(previousElements).then(function() {
              previousElements = null;
            });
            block = null;
          }
        }
      }
    }
  }
})();
(function() {
  'use strict';

  angular
    .module('blt_core')
    .component('bltSpinner', bltSpinner());

  /**
   * @ngdoc directive
   * @name bltSpinner
   * @module blt_core
   * @description The ngBoltJS Spinner provides a simple loading spinner.
   *
   * @example
   * <example runnable="true">
   *   <html>
   *     <div class="grid-block grid-vertical grid-center">
   *       <blt-spinner></blt-spinner>
   *     </div>
   *   </html>
   * </example>
   */
  function bltSpinner() {
    return {
      template: '<svg class="spinner" viewBox="0 0 66 66">' +
      '<circle stroke-linecap="round" cx="33" cy="33" r="30"></circle>' +
      '</svg>'
    };
  }
})();
(function() {
  'use strict';

  /**
   * @ngdoc module
   * @name blt_auth
   * @description ngBoltJS Authentication module.
   *
   * @since 2.0.0
   *
   */
  angular.module('blt_auth', ['blt_data'])
    .factory('BltAuth', BltAuth)
    .factory('BltAuthStorageService', BltAuthStorageService)
  ;

  /**
   * @ngdoc service
   * @name BltAuth
   * @module blt_auth
   * @description This service provides an API to facilitate user authentication in ngBoltJS applications.
   *
   * To use this service,
   * enable the auth component in `build.json` and then include this service in any
   * application services, factories, controllers, etc, where an awareness of authentication states and/or user
   * information is needed.
   * This service is set up to act as a generic layer between the application developer's code
   * and the actual authentication service implementation that is used. When this service initializes, it reviews the
   * auth configuration from the loaded profile and loads an internal service that is specified in that configuration.
   * ```
   * "auth": {
   *   "authService": "DevAuthService"
   * }
   * ```
   *
   * The service specified in this configuration property will handle the actual work of user authentication and is
   * referred to as the 'internal' authentication service. Two pre-built internal authentication services are included
   * in ngBoltJS for your convenience:
   * {@link WampAuthService} and {@link DevAuthService}. Please see
   * service specific documentation for usage.
   *
   * To support custom authentication to a custom back end service, you can provide your own implementation of the
   * internal authentication service in this configuration property.
   *
   * For more details on authentication configuration and detailed usage please review the
   * {@link authentication Authentication Guide}.
   *
   * @requires BltApi
   * @requires BltData
   * @requires https://docs.angularjs.org/api/auto/service/$injector
   * @requires https://docs.angularjs.org/api/ng/service/$q
   * @requires https://docs.angularjs.org/api/ng/service/$timeout
   */
  function BltAuth( bltApi, bltData, $injector, $q, $timeout ) {

    var authService = {};
    var connectedDefer;
    var isConnected = false;
    var requiresDataConnection = false;
    var requiredProtocolAvailable = false;

    var srvc = {
      login: login,
      logout: logout,
      hasCredentials: hasCredentials,
      connect: connect,
      available: available,
      /**
       * @description This BltAuth member function can be assigned by the user to hook the authentication event. Every time
       * the authentication state flips from unauthenticated to authentication, this function will be invoked.
       *
       */
      onauthenticate: undefined
    }

    activate();

    return srvc;

    /**
     * @ngdoc method
     * @name BltAuth#login
     * @description This function is called from the ngBoltJS login component when the user clicks the login button on the login
     * page.
     * @param {String} username The username for the login attempt.
     * @param {String} password The password for the login attempt.
     * @returns {Object} A promise that will resolve on the success and reject on the failure of the login attempt.
     *
     */
    function login( username, password ) {
      return authService.login(username, password);
    }

    /**
     * @ngdoc method
     * @name BltAuth#hasCredentials
     * @description This function returns a promise that resolves or rejects based on whether or not the current authentication
     * session has data available to log a user in. The specifics of this implementation are defined in the internal
     * auth service.
     * @returns {Object} A promise that will resolve/reject based on the credential state.
     *
     */
    function hasCredentials() {
      return authService.hasCredentials();
    }

    /**
     * @ngdoc method
     * @name BltAuth#isAuthenticated
     * @description This function returns a promise that resolves or rejects based on the current authentication state of the
     * auth service.
     * @returns {Object} A promise that will resolve/reject based on the authentication state.
     *
     */
    function isAuthenticated() {
      return authService.isAuthenticated();
    }

    /**
     * @ngdoc method
     * @name BltAuth#logout
     * @description This function will invoke a logout callback in the internal authentication service and then reload the page
     * on completion.
     * @returns {Object} A promise that will resolve on logout completion.
     *
     */
    function logout() {
      $timeout(function() {
        location.reload(true);
      }, 500);
      return authService.logout().finally(function() {
        location.reload();
      });
    }

    function available() {
      if ( requiresDataConnection ) {
        if ( connectedDefer ) {
          return connectedDefer.promise.then(function() {
            if ( requiredProtocolAvailable ) {
              return $q.resolve();
            }
            return $q.reject();
          }, function() {
            return $q.reject();
          })
        }
        return $q.reject();
      }
      return $q.resolve();
    }

    /**
     * @ngdoc method
     * @name BltAuth#connect
     * @description This function is called to initialize the BltAuth API. This will cause the API to connect to any data
     * services necessary to check existing authentication tokens/cookies for validity and set the initial
     * authentication state.
     *
     * @returns {Object} A promise that will resolve on the success and reject on the failure of the connection attempt.
     *
     */
    function connect() {
      if ( !connectedDefer ) {
        connectedDefer = $q.defer();
        var configuredAuthService;
        try {
          var $profile = angular.injector(['blt_appProfile']);
        } catch( error ) {
          console.error("Unable to init ngBoltJS auth!", error);
        }
        var $protocol = undefined;
        try {
          var $data = $profile.get('data');
          $protocol = $data.protocol;
        } catch( error ) {
          console.warn("Data profile not defined.");
        }

        try {
          var $auth = $profile.get('auth');
          configuredAuthService = $auth.authService;
        } catch( error ) {
          console.warn("Auth Service was not explicitly defined. Defaulting to NoAuthService.");
          configuredAuthService = 'NoAuthService';
        }

        $injector.invoke([configuredAuthService, function( authServiceToInject ) {
          authService = authServiceToInject;
        }]);

        if ( authService ) {
          if ( angular.isFunction(authService.requiresDataProtocol) ) {
            var required = authService.requiresDataProtocol();
            if ( angular.isDefined(required) ) {
              requiresDataConnection = true;
              if ( $protocol != required ) {
                bltApi.error("Auth service initialization unavailable. Configured auth service requires '" +
                  required + "' but the following data protocol is configured: '" + $protocol + "'.");
              } else {
                requiredProtocolAvailable = true;
              }
            }
          } else {
            requiredProtocolAvailable = true;
          }
          if ( angular.isFunction(authService.activate) ) {
            authService.activate().then(function() {
              bltData.connect().then(function() {
                  connectedDefer.resolve();
                },
                function() {
                  // Required data connection failed.
                  if ( requiresDataConnection && requiredProtocolAvailable ) {
                    bltApi.publish('bltAuth', 'unavailable');
                  }
                  connectedDefer.reject();
                });
            }, function() {
              connectedDefer.reject();
            });
          } else {
            bltData.connect().then(function() {
                connectedDefer.resolve();
              },
              function() {
                connectedDefer.reject();
              });
          }
        } else {
          connectedDefer.reject();
          return $q.reject();
        }
      }
      return connectedDefer.promise;
    }

    // Private Functions
    function evaluateLoginState() {
      authService.hasCredentials().then(function() {
        bltApi.publish('login', 'hide');
      }, function() {
        bltApi.publish('login', 'show');
      });
    }

    function onAuthMessage( msg ) {
      if ( msg == 'logout' ) {
        logout();
      } else if ( msg == 'fireauthenticated' ) {
        if(isConnected || !requiresDataConnection) {
          fireOnAuthenticationCallback();
        }
      } else if ( msg != 'authenticated' ) {
        evaluateLoginState();
      }
    }

    function fireOnAuthenticationCallback() {
      if ( authService.authenticated ) {
        if ( angular.isFunction(srvc.onauthenticate) ) {
          srvc.onauthenticate();
        }
        bltApi.publish('bltAuth', 'authenticated');
      }
    }

    function activate() {
      bltApi.subscribe('bltData', onBltDataMsg);
      bltApi.subscribe("bltAuth", onAuthMessage);
    }

    function onBltDataMsg( msg ) {
      if ( msg == 'connected' ) {
        isConnected = true;
        fireOnAuthenticationCallback();
      } else if ( msg == 'disconnected' ) {
        isConnected = false;
      }
    }

  }

  BltAuth.$inject = ['BltApi', 'BltData', '$injector', '$q', '$timeout'];

  /**
   * @ngdoc service
   * @name BltAuthStorageService
   * @module blt_auth
   * @description Storage API for stashing and retrieving login tokens/cookies.
   *
   * If cookie storage is available, key/value
   * pairs will be stored as cookies. Otherwise `window.localStorage` will be used.
   * @requires https://docs.angularjs.org/api/ng/service/$window
   */
  function BltAuthStorageService( $window ) {

    var useCookieStorage = true;
    var parser;

    var srv = {
      store: store,
      retrieve: retrieve,
      remove: remove
    }

    activate();

    return srv;

    ////////////////////////////////////////////////
    // Public Service Functions
    ////////////////////////////////////////////////


    function activate() {
      parser = document.createElement('a');
      parser.href = $window.location.href;
      useCookieStorage = testCookies();
    }

    /**
     * @ngdoc method
     * @name BltAuthStorageService#retrieve
     * @description Retrieves the value assigned to the given key.
     * @param {String} key The key to retrieve the value for.
     * @return {String} The value assigned to the given key, if found, undefined otherwise.
     */
    function retrieve( key ) {
      if ( useCookieStorage ) {
        return getCookie(key);
      }
      return $window.localStorage[key];
    }

    /**
     * @ngdoc method
     * @name BltAuthStorageService#store
     * @description Stores the given value in the given key for the given duration.
     * @param {String} key The key to assign the value to.
     * @param {String} value The value to store.
     * @param {Number} [duration=60] The duration in minutes to store the given value. -1 will cause value to never
     * expire.
     */
    function store( key, value, duration ) {
      if ( useCookieStorage ) {
        setCookie(key, value, duration || 60);
      } else {
        $window.localStorage[key] = value;
      }
    }

    /**
     * @ngdoc method
     * @name BltAuthStorageService#remove
     * @description Clears the value from the given key.
     * @param {String} key The key to clear.
     */
    function remove( key ) {
      if ( useCookieStorage ) {
        clearCookie(key);
      } else {
        $window.localStorage.removeItem(key);
      }
    }

    function getCookie( cname ) {
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for ( var i = 0; i < ca.length; i++ ) {
        var c = ca[i];
        while ( c.charAt(0) == ' ' ) c = c.substring(1);
        if ( c.indexOf(name) == 0 ) return c.substring(name.length, c.length);
      }
      return "";
    }

    function setCookie( cname, cvalue, exminutes ) {
      var expires = "";
      if ( exminutes != -1 ) {
        var d = new Date();
        d.setTime(d.getTime() + (exminutes * 60 * 1000));
        expires = "; expires=" + d.toUTCString();
      }
      document.cookie = cname + "=" + cvalue + expires + "; path=/";
    }

    function clearCookie( cname ) {
      var d = new Date();
      d.setTime(0);
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=; " + expires + "; path=/";
    }

    function testCookies() {
      setCookie('bltCT', new Date().toISOString(), 1);
      var cookiePass = !!(getCookie('bltCT'));
      clearCookie('bltCT');
      return cookiePass;
    }
  }

  BltAuthStorageService.$inject = ['$window'];
})();

(function() {
  'use strict';

  angular.module('blt_auth')
    .factory('DevAuthService', DevAuthService)
  ;

  /**
   * @ngdoc service
   * @name DevAuthService
   * @module blt_auth
   * @description This is a development version of the internal authentication service that can be used to provide user
   * authentication through the BltAuth API during development and testing.
   *
   * To use this service, simply enable the
   * `auth` and `login` components in your `build.json` file and configure the following in your profile:
   * ```
   * "auth": {
   *   "authService": "DevAuthService"
   * }
   * ```
   * To log in via this service, use username 'admin' and password 'password' at the login prompt.
   *
   * @requires https://docs.angularjs.org/api/ng/service/$q
   * @requires https://docs.angularjs.org/api/ng/service/$timeout
   * @requires BltAuthStorageService
   * @requires BltApi
   *
   */
  function DevAuthService( $q, $timeout, bltAuthStorage, bltApi ) {

    const dev_auth_user = 'dev_auth_user';

    var srv = {
      login: login,
      logout: logout,
      hasCredentials: hasCredentials,
      activate: activate,
      authenticated: false
    }

    return srv;

    ////////////////////////////////////////////////
    // Public Service Functions
    ////////////////////////////////////////////////

    function login( username, password ) {
      var defer = $q.defer();
      if ( username == 'admin' && password == 'password' ) {
        bltAuthStorage.store(dev_auth_user, username, -1);
        $timeout(function() {
          defer.resolve();
          setAuthenticated();
        }, 500);
        console.log("Login success!");
      } else {
        console.log("Login failed!");
        defer.reject('Invalid username / password.');
      }

      return defer.promise;
    }

    function setAuthenticated() {
      if ( !srv.authenticated ) {
        srv.authenticated = true;
        bltApi.publish('bltAuth', 'fireauthenticated');
      }
    }

    function logout() {
      bltAuthStorage.remove(dev_auth_user);
      return $q.when();
    }

    function hasCredentials() {
      if ( !!(bltAuthStorage.retrieve(dev_auth_user)) ) {
        if ( !srv.authenticated ) {
          setAuthenticated();
        }
        return $q.resolve();
      } else {
        return $q.reject();
      }
    }

    function activate() {
      return hasCredentials().then(function() {
        setAuthenticated();
        return $q.resolve();
      }, function() {
        return $q.resolve();
      })
    }

  }

  DevAuthService.$inject = ['$q', '$timeout', 'BltAuthStorageService', 'BltApi'];

})();

(function() {
  'use strict';

  angular.module('blt_auth')
    .factory('NoAuthService', NoAuthService)
  ;

  NoAuthService.$inject = ['$q'];

  function NoAuthService( $q ) {

    var srv = {
      login: login,
      logout: logout,
      hasCredentials: hasCredentials,
      authenticated: false
    }

    return srv;

    ////////////////////////////////////////////////
    // Public Service Functions
    ////////////////////////////////////////////////

    function login() {
      return $q.reject('Auth disabled');
    }

    function logout() {
      return $q.reject('Auth disabled');
    }

    function hasCredentials() {
      return $q.reject('Auth disabled');
    }
  }
})();

(function() {
  'use strict';

  angular.module('blt_auth')
    .factory('WampAuthService', WampAuthService)
  ;

  /**
   * @ngdoc service
   * @name WampAuthService
   * @module blt_auth
   * @description This version of the internal authentication service is built to connect to a WAMP router that exposes
   * login related RPC endpoints.
   *
   * This service can be used to provide client side authentication for users connecting
   * to WAMP routers. For a complete security model, the WAMP router that we're connecting to must provide proper role
   * restrictions and an authentication service must be available that exposes, at a minimum, login and logout
   * RPC endpoints.
   *
   * Please see the [WAMP Authentication Guide]() for more information on configuration and usage.
   *
   * @requires https://docs.angularjs.org/api/ng/service/$q
   * @requires https://docs.angularjs.org/api/ng/service/$timeout
   * @requires BltApi
   * @requires BltData
   * @requires BltAuthStorageService
   *
   */
  function WampAuthService( $q, $timeout, bltApi, bltData, bltAuthStorage ) {

    var authid;
    var secret;
    var authmethod;
    var authdefer;
    var authPreconfigured = false;

    var authCookie = 'wamp_token';

    var srv = {
      login: login,
      logout: logout,
      hasCredentials: hasCredentials,
      activate: activate,
      requiresDataProtocol: requiresDataProtocol,
      /**
       * @member {Boolean} authenticated
       * @description Boolean flag representing the current authentication state of the service. Authenticated is set to true
       * any time user AuthID and token are present.
       *
       */
      authenticated: false
    }

    activate();

    return srv;

    ////////////////////////////////////////////////
    // Public Service Functions
    ////////////////////////////////////////////////

    /**
     * @ngdoc method
     * @name WampAuthService#login
     * @description This function invokes the login RPC endpoint with the `username` and `password` provided. On success of the
     * login RPC, the resulting data, which will contain an AuthID and token is persisted using the
     * BltAuthStorageService, and authentication event is triggered, the WAMP connection is reset and configured to
     * re-connect using the given authentication parameters and the login promise is resolved.
     *
     * On failure of the login RPC, the login promise is rejected with the login error.
     *
     * @param {String} username The username for login attempt.
     * @param {String} password The password for login attempt.
     * @returns {Object} A promise that will be resolved on a successful login and rejected on a failure.
     *
     */
    function login( username, password ) {
      var deferred = $q.defer();
      if ( authmethod == "ticket" ) {
        //Send secure login to CrossBar through data api.
        bltData.call('login', {"username": username, "password": password}).then(function( authtoken ) {
            bltAuthStorage.store(authCookie, angular.toJson(authtoken.data), -1);
            extractCredentialsFromToken(authtoken.data);
            setAuthenticated();
            updateAuthConnectionConfig();
            deferred.resolve();
          },
          function( error ) {
            bltApi.error("Failed to log in.", error);
            deferred.reject(error);
          });
      } else {
        authid = username;
        secret = password;
        updateAuthConnectionConfig();
      }
      return deferred.promise;
    }

    /**
     * @ngdoc method
     * @name WampAuthService#logout
     * @description This function invokes the logout RPC, clears any store authentication tokens, and clears/resets the current
     * authenticated WAMP connection.
     * @returns {Object} A promise that resolves on completion of logout process.
     *
     */
    function logout() {
      authdefer = $q.when();
      srv.authenticated = false;
      bltAuthStorage.remove(authCookie);
      authid = undefined;
      secret = undefined;
      var resolved = false;
      var resolveLogout = function() {
        if ( !resolved ) {
          resolved = true;
          bltApi.publish("bltAuth", "evaluate");
          updateAuthConnectionConfig();
        }
      };
      $timeout(resolveLogout, 500);
      return bltData.call('logout').finally(function() {
        resolveLogout();
      });
    }

    /**
     * @ngdoc method
     * @name WampAuthService#hasCredentials
     * @description Returns a promise that resolves if we currently have an AuthID and token stored that can be used to attempt
     * to establish an authenticated WAMP connection and rejects otherwise.
     * @returns {Object} A promise that will resolve or reject based on whether or not an AuthID and token are
     * currently stored.
     *
     */
    function hasCredentials() {
      if ( authmethod == "ticket" && !authPreconfigured ) {
        var storedToken = bltAuthStorage.retrieve(authCookie);
        if ( storedToken ) {
          return extractCredentialsFromToken(angular.fromJson(storedToken)).then(function() {
            if ( !srv.authenticated ) {
              setAuthenticated();
              updateAuthConnectionConfig();
            }
          }, function() {
            if ( srv.authenticated ) {
              srv.authenticated = false;
              updateAuthConnectionConfig();
            }
          });
        } else {
          if ( srv.authenticated ) {
            authid = undefined;
            secret = undefined;
            srv.authenticated = false;
            updateAuthConnectionConfig();
          }
        }
      }
      if ( authid && secret ) {
        setAuthenticated();
        return $q.resolve();
      } else {
        return $q.reject("Not authenticated.");
      }
    }

    function requiresDataProtocol() {
      return "wamp";
    }

    /**
     * @ngdoc method
     * @name WampAuthService#activate
     * @description Activates the WampAuthService, reading appropriate configuration to determine authentication
     * parameters.
     * @returns {Object} A promise that resolves on successful service initialization and rejects on failure.
     *
     */
    function activate() {
      try {
        srv.authenticated = false;
        var $profile = angular.injector(['blt_appProfile']);
        var $auth = $profile.get('auth');

        if( $auth.authCookie ){
          authCookie = $auth.authCookie;
        }

        authid = $auth.authKey;
        secret = $auth.authSecret;

        if ( authid && secret ) {
          authPreconfigured = true;
        }

        authmethod = $auth.wampAuthMethod;
        if ( !authmethod ) {
          if ( authid && secret ) {
            authmethod = "wampcra";
          } else {
            authmethod = "ticket";
          }
        }

        bltApi.subscribe('bltData', onBltDataMessage);

        if ( authPreconfigured ) {
          updateAuthConnectionConfig();
        }

        return hasCredentials().then(function() {
            return $q.resolve();
          },
          function() {
            return $q.resolve();
          });
      } catch( error ) {
        console.warn("Unable to initialize Wamp Auth.")
        return $q.reject();
      }
    }


    ////////////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////////////

    function setAuthenticated() {
      if ( !srv.authenticated ) {
        srv.authenticated = true;
      }
    }

    function onChallenge( session, method, extra ) {
      if ( authmethod == "ticket" && method == "ticket" ) {
        return secret;
      } else if ( authmethod == "wampcra" && method == "wampcra" ) {
        return autobahn.auth_cra.sign(secret, extra.challenge);
      } else {
        console.error("Unable to handle challenge of type: %s", method);
      }
    }

    function extractCredentialsFromToken( token ) {
      if ( token && token.authid && token.ticket ) {
        authid = token.authid;
        secret = token.ticket;
        return $q.resolve();
      } else {
        authid = undefined;
        secret = undefined;
        return $q.reject();
      }
    }

    function updateAuthConnectionConfig() {
      if ( authid && secret ) {
        return bltData.setConnectionConfig({
          "authmethods": [authmethod],
          "authid": authid,
          "secret": secret,
          "onchallenge": onChallenge
        });
      } else {
        return bltData.setConnectionConfig();
      }
    }

    function onBltDataMessage( msg ) {
      if ( msg === 'auth_failed' ) {
        onAuthFailed();
      }
    }

    function onAuthFailed() {
      if ( !authPreconfigured ) {
        authid = undefined;
        secret = undefined;
        srv.authenticated = false;
        bltAuthStorage.remove(authCookie);
        location.reload();
      }
    }
  }

  WampAuthService.$inject = ['$q', '$timeout', 'BltApi', 'BltData', 'BltAuthStorageService'];

})();

(function() {
  'use strict';

  /**
   * @ngdoc module
   * @name blt_checkboxradio
   * @description ngBoltJS Checkbox/Radio module.
   *
   * @since 2.0.0
   */
  angular.module('blt_checkboxradio', [])
    .component('bltCheckboxRadio', bltCheckboxRadio())
  ;

  /**
   * @ngdoc directive
   * @name bltCheckboxRadio
   * @module blt_checkboxradio
   * @description This component can be used much like a standard HTML checkbox or radio button
   * and is primarily just a thin cosmetic layer around the standard functionality.
   *
   * To use this as a checkbox, set the `data-type="checkbox"` and attach the `data-model` to a boolean attribute in
   * your controller model. Selection/deselection of a checkbox will toggle this value between true and false. If
   * `data-type` is not defined, this component will default to `checkbox`.
   *
   * When used as a radio button, this component is most often used in a group with other radio buttons. The `data-type`
   * attribute should be set to `radio` and a value should be provided in the `data-value` attribute to indicate
   * the value to be assigned to the model bound in `data-model` when this radio button is activated.
   *
   * <div class="note-tip">Best Practice: The `data-` prefix is not required for ngBoltJS attributes but is highly recommended to prevent
   * conflicts with standard HTML attributes.</div>
   *
   * @example
   * <example runnable="true">
   *   <javascript>
   *     angular.module("bltDocs")
   *       .controller("CheckboxRadioExampleCtrl", function(){
   *         var ctrl = this;
   *         ctrl.doWhenValueChanges = function(){alert(ctrl.checkbox2)};
   *         ctrl.checkboxOptions = ["Option 1", "Option 2", "Option 3"];
   *       });
   *   </javascript>
   *   <html>
   *     <div ng-controller="CheckboxRadioExampleCtrl as ctrl">
   *       <form name="MyCtrl.myForm" class="form" novalidate>
   *           <blt-checkbox-radio data-name="checkbox"
   *                               data-label="Simple Checkbox"
   *                               data-model="ctrl.checkbox1">
   *           </blt-checkbox-radio>
   *           <hr class="form-divider">
   *           <blt-checkbox-radio data-name="checkbox"
   *                               data-label="Checkbox With Change Listener"
   *                               data-model="ctrl.checkbox2"
   *                               data-change="ctrl.doWhenValueChanges()">
   *           </blt-checkbox-radio>
   *           <hr class="form-divider">
   *           <div class="form-row">
   *              <blt-checkbox-radio data-name="optionSelection"
   *                               data-label="{{option}}"
   *                               data-model="ctrl.radio1"
   *                               data-type="radio"
   *                               data-value="{{option}}"
   *                               data-required="true"
   *                               ng-repeat="option in ctrl.checkboxOptions">
   *             </blt-checkbox-radio>
   *           </div>
   *           <hr class="form-divider">
   *           <blt-checkbox-radio data-name="optionSelection"
   *                               data-label="{{option}}"
   *                               data-model="ctrl.radio2"
   *                               data-type="radio"
   *                               data-value="{{option}}"
   *                               data-required="true"
   *                               ng-repeat="option in ctrl.checkboxOptions">
   *           </blt-checkbox-radio>
   *       </form>
   *     </div>
   *   </html>
   * </example>
   *
   * @restrict E
   *
   * @requires BltApi
   * @requires https://docs.angularjs.org/api/ng/service/$timeout
   *
   * @param {String} data-label This attribute specifies the label for this component.
   * @param {Two-Way} data-model This attribute is used to bind the value of this component to a property in the
   * containing scope. Functionality is based on the Angular ngModel directive.
   * @param {Value} data-name This attribute indicates the name of this form element and will be used during
   * form traversal by the ngBoltJS framework.
   * @param {Value} [data-autofocus] Indicates whether or not this field should autofocus on page load.
   * @param {Expression} [data-change] This attribute is used to bind an expression in the containing scope that
   * will be invoked any time the value of this component changes. Functionality is based on the Angular ngChange
   * directive.
   * @param {Value} [data-required] Indicates whether or not this field is required.
   * @param {Value} [data-type] Indicates whether this should be presented as a checkbox or radio button. Valid
   * values are "checkbox" and "radio". Defaults to "checkbox" if not specified.
   * @param {Value} [data-value] Only relevant when `data-type="radio"`. Specifies the value to apply to `data-model`
   * when this radio button is selected.
   * @param {Number} [data-tabindex] Specifies the tab order of an element.
   * @param {Value} [data-disabled] Disables the field. Any value set in this attribute will cause the field to be disabled.
   */
  function bltCheckboxRadio() {
    return {
      require: '^form',
      templateUrl: 'components/checkboxradio/checkboxradio.template.html',
      controller: bltCheckboxRadioController,
      bindings: {
        model: '=',
        autofocus: '@',
        disabled: '=?',
        name: '@',
        label: '@',
        type: '@',
        value: '@',
        required: '@',
        tabindex: '@',
        change: '&'
      }
    };
  }

  /**
   * @private
   * @name bltCheckboxRadioController
   * @module blt_checkboxradio
   * @description Controller for bltCheckboxRadio component.
   * @requires BltApi
   * @requires https://docs.angularjs.org/api/ng/service/$timeout
   *
   */
  function bltCheckboxRadioController( api, $timeout ) {

    var validTypes = ['checkbox', 'radio'];

    var ctrl = this;

    ctrl.toggle = toggle;
    ctrl.onChange = onChange;
    ctrl.$onInit = init;

    /**
     * @private
     * @description Handles the controller initialization. Confirm existence of required attributes and set default values
     * as needed.
     */
    function init() {
      // Confirm input name
      if ( !ctrl.name ) {
        api.error('missing name attribute for blt-checkbox-radio. See: ' + window.location + '/blt.checkboxradio.bltCheckboxRadio.html');
        return;
      }

      // Validate / set default input type
      if ( angular.isDefined(ctrl.type) ) {
        if ( validTypes.indexOf(ctrl.type) < 0 ) {
          api.error('invalid type attribute for blt-checkbox-radio: ' + ctrl.name + '. Type provided: ' + ctrl.type + '. Valid types: '
            + angular.toJson(validTypes) + '. See: ' + window.location + '/blt.checkboxradio.bltCheckboxRadio.html');
          return;
        }
      } else {
        ctrl.type = 'checkbox';
      }

      ctrl.autofocus = !!(ctrl.autofocus);
      ctrl.required = !!(ctrl.required);
    }

    /**
     * @name bltCheckboxRadioController#toggle
     * @description Toggle method used by checkboxes. Toggles the model value on spacebar keyup events.
     */
    function toggle() {
      if ( ctrl.type == 'checkbox' ) {
        //Toggle model value on keyup.
        if ( event.type == 'keyup' && event.keyCode == 13 ) {
          ctrl.model = !ctrl.model;
        }
      }
    };

    /**
     * @name bltCheckboxRadioController#onChange
     * @description OnChange method for triggering the function, if it exists, that is bound to data-change.
     */
    function onChange() {
      if ( ctrl.change ) {
        $timeout(ctrl.change, 0);
      }
    };
  }

  bltCheckboxRadioController.$inject = ['BltApi', '$timeout'];
})();
(function() {
  'use strict';

  /**
   * @ngdoc module
   * @name blt_classificationbar
   * @description ngBoltJS Classification Bar module.
   *
   * @since 2.0.0
   *
   */
  angular.module('blt_classificationbar', [])
    .component('bltClassificationbar', bltClassificationbar())
  ;

  /**
   * @ngdoc directive
   * @name bltClassificationBar
   * @module blt_classificationbar
   * @description The bltClassificationBar component provides a simple, standardized way to add a DoD standards compliant
   * classification label to pages/content in your application. The levels supported by this component are:
   * **Unclassified**, **Confidential**, **Secret**, and **Top Secret**.
   *
   * To use this component, simply include the component element as the first element in your main html. (This
   * element can be included anywhere in your application where you'd like the classification bar to appear, but
   * standard practice is to show it at the top of the main application page.)
   *
   * To define the classification level, provide one of the valid levels in the `data-classification` attribute.
   *
   * To define the verbosity of the classification label, assign a value to the `data-verbosity` attribute. A value of
   * 0 will result in only the specified classification label being displayed: "UNCLASSIFIED". A level of 1 will
   * increase verbosity to: "Highest Possible Classification: UNCLASSIFIED". A level of 2 will increase verbosity
   * further to: "This page contains dynamic content - Highest Possible Classification: UNCLASSIFIED".
   *
   * To further customize the presentation of this text, you can use the `data-custom-text` attribute. This attribute
   * accepts free text content which will be displayed in place of the default messaging. The only requirement is that
   * the text contain at least one reference to the classification level specified in `data-classification`.
   *
   * @example <caption>Unclassified classification bar with default verbosity level label "UNCLASSIFIED"</caption>
   * <example runnable="true">
   *   <html>
   *     <blt-classificationbar data-classification="unclassified"></blt-classificationbar>
   *   </html>
   * </example>
   *
   * @example <caption>Secret classification bar with label "This page contains dynamic content -
   * Highest Possible Classification: SECRET"</caption>
   * <example runnable="true">
   *   <html>
   *     <blt-classificationbar data-classification="secret"
   *                            data-verbosity="2">
   *     </blt-classificationbar>
   *   </html>
   * </example>
   *
   * @example <caption>Top Secret classification bar with VALID usage of custom text label "CLASSIFICATION:
   * TOP SECRET"</caption>
   * <example runnable="true">
   *   <html>
   *     <blt-classificationbar data-classification="topsecret"
   *                            data-custom-text="CLASSIFICATION: TOP SECRET">
   *     </blt-classificationbar>
   *  </html>
   * </example>
   *
   * @example <caption>INVALID custom text label "Content Classification: UNCLASSED" on unclassified classification
   * bar. (Custom label **MUST** contain the word "UNCLASSIFIED")</caption>
   * <example>
   *   <html>
   *     <blt-classificationbar data-classification="unclassified"
   *                            data-custom-text="Content Classification: UNCLASSED">
   *     </blt-classificationbar>
   *  </html>
   * </example>
   *
   * @param {string} data-classification Indicates the classification level of the content on the page being labeled.
   * Valid values include "unclassified", "confidential", "secret", and "top secret". (Case insensitive)
   * @param {string} [data-verbosity] Defines the verbosity with which to describe the specified classification level.
   * Valid values are 0-2 with 0 being least verbose and 2 being most verbose.
   * @param {string} [data-custom-text] This attribute can be used to specify custom messaging for the classification
   * bar classification label. Any text defined here will replace the standard verbosity based label. The only
   * requirement is that the standard verbosity level 0 label is contained somewhere in the custom text.
   *
   *
   */
  function bltClassificationbar() {
    return {
      templateUrl: 'components/classificationbar/classificationbar.template.html',
      controller: bltClassificationbarController,
      bindings: {
        cls: "@classification",
        customText: "@",
        verbosity: "@"
      }
    };
  }

  /**
   * @private
   * @name bltClassificationbarController
   * @module blt_classificationbar
   * @description Controller for bltClassificationBar component. We'll use this as an opportunity to review our attributes and provide
   * error feedback.
   *
   * @param {service} BltApi The ngBoltJS [BltApi](core.BltApi.html) service.
   *
   */
  function bltClassificationbarController( api ) {

    var ctrl = this;
    var classifications = {
      "unclassified": {display: "UNCLASSIFIED", cssClass: "unclassified"},
      "confidential": {display: "CONFIDENTIAL", cssClass: "confidential"},
      "secret": {display: "SECRET", cssClass: "secret"},
      "topsecret": {display: "TOP SECRET", cssClass: "top-secret"},
      "top-secret": {display: "TOP SECRET", cssClass: "top-secret"},
      "top secret": {display: "TOP SECRET", cssClass: "top-secret"},
    }
    var verbosity = {
      0: "",
      1: "Highest Possible Classification: ",
      2: "This page contains dynamic content - Highest Possible Classification: "
    }

    var classification = undefined;

    ctrl.$onInit = init;

    /**
     * @private
     * @description Handles the controller initialization. Confirm existence of required attributes and set default values
     * as needed.
     */
    function init() {
      //confirm classification chosen and appropriately chosen
      if ( !ctrl.cls ) {
        api.error("Missing required attribute: 'classification'");
        return;
      } else {
        classification = classifications[ctrl.cls.toLowerCase()];
        if ( !classification ) {
          api.error("Attribute 'classification' must be one of ['unclassified', 'confidential', 'secret', " +
            "'topsecret']. Current value: '" + ctrl.cls + "'. See: " + window.location + "/blt.classificationbar.bltClassificationBar.html");
          return;
        }
      }

      //check for custom text entered in place of default text
      if ( angular.isDefined(ctrl.customText) ) {
        if ( ctrl.customText.indexOf(classification.display) < 0 ) {
          api.error("Attribute 'custom-text' must contain at least one reference to standard classification " +
            "display: " + classification.display + " See: " + window.location + "/blt.classificationbar.bltClassificationBar.html");
          return;
        }
      }

      ctrl.classification = angular.copy(classification);
      if ( ctrl.customText ) {
        ctrl.classification.display = ctrl.customText;
      } else if ( ctrl.verbosity ) {
        if ( angular.isUndefined(verbosity[ctrl.verbosity]) ) {
          api.warn("Attribute 'verbosity' contained invalid verbosity level: " + ctrl.verbosity + ". Valid values " +
            "are [0, 1, 2]. See: " + window.location + "/blt.classificationbar.bltClassificationBar.html");
        } else {
          ctrl.classification.display = verbosity[ctrl.verbosity] + ctrl.classification.display;
        }
      }
    }
  }

  bltClassificationbarController.$inject = ['BltApi'];
})();
(function() {
  'use strict';

  /**
   * @ngdoc module
   * @name blt_counter
   * @description ngBoltJS Counter module.
   *
   * @since 2.0.0
   */
  angular.module('blt_counter', [])
    .component('bltCounter', bltCounter())
  ;

  /**
   * @ngdoc directive
   * @name bltCounter
   * @module blt_counter
   * @description The bltCounter component is used to collect whole number input from the user. It fulfills the role of the
   * standard HTML input [number] field with a step interval of 1. An important note is that the ngBoltJS Counter will
   * always have a value. As soon as this component initializes it will apply a default value to the model attached
   * to the component if that model is initially (or ever set to a value that is) undefined, non-numeric or violates
   * the constraints applied to this component. The default value is the closest value to zero that also adheres to
   * the min and max constraints set on this component.
   *
   * <div class="note-tip">Best Practice: The `data-` prefix is not required for ngBoltJS attributes but is highly recommended to prevent
   * conflicts with standard HTML attributes.</div>
   *
   * @example <caption>Simple counter, labeled "Counter" and bound to the scope property `MyCtrl.counter1`</caption>
   * <example runnable="true">
   *   <javascript>
   *     angular.module("bltDocs")
   *       .controller("CounterExampleCtrl", function(){
   *         var ctrl = this;
   *         ctrl.counter1 = 4;
   *         ctrl.counter2;
   *         ctrl.counter3;
   *       });
   *   </javascript>
   *   <html>
   *     <div ng-controller="CounterExampleCtrl as ctrl">
   *       <form name="ctrl.myForm" class="form" novalidate>
   *         <blt-counter data-name="myFirstCounter"
   *                    data-label="Counter"
   *                    data-model="ctrl.counter1">
   *         </blt-counter>
   *         <blt-counter data-name="mySecondCounter"
   *                    data-label="Constrained Counter"
   *                    data-min="1" data-max="100"
   *                    data-model="ctrl.counter2">
   *         </blt-counter>
   *         <blt-counter data-name="myThirdCounter"
   *                    data-label="Custom Counter"
   *                    data-left-icon="fa-minus"
   *                    data-right-icon="fa-plus"
   *                    data-model="ctrl.counter3">
   *         </blt-counter>
   *       </form>
   *     </div>
   *   </html>
   * </example>
   *
   * @restrict E
   *
   * @param {expression} data-model This attribute is used to bind the value of this component to a property in the
   * containing scope. Functionality is based on the Angular ngModel directive.
   * @param {string} data-name This attribute indicates the name of this form element and will be used during form
   * traversal by the ngBoltJS framework.
   * @param {boolean} [data-autofocus] Indicates whether or not this field should autofocus on page load.
   * @param {expression} [data-change] This attribute is used to bind an expression in the containing scope that will
   * be invoked any time the value of this component changes. Functionality is based on the Angular ngChange directive.
   * @param {boolean} [data-disabled] Disables the field. Any value set in this attribute will cause the field to be
   * disabled.
   * @param {string} [data-label] This attribute specifies the label for this component.
   * @param {number} [data-max] The maximum integer value of the component.
   * @param {number} [data-min] The minimum integer value of the component.
   * @param {number} [data-size] Indicates the size in characters of this field. If this is not set, the field will size
   * dynamically to contain the value entered by the user, up to 20 characters. Valid range for this is 1-20.
   * @param {string} [data-left-icon] The Font Awesome icon to use for the left icon. Defaults to 'fa-chevron-left'.
   * @param {string} [data-right-icon] The Font Awesome icon to use for the right icon. Defaults to 'fa-chevron-right'.
   * @param {expression} [data-validate] An expression that gets passed through to an instance of the bltValidate directive
   * to invoke custom validation on this component value. See documentation for Bolt Validate for more information.
   * @param {value} [data-required] Indicates whether or not this field is required.
   * @param {boolean} [data-selectOnFocus] If true, selects the contents of the counter input field on focus.
   *
   * @requires BltApi
   * @requires https://docs.angularjs.org/api/ng/service/$timeout
   */
  function bltCounter() {

    return {
      require: {
        form: '^form'
      },
      templateUrl: 'components/counter/counter.template.html',
      controller: bltCounterController,
      bindings: {
        model: '=',
        name: '@',
        label: '@',
        size: '@',
        disabled: '=?',
        change: '&',
        minVal: '@min',
        maxVal: '@max',
        selectOnFocus: '@',
        required: '@',
        autofocus: '@',
        validate: '=',
        leftIcon: '@',
        rightIcon: '@'
      }
    };
  }


  /**
   * @private
   * @name bltCounterController
   * @module blt_counter
   * @description Controller for our bltCounter component
   *
   * @requires BltApi
   * @requires https://docs.angularjs.org/api/ng/service/$timeout
   */
  function bltCounterController( api, $timeout, $scope ) {

    var ctrl = this;
    var mouseState = MouseState();
    var lastAdjustedModel = undefined;
    var defaultVal = 0;
    var selectOnFocus = ctrl.selectOnFocus !== 'false' && !!(ctrl.selectOnFocus);
    var adjustableSize = true;
    var tInputElem = undefined;

    ctrl.$onInit = init;
    ctrl.onChange = onChange;
    ctrl.mouseUp = mouseUp;
    ctrl.mouseDown = mouseDown;
    ctrl.mouseEnter = mouseEnter;
    ctrl.mouseLeave = mouseLeave;
    ctrl.onFocus = onFocus;
    ctrl.id = api.uuid();

    /**
     * @private
     * @description Handles the controller initialization. Confirm existence of required attributes and set default values
     * as needed.
     */
    function init() {

      //need to manipulate dom later on when figuring out textwidth, looking into alternative ways
      //noinspection JSValidateTypes
      $timeout(function() {
        tInputElem = angular.element(document.getElementById(ctrl.id));
        adjustView();
      });

      // Set input name
      if ( !ctrl.name ) {
        api.error('Missing name attribute for blt-counter. See: '
          + window.location + '/blt.counter.bltCounter.html');
      }

      $scope.$watch(function() {
        return ctrl.required;
      }, function() {
        if ( angular.isDefined(ctrl.required) && ctrl.required !== 'false' ) {
          ctrl.asterisk = "*";
        } else {
          ctrl.asterisk = "";
        }
      });

      if ( !angular.isDefined(ctrl.model) || !(isFinite(ctrl.model) || isNaN(ctrl.model)) ) {
        ctrl.model = defaultVal;
        onChange();
      }

      // Set min
      $scope.$watch(function() {
        return ctrl.minVal;
      }, function() {
        var min;
        if ( angular.isDefined(ctrl.minVal) ) {
          min = parseFloat(ctrl.minVal);
          if ( isFinite(min) ) {
            ctrl.min = min;
            if ( min > 0 ) {
              defaultVal = min;
            } else {
              defaultVal = 0;
            }
            if ( isFinite(ctrl.model) && ctrl.model < min ) {
              ctrl.model = min;
              onChange();
            }
          } else {
            ctrl.min = undefined;
          }
        } else {
          ctrl.min = undefined;
        }
      });

      // set max
      $scope.$watch(function() {
        return ctrl.maxVal;
      }, function() {
        if ( angular.isDefined(ctrl.maxVal) ) {
          var max = parseFloat(ctrl.maxVal);
          if ( isFinite(max) ) {
            if ( !isFinite(ctrl.min) || max >= ctrl.min ) {
              ctrl.max = max;
              if ( max < defaultVal ) {
                defaultVal = max;
              }
              if ( isFinite(ctrl.model) && ctrl.model > max ) {
                ctrl.model = max;
                onChange();
              }
            } else {
              ctrl.max = undefined;
            }
          }
        } else {
          ctrl.max = undefined;
        }
      });

      if ( angular.isDefined(ctrl.size) ) {
        if ( isFinite(ctrl.size) ) {
          adjustableSize = false;
        }
      }

      // Set validator
      if ( ctrl.validate ) {
        if ( ctrl.validate.msg ) {
          ctrl.errorMsg = ctrl.validate.msg;
        } else {
          ctrl.errorMsg = 'This field is invalid.';
        }
      }

      if ( angular.isUndefined(ctrl.leftIcon) ) {
        ctrl.leftIcon = 'fa-chevron-left';
      }

      if ( angular.isUndefined(ctrl.rightIcon) ) {
        ctrl.rightIcon = 'fa-chevron-right';
      }

      $scope.$watch(function() {
        return ctrl.model;
      }, adjustView);

    }

    /**
     * @name bltCounterController#mouseUp
     * @description When the user releases the mouse button on one of our change buttons, check to see if we were in the
     * "pressed" state, which means we need to trigger a change by the value passed in, and then set the mouse state
     * to "up". If we were instead in the "holding" state we'll just set our state to up because the continuous
     * change behaviour has already changed the value.
     *
     * @param {number} changeBy The amount to change the model by when invoked.
     */
    function mouseUp( changeBy ) {
      if ( mouseState.isPressed() ) {
        changeModelBy(changeBy);
        mouseState.setStateToUp();
      } else if ( mouseState.isHolding() ) {
        mouseState.setStateToUp();
      }
    };

    /**
     * @name bltCounterController#mouseDown
     * @description When the user clicks down on one of our change buttons, put our mouse state in the pushed state and
     * then set up a listener to transition into the "holding" state.
     * @param {number} changeBy The amount to change the model by when invoked.
     * @param {object} $event The angular event representation of this mouse event.
     */
    function mouseDown( changeBy, $event ) {
      if ( $event.which == 1 ) {
        var pressedUuid = api.uuid();
        mouseState.setStateToPressed(pressedUuid);
        $timeout(function() {
          if ( mouseState.isPressed(pressedUuid) ) {
            mouseState.setStateToHolding($event.target);
            document.addEventListener('mouseup', onDocumentMouseUp);
            continuousChangeBy(changeBy, 300);
          }
        }, 500);
      }
    };

    /**
     * @name bltCounterController#mouseEnter
     * @description When the mouse hovers over one of our change buttons, register that with our mouse state.
     * @param {object} $event The angular event representation of this mouse event.
     */
    function mouseEnter( $event ) {
      mouseState.setOver(true, $event.target);
    };

    /**
     * @name bltCounterController#mouseLeave
     * @description When the mouse stops hovering over one of our change buttons, register that with our mouse state.
     * @param {object} $event The angular event representation of this mouse event.
     */
    function mouseLeave( $event ) {
      mouseState.setOver(false, $event.target);
    };

    /**
     * @name bltCounterController#onFocus
     * @description If selectOnFocus is true, selects the contents of the counter input field on focus.
     */
    function onFocus() {
      if ( selectOnFocus ) {
        if ( angular.isDefined(ctrl.model) ) {
          try {
            tInputElem[0].selectionStart = 0;
            tInputElem[0].selectionEnd = ctrl.model.length;
          } catch( err ) {
            tInputElem[0].select();
          }
        }
      }
    };

    /**
     * @name bltCounterController#continuousChangeBy
     * @description This function handles the case where a user is holding the mouse pressed over one of our "change"
     * buttons. We will continue to call the "change" event at a decreasing interval until they release the button,
     * move the mouse off of the button they were pressing, or reach the max or min of the control.
     *
     * @param {number} changeBy The amount to change the model value by. (Either 1 or -1)
     * @param {number} wait The amount of time to wait until the next change should be fired.
     */
    function continuousChangeBy( changeBy, wait ) {
      if ( mouseState.isOverButton() ) {
        if ( changeModelBy(changeBy) ) {
          $timeout(function() {
            if ( mouseState.isHolding() ) {
              continuousChangeBy(changeBy, Math.max(wait / 1.3, 50));
            }
          }, wait);
        }
      } else {
        $timeout(function() {
          if ( mouseState.isHolding() ) {
            continuousChangeBy(changeBy, wait);
          }
        }, wait);
      }
    };

    /**
     * @name bltCounterController#changeModelBy
     * @description Change the model by the given value, assuming the change will not cause the model value to violate any
     * constraints the user applied. (Min or Max)
     * @param {number} changeBy The amount to change by.
     * @returns {boolean} True if the change was applied, false if the change was ignored because it would violate
     * either our min or max constraint.
     */
    function changeModelBy( changeBy ) {
      if ( !ctrl.disabled ) {
        if ( isNaN(ctrl.model) ) {
          ctrl.model = defaultVal;
          onChange();
          return true;
        } else if ( (angular.isUndefined(ctrl.max) || (ctrl.model + changeBy) <= ctrl.max) &&
          (angular.isUndefined(ctrl.min) || (ctrl.model + changeBy) >= ctrl.min) ) {
          ctrl.model = ctrl.model + changeBy;
          onChange();
          return true;
        }
      }
      return false;
    };

    /**
     * @name bltCounterController#adjustView
     * @description Adjust the size of our displayed input field based on the number of characters contained in our value.
     */
    function adjustView() {
      if ( angular.isDefined(tInputElem) ) {
        if ( ctrl.model != lastAdjustedModel ) {
          lastAdjustedModel = ctrl.model;
          if ( adjustableSize ) {
            tInputElem.css({
              'width': getTextWidth(ctrl.model.toString(), css(tInputElem[0], 'font-family'),
                css(tInputElem[0], 'font-size')) + 'px'
            })
          }
          ctrl.NaN = isNaN(ctrl.model);
        }
      }
    };

    /**
     * @name bltCounterController#getTextWidth
     * @description Get the rendered width of the given text in the given font and font size.
     *
     * @param {string} text The text to measure.
     * @param {string} font The font family to render the text in.
     * @param {number} fontSize The font size in pixels.
     * @returns {number} The rendered width in pixels.
     */
    function getTextWidth( text, font, fontSize ) {
      // re-use canvas object for better performance
      var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
      var context = canvas.getContext("2d");
      context.font = fontSize + " " + font;
      var metrics = context.measureText(text);
      return Math.ceil(metrics.width) + 1;
    };

    /**
     * @name bltCounterController#css
     * @description Gets the named css value associated with the given element.
     * @param {element} element The DOM element.
     * @param {string} property The css property to check.
     * @returns {string} The css value if found.
     */
    function css( element, property ) {
      return window.getComputedStyle(element, null).getPropertyValue(property);
    };

    /**
     * @name bltCounterController#onDocumentMouseUp
     * @description Mouse up listener to add to the document in case the user clicks down on our change button and then
     * releases somewhere else on the page.
     */
    function onDocumentMouseUp() {
      ctrl.mouseUp(0);
      document.removeEventListener('mouseup', onDocumentMouseUp);
    };

    /**
     * @name bltCounterController#onDocumentMouseState
     * @description Small structure to track mouse state. This is used for monitoring mouse pressed states when the user is
     * holding one of the change buttons.
     */
    function MouseState() {
      var mouseStates = {
        up: 'up',
        pressed: 'pressed',
        holding: 'holding'
      };


      var holdingTarget = undefined;
      var overTarget = undefined;
      var mouseState = mouseStates.up;
      var pressedUuid = undefined;

      var state = {
        isUp: isUp,
        setStateToUp: setStateToUp,
        isPressed: isPressed,
        setStateToPressed: setStateToPressed,
        isHolding: isHolding,
        setStateToHolding: setStateToHolding,
        isOverButton: isOverButton,
        setOver: setOver
      };

      return state;

      function isUp() {
        return mouseState == mouseStates.up;
      }

      function setStateToUp() {
        holdingTarget = undefined;
        mouseState = mouseStates.up;
      }

      function isPressed( uuid ) {
        return (!(uuid) || (uuid == pressedUuid)) && mouseState == mouseStates.pressed;
      }

      function setStateToPressed( uuid ) {
        pressedUuid = uuid;
        holdingTarget = undefined;
        mouseState = mouseStates.pressed;
      }

      function isHolding() {
        return mouseState == mouseStates.holding;
      }

      function setStateToHolding( target ) {
        holdingTarget = target;
        mouseState = mouseStates.holding;
      }

      function isOverButton() {
        return !!(holdingTarget) && (holdingTarget == overTarget);
      }

      function setOver( over, target ) {
        if ( over ) {
          overTarget = target;
        } else {
          overTarget = undefined;
        }
      }
    };

    /**
     * @name bltCounterController#onChange
     * @description Change listener fired any time our model value changes either internally or externally.
     */
    function onChange() {
      if ( !(isFinite(ctrl.model) || isNaN(ctrl.model)) || ctrl.model === null || ctrl.model == undefined ) {
        var viewValue = ctrl.form[ctrl.name].$viewValue;
        if ( isFinite(viewValue) ) {
          if ( isFinite(ctrl.max) && viewValue > ctrl.max ) {
            ctrl.model = ctrl.max;
          } else if ( isFinite(ctrl.min) && viewValue < ctrl.min ) {
            ctrl.model = ctrl.min;
          } else {
            ctrl.model = defaultVal;
          }
        } else {
          ctrl.model = defaultVal;
        }
        ctrl.form[ctrl.name].$viewValue = ctrl.model;
      } else if ( ctrl.model != 0 && ctrl.form[ctrl.name] && ctrl.form[ctrl.name].$viewValue.toString().indexOf('0') == 0 ) {
        ctrl.form[ctrl.name].$setViewValue(ctrl.model);
        ctrl.form[ctrl.name].$render();
      }
      if ( ctrl.change ) {
        $timeout(ctrl.change, 0);
      }
    };
  }

  bltCounterController.$inject = ['BltApi', '$timeout', '$scope'];
})();
(function() {
  'use strict'

  /**
   * @ngdoc module
   * @name blt_datepicker
   * @description ngBoltJS Datepicker component.
   */
  angular.module('blt_datepicker', ['blt_core'])
    .filter('time', time)
    .directive('bltDatepicker', bltDatepicker);

  /**
   * @ngdoc directive
   * @name bltDatepicker
   * @module blt_datepicker
   * @since 1.0.0
   *
   * @description
   * Provides a pop-up date selection control that allows users to select year, month, day, hour, and minutes based on
   * the attributes defined on the directive.
   *
   * Use the `data-first-view` attribute to specifiy the initial granularity of the picker. For example, if you expect
   * your users to only pick days within the current month, it would make sense to set this value to `date` (valid
   * values are defined below), so the first view presented to this user would be the set of available days to pick for
   * the current month.
   *
   * Likewise, use the `data-last-view` to define the granularity to which the user must select a time. We will simply
   * end the user's selection when they've completed their selection of the given view. For example, if you are only
   * interested in the month and year of birth, you would set this value to `month`.
   *
   * You can also set a min and max date available for user selection. To set the min or max date, you simply bind one
   * of the attributes `data-min-date` or `data-max-date` to a model in your controller containing a date of some sort.
   * Valid formats include any value that can successfully be interpreted as a a date, including seconds from epoch as a
   * string or integer, or a JavaScript date object.
   *
   * @requires BltDatepickerUtils
   * @requires BltApi
   * @requires https://docs.angularjs.org/api/ng/service/$timeout
   * @requires https://docs.angularjs.org/api/ng/service/$document
   *
   * @param {string} data-model Binds the value of this form field to a property in the containing scope. Functionality is based on the Angular [ngModel](https://docs.angularjs.org/api/ng/directive/ngModel) directive.
   * @param {string} data-name Assigns a value to the name attribute of the form field that will be used during form traversal by ngBoltJS.
   * @param {string} data-label Assigns a value to the form field's label.
   * @param {boolean} [data-autofocus=false] Indicates whether or not this field should autofocus on page load.
   * @param {string} [data-change] Expression in the containing scope to invoke any time the value of this component changes. Based on the Angular [ngChange](https://docs.angularjs.org/api/ng/directive/ngChange) directive.
   * @param {string} [data-format=short] The [date filter format](https://docs.angularjs.org/api/ng/filter/date) to use.
   * @param {string} [data-first-view=year] The first calendar view to display (year|month|date|hours|minutes).
   * @param {string} [data-last-view=minutes] The last calendar view to display before closing and updating the model (year|month|date|hours|minutes).
   * @param {date} [data-max] The maximum date to display on the calendar. Any date above the specified date will be disabled.
   * @param {date} [data-min] The minimum date to display on the calendar. Any date below the specified date will be disabled. If `data-model` is null when the datepicker opens, it will open the calendar to minimum specified date.
   * @param {boolean} [data-required=false] Specifies if the form field is required.
   *
   * @example
   * <example runnable="true">
   *   <css>
   *     .datepicker-example-container {
   *       overflow: visible;
   *       min-height: 16rem;
   *     }
   *   </css>
   *   <javascript>
   *     angular.module("bltDocs")
   *       .controller("DatePickerExCtrl", function(){
   *         var ctrl = this;
   *         ctrl.mindate = new Date();
   *         ctrl.firstview = "hours"
   *         ctrl.lastview = "month"
   *       });
   *   </javascript>
   *   <html>
   *     <div class="datepicker-example-container" ng-controller="DatePickerExCtrl as ctrl">
   *       <form class="form" novalidate name="dateTests">
   *         <div class="form-row">
   *           <blt-datepicker data-model="ctrl.dateModel"
   *                           data-label="Date Selection"
   *                           data-name="datepickerTest">
   *           </blt-datepicker>
   *           <div class="form-divider-vertical"></div>
   *           <blt-datepicker data-model="ctrl.dateModel2"
   *                           data-label="Date Selection with Restrictions"
   *                           data-min-date="ctrl.mindate"
   *                           data-first-view="{{ctrl.firstview}}"
   *                           data-name="datepickerTest2">
   *           </blt-datepicker>
   *           <div class="form-divider-vertical"></div>
   *           <blt-datepicker data-model="ctrl.dateModel3"
   *                           data-label="Date Selection Year and Month Only"
   *                           data-last-view="{{ctrl.lastview}}"
   *                           data-name="datepickerTest3"
   *                           data-format="MMMM yyyy">
   *           </blt-datepicker>
   *         </div>
   *       </form>
   *     </div>
   *   </html>
   * </example>
   *
   */
  function bltDatepicker( utils, api, $timeout, $document ) {
    var directive = {
      restrict: 'E',
      templateUrl: 'components/datepicker/datepicker.template.html',
      scope: {
        model: '=',
        name: '@',
        label: '@',
        autoFocus: '@?',
        change: '&?',
        format: '@?',
        firstView: '@?',
        lastView: '@?',
        max: '=maxDate',
        min: '=minDate',
        required: '@?',
        disabled: '=?'
      },
      link: link
    }

    return directive;

    /**
     * @private
     * @function link
     * @description
     * Linking function. We'll use this function to initialize and manage the state of the date picker. We establish
     * all of our scope functions and register event callbacks.
     *
     * @param {object} scope Our directive's isolate scope.
     * @param {DOMelement} element Our directive element.
     * @param {object} attrs The raw attributes applied to our directive.
     */
    function link( scope, element, attrs ) {

      // Set up our input element based on the attributes applied to our direcitive element.
      if ( scope.autoFocus ) {
        element.find('input').attr('autofocus', true);
      }
      if ( scope.required ) {
        element.find('input').attr('required', true);
      }

      // If the user defined a minDate binding, set the initial value of our scope minDate and set up a watcher
      // to update this value as the model binding updates.
      if ( attrs.minDate != undefined ) {
        scope.minDate = toDate(scope.min);
        if ( angular.isFunction(scope.min) ) {
          scope.$watch(function() {
            return scope.min();
          }, onMinUpdated);
        } else {
          scope.$watch(function() {
            return scope.min;
          }, onMinUpdated);
        }
      }

      // If the user defined a maxDate binding, set the initial value of our scope maxDate and set up a watcher
      // to update this value as the model binding updates.
      if ( attrs.maxDate != undefined ) {
        scope.maxDate = toDate(scope.max);
        if ( angular.isFunction(scope.max) ) {
          scope.$watch(function() {
            return scope.max();
          }, onMaxUpdated);
        } else {
          scope.$watch(function() {
            return scope.max;
          }, onMaxUpdated);
        }
      }


      // Public view state / model
      scope.active = false;
      scope.current = {};
      scope.current.view = scope.firstView || 'year';
      scope.format = scope.format ? scope.format : 'short';

      // Private view and date state
      var views = ['year', 'month', 'date', 'hours', 'minutes'];
      var step = 5;
      var now = new Date();
      var lastViewIndex = scope.lastView ? views.indexOf(scope.lastView) : (views.length - 1);
      var selectedDate = {};

      //// Public Methods //////////////////////

      scope.activate = activate;
      scope.canPickYear = canPickYear;
      scope.canPickMonth = canPickMonth;
      scope.canPickDay = canPickDay;
      scope.canPickHour = canPickHour;
      scope.canPickMinute = canPickMinute;
      scope.close = close;
      scope.isNow = isNow;
      scope.isSameDay = isSameDay;
      scope.isSameHour = isSameHour;
      scope.isSameMinutes = isSameMinutes;
      scope.isSameMonth = isSameMonth;
      scope.isSameYear = isSameYear;
      scope.next = next;
      scope.prev = prev;
      scope.setDate = setDate;

      /**
       * Activate the date picker on user click or 'Enter' keypress. Initialize our current.date scope model
       * and set up our selectedDate context model. Register 'esc' to cancel close the date picker session. This
       * function will be attached to the keypress and click listeners on our input field.
       */
      function activate(event) {
        if( !scope.disabled ) {
          if ( event.type == 'click' || (event.type == 'keypress' && event.keyCode == 13) ) {
            // set the current date
            if ( scope.model ) {
              scope.current.date = toDate(scope.model);
            } else {
              scope.current.date = new Date();
            }

            // If editing previously selected date, build the selected Date object
            // else build an empty selected date object.
            selectedDate.year = scope.model ? scope.current.date.getFullYear() : null;
            selectedDate.month = scope.model ? scope.current.date.getMonth() : null;
            selectedDate.date = scope.model ? scope.current.date.getDate() : null;
            selectedDate.hours = scope.model ? scope.current.date.getHours() : null;
            selectedDate.minutes = scope.model ? scope.current.date.getMinutes() : null;

            document.getElementById('blt-datepicker-input').blur();

            update();

            // add event listerner for keyup to close on esc keypress.
            $document.on('keyup', function( e ) {
              if ( e.keyCode == 27 ) {
                scope.close();
              }
            });
          }
        }
      };

      /**
       * Evaluates the given date and returns a boolean value dictating whether or not the year of the given date
       * falls between our specified min and max date years, if specified.
       *
       * @param date - The date to check. Should be a JavaScript date object.
       */
      function canPickYear( date ) {
        return inValidRange(date, 'year');
      }

      /**
       * Evaluates the given date and returns a boolean value dictating whether or not the year and month of the
       * given date date falls between specified min and max date year/month, if specified.
       *
       * @param date - The date to check. Should be a JavaScript date object.
       */
      function canPickMonth( date ) {
        return inValidRange(date, 'month');
      }

      /**
       * Evaluates the given date and returns a boolean value dictating whether or not the date falls between
       * our specified min and max dates, if specified.
       *
       * @param date - The date to check. Should be a JavaScript date object.
       */
      function canPickDay( date ) {
        return inValidRange(date, 'date') && date.getMonth() == scope.current.date.getMonth();
      }

      /**
       * Evaluates the given date and returns a boolean value dictating whether or not the date falls between
       * our specified min and max dates, if specified.
       *
       * @param date - The date to check. Should be a JavaScript date object.
       */
      function canPickHour( date ) {
        return inValidRange(date, 'hours');
      }

      /**
       * Evaluates the given date and returns a boolean value dictating whether or not the date falls between
       * our specified min and max dates, if specified.
       *
       * @param date - The date to check. Should be a JavaScript date object.
       */
      function canPickMinute( date ) {
        return inValidRange(date, 'minutes');
      }


      function inValidRange( date, view ) {
        var valid = true;
        if ( scope.minDate && scope.minDate.getTime() > date.getTime() ) {
          valid = isSame(scope.minDate, date, view);
        }
        if ( scope.maxDate && scope.maxDate.getTime() < date.getTime() ) {
          valid &= isSame(scope.maxDate, date, view);
        }
        return valid;
      }

      /**
       * Returns true if the given dates are the same, starting with the given view. For example, if the dates
       * Jan 2, 2016 13:32:10 and Jan 2, 2016 12:34:12 were passed in, the evaluations per view are as follows:
       *
       *  year - true
       *  month - true
       *  date - true
       *  hours - false
       *  minutes - false
       *
       *  For the minutes view to resolve to true, the given timestamps must be the same when rounded down to the
       *  next 5 minute interval.
       *
       * @param date1 - The first date to check.
       * @param date2 - The second date to check.
       * @param view - The view to use in the evaluation.
       * @returns {boolean} True if the given dates are the same in the context of the given view.
       */
      function isSame( date1, date2, view ) {
        var is = true;
        //noinspection FallThroughInSwitchStatementJS
        switch ( view ) {
          case 'minutes':
            is &= ~~(date1.getMinutes() / 5) === ~~(date2.getMinutes() / 5);
          /*falls through*/
          case 'hours':
            is &= date1.getHours() === date2.getHours();
          /*falls through*/
          case 'date':
            is &= date1.getDate() === date2.getDate();
          /*falls through*/
          case 'month':
            is &= date1.getMonth() === date2.getMonth();
          /*falls through*/
          case 'year':
            is &= date1.getFullYear() === date2.getFullYear();
        }
        return is;
      };

      /**
       * Sets the selectedDate context model with the given date based on the current view and open the next
       * view.
       * @param date - The date to pull a date component out of based on scope.current.view.
       */
      function setDate( date ) {

        switch ( scope.current.view ) {
          case 'minutes':
            if ( canPickMinute(date) ) {
              selectedDate.minutes = date.getMinutes();
              scope.current.date.setMinutes(date.getMinutes());
              openNextView();
            }
            break;
          case 'hours':
            if ( canPickHour(date) ) {
              selectedDate.hours = date.getHours();
              scope.current.date.setHours(date.getHours());
              openNextView();
            }
            break;
          case 'date':
            if ( canPickDay(date) ) {
              selectedDate.date = date.getDate();
              scope.current.date.setDate(date.getDate());
              openNextView();
            }
            break;
          case 'month':
            if ( canPickMonth(date) ) {
              selectedDate.month = date.getMonth();
              scope.current.date.setMonth(date.getMonth());
              openNextView();
            }
            break;
          case 'year':
            if ( canPickYear(date) ) {
              selectedDate.year = date.getFullYear();
              scope.current.date.setFullYear(date.getFullYear());
              openNextView();
            }
            break;
        }

      };

      /**
       * Closes the date picker. Returns focus to our input field and resets the current view. Deregisters the
       * keyup listener.
       */
      function close() {
        element.addClass('leave');

        // reset date picker after closing animation
        $timeout(function() {
          // deactivate
          scope.active = false;

          // reset view to first view
          scope.current.view = scope.firstView ? scope.firstView : 'year';

          // focus input field
          document.getElementById('blt-datepicker-input').focus();

          element.removeClass('leave');

          // remove keyup event listener
          $document.off('keyup');
        }, 300);
      };

      /**
       * Updates the current date component by the current delta based on the current view. Calling next(3) while
       * on the 'year' view will advance the date by 3 years.
       * @param delta - (Optional) The number to advance the date component by. Defaults to 1 if not provided.
       */
      function next( delta ) {
        var date = scope.current.date;
        delta = delta || 1;
        switch ( scope.current.view ) {
          case 'year':
            date.setFullYear(date.getFullYear() + delta);
            break;
          case 'month':
            date.setFullYear(date.getFullYear() + delta);
            break;
          case 'date':
            date.setMonth(date.getMonth() + delta);
            break;
          case 'hours':
          /*falls through*/
          case 'minutes':
            date.setHours(date.getHours() + delta);
            break;
        }
        update();
      }

      /**
       * Inverse of 'next'. Calling prev(3) while on the year view will subtract 3 from the currently selected
       * year.
       * @param delta - (Optional) The number to advance the date component by. Defaults to 1 if not provided.
       */
      function prev( delta ) {
        return scope.next(-delta || -1);
      };


      /**
       * Checks to see if the given date is after the time specified in the data-min-date directive attribute.
       * @param date - The date to check.
       * @returns {boolean} True if the given date is after our data-min-date directive attribute.
       */
      function isAfter( date ) {
        return !!(scope.minDate) && utils.isAfter(date, scope.minDate);
      };

      /**
       * Checks to see if the given date is prior to the time specified in the data-max-date directive attribute.
       * @param date - The date to check.
       * @returns {boolean} True if the given date is prior to our data-max-date directive attribute.
       */
      function isBefore( date ) {
        return !!(scope.maxDate) && utils.isBefore(date, scope.maxDate);
      };

      /**
       * Returns true if the year component of the given date match the year component of our selectedDate
       * context model.
       * @param date - The date to check.
       * @returns {boolean} True if date.getFullYear() === selectedDate.year.
       */
      function isSameYear( date ) {
        return selectedDate.year === date.getFullYear();
      };

      /**
       * Returns true if the month component of the given date match the month component of our selectedDate
       * context model.
       * @param date - The date to check.
       * @returns {boolean} True if date.getMonth() === selectedDate.month.
       */
      function isSameMonth( date ) {
        return selectedDate.month === date.getMonth();
      };

      /**
       * Returns true if the date (day) component of the given date match the date (day) component of our selectedDate
       * context model.
       * @param date - The date to check.
       * @returns {boolean} True if date.getDate() === selectedDate.date.
       */
      function isSameDay( date ) {
        return selectedDate.date === date.getDate();
      };

      /**
       * Returns true if the hours component of the given date match the hours component of our selectedDate
       * context model.
       * @param date - The date to check.
       * @returns {boolean} True if date.getHours() === selectedDate.hours.
       */
      function isSameHour( date ) {
        return selectedDate.hours === date.getHours();
      };

      /**
       * Returns true if the minutes component of the given date match the minutes component of our selectedDate
       * context model.
       * @param date - The date to check.
       * @returns {boolean} True if date.getMinutes() === selectedDate.minutes.
       */
      function isSameMinutes( date ) {
        return selectedDate.minutes === date.getMinutes();
      };

      /**
       * Returns true if the given date is the same as the current date in regards to the current view. For
       * example if the view is 'month' then this function will evaluate to true for any date that is within
       * the current month.
       *
       * @param date - The date to check.
       * @returns {boolean} True if the given date is determined to be the same as the current date in regards
       * to the current view.
       */
      function isNow( date ) {
        return isSame(date, new Date(), scope.current.view);
      };

      //////////////////////////////
      // Private Functions
      //////////////////////////////

      /**
       * Invoked when we identify a new value being saved into our model.
       */
      function onChange() {
        if ( scope.change ) {
          $timeout(scope.change, 0);
        }
      }

      /**
       * Updates the scope's visible date UI elements based on the current date.
       */
      function update() {
        var date = scope.current.date;

        switch ( scope.current.view ) {
          case 'year':
            scope.years = utils.getVisibleYears(date);
            break;
          case 'month':
            scope.months = utils.getVisibleMonths(date);
            break;
          case 'date':
            scope.weeks = utils.getVisibleWeeks(date);
            break;
          case 'hours':
            scope.hours = utils.getVisibleHours(date);
            break;
          case 'minutes':
            scope.minutes = utils.getVisibleMinutes(date, 5);
            break;
        }

        if ( !scope.active ) {
          scope.active = true;

          element.addClass('enter');
          $timeout(function() {
            element.removeClass('enter');
          }, 300);
        }
      }

      /**
       * Go to next view or save our current date and close date picker if we're already on the last view.
       */
      function openNextView() {
        var viewIndex = views.indexOf(scope.current.view);

        if ( (viewIndex + 1) <= lastViewIndex ) {
          scope.current.view = views[viewIndex + 1];
          update();
        } else {
          // update the model
          var newModel = scope.current.date.getTime().toString();
          if ( newModel != scope.model ) {
            scope.model = newModel;
            onChange();
          }
          // Close the date picker
          scope.close();
        }
      }

      /**
       * Updates our scope.minDate to represent the current value of scope.min.
       */
      function onMinUpdated() {
        scope.minDate = toDate(scope.min);
      }

      /**
       * Updates our scope.maxDate to represent the current value of scope.max.
       */
      function onMaxUpdated() {
        scope.maxDate = toDate(scope.max);
      }

      /**
       * Attempts to interpret the given value as a date. Incoming value can be one of: Number representing
       * milliseconds from epoch, a String containing either a formatted date, or seconds from epoch, a JavaScript
       * date object, or a function that returns one of the aforementioned formats.
       */
      function toDate( inDate ) {
        var outDate;
        if ( inDate ) {
          if ( angular.isString(inDate) ) {
            if ( isNaN(inDate) ) {
              outDate = new Date(inDate);
              if ( !utils.isValidDate(outDate) ) {
                outDate = new Date(inDate.replace(/['"]+/g, ''));
              }
            } else {
              var msFromEpoch = parseInt(inDate, 10);
              outDate = new Date(msFromEpoch);
            }
          } else if ( angular.isNumber(inDate) ) {
            outDate = new Date(~~inDate);
          } else if ( angular.isDate(inDate) ) {
            outDate = new Date(inDate.getTime());
          } else if ( angular.isFunction(inDate) ) {
            outDate = toDate(inDate());
          }
        }
        return outDate;
      }
    }
  }

  bltDatepicker.$inject = ['bltDatepickerUtils', 'BltApi', '$timeout', '$document'];

  /**
   *   filter
   * @name time
   * @desc Formats the hour and minute components of the given date into standard 24 hour time.
   * @returns {Function} Our time filter.
   *
   */
  function time() {
    function format( date ) {
      return ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
    }

    return function( date ) {
      if ( !(date instanceof Date) ) {
        date = new Date(date);
        if ( isNaN(date.getTime()) ) {
          return undefined;
        }
      }
      return format(date);
    };
  }

})();
(function() {
  'use strict'

  angular
    .module('blt_datepicker')
    .factory('bltDatepickerUtils', bltDatepickerUtils);

  /**
   * @ngdoc service
   * @name BltDatepickerUtils
   * @module blt_datepicker
   * @description Helper functions to support the {@link bltDatepicker}.
   */
  function bltDatepickerUtils() {
    var createNewDate = function( year, month, day, hour, minute ) {
      // without any arguments, the default date will be 1899-12-31T00:00:00.000Z
      return new Date(year | 0, month | 0, day | 0, hour | 0, minute | 0);
    };

    var service = {};

    service.getVisibleYears = getVisibleYears;
    service.getVisibleMonths = getVisibleMonths;
    service.getVisibleWeeks = getVisibleWeeks;
    service.getVisibleHours = getVisibleHours;
    service.getVisibleMinutes = getVisibleMinutes;
    service.isAfter = isAfter;
    service.isBefore = isBefore;
    service.isValidDate = isValidDate;

    return service;

    /**
     * @ngdoc method
     * @name BltDatepickerUtils#getVisibleYears
     * @summary Gets years to display in the years view of the open datepicker.
     * @description Gets years to display in the years view of the open datepicker.
     *
     * @param {date} date The current value of the selected date.
     *
     * @returns {array} Array of years to display in the view.
     */
    function getVisibleYears( date ) {
      date.setFullYear(date.getFullYear() - 6);
      var year = date.getFullYear();
      var years = [];
      var pushedDate;
      for ( var i = 0; i < 15; i++ ) {
        pushedDate = createNewDate(year);
        years.push(pushedDate);
        year++;
      }
      return years;
    }

    /**
     * @ngdoc method
     * @name BltDatepickerUtils#getVisibleMonths
     * @description Gets months to display in the months view of the open datepicker.
     *
     * @param {date} date The current value of the selected date.
     *
     * @returns {array} Array of months to display in the view.
     */
    function getVisibleMonths( date ) {
      var year = date.getFullYear();
      var months = [];
      var pushedDate;
      for ( var month = 0; month < 12; month++ ) {
        pushedDate = createNewDate(year, month, 1);
        months.push(pushedDate);
      }
      return months;
    }

    /**
     * @ngdoc method
     * @name BltDatepickerUtils#getVisibleWeeks
     * @description Gets weeks to display in the weeks view of the open datepicker.
     *
     * @param {date} date The current value of the selected date.
     *
     * @returns {array} Array of weeks to display in the view.
     */
    function getVisibleWeeks( date ) {
      var year = date.getFullYear();
      var month = date.getMonth();

      // set date to start of the month
      var newDate = createNewDate(year, month, 1);
      var day = 1;

      if ( newDate.getDay() !== 0 ) {
        // date is not sunday, reset to beginning of week
        var day = newDate.getDate() - newDate.getDay();
        newDate.setDate(day);
      }

      // Get the weeks of the month
      var weeks = [];
      for ( var week = 0; week < 6; week++ ) {
        // If date is new year or next month stop getting weeks
        if ( week > 4 && (newDate.getFullYear() > year || newDate.getMonth() > month) ) {
          break;
        }

        // Get days of the week
        var days = [];
        for ( var weekday = 0; weekday < 7; weekday++ ) {
          days.push(newDate);

          // next day
          day++;

          // update new date to next day
          newDate = createNewDate(year, month, day);
        }

        // Add week to weeks
        weeks.push(days);
      }
      return weeks;
    }

    /**
     * @ngdoc method
     * @name BltDatepickerUtils#getVisibleHours
     * @description Gets hours to display in the hours view of the open datepicker.
     *
     * @param {date} date The current value of the selected date.
     *
     * @returns {array} Array of hours to display in the view.
     */
    function getVisibleHours( date ) {
      date = new Date(date || new Date());
      var year = date.getFullYear();
      var month = date.getMonth();
      var day = date.getDate();
      var hours = [];
      var hour, pushedDate;
      for ( hour = 0; hour < 24; hour++ ) {
        pushedDate = createNewDate(year, month, day, hour);
        hours.push(pushedDate);
      }
      return hours;
    }

    /**
     * @ngdoc method
     * @name BltDatepickerUtils#getVisibleMinutes
     * @description Gets minutes to display in the minutes view of the open datepicker.
     *
     * @param {date} date The current value of the selected date.
     *
     * @returns {array} Array of minutes to display in the view.
     */
    function getVisibleMinutes( date, step ) {
      var year = date.getFullYear();
      var month = date.getMonth();
      var day = date.getDate();
      var hour = date.getHours();
      var minutes = [];
      var minute, pushedDate;
      for ( minute = 0; minute < 60; minute += step ) {
        pushedDate = createNewDate(year, month, day, hour, minute);
        minutes.push(pushedDate);
      }
      return minutes;
    }

    /**
     * @ngdoc method
     * @name BltDatepickerUtils#isAfter
     * @description Checks if selected date is after the current value of the model.
     *
     * @param {date} model The current value of the datepicker's model.
     * @param {date} date The selected date.
     *
     * @returns date, boolean
     */
    function isAfter( model, date ) {
      model = (model !== undefined) ? new Date(model) : model;
      date = new Date(date);
      return model && model.getTime() >= date.getTime();
    }

    /**
     * @ngdoc method
     * @name BltDatepickerUtils#isBefore
     * @description Checks if selected date is before the current value of the model.
     *
     * @param {date} model The current value of the datepicker's model.
     * @param {date} date The selected date.
     *
     * @returns date, boolean
     */
    function isBefore( model, date ) {
      model = (model !== undefined) ? new Date(model) : model;
      date = new Date(date);
      return model.getTime() <= date.getTime();
    }

    /**
     * @ngdoc method
     * @name BltDatepickerUtils#isValidDate
     * @description Checks if date is valid.
     *
     * @param {date} value A date.
     *
     * @returns boolean
     */
    function isValidDate( value ) {
      // Invalid Date: getTime() returns NaN
      return value && !(value.getTime && value.getTime() !== value.getTime());
    }
  }
})();
(function() {
  'use strict';

  /**
   * @ngdoc module
   * @name blt_fileloader
   * @description ngBoltJS File Loader module.
   *
   * @since 2.0.0
   *
   */
  angular.module('blt_fileloader', [])
    .component('bltFileloader', bltFileloader())
    .directive('bltFilemodel', bltFilemodel)
  ;

  /**
   * @ngdoc directive
   * @name bltFileloader
   * @module blt_fileloader
   *
   * @description The bltFileloader provides simple file selection capability. Upon selection, a JavaScript
   * [File](https://developer.mozilla.org/en-US/docs/Web/API/File) object representing the selected file will be set
   * into the controller model specified in the `data-model` attribute.
   *
   * <div class="note-tip">**BEST PRACTICE** The `data-` prefix is not required for ngBoltJS attributes, but is highly
   * recommended to prevent conflicts with standard HTML attributes.</div>
   *
   * @example <caption>Basic Usage</caption>
   * <example runnable="true">
   *   <javascript>
   *     angular.module('bltDocs')
   *       .controller("FileExCtrl", function(){
   *         var ctrl = this;
   *         ctrl.file = undefined;
   *       });
   *   </javascript>
   *   <html>
   *     <div ng-controller="FileExCtrl as ctrl">
   *       <form name="ctrl.myForm" class="form" novalidate>
   *           <blt-fileloader data-name="fileloader"
   *                           data-model="ctrl.file">
   *           </blt-fileloader>
   *       </form>
   *     </div>
   *   </html>
   * </example>
   *
   * @restrict E
   *
   * @param {string} data-name This attribute indicates the name of this form element and will be used during form
   * traversal by the ngBoltJS framework.
   * @param {expression} data-model This attribute is used to bind the value of this component to a property in the
   * containing scope. Functionality is based on the Angular ngModel directive.
   * @param {boolean} [data-disabled] Disables the field. Any value set in this attribute will cause the field to be
   * disabled.
   * @param {boolean} [data-autofocus] Indicates whether or not this field should autofocus on page load.
   * @param {value} [data-required] Indicates whether or not this field is required.
   * @param {value} [data-tabindex] Specifies the tab order of an element
   *
   * @requires BltApi
   */
  function bltFileloader() {
    return {
      require: {
        form: '^form'
      },
      controller: bltFileloaderController,
      controllerAs: 'File',
      templateUrl: 'components/fileloader/fileloader.template.html',
      bindings: {
        name: '@',
        data: '=model',
        label: "@",
        disabled: '=?',
        autofocus: '@',
        required: '@',
        tabindex: '@'
      }
    };
  }

  /**
   * @private
   * @name bltFileloaderController
   * @module blt_fileloader
   *
   * @description bltFileloader controller for providing display functionality to the template.
   *
   * @requires BltApi
   *
   */
  function bltFileloaderController( api ) {

    var ctrl = this;
    ctrl.$onInit = init;
    ctrl.getFileExtension = getFileExtension;
    ctrl.data = null;
    ctrl.fileExt = '';
    ctrl.charsLimit = 30;

    /**
     * @private
     * @description Handles the controller initialization. Confirm existence of required attributes and set default values
     * as needed.
     */
    function init() {
      // check input name
      if ( angular.isUndefined(ctrl.name) ) {
        api.error('missing name attribute for blt-fileloader. See: '
          + window.location + '/blt.fileloader.bltFileloader.html');
      }
    }

    /**
     * @name bltFileloaderController#getFileExtension
     * @description Get extension from currently selected file, beginning at first '.'
     */
    function getFileExtension() {
      // Make Sure There Is A File Selected
      if ( ctrl.data ) {
        // Don't Show Extension If File Name Doesn't Overflow
        if ( ctrl.data.name.length > ctrl.charsLimit ) {
          return ctrl.data.name.split(".")[ctrl.data.name.split(".").length - 1];
        } else {
          return "";
        }
      }
    };
  }

  /**
   * @name bltFilemodel
   * @module blt_fileloader
   * @description Internal file model directive. This directive provides a binding to the event that fires when a user selects
   * a file using the standard file chooser dialog provided by their browser.
   *
   * @restrict A
   *
   * @requires https://docs.angularjs.org/api/ng/service/$timeout
   */
  function bltFilemodel( $timeout ) {

    var open = false;
    var everOpened = false;
    var isInitialFileChooserSessionOpen = false;

    var directive = {
      require: ['^bltFileloader', 'ngModel'],
      restrict: 'A',
      link: link
    };

    return directive;

    /**
     * @private
     * @description Linking function to be invoked by Angular during the linking phase. We use this to attach a change listener
     * to the element this directive is attached to. (Our file input element) When the change event fires, we
     * perform some work on the selected file to pass the file information to the controller.
     *
     * @param {element} element The angular directive element
     * @param {object} ctrls The file controller that is containing this directive.
     */
    function link( scope, element, attrs, ctrls ) {

      var fileCtrl = ctrls[0];
      var ngModelCtrl = ctrls[1];
      fileCtrl.modelCtrl = ngModelCtrl;

      element.on('blur', function() {
        if ( !open ) {
          ngModelCtrl.$setTouched();
        } else if ( isInitialFileChooserSessionOpen ) {
          $timeout(function() {
            ngModelCtrl.$setUntouched();
          })
        }
      });
      element.on('click', function() {
        if ( !everOpened ) {
          everOpened = true;
          isInitialFileChooserSessionOpen = true;
        }
        document.body.onfocus = dialogClosed;
        open = true;
      });
      element.on('change', function() {
        $timeout(function() {
          ngModelCtrl.$setViewValue(element[0].files[0]);
          ngModelCtrl.$render();
          fileCtrl.fileExt = fileCtrl.getFileExtension();
        });
      });

      /**
       * @private
       * @description When the dialog is closed, we clear our document onfocus listener, and set our model controller to
       * touched so that the required validation is triggered.
       */
      function dialogClosed() {
        open = false;
        isInitialFileChooserSessionOpen = false;
        document.body.onfocus = null;
        $timeout(function() {
          ngModelCtrl.$setTouched();
        }, 50);
      }
    }
  }

  bltFilemodel.$inject = ['$timeout'];
  bltFileloaderController.$inject = ['BltApi'];
})();

(function() {
  'use strict';

  /**
   * @ngdoc module
   * @name blt_login
   * @description ngBoltJS Login module.
   * @since 2.0.0
   */
  angular.module('blt_login', ['blt_core', 'blt_auth'])
    .component('bltLogin', bltLogin());

  /**
   * @ngdoc directive
   * @name bltLogin
   * @module blt_login
   * @description The bltLogin component is injected into the application `index.html` whenever the
   * bltLogin component is enabled in `build.json`. This component will handle showing and hiding the login form/page
   * based upon the current authentication/login state of the application. Note that this login page is simply a view
   * in your single page application and does not prevent inspection of the rest of your application by an
   * unauthenticated user.
   *
   * As an ngBoltJS developer, you will have very little interaction with this component. It will simply be injected and
   * work with your configured authentication service to provide a UI for user authentication.
   *
   * @restrict E
   *
   * @requires BltApi
   * @requires BltAuth
   * @requires https://docs.angularjs.org/api/ng/service/$timeout
   * @requires https://docs.angularjs.org/api/ng/service/$interval
   *
   */
  function bltLogin() {

    return {
      bindings: {},
      templateUrl: 'components/login/login.template.html',
      controller: bltLoginController
    };
  }

  /**
   * @private
   * @name bltLoginController
   * @module blt_login
   * @description Controller for the bltLogin component
   *
   * @requires BltApi
   * @requires BltAuth
   * @requires https://docs.angularjs.org/api/ng/service/$timeout
   * @requires https://docs.angularjs.org/api/ng/service/$interval
   *
   */
  function bltLoginController( bltApi, bltAuth, $timeout, $interval ) {

    var terminated = false;
    var monitorInterval = undefined;
    var pristine = true;

    var ctrl = this;
    ctrl.$onInit = init;
    ctrl.$onDestroy = terminate;
    ctrl.show = show;
    ctrl.hide = hide;
    ctrl.reload = reload;
    ctrl.available = false;
    ctrl.pristine = pristine;
    ctrl.shown = false;
    ctrl.login = {
      username: undefined,
      password: undefined
    }
    /**
     * @private
     * @description Handles the controller initialization. Confirm existence of required attributes and set default values
     * as needed.
     */
    function init() {
      bltAuth.connect().then(function() {
        bltAuth.hasCredentials().then(hide, show).finally(monitorAuthentication);
      });

      ctrl.error = {show: false, message: ""};

      bltApi.subscribe('login', function( msg ) {
        if ( msg === 'show' ) {
          show();
        } else if ( msg === 'hide' ) {
          hide();
        } else if ( msg === 'state_query' ) {
          if ( ctrl.shown ) {
            bltApi.publish('login', 'showing');
          } else {
            bltApi.publish('login', 'hidden');
          }
        }
      });

      //Wire a function to the scope submitLogin which will be linked to the login button in the UI
      ctrl.submitLogin = function() {
        bltAuth.login(ctrl.login.username, ctrl.login.password).then(
          function() {
            bltApi.publish("login", "success");
            hide();
          },
          function() {
            ctrl.error.message = 'Unable to login because the username and/or password was incorrect.';
            ctrl.error.show = true;
          }
        );
      }

      //Set up the monitor function to run every 2 seconds.
      monitorInterval = $interval(monitorAuthentication, 2000);

      bltApi.publish("bltAuth", "evaluate");

      ///////////////////
    }

    /**
     * @name bltLoginController#show
     * @description If the login UI is not currently showing, show the UI and publish an event on the bltApi to indicate
     * that the login UI has been shown.
     */
    function show() {
      if ( !ctrl.shown ) {
        if ( !pristine ) {
          $timeout(reload, 1000);
        }
        ctrl.login = {
          username: undefined,
          password: undefined
        }
        ctrl.error = {
          show: false,
          message: ""
        }
        bltAuth.available().then(function() {
          ctrl.available = true;
        }, function() {
          ctrl.available = false;
          ctrl.error.message = 'Unable to login. Authentication service is unavailable.';
          ctrl.error.show = true;
        });
        $timeout(function() {
          ctrl.shown = true;
        });
        bltApi.publish('login', 'showing');
      }
    };

    /**
     * @name bltLoginController#hide
     * @description If the login UI is currently showing, hide the UI and publish an event on the bltApi to indicate that
     * the login UI has been hidden.
     */
    function hide() {
      if ( pristine ) {
        pristine = false;
        $timeout(function() {
          ctrl.pristine = pristine;
        }, 500);
      }
      if ( ctrl.shown ) {
        $timeout(function() {
          ctrl.login = {
            username: undefined,
            password: undefined
          };
          ctrl.error = {
            show: false
          };
          ctrl.shown = false;
        }, 500);
        bltApi.publish('login', 'hidden');
      }
    };

    function reload() {
      window.location.reload(true)
    }

    /**
     * @name bltLoginController#monitorAuthentication
     * @description Checks for the existence of login credentials in the bltAuth service. If we have credentials, we should
     * hide the login UI, otherwise we should show the login UI.
     */
    function monitorAuthentication() {
      if ( !terminated ) {
        if ( ctrl.shown ) {
          bltAuth.available().then(function() {
            ctrl.available = true;
          }, function() {
            ctrl.available = false;
          })
        }
        bltAuth.hasCredentials().then(function() {
          hide();
        }, function() {
          $timeout(function() {
            if ( !ctrl.shown ) {
              show();
            }
          }, 500);
        });
      }
    };

    /**
     * @name bltLoginController#terminate
     * @description Invoked on $scope.$destroy. Sets a flag to tell the monitoring and subscriptions to shut down.
     */
    function terminate() {
      terminated = true;
      bltApi.unsubscribe('login');
      $interval.cancel(monitorInterval);
    };
  }

  bltLoginController.$inject = ['BltApi', 'BltAuth', '$timeout', '$interval'];
})();

(function() {
  'use strict';

  /**
   * @ngdoc module
   * @name blt_modal
   * @description ngBoltJS Modal component.
   * @since 1.0.0
   */
  angular
    .module('blt_modal', [])
    .directive('bltModal', bltModal);

  /**
   * @ngdoc directive
   * @name bltModal
   * @module blt_modal
   * @since 1.0.0
   * @restrict EA
   *
   * @description
   * The bltModal component is used for simple confirmation dialog boxes, selection menus, simple forms, or
   * larger dialogs that can contain tables, lists, and complex forms.
   *
   * Modals consist of a `.modal-overlay` element
   * that covers and darkens the rest of the application window and a `.modal` element that serves as dialog window
   * and contains the content of the modal. Both fade in and out when opening/closing. The presentation of the modal
   * options can be customized through the attributes, class elements, and modifiers supported on this component.
   *
   * <div class="note-tip">
   * **Best Practice** Keep the HTML template of your modal in an HTML partial file and load into the `.modal-content`
   * using [ng-include](https://docs.angularjs.org/api/ng/directive/ngInclude). You may optionally assign a
   * controller for your modal on the `.modal-content` element as well.
   * </div>
   *
   * @requires BltApi
   * @requires https://docs.angularjs.org/api/ng/service/$timeout
   *
   * @param {string} id Required in order for you to open and close the modal using the {@link BltApi} pub/sub methods.
   * @param {string} [data-size=small] You can set the size of your modal. Valid values are `x-small`, `small`, `medium`, `large` and `full-screen`.
   * @param {expression} [data-flip] An Angular expression. If the expression evaluates to true, the modal will have a front and back side and use a flipping animation to toggle between the two.
   *
   * @classname {element} modal-content The element that contains your code for the modal. Add this inside the `blt-modal` directive opening and closing tag and use the [ng-include](https://docs.angularjs.org/api/ng/directive/ngInclude) directive to load the rest of your modal content from a HTML partial. Used on an HTML `<div>`, `<section>`, or `<form>` tag.
   *
   * @classname {element} modal-body The main content of a modal. The `.modal-body` has padding by default that can be removed by adding the `.modal-collapse` modifier - useful for modals containing menus, tables, forms, and lists. Should be used on the HTML `<div>` or `<section>` tags.
   *
   * @classname {element} [modal-header] The header of the modal containing the `.modal-title` and optional buttons or icons. The `.modal-header` element should only be used on modals that contain other components. Modals that contain a simple text message do not need a `.modal-header`. The `.modal-header` can be divided into sections using grid elements. Should be used on an HTML `<header`> tag.
   *
   * @classname {element} [modal-footer] Contains actions for the modal. Should be used on the HTML `<footer>` tag. By default the `.modal-footer` has no top border. For simple modals with only a short text message a border is not necessary, and sometimes when using menus, lists, or tables the top border was duplicated. If you need a top border on the footer element add the `.edge-top` utility class.
   *
   * @classname {element} [modal-title] The title of the modal. Must be contained inside the `.modal-header` or sectioning elements within the `.modal-header`. Should be used on an HTML `<h2>` tag.
   *
   * @classname {element} [modal-heading] A heading element for sectioning the `.modal-body` content. Should be used on an HTML `<h3>` tag. If the `.modal-body` is collapsed, add the `.grid-wrapper` modifier to add padding around the heading.
   *
   * @classname {element} [modal-text] Default text for the modal. Use this on any text content inside the `.modal-body`. Should be used on the HTML `<p>` tag. If the `.modal-body` is collapsed, add the `.grid-wrapper` modifier to add padding around the text.
   *
   * @classname {element} [modal-divider] A thick horizontal border for sectioning `.modal-body` content. Only use if not using a `.modal-heading`. Should be used on an HTML `<hr>` tag.
   *
   * @classname {element} [modal-btn-text] Default text button for modal secondary actions. Should be used on the HTML `<button>` tag. For primary actions, use `.modal-btn-text-submit`.
   *
   * @classname {element} [modal-btn-icon] Icon button for modals, most often placed in the `.modal-header` or `.modal-body`. Should be used on the HTML `<button>` tag.
   *
   * @classname {element} [modal-btn-solid] Default solid button for modal secondary actions. Should only be used in the `.modal-body`. Should be used on the HTML `<button>` tag. For primary actions, use `.modal-btn-solid-submit`.
   *
   * @classname {element} [modal-front] The front side of a flipping modal. Must be a direct child of the `.modal-content` element. **Required if `data-flip` is true.**
   *
   * @classname {element} [modal-back] The back side of a flipping modal. Must be a direct child of the `.modal-content` element. **Required if `data-flip` is true.**
   *
   * @classname {modifier} [modal-collapse] Removes padding from the `.modal-body` element.
   * @classname {modifier} [modal-overflow] Prevents absolutely positioned elements (like the options list of a searchable {@link bltDropdown} component) from being hidden by the `.modal-body` overflow or causing it to scroll. Add to the `.modal-body` element.
   *
   * @example <caption>To use the bltModal component in your ngBoltJS application, include a blt-modal
   * element in an HTML partial of your application.</caption>
   * <example>
   *   <html>
   *     <blt-modal id="myModal" data-size="small">
   *       <div class="modal-content" ng-include="'partials/module/partial.template.html'" ng-controller="MyPanelController as MyPanel"></div>
   *     </blt-modal>
   *   </html>
   * </example>
   *
   * @example <caption>ngBoltJS has a custom directive for easily opening and closing modals and other components.
   * Simply pass the id of the modal you'd like open/close.</caption>
   * <example>
   *   <html>
   *     <button blt-open="myModal">Open</button>
   *     <button blt-close="myModal">Close</button>
   *
   *     <!--If the close button is inside the modal component, you do not have to pass the id of the modal.-->
   *     <footer class="modal-footer">
   *       <button blt-close="">Close</button>
   *     </footer>
   *   </html>
   * </example>
   *
   * @example <caption>Often you may need to do some other work/set-up in your code before opening the modal. In that case, you
   * can use the pub/sub service of the ngBoltJS API to open and close the modal instead of the blt-open and blt-close directives.</caption>
   * <example>
   *   <javascript>
   *   angular.module('myApp')
   *     .controller('MainController', MainController);
   *   // You must inject the ngBoltJS API into the controller to open and close modals via the pub/sub methods.
   *   MainController.$inject = ['BltApi'];
   *   function MainController(bltApi) {
   *     var ctrl = this;
   *
   *     ctrl.openMyModal = function(){
   *       // Do some work here first...
   *
   *       // When ready, publish the id of the modal you wish to open
   *       bltApi.publish('myModal', 'open');
   *     }
   *   }
   *   </javascript>
   * </example>
   *
   * @example <caption>When closing a modal, include any functions to reset data inside a $timeout to run after the
   * closing animation of the modal to avoid resetting data and 'flashing' the modal content as it animates out.</caption>
   * <example>
   *   <javascript>
   *   MainController.$inject = ['BltApi', '$timeout'];
   *   function MainController(bltApi, $timeout) {
   *     var ctrl = this;
   *
   *     ctrl.modal = { title: 'My Modal', pending: true };
   *
   *     ctrl.closeMyModal = function(){
   *       // publish the id of the modal you wish to close
   *       bltApi.publish('myModal', 'close');
   *
   *       // reset modal data after the closing animation
   *       $timeout(function(){
   *         ctrl.modal.title = '';
   *         ctrl.modal.pending = false;
   *       }, 350);
   *     }
   *   }
   *   </javascript>
   * </example>
   *
   * @example <caption>Most of the time, you will want to keep the markup of your modal-content  in a separate file and load it
   * as a partial. This is easily done using the ng-include directive on the modal-content element.</caption>
   * <example>
   *   <html>
   *     <!--main.template.html-->
   *     <blt-modal id="mediumModal" data-size="medium">
   *       <div class="modal-content" ng-include="'partials/main/medium-modal.template.html'"></div>
   *     </blt-modal>
   *   </html>
   * </example>
   *
   * @example
   * <example>
   *   <html>
   *     <!--medium-modal.template.html-->
   *     <header class="modal-header">
   *       <h2 class="modal-title">Select an Item</h2>
   *     </header>
   *     <!--Modal body's have padding by default, use the .modal-collapse class to remove padding when using menus, lists, tables, etc.-->
   *     <div class="modal-body modal-collapse">
   *       <ul class="menu"> ... </ul>
   *     </div>
   *     <footer class="modal-footer">
   *       <button class="modal-btn-text" ng-click="Main.closeModal()">Close</button>
   *     </footer>
   *   </html>
   * </example>
   *
   * @example <caption>Place all content into the modal-content element. Use the modal-header, modal-body, and modal-footer
   * elements to organize your content.</caption>
   * <example>
   *   <html>
   *     <blt-modal id="myModal" data-size="small">
   *       <div class="modal-content">
   *         <header class="modal-header">
   *           <h2 class="modal-title">My Modal</h2>
   *         </header>
   *
   *         <div class="modal-body">
   *           <p class="modal-text">Some simple content here, maybe asking for confirmation before taking an action.
   *         </div>
   *
   *         <footer class="modal-footer">
   *           <button class="modal-btn-text" ng-click="Main.closeModal()">Cancel</button>
   *           <!-- Use a 'submit' button for 'primary' actions. Use regular buttons for 'secondary' actions (e.g. Cancel or Close)-->
   *           <button class="modal-btn-text-submit" ng-click="Main.confirmModal()">Confirm</button>
   *         </footer>
   *       </div>
   *     </blt-modal>
   *   </html>
   * </example>
   *
   * @example <caption>X-small and small are good for pop-up windows or confirmation dialogs. Using headers on these 
   * sized modals is not recommended as the title is often redundant to the modal content.</caption>
   * <example>
   *   <html>
   *     <blt-modal id="xsmallModal" data-size="x-small">
   *       <div class="modal-content">
   *         <div class="modal-body">
   *           <p class="modal-text">Are you sure you want to do what you are about to do? This action can not be undone.</p>
   *         </div>
   *
   *         <footer class="modal-footer">
   *           <button class="modal-btn-text" ng-click="Main.closeModal()">Close</button>
   *           <button class="modal-btn-text-submit" ng-click="Main.confirmAction()">Delete</button>
   *         </footer>
   *       </div>
   *     </blt-modal>
   *   </html>
   * </example>
   *
   * @example <caption>Medium modals are a good size for menus and lists.</caption>
   * <example>
   *   <html>
   *     <blt-modal id="mediumModal" data-size="medium">
   *       <div class="modal-content">
   *         <header class="modal-header">
   *           <h2 class="modal-title">Select an Item</h2>
   *         </header>
   *
   *         <!-- Modal body's have padding by default, use the .collapse class to remove padding when using menus, lists, tables, etc. -->
   *         <div class="modal-body modal-collapse">
   *           <p class="modal-text">This is some modal text. It's often useful to use the .modal-divider element to section content in a modal.</p>
   *           <hr class="modal-divider"></hr>
   *           <ul class="menu"> ... </ul>
   *         </div>
   *
   *         <!-- Use the utility class .edge-top to add a border on the top of footers for larger modals -->
   *         <footer class="modal-footer edge-top">
   *           <button class="modal-btn-text" ng-click="Main.closeModal()">Close</button>
   *         </footer>
   *       </div>
   *     </blt-modal>
   *   </html>
   * </example>
   *
   * @example <caption>Large modals are good for more complex content, such as tables. Full screen modals expand to the full size of
   * the window except for 1.5rem of padding around the edge to maintain the modal look.</caption>
   * <example>
   *   <html>
   *     <blt-modal id="tableModal" data-size="full-screen">
   *       <div class="modal-content">
   *         <header class="modal-header">
   *           <h2 class="modal-title">Data Table</h2>
   *         </header>
   *
   *         <div class="modal-body modal-collapse">
   *           <table class="table table-collapse"> ... </table>
   *         </div>
   *
   *         <!-- Use the utility class .edge-top to add a border on the top of footers for larger modals -->
   *        <footer class="modal-footer edge-top">
   *           <button class="modal-btn-text" ng-click="Main.closeModal()">Close</button>
   *         </footer>
   *       </div>
   *     </blt-modal>
   *   </html>
   * </example>
   *
   * @example <caption>You can place tables in modals. Add the `.table-collapse` class to any `.table` when you do so the table fills
   * up available width of the modal.</caption>
   * <example>
   *   <html>
   *     <blt-modal id="tableModal" data-size="large">
   *       <div class="modal-content">
   *         <header class="modal-header">
   *           <h2 class="modal-title">My Modal</h2>
   *         </header>
   *
   *         <!-- By default, modal bodies have padding. Add the .modal-collapse class to remove padding when adding content such as tables or menus in the modal body. -->
   *         <div class="modal-body modal-collapse">
   *           <table class="modal-table table-collapsed"> ... </table>
   *         </div>
   *
   *         <footer class="modal-footer">
   *           <button class="modal-btn-text" ng-click="Main.closeModal()">Close</button>
   *           <!-- Use a 'submit' button for 'primary' actions (e.g. 'Save', 'Done'). Use regular buttons for 'secondary' actions (e.g. 'Cancel' or 'Close')-->
   *           <button class="modal-btn-text-submit" ng-click="Main.saveModal()">Save</button>
   *         </footer>
   *       </div>
   *     </blt-modal>
   *   </html>
   * </example>
   *
   * @example <caption>You can also divide a modal's header into sections using basic grid classes. For instance, if you wanted to add
   * a button in the header for an action that might not make sense in the footer. This is usually applicable in large
   * and full-screen modals.</caption>
   * <example>
   *   <html>
   *     <header class="modal-header">
   *       <div class="grid-block grid-align-center">
   *         <h2 class="title">My Modal</h2>
   *       </div>
   *       <div class="grid-block grid-shrink">
   *         <button class="btn-link" ng-click="Main.editModal()">Edit</button>
   *       </div>
   *     </header>
   *   </html>
   * </example>
   *
   * @example <caption>A flipping modal has a front and back that allows you to have two sections in one modal, making a great application for forms.</caption>
   * <example>
   *   <html>
   *     <!-- NOTE: In order for the flip animation to work correctly, both sides of the modal will be locked to the same height. Do not override the height value in your css as the flip animation will no longer work properly. -->
   *     <blt-modal id="flipModal" data-flip="true" data-size="x-small">
   *       <div class="modal-content">
   *
   *         <!-- Front -->
   *         <div class="modal-front">
   *           <header class="modal-header">
   *             <h2 class="modal-title">Flip Modal Front</h2>
   *           </header>
   *           <section class="modal-body">
   *             <p class="modal-text">This is the front of a flippin' modal</p>
   *           </section>
   *           <footer class="modal-footer edge-top">
   *             <button class="modal-btn-text-submit" ng-click="Main.flipModal('flipModal')">Over</button>
   *           </footer>
   *         </div>
   *
   *         <!-- Back -->
   *         <div class="modal-back">
   *           <header class="modal-header">
   *             <h2 class="modal-title">Flip Modal Back</h2>
   *           </header>
   *           <section class="modal-body">
   *             <p class="modal-text">This is the back of a flippin' modal.</p>
   *           </section>
   *           <footer class="modal-footer edge-top">
   *             <button class="modal-btn-text" ng-click="Main.flipModal('flipModal')">Back</button>
   *             <button class="modal-btn-text-submit" blt-close="">Close</button>
   *           </footer>
   *         </div>
   *       </div>
   *     </blt-modal>
   *   </html>
   * </example>
   *
   * @example <caption>To flip a modal, pass the id of the modal in an API call in your controller.</caption>
   * <example>
   *   <javascript>
   *   function flip(modalId){
   *     bltApi.publish(modalId, 'flip');
   *   }
   *   </javascript>
   * </example>
   *
   * @example <caption>Often you may want to have a small form in a modal. In order to tap into the default AngularJS
   * functionality of validating and submitting forms, you must use the form tag on the `.modal-content` element.</caption>
   * <example>
   *   <html>
   *     <blt-modal id="myFormModal">
   *       <form class="modal-content" ng-submit="Main.submitMyModal()" novalidate>
   *         <header class="modal-header">
   *           <h2 class="modal-title">My Form Modal</h2>
   *         </header>
   *         <div class="modal-body">
   *           <!-- Some Form Controls -->
   *         </div>
   *         <footer class="modal-footer">
   *           <!-- No ng-click needed as form will submit using expression of the ng-submit direction on button click or pressing 'Enter'-->
   *           <button class="modal-btn-text-submit">Submit</button>
   *         </footer>
   *       </form>
   *     </blt-modal>
   *   </html>
   * </example>
   *
   */
  function bltModal( api, $timeout ) {
    var directive = {
      restrict: 'EA',
      scope: {
        size: '@'
      },
      templateUrl: 'components/modal/modal.template.html',
      transclude: true,
      compile: compile
    };

    return directive;

    /**
     * Compile function invoked by Angular during the compilation phase. The only thing we do here is register our
     * pre and post link functions.
     *
     * @returns {{pre: preLink, post: postLink}} Our pre and post link functions.
     */
    function compile( tElem, tAttrs ) {
      var type = 'modal';

      if ( tAttrs.flip ) {
        if ( tAttrs.size == 'full-screen' ) {
          api.error('You can not use the flip animation on full-screen modals.');
        } else {
          tElem.addClass('modal-flip');
        }
      }

      return {
        pre: preLink,
        post: postLink
      };

      /**
       * Pre Link function. We use this function to analyze directive attributes and apply them to our scope or
       * warn the user about mis-use if necessary.
       *
       * @param scope - Our isolate scope.
       * @param element - The outermost element of our directive.
       * @param attrs - The raw html attributes applied to our directive.
       */
      function preLink( scope, element, attrs ) {
        attrs.$set('blt-closable', type);

        var sizes = {
          'x-small': 'modal-x-small',
          small: 'modal-small',
          medium: 'modal-medium',
          large: 'modal-large',
          'full-screen': 'modal-full'
        };

        scope.classes = [];

        scope.size = scope.size || 'small';

        scope.classes.push(sizes[scope.size]);
      }

      /**
       * Post Link function. We now set our scope state to closed and not-flipped and subscribe to the Bolt API for
       * actions on our modal.
       *
       * @param scope - Our isolate scope.
       * @param element - The outermost element of our directive.
       * @param attrs - The raw html attributes applied to our directive.
       */
      function postLink( scope, element, attrs ) {
        scope.active = false;
        scope.flipping = false;
        scope.flipped = false;

        api.subscribe(attrs.id, function( msg ) {
          // Update scope  - wrap in $timeout to apply update to scope
          $timeout(function() {
            if ( msg == 'open' ) {
              if ( !scope.active ) {
                scope.active = true;
              }
            } else if ( msg == 'close' ) {
              if ( scope.active ) {
                scope.active = false;
                $timeout(function() {
                  scope.flip = false;
                }, 300);
              }
            } else if ( msg == 'toggle' ) {
              scope.active = !scope.active;
            } else if ( msg == 'flip' ) {
              scope.flipping = !scope.flipping;

              if ( scope.flipping ) {
                $timeout(function() {
                  scope.flipped = !scope.flipped;
                }, 900);
              } else {
                scope.flipped = false;
              }
            }
          });
        });
      }
    }
  }

  bltModal.$inject = ['BltApi', '$timeout'];
})();
(function() {
  'use strict';

  /**
   * @ngdoc module
   * @name blt_notifications
   * @description ngBoltJS Notifications component.
   * @since 1.0.0
   */
  angular
    .module('blt_notifications', [])
    .component('bltNotifications', bltNotifications());

  /**
   * @ngdoc directive
   * @name bltNotifications
   * @module blt_notifications
   * @since 1.0.0
   *
   * @description The bltNotifications component is used to display
   * [toast notifications](http://developer.android.com/guide/topics/ui/notifiers/toasts.html) in the bottom left corner
   * of your ngBoltJS application. This component will subscribe to a `notify` subscription and will open as many
   * notification panels as necessary to present all current notifications. When a notification is received on that
   * subscription, a new notification panel will be presented with an `OK` button and, optionally, a callback button
   * depending on the configuration of the notification.
   *
   * <div class="note-info">
   * **Note** The {@link BltApi} must be injected into your controller in order to publish messages.
   * </div>
   *
   * @requires BltApi
   * @requires https://docs.angularjs.org/api/ng/service/$timeout
   *
   * @usage
   * <caption>To use the Notifications, include the component in your `main.template.html` file or any view
   * template and publish them via the Bolt API.</caption>
   * ```html
   * <blt-notifications></blt-notifications>
   * ```
   * <caption>To publish a notification, use the ngBoltJS API {@link BltApi#publish} method, using `'notify'` as your
   * first parameter.The second argument should be your notification in the format shown below. The `text` of the
   * notification will be presented, along with an OK button that the user can click to dismiss the notification. If
   * the `callback` is defined, the `text` of the `callback` will be presented in the notification beside the `OK`
   * button. A user click of the callback button will publish the `action` on the `name` channel and close the
   * notification. If the `callback` is not defined, the notification will auto-dismiss after 5 seconds.</caption>
   *
   * ```js
   * {
   *     text: "text to be displayed",
   * 
   *     //Optional
   *     callback: { 
   *         name: "name to use when publishing this action"
   *         action: "anything. the contents of action will be passed as the second 
   *                  argument to publish when the callback is published."
   *         text: "label for button that will invoke our action function"
   *     }
   * }
   * ```
   *
   * @example
   * <example runnable="true">
   *   <javascript>
   *     angular.module("bltDocs")
   *       .controller("NotifyExCtrl", NotifyExCtrl)
   *     ;
   *     NotifyExCtrl.$inject = ["BltApi"];
   *     function NotifyExCtrl(bltApi){
   *       var ctrl = this;
   *       //Create a controller function to publish a simple notification.
   *       ctrl.simpleNotify = function(){
   *         var notification = {
   *           text: 'Successfully completed request.'
   *         }
   *         bltApi.publish('notify', notification);
   *       }
   *       //Create controller function to publish a notification with a callback.
   *       ctrl.notifyWithCallback = function(){
   *         var notification = {
   *           text: 'Failed to complete request.',
   *           callback: {
   *             name: 'notifyCallbackEx',
   *             action: {
   *               error: "Error Message"
   *             },
   *             text: 'handle error'
   *           }
   *         }
   *         bltApi.publish('notify', notification);
   *       }
   *       //Subscribe to the 'notifyCallbackEx' channel to handle notification callbacks from the above notification.
   *       bltApi.subscribe('notifyCallbackEx', function(notificationAction){
   *         alert(notificationAction.error);
   *       });
   *     }
   *   </javascript>
   *   <html>
   *     <div class="grid-block grid-center" ng-controller="NotifyExCtrl as ctrl">
   *       <button class="btn-solid" ng-click="ctrl.simpleNotify()">Simple Notification</button>
   *       <button class="btn-solid" ng-click="ctrl.notifyWithCallback()">Notify with Callback</button>
   *     </div>
   *     <blt-notifications></blt-notifications>
   *   </html>
   * </example>
   */
  function bltNotifications() {
    return {
      templateUrl: 'components/notifications/notifications.template.html',
      controller: bltNotificationsController
    };
  }

  // Inject required dependencies
  bltNotificationsController.$inject = ['BltApi', '$timeout'];

  /**
   * @private
   * @name bltNotificationsController
   * @module blt_notifications
   * @description Controller for bltNotifications component
   *
   * @requires BltApi
   * @requires https://docs.angularjs.org/api/ng/service/$timeout
   *
   */
  function bltNotificationsController( api, $timeout ) {

    var ctrl = this;
    ctrl.$onInit = init;
    ctrl.$onDestroy = destroy;

    /**
     * @private
     * @desc initial function to begin process of subscribing to/creating notifications
     */
    function init() {
      // public properties
      ctrl.notifications = {};

      // public methods
      ctrl.dismiss = dismiss;
      ctrl.resolve = resolve;
      ctrl.startTimer = startTimer;

      // listen for new notifications
      api.subscribe('notify', create);
      api.subscribe('get notifications', get);
    }

    /////////////////////////////////////////////////
    // Public Functions
    /////////////////////////////////////////////////

    /**
     * @name bltNotificationsController#dismiss
     * @description Close the notification associated with the given ID.
     * @param id - The id of the notification to close.
     */
    function dismiss( id ) {
      ctrl.notifications[id].show = false;
      delete ctrl.notifications[id];
    };

    /**
     * @name bltNotificationsController#create
     * @description Create a new notification based on the given notification configuration.
     * @param notification - The notication to present. Should conform to notification data structure.
     */
    function create( notification ) {
      notification.id = api.uuid();
      notification.show = true;

      // Add to notifications array
      $timeout(function() {
        ctrl.notifications[notification.id] = notification;

        if ( notification.hasOwnProperty('callback') === -1 || notification.callback === null || notification.callback === undefined ) {
          startTimer(notification.id);
        }
      })
    };

    /**
     * @name bltNotificationsController#get
     * @description Get the current list of notification and return in callback.
     * @param callback - The function to call passed in your published message.
     */
    function get( callback ) {
      $timeout(function() {
        callback(ctrl.notifications);
      });
    };

    /**
     * @name bltNotificationsController#resolve
     * @description Publish the callback for the notification associated with the given id and dismiss the notification. This
     * method is invoked by clicking on the callback button in the notification.
     * @param id - The id of the notification to resolve.
     */
    function resolve( id ) {
      api.publish(ctrl.notifications[id].callback.name, ctrl.notifications[id].callback.action);
      dismiss(id);
    };

    /////////////////////////////////////////////////
    // Private Functions
    /////////////////////////////////////////////////

    /**
     * @private
     * @description Start a timer to auto-close the notification associated with the given id in 5 seconds.
     * @param id - The id of the notification to dismiss after 5 seconds.
     */
    function startTimer( id ) {
      $timeout(function() {
        if ( ctrl.notifications.hasOwnProperty(id) && ctrl.notifications[id].show ) {
          dismiss(id);
        }
      }, 5000);
    };

    /**
     * @private
     * @description Unsubscribe from notifications when our component is destroyed.
     */
    function destroy() {
      api.unsubscribe('notify');
      api.unsubscribe('get notifications');
      delete ctrl.notifications;
    };
  }
})();

(function() {
  'use strict';

  /**
   * @ngdoc module
   * @name blt_panel
   * @description ngBoltJS Panel component.
   * @since 1.0.0
   */
  angular.module('blt_panel', ['blt_core'])
    .directive('bltPanel', bltPanel);


  /**
   * @ngdoc directive
   * @name bltPanel
   * @module blt_panel
   * @restrict EA
   * @since 1.0.0
   *
   * @description
   * The bltPanel component is used for displaying menus, forms, small tables, and related content.
   * Panels consist of two auto-generated elements: `.panel-overlay` and `.panel`. The `.panel-overlay` fades
   * in and covers and darkens the application window when the panel is open. The `.panel` slides in from the
   * right, top, left, or bottom. The presentation of the panel can be customized through the attributes,
   * class elements, and modifiers supported on the component.
   *
   * <div class="note-tip">
   * **Best Practice** Keep the HTML template of your panel in an HTML partial file and load into the
   * `.panel-content` element using [ng-include](https://docs.angularjs.org/api/ng/directive/ngInclude).
   * </div>
   *
   * You may optionally assign a controller for your panel on the `.panel-content` element as well.
   *
   * <div class="note-tip">
   * **Best Practice** Place your panel as a direct child of the `main.template.html` and give the panel its own controller.
   * </div>
   *
   * @requires BltApi
   * @requires https://docs.angularjs.org/api/ng/service/$timeout
   *
   * @param {string} id Required in order for you to open and close the panel using the {@link BltApi} pub/sub methods.
   * @param {string} [data-position=right] You can set the position of your panel. Valid values are: `right`, `left`, `top`, and `bottom`.
   * @param {string} [data-fixed] If the panel is nested inside a {@link bltView}, set to true to expand panel to the full height (or width if position is top or bottom) of the application window. The panel expands to the constraints of its parent.
   *
   * @classname {element} panel-content The element that contains your code for the panel. Add this inside the `blt-panel` component opening tag and closing tags. Use [ng-include](https://docs.angularjs.org/api/ng/directive/ngInclude) to load the rest of your panel content from an HTML partial. Use on an HTML `<div>`, `<section>`, or `<form>` tag.
   *
   * @classname {element} panel-body The main content of the panel. The `.panel-body` does not have padding by default. To add padding, use the `.panel-wrapper` modifier. Should be used on the HTML `<div>` or `<section>` tags.
   *
   * @classname {modifier} [panel-wrapper] The `.panel-body` has no padding by default as most components to be placed in a panel (such as forms and menus) require no padding. To add padding around text elements, add the `.panel-wrapper` class to the text element or on a containing `<div>`.
   *
   * @classname {element} [panel-header] The header of the panel containing the `.panel-title` and optional buttons or icons. Should be used on an HTML `<header>` tag.
   *
   * @classname {element} [panel-footer] Contains action buttons for the panel. Should be used on an HTML `<footer>` tag. By default, has no top-border. Menus, lists, forms, or tables used in a panel often have a border and another border on the footer would be redundant. If a border is needed, use the `.edge-top` utility class.
   *
   * @classname {element} [panel-title] The title of the panel. Must be a child of the `.panel-header` element and should be used on an HTML `<h2>` tag.
   *
   * @classname {element} [panel-heading] A heading element for sectioning content in the `.panel-body`. Should be used on an HTML `<h3>` tag. Add a `.panel-wrapper` class on the element to add padding around the heading unless the `.panel-body` already has `.panel-wrapper` on it.
   *
   * @classname {element} [panel-text] Default text for the panel. Use this on any text content inside the `.panel-body`. Should be used on the HTML `<p>` tag. If there is no `.panel-wrapper` on the `.panel-body`, use the `.panel-wrapper` class on the text to add padding.
   *
   * @classname {element} [panel-divider] A thick horizontal border for sectioning `.panel-body` content. Only use if not using a `.panel-heading`. Should be used on an HTML `<hr>` tag.
   *
   * @classname {element} [panel-btn-text] Default text button for panel secondary actions. Should be used on the HTML `<button>` tag. For primary actions use `.panel-btn-text-submit`.
   *
   * @classname {element} [panel-btn-icon] Icon button for panels, most often used in the `.panel-body`. Should be used on the HTML `<button>` tag.
   *
   * @classname {element} [panel-btn-solid] Default solid button for panel secondary actions. Should only be used in the `.panel-body`. Should be used on the HTML `<button>` tag. For primary actions, use `.panel-btn-solid-submit`.
   *
   * @example <caption>To use the Panel component in your ngBoltJS application, include a
   * `blt-panel` element in an HTML partial of your application. Most of the time, you will want to keep the markup
   * of your `.panel-content` in a separate file and load it as a partial. This is easily done using
   * [ng-include](https://docs.angularjs.org/api/ng/directive/ngInclude) on the `.panel-content element`.</caption>
   * <example>
   *   <html>
   *     <blt-panel id="myPanel" data-position="right">
   *       <div class="panel-content"
   *            ng-include="'partials/module/my-panel.template.html'"
   *            ng-controller="PanelController as ctrl"></div>
   *     </blt-panel>
   *   </html>
   * </example>
   *
   * @example <caption>The contents of your panel template: </caption>
   * <example>
   *   <html>
   *     <header class="panel-header">
   *         <h2 class="panel-title">Categories</h2>
   *     </header>
   *     <div class="panel-body">
   *         <ul class="menu"> ... </ul>
   *     </div>
   *     <footer class="panel-footer">
   *         <button class="panel-btn-text" blt-close="">Cancel</button>
   *         <button class="panel-btn-text-submit" ng-click="Main.saveCategory()">Save</button>
   *     <footer>
   *   </html>
   * </example>
   *
   * @example <caption>ngBoltJS has a custom directive for easily opening and closing panels and other components.
   * Simply pass the id of the panel you'd like to open or close.</caption>
   * <example>
   *   <html>
   *     <button blt-open="myPanel">Open</button>
   *     <button blt-close="myPanel">Close</button>
   *
   *     // If the close button is inside the modal component, you do not have to pass the id of the modal.
   *     <footer class="panel-footer">
   *       <button blt-close="">Close</button>
   *     </footer>
   *   </html>
   * </example>
   *
   * @example <caption>You may need to do some other work/setup in your code before opening the panel.
   * In that case, you can use the pub/sub methods of the {@link BltApi} to open and close the panel
   * instead of the `blt-open` and `blt-close` directives. When closing a panel, include any functions to reset data in
   * a [$timeout](https://docs.angularjs.org/api/ng/service/$timeout) to run after the closing animation of the panel
   * and to avoid resetting data and 'flashing' the panel content as it animates out.</caption>
   * <example>
   *   <javascript>
   *     angular.module('myApp')
   *        .controller('PanelController', PanelController);
   *
   *     // NOTE: You must inject the ngBoltJS API service into the controller to open and close panels via the API.
   *     PanelController.$inject = ['BltApi', '$timeout'];
   *
   *     function PanelController(bltApi, $timeout) {
   *       var ctrl = this;
   *       ctrl.panel = { title: 'My Panel', activeMenu: 1 };
   *       ctrl.openMyPanel = function(){
   *         // Do some work here first...
   *
   *         // When ready, publish the id of the panel you wish to open
   *         bltApi.publish('myPanel', 'open');
   *       }
   *
   *       ctrl.closeMyPanel = function(){
   *         // publish the id of the panel you wish to close
   *         bltApi.publish('myPanel', 'close');
   *
   *         // reset panel data after the closing animation
   *         $timeout(function(){
   *             ctrl.panel.title = '';
   *             ctrl.panel.activeMenu = -1;
   *         }, 350);
   *       }
   *     }
   *   </javascript>
   * </example>
   *
   * @example <caption>Common Use Cases</caption>
   * <example runnable="true">
   *   <html>
   *     <blt-panel id="menu" position="right">
   *         <div class="panel-content">
   *             <header class="panel-header">
   *                 <h2 class="panel-title">Table of Contents</h2>
   *             </header>
   *             <div class="panel-body">
   *                 <p class="panel-text panel-wrapper">Some instructions.</p>
   *
   *                 <!-- Use a divider to separate blocks of content -->
   *                 <hr class="panel-divider"></hr>
   *
   *                 <ul class="menu"> ... </ul>
   *
   *                 <!-- You can also use headers to divide sections of content -->
   *                 <h3 class="panel-heading panel-wrapper">Chapter 1</h3>
   *
   *                 <!-- For content such as menus do not use a wrapper -->
   *                 <ul class="menu"> ... </ul>
   *             </div>
   *             <footer class="panel-footer">
   *                 <button class="panel-btn-text" blt-close="">Close</button>
   *             </footer>
   *         </div>
   *     </blt-panel>
   *   </html>
   * </example>
   *
   * @example <caption>MANUAL SIZING: To customize the width (vertical panels)
   * or height (horizontal panels), change the CSS width (or height) property of the
   * panel component by using its id in your `app.scss` file.</caption>
   * <example>
   *   <css>
   *     // Vertical Panels
   *     #myRightPanel{
   *         .panel{
   *             width: 12.5rem; //200px
   *         }
   *     }
   *
   *     // Horizontal Panels
   *     #myTopPanel{
   *         .panel{
   *             min-height: 10rem; //160px
   *         }
   *     }
   *   </css>
   * </example>
   *
   * @example <caption>FORMS AND PANELS: You may want to have a small form in a panel.
   * In order to utilize default AngularJS functionality of validating and submitting forms,
   * you must use the form tag on the `.panel-content` element.</caption>
   * <example>
   *   <html>
   *     <blt-panel id="myFormPanel">
   *         <form class="panel-content" ng-submit="ctrl.submitMyForm()" novalidate>
   *             <header class="panel-header">
   *                 <h2 class="panel-title">Preferences</h2>
   *             </header>
   *             <div class="panel-body">
   *                 <!-- Some Form Controls -->
   *             </div>
   *             <footer class="panel-footer">
   *                 <!-- No ng-click needed as form will submit using expression of the ng-submit directive on button click or pressing 'Enter' -->
   *                 <button class="panel-btn-text-submit">Submit</button>
   *             <footer>
   *         </form>
   *     </blt-panel>
   * </html>
   * </example>
   *
   */
  function bltPanel( api, $timeout ) {
    var directive = {
      restrict: 'EA',
      scope: {
        position: '@',
        pendingMessage: '@'
      },
      templateUrl: 'components/panel/panel.template.html',
      transclude: true,
      compile: compile
    };

    return directive;

    /**
     * Compile function. Invoked by Angular. We use this function to register our pre and post link functions.
     * @returns {{pre: preLink, post: postLink}}
     */
    function compile() {
      var type = 'panel';

      return {
        pre: preLink,
        post: postLink
      };

      /**
       * Pre Link. Invoked by Angular. We use this function to set up the position and initial state of our scope.
       * @param scope - Our isolate scope.
       * @param element - The outermost element of our directive.
       * @param attrs - Attributes attached to our directive.
       */
      function preLink( scope, element, attrs ) {
        attrs.$set('blt-closable', type);

        scope.position = 'panel-' + scope.position || 'panel-right';
        scope.positionClass = scope.position;

      }

      /**
       * Post Link. Invoked by Angular. We use this function to register with the API publish pipeline for any
       * messages that are sent to our ID.
       *
       * @param scope - Our isolate scope.
       * @param element - The outermost element of our directive.
       * @param attrs - Attributes attached to our directive.
       */
      function postLink( scope, element, attrs ) {
        scope.active = false;

        api.subscribe(attrs.id, function( msg ) {
          // Update scope  - wrap in $timeout to apply update to scope
          $timeout(function() {
            if ( msg == 'open' ) {
              if ( !scope.active ) {
                scope.active = true;
                element.addClass('panel-active');
              }
            } else if ( msg == 'close' ) {
              if ( scope.active ) {
                scope.active = false;
                element.removeClass('panel-active');
              }
            } else if ( msg == 'toggle' ) {
              if ( scope.active ) {
                element.removeClass('panel-active');
              } else {
                element.addClass('panel-active');
              }

              scope.active = !scope.active;
            } else if ( msg == 'pending' ) {
              scope.pending = !scope.pending;
            }
          });
        });
      }
    }
  }

  bltPanel.$inject = ['BltApi', '$timeout'];
})();
(function() {
  'use strict';

  /**
   * @ngdoc module
   * @name blt_dropdown
   * @description ngBoltJS Dropdown component.
   * @since 1.0.0
   */
  angular
    .module('blt_dropdown', [])
    .component('bltDropdown', bltDropdown());

  /**
   * @ngdoc directive
   * @name bltDropdown
   * @module blt_dropdown
   * @restrict E
   *
   * @description The bltDropdown component is used to collect input from the user from a list of known values. This
   * is an extension of the HTML `<select>` element. The presentation of the dropdown options can be customized
   * through the attributes supported on this directive.
   *
   * To use the bltDropdown component in your ngBoltJS application, you simply need to include a `blt-dropdown` element
   * inside of a form in your application.
   *
   * <div class="note-tip">
   * **Best Practice** The `data-` prefix is not required for ngBoltJS attributes, but is highly recommended to prevent
   * conflicts with standard HTML attributes.
   * </div>
   *
   * @requires BltApi
   * @requires https://docs.angularjs.org/api/ng/service/$timeout
   * @requires https://docs.angularjs.org/api/ng/type/$rootScope.Scope
   *
   * @param {string} data-label  This attribute specifies the label for this component.
   * @param {expression}  data-model This attribute is used to bind the value of this component to a property in the
   *      containing scope. Functionality is based on the Angular ngModel directive.
   * @param {string} data-name This attribute indicates the name of this form element and will be used during form
   *      traversal by the ngBoltJS framework.
   * @param {expression} data-options This attribute is used to bind to a list of options that will be presented to the
   *      user. This can either be an array of options or a model of value/label pairs to use as options.
   * @param {boolean} [data-autofocus] Indicates whether or not this field should autofocus on page load.
   * @param {expression} [data-change]   This attribute is used to bind an expression in the containing scope that will
   *      be invoked any time the value of this component changes. Functionality is based on the Angular ngChange
   *      directive.
   * @param {boolean} [data-required] Indicates whether or not this field is required.
   * @param {string} [data-type] Specifies the dropdown type (dropdown, select, or searchable).
   * @param {value} [data-tabindex] Specifies the tab order of an element.
   * @param {value} [data-disabled] Disables the field. Any value set in this attribute will cause the field to be
   * disabled.
   *
   * @example <caption>Standard select dropdown. The user will be presented with the options contained in the
   * `arrayOfOptions`.</caption>
   * <example runnable="true">
   *   <javascript>
   *     angular.module("bltDocs")
   *       .controller("DropdownExampleCtrl", function(){
   *         var ctrl = this;
   *         ctrl.arrayOfOptions = ["Value 1", "Value 2", "Value 3"];
   *       });
   *   </javascript>
   *   <html>
   *     <div ng-controller="DropdownExampleCtrl as ctrl">
   *       <form name="ctrl.myForm" class="form" novalidate>
   *         <blt-dropdown data-type="select"
   *                       data-name="dropdown1"
   *                       data-label="Select a Value"
   *                       data-options="ctrl.arrayOfOptions"
   *                       data-model="ctrl.dropdown1">
   *         </blt-dropdown>
   *       </form>
   *     </div>
   *   </html>
   * </example>
   *
   * @example <caption>Searchable dropdown. The user will be presented with the options contained in the `arrayOfOptions`.
   *   When the list of options is opened for selection, the user will be able to type into the input field to
   *   filter available options.</caption>
   * <example runnable="true">
   *   <javascript>
   *     angular.module("bltDocs")
   *       .controller("DropdownExampleCtrl2", function(){
   *         var ctrl = this;
   *         ctrl.arrayOfOptions = ["Value 1", "Value 2", "Value 3"];
   *       });
   *   </javascript>
   *   <html>
   *     <div ng-controller="DropdownExampleCtrl2 as ctrl">
   *       <form name="ctrl.myForm" class="form" novalidate>
   *         <blt-dropdown data-type="searchable"
   *                       data-name="dropdown2"
   *                       data-label="Select a Value"
   *                       data-options="ctrl.arrayOfOptions"
   *                       data-model="ctrl.dropdown2">
   *         </blt-dropdown>
   *       </form>
   *     </div>
   *   </html>
   * </example>
   *
   * @example <caption>Dropdown with "dropdown" style. This will present the options contained in the `optionMap` as a
   *   clickable dropdown link. The presentation is similar to that of a dropdown menu.</caption>
   * <example runnable="true">
   *   <javascript>
   *     angular.module("bltDocs")
   *       .controller("DropdownExampleCtrl3", function(){
   *         var ctrl = this;
   *         ctrl.optionMap = {
   *           value1: "Value One",
   *           value2: "Value Two",
   *           value3: "Value Three"
   *         }
   *       });
   *   </javascript>
   *   <html>
   *     <div ng-controller="DropdownExampleCtrl3 as ctrl">
   *       <form name="ctrl.myForm" class="form" novalidate>
   *         <blt-dropdown data-type="dropdown"
   *                 data-name="dropdown3"
   *                 data-label="Select a Value"
   *                 data-options="ctrl.optionMap"
   *                 data-model="ctrl.select3">
   *         </blt-dropdown>
   *       </form>
   *     </div>
   *   </html>
   * </example>
   */
  function bltDropdown() {
    return {
      require: {
        form: '^form'
      },
      templateUrl: 'components/dropdown/dropdown.template.html',
      controller: bltDropdownController,
      bindings: {
        model: '=',
        name: '@',
        label: '@',
        options: '<',
        change: '&',
        selectNoneLabel: "@",
        type: '@',
        required: '@',
        tabindex: '@',
        autofocus: '@',
        disabled: '=?'
      }
    };
  }

  /**
   * @private
   * @name bltDropdownController
   * @module blt_dropdown
   * @description Controller for the bltDropdown component
   *
   * @requires BltApi
   * @requires https://docs.angularjs.org/api/ng/service/$timeout
   * @requires $scope
   */
  function bltDropdownController( api, $timeout, $scope ) {

    var ctrl = this;
    var types = ['select', 'dropdown', 'searchable'];

    ctrl.$onInit = init;
    ctrl.onChange = onChange;
    ctrl.closeOptions = closeOptions;
    ctrl.onSelectChange = onSelectChange;
    ctrl.onFilterUpdated = onFilterUpdated;
    ctrl.onKeyDown = onKeyDown;
    ctrl.openOptions = openOptions;
    ctrl.getLabelForValue = getLabelForValue;
    ctrl.selectOption = selectOption;
    ctrl.searchablePlaceholder = searchablePlaceholder;
    ctrl.isSelected = isSelected;
    ctrl.untouched = untouched;

    /**
     * @private
     * @description Handles the controller initialization. Confirm existence of required attributes and set default values
     * as needed.
     */
    function init() {

      if ( !ctrl.type ) {
        api.error('missing type attribute for blt-dropdown. See: '
          + window.location + '/blt.dropdown.bltDropdown.html');
      } else if ( types.indexOf(ctrl.type) === -1 ) {
        api.error("Unexpected value '" + ctrl.type + "' for blt-dropdown type attribute, expected 'select', " +
          "'dropdown', or 'searchable'. See: " + window.location + "/blt.dropdown.bltDropdown.html");
      }

      // Set input name
      if ( angular.isUndefined(ctrl.name) ) {
        api.error('missing name attribute for blt-dropdown. See: ' + window.location +
          '/blt.dropdown.bltDropdown.html');
      }

      // Perform initial setup of our directive scope. Interpret "searchable" attribute, and set up our options.
      // Bind the form control model to the scope
      ctrl.current = {index: 0};

      ctrl.searchable = (ctrl.type === 'searchable');

      //We also need to set our state appropriately so our options don't start in the "open" state
      //element.addClass('dropdown-closed');
      ctrl.open = false;

      /**
       * Activate our full directive scope functionality. Define listeners and actions to attach to the various
       * user interactions that may occur with our directive.
       *
       * Public Scope Functions
       */

      ctrl.selectNoneLabel = ctrl.selectNoneLabel || "None";
      if ( ctrl.searchable ) {
        ctrl.search = {
          model: undefined
        };
      } else {
        ctrl.select = {
          model: undefined
        };
      }

      onOptionsUpdated();

      $scope.$watch(function() {
        return ctrl.options
      }, onOptionsUpdated, true);
      $scope.$watch(function() {
        return ctrl.model
      }, updateInternalModel, true);
    }

    /**
     * @name bltDropdownController#closeOptions
     * @description Closes the options, reverting the view model to the current root scope model value if needed
     * (such as if the selection was canceled).
     */
    function closeOptions() {
      //If the view model (search.model) doesn't match the scope model at this point it's because the
      //options were closed due to something other than the user selecting an option. In this case
      //we'll reset our view model to match the scope model.
      if ( ctrl.searchable && (!getKeyedOptionForValue(ctrl.model) || ctrl.search.model !=
        getKeyedOptionForValue(ctrl.model).label) ) {
        if ( !getKeyedOptionForValue(ctrl.model) ) {
          delete ctrl.search.model;
        } else {
          ctrl.search.model = getKeyedOptionForValue(ctrl.model).label;
        }
      }
      delete ctrl.currentSelection;
      //element.addClass('dropdown-closed');
      ctrl.open = false;
      document.removeEventListener('mousedown', onDocumentClick);
      document.removeEventListener('mouseup', onDocumentClick);
    };

    /**
     * @name bltDropdownController#searchablePlaceholder
     * @description Evaluates the current scope model to determine whether or not to provide a placeholder for the
     * searchable input field. This will prevent the placeholder from showing when our parent model is already set.
     * @returns {string} The placeholder to show in the searchable input field, if any.
     */
    function searchablePlaceholder() {
      if ( angular.isUndefined(ctrl.model) ) {
        if ( ctrl.required ) {
          return ctrl.label + "*";
        }
        return ctrl.label;
      }
    };

    /**
     * @name bltDropdownController#onSelectChange
     * @description Change listener that fires when the user changes the value of the 'select' dropdown.
     */
    function onSelectChange() {
      if ( !ctrl.searchable ) {
        var keyedOption = ctrl.keyedOptionMap[ctrl.select.model];
        if ( keyedOption ) {
          ctrl.model = getOptionValue(keyedOption);
        }
      }
      onChange();
    };


    /**
     * @name bltDropdownController#onChange
     * @description Invoked when a root model change will occur. Calls the "change" function if one was bound to our
     * directive.
     */
    function onChange() {
      if ( ctrl.change ) {
        $timeout(ctrl.change, 0);
      }
    };

    /**
     * @name bltDropdownController#selectOption
     * @description Selects the give option and closes the options. Triggers the onChange function if a model change
     * is detected.
     * @param {object|string} option The displayed option to select.
     */
    function selectOption( option ) {
      var value = getOptionValue(option);
      if ( ctrl.model != value ) {
        ctrl.model = value;
        updateInternalModel();
        onChange();
      }
      if ( ctrl.open ) {
        closeOptions();
      }
    };

    /**
     * @name bltDropdownController#getLabelForValue
     * @description Safe retrieval of a label from the given value. If the value doesn't correlate to an option in our list
     * the value returned will be undefined.
     * @param {string} value The value for which a label should be retrieved.
     * @returns {string} The label for the given value.
     */
    function getLabelForValue( value ) {
      var keyedOption = getKeyedOptionForValue(value);
      if ( keyedOption ) {
        return keyedOption.label;
      }
    };

    /**
     * @name bltDropdownController#getKeyForValue
     * @description Safe retrieval of a key from the given value. If the value doesn't correlate to an option in our list
     * the value returned will be undefined.
     * @param {string} value The value for which a key should be retrieved.
     * @returns {string} The key for this value.
     */
    function getKeyForValue( value ) {
      var keyedOption = getKeyedOptionForValue(value);
      if ( keyedOption ) {
        return keyedOption.key;
      }
    };

    /**
     * @name bltDropdownController#openOptions
     * @description Opens the option list for user option selection. The view model is cleared unless the boolean
     * retainModel flagged is passed in and is truthy.
     * @param {boolean} [retainModel] If truthy will prevent the view model from being cleared upon opening options.
     */
    function openOptions( retainModel ) {
      if ( !retainModel && ctrl.searchable ) {
        delete ctrl.search.model;
        untouched();
      }
      if ( ctrl.model ) {
        ctrl.currentSelection = getKeyedOptionForValue([ctrl.model]);
      }
      ctrl.open = true;
      //element.removeClass('dropdown-closed');
      document.addEventListener('mousedown', onDocumentClick);
      document.addEventListener('mouseup', onDocumentClick);
      if ( ctrl.searchable ) {
        onFilterUpdated();
      }
    };

    /**
     * @name bltDropdownController#onFilterUpdated
     * @description Invoked when a change is made to the view model for searchable selects. Updates to this model will
     * update the filtered options that are presented to the user.
     */
    function onFilterUpdated() {
      if ( !ctrl.open ) {
        ctrl.openOptions(true);
      }
      ctrl.filteredOptions = getFilteredOptions();
      scrollCurrentSelectionIntoView();
    };

    /**
     * @name bltDropdownController#isSelected
     * @description returns boolean to add dropdown-active class if dropdown selected
     */
    function isSelected( option ) {
      if ( ctrl.currentSelection && ctrl.currentSelection.key ) {
        if ( option && option.key && ctrl.currentSelection.key === option.key ) {
          return true;
        }
      }
      return false;
    };

    /**
     * @name bltDropdownController#untouched
     * @description Sets the form input to untouched.
     */
    function untouched() {
      $timeout(function() {
        ctrl.form[ctrl.name].$setUntouched();
      })
    };

    /**
     * @name bltDropdownController#getFilteredOptions
     * @description Get the array of current options filtered by the current search model.
     * @returns {Array} The array of filtered options.
     */
    function getFilteredOptions() {
      var filtered = [];
      angular.forEach(ctrl.keyedOptions, function( option ) {
        if ( !ctrl.search.model || option.label.indexOf(ctrl.search.model) >= 0 ) {
          filtered.push(option);
        }
      });
      return filtered;
    };

    /**
     * @name bltDropdownController#onKeyDown
     * @description Watch for several key down events that we're interested in. (Arrow up, down, Esc, Enter and Tab)
     * @param {event} event The key event that we'll be evaluating.
     */
    function onKeyDown( event ) {
      switch ( event.keyCode ) {
        case 40:
          onArrowDown();
          event.preventDefault();
          break;
        case 38:
          onArrowUp();
          event.preventDefault();
          break;
        case 27:
          onEsc();
          event.preventDefault();
          break;
        case 13:
          onEnter();
          event.preventDefault();
          break;
        case 32:
          onSpace(event);
          break;
        case 9:
          ctrl.closeOptions();
          break;
        default:
          $timeout(function() {
            onFilterUpdated()
          }, 0);
      }
    };

    ///////////////////////////////////
    // Private Scope Functions
    ///////////////////////////////////

    /**
     * @private
     * @description Any time our options are updated, we need to rebuild our scope properties to reflect the new options
     * as well as review our current model for validity.
     */
    function onOptionsUpdated() {

      //Create unique keys for each option and store in a keyed map. This allows us to uniquely identify each
      //option regardless of the type of options passed in, or the potential for duplicate options in an array of
      //options.
      ctrl.keyedOptionMap = {};
      ctrl.keyedOptions = [];
      var isArray = Array.isArray(ctrl.options);

      var modelExistsInOptions = false;

      for ( var attr in ctrl.options ) {
        var keyedOption = {
          key: api.uuid(),
          value: isArray ? ctrl.options[attr] : attr,
          label: ctrl.options[attr]
        }
        if ( angular.isDefined(ctrl.model) && ctrl.model == keyedOption.value ) {
          modelExistsInOptions = true;
        }
        ctrl.keyedOptions.push(keyedOption);
        ctrl.keyedOptionMap[keyedOption.key] = keyedOption;
      }

      //Any time our options are updated, we should check to make sure the currently selected value
      //is still valid. If not, we should clear it.
      if ( !modelExistsInOptions ) {
        delete ctrl.model;
      }
      updateInternalModel();

      //If this dropdown is required, we need to make sure the value is never cleared, therefore if the
      //the current scope.model is undefined set the model to the first available option.
      if ( (ctrl.required && angular.isUndefined(ctrl.model)) ) {
        if ( ctrl.keyedOptions.length > 0 ) {
          selectOption(ctrl.keyedOptions[0]);
        }
      }

      //Update our filtered options to reflect the new options, filtering them with the current
      //search model if our options are currently open.
      if ( ctrl.open ) {
        ctrl.filteredOptions = getFilteredOptions();
      } else {
        ctrl.filteredOptions = ctrl.keyedOptions;
      }
    };

    /**
     * @private
     * @description Update our internal model (scope.search or scope.select) to match the current scope.model.
     */
    function updateInternalModel() {
      if ( ctrl.searchable ) {
        ctrl.search.model = getLabelForValue(ctrl.model);
      } else if ( ctrl.type == 'dropdown' ) {
        ctrl.select.model = ctrl.model;
      } else {
        ctrl.select.model = getKeyForValue(ctrl.model);
      }
    };

    /**
     * @private
     * @description If the options are not already open, open them. Otherwise, cycle to the previous selectable option,
     * wrapping to the bottom if necessary.
     */
    function onArrowUp() {
      if ( !ctrl.open ) {
        ctrl.openOptions();
      } else if ( ctrl.filteredOptions && ctrl.filteredOptions.length > 0 ) {
        var idx = ctrl.filteredOptions.indexOf(ctrl.currentSelection)
        if ( idx > 0 || (idx == 0 && !ctrl.required) ) {
          idx -= 1;
        } else {
          idx = ctrl.filteredOptions.length - 1;
        }
        if ( idx >= 0 ) {
          ctrl.currentSelection = ctrl.filteredOptions[idx];
        } else {
          delete ctrl.currentSelection;
        }
      } else if ( !ctrl.required ) {
        delete ctrl.currentSelection;
      }
      processSelectionChange();
    };

    /**
     * @private
     * @description If the options are not already open, open them. Otherwise, cycle to the next selectable option,
     * wrapping to the top if necessary.
     */
    function onArrowDown() {
      if ( !ctrl.open ) {
        ctrl.openOptions();
      } else if ( ctrl.filteredOptions && ctrl.filteredOptions.length > 0 ) {
        var idx = ctrl.filteredOptions.indexOf(ctrl.currentSelection)
        if ( idx >= 0 && idx < (ctrl.filteredOptions.length - 1) ) {
          idx += 1;
        } else if ( ctrl.required || idx < (ctrl.filteredOptions.length - 1) ) {
          idx = 0;
        } else {
          idx = -1;
        }
        if ( idx >= 0 ) {
          ctrl.currentSelection = ctrl.filteredOptions[idx];
        } else {
          delete ctrl.currentSelection;
        }
      } else if ( !ctrl.required ) {
        delete ctrl.currentSelection;
      }
      processSelectionChange();
    };

    /**
     * @private
     * @description Changes current search model if there has been a selection change
     */
    function processSelectionChange() {
      if ( ctrl.currentSelection ) {
        ctrl.search.model = ctrl.currentSelection.label;
      }
      scrollCurrentSelectionIntoView();
    };

    /**
     * @private
     * @description Scrolls the currently selected option into view. If the element is above the current view, it will
     * scroll up into view. If it's below, it will scroll down until the element is fully in view. We do this
     * inside of a timeout to allow the current apply cycle to finish before analyzing and applying the scroll.
     */
    function scrollCurrentSelectionIntoView() {
      $timeout(function() {
        if ( ctrl.searchable && ctrl.open ) {
          if ( ctrl.currentSelection ) {
            var active = document.getElementById(ctrl.currentSelection.key);
            if ( active && active.parentElement ) {
              active = active.parentElement;
              var scrollTop = active.parentElement.scrollTop;
              var scrollBottom = scrollTop + active.parentElement.clientHeight;
              var selectedTop = active.offsetTop;
              var selectedBottom = selectedTop + active.clientHeight;
              if ( selectedTop < (scrollTop + 4) ) { //If the top of our selected element is above the top of the
                // scroll window, shift the view up.
                active.parentElement.scrollTop = selectedTop - 4;
              } else if ( selectedBottom > (scrollBottom + 4) ) { //Else if the bottom of the selected element is
                // below the bottom of the scroll window, shift the view down
                active.parentElement.scrollTop = scrollTop + ((selectedBottom - scrollBottom) + 4);
              }
            }
          }
        }
      });
    };

    /**
     * @private
     * @description If the user hits the enter key while the list of options is open, we try to interpret their intent here.
     * If they have an option currently highlighted/selected, we'll select that. Otherwise, if they have typed
     * enough of a filter to reduce the selectable options to a single option, select that option. Otherwise,
     * select "null", which will clear their selection.
     */
    function onEnter() {
      if ( ctrl.open ) {
        if ( ctrl.currentSelection && ctrl.filteredOptions.indexOf(ctrl.currentSelection) >= 0 ) {
          ctrl.selectOption(ctrl.currentSelection);
        } else if ( ctrl.filteredOptions.length == 1 ) {
          ctrl.selectOption(ctrl.filteredOptions[0]);
        } else {
          ctrl.selectOption();
        }
      }
    };

    /**
     * @private
     * @description Behavior is the same as if the user clicked off of the list.
     */
    function onEsc() {
      if ( ctrl.open ) {
        ctrl.closeOptions();
      }
    };

    /**
     * @private
     * @description Open options on space if they aren't already opened.
     * @param {event} event The key event from the user pressing the spacebar.
     */
    function onSpace( event ) {
      if ( !ctrl.open ) {
        ctrl.openOptions(false);
        event.preventDefault();
      }
    };

    /**
     * @private
     * @description Gets the option value for the given option label.
     * @param {object} option An option from our set of options.
     * @returns {string} The value associated with the given label. Undefined if none found.
     */
    function getOptionValue( option ) {
      if ( option ) {
        return option.value;
      }
    };

    /**
     * @private
     * @description Get the "keyed" option for the given value.
     * @param {string} value The value for which a full "option" object should be retrieved.
     * @returns {object} The option that correlates to the given value. Undefined if none is found.
     */
    function getKeyedOptionForValue( value ) {
      if ( value ) {
        for ( var idx = 0; idx < ctrl.keyedOptions.length; idx++ ) {
          if ( ctrl.keyedOptions[idx].value == value ) {
            return ctrl.keyedOptions[idx];
          }
        }
      }
    };

    /**
     * @private
     * @description If the user clicks anywhere on our document outside of our directive, we'll cancel the selection.
     * @param {event} e The DOM click event.
     */
    function onDocumentClick( e ) {
      $scope.$apply(function() {
        if ( ctrl.open && e.target.name != ctrl.name
          && e.target.id != 'select-none'
          && !ctrl.keyedOptionMap.hasOwnProperty(e.target.id) ) {
          ctrl.closeOptions();
        }
      });
    };
  }

  bltDropdownController.$inject = ['BltApi', '$timeout', '$scope'];
})();

(function() {
  'use strict';

  /**
   * @ngdoc module
   * @name blt_textfield
   * @description ngBoltJS Textfield component.
   *
   *  @since 2.0.0
   */
  angular.module('blt_textfield', [])
    .component('bltTextfield', bltTextfield())
  ;

  /**
   * @ngdoc directive
   * @name bltTextField
   * @module blt_textfield
   *
   * @description The bltTextField component is used to collect text or numeric input from the user. This component is
   * essentially a combination of the standard HTML `<input>` and `<textarea>` elements along with the incorporation of
   * a label. The bltTextField component provides a clean and simple way to collect free text data.
   *
   * <div class="note-tip">
   * **Best Practice** The `data-` prefix is not required for ngBoltJS attributes, but is highly recommended to prevent
   * conflicts with standard HTML attributes.
   * </div>
   *
   * @example <caption>A simple text field labeled "Text Field" and bound to the scope property `MyCtrl.textField1.`</caption>
   * <example runnable="true">
   *   <javascript>
   *     angular.module("bltDocs")
   *       .controller("MyCtrl", function(){
   *         var ctrl = this;
   *       });
   *   </javascript>
   *   <html>
   *    <form name="MyCtrl.myForm" class="form" novalidate>
   *      <blt-textfield data-name="myFirstTextField"
   *        data-label="Text Field"
   *        data-model="MyCtrl.textField1">
   *      </blt-textfield>
   *    </form>
   *   </html>
   * </example>
   *
   * @example <caption>A more complex text field labeled "Required Text Field" and bound to the scope property
   *   `MyCtrl2.textField2`. This field is marked as required and has a pattern defined. Valid values would be ABC123,
   *   XYZ789, etc. Must click inside and then out of the text field to see red "This field is required." 
   *   text.</caption>
   * <example runnable="true">
   *   <javascript>
   *     angular.module("bltDocs")
   *       .controller("MyCtrl2", function(){
   *         var ctrl = this;
   *       });
   *   </javascript>
   *   <html>
   *     <form name="MyCtrl2.myForm" class="form" novalidate>
   *       <blt-textfield data-name="mySecondTextField"
   *         data-required="true"
   *         data-pattern="[A-Z]{3}[0-9]{3}"
   *         data-label="Required Text Field"
   *         data-model="MyCtrl2.textField2">
   *       </blt-textfield>
   *     </form>
   *   </html>
   * </example>
   *
   * @example <caption>A simple numeric field labeled "Numeric Field" and bound to the scope property
   *   `MyCtrl3.numericField1`. The value must be between 0.0 and 10.0. Arrow up and arrow down keystrokes will adjust
   *   the value by 0.01. </caption>
   * <example runnable="true">
   *   <javascript>
   *     angular.module("bltDocs")
   *       .controller("MyCtrl3", function(){
   *         var ctrl = this;
   *       });
   *   </javascript>
   *   <html>
   *    <form name="MyCtrl3.myForm" class="form" novalidate>
   *      <blt-textfield data-name="myFirstNumericField"
   *        data-type="number"
   *        data-step="0.01"
   *        data-min="0.0"
   *        data-max="10.0"
   *        data-label="Numeric Field"
   *        data-model="MyCtrl3.numericField1">
   *      </blt-textfield>
   *    </form>
   *   </html>
   * </example>
   *
   * @example <caption>An email field labeled "Email Field" and bound to the scope property `MyCtrl4.emailField1`. The
   *   value must be in valid email format.</caption>
   * <example runnable="true">
   *   <javascript>
   *     angular.module("bltDocs")
   *       .controller("MyCtrl4", function(){
   *         var ctrl = this;
   *       });
   *   </javascript>
   *   <html>
   *    <form name="MyCtrl4.myForm" class="form" novalidate>
   *      <blt-textfield data-name="myFirstEmailField"
   *        data-type="email"
   *        data-label="Email Field"
   *        data-model="MyCtrl4.emailField1">
   *      </blt-textfield>
   *    </form>
   *   </html>
   * </example>
   *
   * @example <caption>A Text Area labeled "Comments Field" and bound to the scope property `MyCtrl5.commentsField1`.
   *   The max length of the input is 255 characters.</caption>
   * <example runnable="true">
   *   <javascript>
   *     angular.module("bltDocs")
   *       .controller("MyCtrl5", function(){
   *         var ctrl = this;
   *       });
   *   </javascript>
   *   <html>
   *    <form name="MyCtrl5.myForm" class="form" novalidate>
   *      <blt-textfield data-name="myFirstTextArea"
   *        data-type="textarea"
   *        data-label="Comments Field"
   *        data-model="MyCtrl5.commentsField1"
   *        data-rows="5"
   *        data-max-length="255">
   *      </blt-textfield>
   *    </form>
   *   </html>
   * </example>
   *
   * @example <caption>A telephone input field labeled via the controller property `phoneLabel`. Notice the use of
   *   handlebars, which is required for any of the "Value" attributes. This field is bound to the scope property
   *   `MyCtrl6.phoneField1`.</caption>
   * <example runnable="true">
   *   <javascript>
   *     angular.module("bltDocs")
   *       .controller("MyCtrl6", MyCtrl6); 
   *
   *      MyCtrl6.$inject = ['BltApi']; 
   *
   *      function MyCtrl6(api){
   *        var ctrl = this;
   *        var phoneLabel;
   *        ctrl.phoneLabel = "Telephone Field";
   *      }
   *   </javascript>
   *   <html>
   *     <div ng-controller="MyCtrl6 as ctrl">
   *      <form name="MyCtrl6.myForm" class="form" novalidate>
   *        <blt-textfield data-name="myFirstPhoneField"
   *          data-type="tel"
   *          data-label="{{ctrl.phoneLabel}}"
   *          data-model="MyCtrl6.phoneField1">
   *        </blt-textfield>
   *      </form> 
   *    </div>
   *   </html>
   * </example>
   *
   * @example <caption>A url input field labeled "URL" and bound to the scope property `MyCtrl7.urlField1`. Notice there
   *   is also a change listener attached to this field that will fire as the user changes the value of this field.
   *   </caption>
   * <example runnable="true">
   *   <javascript>
   *     angular.module("bltDocs")
   *       .controller("MyCtrl7", function(){
   *         var ctrl = this;
   *       });
   *   </javascript>
   *   <html>
   *    <form name="MyCtrl7.myForm" class="form" novalidate>
   *      <blt-textfield data-name="myFirstURLField"
   *        data-label="URL"
   *        data-model="MyCtrl7.urlField1"
   *        data-change="MyCtrl7.onUrlChanged()">
   *      </blt-textfield>
   *    </form>
   *   </html>
   * </example>
   *
   * @requires BltApi
   * @requires https://docs.angularjs.org/api/ng/service/$timeout
   * @requires https://docs.angularjs.org/api/ng/type/$rootScope.Scope
   *
   * @restrict E
   *
   * @param {string} data-name This attribute indicates the name of this form element and will be used during form
   * traversal by the ngBoltJS framework.
   * @param {string} data-label This attribute specifies the label for this component.
   * @param {boolean} [data-autofocus] Indicates whether or not this field should autofocus on page load.
   * @param {expression} [data-change] This attribute is used to bind an expression in the containing scope that
   * will be invoked any time the value of this component changes. Functionality is based on the Angular ngChange
   * directive.
   * @param {boolean} [data-disabled] Disables the field. Any value set in this attribute will cause the field to be
   * disabled.
   * @param {number} [data-max] The maximum numeric value of the component. This is only valid with `data-type="number"`.
   * It will be ignored in all other cases.
   * @param {number} [data-maxlength] The maximum number of characters to accept as valid in this component.
   * @param {number} [data-min] The minimum numeric value of the component. This is only valid with `data-type="number"`.
   * It will be ignored in all other cases.
   * @param {number} [data-minlength] The minimum number of characters to accept as valid in this component.
   * @param {expression} [data-model] This attribute is used to bind the value of this component to a property in the
   * containing scope. Functionality is based on the Angular ngModel directive.
   * @param {string} [data-pattern] Defines a pattern to use in validation of this component's value. Can be any valid
   * regular expression.
   * @param {boolean} [data-required] Indicates whether or not this field is required.
   * @param {number} [data-rows] The number of rows to present in a multi-line text area. This is only valid with
   * `data-type="textarea"`. It will be ignored in all other cases.
   * @param {number} [data-step] Defines the intervals to use when changing the value of a number component. This is
   * only valid with `data-type="number"`. It will be ignored in all other cases. See W3C documentation on step for
   * more information.
   * @param {string} [data-type] This attribute defines the type of data that will be collected in this component.
   * All HTML input types are technically supported, but the intended use case of this component includes the
   * following standard types: `text`, `password`, `tel`, `email`, `number`, and `url` with the addition of `textarea`.
   * Will default to `text` if no value is defined.
   * @param {expression} [data-validate] An expression that gets passed through to an instance of the bltValidate
   * directive to invoke custom validation on this component value. See documentation for bltValidate for more
   * information.
   * @param {boolean} [data-autocomplete] Indicates whether or not this field should autocomplete.
   * @param {boolean} [data-autocorrect] Indicates whether or not this field should have autocorrect.
   * @param {boolean} [data-spellcheck] Indicates whether or not this field should have spellcheck.
   * @param {value} [data-tabindex] Specifies the tab order of an element.
   */
  function bltTextfield() {
    return {
      require: {
        form: '^form'
      },
      templateUrl: 'components/textfield/textfield.template.html',
      controller: bltTextfieldController,
      bindings: {
        model: '=',
        name: '@',
        label: '@',
        type: '@',
        minlength: '@',
        maxlength: '@',
        min: '@',
        max: '@',
        change: '&',
        rows: '@',
        validate: '=',
        required: '@',
        autofocus: '@',
        autocomplete: '@',
        autocorrect: '@',
        spellcheck: '@',
        disabled: '=?',
        pattern: '@',
        tabindex: '@',
        step: '@'
      }
    };
  }

  /**
   * @private
   * @name bltTextfieldController
   * @module blt_textfield
   * @description Controller for our Text Field component. We use this to process the attributes applied to our component,
   * apply those attributes to our child elements when appropriate, and report errors and warnings when needed.
   *
   * @requires BltApi
   * @requires https://docs.angularjs.org/api/ng/service/$timeout
   * @requires $scope
   */
  function bltTextfieldController( api, $timeout, $scope ) {

    var ctrl = this;
    ctrl.$onInit = init;
    ctrl.onChange = onChange;

    /**
     * @private
     * @description Handles the controller initialization. Confirm existence of required attributes and set default values
     * as needed.
     */
    function init() {
      api.debug('bltTextfieldController: initializing.');

      // Set input name
      if ( !ctrl.name ) {
        api.error('missing name attribute for blt-text-field. See: '
          + window.location + '/blt.textfield.bltTextfield.html');
        return;
      }

      //set default type
      if ( !ctrl.type ) {
        ctrl.type = 'text';
      }

      $scope.$watch(function() {
        return ctrl.required;
      }, function() {
        if ( angular.isDefined(ctrl.required) && ctrl.required !== 'false' ) {
          ctrl.asterisk = "*";
        } else {
          ctrl.asterisk = "";
        }
      });

      // Warn about incorrect usage of rows attribute.
      if ( angular.isDefined(ctrl.rows) && ctrl.type !== 'textarea' ) {
        api.warn("Attribute data-rows should be used in conjunction with type 'textarea', type is currently "
          + (ctrl.type ? "set to '" + ctrl.type + "'" : "undefined") + ". blt-text-field [name="
          + ctrl.name + "]. See: " + window.location + "/blt.textfield.bltTextfield.html");
      }

      // Set ng-minlength
      var min = 0;
      if ( angular.isDefined(ctrl.minlength) ) {
        min = parseInt(ctrl.minlength, 10);
        if ( !(isFinite(min) && min >= 0) ) {
          if ( isFinite(min) ) {
            api.error('attribute data-minlength must be a non-negative integer, is ' + min +
              ' instead. See: ' + window.location + '/blt.textfield.bltTextfield.html');
            return;
          } else {
            api.error("attribute data-minlength must be a non-negative integer, is '" +
              ctrl.minlength + "' instead. See: " + window.location + "/blt.textfield.bltTextfield.html");
            return;
          }
        }
      }

      // Set ng-maxlength
      if ( angular.isDefined(ctrl.maxlength) ) {
        var max = parseInt(ctrl.maxlength, 10);
        if ( !(isFinite(max) && max >= min) ) {
          if ( isFinite(max) ) {
            if ( max < 0 ) {
              api.warn('attribute data-maxlength must be a non-negative integer, is ' + max
                + ' instead. See: ' + window.location + '/blt.textfield.bltTextfield.html');
            } else if ( max < min ) {
              api.warn('attribute data-maxlength cannot be less than data-minlength, data-minlength is '
                + min + ' data-maxlength is ' + max + '. See: '
                + window.location + '/blt.textfield.bltTextfield.html');
            }
          } else {
            api.warn("attribute data-maxlength must be a non-negative integer, is '" + ctrl.maxlength + "' instead. See: "
              + window.location + "/blt.textfield.bltTextfield.html");
          }
        }
      }

      //warn about trying to use step with incorrect type
      if ( angular.isDefined(ctrl.step) ) {
        if ( ctrl.type !== 'number' ) {
          api.warn("attribute data-step can only be used when data-type is a number, data-type is '" + ctrl.type +
            "' instead. See: " + window.location + "/blt.textfield.bltTextfield.html");
        }
        var step = parseInt(ctrl.step, 10);
        if ( !(isFinite(step) && step >= 0) ) {
          if ( isFinite(step) ) {
            if ( step < 0 ) {
              api.warn('attribute data-step must be a non-negative integer, is ' + step
                + ' instead. See: ' + window.location + '/blt.textfield.bltTextfield.html');
            }
          }
        }
      }

      //warn about trying to use min with incorrect type
      if ( angular.isDefined(ctrl.min) && ctrl.type !== 'number' ) {
        api.warn("attribute data-min can only be used when data-type is a number, data-type is '" + ctrl.type +
          "' instead. See: " + window.location + "/blt.textfield.bltTextfield.html");
      }

      //warn about trying to use max with incorrect type
      if ( angular.isDefined(ctrl.max) && ctrl.type !== 'number' ) {
        api.warn("attribute data-max can only be used when data-type is a number, data-type is '" + ctrl.type +
          "' instead. See: " + window.location + "/blt.textfield.bltTextfield.html");
      }

      //If this is a number input, look for applicable number input attributes.
      if ( ctrl.type === 'number' ) {
        // Check for sane min
        var min;
        if ( angular.isDefined(ctrl.min) ) {
          min = parseFloat(ctrl.min);
          if ( !isFinite(min) ) {
            api.warn("attribute data-min must be a number, is '" + ctrl.min + "' instead. See: "
              + window.location + "/blt.textfield.bltTextfield.html");
          }
        }
        // Set max
        if ( angular.isDefined(ctrl.max) ) {
          var max = parseFloat(ctrl.max);
          if ( isFinite(max) ) {
            if ( isFinite(min) && max < min ) {
              api.warn("attribute data-max must be a greater than data-min, data-min is " + min
                + " data-max is " + max + ". Ignoring data-max. See: " + window.location +
                "/blt.textfield.bltTextfield.html");
            }
          } else {
            api.warn("attribute data-max must be a number, is '" + ctrl.max + "' instead. See: " + window.location +
              "/blt.textfield.bltTextfield.html");
          }
        }
      }

      // Set validator
      var validateAttr = ctrl.validate;
      if ( validateAttr ) {
        if ( ctrl.validate.msg ) {
          ctrl.errorMsg = ctrl.validate.msg;
        } else {
          ctrl.errorMsg = 'This field is invalid.';
        }
      }
    }

    /**
     * @name bltTextfieldController#onChange
     * @description This function will be bound to ng-change on our actual input element. When invoked, check for
     * existence of ctrl.change. If it is defined, invoke it in a $timeout, which ensures that our parent
     * model has had time to update.
     */
    function onChange() {
      if ( ctrl.change ) {
        $timeout(ctrl.change, 0);
      }
    };
  }

  bltTextfieldController.$inject = ['BltApi', '$timeout', '$scope'];
})();
(function() {
  'use-strict';

  /**
   * @ngdoc module
   * @name blt_toggleswitch
   * @description ngBoltJS Toggle Switch module.
   *
   * @since 2.0.0
   *
   */
  angular
    .module('blt_toggleswitch', [])
    .directive('bltToggleSwitch', bltToggleSwitch);

  /**
   * @ngdoc directive
   * @name bltToggleSwitch
   * @module blt_toggleswitch
   *
   * @description The bltToggleSwitch directive can be used much like a standard HTML checkbox with the presentation of a
   * switch with an 'on' and 'off' state. The toggle switch must be bound to a boolean attribute in your controller
   * model. Selection/deselection of the toggle switch will toggle this value between true and false.
   *
   * <div class="note-info">**NOTE** In order for the Toggle Switch to take input focus and support sequential keyboard navigation,
   * you must add the `tabindex="0"` attribute on the directive. Documentation on using tabindex can be found
   * [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex).</div>
   *
   * <div class="note-tip">**Best Practice** The `data-` prefix is not required for ngBoltJS attributes, but is highly recommended to prevent
   * conflicts with standard HTML attributes.</div>
   *
   * @example <caption>To use the Toggle Switch directive in your ngBoltJS application, include the `blt-toggle-switch`
   * element in your HTML template. You can optionally include it inside a form.</caption>
   * <example runnable="true">
   *   <javascript>
   *     angular.module("bltDocs").controller("ToggleExCtrl1", function(){});
   *   </javascript>
   *   <html>
   *     <div ng-controller="ToggleExCtrl1 as ctrl">
   *       <blt-toggle-switch data-model="ctrl.someBooleanValue"></blt-toggle-switch>
   *     </div>
   *   </html>
   * </example>
   *
   * @example <caption>Usage inside form with option to disable.</caption>
   * <example runnable="true">
   *   <javascript>
   *     angular.module("bltDocs").controller("ToggleExCtrl2", function(){});
   *   </javascript>
   *   <html>
   *     <div ng-controller="ToggleExCtrl2 as ctrl">
   *       <form class="form" novalidate name="toggleTest">
   *         <blt-toggle-switch data-model="ctrl.disableToggle"
   *                            data-label="Disable">
   *         </blt-toggle-switch>
   *         <blt-toggle-switch data-model="ctrl.someBooleanValue"
   *                            data-disabled="ctrl.disableToggle">
   *         </blt-toggle-switch>
   *       </form>
   *     </div>
   *   </html>
   * </example>
   *
   * @example <caption>With a label. 
   * <div class="note-tip"> **Note** You can bind Angular expressions to your label. </div>
   * </caption>
   * <example runnable="true">
   *   <javascript>
   *     angular.module("bltDocs").controller("ToggleExCtrl3", function(){});
   *   </javascript>
   *   <html>
   *     <div ng-controller="ToggleExCtrl3 as ctrl">
   *       <blt-toggle-switch data-model="ctrl.someBooleanValue"
   *                          tabindex="0"
   *                          data-label="Toggle Switch: {{ctrl.someBooleanValue}}">
   *       </blt-toggle-switch>
   *     </div>
   *   </html>
   * </example>
   *
   * @example <caption>Justify right.</caption>
   * <example runnable="true">
   *   <javascript>
   *     angular.module("bltDocs").controller("ToggleExCtrl4", function(){});
   *   </javascript>
   *   <html>
   *     <div ng-controller="ToggleExCtrl4 as ctrl">
   *       <blt-toggle-switch data-model="ctrl.someBooleanValue"
   *         data-justify="right"
   *         tabindex="0"
   *         data-label="Right Justified">
   *       </blt-toggle-switch>
   *     </div>
   *   </html>
   * </example>
   *
   * @param {expression} data-model This attribute is used to bind the value of this directive to a property in the
   * containing scope. Must be a boolean value.
   * @param {boolean} [data-disabled] Disables the switch. A property in the containing scope that will disable the
   * control if truthy. The Toggle Switch can be disabled in the off or on state.
   * @param {string} [data-label] An optional value to display a form control label above the Toggle Switch.
   * @param {string} [data-justify] An optional value to justify the Toggle Switch and label (if applicable) to the 'left'
   * (default), 'right', or 'center'.
   *
   * @restrict E
   *
   */
  bltToggleSwitch.$inject = ['$timeout']
  function bltToggleSwitch($timeout) {
    var directive = {
      restrict: 'E',
      scope: {
        disabled: '=?',
        label: '@?',
        model: '=',
        change: '&'
      },
      templateUrl: 'components/toggleswitch/toggleswitch.template.html',
      link: linkFn
    };

    return directive;

    /**
     * @private
     * @description Link function for our directive that will be invoked by angular during the
     * linking phase. Adds classes and attributes to the directives element
     * and attaches a keypress event listener for toggling.
     * @param  {*} scope - Our isolate scope instance.
     * @param  {*} elem  - The HTML element which our directive is attached
     * @param  {*} attrs - The raw HTML elements that are attached to our directive element.
     */
    function linkFn( scope, elem, attrs ) {
      // Public methods on the scope
      scope.toggle = toggle;

      // throw errors if required attributes are not defined
      if ( attrs.model === undefined ) {
        throw new Error("'data-model' attribute on blt-toggle-switch component is required but was undefined.");
      }

      // Add toggle-switch class to our element and set role to checkbox
      elem.addClass('toggle-switch');
      elem.attr('role', 'checkbox');

      if ( attrs.justify && attrs.justify == 'right' ) {
        elem.addClass('toggle-right');
      } else if ( attrs.justify && attrs.justify == 'center' ) {
        elem.addClass('toggle-center');
      } else if ( attrs.justify && attrs.justify == 'left' ) {
        elem.addClass('toggle-left');
      }

      // Listen for keydown events and toggle if space key is pressed.
      elem.on('keydown', function( e ) {
        var key = e.which ? e.which : e.keyCode;
        if ( key === 32 ) {
          e.preventDefault();
          scope.$apply(scope.toggle);
        }
      });

      // Toggle the model value from true to false.
      function toggle() {
        if ( !scope.disabled ) {
          scope.model = !scope.model;
          if ( scope.change ) {
            $timeout( scope.change, 0);
          }
        }
      }
    }
  }
})();
(function() {
  'use strict';

  /**
   * @ngdoc module
   * @name blt_view
   * @description ngBoltJS View component.
   *
   * @since 2.0.0
   */

  angular.module('blt_view', ['blt_core', 'ngRoute']);

})();
(function() {
  'use strict';

  angular.module('blt_view')
    .directive('bltViewAnimate', bltViewAnimate);

  function bltViewAnimate( viewFactory ) {
    return {
      restrict: 'A',
      link: linkFn
    }

    function linkFn( scope, elem, attrs ) {
      viewFactory.removeLastAnimationClass(elem.parent());

      var currentViewIndex = viewFactory.getCurrentViewIndex();
      var animationClass = viewFactory.getViewAnimationClass(currentViewIndex);

      try {
        elem.parent().addClass(animationClass);
      } catch( e ) {
        console.warn('Could not apply animation: ' + animationClass + ' to element.', e);
      }

      var updates = {
        lastViewIndex: currentViewIndex,
        lastAnimationClass: animationClass
      }
      viewFactory.updateViewState(updates);
    }
  }

  bltViewAnimate.$inject = ['viewFactory'];
})();
(function() {
  'use strict';

  angular.module('blt_view')
    .directive('bltView', bltView);

  /**
   * @ngdoc directive
   * @name bltView
   * @module blt_view
   * @restrict E
   * @since 1.11.0
   *
   * @description This directive is a wrapper for Angular's ngView directive, which contains the 'pages' of your
   * application and applies CSS classnames for the animation that was set in your app's `views.json` file.
   *
   * The current view follows the path of the URL which can be changed by using the `href` attribute of an `a` tag or
   * the [ng-href](https://docs.angularjs.org/api/ng/directive/ngHref) directive. You can change views programmatically
   * using the Angular [$location](https://docs.angularjs.org/api/ng/service/$location) service or by passing the
   * routes and params to {@link BltApi#switchViews}.
   *
   * See {@link blt_appViews} for documentation on how to define views.
   *
   * @usage
   * ```html
   * <blt-view></blt-view>
   * ```
   */
  function bltView() {
    var directive = {
      restrict: 'E',
      template: '<ng-view class="view-content blt-animate" blt-view-animate></ng-view>',
      compile: compileFn
    };

    return directive;

    function compileFn( tElem, tAttrs ) {
      tElem.addClass('view');
    }
  }
})();
(function() {
  angular.module('blt_view')
    .factory('viewFactory', viewFactory);
  /**
   * @ngdoc service
   * @name ViewFactory
   * @module blt_view
   * @description This factory provides basic view property information such as the current view's index and state, as well as
   * what animation classes are attached to it.
   *
   * @requires https://docs.angularjs.org/api/ngRoute/service/$route
   * @requires https://docs.angularjs.org/api/ng/service/$location
   */

  function viewFactory( $route, $location, views ) {
    var viewState = {
      lastViewIndex: undefined,
      lastAnimationClass: null
    }
    var factory = {
      getCurrentViewIndex: getCurrentViewIndex,
      getViewAnimationClass: getViewAnimationClass,
      removeLastAnimationClass: removeLastAnimationClass,
      updateViewState: updateViewState
    };
    return factory;

    /**
     * @ngdoc method
     * @name ViewFactory#getCurrentViewIndex
     * @description Gets the index of the current view.
     * @returns {number} The index of the current view.
     *
     */
    function getCurrentViewIndex() {
      var path = $route.current.$$route.originalPath;
      return getViewIndex(path);
    }

    /**
     * @ngdoc method
     * @name ViewFactory#getViewAnimationClass
     * @description Gets the animation class of the current view.
     * @param {number} currentViewIndex The index of the current view.
     * @returns {string} The animation class name.
     *
     */
    function getViewAnimationClass( currentViewIndex ) {
      var lastViewIndex = viewState.lastViewIndex;
      if ( isNaN(lastViewIndex) ) {
        return null;
      }

      var animation = views[currentViewIndex].animation;
      if ( animation ) {
        switch ( animation ) {
          case 'fade':
            return 'fade';
          case 'slide':
            if ( isNaN(currentViewIndex) || isNaN(lastViewIndex) ) {
              return null;
            } else if ( currentViewIndex < lastViewIndex ) {
              return 'slide-right';
            } else if ( currentViewIndex > lastViewIndex ) {
              return 'slide-left';
            }
        }
      }
      return null;
    }

    /**
     * @ngdoc method
     * @name ViewFactory#removeLastAnimationClass
     * @description Removes the stored lastAnimationClass from the passed element. If lastAnimationClass
     * is null or undefined, returns without doing anything.
     * @param {angular.Element} elem The element to remove the class.
     *
     */
    function removeLastAnimationClass( elem ) {
      try {
        var animationClass = viewState.lastAnimationClass;
        if ( animationClass ) {
          elem.removeClass(animationClass);
        }
      } catch( e ) {
        console.error('Could not remove animation class ' + animationClass + ' from element.', e);
      }
    }

    /**
     * @ngdoc method
     * @name ViewFactory#updateViewState
     * @description Merges updates with the viewState properties.
     * @param {Object} updates Object to merge with viewState object.
     *
     */
    function updateViewState( updates ) {
      angular.merge(viewState, updates);
    }

    /**
     * Private Functions
     */

    /**
     * @private
     */
    function getViewIndex( path ) {
      for ( var i = 0; i < views.length; i++ ) {
        var view = views[i];
        if ( view.path == path ) {
          return i;
        }
      }
      console.warn('Could not get index of view: ' + path);
      return null;
    }
  }

  viewFactory.$inject = ['$route', '$location', 'views'];
})();
(function() {
  'use strict';

  var injectedDependencies = ['blt_appProfile', 'blt_dataRoutes'];
  try {
    angular.module('ngCordova');
    injectedDependencies.push('ngCordova');
  } catch( error ) {
    console.warn("Not injecting ngCordova! Module not found.");
  }

  /**
   * @ngdoc module
   * @name blt_data
   *
   * @description
   * The data module provides a unified interface for interacting with various
   * data sources external to an application.
   *
   * @requires http://ngcordova.com/docs/
   * @requires https://docs.angularjs.org/api/ng/service/$http
   * @requires http://autobahn.ws/js/reference.html
   */
  angular.module('blt_data', injectedDependencies);
})();
(function() {
  'use strict';

  angular.module('blt_data')
    .provider('BltDataConfig', BltDataConfig);

  /**
   * @ngdoc object
   * @name BltDataConfig
   * @module blt_data
   *
   * @description
   * This provider provides access to the configuration properties that can be
   * assigned in the active ngBoltJS Profile and route definitions defined in
   * `routes.json`.
   */
  function BltDataConfig() {
    // Local variables
    var configured = false;
    /**
     * The configured protocol. One of 'wamp', 'sqlite', or 'rest'.
     */
    var protocol = undefined;
    /**
     * The configured servers. Can contain a 'rest' and a 'wamp' member, each of
     * which contain settings relevant to each server type. Rest server settings
     * include 'url' and 'headers'. Wamp server settings include 'url' and
     * 'realm'.
     */
    var servers = undefined;
    /**
     * The configured database settings for use by the 'sqlite' protocol.
     * Defines name, version and optional `createFromLocation` property.
     */
    var database = undefined;
    /**
     * The table of routes declared and built from routes.json.
     */
    var routeTable = undefined;
    /**
     * The configured retry max. Determines the maximum times to reconnect to a
     * service before giving up. Defaults to 5.
     */
    var retryMax = 5;
    /**
     * The configured retry delay in milliseconds. Determines the amount of time
     * to wait between connection attempts. Defaults to 5000.
     */
    var retryDelay = 5000;

    /**
     * The available protocol types: 'wamp', 'sqlite', and 'rest'.
     */
    var protocolType = {
      rest: 'rest',
      sqlite: 'sqlite',
      wamp: 'wamp'
    };

    /**
     * The available returns types: 'text', 'array', 'object' and 'void'.
     */
    var returnType = {
      text: 'text',
      array: 'array',
      object: 'object',
      void: 'void'
    };

    initialize();

    // Public interface
    return ({
      $get: getBltDataConfigProvider
    });

    ////////////////////////////////////////////////////////////

    /**
     * Initialize the provider performing keyword replacement on the supplied
     * configuration, if necessary.
     */
    function initialize() {
      try {
        var $profile = angular.injector(['blt_appProfile']);
        var $routes = angular.injector(['blt_dataRoutes']);
      } catch( error ) {
        console.error("Unable to init ngBoltJS data provider!", error);
      }
      try {
        protocol = $profile.get('data').protocol;
      } catch( error ) {
        throw new Error("Configuration does not specify a data protocol!");
      }

      try {
        retryMax = $profile.get('data').retryMax;
        retryDelay = $profile.get('data').retryDelay;
      } catch( error ) {
        console.warn("Using default values for retry attempts.");
      }
      try {
        if ( protocol === protocolType.sqlite ) {
          database = angular.copy($profile.get('database'));
        } else {
          servers = angular.copy($profile.get('servers'));
          var server = servers.wamp;
          if ( server.url.indexOf('$local') > -1 ) {
            var $window = angular.injector(['ng']).get('$window');
            server.url = server.url.replace("$local", $window.location.hostname);
          }
          if ( server.url.indexOf('$port') > -1 ) {
            var $window = angular.injector(['ng']).get('$window');
            server.url = server.url.replace("$port", $window.location.port ||
              ( $window.location.protocol === "https:" ? 443 : 80 ) );
          }
        }
      } catch( error ) {
        var msg = (protocol === protocolType.sqlite)
          ? "Missing configuration for database."
          : "Missing configuration for servers.";
        console.warn(msg);
      }
      try {
        routeTable = angular.copy($routes.get('routes'));
        configured = true;
      } catch( error ) {
        throw new Error("Configuration does not specify any routes!");
      }
    }

    function getBltDataConfigProvider() {
      return ({
        get configured()   { return configured; },
        get protocol()     { return protocol; },
        get servers()      { return servers; },
        get database()     { return database; },
        get protocolType() { return protocolType; },
        get returnType()   { return returnType; },
        get retryMax()     { return retryMax; },
        get retryDelay()   { return retryDelay; },
        getRouteData : getRouteData
      });

      /**
       * Get the data object from the routeTable that matches the named route.
       */
      function getRouteData( routeName ) {
        var routeData = undefined;
        if ( angular.isUndefined(routeTable) ) {
          throw new Error("Configuration is not loaded or doesn't exist!");
        } else {
          if ( angular.isDefined(routeTable[routeName]) ) {
            if ( angular.isDefined(routeTable[routeName][protocol]) ) {
              routeData = angular.copy(routeTable[routeName][protocol]);
              routeData['return'] = routeTable[routeName].return;
            }
          }
        }

        return routeData;
      }
    }
  }
})();

(function() {
  'use strict';

  angular.module('blt_data')
    .service('BltData', BltData);

  /**
   * @ngdoc service
   * @name BltData
   * @module blt_data
   *
   * @description
   * This service provides abstracted access to the various routes defined in
   * the `routes.json` file found in the config folder of the project directory.
   * Route and configuration data is pulled in via BltDataConfig provider.
   * Configuration and usage examples can be viewed in the Data API Guide.
   *
   * @requires https://docs.angularjs.org/api/auto/service/$timeout
   * @requires https://docs.angularjs.org/api/auto/service/$q
   * @requires https://docs.angularjs.org/api/auto/service/$injector
   * @requires BltApi
   * @requires BltDataConfig
   */
  function BltData( $timeout, $q, $injector, bltApi, bltDataConfig ) {

    var generator = undefined;
    var connectPromise = undefined;
    var disconnectPromise = undefined;
    var protocol = undefined;
    var provider = undefined;
    var subscriptions = undefined;
    var registrations = undefined;
    var connectionConfig = undefined;

    // Connection states
    var connectionStates = {
      disconnected: "disconnected",
      connecting: "connecting",
      connected: "connected",
      disconnecting: "disconnecting",
      failed: "failed"
    };

    // Initial connection state
    var connectionState = connectionStates.disconnected;

    // Protocol permissions on the API
    var apiPermissions = {};
    apiPermissions[bltDataConfig.protocolType.rest] = [
      'call'
    ];
    apiPermissions[bltDataConfig.protocolType.sqlite] = [
      'call'
    ];
    apiPermissions[bltDataConfig.protocolType.wamp] = [
      'call',
      'subscribe',
      'unsubscribe',
      'publish',
      'register',
      'unregister'
    ];

    // SQLite sub-service object
    var sqlite = {
      database: undefined
    };

    // Wamp sub-service object
    var wamp = {
      connection: undefined,
      session: undefined
    };

    // Data service public API
    var service = {
      call: call,
      connect: connect,
      disconnect: disconnect,
      isConnected: isConnected,
      publish: publish,
      register: register,
      setConnectionConfig: setConnectionConfig,
      getConnectionConfig: getConnectionConfig,
      subscribe: subscribe,
      unregister: unregister,
      unsubscribe: unsubscribe,
      /**
       * @ngdoc method
       * @name BltData#onconnect
       * @description
       * A function can be assigned to this member by the ngBoltJS developer to
       * hook the 'onconnect' event. This will be triggered any time the state
       * transitions to `connected`.
       */
      onconnect: undefined,
      /**
       * @ngdoc method
       * @name BltData#ondisconnect
       * @description
       * A function can be assigned to this member by the ngBoltJS developer to
       * hook the 'ondisconnect' event. This will be triggered any time the
       * state transitions to `disconnected`.
       */
      ondisconnect: undefined,
      /**
       * @ngdoc method
       * @name BltData#onfailed
       * @description
       * A function can be assigned to this member by the ngBoltJS developer to
       * hook the 'onfailed' event. This will be triggered any time a connection
       * attempt fails to complete successfully.
       */
      onfailed: undefined
    };

    activate();

    return service;

    ///// PUBLIC API ///////////////////////////////////////////

    /**
     * @ngdoc method
     * @name BltData#call
     * @description
     * Makes a request for the specified route name with the supplied arguments.
     *
     * @param {String} routeName The name of the route to call.
     * @param {Object} args The object containing call arguments to be extracted
     * by the route specification.
     *
     * @returns {Object} Returns a promise that resolves to an object that
     * contains the call's returned data or rejects to an object that contains
     * undefined data and description of why the call was rejected.
     *
     * @example 
     * <example> 
     *   <javascript> 
     *     var onsuccess = function(data){
     *       console.log(data);
     *     }
     *     var onfail = function(error){
     *       console.error(error);
     *     }
     *     bltData.call('example', {'foo': 'someFoo', 'bar': 'someBar'})
     *       .then(onsuccess, onfail);
     *   </javascript> 
     * </example>
     */
    function call( routeName, args ) {
      return onInvoke('call')
        .then(function() {
          return onCall(routeName, args);
        });
    }

    /**
     * @ngdoc method
     * @name BltData#connect
     * @description
     * Initializes the Data API.  Invoking this method will connect the Data API
     * to use the protocol for which it was configured, automatically handling
     * making the necessary connections and retries on failure.
     *
     * @returns {Object} A promise that resolves when the Data API successfully
     * initializes or fails to do so.  If the Data API does not successfully
     * configure, a message is logged.
     *
     */
    function connect() {
      // If we're already attempting a connection, use the existing promise.
      if ( connectPromise ) return connectPromise;

      // If we're already connected. Just resolve.
      if ( connectionState == connectionStates.connected ) return $q.resolve();

      var deferred = $q.defer();
      connectPromise = deferred.promise;
      var connectionAttempts = 1;

      if ( disconnectPromise ) {
        disconnectPromise.then(function() {
          setConnectionState(connectionStates.connecting);
          doConnect();
        });
        disconnectPromise = undefined;
      } else {
        setConnectionState(connectionStates.connecting);
        doConnect();
      }

      /**
       * Performs a connection attempt by initializing the appropriate call
       * generator for the configured data protocol.
       */
      function doConnect() {
        initializeGenerator()
          .then(function() {
            // The generator is the artifact actually handling making the
            // connection. As long as the promise it returns resolves, we've
            // connected.
            subscriptions = new Subscriptions();
            registrations = new Registrations();
            setConnectionState(connectionStates.connected);
            deferred.resolve();
            // Clear the connection promise
            connectPromise = undefined;
          })
          .catch(function( error ) {
            ++connectionAttempts;
            if ( connectionState == connectionStates.connecting ) {
              if ( bltDataConfig.retryMax >= 0 &&
                connectionAttempts > bltDataConfig.retryMax ) {
                bltApi.warn(
                  "ngBoltJS data service unable to connect.",
                  "Reached retry limit.");
                setConnectionState(connectionStates.failed);
                deferred.reject("Retry limit reached.");
                onServiceFailed();
                // Clear the connection promise
                connectPromise = undefined;
              } else if ( connectionState == connectionStates.connecting ) {
                bltApi.info(
                  "ngBoltJS data service attempting reconnect in",
                  bltDataConfig.retryDelay / 1000,
                  "seconds (attempt",
                  connectionAttempts,
                  (bltDataConfig.retryMax > 0)
                    ? "of " + bltDataConfig.retryMax + ")" : ")"
                );
                $timeout(doConnect, bltDataConfig.retryDelay);
              }
            } else {
              bltApi.warn("Connection aborted due to explicit disconnect.");
              deferred.reject();
            }
          });
      }

      return connectPromise;
    }

    /**
     * @ngdoc method
     * @name BltData#disconnect
     * @description
     * Terminates the connection to the server, if one exists, and invoke any
     * cleanup necessary to cleanly shut down the service.
     *
     * @returns {Object} A promise that will resolve on disconnect.
     */
    function disconnect() {
      if ( disconnectPromise ) {
        return disconnectPromise;
      } else if ( connectionState == connectionStates.disconnected ) {
        return $q.resolve();
      }

      var deferred = $q.defer();
      disconnectPromise = deferred.promise;

      var all = [];
      if ( connectPromise ) {
        all.push(connectPromise);
        connectPromise = undefined;
      }

      bltApi.info('ngBoltJS data service attempting to disconnect.');
      setConnectionState(connectionStates.disconnecting);

      return $q.all(all).then(terminate, terminate);

      function terminate() {
        terminateGenerator()
          .then(function() {
            setConnectionState(connectionStates.disconnected);
            deferred.resolve();
          });
      }
    }

    /**
     * @ngdoc method
     * @name BltData#isConnected
     * @description
     * Returns a promise that will resolve if/whenthe connection state is set to
     * `connected`.  If the serivce is currently in the process of connecting,
     * the connection promise will be returned, which will resolve upon the
     * resolution of the connection attempt.  Otherwise the promise is resolved
     * or rejected based upon the current connection state (resolve if the state
     * is `connected`, reject otherwise).
     *
     * @returns {Object} A promise that will resolve if the state is
     * `connected`, or when the state transitions to `connected` from
     * `connecting`. Rejects in all other states.
     */
    function isConnected() {
      if ( connectPromise ) return connectPromise;
      if ( connectionState == connectionStates.connected ) return $q.resolve();
      return $q.reject(new ResponseObject(
        "ERROR",
        undefined,
        "Not connected."));
    }

    /**
     * @ngdoc method
     * @name BltData#publish
     * @description
     * Publishes a message to a topic.  Only valid when the service is configured
     * to use the WAMP protocol.
     *
     * @returns {Object} Returns a promise that resolves to an object
     * describing that the publish call was successful or rejects to an object
     * describing why the publish failed.
     */
    function publish( topic, message, options ) {
      return onInvoke('publish')
        .then(function() {
          return onPublish(topic, message, options);
        });
    }

    /**
     * @ngdoc method
     * @name BltData#register
     * @description
     * Registers a remote procedure.  Only valid when the service is configured
     * to use the WAMP protocol.
     *
     * @returns {Object} Returns a promise that resolves to an object
     * describing that registration was successful or rejects to an object 
     * describing why the registration failed. If successful, the promise will 
     * also contain a hash that identifies the registration.
     */
    function register( endpoint, method ) {
      return onInvoke('register')
        .then(function() {
          return registrations.add(endpoint, method);
        })
    }

    /**
     * @ngdoc method
     * @name BltData#setConnectionConfig
     * @description
     * Updates the connection configuration for this instance of BltData.  If the
     * state is `connected` or `connecting`, the service is disconnected and
     * reconnected with the given configuration.  This is primarily used to
     * inject authentication configuration into the BltData connection.
     *
     * @param {Object} config An object that contains the new configuration.
     *
     * @returns {Object} A promise that resolves when the configuration has been
     * set. If a reconnect is required, the promise will resolve when the 
     * reconnection is complete.
     */
    function setConnectionConfig( config ) {
      if ( !angular.equals(config, connectionConfig) ) {
        connectionConfig = config;
        if ( isConnecting() ) {
          return disconnect()
            .then(function() {
              return connect();
            })
        } else {
          return isConnected()
            .then(function() {
              disconnect()
                .then(function() {
                  return connect();
                });
            }, function(){
              return $q.when();
            });
        }
      } else {
        return $q.when();
      }
    }

    /**
     * @ngdoc method
     * @name BltData#getConnectionConfig
     * @description
     * Gets a copy of the current connection config. Note that it is a copy and changes to the returned object will not
     * affect the data service connection config and changes to the data service connection config will not be
     * reflected in the config object returned by this function.
     *
     * @returns {Object} A copy of the current connection config object.
     */
    function getConnectionConfig() {
       return angular.copy(connectionConfig);
    }

    /**
     * @ngdoc method
     * @name BltData#subscribe
     * @description
     * Subscribe to a topic. Only valid if the service is configured to use the
     * WAMP protocol.
     *
     * @param {String} topic The topic to subscribe to.
     * @param {Function} callback The callback to invoke when a message is
     * received.
     * @param {Object} options Options to pass during subscription creation.
     *
     * @returns {Object} Returns a promise that resolves to an object describing that
     * the subscription was successful or rejects to an object describing why the 
     * subscription failed. If successful, the promise will also contain a hash that 
     * identifies the subscription.
     */
    function subscribe( topic, callback, options ) {
      return onInvoke('subscribe')
        .then(function() {
          return subscriptions.add(topic, callback, options);
        })
    }

    /**
     * @ngdoc method
     * @name BltData#unregister
     * @description
     * Unregister a remote procedure.  Only valid if the service is configured
     * to use the WAMP protocol.
     *
     * @param {String} hash The hash that identifies the remote procedure.
     *
     * @returns Returns a promise that resolves to an object describing that
     * un-registration was successful or rejcts to an object describing why the
     * un-registration of the remote procedure failed.
     */
    function unregister( hash ) {
      return onInvoke('unregister')
        .then(function() {
          return registrations.remove(hash);
        })
    }

    /**
     * @ngdoc method
     * @name BltData#unsubscribe
     * @description
     * Unsubscribe from a topic. Only valid if the service is configured to use
     * the WAMP protocol.
     *
     * @param {String} hash The hash that identifies the subscription.
     *
     * @returns {Object} Returns a promise that resolves to an object describing
     * that removing the topic subscription was successful or rejects to an
     * object describing why removing the topic subscription failed.
     */
    function unsubscribe( hash ) {
      return onInvoke('unsubscribe')
        .then(function() {
          return subscriptions.remove(hash);
        })
    }

    ///// PRIVATE API //////////////////////////////////////////

    /**
     * @name BltData#activate
     * @description
     * Activate the service.
     */
    function activate() {
      protocol = bltDataConfig.protocol;
    }

    /**
     * @name BltData#isConnecting
     * @description
     * Whether or not the service is currently attempting to establish a
     * connection to a data source.
     */
    function isConnecting() {
      return (connectPromise && connectionState == connectionStates.connecting);
    }

    /**
     * @name BltData#initializeDatabase
     * @description
     * Initialize the SQLite/WEBSql database connection.
     *
     * @returns Returns a promise that resolves to the database instance or
     * rejects to undefined.
     */
    function initializeDatabase() {
      return $q(function( resolve, reject ) {
        var config = bltDataConfig.database;
        bltApi.info("Attempting to connect to database:", config.name);
        provider = $injector.get('$cordovaSQLite');
        if ( window.cordova ) {
          bltApi.debug("Using cordovaSQL...");
          document.addEventListener('deviceready', function() {
            try {
              var location = (angular.isDefined(config.createFromLocation)) ? config.createFromLocation : 1;
              sqlite.database = provider.openDB(
                {name: config.name, createFromLocation: location});
            } catch( error ) {
              reject(error);
            }
            if ( angular.isDefined(sqlite.database) ) {
              onServiceConnect();
              resolve(sqlite.database);
            } else {
              reject("SQLite database does not exist.");
            }
          });
        } else {
          bltApi.debug("Using WebSQL...");
          sqlite.database = window.openDatabase(
            config.name, config.version, config.name, 2 * 1024 * 1024);
          if ( angular.isDefined(sqlite.database) ) {
            onServiceConnect();
            resolve();
          } else {
            reject("SQLite database does not exist.");
          }
        }
      });
    }

    /**
     * @name BltData#terminateGenerator
     * @description
     * Terminate the call generator.  The call generator executes the
     * appropriate initialization method and populates the generator object
     * based on the protocol for which the data API is configured.
     *
     * @returns Return a promise that resolves if termination of the generator
     * was successful or rejects on failure.
     */
    function terminateGenerator() {
      return $q(function( resolve, reject ) {
        provider = undefined;
        generator = undefined;
        switch ( bltDataConfig.protocol ) {
          case bltDataConfig.protocolType.wamp:
            terminateWampConnection();
            resolve();
            break;
          case bltDataConfig.protocolType.sqlite:
          case bltDataConfig.protocolType.rest:
            resolve();
            break;
          default:
            reject("Unknown protocol: " + protocol);
        }
      });
    }

    /**
     * @name BltData#initializeGenerator
     * @description
     * Initialize the call generator.  The call generator executes the
     * appropriate initialization method and populates the generator object
     * based on the protocol for which the data API is configured.
     *
     * @returns Return a promise that resolves if configuration of the generator
     * was successful or rejects on failure.
     */
    function initializeGenerator() {
      return $q(function( resolve, reject ) {
        switch ( bltDataConfig.protocol ) {
          case bltDataConfig.protocolType.wamp:
            initializeWampConnection()
              .then(function( session ) {
                provider = session;
                generator = {
                  exec: generateWampRequest,
                  type: bltDataConfig.protocolType.wamp
                };
                resolve();
              })
              .catch(function( error ) {
                reject(error);
              });
            break;
          case bltDataConfig.protocolType.sqlite:
            initializeDatabase()
              .then(function() {
                try {
                  generator = {
                    exec: generateSQLiteRequest,
                    type: bltDataConfig.protocolType.sqlite
                  };
                  resolve();
                } catch( error ) {
                  reject(error);
                }
              })
              .catch(function( error ) {
                reject(error);
              });
            break;
          case bltDataConfig.protocolType.rest:
            try {
              provider = $injector.get('$http');
              generator = {
                exec: generateHTTPRequest,
                type: bltDataConfig.protocolType.rest
              };
              resolve();
            } catch( error ) {
              reject(error);
            }
            break;
          default:
            reject("Unknown protocol: " + protocol);
        }
      });
    }

    /**
     * @name BltData#initializeWampConnection
     * @description
     * Initialize a WAMP connection.
     *
     * @returns Return a promise that resolves if the WAMP connection was
     * successfully connected or rejects on failure.
     */
    function initializeWampConnection() {
      return $q(function( resolve, reject ) {
        if ( angular.isDefined(bltDataConfig.servers) &&
          angular.isDefined(bltDataConfig.servers.wamp) ) {
          var providerConfig = bltDataConfig.servers.wamp;
          try {
            bltApi.info("Connecting to:", providerConfig.url);
            var config = {
              url: providerConfig.url,
              realm: providerConfig.realm,
              max_retries: 0
            };
            var authconfig = connectionConfig;
            if ( authconfig &&
              authconfig.authid &&
              angular.isFunction(authconfig.onchallenge) &&
              authconfig.authmethods ) {
              config.authid = authconfig.authid;
              config.authmethods = authconfig.authmethods;
              config.onchallenge = authconfig.onchallenge;
            }
            // Check to make sure Autobahn exists before trying to use it
            if ( !angular.isDefined(autobahn) ) {
              reject("Autobahn not found! Check NPM installation.");
            } else {
              wamp.connection = new autobahn.Connection(config);
              wamp.connection.onopen = function( session ) {
                bltApi.info("Connected to WAMP server:", config.url);
                wamp.session = session;
                resolve(session);
                onServiceConnect();
              };
              wamp.connection.onclose = function( reason, details ) {
                bltApi.info("Disconnected from WAMP server: " + reason, details);
                if ( details.reason === 'wamp.error.authentication_failed' ||
                     details.reason === 'wamp.error.not_authorized' ||
                     details.reason === 'wamp.error.authorization_failed') {
                  bltApi.publish('bltData', 'auth_failed');
                }
                onServiceDisconnect();
              };
              wamp.connection.open();
            }
          } catch( error ) {
            reject(error);
          }
        } else {
          bltApi.warn("Missing configuration for WAMP server!");
          resolve();
        }
      })
    }

    /**
     * @name BltData#terminateWampConnection
     * @description
     * Terminate the WAMP connection.
     *
     * @returns Return a promise that resolves if the WAMP connection was
     * successfully connected or rejects on failure.
     */
    function terminateWampConnection() {
      return $q(function( resolve ) {
        if ( wamp && wamp.connection ) {
          try {
            wamp.connection.close();
          } catch( error ) {
            console.warn("Connection already closed.");
          }
        } else {
          bltApi.warn("Missing configuration for WAMP server!");
        }
        resolve();
      })
    }

    /**
     * @name BltData#generateHTTPRequest
     * @description
     * Generate a request for the REST protocol.
     *
     * @param method The REST method type (e.g., "GET", "POST").
     * @param routeData The route data from the API configuration.
     * @param args The arguments to pass to the request.
     *
     * @returns Return a promise that resolves or rejects based on the result of
     * the HTTP request.
     */
    function generateHTTPRequest( method, routeData, args ) {
      var localArgs = angular.copy(args);
      var paramObj = {};
      var dataObj = {};
      var targetUrl = routeData.url;

      // Assign properties to paramObj and parse/replace dynamically constructed
      // URL
      if ( !angular.isUndefined(localArgs) ) {
        var regex = /(\$[a-zA-Z]+)/g;
        var match = regex.exec(targetUrl);
        // Collect capture groups into token list
        var tokens = [];
        while ( match != null ) {
          tokens.push(match[0]);
          match = regex.exec(targetUrl);
        }
        // Do the replacement
        angular.forEach(tokens, function( tok ) {
          targetUrl = targetUrl.replace(tok, localArgs[tok.substr(1)]);
          delete localArgs[tok.substr(1)]; // Remove property so it doesn't end
                                           // up being part of a query string
        });

        angular.forEach(routeData.query, function( key ) {
          if ( localArgs.hasOwnProperty(key) ) {
            paramObj[key] = localArgs[key];
          }
        });

        dataObj = args.hasOwnProperty(routeData.body)
          ? args[routeData.body]
          : {};
      }

      return provider(
        {
          method: method,
          url: targetUrl,
          params: paramObj,
          data: dataObj
        });
    }

    /**
     * Generate a SQLite/WEBSql request.
     *
     * @param routeData The route data from the API configuration.
     * @param args The arguments to pass to the request.
     *
     * @returns Returns a promise that resolves or rejects based on the result
     * of the SQLite/WEBSql request.
     */
    function generateSQLiteRequest( routeData, args ) {
      var query = null;
      var argsAry = [];

      // Likewise if we don't have a query property
      if ( routeData.hasOwnProperty('query') ) {
        query = routeData.query;
      } else {
        throw new Error('No query defined for target!');
      }

      if ( !angular.isUndefined(args) ) {
        angular.forEach(routeData.args, function( key ) {
          if ( args.hasOwnProperty(key) ) {
            argsAry.push(args[key]);
          }
        });
      }

      return provider.execute(sqlite.database, query, argsAry);
    }

    /**
     * @name BltData#generateWampRequest
     * @description
     * Generates a WAMP request.
     *
     * @param routeData The route data from the API configuration.
     * @param args The arguments to pass to the request.
     *
     * @returns Returns a promise that resolves or rejects based on the result
     * of the SQLite/WEBSql request.
     */
    function generateWampRequest( routeData, args ) {
      var argsAry = [];
      var kargsObj = {};
      var optsObj = {};

      if ( angular.isDefined(args) ) {
        angular.forEach(routeData.args, function( key ) {
          if ( args.hasOwnProperty(key) ) {
            argsAry.push(args[key]);
          }
        });
        angular.forEach(routeData.kargs, function( key ) {
          if ( args.hasOwnProperty(key) ) {
            kargsObj[key] = args[key];
          }
        });
        angular.forEach(routeData.options, function( key ) {
          if ( args.hasOwnProperty(key) ) {
            optsObj[key] = args[key];
          }
        });
      }
      return provider.call(routeData.rpc, argsAry, kargsObj, optsObj);
    }

    /**
     * @name BltData#onCall
     * @description
     * Executes the call, processes the response from the call, and builds a
     * ResponseObject that describes the result of the call.
     *
     * @param routeName The name of the route for the call.
     * @param args The arguments to be passed to the call.
     *
     * @returns Returns a promise that resolves or rejects to a ResponseObject
     * that describes the result of the call and contains the result of the
     * call, if any.
     */
    function onCall( routeName, args ) {
      var data = undefined;
      var routeData = bltDataConfig.getRouteData(routeName);

      // Build an object and a promise that the API clients will use
      return $q(function( resolve, reject ) {
        var responseObject = new ResponseObject("ERROR", undefined, "");
        responseObject.details.call = routeName;
        // If no route data exists...this is a problem - fail hard, NOW!
        if ( angular.isUndefined(routeData) ) {
          responseObject.status = data;
          responseObject.details.message =
            "No route data for '" + routeName + "' with protocol '" +
            protocol + "'";
          reject(responseObject);
        } else {
          // Get the promise that actually does the work from the generator.
          var callPromise;
          if ( protocol === bltDataConfig.protocolType.rest ) {
            callPromise = generator.exec(routeData.type, routeData, args);
          } else {
            callPromise = generator.exec(routeData, args);
          }
          // Get the return type so we can act appropriately.
          var returnType = routeData.return;
          if ( returnType === bltDataConfig.returnType.text &&
            generator.type === bltDataConfig.protocolType.sqlite ) {
            // Text return types are unsupported for sqlite.
            responseObject.data = processCallError(returnType);
            responseObject.details.message = "Text return type not supported.";
            reject(responseObject);
          } else {
            callPromise
              .then(function( response ) {
                var data =
                  processCallResponse(returnType, generator.type, response);
                if ( angular.isUndefined(data.error) ) {
                  responseObject.status = "OK";
                  responseObject.data = data.data;
                  responseObject.details.message =
                    "Processed call successfully";
                  resolve(responseObject);
                } else if ( angular.isDefined(data.error) ) {
                  responseObject.data = data.data;
                  responseObject.details.message = data.error.message;
                  responseObject.details.error = data.error.details;
                  reject(responseObject);
                }
              })
              .catch(function( error ) {
                var errorMessage = "Unknown error.";
                if ( protocol == bltDataConfig.protocolType.wamp ) {
                  errorMessage = error.error;
                } else if ( protocol == bltDataConfig.protocolType.sqlite ) {
                  errorMessage = error.message;
                } else {
                  errorMessage = error.statusText;
                }
                responseObject.data = processCallError(returnType);
                responseObject.details.message = errorMessage;
                reject(responseObject);
              });
          }
        }
      });
    }

    /**
     * @name BltData#onInvoke
     * @description
     * Checks that the Data API current protocol supports the invocation type.
     *
     * @param invocationType A string describing the invocation method.
     *
     * @returns Returns a promise that resolves if the protocol supports the
     * invocation type or rejects to an object that describes the failure.
     */
    function onInvoke( invocationType ) {
      return isConnected()
        .then(function() {
          return $q(function( resolve, reject ) {
            // If the service is connected, but not configured properly, we
            // need to notify the client and complain about it
            if ( angular.isUndefined(provider) ) {
              reject(new ResponseObject(
                "ERROR",
                undefined,
                "Call rejected: data service is mis-configured!"));
            }
            // Check the protocol and see if we're allowed to make this call
            if ( apiPermissions[protocol].indexOf(invocationType) != -1 ) {
              resolve();
            } else {
              reject(new ResponseObject(
                "ERROR",
                undefined,
                "Operation not supported using " + protocol));
            }
          });
        })
        .catch(function() {
          reject(new ResponseObject(
            "ERROR",
            undefined,
            "Call rejected: data service is not connected."));
        });
    }

    /**
     * @name BltData#onPublish
     * @description
     * Executes a publish.
     *
     * @param topic The topic on which to publish.
     * @param data The dat to publish to the topic.
     * @param options Publishing options.
     *
     * @returns Return a promise that resolves or rejects to a ResponseObject
     * that describes the result of the call and contains no data.
     */
    function onPublish( topic, data, options ) {
      var deferred = $q.defer();

      function doPublish() {
        var publishOptions = options || {};
        publishOptions.acknowledge = true;
        var publishArgs = [];
        if ( angular.isDefined(data.args) ) {
          publishArgs = data.args;
        }
        var publishKargs = {};
        if ( angular.isDefined(data.kargs) ) {
          publishKargs = data.kargs;
        }
        wamp.session.publish(topic, publishArgs, publishKargs, publishOptions)
          .then(function() {
            deferred.resolve(new ResponseObject(
              "OK",
              undefined,
              "Published message over WAMP channel."));
          })
          .catch(function( error ) {
            deferred.reject(new ResponseObject(
              "ERROR",
              undefined,
              error.message));
          });
      }

      doPublish();

      return deferred.promise;
    }

    /**
     * @name BltData#onServiceConnect
     * @description
     * Callback fired when the Data API connects to a protocol.
     */
    function onServiceConnect() {
      bltApi.info("ngBoltJS data service has connected.");
      if ( angular.isFunction(service.onconnect) ) {
        service.onconnect();
      }
      bltApi.publish('bltData', 'connected');
    }

    /**
     * @name BltData#onServiceDisconnect
     * @description
     * Callback fired when the Data API disconnects from a protocol.
     */
    function onServiceDisconnect() {
      // If we were previously connected and not trying to connect, then we
      // should do some bookkeeping and notify the client if they're interested
      if ( connectionState == connectionStates.connected ) {
        bltApi.info("ngBoltJS data service has disconnected.");
        setConnectionState(connectionStates.disconnected);
        // Blow away our subscriptions and registrations
        if ( angular.isDefined(subscriptions) ) subscriptions.clear();
        if ( angular.isDefined(registrations) ) registrations.clear();
        // Invoke the callback supplied by the client, if any
        if ( angular.isFunction(service.ondisconnect) ) service.ondisconnect();
        bltApi.publish('bltData', 'disconnected');
        // Attempt to reconnect
        connect();
      }
    }

    /**
     * @name BltData#onServiceFailed
     * @description
     * Callback fired when the Data API encounters a fatal error.
     */
    function onServiceFailed() {
      if ( angular.isFunction(service.onfailed) ) service.onfailed();
      bltApi.publish('bltData', 'failed');
    }

    /**
     * @name BltData#processCallError
     * @description
     * Process a call return that resulted in an error.
     *
     * @param returnType The return type.
     *
     * @returns Returns an empty data set that is formatted for the returnType.
     */
    function processCallError( returnType ) {
      var returnData;
      switch ( returnType ) {
        case bltDataConfig.returnType.array:
          returnData = [];
          break;
        case bltDataConfig.returnType.text:
          returnData = "";
          break;
        default:
          returnData = {};
      }

      return returnData;
    }

    /**
     * @name BltData#processCallResponse
     * @description
     * Process a call return that resulted in a success.
     *
     * @param returnType The return type.
     * @param generatorType The generator type.
     * @param response The response from the call.
     *
     * @returns {Object} Returns a data set that is formatted for the returnType
     * and optionally an error if the a data type conversion error occurs.
     */
    function processCallResponse( returnType, generatorType, response ) {
      var returnData = {
        error: undefined,
        data: undefined
      };
      switch ( returnType ) {
        case bltDataConfig.returnType.array:
          returnData.data = [];
          switch ( generatorType ) {
            case bltDataConfig.protocolType.sqlite:
              // Copy the rows
              if ( response.rows.length > 0 ) {
                if ( angular.isFunction(response.rows.item) ) {
                  for ( var idx = 0; idx < response.rows.length; idx++ ) {
                    returnData.data.push(response.rows.item(idx));
                  }
                } else {
                  angular.forEach(response.rows, function( row ) {
                    returnData.data.push(row);
                  });
                }
              }
              break;
            case bltDataConfig.protocolType.rest:
              // Assumes we're receiving a JSON array
              angular.forEach(response.data, function( element ) {
                returnData.data.push(element);
              });
              break;
            case bltDataConfig.protocolType.wamp:
              if ( angular.isDefined(response) && response !== null ) {
                if ( Array.isArray(response) ) {
                  returnData.data = response;
                } else if ( typeof(response) === 'string' ) {
                  var parsed = JSON.parse(response);
                  if ( Array.isArray(parsed) ) {
                    angular.forEach(parsed, function( element ) {
                      returnData.data.push(element);
                    });
                  } else {
                    bltApi.warn("Could not convert parsed string data to array type.");
                    returnData.error = {
                      details: undefined,
                      message: "Could not convert parsed string data to array type."
                    }
                    returnData.data = parsed;
                  }
                } else if ( response && response.hasOwnProperty("args") && response.hasOwnProperty("kwargs")
                  && Array.isArray(response.args) ) {
                  returnData.data = response.args;
                } else {
                  returnData.data = [response];
                }
              }
              break;
          }
          break;
        case bltDataConfig.returnType.text:
          switch ( generatorType ) {
            case bltDataConfig.protocolType.rest:
              returnData.data = response.data;
              break;
            case bltDataConfig.protocolType.wamp:
              if ( typeof(response) === Object ) {
                returnData.data = JSON.stringify(response);
              } else {
                returnData.data = response;
              }
              break;
          }
          break;
        case bltDataConfig.returnType.void:
          break;
        default:
          switch ( generatorType ) {
            case bltDataConfig.protocolType.sqlite:
              try {
                if ( response.rows && response.rows.length > 0 ) {
                  if ( angular.isFunction(response.rows.item) ) {
                    returnData.data = response.rows.item(0);
                  } else {
                    returnData.data = response.rows[0];
                  }
                } else {
                  returnData.data = response;
                }
              } catch( error ) {
                bltApi.error("Query returned undefined.", error);
                returnData.error = {
                  details: error,
                  message: "Query returned undefined."
                }
                returnData.data = response;
              }
              break;
            case bltDataConfig.protocolType.rest:
              returnData.data = response.data;
              break;
            case bltDataConfig.protocolType.wamp:
              if ( angular.isDefined(response) && response !== null ) {
                if ( typeof response === "string" ) {
                  try {
                    returnData.data = JSON.parse(response);
                  } catch( error ) {
                    bltApi.warn("Could not convert data to object!", error);
                    returnData.error = {
                      details: error,
                      message: "Could not convert data to object!"
                    };
                    returnData.data = response;
                  }
                } else if( response && response.hasOwnProperty("args") && response.hasOwnProperty("kwargs")
                  && response.kwargs instanceof Object ){
                  returnData.data = response.kwargs;
                } else {
                  returnData.data = response;
                }
              } else {
                bltApi.warn("Could not convert null/empty data to object.");
                returnData.data = response;
                returnData.error = {
                  details: undefined,
                  message: "Could not convert null/empty data to object."
                }
              }
            break;
          }
      }

      return returnData;
    }

    /**
     * @name BltData#setConnectionState
     * @description
     * Sets the connection state.
     *
     * @param state The state to set.
     */
    function setConnectionState( state ) {
      bltApi.debug("Setting connection state:", state);
      connectionState = state;
    }

    ///// PRIVATE OBJECTS //////////////////////////////////////

    /**
     * @name SubscriptionCallbackWrapper
     * @description
     * Wrapper around a user-supplied callback for subscription messages.
     *
     * @param callback The callback to wrap.
     */
    function SubscriptionCallbackWrapper( callback ) {
      return function( message ) {
        callback([], message, {});
      }
    }

    /**
     * @name Subscriptions
     * @description
     * Manages the topics to which the data service is subscribed.
     */
    function Subscriptions() {
      var hashFunction = new Hashes.SHA1;
      var subscriptions = {};

      return ({
        add: add,
        remove: remove,
        clear: clear
      });

      /**
       * @name Subscriptions#add
       * @description
       * Add a subscription to be tracked by the subscription manager.
       *
       * @param topic The topic on which to subscribe
       * @param callback The callback to invoke when a message is received on
       * the topic channel
       * @param options Any options to pass to the subscription
       *
       * @returns Return a promise that resolves to an object that describes
       * the successful addition of the subscription, or rejects on failure.
       */
      function add( topic, callback, options ) {
        return $q(function( resolve, reject ) {
          var subscription = {
            callback: wrap(callback),
            topic: topic,
            subscription: undefined
          };
          wamp.session.subscribe(topic, subscription.callback, options)
            .then(function( wampSubsciption ) {
              // Store subscription in subscriptions map using hash from topic
              // and subscription id.
              subscription.subscription = wampSubsciption;
              var hash = hashFunction.hex(topic + wampSubsciption.id);
              subscriptions[hash] = subscription;
              resolve(new ResponseObject(
                "OK",
                hash,
                "Subscribed to topic: " + topic));
            })
            .catch(function( error ) {
              bltApi.error("Error subscribing to topic!", error);
              reject(new ResponseObject(
                "ERROR",
                undefined,
                "Error subscribing to topic!"));
            });
        });
      }

      /**
       * @name Subscriptions#remove
       * @description
       * Remove a subscription, named by its hash, from the subscription
       * manager.
       *
       * @param hash The hash of the subscription to remove.
       *
       * @returns Return a promise that resolves to an object that describes
       * the successful removal of the subscription, or rejects on failure.
       */
      function remove( hash ) {
        return $q(function( resolve, reject ) {
          if ( subscriptions.hasOwnProperty(hash) ) {
            wamp.session.unsubscribe(subscriptions[hash].subscription)
              .then(function() {
                resolve(new ResponseObject(
                  "OK",
                  undefined,
                  "Successfully unsubscribed from " +
                  subscriptions[hash].topic));
                delete subscriptions[hash];
              })
              .catch(function( error ) {
                reject(
                  new ResponseObject("ERROR", undefined, error.message));
              });
          } else {
            reject(new ResponseObject(
              "ERROR",
              undefined,
              "Subscription does not exist."));
          }
        });
      }

      /**
       * @name Subscriptions#clear
       * @description
       * Clears the subscription manager of all subscriptions.
       */
      function clear() {
        subscriptions = {};
      }
    }

    /**
     * @name Registrations
     * @description
     * Manages the procedures served by the data service.
     */
    function Registrations() {
      var hashFunction = new Hashes.SHA1;
      var registrations = {};

      return ({
        add: add,
        remove: remove,
        clear: clear
      });

      /**
       * @name Registrations#add
       * @description
       * Serve a procedure.
       *
       * @param endpoint The endpoint on which to serve the procedure.
       * @param method The method to invoke.
       *
       * @returns Return a promise that resolves to an object that describes the
       * successful addition of the procedure, or rejects on failure.
       */
      function add( endpoint, method ) {
        return $q(function( resolve, reject ) {
          var registration = {
            method: wrap(method),
            endpoint: endpoint,
            registration: undefined
          };
          wamp.session.register(registration.endpoint, registration.method)
            .then(function( wampRegistration ) {
              registration.registration = wampRegistration;
              var hash = hashFunction.hex(registration.endpoint);
              registrations[hash] = registration;
              resolve(new ResponseObject(
                "OK",
                hash,
                "Registered procedure at endpoint: " + endpoint));
            })
            .catch(function( error ) {
              bltApi.error("Error registering remote procedure!", error);
              reject(new ResponseObject("ERROR", undefined, error.message));
            });
        });
      }

      /**
       * @name Registrations#remove
       * @description
       * Remove a registration, named by its hash, from the registration
       * manager.
       *
       * @param hash The hash of the registration to remove.
       *
       * @returns Return a promise that resolves to an object that describes
       * the successful removal of the registration, or rejects on failure.
       */
      function remove( hash ) {
        return $q(function( resolve, reject ) {
          if ( registrations.hasOwnProperty(hash) ) {
            wamp.session.unregister(registrations[hash].registration)
              .then(function() {
                var endpoint = angular.copy(registrations[hash].endpoint);
                delete registrations[hash];
                resolve(new ResponseObject(
                  "OK",
                  undefined,
                  "Unregistered remote procedure at endpoint: " +
                  endpoint));
              })
              .catch(function( error ) {
                reject(new ResponseObject("ERROR", undefined, error.message));
              })
          } else {
            reject(new ResponseObject(
              "ERROR",
              undefined,
              "Registration does not exist."));
          }
        });
      }

      /**
       * @name Subscriptions#clear
       * @description
       * Clears the registration manager of all registrations.
       */
      function clear() {
        registrations = {};
      }
    }

    /**
     *   function
     * @name BltData#ResponseObject
     * @description
     * Generate an object that contains the response of a call.  Encapsulates
     * the call result status, data, and details.
     *
     * @param status The status of the call result.
     * @param data The data of the call result, if any.
     * @param details The details of the call result, if any.
     *
     * @returns {Object} Return an object that encapsulates the provided data.
     */
    function ResponseObject( status, data, details ) {
      return ({
        status: status,
        data: data,
        details: {
          message: details
        }
      });
    }

    /**
     * function
     * @name BltData#wrap
     * @description Wraps the given callback in an Angular $timeout, preserving any callback arguments.
     * @param callback The callback to wrap.
     * @returns {Function} The wrapped callback function.
     */
    function wrap(callback){
      return function(){
        var cbArgs = arguments;
        var cbCaller = this;
        $timeout(function(){
          callback.apply(cbCaller, cbArgs);
        }, 0);
      }
    }
  }

  BltData.$inject = ['$timeout', '$q', '$injector', 'BltApi', 'BltDataConfig'];
})();

(function(module) {
try {
  module = angular.module('blt_checkboxradio');
} catch (e) {
  module = angular.module('blt_checkboxradio', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('components/checkboxradio/checkboxradio.template.html',
    '\n' +
    '<div class="checkbox-radio">\n' +
    '    <!-- Checkbox or Radio Button -->\n' +
    '    <label>\n' +
    '        <!--TODO: Implement bolt directives to handle optional attributes-->\n' +
    '        <input name="{{$ctrl.name}}"\n' +
    '               type="{{$ctrl.type}}"\n' +
    '               class="checkbox-radio-input-hidden"\n' +
    '               ng-model="$ctrl.model"\n' +
    '               ng-change="$ctrl.onChange()"\n' +
    '               ng-keyup="$ctrl.toggle()"\n' +
    '               ng-disabled="$ctrl.disabled"\n' +
    '               value="{{$ctrl.value}}"\n' +
    '               blt-tabindex="{{$ctrl.tabindex}}"\n' +
    '               blt-required="{{$ctrl.required}}"\n' +
    '               blt-autofocus="{{$ctrl.autofocus}}"/>\n' +
    '\n' +
    '        <div class="checkbox-radio-input" ng-class="{\'disabled\': $ctrl.disabled}">\n' +
    '            <span class="checkbox-radio-icon fa"\n' +
    '                  ng-class="$ctrl.model ? \'fa-check-square\' : \'fa-square\'"\n' +
    '                  ng-if="$ctrl.type == \'checkbox\'">\n' +
    '            </span>\n' +
    '            <span class="checkbox-radio-icon fa"\n' +
    '                  ng-class="$ctrl.model == $ctrl.value ? \'fa-dot-circle-o\' : \'fa-circle\'"\n' +
    '                  ng-if="$ctrl.type == \'radio\'">\n' +
    '            </span>\n' +
    '\n' +
    '            <span class="checkbox-radio-label" ng-class="{\'disabled\': $ctrl.disabled}" ng-if="$ctrl.label">{{$ctrl.label}}</span>\n' +
    '        </div>\n' +
    '\n' +
    '        <!-- Form Field Error Messages -->\n' +
    '        <p class="checkbox-radio-error"\n' +
    '           ng-if="$ctrl.type == \'checkbox\'">\n' +
    '            <span class="checkbox-radio-error-hide checkbox-radio-error-required">This field is required.</span>\n' +
    '        </p>\n' +
    '    </label>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('blt_classificationbar');
} catch (e) {
  module = angular.module('blt_classificationbar', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('components/classificationbar/classificationbar.template.html',
    '<div class="classification-bar classification-bar-{{$ctrl.classification.cssClass}}">\n' +
    '    <p class="classification-bar-text">{{$ctrl.classification.display}}</p>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('blt_counter');
} catch (e) {
  module = angular.module('blt_counter', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('components/counter/counter.template.html',
    '<div class="counter" ng-class="{\'counter-labelled\': $ctrl.label}">\n' +
    '    <!-- Label -->\n' +
    '    <label class="counter-label" ng-if="$ctrl.label">{{$ctrl.label + $ctrl.asterisk}}</label>\n' +
    '\n' +
    '    <div class="counter-field">\n' +
    '        <!-- Input -->\n' +
    '        <input type="number"\n' +
    '               class="counter-input"\n' +
    '               id="{{$ctrl.id}}"\n' +
    '               name="{{$ctrl.name}}"\n' +
    '               ng-show="!$ctrl.NaN"\n' +
    '               ng-disabled="$ctrl.disabled"\n' +
    '               ng-change="$ctrl.onChange()"\n' +
    '               ng-focus="$ctrl.onFocus()"\n' +
    '               data-max="{{$ctrl.max}}"\n' +
    '               data-min="{{$ctrl.min}}"\n' +
    '               ng-class="{\'counter-disabled\': $ctrl.disabled}"\n' +
    '               ng-model="$ctrl.model"\n' +
    '               blt-autofocus="{{$ctrl.autofocus}}"\n' +
    '               blt-validate="$ctrl.validate"\n' +
    '               blt-required="{{$ctrl.required}}">\n' +
    '\n' +
    '        <!-- If NaN, just show a dash. -->\n' +
    '        <span class="counter-input counter-input-empty"\n' +
    '              ng-class="{\'counter-disabled\': $ctrl.disabled}"\n' +
    '              ng-show="$ctrl.NaN">-</span>\n' +
    '\n' +
    '        <!-- Left Arrow -->\n' +
    '        <span class="counter-btn fa {{$ctrl.leftIcon}} counter-left"\n' +
    '              ng-disabled="$ctrl.disabled || $ctrl.model <= $ctrl.min"\n' +
    '              ng-mousedown="$ctrl.mouseDown(-1, $event)"\n' +
    '              ng-mouseup="$ctrl.mouseUp(-1)"\n' +
    '              ng-mouseenter="$ctrl.mouseEnter($event)"\n' +
    '              ng-mouseleave="$ctrl.mouseLeave($event)">\n' +
    '      </span>\n' +
    '\n' +
    '        <!-- Right Arrow -->\n' +
    '        <span class="counter-btn fa {{$ctrl.rightIcon}} counter-right"\n' +
    '              ng-disabled="$ctrl.disabled || $ctrl.model >= $ctrl.max"\n' +
    '              ng-mousedown="$ctrl.mouseDown(1, $event)"\n' +
    '              ng-mouseup="$ctrl.mouseUp(1)"\n' +
    '              ng-mouseenter="$ctrl.mouseEnter($event)"\n' +
    '              ng-mouseleave="$ctrl.mouseLeave($event)">\n' +
    '      </span>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('blt_datepicker');
} catch (e) {
  module = angular.module('blt_datepicker', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('components/datepicker/datepicker.template.html',
    '\n' +
    '<div class="datepicker-field" ng-class="{\'is-empty\': !model}">\n' +
    '\n' +
    '    <!-- Input Field -->\n' +
    '    <label class="datepicker-label">{{label}}</label>\n' +
    '    <input type="text" class="datepicker-input-hidden" ng-model="model" ng-disabled="disabled" ng-click="activate($event)" ng-keypress="activate($event)"\n' +
    '           id="blt-datepicker-input">\n' +
    '    <span class="datepicker-toggle" ng-class="{\'disabled\': disabled}" ng-click="activate($event)">{{ (model|date:format) || label}}</span>\n' +
    '\n' +
    '    <!-- Overlay -->\n' +
    '    <div class="datepicker-overlay" ng-click="close()" ng-show="active" ng-keypress="test()"></div>\n' +
    '\n' +
    '    <!-- Picker -->\n' +
    '    <div id="picker" class="datepicker-container" ng-switch="current.view" ng-if="active">\n' +
    '        <!-- Year -->\n' +
    '        <div ng-switch-when="year" class="data-picker-content">\n' +
    '            <header class="datepicker-header">\n' +
    '                <button class="datepicker-btn-icon" ng-click="prev(15)"><span class="fa fa-chevron-left"></span>\n' +
    '                </button>\n' +
    '                <h2 class="datepicker-title"\n' +
    '                    ng-bind="years[0].getFullYear()+\' - \'+years[years.length-1].getFullYear()"></h2>\n' +
    '                <button class="datepicker-btn-icon" ng-click="next(15)"><span class="fa fa-chevron-right"></span>\n' +
    '                </button>\n' +
    '            </header>\n' +
    '            <div class="datepicker-table">\n' +
    '                <span class="datepicker-year"\n' +
    '                      ng-class="{\'is-active\':isSameYear(year), \'is-now\':isNow(year), \'is-disabled\':!canPickYear(year)}"\n' +
    '                      ng-repeat="year in years" ng-click="setDate(year)" ng-bind="year.getFullYear()"></span>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '\n' +
    '        <!-- Month -->\n' +
    '        <div ng-switch-when="month" class="datepicker-content">\n' +
    '            <header class="datepicker-header">\n' +
    '                <button class="datepicker-btn-icon" ng-click="prev()"><span class="fa fa-chevron-left"></span></button>\n' +
    '                <h2 class="datepicker-title-link" ng-bind="current.date|date:\'yyyy\'"\n' +
    '                    ng-click="current.view = \'year\'"></h2>\n' +
    '                <button class="datepicker-btn-icon" ng-click="next()"><span class="fa fa-chevron-right"></span>\n' +
    '                </button>\n' +
    '            </header>\n' +
    '            <div class="datepicker-table">\n' +
    '                <span class="datepicker-month" ng-repeat="month in months"\n' +
    '                      ng-class="{\'is-active\':isSameMonth(month), \'is-now\':isNow(month), \'is-disabled\':!canPickMonth(month)}"\n' +
    '                      ng-click="setDate(month)" ng-bind="month|date:\'MMM\'"></span>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '\n' +
    '        <!-- Date -->\n' +
    '        <div ng-switch-when="date" class="datepicker-content">\n' +
    '            <header class="datepicker-header">\n' +
    '                <button class="datepicker-btn-icon" ng-click="prev()"><span class="fa fa-chevron-left"></span></button>\n' +
    '                <h2 class="datepicker-title-link" ng-bind="current.date|date:\'yyyy MMMM\'"\n' +
    '                    ng-click="current.view = \'month\'"></h2>\n' +
    '                <button class="datepicker-btn-icon" ng-click="next()"><span class="fa fa-chevron-right"></span>\n' +
    '                </button>\n' +
    '            </header>\n' +
    '            <div class="datepicker-table vertical">\n' +
    '                <div class="datepicker-week" ng-repeat="week in weeks" ng-class="{\'six-weeks\': weeks.length == 6}">\n' +
    '                    <span class="datepicker-day" ng-repeat="day in week"\n' +
    '                          ng-class="{\'is-active\':isSameDay(day), \'is-now\':isNow(day), \'is-disabled\':(!canPickDay(day))}"\n' +
    '                          ng-click="setDate(day)" ng-bind="day.getDate()"></span>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '\n' +
    '        <!-- Hours -->\n' +
    '        <div ng-switch-when="hours">\n' +
    '            <header class="datepicker-header">\n' +
    '                <button class="datepicker-btn-icon" ng-click="prev(24)"><span class="fa fa-chevron-left"></span>\n' +
    '                </button>\n' +
    '                <h2 class="datepicker-title-link" ng-bind="current.date|date:\'dd MMMM yyyy\'"\n' +
    '                    ng-click="current.view = \'date\'"></h2>\n' +
    '                <button class="datepicker-btn-icon" ng-click="next(24)"><span class="fa fa-chevron-right"></span>\n' +
    '                </button>\n' +
    '            </header>\n' +
    '            <div class="datepicker-table">\n' +
    '                <span class="datepicker-hour" ng-repeat="hour in hours"\n' +
    '                      ng-class="{\'is-active\':isSameHour(hour), \'is-now\':isNow(hour), \'is-disabled\':!canPickHour(hour)}"\n' +
    '                      ng-click="setDate(hour)" ng-bind="hour|time"></span>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '\n' +
    '        <!-- Minutes -->\n' +
    '        <div ng-switch-when="minutes">\n' +
    '            <header class="datepicker-header">\n' +
    '                <button class="datepicker-btn-icon" ng-click="prev()"><span class="fa fa-chevron-left"></span></button>\n' +
    '                <h2 class="datepicker-title-link" ng-bind="current.date|date:\'dd MMMM yyyy\'"\n' +
    '                    ng-click="current.view = \'hours\'"></h2>\n' +
    '                <button class="datepicker-btn-icon" ng-click="next()"><span class="fa fa-chevron-right"></span>\n' +
    '                </button>\n' +
    '            </header>\n' +
    '            <div class="datepicker-table">\n' +
    '                <span class="datepicker-minute" ng-repeat="minute in minutes"\n' +
    '                      ng-class="{\'is-active\':isSameMinutes(minute), \'is-now\':isNow(minute), \'is-disabled\':!canPickMinute(minute)}"\n' +
    '                      ng-click="setDate(minute)" ng-bind="minute|time"></span>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('blt_fileloader');
} catch (e) {
  module = angular.module('blt_fileloader', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('components/fileloader/fileloader.template.html',
    '\n' +
    '<div class="fileloader" ng-class="{\'fileloader-empty\': !File.data, \'disabled\': File.disabled}">\n' +
    '\n' +
    '    <!-- Label -->\n' +
    '    <span class="fileloader-label">{{File.label || "Filename"}}{{File.required ? "*" : ""}}</span>\n' +
    '\n' +
    '    <!-- Input -->\n' +
    '    <label>\n' +
    '        <input type="file"\n' +
    '               ng-model="File.data" blt-filemodel\n' +
    '               ng-disabled="File.disabled"\n' +
    '               blt-autofocus="{{File.autofocus}}"\n' +
    '               blt-tabindex="{{File.tabindex}}">\n' +
    '\n' +
    '        <div class="fileloader-input" ng-class="{\'disabled\': File.disabled}">\n' +
    '            <span class="placeholder">{{File.label || "Select File"}}{{File.required ? "*" : ""}}</span>\n' +
    '            <span class="filename"\n' +
    '                  title="{{ File.data.name }}">\n' +
    '                  {{ File.data.name | characters:File.charsLimit:true || \'No File Selected.\' }}{{ File.fileExt }}\n' +
    '            </span>\n' +
    '        </div>\n' +
    '\n' +
    '        <span class="fileloader-icon fa fa-upload"></span>\n' +
    '\n' +
    '        <!-- Error Messages -->\n' +
    '        <p class="fileloader-error">\n' +
    '      <span class="fileloader-error-hide fileloader-error-required">\n' +
    '        This field is required.\n' +
    '      </span>\n' +
    '        </p>\n' +
    '    </label>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('blt_login');
} catch (e) {
  module = angular.module('blt_login', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('components/login/login.template.html',
    '<div ng-class="{\'login-hide\':$ctrl.shown==false}">\n' +
    '    <div class="login-container" ng-if="$ctrl.shown">\n' +
    '        <div class="login-content">\n' +
    '\n' +
    '            <!-- App Icon/Logo -->\n' +
    '            <div class="login-logo">\n' +
    '                <img ng-src="@@logo">\n' +
    '            </div>\n' +
    '\n' +
    '            <!-- Login Form -->\n' +
    '            <form class="login-form" name="login" novalidate ng-submit="$ctrl.submitLogin()">\n' +
    '\n' +
    '                <div class="text-center login-reload-warning" ng-if="!$ctrl.pristine">\n' +
    '                    <p>Page reload required. This should occur automatically.<br>Click <a href=""\n' +
    '                                                                                          ng-click="$ctrl.reload()">here</a>\n' +
    '                        to force a page reload.</p>\n' +
    '                </div>\n' +
    '\n' +
    '                <div class="login-field" ng-class="{\'login-field-empty\': !$ctrl.login.username}">\n' +
    '                    <label class="login-label">Username*</label>\n' +
    '                    <input type="text"\n' +
    '                           autocapitalize="none"\n' +
    '                           class="login-input"\n' +
    '                           ng-disabled="!$ctrl.pristine"\n' +
    '                           ng-model="$ctrl.login.username"\n' +
    '                           placeholder="Username" required>\n' +
    '                    <p class="login-error">\n' +
    '                        <span class="login-error-hide login-error-required">Username is required.</span>\n' +
    '                    </p>\n' +
    '                </div>\n' +
    '                <hr class="login-form-divider">\n' +
    '                <div class="login-field" ng-class="{\'login-field-empty\': !$ctrl.login.password}">\n' +
    '                    <label class="login-label">Password*</label>\n' +
    '                    <input type="password"\n' +
    '                           class="login-input"\n' +
    '                           ng-disabled="!$ctrl.pristine"\n' +
    '                           ng-model="$ctrl.login.password"\n' +
    '                           placeholder="Password" required>\n' +
    '                    <p class="login-error">\n' +
    '                        <span class="login-error-hide login-error-required">A password is required.</span>\n' +
    '                    </p>\n' +
    '                </div>\n' +
    '                <button ng-disabled="!$ctrl.available || !$ctrl.pristine" type="submit" class="login-submit">Login\n' +
    '                </button>\n' +
    '\n' +
    '                <div class="login-message-container" ng-show="$ctrl.pristine && !$ctrl.available && !$ctrl.error.show">\n' +
    '                    <p class="login-message">Connecting <span class="fa fa-spin fa-spinner"></span></p>\n' +
    '                </div>\n' +
    '                <div class="login-message-container" ng-show="$ctrl.error.show">\n' +
    '                    <p class="login-form-error">{{$ctrl.error.message}}</p>\n' +
    '                </div>\n' +
    '            </form>\n' +
    '            <!-- App name and version -->\n' +
    '            <p class="login-caption">@@title @@version</p>\n' +
    '\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('blt_modal');
} catch (e) {
  module = angular.module('blt_modal', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('components/modal/modal.template.html',
    '<div class="modal-overlay blt-animate" ng-class="classes" ng-show="active">\n' +
    '    <div class="modal" ng-if="active" ng-class="{\'modal-flipping\': flipping, \'modal-flipped\': flipped}"\n' +
    '         ng-transclude></div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('blt_notifications');
} catch (e) {
  module = angular.module('blt_notifications', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('components/notifications/notifications.template.html',
    '<div class="notification-container">\n' +
    '    <div class="notification blt-animate" ng-repeat="notification in $ctrl.notifications" ng-if="notification.show">\n' +
    '        <div class="notification-content">\n' +
    '            <p class="notification-message">{{notification.text}}</p>\n' +
    '        </div>\n' +
    '        <div class="notification-actions">\n' +
    '            <button class="notification-btn" ng-if="notification.callback" ng-click="$ctrl.resolve(notification.id)">\n' +
    '                {{notification.callback.text}}\n' +
    '            </button>\n' +
    '            <button class="notification-btn-submit" ng-click="$ctrl.dismiss(notification.id)">ok</button>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('blt_panel');
} catch (e) {
  module = angular.module('blt_panel', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('components/panel/panel.template.html',
    '<div class="panel-overlay" ng-class="positionClass">\n' +
    '    <div class="panel blt-animate" ng-if="active">\n' +
    '        <div class="panel-container" ng-transclude></div>\n' +
    '        <p class="panel-pending-msg blt-animate" ng-show="pending">{{pendingMessage}}</p>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('blt_dropdown');
} catch (e) {
  module = angular.module('blt_dropdown', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('components/dropdown/dropdown.template.html',
    '\n' +
    '<div ng-class="{\'dropdown-closed\': $ctrl.open == false}">\n' +
    '    <div class="dropdown-container">\n' +
    '        <!-- Floating Dropdown -->\n' +
    '        <div class="dropdown dropdown-dropdown" ng-if="$ctrl.type == \'dropdown\'">\n' +
    '            <button name="{{$ctrl.name}}"\n' +
    '                    class="dropdown-toggle"\n' +
    '                    ng-click="$ctrl.openOptions()"\n' +
    '                    blt-autofocus="{{$ctrl.autofocus}}"\n' +
    '                    blt-tabindex="{{$ctrl.tabindex}}"\n' +
    '                    ng-disabled="$ctrl.disabled">{{$ctrl.select.model ? $ctrl.getLabelForValue($ctrl.select.model) :\n' +
    '                $ctrl.label}}\n' +
    '                <span class="dropdown-icon fa fa-caret-down"></span>\n' +
    '            </button>\n' +
    '            <ul class="dropdown-options-floating">\n' +
    '                <li ng-repeat="option in $ctrl.filteredOptions track by $index">\n' +
    '                    <a class="dropdown-option"\n' +
    '                       id="{{option.key}}"\n' +
    '                       ng-class="{\'dropdown-active\': $ctrl.select.model == option.value}"\n' +
    '                       ng-click="$ctrl.selectOption(option)">{{option.label}}\n' +
    '                    </a>\n' +
    '                </li>\n' +
    '            </ul>\n' +
    '        </div>\n' +
    '\n' +
    '        <!-- Select and Searchable Dropdown -->\n' +
    '        <div class="dropdown dropdown-searchable dropdown-select" ng-if="$ctrl.type == \'select\' || $ctrl.type == \'searchable\'">\n' +
    '            <div class="dropdown-field" ng-class="{\'dropdown-empty\': (!$ctrl.select.model && !$ctrl.search.model)}">\n' +
    '\n' +
    '                <label class="dropdown-label">{{$ctrl.required ? $ctrl.label + \'*\' : $ctrl.label}}</label>\n' +
    '\n' +
    '                <!-- Default Select Form Control -->\n' +
    '                <select name="{{$ctrl.name}}"\n' +
    '                        class="dropdown-input"\n' +
    '                        ng-if="$ctrl.type == \'select\'"\n' +
    '                        ng-model="$ctrl.select.model"\n' +
    '                        ng-change="$ctrl.onSelectChange()"\n' +
    '                        blt-autofocus="{{$ctrl.autofocus}}"\n' +
    '                        blt-tabindex="{{$ctrl.tabindex}}"\n' +
    '                        ng-disabled="$ctrl.disabled">\n' +
    '                    <option ng-if="!$ctrl.required" value="">{{$ctrl.label}}</option>\n' +
    '                    <option value="{{key}}" ng-repeat="(key, value) in $ctrl.keyedOptionMap">{{value.label}}</option>\n' +
    '                </select>\n' +
    '\n' +
    '                <!-- Searchable Dropdown -->\n' +
    '                <input name="{{$ctrl.name}}"\n' +
    '                       class="dropdown-input"\n' +
    '                       type="text"\n' +
    '                       placeholder="{{$ctrl.searchablePlaceholder()}}"\n' +
    '                       autocomplete="off"\n' +
    '                       ng-if="$ctrl.type == \'searchable\'"\n' +
    '                       ng-model="$ctrl.search.model"\n' +
    '                       ng-click="$ctrl.openOptions()"\n' +
    '                       ng-keydown="$ctrl.onKeyDown($event)"\n' +
    '                       blt-autofocus="{{$ctrl.autofocus}}"\n' +
    '                       blt-tabindex="{{$ctrl.tabindex}}"\n' +
    '                       ng-disabled="$ctrl.disabled"/>\n' +
    '\n' +
    '                <span class="dropdown-icon fa fa-caret-down"></span>\n' +
    '\n' +
    '                <!-- Error Messages -->\n' +
    '                <p class="dropdown-error">\n' +
    '                    <span class="dropdown-error-hide dropdown-error-required">A selection is required.</span>\n' +
    '                </p>\n' +
    '\n' +
    '            </div>\n' +
    '\n' +
    '            <!-- searchable <select> control options -->\n' +
    '            <ul class="dropdown-options" ng-if="$ctrl.type == \'searchable\'">\n' +
    '\n' +
    '                <li ng-show="!$ctrl.required">\n' +
    '                    <a class="dropdown-option"\n' +
    '                       ng-class="{\'is-active\': !$ctrl.currentSelection}"\n' +
    '                       ng-mousedown="$ctrl.untouched()"\n' +
    '                       ng-mouseup="$ctrl.selectOption(undefined)">{{$ctrl.selectNoneLabel}}\n' +
    '                    </a>\n' +
    '                </li>\n' +
    '\n' +
    '                <li ng-repeat="option in $ctrl.filteredOptions track by $index">\n' +
    '                    <a class="dropdown-option"\n' +
    '                       id="{{option.key}}"\n' +
    '                       ng-class="{\'dropdown-active\': $ctrl.isSelected(option)}"\n' +
    '                       ng-mousedown="$ctrl.untouched()"\n' +
    '                       ng-mouseup="$ctrl.selectOption(option)">{{option.label}}\n' +
    '                    </a>\n' +
    '                </li>\n' +
    '            </ul>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('blt_textfield');
} catch (e) {
  module = angular.module('blt_textfield', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('components/textfield/textfield.template.html',
    '<div class="text-field" ng-class="{\'text-field-empty\': !$ctrl.form[$ctrl.name].$viewValue}" ng-disabled="$ctrl.disabled">\n' +
    '\n' +
    '    <!-- Form Field Label -->\n' +
    '    <label class="text-field-label">{{$ctrl.label + $ctrl.asterisk}}</label>\n' +
    '\n' +
    '    <!-- Text area -->\n' +
    '    <textarea class="text-field-input"\n' +
    '              name="{{$ctrl.name}}"\n' +
    '              ng-if="$ctrl.type == \'textarea\'"\n' +
    '              rows="{{$ctrl.rows}}"\n' +
    '              ng-change="$ctrl.onChange()"\n' +
    '              ng-model="$ctrl.model"\n' +
    '              ng-disabled="$ctrl.disabled"\n' +
    '              placeholder="{{$ctrl.label + $ctrl.asterisk}}"\n' +
    '              blt-validate="$ctrl.validate"\n' +
    '              blt-autocomplete="{{$ctrl.autocomplete}}"\n' +
    '              blt-autocorrect="{{$ctrl.autocorrect}}"\n' +
    '              blt-spellcheck="{{$ctrl.spellcheck}}"\n' +
    '              blt-autofocus="{{$ctrl.autofocus}}">\n' +
    '  </textarea>\n' +
    '\n' +
    '    <!-- Default Inputs -->\n' +
    '    <input class="text-field-input"\n' +
    '           name="{{$ctrl.name}}"\n' +
    '           ng-if="$ctrl.type != \'textarea\'"\n' +
    '           type="{{$ctrl.type}}"\n' +
    '           ng-change="$ctrl.onChange()"\n' +
    '           ng-model="$ctrl.model"\n' +
    '           ng-disabled="$ctrl.disabled"\n' +
    '           blt-validate="$ctrl.validate"\n' +
    '           blt-step="{{$ctrl.step}}"\n' +
    '           blt-pattern="{{$ctrl.pattern}}"\n' +
    '           min="{{ $ctrl.min }}"\n' +
    '           max="{{ $ctrl.max }}"\n' +
    '           blt-required="{{$ctrl.required}}"\n' +
    '           placeholder="{{$ctrl.label + $ctrl.asterisk}}"\n' +
    '           blt-autofocus="{{$ctrl.autofocus}}"\n' +
    '           blt-minlength="{{$ctrl.minlength}}"\n' +
    '           blt-maxlength="{{$ctrl.maxlength}}"\n' +
    '           blt-autocomplete="{{$ctrl.autocomplete}}"\n' +
    '           blt-autocorrect="{{$ctrl.autocorrect}}"\n' +
    '           blt-spellcheck="{{$ctrl.spellcheck}}">\n' +
    '\n' +
    '    <!-- Form Field Error Messages -->\n' +
    '    <p class="text-field-error">\n' +
    '        <span class="text-field-error-hide text-field-error-required">This field is required.</span>\n' +
    '        <span class="text-field-error-hide text-field-error-email">Not a valid email address.</span>\n' +
    '        <span class="text-field-error-hide text-field-error-url">Not a valid url.</span>\n' +
    '        <span class="text-field-error-hide text-field-error-minlength">Cannot be less than {{$ctrl.minlength}} characters.</span>\n' +
    '        <span class="text-field-error-hide text-field-error-maxlength">Cannot be more than {{$ctrl.maxlength}} characters.</span>\n' +
    '        <span class="text-field-error-hide text-field-error-min">Cannot be less than {{$ctrl.min}}.</span>\n' +
    '        <span class="text-field-error-hide text-field-error-max">Cannot be more than {{$ctrl.max}}.</span>\n' +
    '        <span class="text-field-error-hide text-field-error-pattern">{{$ctrl.form[$ctrl.name].$viewValue}} is not valid.</span>\n' +
    '        <span ng-show="$ctrl.form[$ctrl.name].$viewValue && $ctrl.form[$ctrl.name].$error[$ctrl.validate.name]">{{$ctrl.errorMsg}}</span>\n' +
    '    </p>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('blt_toggleswitch');
} catch (e) {
  module = angular.module('blt_toggleswitch', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('components/toggleswitch/toggleswitch.template.html',
    '<label class="toggle-switch-label"\n' +
    '       ng-if="label">\n' +
    '    {{label}}\n' +
    '</label>\n' +
    '<div class="toggle-switch-bg"\n' +
    '     ng-class="{\'toggle-switch-on\': model, \'toggle-switch-disabled\': disabled}"\n' +
    '     ng-click="toggle()">\n' +
    '    <span class="toggle-switch-knob"></span>\n' +
    '</div>');
}]);
})();

/**
 * Angular Truncate 2 - Ellipsis for your templates
 * @version v0.4.1 - 2015-11-01
 * @link https://github.com/BernardoSilva/angular-truncate-2
 * @author Bernardo Silva
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
angular.module("truncate",[]).filter("characters",function(){return function(a,b,c){if(isNaN(b))return a;if(0>=b)return"";if(a&&a.length>b){if(a=a.substring(0,b),c)for(;" "===a.charAt(a.length-1);)a=a.substr(0,a.length-1);else{var d=a.lastIndexOf(" ");-1!==d&&(a=a.substr(0,d))}return a+"…"}return a}}).filter("splitcharacters",function(){return function(a,b){if(isNaN(b))return a;if(0>=b)return"";if(a&&a.length>b){var c=a.substring(0,b/2),d=a.substring(a.length-b/2,a.length);return c+"..."+d}return a}}).filter("words",function(){return function(a,b,c){if(isNaN(b))return a;if(0>=b)return"";if("undefined"==typeof c&&(c="…"),a){var d=a.split(/\s+/);d.length>b&&(a=d.slice(0,b).join(" ")+c)}return a}});
;(function () {
	'use strict';

	/**
	 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	 *
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */

	/*jslint browser:true, node:true*/
	/*global define, Event, Node*/


	/**
	 * Instantiate fast-clicking listeners on the specified layer.
	 *
	 * @constructor
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	function FastClick(layer, options) {
		var oldOnClick;

		options = options || {};

		/**
		 * Whether a click is currently being tracked.
		 *
		 * @type boolean
		 */
		this.trackingClick = false;


		/**
		 * Timestamp for when click tracking started.
		 *
		 * @type number
		 */
		this.trackingClickStart = 0;


		/**
		 * The element being tracked for a click.
		 *
		 * @type EventTarget
		 */
		this.targetElement = null;


		/**
		 * X-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartX = 0;


		/**
		 * Y-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartY = 0;


		/**
		 * ID of the last touch, retrieved from Touch.identifier.
		 *
		 * @type number
		 */
		this.lastTouchIdentifier = 0;


		/**
		 * Touchmove boundary, beyond which a click will be cancelled.
		 *
		 * @type number
		 */
		this.touchBoundary = options.touchBoundary || 10;


		/**
		 * The FastClick layer.
		 *
		 * @type Element
		 */
		this.layer = layer;

		/**
		 * The minimum time between tap(touchstart and touchend) events
		 *
		 * @type number
		 */
		this.tapDelay = options.tapDelay || 200;

		/**
		 * The maximum time for a tap
		 *
		 * @type number
		 */
		this.tapTimeout = options.tapTimeout || 700;

		if (FastClick.notNeeded(layer)) {
			return;
		}

		// Some old versions of Android don't have Function.prototype.bind
		function bind(method, context) {
			return function() { return method.apply(context, arguments); };
		}


		var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
		var context = this;
		for (var i = 0, l = methods.length; i < l; i++) {
			context[methods[i]] = bind(context[methods[i]], context);
		}

		// Set up event handlers as required
		if (deviceIsAndroid) {
			layer.addEventListener('mouseover', this.onMouse, true);
			layer.addEventListener('mousedown', this.onMouse, true);
			layer.addEventListener('mouseup', this.onMouse, true);
		}

		layer.addEventListener('click', this.onClick, true);
		layer.addEventListener('touchstart', this.onTouchStart, false);
		layer.addEventListener('touchmove', this.onTouchMove, false);
		layer.addEventListener('touchend', this.onTouchEnd, false);
		layer.addEventListener('touchcancel', this.onTouchCancel, false);

		// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
		// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
		// layer when they are cancelled.
		if (!Event.prototype.stopImmediatePropagation) {
			layer.removeEventListener = function(type, callback, capture) {
				var rmv = Node.prototype.removeEventListener;
				if (type === 'click') {
					rmv.call(layer, type, callback.hijacked || callback, capture);
				} else {
					rmv.call(layer, type, callback, capture);
				}
			};

			layer.addEventListener = function(type, callback, capture) {
				var adv = Node.prototype.addEventListener;
				if (type === 'click') {
					adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
						if (!event.propagationStopped) {
							callback(event);
						}
					}), capture);
				} else {
					adv.call(layer, type, callback, capture);
				}
			};
		}

		// If a handler is already declared in the element's onclick attribute, it will be fired before
		// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
		// adding it as listener.
		if (typeof layer.onclick === 'function') {

			// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
			// - the old one won't work if passed to addEventListener directly.
			oldOnClick = layer.onclick;
			layer.addEventListener('click', function(event) {
				oldOnClick(event);
			}, false);
			layer.onclick = null;
		}
	}

	/**
	* Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
	*
	* @type boolean
	*/
	var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

	/**
	 * Android requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


	/**
	 * iOS requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


	/**
	 * iOS 4 requires an exception for select elements.
	 *
	 * @type boolean
	 */
	var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


	/**
	 * iOS 6.0-7.* requires the target element to be manually derived
	 *
	 * @type boolean
	 */
	var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

	/**
	 * BlackBerry requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

	/**
	 * Determine whether a given element requires a native click.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element needs a native click
	 */
	FastClick.prototype.needsClick = function(target) {
		switch (target.nodeName.toLowerCase()) {

		// Don't send a synthetic click to disabled inputs (issue #62)
		case 'button':
		case 'select':
		case 'textarea':
			if (target.disabled) {
				return true;
			}

			break;
		case 'input':

			// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
			if ((deviceIsIOS && target.type === 'file') || target.disabled) {
				return true;
			}

			break;
		case 'label':
		case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
		case 'video':
			return true;
		}

		return (/\bneedsclick\b/).test(target.className);
	};


	/**
	 * Determine whether a given element requires a call to focus to simulate click into element.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
	 */
	FastClick.prototype.needsFocus = function(target) {
		switch (target.nodeName.toLowerCase()) {
		case 'textarea':
			return true;
		case 'select':
			return !deviceIsAndroid;
		case 'input':
			switch (target.type) {
			case 'button':
			case 'checkbox':
			case 'file':
			case 'image':
			case 'radio':
			case 'submit':
				return false;
			}

			// No point in attempting to focus disabled inputs
			return !target.disabled && !target.readOnly;
		default:
			return (/\bneedsfocus\b/).test(target.className);
		}
	};


	/**
	 * Send a click event to the specified element.
	 *
	 * @param {EventTarget|Element} targetElement
	 * @param {Event} event
	 */
	FastClick.prototype.sendClick = function(targetElement, event) {
		var clickEvent, touch;

		// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
		if (document.activeElement && document.activeElement !== targetElement) {
			document.activeElement.blur();
		}

		touch = event.changedTouches[0];

		// Synthesise a click event, with an extra attribute so it can be tracked
		clickEvent = document.createEvent('MouseEvents');
		clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
		clickEvent.forwardedTouchEvent = true;
		targetElement.dispatchEvent(clickEvent);
	};

	FastClick.prototype.determineEventType = function(targetElement) {

		//Issue #159: Android Chrome Select Box does not open with a synthetic click event
		if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
			return 'mousedown';
		}

		return 'click';
	};


	/**
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.focus = function(targetElement) {
		var length;

		// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
		if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
			length = targetElement.value.length;
			targetElement.setSelectionRange(length, length);
		} else {
			targetElement.focus();
		}
	};


	/**
	 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
	 *
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.updateScrollParent = function(targetElement) {
		var scrollParent, parentElement;

		scrollParent = targetElement.fastClickScrollParent;

		// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
		// target element was moved to another parent.
		if (!scrollParent || !scrollParent.contains(targetElement)) {
			parentElement = targetElement;
			do {
				if (parentElement.scrollHeight > parentElement.offsetHeight) {
					scrollParent = parentElement;
					targetElement.fastClickScrollParent = parentElement;
					break;
				}

				parentElement = parentElement.parentElement;
			} while (parentElement);
		}

		// Always update the scroll top tracker if possible.
		if (scrollParent) {
			scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
		}
	};


	/**
	 * @param {EventTarget} targetElement
	 * @returns {Element|EventTarget}
	 */
	FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {

		// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
		if (eventTarget.nodeType === Node.TEXT_NODE) {
			return eventTarget.parentNode;
		}

		return eventTarget;
	};


	/**
	 * On touch start, record the position and scroll offset.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchStart = function(event) {
		var targetElement, touch, selection;

		// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
		if (event.targetTouches.length > 1) {
			return true;
		}

		targetElement = this.getTargetElementFromEventTarget(event.target);
		touch = event.targetTouches[0];

		if (deviceIsIOS) {

			// Only trusted events will deselect text on iOS (issue #49)
			selection = window.getSelection();
			if (selection.rangeCount && !selection.isCollapsed) {
				return true;
			}

			if (!deviceIsIOS4) {

				// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
				// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
				// with the same identifier as the touch event that previously triggered the click that triggered the alert.
				// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
				// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
				// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
				// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
				// random integers, it's safe to to continue if the identifier is 0 here.
				if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
					event.preventDefault();
					return false;
				}

				this.lastTouchIdentifier = touch.identifier;

				// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
				// 1) the user does a fling scroll on the scrollable layer
				// 2) the user stops the fling scroll with another tap
				// then the event.target of the last 'touchend' event will be the element that was under the user's finger
				// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
				// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
				this.updateScrollParent(targetElement);
			}
		}

		this.trackingClick = true;
		this.trackingClickStart = event.timeStamp;
		this.targetElement = targetElement;

		this.touchStartX = touch.pageX;
		this.touchStartY = touch.pageY;

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			event.preventDefault();
		}

		return true;
	};


	/**
	 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.touchHasMoved = function(event) {
		var touch = event.changedTouches[0], boundary = this.touchBoundary;

		if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
			return true;
		}

		return false;
	};


	/**
	 * Update the last position.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchMove = function(event) {
		if (!this.trackingClick) {
			return true;
		}

		// If the touch has moved, cancel the click tracking
		if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
			this.trackingClick = false;
			this.targetElement = null;
		}

		return true;
	};


	/**
	 * Attempt to find the labelled control for the given label element.
	 *
	 * @param {EventTarget|HTMLLabelElement} labelElement
	 * @returns {Element|null}
	 */
	FastClick.prototype.findControl = function(labelElement) {

		// Fast path for newer browsers supporting the HTML5 control attribute
		if (labelElement.control !== undefined) {
			return labelElement.control;
		}

		// All browsers under test that support touch events also support the HTML5 htmlFor attribute
		if (labelElement.htmlFor) {
			return document.getElementById(labelElement.htmlFor);
		}

		// If no for attribute exists, attempt to retrieve the first labellable descendant element
		// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
		return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
	};


	/**
	 * On touch end, determine whether to send a click event at once.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchEnd = function(event) {
		var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

		if (!this.trackingClick) {
			return true;
		}

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			this.cancelNextClick = true;
			return true;
		}

		if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
			return true;
		}

		// Reset to prevent wrong click cancel on input (issue #156).
		this.cancelNextClick = false;

		this.lastClickTime = event.timeStamp;

		trackingClickStart = this.trackingClickStart;
		this.trackingClick = false;
		this.trackingClickStart = 0;

		// On some iOS devices, the targetElement supplied with the event is invalid if the layer
		// is performing a transition or scroll, and has to be re-detected manually. Note that
		// for this to function correctly, it must be called *after* the event target is checked!
		// See issue #57; also filed as rdar://13048589 .
		if (deviceIsIOSWithBadTarget) {
			touch = event.changedTouches[0];

			// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
			targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
			targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
		}

		targetTagName = targetElement.tagName.toLowerCase();
		if (targetTagName === 'label') {
			forElement = this.findControl(targetElement);
			if (forElement) {
				this.focus(targetElement);
				if (deviceIsAndroid) {
					return false;
				}

				targetElement = forElement;
			}
		} else if (this.needsFocus(targetElement)) {

			// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
			// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
			if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
				this.targetElement = null;
				return false;
			}

			this.focus(targetElement);
			this.sendClick(targetElement, event);

			// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
			// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
			if (!deviceIsIOS || targetTagName !== 'select') {
				this.targetElement = null;
				event.preventDefault();
			}

			return false;
		}

		if (deviceIsIOS && !deviceIsIOS4) {

			// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
			// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
			scrollParent = targetElement.fastClickScrollParent;
			if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
				return true;
			}
		}

		// Prevent the actual click from going though - unless the target node is marked as requiring
		// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
		if (!this.needsClick(targetElement)) {
			event.preventDefault();
			this.sendClick(targetElement, event);
		}

		return false;
	};


	/**
	 * On touch cancel, stop tracking the click.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.onTouchCancel = function() {
		this.trackingClick = false;
		this.targetElement = null;
	};


	/**
	 * Determine mouse events which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onMouse = function(event) {

		// If a target element was never set (because a touch event was never fired) allow the event
		if (!this.targetElement) {
			return true;
		}

		if (event.forwardedTouchEvent) {
			return true;
		}

		// Programmatically generated events targeting a specific element should be permitted
		if (!event.cancelable) {
			return true;
		}

		// Derive and check the target element to see whether the mouse event needs to be permitted;
		// unless explicitly enabled, prevent non-touch click events from triggering actions,
		// to prevent ghost/doubleclicks.
		if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

			// Prevent any user-added listeners declared on FastClick element from being fired.
			if (event.stopImmediatePropagation) {
				event.stopImmediatePropagation();
			} else {

				// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
				event.propagationStopped = true;
			}

			// Cancel the event
			event.stopPropagation();
			event.preventDefault();

			return false;
		}

		// If the mouse event is permitted, return true for the action to go through.
		return true;
	};


	/**
	 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
	 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
	 * an actual click which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onClick = function(event) {
		var permitted;

		// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
		if (this.trackingClick) {
			this.targetElement = null;
			this.trackingClick = false;
			return true;
		}

		// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
		if (event.target.type === 'submit' && event.detail === 0) {
			return true;
		}

		permitted = this.onMouse(event);

		// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
		if (!permitted) {
			this.targetElement = null;
		}

		// If clicks are permitted, return true for the action to go through.
		return permitted;
	};


	/**
	 * Remove all FastClick's event listeners.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.destroy = function() {
		var layer = this.layer;

		if (deviceIsAndroid) {
			layer.removeEventListener('mouseover', this.onMouse, true);
			layer.removeEventListener('mousedown', this.onMouse, true);
			layer.removeEventListener('mouseup', this.onMouse, true);
		}

		layer.removeEventListener('click', this.onClick, true);
		layer.removeEventListener('touchstart', this.onTouchStart, false);
		layer.removeEventListener('touchmove', this.onTouchMove, false);
		layer.removeEventListener('touchend', this.onTouchEnd, false);
		layer.removeEventListener('touchcancel', this.onTouchCancel, false);
	};


	/**
	 * Check whether FastClick is needed.
	 *
	 * @param {Element} layer The layer to listen on
	 */
	FastClick.notNeeded = function(layer) {
		var metaViewport;
		var chromeVersion;
		var blackberryVersion;
		var firefoxVersion;

		// Devices that don't support touch don't need FastClick
		if (typeof window.ontouchstart === 'undefined') {
			return true;
		}

		// Chrome version - zero for other browsers
		chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (chromeVersion) {

			if (deviceIsAndroid) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// Chrome 32 and above with width=device-width or less don't need FastClick
					if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}

			// Chrome desktop doesn't need FastClick (issue #15)
			} else {
				return true;
			}
		}

		if (deviceIsBlackBerry10) {
			blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

			// BlackBerry 10.3+ does not require Fastclick library.
			// https://github.com/ftlabs/fastclick/issues/251
			if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// user-scalable=no eliminates click delay.
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// width=device-width (or less than device-width) eliminates click delay.
					if (document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}
			}
		}

		// IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
		if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		// Firefox version - zero for other browsers
		firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (firefoxVersion >= 27) {
			// Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

			metaViewport = document.querySelector('meta[name=viewport]');
			if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
				return true;
			}
		}

		// IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
		// http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
		if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		return false;
	};


	/**
	 * Factory method for creating a FastClick object
	 *
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	FastClick.attach = function(layer, options) {
		return new FastClick(layer, options);
	};


	if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

		// AMD. Register as an anonymous module.
		define(function() {
			return FastClick;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = FastClick.attach;
		module.exports.FastClick = FastClick;
	} else {
		window.FastClick = FastClick;
	}
}());

(function () {
  'use strict';

  /**
   * @name bltDocs
   * 
   * @description
   * This is the root module of the ngBoltJS project website featuring a project overview,
   * guides, and documentation.
   * 
   * @requires ngRoute
   */
  angular.module('bltDocs', [
    'ngRoute',
    'main',
    'home',
    'guides',
    'api',
    'ngBolt'
  ])
    .config(config)
    .run(run);

  function config($locationProvider, $routeProvider, API_DATA, GUIDES_DATA, HOME_DATA, APP_API_DATA) {

    // Set HTML5 Mode
    $locationProvider.html5Mode(true);

    // Documentation index page, doesn't get automatically generated by dgeni'
    // TODO: programattically add api index page
    $routeProvider.when('/api', {
      controller: 'ApiController',
      controllerAs: 'ctrl',
      templateUrl: 'partials/api.html'
    });

    // Looping through all of our DOCS pages
    // and dynamically creating new routes based
    // on the data generated by Dgeni
    angular.forEach(API_DATA, function (parent) {
      $routeProvider.when(parent.path, {
        controller: 'ApiController',
        controllerAs: 'ctrl',
        templateUrl: parent.template
      });

      // In the case of API, we have multiple modules and each
      // of them have children, so we are doing the same thing
      // here but for the child states
      angular.forEach(parent.docs, function (doc) {
        $routeProvider.when(doc.path, {
          controller: 'ApiController',
          controllerAs: 'ctrl',
          templateUrl: doc.template
        });
      });
    });

    // Add App api data if there is any
    if (APP_API_DATA.length > 0) {

      $routeProvider.when('/app', {
        controller: 'AppApiController',
        controllerAs: 'ctrl',
        templateUrl: 'partials/app.html'
      });

      // Looping through all of our DOCS pages
      // and dynamically creating new routes based
      // on the data generated by Dgeni
      angular.forEach(APP_API_DATA, function (parent) {
        $routeProvider.when(parent.path, {
          controller: 'AppApiController',
          controllerAs: 'ctrl',
          templateUrl: parent.template
        });

        // In the case of API, we have multiple modules and each
        // of them have children, so we are doing the same thing
        // here but for the child states
        angular.forEach(parent.docs, function (doc) {
          $routeProvider.when(doc.path, {
            controller: 'AppApiController',
            controllerAs: 'ctrl',
            templateUrl: doc.template
          });
        });
      });
    }

    // Loop through all Guide data to set up routes. Guides 
    // should be a flat list of files, so no need to loop twice.
    angular.forEach(GUIDES_DATA, function (parent) {
      $routeProvider.when('/' + parent.path, {
        controller: 'GuidesController',
        controllerAs: 'ctrl',
        templateUrl: parent.template
      });
    });

    // Loop through all Home pages to set up routes. Home pages
    // should be a flat list of files, so no need to loop twice.
    angular.forEach(HOME_DATA, function(page) {
      $routeProvider.when('/' + page.path, {
        controller: 'HomeController',
        templateUrl: page.template
      })
    })

    // Default to '/api' if location not found
    if (APP_API_DATA.length > 0) {
      $routeProvider.otherwise('/app');
    } else if (API_DATA.length > 0) {
      $routeProvider.otherwise('/api');
    } else {
      $routeProvider.otherwise('/guides');
    }
  }
  config.$inject = ["$locationProvider", "$routeProvider", "API_DATA", "GUIDES_DATA", "HOME_DATA", "APP_API_DATA"];

  function run($rootScope) {
    // Add code highlighing after view content is loaded.
    $rootScope.$on('$viewContentLoaded', highlightCode)
  }
  run.$inject = ['$rootScope'];

  /**
   * @description Get all `code` blocks inside `pre` tags and add code highlighing with highlightJs.
   */
  function highlightCode() {
    var codeBlocks = angular.element(document).find('pre').find('code');
    angular.forEach(codeBlocks, hljs.highlightBlock);
  }
})();
(function() {
  'use strict';

  /**
   * @ngdoc module
   * @name bltDocs.api
   * 
   * @description The module for the documentation section of the
   * ngBoltJS project website
   * 
   */
  angular.module('api', []);
})();
(function() {
  'use strict';

  angular.module('home', [
    
  ]);
})();
(function() {
  'use strict';

  /**
   * @ngdoc module
   * @name bltDocs.guides
   * 
   * @description The module for the guides section of the
   * ngBoltJS project website
   * 
   */
  angular.module('guides', []);
})();
(function() {
  'use strict';

  angular.module('main', []);
})();
(function() {
  'use strict';

  /**
   * @ngdoc type
   * @name ApiController
   * @module bltDocs.api
   * 
   * @description The controller for the documentation 
   * section of the ngBoltJS project website
   */
  function ApiController(Shared, API_DATA, $window) {
    var ctrl = this;

    ctrl.scrollToTop = scrollToTop;

    activate();

    /**
     * @private 
     * @description Initialize the controller by setting
     * the current data for the sidebar menu to DOCS_DATA
     */
    function activate() { 
      Shared.sidebarData = API_DATA;
      Shared.showSidebar = true;
      Shared.currentPage = 'api';
    }

    /**
     * @private 
     * @description Scroll to the top of the page.
     */
    function scrollToTop(){
      debugger;
      
      $window.scrollTo(0,0);
    }
  }
  
  angular
    .module('api')
    .controller('ApiController', ApiController);

  ApiController.$inject = ['Shared', 'API_DATA', '$window'];
})();
(function() {
  'use strict';

  /**
   * @ngdoc type
   * @name ApiController
   * @module bltDocs.api
   * 
   * @description The controller for the documentation 
   * section of the ngBoltJS project website
   */
  function AppApiController(Shared, APP_API_DATA) {
    var ctrl = this;

    activate();

    /**
     * @private 
     * @description Initialize the controller by setting
     * the current data for the sidebar menu to DOCS_DATA
     */
    function activate() { 
      Shared.sidebarData = APP_API_DATA;
    }
  }
  
  angular
    .module('api')
    .controller('AppApiController', AppApiController);

  AppApiController.$inject = ['Shared', 'APP_API_DATA'];
})();
(function() {
'use strict';

  angular
    .module('api')
    .controller('RunnableExampleController', RunnableExampleController);

  RunnableExampleController.inject = [];
  function RunnableExampleController() {
    var ctrl = this;

    ctrl.showExample = undefined;
    ctrl.example = null;

    ctrl.setDefaultExample = setDefaultExample;

    activate();

    function activate() { 

    }

    function setDefaultExample(example) {
      ctrl.showExample = example;
    }
  }
})();
(function() {
'use strict';

  angular
    .module('home')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['HOME_DATA', 'Shared'];
  function HomeController(HOME_DATA, Shared) {
    var vm = this;
    

    activate();

    ////////////////

    function activate() {
      Shared.sidebarData = HOME_DATA;
      Shared.showSidebar = false;
      Shared.currentPage = 'home';
    }
  }
})();
(function () {
  'use strict';

  /**
   * @ngdoc type
   * @name GuidesController
   * @module bltDocs.guides
   * 
   * @description Controller for the guides section of the
   * ngBoltJS project website.
   */
  function GuidesController(GUIDES_DATA, Shared, $scope, $timeout) {
    var ctrl = this;

    // $scope.$on('$viewContentLoaded', function(){
    //   console.log('GuidesController: routeChangeSuccess');
    //   hljs.initHighlighting();
    // })
    
    activate();

    /**
     * @private 
     * @description Initialize the controller and set the
     * current data for the sidebar menu to GUIDES_DATA
     */
    function activate(){
      Shared.sidebarData = GUIDES_DATA;
      Shared.showSidebar = true;
      Shared.currentPage = 'guides';
    }
  }

  angular
    .module('guides')
    .controller('GuidesController', GuidesController);
  
  GuidesController.$inject = ['GUIDES_DATA', 'Shared', '$scope', '$timeout'];
})();
(function() {
'use strict';

  angular
    .module('main')
    .controller('AppbarController', AppbarController);

  AppbarController.$inject = ['API_DATA', 'APP_API_DATA', 'GUIDES_DATA', 'HOME_DATA'];
  function AppbarController(API_DATA, APP_API_DATA, GUIDES_DATA, HOME_DATA) {
    var ctrl = this;
    
    activate();

    function activate() { 
      ctrl.apiData = API_DATA;
      ctrl.appData = APP_API_DATA;
      ctrl.guidesData = GUIDES_DATA;
      ctrl.homeData = HOME_DATA;
    }
  }
})();
(function() {
'use strict';

  angular
    .module('main')
    .controller('MainController', MainController);

  MainController.inject = ['Shared', '$scope'];
  function MainController(Shared, $scope) {
    var ctrl = this;

    activate();

    function activate() { 
      $scope.$on('$viewContentLoaded', onRouteChange);
    }

    function onRouteChange(event, route){
      ctrl.currentPage = Shared.currentPage;
    }
  }
})();
(function() {
'use strict';

  /**
   * @ngdoc service
   * @name Shared
   * @module bltDocs.main
   */
  function Shared() {
    this.sidebarData = [];
    this.showSidebar = false;
    this.currentPage = '';
  }

  angular
    .module('main')
    .service('Shared', Shared);

  Shared.$inject = [];
})();
(function() {
'use strict';

  /**
   * @ngdoc type
   * @name SidebarController
   * @module bltDocs.main
   * 
   * @description The controller for the sidebar menu. 
   */
  function SidebarController(Shared, $scope, $location, $filter) {
    var ctrl = this;

    ctrl.activeItem = undefined;

    activate();

    /**
     * @private 
     * @description Activate the sidebar controller and load the
     * current sidebar data from the Shared service.
     */
    function activate() {
      // Handle a route change
      $scope.$on('$routeChangeSuccess', onRouteChange);
    }

    /**
     * @private
     * @description When the path of the url successfully changes, set
     * the active item using the path from the $location service
     */
    function onRouteChange(event, route){
      ctrl.activeItem = $location.path();
      ctrl.show = Shared.showSidebar;
      ctrl.list = $filter('orderBy')(Shared.sidebarData, '+order');
    }
  }
  
  angular
    .module('main')
    .controller('SidebarController', SidebarController);

  SidebarController.$inject = ['Shared', '$scope', '$location', '$filter'];
})();