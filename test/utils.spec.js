var utils = require('../lib/utils');

describe("Utils", function() {

    it("joinPath", function() {
        expect(utils.joinPath(null, null)).toBe('');
        expect(utils.joinPath(null, '')).toBe('');
        expect(utils.joinPath('', null)).toBe('');
        expect(utils.joinPath('foo/', null)).toBe('foo/');
        expect(utils.joinPath(null, '/bar')).toBe('/bar');
        expect(utils.joinPath('', '')).toBe('/');
        expect(utils.joinPath('foo', '')).toBe('foo/');
        expect(utils.joinPath('', 'bar')).toBe('/bar');
        expect(utils.joinPath('foo', 'bar')).toBe('foo/bar');
        expect(utils.joinPath('foo', '/bar')).toBe('foo/bar');
        expect(utils.joinPath('foo', '/bar')).toBe('foo/bar');
        expect(utils.joinPath('foo/', '/bar')).toBe('foo/bar');
        expect(utils.joinPath('foo/', 'bar')).toBe('foo/bar');
        expect(utils.joinPath('/foo/', 'bar/')).toBe('/foo/bar/');
        expect(utils.joinPath('foo/', 'bar/')).toBe('foo/bar/');
    });

});