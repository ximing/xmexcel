/**
 * Created by yeanzhi on 17/4/12.
 */
'use strict';
import shortid from 'shortid';

import Doc from './models/excel';
import Transaction from './transactions';

export const ExcelModel = Doc;

export default class ExcelState {
    constructor({doc, schema, plugins = [], meta, pluginState = {}} = {}) {
        this.doc = doc;
        this.schema = schema;
        this.plugins = plugins;
        this.pluginState = pluginState;
        this.meta = meta;
        this.objectId = shortid.generate();
    }

    get tr() {
        return new Transaction(this);
    }

    static create({doc, schema = {marks: []}, plugins = [], meta = {}} = {}) {
        let pluginState = {};
        plugins.forEach(plugin => {
            pluginState[plugin.key] = plugin.spec.init();
        });
        if (!Doc.isExcel(doc)) {
            doc = Doc.fromJSON(doc);
        }
        return new ExcelState({doc, schema, plugins, meta, pluginState});
    }

    setMeta(key, value) {
        return this.meta.set(key, value);
    }

    getMeta(key) {
        return this.meta.get(key);
    }

    apply(tr) {
        let pluginState = {};
        this.plugins.forEach(plugin => {
            pluginState[plugin.key] = plugin.apply(tr);
        });
        let doc = tr.apply(this);
        return new ExcelState({doc, schema: this.schema, plugins: this.plugins, meta: this.meta, pluginState});
    }

}
