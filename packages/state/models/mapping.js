/**
 * Created by ximing on 12/28/17.
 */
'use strict';
import MODEL_TYPES from '../constants/model-types';

export class MapResult {
    constructor(id, r, deleted = false) {
        this.id = id;
        this.r = r;
        this.deleted = deleted;
    }

    static create(id, range, deleted) {
        return new MapResult(id, range, deleted);
    }
}


/*
* mapping = [row,col,endRow,endCol]
* */
export class Mapping {

    constructor(mapping) {
        let r = mapping.r || [0, 0, 0, 0];
        if (r[2] == null) {
            r[2] = r[0];
        }
        if (r[3] == null) {
            r[3] = r[1];
        }
        if (r[0] > r[2]) {
            let t = r[0];
            r[0] = r[2];
            r[2] = t;
        }
        if (r[1] > r[3]) {
            let t = r[1];
            r[1] = r[3];
            r[3] = t;
        }
        this.r = r.slice(0, 4);
        this.id = mapping.id;
    }

    static create(mapping) {
        if (Mapping.isMapping(mapping)) {
            return mapping;
        } else {
            return new Mapping(mapping);
        }
    }

    static isMapping(any) {
        return !!(any && any[MODEL_TYPES.MAPPING]);
    }

    /*
    * rebase op
    * */
    rebase(mapping, left = true, del = false) {
        if (del) {
            return MapResult.create(this.id, this.r, true);
        } else {
            if (left) {
                return Mapping.doRebase(this, mapping);
            } else {
                return Mapping.doRebase(mapping, this);
            }
        }
    }

    /*
    * left rebase right
    * right -> left
    * */
    static doRebase(left, right) {
        let _left, _right;
        if (left.r && right.r) {
            if (right.r[0] < left.r[0]) {
            }
            return MapResult(left.r);
        } else {
            throw new Error('rebase param error');
        }
    }

    static fromJSON(object) {
        if (!Mapping.isMapping(object)) {
            return new Mapping(object);
        }
        return object;
    }

}

Mapping.prototype[MODEL_TYPES.MAPPING] = true;

