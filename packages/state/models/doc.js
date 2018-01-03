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

class Doc {

    constructor({sheets, sheetOrder, activeSheetId}) {
        this.sheets = sheets;
        this.sheetOrder = sheetOrder;
        this.activeSheetId = activeSheetId;
    }

    static create(attrs = {}) {
        if (Doc.isDoc(attrs)) {
            return attrs;
        }

        if (isPlainObject(attrs)) {
            return Doc.fromJSON(attrs);
        }

        throw new Error(`\`Doc.create\` only accepts objects, strings or characters, but you passed it: ${attrs}`)
    }

    static isDoc(any) {
        return !!(any && any[MODEL_TYPES.DOC]);
    }

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
        const doc = new Doc({
            sheets: _sheets,
            activeSheetId: activeSheetId,
            sheetOrder: sheetOrder
        });
        return doc;
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

    generateNewState(path, value) {
        let newValue = value;
        let pathArr = path.split('/');
        let targetValue = this;
        for (let i = pathArr.length - 1; i > 0; i--) {
            let keys = pathArr.slice(0, i);
            for (let j = 0; j < keys.length; j++) {
                targetValue = targetValue[keys[j]];
            }
            newValue = {...targetValue, [pathArr[i]]: newValue};
            targetValue = this;
        }
        //TODO 这里会重新生成一个state ，需要做差量化的类似  immutable的 生成器
        return Doc.fromJSON({...this, sheets: newValue});
    }

    getActiveData() {
        return this.getActiveSheet().cells;
    }

    getActiveCellMeta(row, col) {
        return this.getActiveSheet().getCellMeta(row, col);
    }

    getActiveSheet() {
        return this.sheets[this.activeSheetId];
    }

    getActiveId() {
        return this.activeSheetId;
    }

    setActiveId(id) {
        let newState = {...this, activeSheetId: id};
        return Doc.fromJSON(newState);
    }

    setState(state) {
        return Doc.fromJSON({...this, ...state});
    }

    setSheet(_id, sheet) {
        return Doc.fromJSON({
            ...this,
            ...{
                ...this.sheets,
                _id: sheet
            }
        });
    }

}

Doc.prototype[MODEL_TYPES.DOC] = true;

export default Doc;
