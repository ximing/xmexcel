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

    static fromJSON(object) {
        const {f, fmt, marks} = object;
        const cell = new CellMeta({f, fmt, marks: marks.map(Mark.fromJSON)});
        return cell;
    }

    toJSON() {
        const object = {
            f: this.f,
            fmt: this.fmt,
            marks: this.marks
        };

        return object;
    }

    toJS() {
        return this.toJSON();
    }
}

CellMeta.prototype[MODEL_TYPES.CELLMeta] = true;

export default CellMeta;
