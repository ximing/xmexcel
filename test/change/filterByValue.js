/**
 * Created by ximing on 2/8/18.
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
/*
* {
    filter: {
        row: 1,
        colRange: [0, 5]
    },
    filterByValue: {
        [colIndex]: [1, 2, 3]
    }
* }
* */
test('change filterByValue and ic', (t) => {
    let op1 = new Change('1', ['filterByValue', 1], [1, 2, 3]);
    let op2 = new Insert('1', 'ic', 0, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filterByValue and ic', (t) => {
    let op1 = new Change('1', ['filterByValue', 1], [1, 2, 3]);
    let op2 = new Insert('1', 'ic', 1, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filterByValue and ic', (t) => {
    let op1 = new Change('1', ['filterByValue', 1], [1, 2, 3]);
    let op2 = new Insert('1', 'ic', 2, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filterByValue and dc', (t) => {
    let op1 = new Change('1', ['filterByValue', 1], [1, 2, 3]);
    let op2 = new Delete('1', 'dc', 0);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filterByValue and dc', (t) => {
    let op1 = new Change('1', ['filterByValue', 1], [1, 2, 3]);
    let op2 = new Delete('1', 'dc', 1);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filterByValue and dc', (t) => {
    let op1 = new Change('1', ['filterByValue', 1], [1, 2, 3]);
    let op2 = new Delete('1', 'dc', 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
