/**
 * Created by ximing on 2/5/18.
 */
'use strict';
import {convertCoor} from '../util';
import {Delete} from './delete';

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
                throw new Error(`error insert type is : ${this.t}`);
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
        if (state[this.id]['rh'] && this.t === 'ir') {
            otherProps['rh'] = {};
            Object.keys(state[this.id]['rh']).forEach(key => {
                key = parseInt(key);
                if (key >= this.i) {
                    otherProps['rh'][key + this.a] = state[this.id]['rh'][key];
                } else {
                    otherProps['rh'][key] = state[this.id]['rh'][key];
                }
            });
        }
        if (state[this.id]['cw'] && this.t === 'ic') {
            otherProps['cw'] = {};
            Object.keys(state[this.id]['cw']).forEach(key => {
                key = parseInt(key);
                if (key >= this.i) {
                    otherProps['cw'][key + this.a] = state[this.id]['cw'][key];
                } else {
                    otherProps['cw'][key] = state[this.id]['cw'][key];
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
