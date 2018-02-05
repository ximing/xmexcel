/**
 * Created by ximing on 1/29/18.
 */
'use strict';
import test from 'ava';

import {ExcelModel, Empty, Delete, Insert, Change} from '../../src/index';

let state = {
    '1': {
        c: {
            '4:0': {v: 1},
            '4:1': {v: 1},
            '5:2': {v: 1}
        }
    }
};


// local is is change,remote is insert row/col

test('change cw  and ic', (t) => {
    let op1 = new Change('1', ['cw', 4], 5);
    let op2 = new Insert('1', 'ic', 1, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change cw  and ic', (t) => {
    let op1 = new Change('1', ['cw', 4], 5);
    let op2 = new Insert('1', 'ic', 4, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


test('change cw  and ic', (t) => {
    let op1 = new Change('1', ['cw', 4], 5);
    let op2 = new Insert('1', 'ic', 6, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


// local is insert row/col ,remote is change
test('change cw  and ic', (t) => {
    let op1 = new Insert('1', 'ic', 1, 2);
    let op2 = new Change('1', ['cw', 4], 5);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change cw  and ic', (t) => {
    let op1 = new Insert('1', 'ic', 4, 2);
    let op2 = new Change('1', ['cw', 4], 5);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change cw  and ic', (t) => {
    let op1 = new Insert('1', 'ic', 6, 2);
    let op2 = new Change('1', ['cw', 4], 5);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


// local is delete row/col ,remote is change
test('change cw and dc', (t) => {
    let op1 = new Delete('1', 'dc', 1);
    let op2 = new Change('1', ['cw', 4], 5);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change cw and dc', (t) => {
    let op1 = new Delete('1', 'dc', 4);
    let op2 = new Change('1', ['cw', 4], 5);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change cw and dc', (t) => {
    let op1 = new Delete('1', 'dc', 6);
    let op2 = new Change('1', ['cw', 4], 5);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


// local is change, remote is delete row/col
test('change cw and dc', (t) => {
    let op2 = new Delete('1', 'dc', 1);
    let op1 = new Change('1', ['cw', 4], 5);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change cw and dc', (t) => {
    let op2 = new Delete('1', 'dc', 4);
    let op1 = new Change('1', ['cw', 4], 5);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change cw and dc', (t) => {
    let op2 = new Delete('1', 'dc', 6);
    let op1 = new Change('1', ['cw', 4], 5);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
