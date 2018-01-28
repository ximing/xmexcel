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
        } else {
            state[this.id][this.p[0]] = this.oi;
            return {...state, [this.id]: {...state[this.id], [this.p[0]]: this.oi}}
        }
    }

    clone() {
        return new Change(this.id, this.p.slice(), this.oi, this.od);
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
                    x += this.a;
                }
            } else {
                if (this.i <= y) {
                    y += this.a;
                }
            }
            obj[`${x}:${y}`] = state[this.id]['c'][current];
            return obj;
        }, {});
        let otherProps = {};
        if (state[this.id]['fixed']) {
            let row = state[this.id]['fixed'].row;
            let col = state[this.id]['fixed'].col;
            if (row && this.t === 'ir' && this.i < row) {
                row += this.a;
            }
            if (col && this.t === 'ic' && this.i < col) {
                col += this.a;
            }
            otherProps['fixed'] = {
                row, col
            };
        }
        if (state[this.id]['rh']) {
            otherProps['rh'] = {};
            Object.keys(state[this.id]['rh']).forEach(key => {
                if (key >= this.i) {
                    otherProps['rh'][key + this.a] = state[this.id]['rh'][key];
                } else {
                    otherProps['rh'][key] = state[this.id]['rh'][key]
                }
            });
        }
        if (state[this.id]['cw']) {
            otherProps['cw'] = {};
            Object.keys(state[this.id]['cw']).forEach(key => {
                if (key >= this.i) {
                    otherProps['cw'][key + this.a] = state[this.id]['cw'][key];
                } else {
                    otherProps['cw'][key] = state[this.id]['cw'][key]
                }
            });
        }
        if (state[this.id]['mergeCells']) {
            otherProps['mergeCells'] = {};
            Object.keys(state[this.id]['mergeCells']).forEach(key => {
                let [x, y] = convertCoor(key);
                let {rowspan, colspan} = state[this.id]['mergeCells'][key];
                if (this.t === 'ir') {
                    if (y >= this.i) {
                        y += this.a;
                    } else if (this.i < rowspan + y && y < this.i) {
                        rowspan += this.a;
                    }
                }
                if (this.t === 'ic') {
                    if (x >= this.i) {
                        x += this.a;
                    } else if (this.i < rowspan + x && x < this.i) {
                        colspan += this.a;
                    }
                }
                otherProps['mergeCells'][`${x}:${y}`] = {
                    rowspan, colspan
                }
            });
        }
        return {...state, [this.id]: {...state[this.id], c: c, ...otherProps}};
    }

    clone() {
        return new Insert(this.id, this.t, this.i, this.a);
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
        let otherProps = {};
        if (state[this.id]['fixed']) {
            let row = state[this.id]['fixed'].row;
            let col = state[this.id]['fixed'].col;
            if (row && this.t === 'dr' && this.i < row) {
                row = Math.max(0, row - this.a);
            }
            if (col && this.t === 'dc' && this.i < col) {
                col = Math.max(0, col - this.a);
            }
            otherProps['fixed'] = {
                row, col
            };
        }
        if (state[this.id]['rh']) {
            otherProps['rh'] = {};
            Object.keys(state[this.id]['rh']).forEach(key => {
                if (key >= this.i) {
                    if (key - this.a >= 0) {
                        otherProps['rh'][key - this.a] = state[this.id]['rh'][key];
                    }
                } else {
                    otherProps['rh'][key] = state[this.id]['rh'][key]
                }
            });
        }
        if (state[this.id]['cw']) {
            otherProps['cw'] = {};
            Object.keys(state[this.id]['cw']).forEach(key => {
                if (key >= this.i) {
                    if (key - this.a >= 0) {
                        otherProps['cw'][key - this.a] = state[this.id]['cw'][key];
                    }
                } else {
                    otherProps['cw'][key] = state[this.id]['cw'][key]
                }
            });
        }
        if (state[this.id]['mergeCells']) {
            otherProps['mergeCells'] = {};
            Object.keys(state[this.id]['mergeCells']).forEach(key => {
                let [x, y] = convertCoor(key);
                let {rowspan, colspan} = state[this.id]['mergeCells'][key];
                let isDelete = false;
                if (this.t === 'dr') {
                    if (this.i + this.a <= y) {
                        y -= this.a;
                    } else if (this.i + this.a > y && this.i + this.a <= y + rowspan && this.i < y) {
                        let delta = y - this.i;
                        y -= delta;
                        rowspan -= (this.a - delta);
                    } else if (this.i >= y && this.i + this.a <= y + rowspan) {
                        rowspan -= this.a;
                    } else if (this.i >= y && this.i + this.a > y + rowspan && this.i < y + rowspan) {
                        let delta = y + rowspan - this.i;
                        rowspan -= delta;
                    } else if (this.i < y && this.i + this.a >= y + rowspan) {
                        isDelete = true;
                    }
                }
                if (this.t === 'dc') {
                    if (this.i + this.a <= x) {
                        x -= this.a;
                    } else if (this.i + this.a > y && this.i + this.a <= x + colspan && this.i < x) {
                        let delta = x - this.i;
                        x -= delta;
                        colspan -= (this.a - delta);
                    } else if (this.i >= x && this.i + this.a <= x + colspan) {
                        colspan -= this.a;
                    } else if (this.i >= x && this.i + this.a > x + colspan && this.i < x + colspan) {
                        let delta = x + colspan - this.i;
                        colspan -= delta;
                    } else if (this.i < x && this.i + this.a >= x + colspan) {
                        isDelete = true;
                    }
                }

                if (rowspan <= 0) {
                    isDelete = true;
                } else if (rowspan === 1 && colspan <= 1) {
                    isDelete = true;
                }

                if (colspan <= 0) {
                    isDelete = true;
                } else if (colspan === 1 && rowspan <= 1) {
                    isDelete = true;
                }

                if (!isDelete) {
                    otherProps['mergeCells'][`${x}:${y}`] = {
                        rowspan, colspan
                    }
                }

            });
        }
        return {...state, [this.id]: {...state[this.id], c: c, ...otherProps}}
    }

    clone() {
        return new Delete(this.id, this.t, this.i, this.a);
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

    static isEmpty(op) {
        return op.t === 'e';
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
        } else if (t === 'as') {
            return AddSheet.fromJSON(obj);
        } else if (t === 'rs') {
            return RemoveSheet.fromJSON(obj);
        } else {
            throw new Error('错误的op类型');
        }
    }
}

export class AddSheet {
    constructor(id, sheet) {
        this.t = 'as';
        this.id = id;
        this.sheet = sheet;
    }

    revert() {
        return new RemoveSheet(this.id, this.sheet);
    }

    apply(state) {
        return {
            ...state, [this.id]: this.sheet
        }
    }

    clone() {
        return new AddSheet(this.id, this.sheet);
    }

    static fromJSON({id, sheet}) {
        return new AddSheet(id, sheet);
    }
}

export class RemoveSheet {
    constructor(id, sheet) {
        this.t = 'rs';
        this.id = id;
        this.sheet = sheet;
    }

    revert() {
        return new AddSheet(this.id, this.sheet);
    }

    apply(state) {
        let newState = {...state};
        delete newState[this.id];
        return newState;
    }

    clone() {
        return new RemoveSheet(this.id, this.sheet);
    }

    static fromJSON({id, sheet}) {
        return new RemoveSheet(id, sheet);
    }
}
