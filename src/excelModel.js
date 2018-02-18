/**
 * Created by ximing on 2/15/18.
 */

'use strict';
import shortid from 'shortid';

import {Empty, Insert} from './op';
import {convertCoor} from './util';
import {HistoryStep} from './history';

/*
{
    "title":'DXExcelState',
    "type":'object',
    "properties":{
        "id": {
            "description": "",
            "type": "object",
            "properties": {
                "cells":{
                    title:"DXExcelCells",
                    "type": "object",
                    "properties": {
                        "id":{
                            title:"DXExcelCell",
                            "type": "object",
                            "properties":{
                                v:''
                            }
                        }
                    }
                },
                "name":{
                    "type": "string"
                },
                "id":{
                    "type": "string"
                },
                "fixedCol":{
                    "type": "integer",
                    "minimum": 0
                },
                "fixedRow":{
                    "type": "integer",
                    "minimum": 0
                },
                "mergeCells":[]
            }
        }
    }
}

* */
const MAX_HISTORY_COUNT = 100;

export class ExcelModel {
    constructor({state, version = 0, clientID = '', unconfirmed = [], undo = [], redo = []} = {}) {
        this.state = state;
        this._undo = undo;
        this._redo = redo;
        this.unconfirmed = unconfirmed;
        this.clientID = clientID;
        this.version = version;
    }

    static fromJSON(obj) {
        return new ExcelModel(obj);
    }

    static empty() {
        let id = shortid.generate();
        return new ExcelModel({
            state: {
                [id]: {
                    c: {},
                    name: '工作表1',
                    id: id,
                    order: 0
                }
            }
        });
    }

    apply(ops, {undo, redo} = {}) {
        if (!Array.isArray(ops)) {
            ops = [ops];
        }
        let state = this.applyOpsToState(ops);
        let step = new HistoryStep(ops);
        undo = undo ? undo : step.isEmpty() ? this._undo.slice(0) : this._undo.concat(step);
        redo = redo ? redo : [];
        undo = this.compressHistory(undo);
        return new ExcelModel({
            state,
            version: this.version,
            clientID: this.clientID,
            undo: undo, redo: redo,
            unconfirmed: this.unconfirmed.concat(ops)
        });
    }

    compressHistory(undo) {
        return undo.length > MAX_HISTORY_COUNT ? undo.slice(undo.length - MAX_HISTORY_COUNT) : undo;
    }

    applyOpsToState(ops) {
        let state = this.state;
        ops.forEach(op => {
            state = op.apply(state);
        });
        return state;
    }

    receive(ops, clientIDs) {
        this.version += ops.length;
        // Find out which prefix of the steps originated with us
        let ours = 0;
        while (ours < clientIDs.length && clientIDs[ours] === this.clientID) ++ours;
        this.unconfirmed = this.unconfirmed.slice(ours);
        ops = ours ? ops.slice(ours) : ops;

        let remoteOps = [];

        ops.forEach((op, i) => {
            let unconfirmed = [];
            let removeOp = op.clone();
            this.unconfirmed.reverse().forEach(item => {
                // console.log('unconfirmed rebase', this.unconfirmed);
                if (!Empty.isEmpty(removeOp)) {
                    let [a, b] = ExcelModel.transform(item, removeOp);
                    if (ExcelModel.trim(a)) {
                        unconfirmed = [a].concat(unconfirmed);
                    }
                    removeOp = b;
                }
            });
            if (!Empty.isEmpty(removeOp)) {
                remoteOps.push(removeOp);
            }
            this.unconfirmed = unconfirmed.filter(op => !Empty.isEmpty(op));
        });

        if (remoteOps.length > 0) {
            return {
                excelModel: new ExcelModel({
                    state: this.applyOpsToState(remoteOps),
                    version: this.version,
                    clientID: this.clientID,
                    unconfirmed: this.unconfirmed,
                    undo: this._rebaseHistory(ops, this._undo),
                    redo: this._rebaseHistory(ops, this._redo)
                }),
                removeOps: remoteOps
            };
        } else {
            return {
                excelModel: this,
                removeOps: remoteOps
            };
        }
    }

