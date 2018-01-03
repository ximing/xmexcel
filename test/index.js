/**
 * Created by yeanzhi on 17/6/1.
 */
'use strict';
import test from 'ava';

import ExcelState from '../packages/state';
import Doc from '../packages/state/models/doc';
import {defaultData} from './lib';

test('change value', (t) => {
    let state = ExcelState.create({
        doc: defaultData
    });
    t.truthy(Doc.isDoc(state.doc));
    let tr = state.tr.changeValue({id: 'shortid', r: [0, 0, 5, 5]}, 1000);
    let newState = state.apply(tr);
    // console.log(newState.doc.sheets['shortid']['cells'][0])
    t.is(newState.doc.sheets['shortid']['cells'][1][1], 1000);
});
