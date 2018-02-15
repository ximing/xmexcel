/**
 * Created by ximing on 2/15/18.
 */
'use strict';
import {ExcelModel} from './excelModel';

export class HistoryStep {
    constructor(ops) {
        if (!Array.isArray(ops)) {
            ops = [ops];
        }
        this.ops = ops;
    }

    revert() {
        return new HistoryStep(this.ops.reverse().map(op => op.revert()));
    }

    rebase(ops) {
        let _ops = this.ops;
        ops.forEach(remoteOp => {
            _ops = _ops.map(op => {
                let [a] = ExcelModel.transform(op, remoteOp);
                return a;
            });
        });
        return new HistoryStep(_ops);
    }

    clone() {
        return new HistoryStep(this.ops.map(op => op.clone()));
    }
}
