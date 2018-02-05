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
test('change fix and ic', (t) => {
    let op1 = new Change('1', ['fixed'], {row: 3, col: 3});
    let op2 = new Insert('1', 'ic', 1, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('change fix and ic', (t) => {
    let op1 = new Change('1', ['fixed'], {row: 3, col: 3});
    let op2 = new Insert('1', 'ic', 3, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('change fix and ic', (t) => {
    let op1 = new Change('1', ['fixed'], {row: 3, col: 3});
    let op2 = new Insert('1', 'ic', 4, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change fix and ir', (t) => {
    let op1 = new Change('1', ['fixed'], {row: 3, col: 3});
    let op2 = new Insert('1', 'ir', 1, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('change fix and ir', (t) => {
    let op1 = new Change('1', ['fixed'], {row: 3, col: 3});
    let op2 = new Insert('1', 'ir', 3, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('change fix and ir', (t) => {
    let op1 = new Change('1', ['fixed'], {row: 3, col: 3});
    let op2 = new Insert('1', 'ir', 4, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


// local op is add col/row ,remote is fix

test('change ic and fix', (t) => {
    let op2 = new Change('1', ['fixed'], {row: 3, col: 3});
    let op1 = new Insert('1', 'ic', 1, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('change ic and fix', (t) => {
    let op2 = new Change('1', ['fixed'], {row: 3, col: 3});
    let op1 = new Insert('1', 'ic', 3, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('change ic and fix', (t) => {
    let op2 = new Change('1', ['fixed'], {row: 3, col: 3});
    let op1 = new Insert('1', 'ic', 4, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change ir and fix', (t) => {
    let op2 = new Change('1', ['fixed'], {row: 3, col: 3});
    let op1 = new Insert('1', 'ir', 1, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('change ir and fix', (t) => {
    let op2 = new Change('1', ['fixed'], {row: 3, col: 3});
    let op1 = new Insert('1', 'ir', 3, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('change ir and fix', (t) => {
    let op2 = new Change('1', ['fixed'], {row: 3, col: 3});
    let op1 = new Insert('1', 'ir', 4, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

// local op is remove col/row ,remote is fix

test('change dc and fix', (t) => {
    let op2 = new Change('1', ['fixed'], {row: 3, col: 3});
    let op1 = new Delete('1', 'dc', 1);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('change dc and fix', (t) => {
    let op2 = new Change('1', ['fixed'], {row: 3, col: 3});
    let op1 = new Delete('1', 'dc', 3);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('change dc and fix', (t) => {
    let op2 = new Change('1', ['fixed'], {row: 3, col: 3});
    let op1 = new Delete('1', 'dc', 4);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change dr and fix', (t) => {
    let op2 = new Change('1', ['fixed'], {row: 3, col: 3});
    let op1 = new Delete('1', 'dr', 1);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('change dr and fix', (t) => {
    let op2 = new Change('1', ['fixed'], {row: 3, col: 3});
    let op1 = new Delete('1', 'dr', 3);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('change dr and fix', (t) => {
    let op2 = new Change('1', ['fixed'], {row: 3, col: 3});
    let op1 = new Delete('1', 'dr', 4);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


// local op is fix,remote is remove col/row

test('change fix and dc', (t) => {
    let op1 = new Change('1', ['fixed'], {row: 3, col: 3});
    let op2 = new Delete('1', 'dc', 1);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('change fix and dc', (t) => {
    let op1 = new Change('1', ['fixed'], {row: 3, col: 3});
    let op2 = new Delete('1', 'dc', 3);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('change fix and dc', (t) => {
    let op1 = new Change('1', ['fixed'], {row: 3, col: 3});
    let op2 = new Delete('1', 'dc', 4);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change fix and dr', (t) => {
    let op1 = new Change('1', ['fixed'], {row: 3, col: 3});
    let op2 = new Delete('1', 'dr', 1);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('change fix and dr', (t) => {
    let op1 = new Change('1', ['fixed'], {row: 3, col: 3});
    let op2 = new Delete('1', 'dr', 3);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('change fix and dr', (t) => {
    let op1 = new Change('1', ['fixed'], {row: 3, col: 3});
    let op2 = new Delete('1', 'dr', 4);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
