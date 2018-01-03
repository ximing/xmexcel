/**
 * Created by ximing on 12/29/17.
 */
'use strict';
import {OP_NAME} from '../constants/op-consts';
import Mapping from '../models/mapping';
import OpResult from './opResult';

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
            //doc.generateNewState(`sheets/${this.m.id}/cells`, cells)
            let newSheet = doc.sheets[this.m.id].setState({cells: cells});
            console.log('new Sheet', newSheet[0])
            let newDoc = doc.setSheet(this.m.id, newSheet);
            return OpResult.ok(newDoc);
        } catch (err) {
            return OpResult.fail(`操作的值超过表格空间限制${this.toJSON()}`);
        }
    }
}
