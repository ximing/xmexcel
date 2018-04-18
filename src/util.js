/**
 * Created by ximing on 1/19/18.
 */
'use strict';
export const convertCoor = function (key) {
    return key.split(':').map(item => parseInt(item));
};

export const inMergeCell = function (mergeCells = {}, selection) {
    // console.log('inMergeCell', mergeCells, selection);
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

        if (
            (selection[0] <= cell.row && selection[2] >= cell.row + cell.rowspan) ||
            (selection[0] >= cell.row && selection[0] < cell.row + cell.rowspan) ||
            (selection[2] >= cell.row && selection[2] < cell.row + cell.rowspan)
        ) {
            inRow = true;
        }
        if (
            (selection[1] <= cell.col && selection[3] >= cell.col + cell.colspan) ||
            (selection[1] >= cell.col && selection[1] < cell.col + cell.colspan) ||
            (selection[3] >= cell.col && selection[3] < cell.col + cell.colspan)
        ) {
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

//divide collaboration ops with local ops
export const splitOps = ops => {
    let check = _ => !!_.p && !!_.p[0] && ~['filter', 'filterByValue', 'hiddenRows'].indexOf(_.p[0]);
    return {
        // localOps: ops.filter( _ => check(_)),
        coOps: ops.filter( _ => !check(_))
    };
};

export const getDataAtCol = (c, col, row) => {
    let data = new Array(row).fill(''),
        keys = Object.keys(c);

    for (let key of keys) {
        if (key.endsWith(`:${col}`) && !!c[key] && (!!c[key].v || c[key].v === 0)) {
            let row = convertCoor(key)[0];
            data[row] = c[key].v;
        }
    }
    //['value','','',3,'']
    return data;
};

export const calcHiddenRows = (sheet, dc = -1) => {
    let {row, c, filter, filterByValue = {}} = sheet;
    let cols = Object.keys(filterByValue);
    let hiddenRows = [];

    if(!row) {
        row = 200;
        Object.keys(c).forEach(item => {
            let [r] = convertCoor(item);
            row = Math.max(r + 1, row);
        });
    }

    for (let col of cols) {
        if (Number(col) !== Number(dc)) {
            let colData = getDataAtCol(c, col, row);
            let _hide = [], _filter = filterByValue[col];

            for (let v = filter.row + 1, len = colData.length; v < len; v++) {
                if (!_filter.includes(colData[v])) {
                    _hide.push(v);
                }
            }
            hiddenRows = hiddenRows.concat(_hide);
        }
    }
    return [...new Set(hiddenRows)];
};
