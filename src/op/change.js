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
            let newMeta = Object.assign({},
                state[this.id]['c'][`${this.p[1]}:${this.p[2]}`],
                {[this.p[3] || 'v']: this.oi});
            if (this.p[3]) {
                newMeta = Object.assign({},
                    state[this.id]['c'][`${this.p[1]}:${this.p[2]}`],
                    {[this.p[3]]: this.oi});
            } else {
                newMeta = Object.assign({}, this.oi);
            }
            Object.keys(newMeta).forEach(key => {
                if (newMeta[key] == null || newMeta[key] == '') {
                    delete newMeta[key];
                }
            });
            newMeta = Object.keys(newMeta).length === 0 ? null : newMeta;
            return {
                ...state, [this.id]: {
                    ...state[this.id], c: trimObj({
                        ...state[this.id]['c'],
                        [`${this.p[1]}:${this.p[2]}`]: newMeta
                    })
                }
            };
        } else if (this.p[0] === 'rh' || this.p[0] === 'cw' || this.p[0] === 'filterByValue' || this.p[0] === 'mergeCells') {
            if (this.p[1] == null) {
                return {
                    ...state,
                    [this.id]: trimObj({
                        ...state[this.id],
                        [this.p[0]]: null
                    })
                };
            } else {
                return {
                    ...state,
                    [this.id]: trimObj({
                        ...state[this.id],
                        [this.p[0]]: trimObj(Object.assign({}, state[this.id][this.p[0]], {[this.p[1]]: this.oi}))
                    })
                };
            }

        } else {
            return {
                ...state,
                [this.id]: trimObj({
                    ...state[this.id],
                    [this.p[0]]: this.oi
                })
            };
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
