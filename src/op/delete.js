/**
 * Created by ximing on 2/5/18.
 */
"use strict";
import { convertCoor, calcHiddenRows } from "../util";
import { Insert } from "./insert";
import _ from "lodash";

export class Delete {
    constructor(id, t, i) {
        this.t = t; //dc dr
        this.id = id;
        this.i = i;
    }

    revert() {
        return new Insert(this.id, this.t === "dc" ? "ic" : "ir", this.i, 1);
    }

    _applyFixed(state, otherProps) {
        if (state[this.id]["fixed"]) {
            let row = state[this.id]["fixed"].row;
            let col = state[this.id]["fixed"].col;

            if (this.t === "dr") {
                if (this.i + 1 <= row) {
                    row = Math.max(0, row - 1);
                }
            }
            if (this.t === "dc") {
                if (this.i + 1 <= col) {
                    col = Math.max(0, col - 1);
                }
            }

            if (row > 0 || col > 0) {
                otherProps["fixed"] = Object.assign({}, row ? {row} : {}, col ? {col} : {});
            }
        }
    }

    _applyRh(state, otherProps) {
        if (state[this.id]["rh"]) {
            if (this.t === "dr") {
                otherProps["rh"] = {};
                Object.keys(state[this.id]["rh"]).forEach(key => {
                    key = parseInt(key);
                    if (key > this.i) {
                        if (key - 1 >= 0) {
                            otherProps["rh"][key - 1] = state[this.id]["rh"][key];
                        }
                    } else if (key === this.i) {
                        //do nothing
                    } else {
                        otherProps["rh"][key] = state[this.id]["rh"][key];
                    }
                });
                if (Object.keys(otherProps["rh"]).length === 0) {
                    delete otherProps["rh"];
                }
            } else {
                otherProps["cw"] = state[this.id]["rh"];
            }
        }
    }

    _applyCw(state, otherProps) {
        if (state[this.id]["cw"]) {
            if (this.t === "dc") {
                otherProps["cw"] = {};
                Object.keys(state[this.id]["cw"]).forEach(key => {
                    key = parseInt(key);
                    if (key > this.i) {
                        if (key - 1 >= 0) {
                            otherProps["cw"][key - 1] = state[this.id]["cw"][key];
                        }
                    } else if (key === this.i) {
                        //do nothing
                    } else {
                        otherProps["cw"][key] = state[this.id]["cw"][key];
                    }
                });
                if (Object.keys(otherProps["cw"]).length === 0) {
                    delete otherProps["cw"];
                }
            } else {
                otherProps["cw"] = state[this.id]["cw"];
            }
        }
    }

