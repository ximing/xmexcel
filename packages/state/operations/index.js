/**
 * Created by ximing on 12/26/17.
 */
import {OP_NAME} from '../constants/op-consts';
import Mapping from '../models/mapping';
import OpResult from './opResult';
import CellMeta from '../models/cellMeta';
import Mark from '../models/mark';

export class Value {
    constructor({m, v}) {
        this.name = OP_NAME.VALUE;
        this.m = m;
        this.v = v;
    }

    static fromJSON(object) {
        if (!Mapping.isMapping(object.m)) {
            object.m = Mapping.create(object.m);
        }
        return new Value({m: object.m, v: object.v});
    }

    apply(doc) {
        try {
            let cells = doc.sheets[this.m.id].cells.slice(0);
            for (let i = this.m.r[0]; i <= this.m.r[2]; i++) {
                for (let j = this.m.r[1]; j <= this.m.r[3]; j++) {
                    cells[i][j] = this.v;
                }
            }
            return OpResult.ok(doc.generateNewState(`sheets/${this.m.id}/cells`, cells));
        } catch (err) {
            return OpResult.fail(`操作的值超过表格空间限制${this.toJSON()}`);
        }
    }
}

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
