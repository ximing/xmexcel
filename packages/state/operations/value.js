/**
 * Created by ximing on 12/29/17.
 */
'use strict';
import {OP_NAME} from '../constants/op-consts';
import {Selection} from '../models/selection';
import OpResult from './opResult';

export class Value {
    constructor({selection, v}) {
        this.name = OP_NAME.VALUE;
        this.selection = selection;
        this.v = v;
    }

    static fromJSON(object) {
        if (!Selection.isSelection(object.selection)) {
            object.selection = Selection.fromJSON(object.selection);
        }
        return new Value({selection: object.selection, v: object.v});
    }

    apply(doc) {
        try {
            let cells = doc.sheets[this.selection.id].cells.slice(0);
            for (let rIndex = 0, l = this.selection.ranges.length; rIndex < l; rIndex++) {
                for (let i = this.selection.ranges[rIndex][0]; i <= this.selection.ranges[rIndex][2]; i++) {
                    for (let j = this.selection.ranges[rIndex][1]; j <= this.selection.ranges[rIndex][3]; j++) {
                        cells[i][j] = this.v;
                    }
                }
            }
            //doc.generateNewState(`sheets/${this.selection.id}/cells`, cells)
            let newSheet = doc.sheets[this.selection.id].setState({cells: cells});
            let newDoc = doc.setSheet(this.selection.id, newSheet);
            return OpResult.ok(newDoc);
        } catch (err) {
            return OpResult.fail(`操作的值超过表格空间限制${JSON.stringify(this)}`);
        }
    }

}