    _applyMergeCells(state, otherProps) {
        if (state[this.id]["mergeCells"]) {
            otherProps["mergeCells"] = {};

            Object.keys(state[this.id]["mergeCells"]).forEach(key => {
                let [row, col] = convertCoor(key);
                let { rowspan, colspan } = state[this.id]["mergeCells"][key];
                let isDelete = false;

                if (this.t === "dr") {
                    if (this.i < row) {
                        row -= 1;
                    } else if (this.i >= row && this.i + 1 <= row + rowspan) {
                        rowspan -= 1;
                    }
                }

                if (this.t === "dc") {
                    if (this.i < col) {
                        col -= 1;
                    } else if (this.i >= col && this.i + 1 <= col + colspan) {
                        colspan -= 1;
                    }
                }

                if (rowspan <= 0) {
                    isDelete = true;
                } else if (rowspan === 1 && colspan <= 1) {
                    isDelete = true;
                }

                if (row < 0) {
                    isDelete = true;
                }

                if (colspan <= 0) {
                    isDelete = true;
                } else if (colspan === 1 && rowspan <= 1) {
                    isDelete = true;
                }

                if (col < 0) {
                    isDelete = true;
                }

                if (!isDelete) {
                    otherProps["mergeCells"][`${row}:${col}`] = {
                        rowspan,
                        colspan
                    };
                }
            });

            if (Object.keys(otherProps["mergeCells"]).length === 0) {
                delete otherProps["mergeCells"];
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
        if (state[this.id]["filter"]) {
            otherProps["filter"] = _.cloneDeep(state[this.id]["filter"]);
            if (this.t === "dr") {
                if (parseInt(otherProps["filter"]["row"]) === parseInt(this.i)) {
                    delete otherProps["filter"];
                } else if (parseInt(this.i) < parseInt(otherProps["filter"]["row"])) {
                    otherProps["filter"]["row"] -= 1;
                }
            } else if (this.t === "dc") {
                if (parseInt(this.i) < parseInt(otherProps["filter"]["colRange"][0])) {
                    otherProps["filter"]["colRange"][0] -= 1;
                    otherProps["filter"]["colRange"][1] -= 1;
                } else if (
                    this.i >= otherProps["filter"]["colRange"][0] &&
                    this.i <= otherProps["filter"]["colRange"][1]
                ) {
                    otherProps["filter"]["colRange"][1] -= 1;
                }
            }
        }

        let fv = state[this.id]["filterByValue"];
        if (fv && !(state[this.id].filter && +state[this.id].filter.row === +this.i)) {
            if(this.t === 'dc') {
                let newFv = {};
                Object.keys(fv).forEach(col => {
                    if (col < this.i) {
                        newFv[col] = fv[col];
                    } else if (col > this.i) {
                        newFv[col - 1] = fv[col];
                    }
                });
                if (Object.keys(newFv).length > 0) {
                    otherProps["filterByValue"] = newFv;
                }
            }else{
                otherProps["filterByValue"] = fv;
            }
        }
    }

    _applyHiddenRows(state, otherProps) {
        let s = state[this.id];

        if(this.t === "dr" && s.filter && s.filter.row === this.i){
            otherProps["hiddenRows"] = [];
        } else if (this.t === "dr" && s["hiddenRows"]) {
            otherProps["hiddenRows"] = [];
            s["hiddenRows"].forEach(i => {
                if (i < this.i) {
                    otherProps["hiddenRows"].push(i);
                } else if (i > this.i) {
                    otherProps["hiddenRows"].push(i - 1);
                }
            });
            if (otherProps["hiddenRows"].length === 0) {
                delete otherProps["hiddenRows"];
            }
        } else if (this.t === 'dc' && !!s.filterByValue) {
            let _cols = Object.keys(s.filterByValue).map(Number);
            //if filterByValue include the delete col, re-calculate the hiddenRows
            if(_cols.includes(this.i)){
                otherProps["hiddenRows"] = calcHiddenRows(s, this.i);
            } else {
                otherProps["hiddenRows"] = [].concat(s.hiddenRows);
            }
        }
    }

    _applyMaxCoord(state, otherProps){
        let {c: cells, row: _row, col: _col} = state[this.id];
        let row = _row || 200,
            col = _col || 20;

        if(!(_row && _col)) {
            Object.keys(cells).forEach(item => {
                let [r, c] = convertCoor(item);
                row = Math.max(r + 1, row);
                col = Math.max(c + 1, col);
            });
        }

        if(this.t === 'dr') {
            otherProps.row = row - 1;
            otherProps.col = col;
        } else if(this.t === 'dc') {
            otherProps.row = row;
            otherProps.col = col - 1;
        }
    }

    apply(state) {
        let c = Object.keys(state[this.id]["c"]).reduce((obj, current) => {
            let [row, col] = convertCoor(current);
            if (this.t === "dc") {
                if (col >= this.i && col < this.i + 1) {
                    return obj;
                } else if (col >= this.i + 1) {
                    col -= 1;
                }
            } else if (this.t === "dr") {
                if (row >= this.i && row < this.i + 1) {
                    return obj;
                } else if (row >= this.i + 1) {
                    row -= 1;
                }
            } else {
                throw new Error(`error remove type is : ${this.t}`);
            }
            obj[`${row}:${col}`] = state[this.id]["c"][current];
            return obj;
        }, {});
        let otherProps = {};

        this._applyFixed(state, otherProps);
        this._applyRh(state, otherProps);
        this._applyCw(state, otherProps);
        this._applyMergeCells(state, otherProps);
        this._applyFilter(state, otherProps);
        this._applyHiddenRows(state, otherProps);
        this._applyMaxCoord(state, otherProps);

        let newSheetState = { ...state[this.id] };
        delete newSheetState["mergeCells"];
        delete newSheetState["cw"];
        delete newSheetState["rh"];
        delete newSheetState["fixed"];
        delete newSheetState["filter"];
        delete newSheetState["filterByValue"];
        delete newSheetState["hiddenRows"];
        delete newSheetState["row"];
        delete newSheetState["col"];
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

    static fromJSON({ t, id, i }) {
        return new Delete(id, t, i);
    }

    static isDelete(op) {
        return op.t === "dc" || op.t === "dr";
    }
}
