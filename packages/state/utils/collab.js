/**
 * Created by ximing on 1/8/18.
 */
'use strict';
import {Selection} from '../models/selection';

/*
* left rebase right
* right -> left
* */
export const doRebase = function (lr, rr) {
    let _lr = [], _rr = [];
    return [_lr, _rr];
};


export const rebase = function (lSelection, rSelection) {
    let ls = Selection.fromJSON({...lSelection}), rs = Selection.fromJSON({...rSelection});
    for (let li = 0, ll = lSelection.ranges.length; li < ll; li++) {
        for (let ri = 0, rl = rSelection.ranges.length; ri < rl; ri++) {
            let [_lr, _rr] = doRebase(lSelection[li], rSelection[ri]);
            ls.setRange(li, _lr);
            rs.setRange(ri, _rr);
        }
    }
    return [ls, rs];
};