    _rebaseHistory(ops, history) {
        return history.map(step => step.rebase(ops));
    }

    undo() {
        if (this.canUndo()) {
            let step = this._undo[this._undo.length - 1].revert();
            let redo = this._redo.concat(step);
            return {
                ops: step.ops,
                undo: this._undo.slice(0, -1),
                redo: redo
            };
        }
    }

    redo() {
        if (this.canRedo()) {
            let step = this._redo[this._redo.length - 1].revert();
            let undo = this._undo.concat(step);
            return {
                ops: step.ops,
                undo: undo,
                redo: this._redo.slice(0, -1)
            };
        }
    }

    canUndo() {
        return this._undo.length > 0;
    }

    canRedo() {
        return this._redo.length > 0;
    }

    static trim(op) {
        return !Empty.isEmpty(op);
    }

    static handleIR(a, b) {
        if (a.t === 'c') {
            if (a.p[0] === 'c') {
                if (a.p[1] >= b.i) {
                    a.p[1] += b.a;
                }
            } else if (a.p[0] === 'mergeCells') {
                let [row, col] = convertCoor(a.p[1]);
                let {rowspan, colspan} = a.oi;
                if (b.i <= row) {
                    row += b.a;
                } else if (b.i > row && b.i < row + rowspan) {
                    rowspan += b.a;
                }
                a.p[1] = `${row}:${col}`;
                a.oi = {rowspan, colspan};

            } else if (a.p[0] === 'fixed') {
                let {row, col} = a.oi;
                if (row > b.i) {
                    row += b.a;
                }
                a.oi = {row, col};
            } else if (a.p[0] === 'rh') {
                if (a.p[1] >= b.i) {
                    a.p[1] += b.a;
                }
            } else if (a.p[0] === 'filter') {
                /*
                {
                    filter: {
                        row: 1,
                        colRange: [0, 5]
                    },
                    filterByValue: {
                        [colIndex]: [1, 2, 3]
                    }
                }
                * */
                if (a.oi) {
                    if (a.oi.row >= b.i) {
                        a.oi.row += b.a;
                    }
                }
            } else if (a.p[0] === 'hiddenRows') {
                if (a.oi) {
                    let oi = [];
                    a.oi.forEach(i => {
                        if (b.i <= i) {
                            oi.push(i + b.a);
                        } else {
                            oi.push(i);
                        }
                    });
                    a.oi = oi;
                }
            }
        } else if (a.t === 'dr') {
            //a dr
            //b ir
            if (a.i >= b.i + b.a) {
                /*
                * a     |
                * b [ ]
                * */
                a.i += b.a;
            } else if (a.i < b.i) {
                /*
                * a |
                * b   [   ]
                * */
                b.i -= 1;
            } else {
                /*
                * a   |
                * b [   ]
                * */
                a.i += b.a;
            }
        } else if (a.t === 'rs') {
            return [Empty.create(), b];
        }
        return [a, b];
    }

