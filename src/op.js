/**
 * Created by ximing on 1/18/18.
 */
'use strict';
import {convertCoor} from './util';

export class Change {
    constructor(id, p, oi, od) {
        this.t = 'c';
        this.id = id;
        this.p = p;
        this.oi = oi;
        this.od = od;

        // this.li = 0;
        // this.ld = '';
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
            }
        } else if (this.p[0] === 'name') {
            state[this.id][this.p[0]] = this.oi;
            return {...state, [this.id]: {...state[this.id], [this.p[0]]: this.oi}}
        }
    }

    clone() {
        return new Change(this.id, this.p, this.oi, this.od);
    }

    static fromJSON({t, id, p, oi, od}) {
        return new Change(id, p, oi, od);
    }
}

export class Insert {
    constructor(id, t, i, a) {
        this.t = t;//ic ir
        this.id = id;
        this.i = i;//index
        this.a = a;//amount
    }

    revert() {
        if (this.t === 'ic') {
            return new Delete(this.id, 'dc', this.i, this.a)
        } else {
            return new Delete(this.id, 'dr', this.i, this.a)
        }
    }

    apply(state) {
        let c = Object.keys(state[this.id]['c']).reduce((obj, current) => {
            let [x, y] = convertCoor(current);
            if (this.t === 'ic') {
                if (this.i <= x) {
                    x += +this.a;
                }
            } else {
                if (this.i <= y) {
                    y += +this.a;
                }
            }
            obj[`${x}:${y}`] = state[this.id]['c'][current];
            return obj;
        }, {});
        return {...state, [this.id]: {...state[this.id], c: c}}
    }

    clone() {
        return new Insert(this.id, this.i, this.a);
    }

    static fromJSON({t, id, i, a}) {
        return new Insert(id, t, i, a);
    }
}

export class Delete {
    constructor(id, t, i, a) {
        this.t = t;//dc dr
        this.id = id;
        this.i = i;
        this.a = a;
    }

    revert() {
        if (this.t === 'dc') {
            return new Insert(this.id, 'ic', this.i, this.a);
        } else {
            return new Insert(this.id, 'ir', this.i, this.a);
        }
    }

    apply(state) {
        let c = Object.keys(state[this.id]['c']).reduce((obj, current) => {
            let [x, y] = convertCoor(current);
            if (this.t === 'dc') {
                if (x >= this.i && x < this.i + this.a) {
                    return obj;
                } else if (x >= this.i + this.a) {
                    x -= this.a;
                }
            } else {
                if (y >= this.i && y < this.i + this.a) {
                    return obj;
                } else if (y >= this.i + this.a) {
                    y -= this.a;
                }
            }
            obj[`${x}:${y}`] = state[this.id]['c'][current];
            return obj;
        }, {});
        return {...state, [this.id]: {...state[this.id], c: c}}
    }

    clone() {
        return new Delete(this.id, this.i, this.a);
    }

    static fromJSON({t, id, i, a}) {
        return new Delete(id, t, i, a);
    }
}

export class Empty {
    constructor() {
        this.t = 'e';
    }

    apply(state) {
        return state;
    }

    static create() {
        return new Empty();
    }
}

export class Op {
    static fromJSON(obj) {
        const {t} = obj;
        if (t === 'c') {
            return Change.fromJSON(obj);
        } else if (t === 'ic' || t === 'ir') {
            return Insert.fromJSON(obj);
        } else if (t === 'dc' || t === 'dr') {
            return Delete.fromJSON(obj);
        } else if (t === 'e') {
            return Empty.create();
        } else {
            throw new Error('错误的op类型');
        }
    }
}
