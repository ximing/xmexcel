/**
 * Created by ximing on 1/19/18.
 */
'use strict';
export const convertCoor = function (key) {
    return key.split(':').map(item => parseInt(item));
};

export const inMergeCell = function (mergeCells = {}, selection) {
    console.log('inMergeCell', mergeCells, selection);
    let inRow = false, inCol = false;
    let keys = Object.keys(mergeCells);
    for (let i = 0, l = keys.length; i < l; i++) {
        let key = keys[i];
        let [row, col] = convertCoor(key);
        let cell = {
            row, col,
            rowspan: mergeCells[key].rowspan,
            colspan: mergeCells[key].colspan
        };
        if ((selection[0] >= cell.row && selection[0] < cell.row + cell.rowspan) ||
            (selection[2] >= cell.row && selection[2] < cell.row + cell.rowspan)) {
            inRow = true;
        }
        if ((selection[1] >= cell.col && selection[1] < cell.col + cell.colspan) ||
            (selection[3] >= cell.col && selection[3] < cell.col + cell.colspan)) {
            inCol = true;
        }
        if (inRow && inCol) {
            return true;
        } else {
            inCol = false;
            inRow = false;
        }
    }
    return inRow && inCol;
};

export const inFilter = function (row, col, filter) {
    if (filter && filter.colRange && row === filter.row &&
        (col >= filter.colRange[0] && col <= filter.colRange[1])) {
        return true;
    }
    return false;
};

export const trimObj = function (obj) {
    Object.keys(obj).forEach(key => {
        if (obj[key] == null) {
            delete obj[key];
        }
    });

    return Object.keys(obj).length === 0 ? null : obj;
};
