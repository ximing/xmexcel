/**
 * Created by ximing on 1/29/18.
 */
'use strict';
import test from 'ava';
import _ from "lodash";
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

let getState = () => {
    return _.cloneDeep(state);
};

test('change v and merge cells', (t) => {
    let op1 = new Change('1', ['c', 2, 3, 'v'], '11');
    let op2 = new Insert('1', 'ic', 1, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(getState()))),
        JSON.stringify(a.apply(op2.apply(getState())))
    );
});


test('change table cell to empty object', t => {
    let op1 = new Change('1', ['c', 4, 0, 'v'], null, {v: 1});
    let _state = op1.apply(getState());
    t.is(
        JSON.stringify(_state),
        JSON.stringify({
            '1': {
                c: {
                    '4:1': {v: 1},
                    '5:2': {v: 1}
                }
            }
        })
    );
});
