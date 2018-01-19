/**
 * Created by yeanzhi on 17/6/1.
 */
'use strict';
import test from 'ava';

import ExcelState from '../src/index';

import {defaultData} from './lib';

// test('doc', (t) => {
//     let state = ExcelState.create({
//         doc: defaultData
//     });
//     t.truthy(Doc.isDoc(state.doc));
// });
//
// test('change value', (t) => {
//     let state = ExcelState.create({
//         doc: defaultData
//     });
//     let tr = state.tr.changeValue({id: 'shortid', ranges: [[0, 0, 5, 5]]}, 1000);
//     let newState = state.apply(tr);
//     t.is(newState.doc.sheets['shortid']['cells'][1][1], 1000);
// });
