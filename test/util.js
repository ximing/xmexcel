/**
 * Created by ximing on 2/6/18.
 */
'use strict';
import test from "ava";

import {convertCoor, inMergeCell} from '../src/util';

test('convertCoor', (t) => {
    const [row, col] = convertCoor('1:1');
    t.is(row, 1);
    t.is(col, 1);
});

test('inMergeCell', (t) => {
    let isInMergeCell = inMergeCell([{row: 1, col: 1, rowspan: 3, colspan: 2}], [1, 1, 3, 3]);
    t.is(isInMergeCell, true);
});
