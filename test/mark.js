/**
 * Created by ximing on 12/29/17.
 */
'use strict';
import test from 'ava';

import ExcelState from '../packages/state';
import Excel from '../packages/state/models/excel';
import {defaultData} from './lib';

let state = ExcelState.create({
    doc: defaultData
});
test('change mark', (t) => {
    let tr = state.tr.addMark({id: 'shortid', r: [2, 2, 2, 2]}, {key: 'b', val: true});
    let newState = state.apply(tr);
    t.is(newState.doc.sheets['shortid']['cellMetas'][2][2].marks.find(i => i.key === 'b').val, true);

    tr = newState.tr.removeMark({id: 'shortid', r: [2, 2, 2, 2]}, 'b');
    newState = newState.apply(tr);
    t.is(newState.doc.sheets['shortid']['cellMetas'][2][2].marks.find(i => i.key === 'b'), void 0);
});

test('clear mark', (t) => {
    let tr = state.tr.addMark({id: 'shortid', r: [2, 2, 2, 2]}, {key: 'b', val: true});
    let newState = state.apply(tr);

    tr = newState.tr.clearMark({id: 'shortid', r: [2, 2, 2, 2]});
    newState = newState.apply(tr);
    t.is(newState.doc.sheets['shortid']['cellMetas'][2][2].marks.length, 0);
});

test('test fmt', (t) => {
    let tr = state.tr.setFmt({id: 'shortid', r: [2, 2, 2, 2]}, '0,000');
    let newState = state.apply(tr);
    t.is(newState.doc.sheets['shortid']['cellMetas'][2][2].fmt, '0,000');
});

test('test formula', (t) => {
    let tr = state.tr.setFormula({id: 'shortid', r: [2, 2, 2, 2]}, 'abs(1)');
    let newState = state.apply(tr);
    t.is(newState.doc.sheets['shortid']['cellMetas'][2][2].f, 'abs(1)');
});
