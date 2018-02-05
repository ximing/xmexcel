/**
 * Created by yeanzhi on 17/6/1.
 */
'use strict';
import test from 'ava';

import {ExcelModel, Empty, Delete, Insert, Change} from '../src/index';

let state = {
    '1': {
        c: {
            '4:0': {v: 1},
            '4:1': {v: 1},
            '5:2': {v: 1}
        }
    }
};
test('change', (t) => {
    let excelModel = ExcelModel.empty();
    // t.truthy(Doc.isDoc(state.doc));
    let id = Object.keys(excelModel.state)[0];
    let change = new Change(id, ['c', 1, 2, 'v'], '1', null);
    let newModel = change.apply(excelModel.state);
    t.is(newModel[id]['c'][`1:2`]['v'], '1');
});

test('insert', (t) => {
    let insert = new Insert('1', 'ic', 1, 1);
    let newState = insert.apply(state);
    t.is(JSON.stringify(Object.keys(newState['1']['c'])), '["4:0","4:2","5:3"]');
});

test('delete', (t) => {
    let d = new Delete('1', 'dc', 1);
    let newState = d.apply(state);
    t.is(JSON.stringify(Object.keys(newState['1']['c'])), '["4:0","5:1"]');
});

test('insert and delte ', (t) => {
    //4:0 4:1 5:2 1:2 3:3 3:7
    let change = new Change('1', ['c', 1, 2, 'v'], '1', null);
    let newState = change.apply(state);
    change = new Change('1', ['c', 3, 3, 'v'], '1', null);
    newState = change.apply(newState);
    change = new Change('1', ['c', 3, 7, 'v'], '1', null);
    newState = change.apply(newState);
    let insert = new Insert('1', 'ic', 3, 1);
    newState = insert.apply(newState);
    let d = new Delete('1', 'dc', 3);
    newState = d.apply(newState);
    t.is(JSON.stringify(Object.keys(newState['1']['c'])), '["4:0","4:1","5:2","1:2","3:3","3:7"]');
    insert = new Insert('1', 'ic', 0, 1);
    newState = insert.apply(newState);
    t.is(JSON.stringify(Object.keys(newState['1']['c'])), '["4:1","4:2","5:3","1:3","3:4","3:8"]');
    insert = new Insert('1', 'ir', 0, 1);
    newState = insert.apply(newState);
    t.is(JSON.stringify(Object.keys(newState['1']['c'])), '["5:1","5:2","6:3","2:3","4:4","4:8"]');
    d = new Delete('1', 'dc', 3);
    newState = d.apply(newState);
    t.is(JSON.stringify(Object.keys(newState['1']['c'])), '["5:1","5:2","4:3","4:7"]');
});

