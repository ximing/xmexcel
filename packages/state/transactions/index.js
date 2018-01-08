/**
 * Created by ximing on 12/26/17.
 */
'use strict';
import debug from 'debug';

const log = debug('excel:state:transaction');

import {
    Value, AddMark, RemoveMark, ClearMark,
    SetFmt, SetFormula, SetSheetSetting,
    ChangeSheet, SwitchSheet, AddSheet, RemoveSheet
} from '../operations';


export default class Transaction {
    constructor(state) {
        this.state = state;
        this.before = state.doc;
        this.doc = state.doc;
        this.ops = [];
        this.schema = state.schema;
        this.selections = state.selections;
        this.docChanged = false;
    }

    apply() {
        if (this.ops.length === 0) {
            return this.doc;
        }
        let doc = this.before;
        this.ops.forEach(op => {
            let res = op.apply(doc);
            if (res.doc) {
                if (doc !== res.doc) {
                    this.docChanged = true;
                    doc = res.doc;
                }
            } else {
                //TODO how to handle err info ?
                log(res.failed);
            }
        });
        this.doc = doc;
        return doc;
    }

    changeValue(selection, v) {
        this.ops.push(Value.fromJSON({selection, v}));
        return this;
    }

    addMark(selection, {key, val}) {
        this.ops.push(AddMark.fromJSON({selection, v: {key, val}}));
        return this;
    }

    removeMark(selection, key) {
        this.ops.push(RemoveMark.fromJSON({selection, key}));
        return this;
    }

    clearMark(selection) {
        this.ops.push(ClearMark.fromJSON({selection}));
        return this;
    }

    setFmt(selection, fmt) {
        this.ops.push(SetFmt.fromJSON({selection, fmt}));
        return this;
    }

    setFormula(selection, f) {
        this.ops.push(SetFormula.fromJSON({selection, f}));
        return this;
    }

    setSheetSetting(selection, key, val) {
        this.ops.push(SetSheetSetting.fromJSON({selection, key, val}));
        return this;
    }

    changeSelection(selection) {
        this.selections = this.selections.setSelection(selection);
        return this;
    }

    switchSheet(id) {
        this.ops.push(SwitchSheet.fromJSON({selection: {id}}));
        return this;
    }

    removeSheet(id) {
        this.ops.push();
        return this;
    }

    addSheet(title) {
        return this;
    }

    changeSheet() {
        return this;
    }
}