    static handleIC(a, b) {
        if (a.t === 'c') {
            if (a.p[0] === 'c') {
                if (a.p[2] >= b.i) {
                    a.p[2] += b.a;
                }
            } else if (a.p[0] === 'mergeCells') {
                let [row, col] = convertCoor(a.p[1]);
                let {rowspan, colspan} = a.oi;
                if (b.i <= col) {
                    col += b.a;
                } else if (b.i > col && b.i < col + colspan) {
                    colspan += b.a;
                }
                a.p[1] = `${row}:${col}`;
                a.oi = {rowspan, colspan};
            } else if (a.p[0] === 'fixed') {
                let {row, col} = a.oi;
                if (col > b.i) {
                    col += b.a;
                }
                a.oi = {row, col};
            } else if (a.p[0] === 'cw') {
                if (a.p[1] >= b.i) {
                    a.p[1] += b.a;
                }
            } else if (a.p[0] === 'filter') {
                /*
                {
                    filter: {
                        row: 1,
                        colRange: [0, 5]
                    },
                    filterByValue: {
                        [colIndex]: [1, 2, 3]
                    }
                }
                * */
                if (a.oi) {
                    if (b.i <= a.oi.colRange[0]) {
                        a.oi.colRange[0] += b.a;
                        a.oi.colRange[1] += b.a;
                    } else if (a.oi.colRange[0] < b.i && a.oi.colRange[1] >= b.i) {
                        a.oi.colRange[1] += b.a;
                    }
                }
            } else if (a.p[0] === 'filterByValue') {
                if (a.p[1] >= 0 && a.oi) {
                    if (b.i <= a.p[1]) {
                        a.p[1] += b.a;
                    }
                }
            }
        } else if (a.t === 'dc') {
            //a dc
            //b ic
            if (a.i >= b.i + b.a) {
                /*
                * a     |
                * b [ ]
                * */
                a.i += b.a;
            } else if (a.i < b.i) {
                /*
                * a |
                * b   [   ]
                * */
                b.i -= 1;
            } else {
                /*
                * a   |
                * b [   ]
                * */
                a.i += b.a;
            }
        } else if (a.t === 'rs') {
            return [Empty.create(), b];
        }
        return [a, b];
    }

    static handleDR(a, b) {
        if (a.t === 'c') {
            if (a.p[0] === 'c') {
                if (a.p[1] === b.i) {
                    a = Empty.create();
                } else if (a.p[1] >= b.i) {
                    a.p[1] -= 1;
                }
            } else if (a.p[0] === 'mergeCells') {
                let [row, col] = convertCoor(a.p[1]);
                let {rowspan, colspan} = a.oi;
                if (b.i < row) {
                    row -= 1;
                } else if (b.i >= row && b.i < row + rowspan) {
                    /*
                    * a [   ]
                    * b   |
                    * */
                    rowspan -= 1;
                }
                a.p[1] = `${row}:${col}`;
                a.oi = {rowspan, colspan};
            } else if (a.p[0] === 'fixed') {
                let {row, col} = a.oi;
                if (b.i < row) {
                    row -= 1;
                } else if (row === b.i) {
                    row = 0;
                }
                a.oi = {row, col};
            } else if (a.p[0] === 'rh') {
                if (a.p[1] > b.i) {
                    a.p[1] -= 1;
                } else if (a.p[1] === b.i) {
                    a = Empty.create();
                }
            } else if (a.p[0] === 'filter') {
                /*
                {
                    filter: {
                        row: 1,
                        colRange: [0, 5]
                    },
                    filterByValue: {
                        [colIndex]: [1, 2, 3]
                    }
                }
                * */
                if (a.oi) {
                    if (b.i === a.oi.colRange[0]) {
                        a.oi = null;
                    } else if (b.i < a.oi.colRange[0]) {
                        a.oi.row -= 1;
                    }
                }
            } else if (a.p[0] === 'hiddenRows') {
                if (a.oi) {
                    let oi = [];
                    a.oi.forEach(i => {
                        if (b.i < i) {
                            oi.push(i - 1);
                        } else if (b.i > i) {
                            oi.push(i);
                        }
                    });
                    a.oi = oi;
                }
            }

        } else if (a.t === 'ir') {
            //a ir
            //b dr
            if (a.i > b.i) {
                /*
                * a   [    ]
                * b |
                * */
                a.i -= 1;
            } else if (b.i >= a.i + a.a) {
                /*
                * a   [    ]
                * b           |
                * */
                b.i += a.a;
            } else {
                /*
                * a   [    ]
                * b     |
                * */
                b.i += a.a;
            }
        } else if (a.t === 'rs') {
            return [Empty.create(), b];
        }
        return [a, b];
    }

