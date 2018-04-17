/**
 * Created by ximing on 3/14/18.
 */
"use strict";

import test from "ava";
import { ExcelModel, Empty, Delete, Insert, Change } from "../src/index";

let state = {
    "1": {
        c: {},
        rh: { 3: 20 },
        cw: { 4: 200 }
    }
};
test("dr", t => {
    let op1 = new Delete("1", "dr", 4);
    t.is(
        JSON.stringify(op1.apply(state)),
        JSON.stringify({ "1": { c: {}, rh: { "3": 20 }, cw: { "4": 200 } , row: 199, col: 20} })
    );
});

let state2 = {
    '1': {
        c: {},
        filter: {
            colRange: [1,2],
            row: 0
        },
        hiddenRows: [3, 4, 5],
        fixed: {
            row: 2
        }
    }
};
test('dr->hiddenRows', t => {
    let op1 = new Delete('1', 'dr', 3);
    let _state  = op1.apply(state2);
    t.is(_state['1'].hiddenRows.length, 2);
    t.is(JSON.stringify(_state['1'].hiddenRows),JSON.stringify([3, 4]));
});

test('dr->hiddenRows', t => {
    let op1 = new Delete('1', 'dr', 1);
    let _state  = op1.apply(state2);
    t.is(_state['1'].hiddenRows.length, 3);
    t.is(JSON.stringify(_state['1'].hiddenRows),JSON.stringify([2, 3, 4]));
});

test('dr->hiddenRows', t => {
    let op1 = new Delete('1', 'dr', 6);
    let _state  = op1.apply(state2);
    t.is(_state['1'].hiddenRows.length, 3);
    t.is(JSON.stringify(_state['1'].hiddenRows),JSON.stringify([3, 4, 5]));
});

test('dr->hiddenRows', t => {
    let op1 = new Delete('1', 'dr', 0);
    let _state  = op1.apply(state2);
    t.is(_state['1'].hiddenRows.length, 0);
});

test('dr->fixed', t => {
    let op1 = new Delete('1', 'dr', 1);
    let _state  = op1.apply(state2);
    t.is(_state['1'].fixed.row, 1);
    t.falsy(_state['1'].fixed.col);
});

test('dr->fixed', t => {
    let op1 = new Delete('1', 'dr', 2);
    let _state  = op1.apply(state2);
    t.is(_state['1'].fixed.row, 2);
    t.falsy(_state['1'].fixed.col);
});

test('dr->fixed', t => {
    let op1 = new Delete('1', 'dr', 0);
    let _state  = op1.apply(state2);
    _state = op1.apply(_state);
    t.falsy(_state['1'].fixed);
});
