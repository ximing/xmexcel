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
test('change rh  and ic', (t) => {
    let op1 = new Change('1', ['rh', 4], 5);
    let op2 = new Insert('1', 'ir', 1, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    console.log(a, b);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change rh  and ic', (t) => {
    let op1 = new Change('1', ['rh', 4], 5);
    let op2 = new Insert('1', 'ir', 4, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


test('change rh  and ic', (t) => {
    let op1 = new Change('1', ['rh', 4], 5);
    let op2 = new Insert('1', 'ir', 6, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

// local is insert row/col ,remote is change
test('change rh  and ic', (t) => {
    let op2 = new Change('1', ['rh', 4], 5);
    let op1 = new Insert('1', 'ir', 1, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change rh  and ic', (t) => {
    let op2 = new Change('1', ['rh', 4], 5);
    let op1 = new Insert('1', 'ir', 4, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


test('change rh  and ic', (t) => {
    let op2 = new Change('1', ['rh', 4], 5);
    let op1 = new Insert('1', 'ir', 6, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

