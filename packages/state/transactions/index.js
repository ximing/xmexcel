/**
 * Created by ximing on 12/26/17.
 */
'use strict';
import debug from 'debug';

const log = debug('excel:state:transaction');

import {Value} from '../operations';

export default class Transaction {
    constructor(state) {
        this.before = state.doc;
        this.ops = [];
    }

    apply() {
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
        });ss
        this.doc = doc;
        return doc;
    }

    changeValue() {
        this.ops.push(new Value({}));
    }
}
