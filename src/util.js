/**
 * Created by ximing on 1/19/18.
 */
'use strict';
export const convertCoor = function (key) {
    return key.split(':').map(item => parseInt(item));
};

export const inMergeCell = function (mergeCells = [], selection) {
    for (let i = 0, l = mergeCells.length; i < l; i++) {
        let cell = mergeCells[i];
        if (cell.row === selection[0] && cell.col === selection[1] &&
            cell.rowspan === selection[2] - selection[0] + 1 &&
            cell.colspan === selection[3] - selection[1] + 1) {
            return true;
        }
    }
    return false;
};

