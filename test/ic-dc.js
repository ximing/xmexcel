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
test('ic and dc', (t) => {
    let op1 = new Insert('1', 'ic', 1, 2);
    let op2 = new Delete('1', 'dc', 0, 1);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('dc and ic', (t) => {
    let op1 = new Delete('1', 'dc', 0, 1);
    let op2 = new Insert('1', 'ic', 1, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('dc and dc', (t) => {
    let op1 = new Delete('1', 'dc', 0, 1);
    let op2 = new Delete('1', 'dc', 1, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('dc and dc', (t) => {
    let op1 = new Delete('1', 'dc', 0, 4);
    let op2 = new Delete('1', 'dc', 1, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('dc and dc', (t) => {
    let op1 = new Delete('1', 'dc', 0, 2);
    let op2 = new Delete('1', 'dc', 4, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('dc and dc', (t) => {
    let op1 = new Delete('1', 'dc', 0, 3);
    let op2 = new Delete('1', 'dc', 2, 3);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


/*
*
*
*
* */

test('dc and dc', (t) => {
    let op1 = new Delete('1', 'dc', 3, 3);
    let op2 = new Delete('1', 'dc', 0, 5);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('dc and dc', (t) => {
    let op1 = new Delete('1', 'dc', 3, 3);
    let op2 = new Delete('1', 'dc', 2, 3);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('dc and dc', (t) => {
    let op1 = new Delete('1', 'dc', 3, 3);
    let op2 = new Delete('1', 'dc', 2, 1);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('dc and dc', (t) => {
    let op1 = new Delete('1', 'dc', 3, 3);
    let op2 = new Delete('1', 'dc', 2, 5);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('dc and dc', (t) => {
    let op1 = new Delete('1', 'dc', 3, 3);
    let op2 = new Delete('1', 'dc', 3, 5);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


test('ic and ic', (t) => {
    let op1 = new Delete('1', 'dc', 0, 1);
    let op2 = new Delete('1', 'dc', 1, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
