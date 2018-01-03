/**
 * Created by ximing on 1/3/18.
 */
'use strict';

export class Selection {

    constructor({id, r}) {
        this.id = id;
        this.r = r;
    }

    static isSelection(any) {
        return !!(any && any['DX_SELECTION']);
    }

    static fromJSON(selection) {
        if (Selection.isSelection(selection)) {
            return selection;
        }
        return new Selection(selection);
    }
};
Selection.prototype['DX_SELECTION'] = 'DX_SELECTION';

export class Selections {

    static isSelections(any) {
        return !!(any && any['DX_SELECTIONS']);
    }

    static atStart(doc) {
        let selections = {};
        if (doc) {
            doc.sheetOrder.forEach(key => {
                selections[key] = [0, 0, 0, 0];
            });
        }
        return Selections.fromJSON(selections);
    }

    static fromJSON(selections) {
        if (Selections.isSelections(selections)) {
            return selections;
        }
        let _selections = new Selections();
        Object.keys(selections).forEach(key => {
            _selections[key] = Selection.fromJSON({id: key, r: selections[key]});
        });
        return _selections;
    }

    getSelection(id) {
        return this[id];
    }

    setSelection({id, r}) {
        return Selections.fromJSON({...this, [id]: r});
    }
}

Selections.prototype['DX_SELECTIONS'] = 'DX_SELECTIONS';

