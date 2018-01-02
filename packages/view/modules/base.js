/**
 * Created by ximing on 10/19/17.
 */
'use strict';
export default class ModuleBase {

    getExcelElement() {
        return this.getRoot().getExcelElement();
    }

    getName() {
        return this.name;
    }

    setParent(parent) {
        this._parent = parent || null;
    }

    getParent() {
        return this._parent;
    }


    getRoot() {
        let next = this.getParent();
        let current = this; // eslint-disable-line consistent-this

        while (next) {
            current = next;
            next = current.getParent();
        }

        return current;
    }

    destory() {
    }
}
