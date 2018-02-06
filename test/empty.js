/**
 * Created by ximing on 2/6/18.
 */
'use strict';
import test from 'ava';
import {ExcelModel, Empty, Delete, Insert, Change} from '../src/index';

test('empty', (t) => {
    const empty = Empty.create();
    t.is(Empty.isEmpty(empty), true)
});
