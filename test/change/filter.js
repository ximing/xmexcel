/**
 * Created by ximing on 2/7/18.
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
*   filter: {
        row: 1,
        colRange: [0, 5]
    },
    filterByValue: {
        [colIndex]: [1, 2, 3]
    }
* }
* */
test('change filter and ic', (t) => {
    let op1 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let op2 = new Insert('1', 'ic', 1, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filter and ic', (t) => {
    let op1 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let op2 = new Insert('1', 'ic', 3, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filter and ic', (t) => {
    let op1 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let op2 = new Insert('1', 'ic', 4, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filter and ic', (t) => {
    let op1 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let op2 = new Insert('1', 'ic', 6, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filter and ir', (t) => {
    let op1 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let op2 = new Insert('1', 'ir', 0, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filter and ir', (t) => {
    let op1 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let op2 = new Insert('1', 'ir', 1, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filter and ir', (t) => {
    let op1 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let op2 = new Insert('1', 'ir', 2, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


test('change filter and dr', (t) => {
    let op1 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let op2 = new Delete('1', 'dr', 0);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filter and dr', (t) => {
    let op1 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let op2 = new Delete('1', 'dr', 1);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filter and dr', (t) => {
    let op1 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let op2 = new Delete('1', 'dr', 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filter and dc', (t) => {
    let op1 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let op2 = new Delete('1', 'dc', 0);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filter and dc', (t) => {
    let op1 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let op2 = new Delete('1', 'dc', 1);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filter and dc', (t) => {
    let op1 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let op2 = new Delete('1', 'dc', 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filter and dc', (t) => {
    let op1 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let op2 = new Delete('1', 'dc', 4);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filter and dc', (t) => {
    let op1 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let op2 = new Delete('1', 'dc', 6);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


test('change dc and filter', (t) => {
    let op1 = new Delete('1', 'dc', 6);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


test('change dc and filter', (t) => {
    let op1 = new Delete('1', 'dc', 4);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change dc and filter', (t) => {
    let op1 = new Delete('1', 'dc', 2);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change dc and filter', (t) => {
    let op1 = new Delete('1', 'dc', 1);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change dc and filter', (t) => {
    let op1 = new Delete('1', 'dc', 0);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change dr and filter', (t) => {
    let op1 = new Delete('1', 'dr', 0);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change dr and filter', (t) => {
    let op1 = new Delete('1', 'dr', 1);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change dr and filter', (t) => {
    let op1 = new Delete('1', 'dr', 2);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change ic and filter', (t) => {
    let op1 = new Insert('1', 'ic', 0, 2);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change ic and filter', (t) => {
    let op1 = new Insert('1', 'ic', 1, 2);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change ic and filter', (t) => {
    let op1 = new Insert('1', 'ic', 2, 2);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change ic and filter', (t) => {
    let op1 = new Insert('1', 'ic', 4, 2);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change ic and filter', (t) => {
    let op1 = new Insert('1', 'ic', 6, 2);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change ir and filter', (t) => {
    let op1 = new Insert('1', 'ir', 0, 2);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change ir and filter', (t) => {
    let op1 = new Insert('1', 'ir', 1, 2);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change ir and filter', (t) => {
    let op1 = new Insert('1', 'ir', 2, 2);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change ir and filter', (t) => {
    let op1 = new Insert('1', 'ir', 4, 2);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change ir and filter', (t) => {
    let op1 = new Insert('1', 'ir', 6, 2);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
