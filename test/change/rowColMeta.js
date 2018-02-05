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
