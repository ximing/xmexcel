/**
 * Created by ximing on 1/29/18.
 */
'use strict';

import test from 'ava';
import {ExcelModel, Empty, Delete, Insert, Change} from '../src/index';
import {c} from './lib/cellsData';

let state = {
    '1': {
        c: c
    }
};

test('dc and ic1', (t) => {
    let op1 = new Delete('1', 'dc', 0);
    let op2 = new Insert('1', 'ic', 1, 4);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('dc and ic2', (t) => {
    let op1 = new Delete('1', 'dc', 1);
    let op2 = new Insert('1', 'ic', 1, 4);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('dc and ic3', (t) => {
    let op1 = new Delete('1', 'dc', 3);
    let op2 = new Insert('1', 'ic', 1, 4);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('dc and ic4', (t) => {
    let op1 = new Delete('1', 'dc', 4);
    let op2 = new Insert('1', 'ic', 1, 4);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('dc and ic5', (t) => {
    let op1 = new Delete('1', 'dc', 6);
    let op2 = new Insert('1', 'ic', 1, 4);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
