/**
 * Created by ximing on 2/6/18.
 */
'use strict';
import test from "ava";

import {convertCoor, inMergeCell, splitOps, inFilter, trimObj} from '../src/util';
import {Change} from '../src';

test('convertCoor', (t) => {
    const [row, col] = convertCoor('1:1');
    t.is(row, 1);
    t.is(col, 1);
});

test('inMergeCell', (t) => {
    let isInMergeCell = inMergeCell({'1:1': {rowspan: 3, colspan: 2}}, [1, 1, 3, 3]);
    t.is(isInMergeCell, true);
});

test('util-splitOps', t => {
    let c = new Change('1', ['c', 0, 1, 'v'], 2, null),
        f = new Change('1', ['filter'], {colRange:[1,10], row: 0}, null),
        fv = new Change('1', ['filterByValue'], {2: ['to', 'show']}, null),
        h = new Change('1', ['hiddenRows'], [1], null);
    let {coOps} = splitOps([c, f, fv, h]);
    t.is(coOps.length, 1);
    t.is(coOps[0].p[0], 'c');
});

test('inFilter', t => {
    let filter1 = { colRange: [1,3], row: 1 },
        filter2 = { colRange: [1,3], row: 0 },
        filter3 = { colRange: [1,3], row: 0 };

    let check1 = inFilter(0, 2, filter1),
        check2 = inFilter(0, 4, filter2),
        check3 = inFilter(0, 3, filter3);

    t.is(check1, false);
    t.is(check2, false);
    t.is(check3, true);
});

test('trimObj', t => {
    let target = {
        props1: null,
        props2: true
    };
    t.is(Object.keys(target).length, 2);
    target = trimObj(target);
    t.is(Object.keys(target).length, 1);
});
