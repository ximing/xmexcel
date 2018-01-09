/**
 * Created by ximing on 1/9/18.
 */
'use strict';
import {OP_NAME} from '../constants/op-consts';
import OpResult from './opResult';

export class AddRow {
    constructor({id, index, offset}) {
        this.name = OP_NAME.ADD_ROW;

    }

    static fromJSON(obj) {

    }

    apply() {
    }
}


export class AddCol {
    constructor({id, index, offset}) {
        this.name = OP_NAME.ADD_COL;

    }

    static fromJSON(obj) {

    }

    apply() {
    }
}


export class RemoveRow {
    constructor({id, index, offset}) {
        this.name = OP_NAME.REMOVE_ROW;

    }

    static fromJSON(obj) {

    }

    apply() {
    }
}


export class RemoveCol {
    constructor({id, index, offset}) {
        this.name = OP_NAME.REMOVE_COL;

    }

    static fromJSON(obj) {

    }

    apply() {
    }
}


