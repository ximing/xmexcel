/**
 * Created by ximing on 1/8/18.
 */
'use strict';
import MODEL_TYPES from '../constants/model-types';

export class Selection {
    constructor({id, ranges}) {
        this.id = id;
        this.ranges = ranges;
    }

    static normalize(range) {
        let r = range || [0, 0, 0, 0];
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
        return r;
    }

    static isSelection(any) {
        return !!(any && any[MODEL_TYPES.SELECTION]);
    }

    static fromJSON(object) {
        if (!Selection.isSelection(object)) {
            return new Selection(object);
        }
        return object;
    }

    static create(selection) {
        return Selection.fromJSON(selection);
    }

    addRange(r) {
        this.ranges = this.ranges.concat(Selection.normalize(r));
    }

    setRange(ranges) {
        this.ranges = ranges;
    }

    removeAllRanges() {
        this.ranges = [];
    }

}

Selection.prototype[MODEL_TYPES.SELECTION] = true;
