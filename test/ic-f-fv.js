/**
 * @Creator: eyes
 * @Date: 4/10/18
 * include [ic op change excel state] and [ic op change filterByValue/filter op]
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

test('ic change filterByValue in Excel state1', (t) => {
    let model = ExcelModel.fromJSON({
        state
    });
    let newState = new Insert('1', 'ic', 2, 2).apply(model.state);
    t.is(
        JSON.stringify(newState[1].filterByValue),
        JSON.stringify({
            '4': ['filter','value']
        })
    );
});

test('ic change filterByValue in Excel state2', (t) => {
    let model = ExcelModel.fromJSON({
        state
    });
    let newState = new Insert('1', 'ic', 3, 1).apply(model.state);
    t.is(
        JSON.stringify(newState[1].filterByValue),
        JSON.stringify({
            '2': ['filter','value']
        })
    );
});


test('ic change filterByValue in OP1', t => {
    let op1 = new Change('1', ['filterByValue', 2], ['value']);
    let op2 = new Insert('1', 'ic', 2, 2);
    let [a] = ExcelModel.transform(op1, op2);
    t.is(a.p[1], 4);
});

test('ic change filterByValue in OP2', t => {
    let op1 = new Change('1', ['filterByValue', 2], ['value']);
    let op2 = new Insert('1', 'ic', 3, 1);
    let [a] = ExcelModel.transform(op1, op2);
    t.is(a.p[1], 2);
});


// --------------- filter ---------------
test('ic change filter in OP1', t => {
    let op1 = new Change('1', ['filter'], {colRange: [2,4], row: 1});
    let op2 = new Insert('1', 'ic', 3, 2);
    let [a] = ExcelModel.transform(op1, op2);
    t.is(a.oi.colRange[0], 2);
    t.is(a.oi.colRange[1], 6);
});

test('ic change filter in OP2', t => {
    let op1 = new Change('1', ['filter'], {colRange: [2,4], row: 1});
    let op2 = new Insert('1', 'ic', 1, 2);
    let [a] = ExcelModel.transform(op1, op2);
    t.is(a.oi.colRange[0], 4);
    t.is(a.oi.colRange[1], 6);
});

test('ic change filter in OP3', t => {
    let op1 = new Change('1', ['filter'], {colRange: [2,4], row: 1});
    let op2 = new Insert('1', 'ic', 5, 2);
    let [a] = ExcelModel.transform(op1, op2);
    t.is(a.oi.colRange[0], 2);
    t.is(a.oi.colRange[1], 4);
});

//od has value
test('ic change filter in OP4', t => {
    let op1 = new Change('1', ['filter'], null, {colRange: [2,4], row: 1});
    let op2 = new Insert('1', 'ic', 3, 2);
    let [a] = ExcelModel.transform(op1, op2);
    t.is(a.od.colRange[0], 2);
    t.is(a.od.colRange[1], 6);
});

test('ic change filter in OP5', t => {
    let op1 = new Change('1', ['filter'], null, {colRange: [2,4], row: 1});
    let op2 = new Insert('1', 'ic', 1, 2);
    let [a] = ExcelModel.transform(op1, op2);
    t.is(a.od.colRange[0], 4);
    t.is(a.od.colRange[1], 6);
});

test('ic change filter in OP6', t => {
    let op1 = new Change('1', ['filter'], null, {colRange: [2,4], row: 1});
    let op2 = new Insert('1', 'ic', 5, 2);
    let [a] = ExcelModel.transform(op1, op2);
    t.is(a.od.colRange[0], 2);
    t.is(a.od.colRange[1], 4);
});
