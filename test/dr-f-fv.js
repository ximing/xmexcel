/**
 * @Creator: eyes
 * @Date: 4/10/18
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
        filter: {
            colRange: [1,4],
            row: 1
        },
        filterByValue: {
            '2': ['filter','value']
        }
    }
};

test('dr change filterByValue in excel state', (t) => {
    let model = ExcelModel.fromJSON({
        state
    });
    let newState = new Delete('1', 'dr', 1).apply(model.state);
    t.falsy(
        newState[1].filterByValue
    );
});

// --------------- filter ---------------

test('dr change filter in op1', t => {
    let op1 = new Change('1', ['filter'], {colRange: [2,4], row: 2});
    let op2 = new Delete('1', 'dr', 1);
    let [a] = ExcelModel.transform(op1, op2);
    t.is(a.oi.row, 1);
});

test('dr change filter in op2', t => {
    let op1 = new Change('1', ['filter'], {colRange: [2,4], row: 2});
    let op2 = new Delete('1', 'dr', 3);
    let [a] = ExcelModel.transform(op1, op2);
    t.is(a.oi.row, 2);
});

test('dr change filter in op3', t => {
    let op1 = new Change('1', ['filter'], {colRange: [2,4], row: 2});
    let op2 = new Delete('1', 'dr', 2);
    let [a] = ExcelModel.transform(op1, op2);
    t.falsy(a.oi)
});

//od has value
test('dr change filter in op4', t => {
    let op1 = new Change('1', ['filter'], null, {colRange: [2,4], row: 2});
    let op2 = new Delete('1', 'dr', 1);
    let [a] = ExcelModel.transform(op1, op2);
    t.is(a.od.row, 1);
});

test('dr change filter in op5', t => {
    let op1 = new Change('1', ['filter'], null, {colRange: [2,4], row: 2});
    let op2 = new Delete('1', 'dr', 3);
    let [a] = ExcelModel.transform(op1, op2);
    t.is(a.od.row, 2);
});

test('dr change filter in op6', t => {
    let op1 = new Change('1', ['filter'], null, {colRange: [2,4], row: 2});
    let op2 = new Delete('1', 'dr', 2);
    let [a] = ExcelModel.transform(op1, op2);
    t.falsy(a.od)
});

