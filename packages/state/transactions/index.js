/**
 * Created by ximing on 12/26/17.
 */
'use strict';
import debug from 'debug';
import shortid from 'shortid';

const log = debug('excel:state:transaction');

import {Value, AddMark} from '../operations';

export default class Transaction {
    constructor(state) {
        this.before = state.doc;
        this.ops = [];
        this.schema = state.schema;
        this.objectId = shortid.generate();
    }

    apply(state) {
        if (this.ops.length === 0) {
            return this.doc;
        }
        let doc = this.before;
        this.ops.forEach(op => {
            let res = op.apply(doc);
            if (res.doc) {
                doc = res.doc;
            } else {
                log(res.failed);
            }
        });
        this.doc = doc;
        return doc;
    }

    changeValue(m, v) {
        this.ops.push(Value.fromJSON({m, v}));
        return this;
    }

    addMark(m, {key, val}) {
        this.ops.push(AddMark.fromJSON({m, v: {key, val}}));
        return this;
    }

    removeMark(m, v) {
        return this;
    }

    toggleMark(m, v) {
        return this;
    }

}
