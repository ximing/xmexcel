/**
 * Created by ximing on 3/1/18.
 */
'use strict';
const {Op, ExcelModel} = require('../dist');
const excelModel = ExcelModel.fromJSON({
    state: require('./state')
});
let ops = require('./del-ops.js').ops.map(op => Op.fromJSON(op));
const t0 = Date.now();
excelModel.apply(ops);
const t1 = Date.now();
console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.", ops.length);
