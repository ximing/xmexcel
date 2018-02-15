/**
 * Created by ximing on 2/15/18.
 */
'use strict';

export class HistoryStep {
    constructor(ops) {
        if (!Array.isArray(ops)) {
            ops = [ops];
        }
        this.ops = ops;
    }

    revert() {
        return new HistoryStep(this.ops.reverse().map(op => op.revert()))
    }

    rebase(ops) {
        this.ops.map(op => {

        })
    }

    clone() {
        return new HistoryStep(this.ops.map(op => op.clone()));
    }
}