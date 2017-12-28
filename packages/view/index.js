/**
 * Created by ximing on 12/27/17.
 */
'use strict';
import './handsontable/src/css/handsontable.css';


import Bootstrap from './bootstrap.js';

localStorage.debug = 'excel:*';

class DXExcel {
    constructor(element, option) {
        this.element = element;
        this.state = option.state;
        this.dispatchTransaction = option.dispatchTransaction;
        this.bootstrap = Bootstrap.getSingleton();
        this.bootstrap.start(this.element, this);
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
                this.bootstrap.setState(newDoc);
            }
        }
    }

    registerModule(Module) {
        this.bootstrap._register(new Module(this.bootstrap.getMainModule(), this.bootstrap));
    }

    applyCommand(command, source) {
        this.bootstrap.applyCommand(command, source);
    }

    onChange(type, callback) {
        this.bootstrap.on(type, callback);
    }
}

export default DXExcel;
