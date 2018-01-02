/**
 * Created by ximing on 12/29/17.
 */
'use strict';
import test from 'ava';

import ExcelState from '../packages/state';
import {defaultData} from './lib';

let state = ExcelState.create({
    doc: defaultData
});


test('change sheet setting', (t) => {
    let tr = state.tr.setSheetSetting({id: 'shortid'}, 'mergeCells', [[5, 5, 7, 7]]);
    let newState = state.apply(tr);
    t.is(
        JSON.stringify(newState.doc.sheets['shortid']['setting']['mergeCells'], null, 0),
        JSON.stringify([[5, 5, 7, 7]], null, 0)
    );
});

test('change sheet selection', (t) => {
    let tr = state.tr.changeSelection({id: 'shortid', r: [3, 3, 3, 3]});
    let newState = state.apply(tr);
    t.is(
        JSON.stringify(newState.doc.sheets['shortid']['selection'], null, 0),
        JSON.stringify([3, 3, 3, 3], null, 0)
    );
});
