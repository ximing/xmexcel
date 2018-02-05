/**
 * Created by ximing on 1/18/18.
 */

'use strict';
import shortid from 'shortid';

import {Empty, Delete, Insert, Change, RemoveSheet, Op, AddSheet} from './op';
import {convertCoor} from "./util";

export {Empty, Delete, Insert, Change, RemoveSheet, Op, AddSheet};
export {convertCoor, inMergeCell} from './util'

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

export class ExcelModel {
    constructor({state, version = 0, clientID = '', unconfirmed = []} = {}) {
        this.state = state;
        this.undo = [];
        this.redo = [];
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

    apply(ops) {
        let state = this.applyOpsToState(ops);
        return new ExcelModel({
            state,
            version: this.version,
            clientID: this.clientID,
            unconfirmed: this.unconfirmed.concat(ops)
        });
    }

    applyOpsToState(ops) {
        if (!Array.isArray(ops)) {
            ops = [ops];
        }
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
            let removeOp = op;
            this.unconfirmed.reverse().forEach(item => {
                console.log('unconfirmed rebase', this.unconfirmed);
                if (!Empty.isEmpty(removeOp)) {
                    let [a, b] = ExcelModel.transform(item, removeOp);
                    if (ExcelModel.trim(a)) {
                        unconfirmed = [a].concat(unconfirmed);
                    }
                    removeOp = b;
                }
            });
            remoteOps.push(removeOp);
            this.unconfirmed = unconfirmed;
        });

        if (remoteOps.length > 0) {
            return {
                excelModel: new ExcelModel({
                    state: this.applyOpsToState(remoteOps),
                    version: this.version,
                    clientID: this.clientID,
                    unconfirmed: this.unconfirmed
                }),
                removeOps: remoteOps
            };
        } else {
            return {
                excelModel: this,
                removeOps: remoteOps
            };
        }
        //rebase history
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
            return [Empty.create(), b]
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
            return [Empty.create(), b]
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
            return [Empty.create(), b]
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
                    col -= 1;
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
        }
        return [a, b];
    }

    static transform(op1, op2) {
        if (op1.id !== op2.id) {
            return [op1, op2];
        }
        let a = op1.clone(), b = op2.clone();
        if (op1.t === op2.t) {
            if (op2.t === 'c') {
                if (op2.p[0] === 'c') {
                    if (op1.p[1] === op2.p[1] && op1.p[2] === op2.p[2]) {
                        b = Empty.create();
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
