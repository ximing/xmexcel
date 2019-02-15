/**
 * Created by ximing on 1/19/18.
 */
'use strict';
import test from 'ava';
import {ExcelModel, Empty, Delete, Insert, Change} from '../src/index';

test('change', (t) => {
    let [a, b] = ExcelModel.transform(
        new Change('1', ['c', 2, 3], '2', '1'),
        new Change('1', ['c', 2, 3], '3', '4'),
    );
    t.is(JSON.stringify(a), '{"t":"c","id":"1","p":["c",2,3],"oi":"2","od":"1"}');
    t.is(JSON.stringify(b), '{"t":"e"}');
});

test('change and ic before', (t) => {
    let [a, b] = ExcelModel.transform(
        new Change('1', ['c', 2, 3], '2', '1'),
        new Insert('1', 'ic', 1, 2),
    );
    t.is(JSON.stringify(a), '{"t":"c","id":"1","p":["c",2,5],"oi":"2","od":"1"}');
    t.is(JSON.stringify(b), '{"t":"ic","id":"1","i":1,"a":2}');
});

test('change and ic after', (t) => {
    let [a, b] = ExcelModel.transform(
        new Change('1', ['c', 2, 3], '2', '1'),
        new Insert('1', 'ic', 6, 5),
    );
    t.is(JSON.stringify(a), '{"t":"c","id":"1","p":["c",2,3],"oi":"2","od":"1"}');
    t.is(JSON.stringify(b), '{"t":"ic","id":"1","i":6,"a":5}');
});

test('change and ir before', (t) => {
    let [a, b] = ExcelModel.transform(
        new Change('1', ['c', 2, 3], '2', '1'),
        new Insert('1', 'ir', 1, 2),
    );
    t.is(JSON.stringify(a), '{"t":"c","id":"1","p":["c",4,3],"oi":"2","od":"1"}');
    t.is(JSON.stringify(b), '{"t":"ir","id":"1","i":1,"a":2}');
});

test('change and ir after', (t) => {
    let [a, b] = ExcelModel.transform(
        new Change('1', ['c', 2, 3], '2', '1'),
        new Insert('1', 'ir', 6, 5),
    );
    t.is(JSON.stringify(a), '{"t":"c","id":"1","p":["c",2,3],"oi":"2","od":"1"}');
    t.is(JSON.stringify(b), '{"t":"ir","id":"1","i":6,"a":5}');
});

test('transform Empty', (t) => {
    let [a, b] = ExcelModel.transform(
        new Empty(),
        new Change('1', ['c', 2, 3], '2', '1')
    );
    t.is(JSON.stringify(a), JSON.stringify(new Empty()));
    t.is(JSON.stringify(b), JSON.stringify(new Change('1', ['c', 2, 3], '2', '1')));
});

//local: IR/IC/DR/DC
test('remote cancel mergeCells1', t => {
    let [, b] = ExcelModel.transform(
        new Insert('1', 'ir', 3, 2),
        new Change('1', ['mergeCells', '2:2'], null, {rowspan: 2, colspan: 2})
    );
    t.falsy(b.oi);
    t.is(b.p[1], '2:2');
    t.is(b.od.rowspan, 4);
});
test('remote cancel mergeCells2', t => {
    let [, b] = ExcelModel.transform(
        new Insert('1', 'ic', 3, 2),
        new Change('1', ['mergeCells', '2:2'], null, {rowspan: 2, colspan: 2})
    );
    t.falsy(b.oi);
    t.is(b.p[1], '2:2');
    t.is(b.od.colspan, 4);
});
test('remote cancel mergeCells3', t => {
    let [, b] = ExcelModel.transform(
        new Insert('1', 'dr', 3),
        new Change('1', ['mergeCells', '2:2'], null, {rowspan: 2, colspan: 2})
    );
    t.falsy(b.oi);
    t.is(b.p[1], '2:2');
    t.is(b.od.rowspan, 1);
});
test('remote cancel mergeCells4', t => {
    let [, b] = ExcelModel.transform(
        new Insert('1', 'dc', 3),
        new Change('1', ['mergeCells', '2:2'], null, {rowspan: 2, colspan: 2})
    );
    t.falsy(b.oi);
    t.is(b.p[1], '2:2');
    t.is(b.od.colspan, 1);
});


