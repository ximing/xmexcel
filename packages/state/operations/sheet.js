/**
 * Created by ximing on 12/29/17.
 */
'use strict';
import {OP_NAME} from '../constants/op-consts';
import {Mapping} from '../models/mapping';
import OpResult from './opResult';
import Sheet from '../models/sheet';

export class SetSheetSetting {
    constructor({m, key, val}) {
        this.name = OP_NAME.SET_SHEET_SETTING;
        this.m = m;
        this.key = key;
        this.val = val;
    }

    static fromJSON(object) {
        object = {...object};
        if (!Mapping.isMapping(object.m)) {
            object.m = Mapping.create(object.m);
        }
        return new SetSheetSetting(object);
    }

    apply(doc) {
        try {
            let sheet = new Sheet(doc.sheets[this.m.id]);
            sheet.setSetting(this.key, this.val);
            return OpResult.ok(doc.generateNewState(`sheets/${this.m.id}`, sheet));
        } catch (err) {
            return OpResult.fail(`操作的值超过表格空间限制${JSON.stringify(this)}`);
        }
    }
}

export class ChangeSelection {
    constructor({m}) {
        this.name = OP_NAME.CHANGE_SELECTION;
        this.m = m;
    }

    static fromJSON(object) {
        object = {...object};
        if (!Mapping.isMapping(object.m)) {
            object.m = Mapping.create(object.m);
        }
        return new ChangeSelection(object);
    }

    apply(doc) {
        try {
            let sheet = new Sheet(doc.sheets[this.m.id]);
            sheet.changeSelection(this.m.r);
            return OpResult.ok(doc.generateNewState(`sheets/${this.m.id}`, sheet));
        } catch (err) {
            return OpResult.fail(`操作的值超过表格空间限制${JSON.stringify(this)}`);
        }
    }
}

export class ChangeSheet {
    constructor({m}) {
        this.name = OP_NAME.CHANGE_SHEET;
        this.m = m;
    }

    static fromJSON(object) {
        object = {...object};
        if (!Mapping.isMapping(object.m)) {
            object.m = Mapping.create(object.m);
        }
        return new ChangeSheet(object);
    }

    apply(doc) {
        try {
            return OpResult.ok(doc.setActiveId(this.m.id));
        } catch (err) {
            return OpResult.fail(`操作的值超过表格空间限制${JSON.stringify(this)}`);
        }
    }
}
