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
        let ops = [];
        for (let i = 0; i < this.a; i++) {
            ops.push(new Delete(this.id, this.t === 'ic' ? 'dc' : 'dr', this.i + i));
        }
        return ops;
    }

    apply(state) {
        let c = Object.keys(state[this.id]['c']).reduce((obj, current) => {
            let [row, col] = convertCoor(current);
            if (this.t === 'ic') {
                if (this.i <= col) {
                    col += this.a;
                }
            } else if (this.t === 'ir') {
                if (this.i <= row) {
                    row += this.a;
                }
            } else {
                throw new Error(`error op type is : ${this.t}`)
            }
            obj[`${row}:${col}`] = state[this.id]['c'][current];
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
                let [row, col] = convertCoor(key);
                let {rowspan, colspan} = state[this.id]['mergeCells'][key];
                if (this.t === 'ir') {
                    if (row >= this.i) {
                        row += this.a;
                    } else if (this.i < rowspan + row && row < this.i) {
                        rowspan += this.a;
                    }
                }
                if (this.t === 'ic') {
                    if (col >= this.i) {
                        col += this.a;
                    } else if (this.i < rowspan + col && col < this.i) {
                        colspan += this.a;
                    }
                }
                otherProps['mergeCells'][`${row}:${col}`] = {
                    rowspan, colspan
                };
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
    constructor(id, t, i) {
        this.t = t;//dc dr
        this.id = id;
        this.i = i;
    }

    revert() {
        if (this.t === 'dc') {
            return new Insert(this.id, 'ic', this.i, 1);
        } else {
            return new Insert(this.id, 'ir', this.i, 1);
        }
    }

    apply(state) {
        let c = Object.keys(state[this.id]['c']).reduce((obj, current) => {
            let [row, col] = convertCoor(current);
            if (this.t === 'dc') {
                if (col >= this.i && col < this.i + 1) {
                    return obj;
                } else if (col >= this.i + 1) {
                    col -= 1;
                }
            } else {
                if (row >= this.i && row < this.i + 1) {
                    return obj;
                } else if (row >= this.i + 1) {
                    row -= this.a;
                }
            }
            obj[`${row}:${col}`] = state[this.id]['c'][current];
            return obj;
        }, {});
        let otherProps = {};
        if (state[this.id]['fixed']) {
            let row = state[this.id]['fixed'].row;
            let col = state[this.id]['fixed'].col;
            if (row && this.t === 'dr' && this.i < row) {
                row = Math.max(0, row - 1);
            }
            if (col && this.t === 'dc' && this.i < col) {
                col = Math.max(0, col - 1);
            }
            otherProps['fixed'] = {
                row, col
            };
        }
        if (state[this.id]['rh']) {
            otherProps['rh'] = {};
            Object.keys(state[this.id]['rh']).forEach(key => {
                if (key >= this.i) {
                    if (key - 1 >= 0) {
                        otherProps['rh'][key - 1] = state[this.id]['rh'][key];
                    }
                } else {
                    otherProps['rh'][key] = state[this.id]['rh'][key];
                }
            });
        }
        if (state[this.id]['cw']) {
            otherProps['cw'] = {};
            Object.keys(state[this.id]['cw']).forEach(key => {
                if (key >= this.i) {
                    if (key - 1 >= 0) {
                        otherProps['cw'][key - 1] = state[this.id]['cw'][key];
                    }
                } else {
                    otherProps['cw'][key] = state[this.id]['cw'][key]
                }
            });
        }
        if (state[this.id]['mergeCells']) {
            otherProps['mergeCells'] = {};
            Object.keys(state[this.id]['mergeCells']).forEach(key => {
                let [row, col] = convertCoor(key);
                let {rowspan, colspan} = state[this.id]['mergeCells'][key];
                let isDelete = false;
                if (this.t === 'dr') {
                    if (this.i + 1 <= row) {
                        row -= this.a;
                    } else if (this.i + 1 > row && this.i + 1 <= row + rowspan && this.i < y) {
                        let delta = y - this.i;
                        row -= delta;
                        rowspan -= (1 - delta);
                    } else if (this.i >= row && this.i + 1 <= row + rowspan) {
                        rowspan -= 1;
                    } else if (this.i >= row && this.i + 1 > row + rowspan && this.i < row + rowspan) {
                        let delta = row + rowspan - this.i;
                        rowspan -= delta;
                    } else if (this.i < row && this.i + 1 >= row + rowspan) {
                        isDelete = true;
                    }
                }
                if (this.t === 'dc') {
                    if (this.i + 1 <= col) {
                        col -= 1;
                    } else if (this.i + 1 > y && this.i + 1 <= col + colspan && this.i < col) {
                        let delta = col - this.i;
                        col -= delta;
                        colspan -= (1 - delta);
                    } else if (this.i >= col && this.i + 1 <= col + colspan) {
                        colspan -= 1;
                    } else if (this.i >= col && this.i + 1 > col + colspan && this.i < col + colspan) {
                        let delta = col + colspan - this.i;
                        colspan -= delta;
                    } else if (this.i < col && this.i + 1 >= col + colspan) {
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
                    otherProps['mergeCells'][`${row}:${col}`] = {
                        rowspan, colspan
                    };
                }
            });
        }
        return {...state, [this.id]: {...state[this.id], c: c, ...otherProps}};
    }

    clone() {
        return new Delete(this.id, this.t, this.i);
    }

    static fromJSON({t, id, i}) {
        return new Delete(id, t, i);
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
