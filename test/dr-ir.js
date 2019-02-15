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

test('dr and ir1', (t) => {
    let op1 = new Delete('1', 'dr', 0);
    let op2 = new Insert('1', 'ir', 1, 4);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('dr and ir2', (t) => {
    let op1 = new Delete('1', 'dr', 1);
    let op2 = new Insert('1', 'ir', 1, 4);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('dr and ir3', (t) => {
    let op1 = new Delete('1', 'dr', 3);
    let op2 = new Insert('1', 'ir', 1, 4);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('dr and ir4', (t) => {
    let op1 = new Delete('1', 'dr', 4);
    let op2 = new Insert('1', 'ir', 1, 4);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('dr and ir5', (t) => {
    let op1 = new Delete('1', 'dr', 6);
    let op2 = new Insert('1', 'ir', 1, 4);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
