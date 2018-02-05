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
