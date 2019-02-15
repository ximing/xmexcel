/**
 * @Creator: eyes
 * @Date: 4/10/18
 * ir op change filter op]
 */
'use strict';
import test from 'ava';
import {ExcelModel, Empty, Delete, Insert, Change} from '../src/index';

// --------------- filter ---------------
test('ir change filter in OP1', t => {
    let op1 = new Change('1', ['filter'], {colRange: [2,4], row: 4});
    let op2 = new Insert('1', 'ir', 2, 2);
    let [a] = ExcelModel.transform(op1, op2);
    t.is(a.oi.row, 6);
});

test('ir change filter in OP2', t => {
    let op1 = new Change('1', ['filter'], {colRange: [2,4], row: 4});
    let op2 = new Insert('1', 'ir', 8, 2);
    let [a] = ExcelModel.transform(op1, op2);
    t.is(a.oi.row, 4);
});

//od has value
test('ir change filter in OP3', t => {
    let op1 = new Change('1', ['filter'], null, {colRange: [2,4], row: 4});
    let op2 = new Insert('1', 'ir', 2, 2);
    let [a] = ExcelModel.transform(op1, op2);
    t.is(a.od.row, 6);
});

test('ir change filter in OP4', t => {
    let op1 = new Change('1', ['filter'], null, {colRange: [2,4], row: 4});
    let op2 = new Insert('1', 'ir', 8, 2);
    let [a] = ExcelModel.transform(op1, op2);
    t.is(a.od.row, 4);
});
