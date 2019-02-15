/**
 * Created by ximing on 1/29/18.
 */
'use strirt';
import test from 'ava';

import {ExcelModel, Empty, Delete, Insert, Change} from '../../src/index';

let state = {
    '1': {
        c: {
            '4:0': {v: '4:0'},
            '4:1': {v: '4:1'},
            '5:2': {v: '5:2'}
        }
    }
};

// local is is change,remote is insert row/col

test('change rh  and ir1', (t) => {
    let op1 = new Change('1', ['rh', 4], 5);
    let op2 = new Insert('1', 'ir', 1, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change rh  and ir2', (t) => {
    let op1 = new Change('1', ['rh', 4], 5);
    let op2 = new Insert('1', 'ir', 4, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


test('change rh  and ir3', (t) => {
    let op1 = new Change('1', ['rh', 4], 5);
    let op2 = new Insert('1', 'ir', 6, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


// local is insert row/col ,remote is change
test('change rh  and ir4', (t) => {
    let op1 = new Insert('1', 'ir', 1, 2);
    let op2 = new Change('1', ['rh', 4], 5);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change rh  and ir5', (t) => {
    let op1 = new Insert('1', 'ir', 4, 2);
    let op2 = new Change('1', ['rh', 4], 5);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change rh  and ir6', (t) => {
    let op1 = new Insert('1', 'ir', 6, 2);
    let op2 = new Change('1', ['rh', 4], 5);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


// local is delete row/col ,remote is change
test('change rh and dr7', (t) => {
    let op1 = new Delete('1', 'dr', 1);
    let op2 = new Change('1', ['rh', 4], 5);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change rh and dr8', (t) => {
    let op1 = new Delete('1', 'dr', 4);
    let op2 = new Change('1', ['rh', 4], 5);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change rh and dr9', (t) => {
    let op1 = new Delete('1', 'dr', 6);
    let op2 = new Change('1', ['rh', 4], 5);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


// local is change, remote is delete row/col
test('change rh and dr10', (t) => {
    let op2 = new Delete('1', 'dr', 1);
    let op1 = new Change('1', ['rh', 4], 5);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change rh and dr11', (t) => {
    let op2 = new Delete('1', 'dr', 4);
    let op1 = new Change('1', ['rh', 4], 5);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change rh and dr12', (t) => {
    let op2 = new Delete('1', 'dr', 6);
    let op1 = new Change('1', ['rh', 4], 5);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

