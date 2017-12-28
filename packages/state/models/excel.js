/**
 * Created by ximing on 12/26/17.
 */
'use strict';
import _ from 'lodash';

const isPlainObject = _.isPlainObject;
import MODEL_TYPES from '../constants/model-types';
import Sheet from './sheet';

/*
const DEFAULTS = {
    sheets: new Map(),
    sheetOrder: [],
    activeSheetId: "shortid1",
    meta: new Map()
};
* */

class Excel {

    constructor({sheets, sheetOrder, activeSheetId}) {
        this.sheets = sheets;
        this.sheetOrder = sheetOrder;
        this.activeSheetId = activeSheetId;
    }

    static create(attrs = {}) {
        if (Excel.isExcel(attrs)) {
            return attrs;
        }

        if (isPlainObject(attrs)) {
            return Excel.fromJSON(attrs);
        }

        throw new Error(`\`Excel.create\` only accepts objects, strings or characters, but you passed it: ${attrs}`)
    }

    static isExcel(any) {
        return !!(any && any[MODEL_TYPES.EXCEL]);
    }

    static fromJS = Excel.fromJSON;

    static fromJSON(object) {
        const {
            sheets,
            sheetOrder,
            activeSheetId
        } = object;
        let _sheets = {};
        Object.keys(sheets).forEach(key => {
            _sheets[key] = Sheet.fromJSON(sheets[key]);
        });
        const excel = new Excel({
            sheets: _sheets,
            activeSheetId: activeSheetId,
            sheetOrder: sheetOrder
        });
        return excel;
    }

    toJSON() {
        const object = {
            sheets: this.sheets,
            activeSheetId: this.activeSheetId,
            sheetOrder: this.sheetOrder
        };

        return object;
    }

    toJS() {
        return this.toJSON();
    }

    getSheet(key) {
        return this.sheets.get(key);
    }
}

Excel.prototype[MODEL_TYPES.EXCEL] = true;

export default Excel;
