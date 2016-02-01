var Router = require('../lib/router');

describe("Router", function() {

    it("with simple path", function() {

        var ctxRoot = null;
        var ctxSub = null;

        var ctrls = {
            root: function(aCtx) {
                ctxRoot = aCtx;
            },
            sub: function(aCtx) {
                ctxSub = aCtx;
            }
        };

        spyOn(ctrls, 'root').and.callThrough();
        spyOn(ctrls, 'sub').and.callThrough();

        var router = new Router({
            ctrl: ctrls.root,
            next: {
                'subpath': {
                    ctrl: ctrls.sub
                }
            }
        });

        router.getPathname = jasmine.createSpy('getPathname spy').and.returnValue('subpath');

        router.start();

        expect(ctrls.root).toHaveBeenCalled();
        expect(ctxRoot).toEqual(jasmine.any(Object));
        expect(ctxRoot.params).toEqual({});
        expect(ctxRoot.path).toBe('/');

        expect(ctrls.sub).toHaveBeenCalled();
        expect(ctxSub).toEqual(jasmine.any(Object));
        expect(ctxSub.params).toEqual({});
        expect(ctxSub.path).toBe('/subpath');

    });

    it("with params", function() {

        var x = [null, null, null];

        var c = [];

        for (var i=0; i < x.length; i++) {
            c.push((function(i) {
                return function(ctx) {
                    x[i] = ctx;
                }
            })(i));
        }

        spyOn(c, '0').and.callThrough();
        spyOn(c, '1').and.callThrough();
        spyOn(c, '2').and.callThrough();

        var router = new Router({
            next: {
                '/catalog/:itemId': {
                    ctrl: c[1],
                    next: {
                        'download': {
                            ctrl: c[2],
                        }
                    }
                },
                ':itemId': {
                    ctrl: c[0]
                }
            }
        });

        router.getPathname = jasmine.createSpy('getPathname spy').and.returnValue('catalog/1234/download');

        router.start();

        expect(c[0]).toHaveBeenCalled();
        expect(c[1]).toHaveBeenCalled();
        expect(c[2]).toHaveBeenCalled();

        expect(x[0]).toEqual(jasmine.any(Object));
        expect(x[0].params).toEqual({
            itemId: 'catalog'
        });

        expect(x[1]).toEqual(jasmine.any(Object));
        expect(x[1].params).toEqual({
            itemId: '1234'
        });

        expect(x[2]).toEqual(jasmine.any(Object));
        expect(x[2].params).toEqual({
            itemId: '1234'
        });

    });

    it("with path prefix", function() {

        var ctxRoot = null;
        var ctxSub = null;

        var ctrls = {
            root: function(aCtx) {
                ctxRoot = aCtx;
            },
            sub: function(aCtx) {
                ctxSub = aCtx;
            }
        };

        spyOn(ctrls, 'root').and.callThrough();
        spyOn(ctrls, 'sub').and.callThrough();

        var router = new Router({
            ctrl: ctrls.root,
            next: {
                'subpath': {
                    ctrl: ctrls.sub
                }
            }
        }, '/admin/');

        router.getPathname = jasmine.createSpy('getPathname spy').and.returnValue('admin/subpath');

        router.start();

        expect(ctrls.root).toHaveBeenCalled();
        expect(ctxRoot).toEqual(jasmine.any(Object));
        expect(ctxRoot.params).toEqual({});
        expect(ctxRoot.path).toBe('/');

        expect(ctrls.sub).toHaveBeenCalled();
        expect(ctxSub).toEqual(jasmine.any(Object));
        expect(ctxSub.params).toEqual({});
        expect(ctxSub.path).toBe('/subpath');

    });

});
