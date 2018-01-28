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
test('dr and dr', (t) => {
    let op1 = new Delete('1', 'dr', 3);
    let op2 = new Delete('1', 'dr', 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('dr and dr', (t) => {
    let op1 = new Delete('1', 'dr', 3);
    let op2 = new Delete('1', 'dr', 3);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


test('dr and dr', (t) => {
    let op1 = new Delete('1', 'dr', 0);
    let op2 = new Delete('1', 'dr', 3);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


test('dr and dr', (t) => {
    let op1 = new Delete('1', 'dr', 0);
    let op2 = new Delete('1', 'dr', 0);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
