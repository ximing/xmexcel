/**
 * Created by ximing on 2/5/18.
 */
'use strict';
import {trimObj} from '../util';

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
        return new Change(this.id, this.p, this.od, this.oi);
    }

    apply(state) {
        if (this.p[0] === 'c') {
            let newMeta = Object.assign({}, state[this.id]['c'][`${this.p[1]}:${this.p[2]}`], {[this.p[3] || 'v']: this.oi});
            Object.keys(newMeta).forEach(key => {
                if (newMeta[key] == null) {
                    delete newMeta[key];
                }
            });
            return {
                ...state, [this.id]: {
                    ...state[this.id], c: {
                        ...state[this.id]['c'],
                        [`${this.p[1]}:${this.p[2]}`]: newMeta
                    }
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
            state[this.id][this.p[0]] = this.oi;
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
        return new Change(this.id, this.p.slice(), this.oi, this.od);
    }

    static fromJSON({t, id, p, oi, od}) {
        return new Change(id, p, oi, od);
    }
}
