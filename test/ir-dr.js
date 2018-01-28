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
test('ir and dr', (t) => {
    let op1 = new Insert('1', 'ir', 1, 4);
    let op2 = new Delete('1', 'dr', 0);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('ir and dr', (t) => {
    let op1 = new Insert('1', 'ir', 1, 4);
    let op2 = new Delete('1', 'dr', 1);
    let [a, b] = ExcelModel.transform(op1, op2);
    let r = b.apply(op1.apply(state));
    t.is(
        JSON.stringify(r),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


test('ir and dr', (t) => {
    let op1 = new Insert('1', 'ir', 1, 4);
    let op2 = new Delete('1', 'dr', 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    let r = b.apply(op1.apply(state));
    t.is(
        JSON.stringify(r),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('ir and dr', (t) => {
    let op1 = new Insert('1', 'ir', 1, 4);
    let op2 = new Delete('1', 'dr', 4);
    let [a, b] = ExcelModel.transform(op1, op2);
    let r = b.apply(op1.apply(state));
    t.is(
        JSON.stringify(r),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('ir and dr', (t) => {
    let op1 = new Insert('1', 'ir', 1, 4);
    let op2 = new Delete('1', 'dr', 6);
    let [a, b] = ExcelModel.transform(op1, op2);
    let r = b.apply(op1.apply(state));
    t.is(
        JSON.stringify(r),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
