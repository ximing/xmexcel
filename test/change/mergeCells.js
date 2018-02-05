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

// local merge cells and remote add row/col

test('ic and merge cells', (t) => {
    let op1 = new Change('1', ['mergeCells', '2:3'], {rowspan: 2, colspan: 2});
    let op2 = new Insert('1', 'ic', 1, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('ic and merge cells', (t) => {
    let op1 = new Change('1', ['mergeCells', '2:3'], {rowspan: 2, colspan: 2});
    let op2 = new Insert('1', 'ic', 3, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('ic and merge cells', (t) => {
    let op1 = new Change('1', ['mergeCells', '2:3'], {rowspan: 2, colspan: 2});
    let op2 = new Insert('1', 'ic', 6, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


test('ir and merge cells', (t) => {
    let op1 = new Change('1', ['mergeCells', '2:3'], {rowspan: 2, colspan: 2});
    let op2 = new Insert('1', 'ir', 3, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('ir and merge cells', (t) => {
    let op1 = new Change('1', ['mergeCells', '2:3'], {rowspan: 2, colspan: 2});
    let op2 = new Insert('1', 'ir', 1, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('ir and merge cells', (t) => {
    let op1 = new Change('1', ['mergeCells', '2:3'], {rowspan: 2, colspan: 2});
    let op2 = new Insert('1', 'ir', 6, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


// local add row/col and remote merge cells


test('merge cells and ic', (t) => {
    let op2 = new Change('1', ['mergeCells', '2:3'], {rowspan: 2, colspan: 2});
    let op1 = new Insert('1', 'ic', 1, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('merge cells and ic', (t) => {
    let op2 = new Change('1', ['mergeCells', '2:3'], {rowspan: 2, colspan: 2});
    let op1 = new Insert('1', 'ic', 3, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('merge cells and ic', (t) => {
    let op2 = new Change('1', ['mergeCells', '2:3'], {rowspan: 2, colspan: 2});
    let op1 = new Insert('1', 'ic', 4, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('merge cells and ic', (t) => {
    let op2 = new Change('1', ['mergeCells', '2:3'], {rowspan: 2, colspan: 2});
    let op1 = new Insert('1', 'ic', 6, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


test('merge cells and ir', (t) => {
    let op2 = new Change('1', ['mergeCells', '2:3'], {rowspan: 2, colspan: 2});
    let op1 = new Insert('1', 'ir', 3, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('merge cells and ir', (t) => {
    let op2 = new Change('1', ['mergeCells', '2:3'], {rowspan: 2, colspan: 2});
    let op1 = new Insert('1', 'ir', 1, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('merge cells and ir', (t) => {
    let op2 = new Change('1', ['mergeCells', '2:3'], {rowspan: 2, colspan: 2});
    let op1 = new Insert('1', 'ir', 6, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


// local merge cells remote remove row/col


test('merge cells and dc', (t) => {
    let op2 = new Change('1', ['mergeCells', '2:3'], {rowspan: 2, colspan: 2});
    let op1 = new Delete('1', 'dc', 1);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('merge cells and dc', (t) => {
    let op2 = new Change('1', ['mergeCells', '2:3'], {rowspan: 2, colspan: 2});
    let op1 = new Delete('1', 'dc', 3);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('merge cells and dc', (t) => {
    let op2 = new Change('1', ['mergeCells', '2:3'], {rowspan: 2, colspan: 2});
    let op1 = new Delete('1', 'dc', 4);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('merge cells and dc', (t) => {
    let op2 = new Change('1', ['mergeCells', '2:3'], {rowspan: 2, colspan: 2});
    let op1 = new Delete('1', 'dc', 6);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


test('merge cells and dr', (t) => {
    let op2 = new Change('1', ['mergeCells', '2:3'], {rowspan: 2, colspan: 2});
    let op1 = new Delete('1', 'dr', 3);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('merge cells and dr', (t) => {
    let op2 = new Change('1', ['mergeCells', '2:3'], {rowspan: 2, colspan: 2});
    let op1 = new Delete('1', 'dr', 1);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('merge cells and dr', (t) => {
    let op2 = new Change('1', ['mergeCells', '2:3'], {rowspan: 2, colspan: 2});
    let op1 = new Delete('1', 'dr', 6);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


// local merge cells remote row/col


test('merge cells and dc', (t) => {
    let op2 = new Change('1', ['mergeCells', '2:3'], {rowspan: 2, colspan: 2});
    let op1 = new Delete('1', 'dc', 1);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('merge cells and dc', (t) => {
    let op2 = new Change('1', ['mergeCells', '2:3'], {rowspan: 2, colspan: 2});
    let op1 = new Delete('1', 'dc', 3);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
test('merge cells and ic', (t) => {
    let op2 = new Change('1', ['mergeCells', '2:3'], {rowspan: 2, colspan: 2});
    let op1 = new Delete('1', 'dc', 4);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('merge cells and dc', (t) => {
    let op2 = new Change('1', ['mergeCells', '2:3'], {rowspan: 2, colspan: 2});
    let op1 = new Delete('1', 'dc', 6);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


test('merge cells and dr', (t) => {
    let op2 = new Change('1', ['mergeCells', '2:3'], {rowspan: 2, colspan: 2});
    let op1 = new Delete('1', 'dr', 3);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('merge cells and dr', (t) => {
    let op2 = new Change('1', ['mergeCells', '2:3'], {rowspan: 2, colspan: 2});
    let op1 = new Delete('1', 'dr', 1);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('merge cells and dr', (t) => {
    let op2 = new Change('1', ['mergeCells', '2:3'], {rowspan: 2, colspan: 2});
    let op1 = new Delete('1', 'dr', 6);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});
