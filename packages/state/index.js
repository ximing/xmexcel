/**
 * Created by yeanzhi on 17/4/12.
 */
'use strict';
import shortid from 'shortid';

export ExcelModel from './models/excel';
import Schema from './shcema';
import Transaction from './transactions';

export default class ExcelState {
    constructor({doc, schema, plugins, meta}) {
        this.doc = doc;
        this.schema = schema;
        this.plugins = plugins;
        this.meta = meta;
        this.objectId = shortid.generate();
    }

    get tr() {
        return new Transaction(this);
    }

    static create({doc, schema, plugins, meta} = {schema: Schema}) {
        return new ExcelState({doc, schema, plugins, meta});
    }

    setMeta(key, value) {
        return this.meta.set(key, value);
    }

    getMeta(key) {
        return this.meta.get(key);
    }

    apply(tr) {

    }
}
