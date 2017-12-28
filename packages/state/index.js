/**
 * Created by yeanzhi on 17/4/12.
 */
'use strict';
import shortid from 'shortid';

export ExcelModel from './models/excel';
import Schema from './shcema';
import Transaction from './transactions';

export default class ExcelState {
    constructor({doc, schema, plugins, meta, pluginState} = {plugins: [], pluginState: {}}) {
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

    static create({doc, schema, plugins, meta} = {schema: Schema, meta: {}}) {
        let pluginState = {};
        plugins.forEach(plugin => {
            pluginState[plugin.key] = plugin.spec.init();
        });
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
        if (tr.objectId !== this.tr.objectId) {
            throw new Error('error tr');
        }
        let doc = tr.apply(this);
        return new ExcelState({doc, schema: this.schema, plugins: this.plugins, meta: this.meta, pluginState});
    }
}
