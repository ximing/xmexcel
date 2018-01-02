/**
 * Created by ximing on 12/26/17.
 */
'use strict';
import _ from 'lodash';
import MODEL_TYPES from '../constants/model-types';
import {generateEmptyCells} from '../utils/index';
import CellMeta from './cellMeta';

const isPlainObject = _.isPlainObject;

/*
const DEFAULTS = {
    title: '表格1',
    cells: generateEmptyCells(),
    cellMetas: {},
    selection: [0, 0, 0, 0],
    mergeCells: [],
    hiddenRows: [],
    rowsHeight: [],
    colsWidth: [],
    fixed: {
        fixedRowsTop: 0,
        fixedColumnsLeft: 0
    }
};
* */

class Sheet {

    constructor({title, cells, cellMetas, selection, setting}) {
        this.title = title;
        this.cells = cells;
        this.cellMetas = cellMetas;
        this.selection = selection;
        this.setting = setting;
    }

    static create(attrs = {}) {
        if (Sheet.isSheet(attrs)) {
            return attrs;
        }

        if (isPlainObject(attrs)) {
            return Sheet.fromJSON(attrs);
        }

        throw new Error(`\`Sheet.create\` only accepts objects, strings or characters, but you passed it: ${attrs}`)
    }

    static isSheet(any) {
        return !!(any && any[MODEL_TYPES.SHEET]);
    }

    static fromJSON(object) {
        const {
            title,
            cells = generateEmptyCells(),
            cellMetas = {},
            selection = [0, 0, 0, 0],
            setting = {}
        } = object;
        if (typeof title !== 'string') {
            throw new Error('`Sheet.fromJSON` requires a block `text` string.');
        }

        let _cellMetas = {};
        Object.keys(cellMetas).forEach(rowKey => {
            if (!_cellMetas[rowKey]) {
                _cellMetas[rowKey] = {};
            }
            Object.keys(cellMetas[rowKey]).forEach(cellKey => {
                _cellMetas[rowKey][cellKey] = CellMeta.fromJSON(cellMetas[rowKey][cellKey]);
            });
        });
        const sheet = new Sheet({
            title,
            cells,
            cellMetas: _cellMetas,
            selection,
            setting
        });
        return sheet;
    }

    toJSON() {
        const object = {
            title: this.title,
            cells: this.cells,
            cellMetas: this.cellMetas,
            selection: this.selection,
            mergeCells: this.mergeCells,
            hiddenRows: this.hiddenRows,
            rowsHeight: this.rowsHeight,
            colsWidth: this.colsWidth,
            fixed: this.fixed
        };

        return object;
    }

    toJS() {
        return this.toJSON();
    }

    getSetting(key) {
        if (key) {
            return this.setting[key];
        } else {
            return this.setting;
        }
    }

    setSetting(key, value) {
        this.setting[key] = value;
        return this.setting;
    }

    getCellMeta(row, col) {
        let rowData = this.cellMetas[row] || {};
        return rowData[col] || CellMeta.fromJSON();
    }

    changeSelection(selection) {
        this.selection = selection;
        return this.selection;
    }
}

Sheet.prototype[MODEL_TYPES.SHEET] = true;

export default Sheet;
