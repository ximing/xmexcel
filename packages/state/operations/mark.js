/**
 * Created by ximing on 12/29/17.
 */
'use strict';
import {OP_NAME} from '../constants/op-consts';
import Mapping from '../models/mapping';
import OpResult from './opResult';
import CellMeta from '../models/cellMeta';
import Mark from '../models/mark';

export class AddMark {
    constructor({m, v}) {
        this.name = OP_NAME.ADD_MARK;
        this.m = m;
        this.v = v;
    }

    static fromJSON(object) {
        object = {...object};
        if (!Mapping.isMapping(object.m)) {
            object.m = Mapping.create(object.m);
        }
        if (!Mark.isMark(object.v)) {
            object.v = Mark.fromJSON(object.v);
        }
        return new AddMark(object);
    }

    apply(doc) {
        try {
            let cellMetas = {...doc.sheets[this.m.id].cellMetas};
            for (let i = this.m.r[0]; i <= this.m.r[2]; i++) {
                if (!cellMetas[i]) {
                    cellMetas[i] = {};
                }
                for (let j = this.m.r[1]; j <= this.m.r[3]; j++) {
                    if (!cellMetas[i][j]) {
                        cellMetas[i][j] = CellMeta.fromJSON();
                    }
                    cellMetas[i][j].addMark(this.v);
                }
            }
            return OpResult.ok(doc.generateNewState(`sheets/${this.m.id}/cellMetas`, cellMetas));
        } catch (err) {
            return OpResult.fail(`操作的值超过表格空间限制${JSON.stringify(this)}`);
        }
    }
}

export class RemoveMark {
    constructor({m, key}) {
        this.name = OP_NAME.REMOVE_MARK;
        this.m = m;
        this.key = key;
    }

    static fromJSON(object) {
        object = {...object};
        if (!Mapping.isMapping(object.m)) {
            object.m = Mapping.create(object.m);
        }
        return new RemoveMark(object);
    }

    apply(doc) {
        try {
            let cellMetas = {...doc.sheets[this.m.id].cellMetas};
            for (let i = this.m.r[0]; i <= this.m.r[2]; i++) {
                if (!cellMetas[i]) {
                    cellMetas[i] = {};
                }
                for (let j = this.m.r[1]; j <= this.m.r[3]; j++) {
                    if (!cellMetas[i][j]) {
                        cellMetas[i][j] = CellMeta.fromJSON();
                    }
                    cellMetas[i][j].removeMark(this.key);
                }
            }
            return OpResult.ok(doc.generateNewState(`sheets/${this.m.id}/cellMetas`, cellMetas));
        } catch (err) {
            return OpResult.fail(`操作的值超过表格空间限制${JSON.stringify(this)}`);
        }
    }
}

export class ClearMark {
    constructor({m}) {
        this.name = OP_NAME.ClEAR_MARK;
        this.m = m;
    }

    static fromJSON(object) {
        object = {...object};
        if (!Mapping.isMapping(object.m)) {
            object.m = Mapping.create(object.m);
        }
        return new ClearMark(object);
    }

    apply(doc) {
        try {
            let cellMetas = {...doc.sheets[this.m.id].cellMetas};
            for (let i = this.m.r[0]; i <= this.m.r[2]; i++) {
                if (!cellMetas[i]) {
                    cellMetas[i] = {};
                }
                for (let j = this.m.r[1]; j <= this.m.r[3]; j++) {
                    if (!cellMetas[i][j]) {
                        cellMetas[i][j] = CellMeta.fromJSON();
                    }
                    cellMetas[i][j].clearMark();
                }
            }
            return OpResult.ok(doc.generateNewState(`sheets/${this.m.id}/cellMetas`, cellMetas));
        } catch (err) {
            return OpResult.fail(`操作的值超过表格空间限制${JSON.stringify(this)}`);
        }
    }
}

export class SetFormula {
    constructor({m, f}) {
        this.name = OP_NAME.SET_FORMULA;
        this.m = m;
        this.f = f;
    }

    static fromJSON(object) {
        object = {...object};
        if (!Mapping.isMapping(object.m)) {
            object.m = Mapping.create(object.m);
        }
        return new SetFormula(object);
    }

    apply(doc) {
        try {
            let cellMetas = {...doc.sheets[this.m.id].cellMetas};
            for (let i = this.m.r[0]; i <= this.m.r[2]; i++) {
                if (!cellMetas[i]) {
                    cellMetas[i] = {};
                }
                for (let j = this.m.r[1]; j <= this.m.r[3]; j++) {
                    if (!cellMetas[i][j]) {
                        cellMetas[i][j] = CellMeta.fromJSON();
                    }
                    cellMetas[i][j].setFormula(this.f);
                }
            }
            return OpResult.ok(doc.generateNewState(`sheets/${this.m.id}/cellMetas`, cellMetas));
        } catch (err) {
            return OpResult.fail(`操作的值超过表格空间限制${JSON.stringify(this)}`);
        }
    }
}

export class SetFmt {
    constructor({m, fmt}) {
        this.name = OP_NAME.SET_FMT;
        this.m = m;
        this.fmt = fmt;
    }

    static fromJSON(object) {
        object = {...object};
        if (!Mapping.isMapping(object.m)) {
            object.m = Mapping.create(object.m);
        }
        return new SetFmt(object);
    }

    apply(doc) {
        try {
            let cellMetas = {...doc.sheets[this.m.id].cellMetas};
            for (let i = this.m.r[0]; i <= this.m.r[2]; i++) {
                if (!cellMetas[i]) {
                    cellMetas[i] = {};
                }
                for (let j = this.m.r[1]; j <= this.m.r[3]; j++) {
                    if (!cellMetas[i][j]) {
                        cellMetas[i][j] = CellMeta.fromJSON();
                    }
                    cellMetas[i][j].setFmt(this.fmt);
                }
            }
            return OpResult.ok(doc.generateNewState(`sheets/${this.m.id}/cellMetas`, cellMetas));
        } catch (err) {
            return OpResult.fail(`操作的值超过表格空间限制${JSON.stringify(this)}`);
        }
    }
}
