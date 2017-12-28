/**
 * Created by ximing on 12/26/17.
 */
import {OP_NAME} from '../constants/op-consts';
import Mapping from '../models/mapping';
import OpResult from './opResult';

export class Value {
    constructor({m, v}) {
        this.name = OP_NAME.VALUE;
        this.m = Mapping.create(m);
        this.v = v;
    }

    static fromJSON(object) {
        return new Value({m: object.m, v: object.v});
    }

    toJSON() {
        return JSON.stringify(this);
    }

    apply(doc) {
        try {
            let cells = doc.sheets[this.m.id].cells.slice(0);
            for (let i = this.m.r[0]; i <= this.m.r[2]; i++) {
                for (let j = this.m.r[1]; j <= this.m.r[3]; j++) {
                    cells[i][j] = this.v;
                }
            }
            let newDoc = {...doc, ...{...doc.sheets, ...{...doc.sheets[this.m.id], cells}}};
            return OpResult.ok(newDoc);
        } catch (err) {
            return OpResult.fail(`操作的值超过表格空间限制${this.toJSON()}`);
        }
    }
}

