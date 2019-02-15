/**
 * @Creator: eyes
 * @Date: 4/10/18
 * include [dc op change excel state] and [dc op change filterByValue/filter op]
 */
'use strict';
import test from 'ava';
import {ExcelModel, Empty, Delete, Insert, Change} from '../src/index';

let state = {
    '1': {
        c: {
            '0:1': {v: 1},
            '0:2': {v: 1},
            '1:1': {v: 1},
            '1:2': {v: 1},
        },
        filterByValue: {
            '2': ['filter','value']
        }
    }
};

test('dc change filterByValue in excel state1', (t) => {
    let model = ExcelModel.fromJSON({
        state
    });
    let newState = new Delete('1', 'dc', 1).apply(model.state);
    t.is(
        JSON.stringify(newState[1].filterByValue),
        JSON.stringify({
            '1': ['filter','value']
        })
    );
});

test('dc change filterByValue in excel state2', (t) => {
    let model = ExcelModel.fromJSON({
        state
    });
    let newState = new Delete('1', 'dc', 2).apply(model.state);
    t.falsy(newState[1].filterByValue);
});

test('dc change filterByValue in excel state3', (t) => {
    let model = ExcelModel.fromJSON({
        state
    });
    let newState = new Delete('1', 'dc', 3).apply(model.state);
    t.is(
        JSON.stringify(newState[1].filterByValue),
        JSON.stringify({
            '2': ['filter','value']
        })
    );
});

test('dc change filterByValue in OP1', t => {
    let op1 = new Change('1', ['filterByValue',2], ['value']);
    let op2 = new Delete('1', 'dc', 1);
    let [a] = ExcelModel.transform(op1, op2);
    t.is(a.p[1], 1);
});

test('dc change filterByValue in OP2', t => {
    let op1 = new Change('1', ['filterByValue',2], ['value']);
    let op2 = new Delete('1', 'dc', 2);
    let [a] = ExcelModel.transform(op1, op2);
    t.falsy(a.oi);
});

test('dc change filterByValue in OP3', t => {
    let op1 = new Change('1', ['filterByValue',2], ['value']);
    let op2 = new Delete('1', 'dc', 3);
    let [a] = ExcelModel.transform(op1, op2);
    t.is(a.p[1], 2);
});

//od has value
test('dc change filterByValue in OP4', t => {
    let op1 = new Change('1', ['filterByValue',2], null, ['value']);
    let op2 = new Delete('1', 'dc', 2);
    let [a] = ExcelModel.transform(op1, op2);
    t.falsy(a.od);
});


// --------------- filter ---------------

test('dc change filter in OP1', t => {
    let op1 = new Change('1', ['filter'], {colRange: [2,4], row: 1});
    let op2 = new Delete('1', 'dc', 3);
    let [a] = ExcelModel.transform(op1, op2);
    t.is(a.oi.colRange[0], 2);
    t.is(a.oi.colRange[1], 3);
});

test('dc change filter in OP2', t => {
    let op1 = new Change('1', ['filter'], {colRange: [2,4], row: 1});
    let op2 = new Delete('1', 'dc', 1);
    let [a] = ExcelModel.transform(op1, op2);
    t.is(a.oi.colRange[0], 1);
    t.is(a.oi.colRange[1], 3);
});

test('dc change filter in OP3', t => {
    let op1 = new Change('1', ['filter'], {colRange: [2,4], row: 1});
    let op2 = new Delete('1', 'dc', 5);
    let [a] = ExcelModel.transform(op1, op2);
    t.is(a.oi.colRange[0], 2);
    t.is(a.oi.colRange[1], 4);
});

//od has value
test('dc change filter in OP4', t => {
    let op1 = new Change('1', ['filter'], null, {colRange: [2,4], row: 1});
    let op2 = new Delete('1', 'dc', 3);
    let [a] = ExcelModel.transform(op1, op2);
    t.is(a.od.colRange[0], 2);
    t.is(a.od.colRange[1], 3);
});

test('dc change filter in OP5', t => {
    let op1 = new Change('1', ['filter'], null, {colRange: [2,4], row: 1});
    let op2 = new Delete('1', 'dc', 1);
    let [a] = ExcelModel.transform(op1, op2);
    t.is(a.od.colRange[0], 1);
    t.is(a.od.colRange[1], 3);
});

test('dc change filter in OP6', t => {
    let op1 = new Change('1', ['filter'], null, {colRange: [2,4], row: 1});
    let op2 = new Delete('1', 'dc', 5);
    let [a] = ExcelModel.transform(op1, op2);
    t.is(a.od.colRange[0], 2);
    t.is(a.od.colRange[1], 4);
});
