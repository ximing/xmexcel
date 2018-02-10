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
*   filter: {
        row: 1,
        colRange: [0, 5]
    },
    filterByValue: {
        [colIndex]: [1, 2, 3]
    }
* }
* */
test('change hiddenRow and ic', (t) => {
    let op1 = new Change('1', ['hiddenRows'], [1, 2, 5, 6]);
    let op2 = new Insert('1', 'ic', 0, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('change hiddenRow and ir', (t) => {
    let op1 = new Change('1', ['hiddenRows'], [1, 2, 5, 6]);
    let op2 = new Insert('1', 'ir', 0, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('change hiddenRow and ir', (t) => {
    let op1 = new Change('1', ['hiddenRows'], [1, 2, 5, 6]);
    let op2 = new Insert('1', 'ir', 2, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change hiddenRow and ir', (t) => {
    let op1 = new Change('1', ['hiddenRows'], [1, 2, 5, 6]);
    let op2 = new Insert('1', 'ir', 7, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change hiddenRow and ir', (t) => {
    let op1 = new Insert('1', 'ir', 7, 2);
    let op2 = new Change('1', ['hiddenRows'], [1, 2, 5, 6]);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change hiddenRow and ir', (t) => {
    let op1 = new Insert('1', 'ir', 2, 2);
    let op2 = new Change('1', ['hiddenRows'], [1, 2, 5, 6]);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change hiddenRow and ir', (t) => {
    let op1 = new Insert('1', 'ir', 0, 2);
    let op2 = new Change('1', ['hiddenRows'], [1, 2, 5, 6]);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


test('change hiddenRow and dr', (t) => {
    let op1 = new Delete('1', 'dr', 0);
    let op2 = new Change('1', ['hiddenRows'], [1, 2, 5, 6]);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change hiddenRow and dr', (t) => {
    let op1 = new Delete('1', 'dr', 1);
    let op2 = new Change('1', ['hiddenRows'], [1, 2, 5, 6]);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change hiddenRow and dr', (t) => {
    let op1 = new Delete('1', 'dr', 3);
    let op2 = new Change('1', ['hiddenRows'], [1, 2, 5, 6]);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change hiddenRow and dr', (t) => {
    let op1 = new Delete('1', 'dr', 7);
    let op2 = new Change('1', ['hiddenRows'], [1, 2, 5, 6]);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


test('change hiddenRow and dr', (t) => {
    let op1 = new Change('1', ['hiddenRows'], [1, 2, 5, 6]);
    let op2 = new Delete('1', 'dr', 0);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change hiddenRow and dr', (t) => {
    let op1 = new Change('1', ['hiddenRows'], [1, 2, 5, 6]);
    let op2 = new Delete('1', 'dr', 1);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change hiddenRow and dr', (t) => {
    let op1 = new Change('1', ['hiddenRows'], [1, 2, 5, 6]);
    let op2 = new Delete('1', 'dr', 3);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change hiddenRow and dr', (t) => {
    let op1 = new Change('1', ['hiddenRows'], [1, 2, 5, 6]);
    let op2 = new Delete('1', 'dr', 7);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
