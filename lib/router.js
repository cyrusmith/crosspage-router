'use strict';

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
function Router(config) {
    this.routes = {};
}

Router.prototype.start = function() {

}

module.export = Router;
