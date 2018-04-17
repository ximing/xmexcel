/**
 * Created by ximing on 2/8/18.
 */
'use strict';
import test from 'ava';

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
/*
* {
    filter: {
        row: 1,
        colRange: [0, 5]
    },
    filterByValue: {
        [colIndex]: [1, 2, 3]
    }
* }
* */
test('change filterByValue and ic', (t) => {
    let op1 = new Change('1', ['filterByValue', 1], [1, 2, 3]);
    let op2 = new Insert('1', 'ic', 0, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filterByValue and ic', (t) => {
    let op1 = new Change('1', ['filterByValue', 1], [1, 2, 3]);
    let op2 = new Insert('1', 'ic', 1, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filterByValue and ic', (t) => {
    let op1 = new Change('1', ['filterByValue', 1], [1, 2, 3]);
    let op2 = new Insert('1', 'ic', 2, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filterByValue and dc', (t) => {
    let op1 = new Change('1', ['filterByValue', 1], [1, 2, 3]);
    let op2 = new Delete('1', 'dc', 0);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filterByValue and dc', (t) => {
    let op1 = new Change('1', ['filterByValue', 1], [1, 2, 3]);
    let op2 = new Delete('1', 'dc', 1);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

test('change filterByValue and dc', (t) => {
    let op1 = new Change('1', ['filterByValue', 1], [1, 2, 3]);
    let op2 = new Delete('1', 'dc', 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    t.is(
        JSON.stringify(b.apply(op1.apply(state))),
        JSON.stringify(a.apply(op2.apply(state)))
    );
});

let state2 = {
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
        row: 4
    }
};

test('change filterByValue --> hiddenRows', t => {
    let op1 = new Change('1', ['filterByValue', 1], [1]);
    let _state = op1.apply(state2);
    t.is(_state['1'].hiddenRows.length, 1);
    t.is(JSON.stringify(_state['1'].hiddenRows), JSON.stringify([3]));

    let op2 = new Change('1', ['filterByValue', 2], [2]);
    _state = op2.apply(_state);
    t.is(_state['1'].hiddenRows.length, 2);
    t.is(JSON.stringify(_state['1'].hiddenRows), JSON.stringify([3, 2]));
});

let state3 = {
    '1': {
        c: {
            '1:1': {v: 1},
            '1:2': {v: 2},
            '1:3': {v: 30},
            '2:1': {v: 1},
            '2:2': {v: 4},
            '2:3': {v: 40}
        },
        filter: {
            colRange: [1, 3],
            row: 0
        },
        filterByValue: {
            '1': [1]
        },
        hiddenRows: [3],
        row: 4
    }
};

test('cancel filter and undo it', t => {
    let ops = [
        new Change('1', ['filterByValue'], null, {'1': [1]}),
        new Change('1', ['filter'], null, {
            colRange: [1, 3],
            row: 0
        })
    ];

    let model = new ExcelModel({
        state: state3
    });
    model = model.apply(ops);

    t.falsy(model.state[1].filter);
    t.falsy(model.state[1].filterByValue);
    t.falsy(model.state[1].hiddenRows);

    let {ops: undoOps} = model.undo();

    model = model.apply(undoOps);

    t.is(
        JSON.stringify(state3['1'].filter),
        JSON.stringify(model.state['1'].filter)
    );

    t.is(
        JSON.stringify(state3['1'].filterByValue),
        JSON.stringify(model.state['1'].filterByValue)
    );

    t.is(
        JSON.stringify(state3['1'].hiddenRows),
        JSON.stringify(model.state['1'].hiddenRows)
    );
});
