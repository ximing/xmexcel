/**
 * Created by ximing on 2/5/18.
 */
'use strict';
import {trimObj, calcHiddenRows, convertCoor} from '../util';
import _ from 'lodash';

/*
{
    mergeCells:{
        'row:col': {rowspan: 3, colspan: 3}
    },
    filter: {
        row: 1,
        colRange: [0, 5]
    },
    filterByValue: {
        [colIndex]: [1, 2, 3]
    }
}
* */
export class Change {
    constructor(id, p, oi, od) {
        this.t = 'c';
        this.id = id;
        this.p = p;
        this.oi = oi;
        this.od = od;
    }

    revert() {
        let oi, od;
        if (this.oi && _.isObject(this.oi)) {
            oi = _.cloneDeep(this.oi);
        } else {
            oi = this.oi;
        }
        if (this.od && _.isObject(this.od)) {
            od = _.cloneDeep(this.od);
        } else {
            od = this.od;
        }
        return new Change(this.id, this.p, od, oi);
    }

    apply(state) {
        if (this.p[0] === 'c') {
            let [, _row, _col] = this.p;
            let {c, row, col} = state[this.id];

            if(!(row && col)) {
                row = 200;
                col = 20;
                Object.keys(c).forEach(item => {
                    let [r, c] = convertCoor(item);
                    row = Math.max(r + 1, row);
                    col = Math.max(c + 1, col);
                });
            }
            state[this.id].row = Math.max(row, _row + 1);
            state[this.id].col = Math.max(col, _col + 1);

            if (this.p[3]) {
                let key = this.p[3];
                let meta = state[this.id]['c'][`${this.p[1]}:${this.p[2]}`];
                if (meta) {
                    meta = {...meta};
                    if (this.oi == null || this.oi == '') {
                        delete meta[key];
                    } else {
                        meta[key] = this.oi;
                    }
                } else if (this.oi != null && this.oi != '') {
                    meta = {[key]: this.oi}
                }

                if(meta && Object.keys(meta).length){
                    state[this.id]['c'][`${this.p[1]}:${this.p[2]}`] = meta;
                } else {
                    delete state[this.id]['c'][`${this.p[1]}:${this.p[2]}`];
                }
                return state;

            } else {
                let c = state[this.id]['c'];
                if (this.oi) {
                    c[`${this.p[1]}:${this.p[2]}`] = this.oi;
                } else {
                    delete c[`${this.p[1]}:${this.p[2]}`];
                }
                state[this.id]['c'] = c;
                return state;
                // return _.assign({}, state, {
                //     [this.id]: _.assign({}, state[this.id], {c: c})
                // });
            }
        } else if (this.p[0] === 'rh' || this.p[0] === 'cw' || this.p[0] === 'mergeCells') {
            if (this.p[1] == null) {
                if (this.oi == null) {
                    delete state[this.id][this.p[0]];
                } else {
                    state[this.id][this.p[0]] = this.oi;
                }
                return state;
            } else {
                let p0 = trimObj(Object.assign({}, state[this.id][this.p[0]], {[this.p[1]]: this.oi}));
                if(p0==null){
                    delete state[this.id][this.p[0]];
                }else{
                    state[this.id][this.p[0]] = p0;
                }
                return state;
            }

        } else if(this.p[0] === 'filterByValue'){
            let sheet = state[this.id];
            if (this.p[1] == null) {
                if (this.oi == null) {
                    delete sheet[this.p[0]];
                    delete sheet['hiddenRows'];
                    return state;
                } else {
                    sheet[this.p[0]] = this.oi;
                }
            } else {
                let p0 = trimObj(Object.assign({}, sheet[this.p[0]], {[this.p[1]]: this.oi}));
                if(p0==null){
                    delete sheet[this.p[0]];
                }else{
                    sheet[this.p[0]] = p0;
                }
            }
            //calculate hiddenRows here extra.
            if(!!sheet.filter && (this.oi || this.od)) {
                let hiddenRows = calcHiddenRows(sheet);
                if(hiddenRows && hiddenRows.length){
                    sheet['hiddenRows'] = hiddenRows;
                }else{
                    delete sheet['hiddenRows'];
                }
            }
            return state;
        } else {
            if (this.oi == null) {
                delete state[this.id][this.p[0]];
            } else {
                state[this.id][this.p[0]] = this.oi;
            }
            return state;
        }
    }

    clone() {
        let oi, od;
        if (this.oi && _.isObject(this.oi)) {
            oi = _.cloneDeep(this.oi);
        } else {
            oi = this.oi;
        }
        if (this.od && _.isObject(this.od)) {
            od = _.cloneDeep(this.od);
        } else {
            od = this.od;
        }
        return new Change(this.id, this.p.slice(), oi, od);
    }

    static fromJSON({t, id, p, oi, od}) {
        return new Change(id, p, oi, od);
    }

    static isChange(op) {
        return op.t === 'c';
    }
}
