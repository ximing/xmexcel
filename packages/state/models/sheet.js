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

    constructor({title, cells, cellMetas, settings}) {
        this.title = title;
        this.cells = cells;
        this.cellMetas = cellMetas;
        this.settings = settings;
    }

    static create(attrs = {}) {
        if (Sheet.isSheet(attrs)) {
            return attrs;
        }

        if (isPlainObject(attrs)) {
            return Sheet.fromJSON(attrs);
        }

        throw new Error(`\`Sheet.create\` only accepts objects, strings or characters, but you passed it: ${attrs}`);
    }

    static isSheet(any) {
        return !!(any && any[MODEL_TYPES.SHEET]);
    }

    static fromJSON(object) {
        const {
            title,
            cells = generateEmptyCells(),
            cellMetas = {},
            settings = {}
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
            settings
        });
        return sheet;
    }

    toJSON() {
        const object = {
            title: this.title,
            cells: this.cells,
            cellMetas: this.cellMetas,
            settings: this.settings
        };

        return object;
    }

    getSetting(key) {
        if (key) {
            return this.settings[key];
        } else {
            return this.settings;
        }
    }

    setSetting(key, value) {
        this.settings[key] = value;
        return this.settings;
    }

    getCellMeta(row, col) {
        let rowData = this.cellMetas[row] || {};
        return rowData[col] || CellMeta.fromJSON();
    }

    setState(state) {
        return Sheet.fromJSON({...this, ...state});
    }

    addRow(index, offset) {

    }

    removeRow(index, offset) {

    }

    addCol(index, offset) {

    }

    removeCol(index, offset) {

    }
}

Sheet.prototype[MODEL_TYPES.SHEET] = true;

export default Sheet;
