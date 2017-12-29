/**
 * Created by ximing on 12/27/17.
 */
'use strict';
import _ from 'lodash';
import MODEL_TYPES from '../constants/model-types';

const isPlainObject = _.isPlainObject;
import Mark from './mark';

class CellMeta {

    constructor({marks, f, fmt}) {
        this.marks = marks;
        this.f = f;
        this.fmt = fmt;
    }

    static create(attrs = {}) {
        if (CellMeta.isCellMeta(attrs)) {
            return attrs;
        }

        if (isPlainObject(attrs)) {
            return CellMeta.fromJSON(attrs);
        }

        throw new Error(`\`CellMeta.create\` only accepts objects, strings or characters, but you passed it: ${attrs}`)
    }

    static isCellMeta(any) {
        return !!(any && any[MODEL_TYPES.CELLMeta]);
    }

    static fromJS = CellMeta.fromJSON;

    static fromJSON(object = {}) {
        const {f = null, fmt = null, marks = []} = object;
        const cell = new CellMeta({f, fmt, marks: marks.map(Mark.fromJSON)});
        return cell;
    }

    addMark(mark) {
        let i = 0;
        for (; i < this.marks.length; i++) {
            if (this.marks[i].key === mark.key) {
                break;
            }
        }
        if (i === this.marks.length) {
            this.marks.push(mark);
        } else {
            this.marks[i] = mark;
        }
    }

    removeMark(key) {
        let i = 0;
        let marks = [];
        for (; i < this.marks.length; i++) {
            if (this.marks[i].key !== key) {
                marks.push(this.marks[i]);
            }
        }
        this.marks = marks;
    }

    clearMark() {
        this.marks = [];
    }
}

CellMeta.prototype[MODEL_TYPES.CELLMeta] = true;

export default CellMeta;
