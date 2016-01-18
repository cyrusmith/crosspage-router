'use strict';

var paramMatch = new RegExp('^\:([a-zA-Z][a-zA-Z0-9]*)$');

function trimPath(path) {
    if (!path) return path;
    return path.replace(/\/*$/, '').replace(/^\/*/, '');
}

function path2RE(path) {
    var path = trimPath(path);
    var chunks = path.split('/');
    var re = [];
    var paramsMap = [];
    for (var i = 0; i < chunks.length; i++) {
        var chunk = chunks[i];
        if (!chunk) {
            continue;
        }

        var pm = chunk.match(paramMatch);
        if (pm) {
            paramsMap.push(pm[1]);
            re.push('([a-zA-Z0-9]+)');
        } else {
            re.push(chunk);
        }
    }
    return {
        p: new RegExp('^' + re.join('/')),
        a: paramsMap
    }
}

exports.path2RE = path2RE;

exports.trimPath = trimPath;
