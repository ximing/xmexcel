/**
 * Created by ximing on 2/5/18.
 */
'use strict';
import {trimObj} from '../util';
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
                state[this.id]['c'][`${this.p[1]}:${this.p[2]}`] = meta;
                return state;
                //
                // let c = state[this.id]['c'] || {};
                // if (meta) {
                //     c = _.assign({}, state[this.id]['c'], {
                //         [`${this.p[1]}:${this.p[2]}`]: meta
                //     });
                // }
                // return _.assign({}, state, {
                //     [this.id]: _.assign({}, state[this.id], {
                //         c: c
                //     })
                // });
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
        } else if (this.p[0] === 'rh' || this.p[0] === 'cw' || this.p[0] === 'filterByValue' || this.p[0] === 'mergeCells') {
            if (this.p[1] == null) {
                if (this.oi == null) {
                    delete state[this.id][this.p[0]];
                } else {
                    state[this.id][this.p[0]] = this.oi;
                }
                return state;
                // return {
                //     ...state,
                //     [this.id]: trimObj({
                //         ...state[this.id],
                //         [this.p[0]]: null
                //     })
                // };
            } else {
                let p0 = trimObj(Object.assign({}, state[this.id][this.p[0]], {[this.p[1]]: this.oi}));
                if(p0==null){
                    delete state[this.id][this.p[0]];
                }else{
                    state[this.id][this.p[0]] = p0;
                }
                return state;
                // return {
                //     ...state,
                //     [this.id]: trimObj({
                //         ...state[this.id],
                //         [this.p[0]]: trimObj(Object.assign({}, state[this.id][this.p[0]], {[this.p[1]]: this.oi}))
                //     })
                // };
            }

        } else {
            if (this.oi == null) {
                delete state[this.id][this.p[0]];
            } else {
                state[this.id][this.p[0]] = this.oi;
            }
            return state;
            // return {
            //     ...state,
            //     [this.id]: trimObj({
            //         ...state[this.id],
            //         [this.p[0]]: this.oi
            //     })
            // };
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
