var utils = require('./utils');

/**
 *
 * @param config
 * Example config:
 * {
 *   handler: Function // accepts context
 *   children: {
 *      '<route>': {
 *         handler: Function,
 *         ...
   *     }
 *   }
 * }
 * route is in the form /path/to/resource/:resId
 * context is plain object:
 * {
 *   query: Object, //map of query params,
 *   params: Object, //map of path params - path /:resId will result in params = {resId: <resIdValue>}
 *   path: String, //path itself
 * }
 * @constructor
 */

function appendToStack(map, stack, parentPath) {
    for (var chunk in map) {
        if (map.hasOwnProperty(chunk)) {
            stack.push({
                path: parentPath ? parentPath + '/' + chunk : chunk,
                ctrl: map[chunk].ctrl,
                next: map[chunk].next
            });
        }
    }
}

/**
 * Builds data structure from config
 * @param {?string} prefix - to append to all paths in config
 * @param {object} config
 * @returns {Array} routes to process
 */
function buildRoutes(prefix, config) {
    var routes = [];
    var stack = [];
    appendToStack(config, stack, '');
    while (stack.length) {
        var forProcess = stack.splice(0);
        for (var i = 0; i < forProcess.length; i++) {
            if (forProcess[i].next) {
               appendToStack(forProcess[i].next, stack, forProcess[i].path);
            }
            routes.push({
                re: utils.path2RE(utils.joinPath(prefix, forProcess[i].path)),
                ctrl: forProcess[i].ctrl,
                path: forProcess[i].path
            });
        }
    }
    return routes;
}

/**
 * Router class
 * @constructor
 * @param {Object} config - plain object that configures the router.
 * @param {string=} prefix - paths prefix. If set then all pathes in config will be considered
 * as prefix + <path>
 */
function Router(config, prefix) {
    if (typeof config.ctrl === 'function') {
        this.rootCtrl = config.ctrl;
    }
    this.prefix = prefix || null;
    this.routes = config.next ? buildRoutes(this.prefix, config.next): [];
}

Router.prototype.start = function() {
    var pathname = this.getPathname();
    if (this.rootCtrl) {
        this.rootCtrl.call(null, {
            path: '/',
            params: {}
        });
    }

    for (var i=0; i < this.routes.length; i++) {
        var re = this.routes[i].re;

        var ctrl = this.routes[i].ctrl;
        if (!ctrl) continue;
        var m = pathname.match(re.p);
        if (m) {
            var path = this.routes[i].path;
            var params = {};
            for (var k=1; k < m.length; k++) {
                params[re.a[k-1]] = m[k];
            }
            ctrl.call(null, {
                path: '/' + path,
                params: params
            });
        }
    }

}

Router.prototype.getPathname = function() {
    return utils.trimPath(location.pathname);
}

module.exports = Router;
