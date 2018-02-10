/**
 * Created by ximing on 2/5/18.
 */
'use strict';
import {convertCoor} from '../util';
import {Insert} from './insert';
import _ from 'lodash';

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

    _applyFixed(state, otherProps) {
        if (state[this.id]['fixed']) {
            let row = state[this.id]['fixed'].row;
            let col = state[this.id]['fixed'].col;
            if (this.t === 'dr') {
                if (this.i < row) {
                    row = Math.max(0, row - 1);
                } else if (this.i === row) {
                    row = 0;
                }
            }
            if (this.t === 'dc') {
                if (this.i < col) {
                    col = Math.max(0, col - 1);
                } else if (this.i === col) {
                    col = 0;
                }
            }
            if (row > 0 || col > 0) {
                otherProps['fixed'] = {
                    row, col
                };
            }
        }
    }

    _applyRh(state, otherProps) {
        if (state[this.id]['rh'] && this.t === 'dr') {
            otherProps['rh'] = {};
            Object.keys(state[this.id]['rh']).forEach(key => {
                key = parseInt(key);
                if (key > this.i) {
                    if (key - 1 >= 0) {
                        otherProps['rh'][key - 1] = state[this.id]['rh'][key];
                    }
                } else if (key === this.i) {
                    //do nothing
                } else {
                    otherProps['rh'][key] = state[this.id]['rh'][key];
                }
            });
            if (Object.keys(otherProps['rh']).length === 0) {
                delete otherProps['rh'];
            }
        }
    }

    _applyCw(state, otherProps) {
        if (state[this.id]['cw'] && this.t === 'dc') {
            otherProps['cw'] = {};
            Object.keys(state[this.id]['cw']).forEach(key => {
                key = parseInt(key);
                if (key > this.i) {
                    if (key - 1 >= 0) {
                        otherProps['cw'][key - 1] = state[this.id]['cw'][key];
                    }
                } else if (key === this.i) {
                    //do nothing
                } else {
                    otherProps['cw'][key] = state[this.id]['cw'][key];
                }
            });
            if (Object.keys(otherProps['cw']).length === 0) {
                delete otherProps['cw'];
            }
        }
    }

    _applyMergeCells(state, otherProps) {
        if (state[this.id]['mergeCells']) {
            otherProps['mergeCells'] = {};
            Object.keys(state[this.id]['mergeCells']).forEach(key => {
                let [row, col] = convertCoor(key);
                let {rowspan, colspan} = state[this.id]['mergeCells'][key];
                let isDelete = false;
                if (this.t === 'dr') {
                    if (this.i < row) {
                        row -= 1;
                    } else if (this.i + 1 > row && this.i + 1 <= row + rowspan && this.i < row) {
                        let delta = row - this.i;
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
                    if (this.i < col) {
                        col -= 1;
                    } else if (this.i + 1 > col && this.i + 1 <= col + colspan && this.i < col) {
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
            if (Object.keys(otherProps['mergeCells']).length === 0) {
                delete otherProps['mergeCells'];
            }
        }
    }

    /*
    * {
    *   filter: {
            row: 1,
            colRange: [0, 5]
        },
        filterByValue: {
            [colIndex]: [1, 2, 3]
        }
    * }
    * */
    _applyFilter(state, otherProps) {
        if (state[this.id]['filter']) {
            otherProps['filter'] = _.cloneDeep(state[this.id]['filter']);
            if (this.t === 'dr') {
                if (parseInt(otherProps['filter']['row']) === parseInt(this.i)) {
                    delete otherProps['filter'];
                } else if (parseInt(this.i) < parseInt(otherProps['filter']['row'])) {
                    otherProps['filter']['row'] -= 1;
                }
            } else if (this.t === 'dc') {
                if (parseInt(this.i) < parseInt(otherProps['filter']['colRange'][0])) {
                    otherProps['filter']['colRange'][0] -= 1;
                    otherProps['filter']['colRange'][1] -= 1;
                } else if (this.i >= otherProps['filter']['colRange'][0] && this.i <= otherProps['filter']['colRange'][1]) {
                    otherProps['filter']['colRange'][1] -= 1;
                }
            }
        }
        if (state[this.id]['filterByValue']) {
            otherProps['filterByValue'] = _.cloneDeep(state[this.id]['filterByValue']);
            if (this.t === 'dc' && otherProps['filterByValue'][this.i]) {
                delete otherProps['filterByValue'][this.i];
            }
            if (Object.keys(otherProps['filterByValue']).length === 0) {
                delete otherProps['filterByValue'];
            }
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
            } else if (this.t === 'dr') {
                if (row >= this.i && row < this.i + 1) {
                    return obj;
                } else if (row >= this.i + 1) {
                    row -= 1;
                }
            } else {
                throw new Error(`error remove type is : ${this.t}`);
            }
            obj[`${row}:${col}`] = state[this.id]['c'][current];
            return obj;
        }, {});
        let otherProps = {};

        this._applyFixed(state, otherProps);
        this._applyRh(state, otherProps);
        this._applyCw(state, otherProps);
        this._applyMergeCells(state, otherProps);
        this._applyFilter(state, otherProps);

        let newSheetState = {...state[this.id]};
        delete newSheetState['mergeCells'];
        delete newSheetState['cw'];
        delete newSheetState['rh'];
        delete newSheetState['fixed'];
        delete newSheetState['filter'];
        delete newSheetState['filterByValue'];

        return {
            ...state,
            [this.id]: {
                ...newSheetState,
                c: c,
                ...otherProps
            }
        };
    }

    clone() {
        return new Delete(this.id, this.t, this.i);
    }

    static fromJSON({t, id, i}) {
        return new Delete(id, t, i);
    }
}
