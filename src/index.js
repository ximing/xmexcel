/**
 * Created by ximing on 1/18/18.
 */
'use strict';
import shortid from 'shortid';

import {Empty, Delete, Insert, Change, RemoveSheet, Op, AddSheet} from './op';

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
    constructor(state, {version = 0, clientId = 0} = {}) {
        this.state = state;
        this.undo = [];
        this.redo = [];
        this.unconfirmed = [];
        this.version = version;
    }

    static fromJSON(obj) {
        return new ExcelModel(obj);
    }

    static empty() {
        let id = shortid.generate();
        return new ExcelModel({
            [id]: {
                c: {},
                name: '工作表1',
                id: id,
                order: 0
            }
        });
    }

    apply(ops) {
        if (!Array.isArray(ops)) {
            ops = [ops];
        }
        let state = this.state;
        ops.forEach(op => {
            state = op.apply(state);
        });
        return new ExcelModel(state);
    }

    receive(ops) {
        let remoteOps = [];
        ops.forEach(op => {
            let unconfirmed = [];
            let removeOp = op;
            this.unconfirmed.reverse().forEach(item => {
                if (!Empty.isEmpty(op)) {
                    let [a, b] = ExcelModel.transform(item, op);
                    unconfirmed = ExcelModel.trim(a).concat(unconfirmed);
                    removeOp = b;
                }
            });
            remoteOps = remoteOps.concat(ExcelModel.trim(removeOp));
            this.unconfirmed = unconfirmed;
        });
        this.apply(ops);
        //rebase history
    }

    static trim(ops) {
        if (!Array.isArray(ops)) {
            ops = [ops];
        }
        return ops.filter(op => {
            return !Empty.isEmpty(op);
        });
    }

    static transform(op1, op2) {
        if (op1.id !== op2.id) {
            return [op1, op2];
        }
        let a = op1.clone(), b = op2.clone();
        if (op1.t === op2.t) {
            if (op2.t === 'c') {
                if (op2.p[0] === 'c' && op1.p[1] === op2.p[1] && op1.p[2] === op2.p[2]) {
                    b.oi = a.oi;
                    b.od = a.od;
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
            if (op1.t === 'c') {
                if (a.p[2] >= b.i) {
                    a.p[2] += b.a;
                }
            } else if (op1.t === 'dr') {
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
            } else if (op1.t === 'rs') {
                return [Empty.create(), b]
            }
            return [a, b];
        } else if (op2.t === 'ic') {
            if (op1.t === 'c') {
                if (a.p[1] >= b.i) {
                    a.p[1] += b.a;
                }
            } else if (op1.t === 'dc') {
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
            } else if (op1.t === 'rs') {
                return [Empty.create(), b]
            }
            return [a, b];
        } else if (op2.t === 'dr') {
            if (op1.t === 'c') {
                if (a.p[2] >= b.i && a.p[2] < b.i + b.a) {
                    a = Empty.create();
                } else if (a.p[2] >= b.i + b.a) {
                    a.p[2] -= b.a;
                }
            } else if (op1.t === 'ir') {
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
            } else if (op1.t === 'rs') {
                return [Empty.create(), b]
            }
            return [a, b];
        } else if (op2.t === 'dc') {
            if (op1.t === 'c') {
                if (a.p[1] >= b.i && a.p[1] < b.i + b.a) {
                    a = Empty.create();
                } else if (a.p[1] >= b.i + b.a) {
                    a.p[1] -= b.a;
                }
            } else if (op1.t === 'ic') {
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

            } else if (op1.t === 'rs') {
                return [Empty.create(), b]
            }
            return [a, b];
        } else if (op2.t === 'c') {
            if (op1.t === 'ic') {
                if (a.i < b.p[1]) {
                    b.p[1] += a.a;
                }
            } else if (op1.t === 'ir') {
                if (a.i < b.p[2]) {
                    b.p[2] += a.a;
                }
            } else if (op1.t === 'dc') {
                if (a.i + 1 <= b.p[1]) {
                    b.p[1] -= 1;
                } else if (a.i < b.p[1]) {
                    b = Empty.create();
                }
            } else if (op1.t === 'dr') {
                if (a.i + 1 <= b.p[2]) {
                    b.p[2] -= 1;
                } else if (a.i < b.p[2]) {
                    b = Empty.create();
                }
            } else if (op1.t === 'rs') {
                return [Empty.create(), b];
            }
            return [a, b];
        } else if (op2.t === 'as') {
            return [a, b];
        } else if (op2.t === 'rs') {
            return [a, Empty.create()];
        } else {
            throw new Error('无效的类型');
        }
    }
}
