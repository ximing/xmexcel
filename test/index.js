/**
 * Created by yeanzhi on 17/6/1.
 */
'use strict';
import test from 'ava';

import ExcelState from '../packages/state';
import Excel from '../packages/state/models/excel';
import {defaultData} from './lib';

test('change value', (t) => {
    let state = ExcelState.create({
        doc: defaultData
    });
    t.truthy(Excel.isExcel(state.doc));
    let tr = state.tr.changeValue({id: 'shortid', r: [2, 2, 5, 5]}, 1000);
    let newState = state.apply(tr);
    t.is(newState.doc.sheets['shortid']['cells'][3][3], 1000);
});

test('change mark', (t) => {
    let state = ExcelState.create({
        doc: defaultData
    });
    let tr = state.tr.addMark({id: 'shortid', r: [2, 2, 2, 2]}, {key: 'b', val: true});
    let newState = state.apply(tr);
    t.is(newState.doc.sheets['shortid']['cellMetas'][2][2].marks.find(i=>i.key==='b').val,true);
});
