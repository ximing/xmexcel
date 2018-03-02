/**
 * Created by ximing on 3/1/18.
 */
'use strict';
const state = require('./state');
const _ = require('lodash');
let l = 900 * 100 * 4;
const t0 = Date.now();
for (let i = 0; i < l; i++) {
    Object.assign({}, state);
    // _.assign({},state);
    Object.keys(state)
}
const t1 = Date.now();
console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