//local: IR/IC/DR/DC
test('remote cancel fixed1', t => {
    let [, b] = ExcelModel.transform(
        new Insert('1', 'ir', 1, 2),
        new Change('1', ['fixed'], null, {row: 2, col: 2})
    );
    t.falsy(b.oi);
    t.is(b.od.row, 4);
});
test('remote cancel fixed2', t => {
    let [, b] = ExcelModel.transform(
        new Insert('1', 'ic', 1, 2),
        new Change('1', ['fixed'], null, {row: 2, col: 2})
    );
    t.falsy(b.oi);
    t.is(b.od.col, 4);
});
test('remote cancel fixed3', t => {
    let [, b] = ExcelModel.transform(
        new Insert('1', 'dr', 1),
        new Change('1', ['fixed'], null, {row: 2, col: 2})
    );
    t.falsy(b.oi);
    t.is(b.od.row, 1);
});
test('remote cancel fixed4', t => {
    let [, b] = ExcelModel.transform(
        new Insert('1', 'dc', 1),
        new Change('1', ['fixed'], null, {row: 2, col: 2})
    );
    t.falsy(b.oi);
    t.is(b.od.col, 1);
});


//remote: IR/IC/DR/DC
test('local cancel mergeCells1', t => {
    let [a] = ExcelModel.transform(
        new Change('1', ['mergeCells', '2:2'], null, {rowspan: 2, colspan: 2}),
        new Insert('1', 'ir', 3, 2)
    );
    t.falsy(a.oi);
    t.is(a.p[1], '2:2');
    t.is(a.od.rowspan, 4);
});
test('local cancel mergeCells2', t => {
    let [a] = ExcelModel.transform(
        new Change('1', ['mergeCells', '2:2'], null, {rowspan: 2, colspan: 2}),
        new Insert('1', 'ic', 3, 2)
    );
    t.falsy(a.oi);
    t.is(a.p[1], '2:2');
    t.is(a.od.colspan, 4);
});
test('local cancel mergeCells3', t => {
    let [a] = ExcelModel.transform(
        new Change('1', ['mergeCells', '2:2'], null, {rowspan: 2, colspan: 2}),
        new Insert('1', 'dr', 3)
    );
    t.falsy(a.oi);
    t.is(a.p[1], '2:2');
    t.is(a.od.rowspan, 1);
});
test('local cancel mergeCells4', t => {
    let [a] = ExcelModel.transform(
        new Change('1', ['mergeCells', '2:2'], null, {rowspan: 2, colspan: 2}),
        new Insert('1', 'dc', 3)
    );
    t.falsy(a.oi);
    t.is(a.p[1], '2:2');
    t.is(a.od.colspan, 1);
});

//remote: IR/IC/DR/DC
test('local cancel fixed1', t => {
    let [a] = ExcelModel.transform(
        new Change('1', ['fixed'], null, {row: 2, col: 2}),
        new Insert('1', 'ir', 1, 2)
    );
    t.falsy(a.oi);
    t.is(a.od.row, 4);
});
test('local cancel fixed2', t => {
    let [a] = ExcelModel.transform(
        new Change('1', ['fixed'], null, {row: 2, col: 2}),
        new Insert('1', 'ic', 1, 2)
    );
    t.falsy(a.oi);
    t.is(a.od.col, 4);
});
test('local cancel fixed3', t => {
    let [a] = ExcelModel.transform(
        new Change('1', ['fixed'], null, {row: 2, col: 2}),
        new Insert('1', 'dr', 1)
    );
    t.falsy(a.oi);
    t.is(a.od.row, 1);
});
test('local cancel fixed4', t => {
    let [a] = ExcelModel.transform(
        new Change('1', ['fixed'], null, {row: 2, col: 2}),
        new Insert('1', 'dc', 1)
    );
    t.falsy(a.oi);
    t.is(a.od.col, 1);
});
