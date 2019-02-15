/**
 * Created by ximing on 1/19/18.
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
test('ic and dc1', (t) => {
    let op1 = new Insert('1', 'ic', 1, 4);
    let op2 = new Delete('1', 'dc', 0);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('ic and dc2', (t) => {
    let op1 = new Insert('1', 'ic', 1, 4);
    let op2 = new Delete('1', 'dc', 1);
    let [a, b] = ExcelModel.transform(op1, op2);
    let r = b.apply(op1.apply(state));
    t.is(
        JSON.stringify(r),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


test('ic and dc3', (t) => {
    let op1 = new Insert('1', 'ic', 1, 4);
    let op2 = new Delete('1', 'dc', 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    let r = b.apply(op1.apply(state));
    t.is(
        JSON.stringify(r),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('ic and dc4', (t) => {
    let op1 = new Insert('1', 'ic', 1, 4);
    let op2 = new Delete('1', 'dc', 4);
    let [a, b] = ExcelModel.transform(op1, op2);
    let r = b.apply(op1.apply(state));
    t.is(
        JSON.stringify(r),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('ic and dc5', (t) => {
    let op1 = new Insert('1', 'ic', 1, 4);
    let op2 = new Delete('1', 'dc', 6);
    let [a, b] = ExcelModel.transform(op1, op2);
    let r = b.apply(op1.apply(state));
    t.is(
        JSON.stringify(r),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
