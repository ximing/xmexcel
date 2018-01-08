/**
 * Created by ximing on 12/29/17.
 */
'use strict';
import {OP_NAME} from '../constants/op-consts';
import {Selection} from '../models/selection';
import OpResult from './opResult';
import CellMeta from '../models/cellMeta';
import Mark from '../models/mark';

export class AddMark {
    constructor({selection, v}) {
        this.name = OP_NAME.ADD_MARK;
        this.selection = selection;
        this.v = v;
    }

    static fromJSON(object) {
        object = {...object};
        if (!Selection.isSelection(object.selection)) {
            object.selection = Selection.fromJSON(object.selection);
        }
        if (!Mark.isMark(object.v)) {
            object.v = Mark.fromJSON(object.v);
        }
        return new AddMark(object);
    }

    apply(doc) {
        try {
            let cellMetas = {...doc.sheets[this.selection.id].cellMetas};
            for (let rIndex = 0, l = this.selection.ranges.length; rIndex < l; rIndex++) {
                for (let i = this.selection.ranges[rIndex][0]; i <= this.selection.ranges[rIndex][2]; i++) {
                    if (!cellMetas[i]) {
                        cellMetas[i] = {};
                    }
                    for (let j = this.selection.ranges[rIndex][1]; j <= this.selection.ranges[rIndex][3]; j++) {
                        if (!cellMetas[i][j]) {
                            cellMetas[i][j] = CellMeta.fromJSON();
                        }
                        cellMetas[i][j].addMark(this.v);
                    }
                }
            }

            return OpResult.ok(doc.generateNewState(`sheets/${this.selection.id}/cellMetas`, cellMetas));
        } catch (err) {
            return OpResult.fail(`操作的值超过表格空间限制${JSON.stringify(this)}`);
        }
    }

    rebase() {

    }
}

export class RemoveMark {
    constructor({selection, key}) {
        this.name = OP_NAME.REMOVE_MARK;
        this.selection = selection;
        this.key = key;
    }

    static fromJSON(object) {
        object = {...object};
        if (!Selection.isSelection(object.selection)) {
            object.selection = Selection.create(object.selection);
        }
        return new RemoveMark(object);
    }

    apply(doc) {
        try {
            let cellMetas = {...doc.sheets[this.selection.id].cellMetas};
            for (let rIndex = 0, l = this.selection.ranges.length; rIndex < l; rIndex++) {
                for (let i = this.selection.ranges[rIndex][0]; i <= this.selection.ranges[rIndex][2]; i++) {
                    if (!cellMetas[i]) {
                        cellMetas[i] = {};
                    }
                    for (let j = this.selection.ranges[rIndex][1]; j <= this.selection.ranges[rIndex][3]; j++) {
                        if (!cellMetas[i][j]) {
                            cellMetas[i][j] = CellMeta.fromJSON();
                        }
                        cellMetas[i][j].removeMark(this.key);
                    }
                }
            }
            return OpResult.ok(doc.generateNewState(`sheets/${this.selection.id}/cellMetas`, cellMetas));
        } catch (err) {
            return OpResult.fail(`操作的值超过表格空间限制${JSON.stringify(this)}`);
        }
    }
}

export class ClearMark {
    constructor({selection}) {
        this.name = OP_NAME.ClEAR_MARK;
        this.selection = selection;
    }

    static fromJSON(object) {
        object = {...object};
        if (!Selection.isSelection(object.selection)) {
            object.selection = Selection.create(object.selection);
        }
        return new ClearMark(object);
    }

    apply(doc) {
        try {
            let cellMetas = {...doc.sheets[this.selection.id].cellMetas};
            for (let rIndex = 0, l = this.selection.ranges.length; rIndex < l; rIndex++) {
                for (let i = this.selection.ranges[rIndex][0]; i <= this.selection.ranges[rIndex][2]; i++) {
                    if (!cellMetas[i]) {
                        cellMetas[i] = {};
                    }
                    for (let j = this.selection.ranges[rIndex][1]; j <= this.selection.ranges[rIndex][3]; j++) {
                        if (!cellMetas[i][j]) {
                            cellMetas[i][j] = CellMeta.fromJSON();
                        }
                        cellMetas[i][j].clearMark();
                    }
                }
            }
            return OpResult.ok(doc.generateNewState(`sheets/${this.selection.id}/cellMetas`, cellMetas));
        }

        catch (err) {
            return OpResult.fail(`操作的值超过表格空间限制${JSON.stringify(this)}`);
        }
    }
}

export class SetFormula {
    constructor({selection, f}) {
        this.name = OP_NAME.SET_FORMULA;
        this.selection = selection;
        this.f = f;
    }

    static fromJSON(object) {
        object = {...object};
        if (!Selection.isSelection(object.selection)) {
            object.selection = Selection.create(object.selection);
        }
        return new SetFormula(object);
    }

    apply(doc) {
        try {
            let cellMetas = {...doc.sheets[this.selection.id].cellMetas};
            for (let rIndex = 0, l = this.selection.ranges.length; rIndex < l; rIndex++) {
                for (let i = this.selection.ranges[rIndex][0]; i <= this.selection.ranges[rIndex][2]; i++) {
                    if (!cellMetas[i]) {
                        cellMetas[i] = {};
                    }
                    for (let j = this.selection.ranges[rIndex][1]; j <= this.selection.ranges[rIndex][3]; j++) {
                        if (!cellMetas[i][j]) {
                            cellMetas[i][j] = CellMeta.fromJSON();
                        }
                        cellMetas[i][j].setFormula(this.f);
                    }
                }
            }
            return OpResult.ok(doc.generateNewState(`sheets/${this.selection.id}/cellMetas`, cellMetas));
        } catch (err) {
            return OpResult.fail(`操作的值超过表格空间限制${JSON.stringify(this)}`);
        }
    }
}

export class SetFmt {
    constructor({selection, fmt}) {
        this.name = OP_NAME.SET_FMT;
        this.selection = selection;
        this.fmt = fmt;
    }

    static fromJSON(object) {
        object = {...object};
        if (!Selection.isSelection(object.selection)) {
            object.selection = Selection.create(object.selection);
        }
        return new SetFmt(object);
    }

    apply(doc) {
        try {
            let cellMetas = {...doc.sheets[this.selection.id].cellMetas};
            for (let rIndex = 0, l = this.selection.ranges.length; rIndex < l; rIndex++) {
                for (let i = this.selection.ranges[rIndex][0]; i <= this.selection.ranges[rIndex][2]; i++) {
                    if (!cellMetas[i]) {
                        cellMetas[i] = {};
                    }
                    for (let j = this.selection.ranges[rIndex][1]; j <= this.selection.ranges[rIndex][3]; j++) {
                        if (!cellMetas[i][j]) {
                            cellMetas[i][j] = CellMeta.fromJSON();
                        }
                        cellMetas[i][j].setFmt(this.fmt);
                    }
                }
            }
            return OpResult.ok(doc.generateNewState(`sheets/${this.selection.id}/cellMetas`, cellMetas));
        } catch (err) {
            return OpResult.fail(`操作的值超过表格空间限制${JSON.stringify(this)}`);
        }
    }
}
