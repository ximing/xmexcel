/**
 * Created by ximing on 12/29/17.
 */
'use strict';
import {OP_NAME} from '../constants/op-consts';
import {Selection} from '../models/selection';
import OpResult from './opResult';
import Sheet from '../models/sheet';

export class SetSheetSetting {
    constructor({selection, key, val}) {
        this.name = OP_NAME.SET_SHEET_SETTING;
        this.selection = selection;
        this.key = key;
        this.val = val;
    }

    static fromJSON(object) {
        object = {...object};
        if (!Selection.isSelection(object.selection)) {
            object.selection = Selection.create(object.selection);
        }
        return new SetSheetSetting(object);
    }

    apply(doc) {
        try {
            let sheet = new Sheet(doc.sheets[this.selection.id]);
            sheet.setSetting(this.key, this.val);
            return OpResult.ok(doc.generateNewState(`sheets/${this.selection.id}`, sheet));
        } catch (err) {
            return OpResult.fail(`操作的值超过表格空间限制${JSON.stringify(this)}`);
        }
    }
}

export class SwitchSheet {
    constructor({selection}) {
        this.name = OP_NAME.CHANGE_SHEET;
        this.selection = selection;
    }

    static fromJSON(object) {
        object = {...object};
        if (!Selection.isSelection(object.selection)) {
            object.selection = Selection.create(object.selection);
        }
        return new SwitchSheet(object);
    }

    apply(doc) {
        try {
            return OpResult.ok(doc.setActiveId(this.selection.id));
        } catch (err) {
            return OpResult.fail(`操作的值超过表格空间限制${JSON.stringify(this)}`);
        }
    }
}

export class RemoveSheet {
    constructor({selection}) {
        this.name = OP_NAME.CHANGE_SHEET;
        this.selection = selection;
    }

    static fromJSON(object) {
        object = {...object};
        if (!Selection.isSelection(object.selection)) {
            object.selection = Selection.create(object.selection);
        }
        return new RemoveSheet(object);
    }

    apply(doc) {
        try {
            return OpResult.ok(doc.setActiveId(this.selection.id));
        } catch (err) {
            return OpResult.fail(`操作的值超过表格空间限制${JSON.stringify(this)}`);
        }
    }
}

export class AddSheet {

}

export class ChangeSheet {

}
