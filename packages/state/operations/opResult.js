/**
 * Created by ximing on 12/28/17.
 */
'use strict';
const debug = require('debug');
window.debug = debug;
const log = debug('excel:op:opResult');
export default class OpResult {
    constructor(doc, failed) {
        this.doc = doc;
        this.failed = failed;
    }

    static ok(doc) {
        return new OpResult(doc, null);
    }

    static fail(message) {
        log('%s', message);
        return new OpResult(null, message);
    }

};
