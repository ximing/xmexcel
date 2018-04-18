/**
 * @Creator: eyes
 * @Date: 4/8/18
 */
'use strict';
import test from 'ava';
import {ExcelModel, Empty, Delete, Insert, Change} from '../src/index';

let state = {
    '1': {
        c: {
            '0:1': {v: 1},
            '0:2': {v: 1},
            '1:1': {v: 1},
            '1:2': {v: 1},
        }
    }
};

test('Excel.apply generate unconfirmed ops for co ops', (t) => {
    let model = ExcelModel.fromJSON({
        state
    });
    let newModel = model.apply([new Change('1', ['c', 0, 1, 'v'], 2, null), new Change('1', ['c', 1, 1, 'v'], 2, null)]);

    t.is(newModel.unconfirmed.length, 2);

    t.is(
        JSON.stringify(newModel.state),
        JSON.stringify({"1":{"c":{"0:1":{"v":2},"0:2":{"v":1},"1:1":{"v":2}, "1:2":{"v":1}},"row":200,"col":20}})
    );

    t.is(
        JSON.stringify(newModel.state),
        JSON.stringify((model.apply(newModel.unconfirmed)).state)
    );
});

test('Excel.apply do not generate unconfirmed ops for local ops', (t) => {
    let model = ExcelModel.fromJSON({
        state
    });

    let newModel = model.apply([new Change('1', ['filter'], {colRange:[1,10], row: 0}, null)]);
    t.is(newModel.unconfirmed.length, 0);

    newModel = model.apply([new Change('1', ['filterByValue'], {2: ['to', 'show']}, null)]);
    t.is(newModel.unconfirmed.length, 0);

    newModel = model.apply([new Change('1', ['hiddenRows'], [1], null)]);
    t.is(newModel.unconfirmed.length, 0);
});
