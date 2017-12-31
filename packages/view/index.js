/**
 * Created by ximing on 12/27/17.
 */
'use strict';
import './handsontable/src/css/handsontable.css';

localStorage.debug = 'excel:*';

class DXExcelView {
    constructor(element, option) {
        this.element = element;
        this.state = option.state;
        this.dispatchTransaction = option.dispatchTransaction;
    }

    updateState(newState) {
        if (this.state !== newState) {
            // refresh sheet View
            // update sheet setting
            // refresh toolbar View
            let doc = this.state.doc;
            let newDoc = newState.doc;
            this.state = newState;
            if (doc !== newDoc) {
            }
        }
    }

    registerModule(Module) {
    }

    applyCommand(command, source) {
    }

    onChange(type, callback) {
    }
}

export default DXExcelView;
