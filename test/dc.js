/**
 * @Creator: eyes
 * @Date: 4/12/18
 */
'use strict';
import test from 'ava';
import {ExcelModel, Empty, Delete, Insert, Change} from '../src/index';

let state = {
    '1': {
        c: {
            '1:1': {v: 1},
            '1:2': {v: 2},
            '1:3': {v: 30},
            '2:1': {v: 1},
            '2:2': {v: 4},
            '2:3': {v: 40}
        },
        // x x x x
        // x 1 2 30
        // x 1 4 40
        filter: {
            colRange: [1, 3],
            row: 0
        },
        filterByValue: {
            1: [1],
            2: [2]
        },
        hiddenRows: [2, 3],
        row: 4
    }
};
test('dc->hiddenRows/filter/filterByValue', t => {
    let op1 = new Delete('1', 'dc', 3);
    let _state  = op1.apply(state);
    t.is(_state['1'].hiddenRows.length, 2);
    t.is(JSON.stringify(_state['1'].hiddenRows), JSON.stringify([2,3]));

    t.is(JSON.stringify(_state['1'].filter.colRange), JSON.stringify([1,2]));

});

test('dc->hiddenRows/filter/filterByValue', t => {
    let op1 = new Delete('1', 'dc', 2);
    let _state = op1.apply(state);
    t.is(_state['1'].hiddenRows.length, 1);
    t.is(JSON.stringify(_state['1'].hiddenRows), JSON.stringify([3]));

    t.is(JSON.stringify(_state['1'].filter.colRange), JSON.stringify([1, 2]));

    t.falsy(_state['1'].filterByValue[2]);
});
