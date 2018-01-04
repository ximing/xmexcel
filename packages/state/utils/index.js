/**
 * Created by ximing on 12/26/17.
 */
'use strict';
import {MIN_COL, MIN_ROW} from '../constants/excel-consts';

export const generateEmptyCells = function (row = MIN_ROW, col = MIN_COL) {
    col = Math.max(col, MIN_COL);
    row = Math.max(row, MIN_ROW);
    let rowArr = [];
    for (let i = 0; i < row; i++) {
        let _col = new Array(col);
        rowArr.push(_col);
    }
    return rowArr;
};
