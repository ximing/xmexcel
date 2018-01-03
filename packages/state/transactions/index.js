/**
 * Created by ximing on 12/26/17.
 */
'use strict';
import debug from 'debug';

const log = debug('excel:state:transaction');

import {
    Value, AddMark, RemoveMark, ClearMark,
    SetFmt, SetFormula, SetSheetSetting,
    ChangeSelection, ChangeSheet
} from '../operations';

export default class Transaction {
    constructor(state) {
        this.before = state.doc;
        this.doc = state.doc;
        this.ops = [];
        this.schema = state.schema;
        this.selections = state.selections;
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

    removeMark(m, key) {
        this.ops.push(RemoveMark.fromJSON({m, key}));
        return this;
    }

    clearMark(m) {
        this.ops.push(ClearMark.fromJSON({m}));
        return this;
    }

    setFmt(m, fmt) {
        this.ops.push(SetFmt.fromJSON({m, fmt}));
        return this;
    }

    setFormula(m, f) {
        this.ops.push(SetFormula.fromJSON({m, f}));
        return this;
    }

    setSheetSetting(m, key, val) {
        this.ops.push(SetSheetSetting.fromJSON({m, key, val}));
        return this;
    }

    changeSelection(m) {
        this.selections[m.id] = m;
        return this;
    }

    changeSheet(id) {
        this.ops.push(ChangeSheet.fromJSON({m: {id}}));
        return this;
    }
}
