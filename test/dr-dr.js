/**
 * Created by ximing on 1/29/18.
 */
'use strict';

import test from 'ava';
import {ExcelModel, Empty, Delete, Insert, Change} from '../src/index';
import {c} from './lib/cellsData';

let state = {
    '1': {
        c: c
    }
};
test('dr and dr1', (t) => {
    let op1 = new Delete('1', 'dr', 3);
    let op2 = new Delete('1', 'dr', 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('dr and dr2', (t) => {
    let op1 = new Delete('1', 'dr', 3);
    let op2 = new Delete('1', 'dr', 3);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


test('dr and dr3', (t) => {
    let op1 = new Delete('1', 'dr', 0);
    let op2 = new Delete('1', 'dr', 3);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});


test('dr and dr4', (t) => {
    let op1 = new Delete('1', 'dr', 0);
    let op2 = new Delete('1', 'dr', 0);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('delete multiple rows', (t) => {
    let model = ExcelModel.fromJSON({
        state: {
            '1': {
                c: {
                    '0:1': {v: 1},
                    '0:2': {v: 1},
                    '1:3': {v: 1},
                    '1:4': {v: 1},
                    '2:5': {v: 1},
                    '3:6': {v: 1},
                    '2:7': {v: 1}
                }
            }
        }
    });
    let model1 = model.apply([new Delete('1', 'dr', 0), new Delete('1', 'dr', 0)]);
    t.is(
        JSON.stringify(model1.state),
        JSON.stringify({"1":{"c":{"0:5":{"v":1},"1:6":{"v":1},"0:7":{"v":1}}, row: 198, col: 20}})
    )
});
