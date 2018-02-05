/**
 * Created by ximing on 2/5/18.
 */
'use strict';

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
            return {
                ...state, [this.id]: {
                    ...state[this.id], c: {
                        ...state[this.id]['c'],
                        [`${this.p[1]}:${this.p[2]}`]: Object.assign({}, state[this.id]['c'][`${this.p[1]}:${this.p[2]}`], {[this.p[3] || 'v']: this.oi})
                    }
                }
            };
        } else if (this.p[0] === 'mergeCells') {
            return {
                ...state,
                [this.id]: {
                    ...state[this.id],
                    'mergeCells': Object.assign({}, state[this.id]['mergeCells'], {[this.p[1]]: this.oi})
                }
            };
        } else if (this.p[0] === 'rh' || this.p[0] === 'cw') {
            return {
                ...state,
                [this.id]: {
                    ...state[this.id],
                    [this.p[0]]: Object.assign({}, state[this.id][this.p[0]], {[this.p[1]]: this.oi})
                }
            };
        } else {
            state[this.id][this.p[0]] = this.oi;
            return {...state, [this.id]: {...state[this.id], [this.p[0]]: this.oi}};
        }
    }

    clone() {
        return new Change(this.id, this.p.slice(), this.oi, this.od);
    }

    static fromJSON({t, id, p, oi, od}) {
        return new Change(id, p, oi, od);
    }
}
