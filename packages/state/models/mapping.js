/**
 * Created by ximing on 12/28/17.
 */
'use strict';
import {MODEL_TYPES} from '../constants/model-types';

export class MapResult {
    constructor(range, deleted = false) {
        this.range = range;
        this.deleted = deleted;
    }

    static create(range, deleted) {
        return new MapResult(range, deleted);
    }
}


/*
* mapping = [row,col,endRow,endCol]
* */
export class Mapping {

    constructor(mapping) {
        this.mappping = mapping;
    }

    static isMapping(any) {
        return !!(any && any[MODEL_TYPES.MAPPING]);
    }

    rebase(mapping, left = true) {
    }

    static fromJSON(object) {
        if (!Mapping.isMapping(object)) {
            return new Mapping(object)
        }
        return object;
    }

}

Mapping.prototype[MODEL_TYPES.MAPPING] = true;

