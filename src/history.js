/**
 * Created by ximing on 2/15/18.
 */
'use strict';
import _ from 'lodash';
import {ExcelModel} from './excelModel';
import {Empty} from './op/index';

export class HistoryStep {
    constructor(ops) {
        if (!Array.isArray(ops)) {
            ops = [ops];
        }
        let _ops = [],
            length = ops.length;
        for (let i = 0; i < length; i++) {
            if (!Empty.isEmpty(ops[i])) {
                _ops.push(ops[i])
            }
        }
        this.ops = _ops;
    }

    revert() {
        let ops = this.ops.reverse().map(op => op.revert());
        ops = _.flatten(ops);
        return new HistoryStep(ops);
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

    isEmpty() {
        return !this.ops || this.ops.length === 0;
    }
}