    static handleDC(a, b) {
        if (a.t === 'c') {
            if (a.p[0] === 'c') {
                if (a.p[2] === b.i) {
                    a = Empty.create();
                } else if (a.p[2] >= b.i) {
                    a.p[2] -= 1;
                }
            } else if (a.p[0] === 'mergeCells') {
                let [row, col] = convertCoor(a.p[1]);
                let {rowspan, colspan} = a.oi;
                if (b.i < col) {
                    col -= 1;
                } else if (b.i >= col && b.i < col + colspan) {
                    /*
                    * a [   ]
                    * b   |
                    * */
                    colspan -= 1;
                }
                a.p[1] = `${row}:${col}`;
                a.oi = {rowspan, colspan};
            } else if (a.p[0] === 'fixed') {
                let {row, col} = a.oi;
                if (b.i < col) {
                    col -= 1;
                } else if (col === b.i) {
                    col = 0;
                }
                a.oi = {row, col};
            } else if (a.p[0] === 'cw') {
                if (a.p[1] > b.i) {
                    a.p[1] -= 1;
                } else if (a.p[1] === b.i) {
                    a = Empty.create();
                }
            } else if (a.p[0] === 'filter') {
                /*
                {
                    filter: {
                        row: 1,
                        colRange: [0, 5]
                    },
                    filterByValue: {
                        [colIndex]: [1, 2, 3]
                    }
                }
                * */
                if (a.oi) {
                    if (b.i < a.oi.colRange[0]) {
                        a.oi.colRange[0] -= 1;
                        a.oi.colRange[1] -= 1;
                    } else if (b.i >= a.oi.colRange[0] && b.i <= a.oi.colRange[1]) {
                        a.oi.colRange[1] -= 1;
                    }
                }
            } else if (a.p[0] === 'filterByValue') {
                if (a.p[1] && a.oi) {
                    if (a.p[1] === b.i) {
                        a.oi = null;
                    }
                }
            }


        } else if (a.t === 'ic') {
            //a ic
            //b dc
            if (a.i > b.i) {
                /*
                * a   [    ]
                * b |
                * */
                a.i -= 1;
            } else if (b.i >= a.i + a.a) {
                /*
                * a   [    ]
                * b           |
                * */
                b.i += a.a;
            } else {
                /*
                * a   [    ]
                * b     |
                * */
                b.i += a.a;
            }
        } else if (a.t === 'rs') {
            return [Empty.create(), b];
        }
        return [a, b];
    }

