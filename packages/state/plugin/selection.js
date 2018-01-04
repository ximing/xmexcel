/**
 * Created by ximing on 1/3/18.
 */
'use strict';
import {Mapping} from '../models/mapping';

export class Selections {

    static isSelections(any) {
        return !!(any && any['DX_SELECTIONS']);
    }

    static atStart(doc) {
        let selections = {};
        if (doc) {
            doc.sheetOrder.forEach(key => {
                selections[key] = {id: key, r: [0, 0, 0, 0]};
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
            _selections[key] = Mapping.fromJSON(selections[key]);
        });
        return _selections;
    }

    getSelection(id) {
        return this[id];
    }

    setSelection({id, r}) {
        return Selections.fromJSON({...this, [id]: Mapping.fromJSON({id, r})});
    }
}

Selections.prototype['DX_SELECTIONS'] = 'DX_SELECTIONS';

