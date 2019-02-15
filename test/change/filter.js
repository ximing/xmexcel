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
test('change filter and ic1', (t) => {
    let op1 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let op2 = new Insert('1', 'ic', 1, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filter and ic2', (t) => {
    let op1 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let op2 = new Insert('1', 'ic', 3, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filter and ic3', (t) => {
    let op1 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let op2 = new Insert('1', 'ic', 4, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filter and ic4', (t) => {
    let op1 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let op2 = new Insert('1', 'ic', 6, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filter and ir1', (t) => {
    let op1 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let op2 = new Insert('1', 'ir', 0, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filter and ir2', (t) => {
    let op1 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let op2 = new Insert('1', 'ir', 1, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filter and ir3', (t) => {
    let op1 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let op2 = new Insert('1', 'ir', 2, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


test('change filter and dr1', (t) => {
    let op1 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let op2 = new Delete('1', 'dr', 0);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filter and dr2', (t) => {
    let op1 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let op2 = new Delete('1', 'dr', 1);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filter and dr3', (t) => {
    let op1 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let op2 = new Delete('1', 'dr', 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filter and dc1', (t) => {
    let op1 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let op2 = new Delete('1', 'dc', 0);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filter and dc2', (t) => {
    let op1 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let op2 = new Delete('1', 'dc', 1);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filter and dc3', (t) => {
    let op1 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let op2 = new Delete('1', 'dc', 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filter and dc4', (t) => {
    let op1 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let op2 = new Delete('1', 'dc', 4);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filter and dc5', (t) => {
    let op1 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let op2 = new Delete('1', 'dc', 6);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


test('change dc and filter1', (t) => {
    let op1 = new Delete('1', 'dc', 6);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


test('change dc and filter2', (t) => {
    let op1 = new Delete('1', 'dc', 4);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change dc and filter3', (t) => {
    let op1 = new Delete('1', 'dc', 2);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change dc and filter4', (t) => {
    let op1 = new Delete('1', 'dc', 1);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change dc and filter5', (t) => {
    let op1 = new Delete('1', 'dc', 0);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change dr and filter6', (t) => {
    let op1 = new Delete('1', 'dr', 0);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change dr and filter7', (t) => {
    let op1 = new Delete('1', 'dr', 1);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change dr and filter8', (t) => {
    let op1 = new Delete('1', 'dr', 2);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change ic and filter1', (t) => {
    let op1 = new Insert('1', 'ic', 0, 2);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change ic and filter2', (t) => {
    let op1 = new Insert('1', 'ic', 1, 2);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change ic and filter3', (t) => {
    let op1 = new Insert('1', 'ic', 2, 2);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change ic and filter4', (t) => {
    let op1 = new Insert('1', 'ic', 4, 2);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change ic and filter5', (t) => {
    let op1 = new Insert('1', 'ic', 6, 2);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change ir and filter1', (t) => {
    let op1 = new Insert('1', 'ir', 0, 2);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change ir and filter2', (t) => {
    let op1 = new Insert('1', 'ir', 1, 2);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change ir and filter3', (t) => {
    let op1 = new Insert('1', 'ir', 2, 2);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change ir and filter4', (t) => {
    let op1 = new Insert('1', 'ir', 4, 2);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change ir and filter5', (t) => {
    let op1 = new Insert('1', 'ir', 6, 2);
    let op2 = new Change('1', ['filter'], {row: 1, colRange: [1, 4]});
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