    static handleC(a, b) {
        if (b.p[0] === 'c') {
            if (a.t === 'ic') {
                if (a.i < b.p[2]) {
                    b.p[2] += a.a;
                }
            } else if (a.t === 'ir') {
                if (a.i < b.p[1]) {
                    b.p[1] += a.a;
                }
            } else if (a.t === 'dc') {
                if (a.i + 1 <= b.p[2]) {
                    b.p[2] -= 1;
                } else if (a.i < b.p[2]) {
                    b = Empty.create();
                }
            } else if (a.t === 'dr') {
                if (a.i + 1 <= b.p[1]) {
                    b.p[1] -= 1;
                } else if (a.i < b.p[1]) {
                    b = Empty.create();
                }
            } else if (a.t === 'rs') {
                return [Empty.create(), b];
            } else if (a.t === 'c') {
                if (a.p[0] === 'c' && a.p[1] === b.p[1] && a.p[2] === b.p[2]) {
                    if (a.p[3] && b.p[3]) {
                        if (a.p[3] === b.p[3]) {
                            b = Empty.create();
                        }
                    } else if (a.p[3] || b.p[3]) {
                        if (a.p[3]) {
                            b.oi = Object.assign({}, b.oi, {[a.p[3]]: a.oi})
                        } else {
                            b = Empty.create();
                        }
                    } else {
                        b = Empty.create();
                    }
                }
            }
        } else if (b.p[0] === 'mergeCells') {
            let [row, col] = convertCoor(b.p[1]);
            let {rowspan, colspan} = b.oi;
            if (a.t === 'ic') {
                if (a.i <= col) {
                    col += a.a;
                } else if (a.i > col && a.i < col + colspan) {
                    colspan += a.a;
                }
            } else if (a.t === 'ir') {
                if (a.i <= row) {
                    row += a.a;
                } else if (a.i > row && a.i < row + rowspan) {
                    rowspan += a.a;
                }
            } else if (a.t === 'dc') {
                if (a.i >= col && a.i < col + colspan) {
                    colspan -= 1;
                } else if (a.i < col) {
                    col -= 1;
                }
            } else if (a.t === 'dr') {
                if (a.i >= row && a.i < row + rowspan) {
                    rowspan -= 1;
                } else if (a.i < row) {
                    row -= 1;
                }
            } else if (a.t === 'rs') {
                return [Empty.create(), b];
            }
            b.p[1] = `${row}:${col}`;
            b.oi = {rowspan, colspan};
        } else if (b.p[0] === 'fixed') {
            let {row, col} = b.oi;
            if (a.t === 'ic') {
                if (a.i < col) {
                    col += a.a;
                }
            } else if (a.t === 'ir') {
                if (a.i < row) {
                    row += a.a;
                }
            } else if (a.t === 'dc') {
                if (a.i === col) {
                    col = 0;
                } else if (a.i < col) {
                    col -= 1;
                }
            } else if (a.t === 'dr') {
                if (a.i === row) {
                    row = 0;
                } else if (a.i < row) {
                    row -= 1;
                }
            } else if (a.t === 'rs') {
                return [Empty.create(), b];
            }
            b.oi = {row, col};
        } else if (b.p[0] === 'rh') {
            if (a.t === 'ir') {
                if (a.i <= b.p[1]) {
                    b.p[1] += a.a;
                }
            } else if (a.t === 'dr') {
                if (a.i === b.p[1]) {
                    b = Empty.create();
                } else if (a.i < b.p[1]) {
                    b.p[1] -= 1;
                }
            } else if (a.t === 'rs') {
                return [Empty.create(), b];
            }
        } else if (b.p[0] === 'cw') {
            if (a.t === 'ic') {
                if (a.i <= b.p[1]) {
                    b.p[1] += a.a;
                }
            } else if (a.t === 'dc') {
                if (a.i === b.p[1]) {
                    b = Empty.create();
                } else if (a.i < b.p[1]) {
                    b.p[1] -= 1;
                }
            } else if (a.t === 'rs') {
                return [Empty.create(), b];
            }
        } else if (b.p[0] === 'filter') {
            /*
            {
                filter: {
                    row: 1,
                    colRange: [0, 5]
                },
                filterByValue: {
                    [colIndex]: [1, 2, 3]
                }
            }
            * */
            if (a.t === 'c') {
                if (a.p[0] === 'filter') {
                    b = Empty.create();
                }
            } else if (a.t === 'ic') {
                if (b.oi) {
                    if (a.i <= b.oi.colRange[0]) {
                        b.oi.colRange[0] += a.a;
                        b.oi.colRange[1] += a.a;
                    } else if (a.i > b.oi.colRange[0] && a.i <= b.oi.colRange[1]) {
                        b.oi.colRange[1] += a.a;
                    }
                }
            } else if (a.t === 'ir') {
                if (b.oi) {
                    if (a.i <= b.oi.row) {
                        b.oi.row += a.a;
                    }
                }
            } else if (a.t === 'dc') {
                if (b.oi) {
                    if (a.i < b.oi.colRange[0]) {
                        b.oi.colRange[0] -= 1;
                        b.oi.colRange[1] -= 1;
                    } else if (a.i >= b.oi.colRange[0] && a.i <= b.oi.colRange[1]) {
                        b.oi.colRange[1] -= 1;
                    }
                }
            } else if (a.t === 'dr') {
                if (b.oi) {
                    if (a.i < b.oi.row) {
                        b.oi.row -= 1;
                    } else if (a.i === b.oi.row) {
                        b = Empty.create();
                    }
                }
            }
        } else if (b.p[0] === 'filterByValue') {
            if (a.t === 'c' && a.p[0] === 'filterByValue') {
                b = Empty.create();
            } else if (a.t === 'ic') {
                if (b.p[1] && b.oi) {
                    if (b.p[1] <= a.i) {
                        b.p[1] += a.a;
                    }
                }
            } else if (a.t === 'dc') {
                if (b.p[1] && b.oi) {
                    if (a.i === b.p[1]) {
                        b = Empty.create();
                    }
                }
            }
        } else if (b.p[0] === 'hiddenRows') {
            if (b.oi) {
                if (a.t === 'c' && a.p[0] === 'hiddenRows') {
                    b = Empty.create();
                } else if (a.t === 'ir') {
                    if (b.oi) {
                        let oi = [];
                        b.oi.forEach(i => {
                            if (i >= a.i) {
                                oi.push(i + a.a);
                            } else {
                                oi.push(i);
                            }
                        });
                        b.oi = oi;
                    }
                } else if (a.t === 'dr') {
                    if (b.oi) {
                        let oi = [];
                        b.oi.forEach(i => {
                            if (i > a.i) {
                                oi.push(i - 1);
                            } else if (i < a.i) {
                                oi.push(i);
                            }
                        });
                        b.oi = oi;
                    }
                }
            }
        }
        return [a, b];
    }

