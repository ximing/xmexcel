/**
 * Created by ximing on 2/5/18.
 */
'use strict';
import {Change} from './change';
import {Delete} from './delete';
import {Insert} from './insert';

class Empty {
    constructor() {
        this.t = 'e';
    }

    revert() {
        return Empty.create();
    }

    apply(state) {
        return state;
    }

    clone(){
        return new Empty();
    }

    static create() {
        return new Empty();
    }

    static isEmpty(op) {
        return op.t === 'e';
    }
}

class AddSheet {
    constructor(id, sheet) {
        this.t = 'as';
        this.id = id;
        this.sheet = sheet;
    }

    revert() {
        return new RemoveSheet(this.id, this.sheet);
    }

    apply(state) {
        return {
            ...state, [this.id]: this.sheet
        };
    }

    clone() {
        return new AddSheet(this.id, this.sheet);
    }

    static fromJSON({id, sheet}) {
        return new AddSheet(id, sheet);
    }

    static isAddSheet(op) {
        return op.t === 'as';
    }
}

class RemoveSheet {
    constructor(id, sheet) {
        this.t = 'rs';
        this.id = id;
        this.sheet = sheet;
    }

    revert() {
        return new AddSheet(this.id, this.sheet);
    }

    apply(state) {
        let newState = {...state};
        delete newState[this.id];
        return newState;
    }

    clone() {
        return new RemoveSheet(this.id, this.sheet);
    }

    static fromJSON({id, sheet}) {
        return new RemoveSheet(id, sheet);
    }

    static isRemoveSheet(op) {
        return op.t === 'rs';
    }
}

export class Op {
    static fromJSON(obj) {
        const {t} = obj;
        if (t === 'c') {
            return Change.fromJSON(obj);
        } else if (t === 'ic' || t === 'ir') {
            return Insert.fromJSON(obj);
        } else if (t === 'dc' || t === 'dr') {
            return Delete.fromJSON(obj);
        } else if (t === 'e') {
            return Empty.create();
        } else if (t === 'as') {
            return AddSheet.fromJSON(obj);
        } else if (t === 'rs') {
            return RemoveSheet.fromJSON(obj);
        } else {
            throw new Error('错误的op类型');
        }
    }
}


export {Change, Delete, Insert, RemoveSheet, AddSheet, Empty};
