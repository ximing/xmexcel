/**
 * Created by ximing on 1/18/18.
 */
'use strict';

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
            state[this.id]['c'][`${this.p[1]}:${this.p[2]}`] = Object.assign({}, state['c'][`${this.p[1]}:${this.p[2]}`], {v: this.oi});
            return state;
        } else {
            return {};
        }
    }

    clone() {
        return new Change(this.id, this.p, this.oi, this.od);
    }
}

export class Insert {
    constructor(id, i, a) {
        this.t = 'ic';//ic ir
        this.id = id;
        this.i = i;//index
        this.a = a;//amount
    }

    revert() {
    }

    apply(state) {
    }

    clone() {
        return new Insert(this.id, this.i, this.a);
    }
}

export class Delete {
    constructor(id, i, a) {
        this.t = 'dc';//dc dr
        this.id = id;
        this.i = i;
        this.a = a;
    }

    revert() {
    }

    apply(state) {

    }

    clone() {
        return new Delete(this.id, this.i, this.a);
    }
}

export class Empty {
    constructor() {
        this.t = 'e';
    }

    static create() {
        return new Empty();
    }
}