    static transform(op1, op2) {
        let a = op1.clone(), b = op2.clone();
        if (op1.id !== op2.id) {
            return [a, b];
        }
        if (op1.t === op2.t) {
            if (op2.t === 'c') {
                if (op2.p[0] === 'c') {
                    if (op1.p[1] === op2.p[1] && op1.p[2] === op2.p[2]) {
                        if (op1.p[3] && op2[3]) {
                            if (op1.p[3] === op2[3]) {
                                b = Empty.create();
                            }
                        } else if (op1.p[3] || op2[3]) {
                            if (op1.p[3]) {
                                b.oi = Object.assign({}, b.oi, {
                                    [a.p[3]]: a.oi
                                });
                            } else {
                                b = Empty.create();
                            }
                        } else {
                            b = Empty.create();
                        }
                    }
                } else if (op2.p[0] === 'mergeCell') {
                    if (op1.p[1] === op2.p[1]) {
                        b = Empty.create();
                    }
                } else {
                    //直接覆盖的属性比如fixed
                    b = Empty.create();
                }
                return [a, b];
            } else if (op2.t === 'ir' || op2.t === 'ic') {
                if (op2.i >= op1.i) {
                    b.i += a.a;
                } else {
                    a.i += b.a;
                }
                return [a, b];
            } else if (op2.t === 'dr' || op2.t === 'dc') {
                if (op2.i > op1.i) {
                    /*
                    * a |
                    * b   |
                    * */
                    b.i -= 1;
                } else if (op2.i < op1.i) {
                    /*
                    * a     |
                    * b   |
                    * */
                    a.i -= 1;
                } else {
                    /*
                    * a   |
                    * b   |
                    * */
                    a = Empty.create();
                    b = Empty.create();
                }
                return [a, b];
            } else {
                throw new Error('无效的类型');
            }
        } else if (op2.t === 'ir') {
            return ExcelModel.handleIR(a, b);
        } else if (op2.t === 'ic') {
            return ExcelModel.handleIC(a, b);
        } else if (op2.t === 'dr') {
            return ExcelModel.handleDR(a, b);
        } else if (op2.t === 'dc') {
            return ExcelModel.handleDC(a, b);
        } else if (op2.t === 'c') {
            return ExcelModel.handleC(a, b);
        } else if (op2.t === 'as') {
            return [a, b];
        } else if (op2.t === 'rs') {
            return [a, Empty.create()];
        } else {
            throw new Error('无效的类型');
        }
    }

}
