/**
 * Created by ximing on 12/26/17.
 */
'use strict';
import MODEL_TYPES from '../constants/model-types';

class Mark {

    constructor({key, val}) {
        this.key = key;
        this.val = val;
    }

    static fromJSON(mark) {
        return new Mark(mark);
    }

    static isMark(any) {
        return !!(any && any[MODEL_TYPES.MARK]);
    }
}

Mark.prototype[MODEL_TYPES.MARK] = true;

export default Mark;
