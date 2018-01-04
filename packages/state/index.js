/**
 * Created by yeanzhi on 17/4/12.
 */
'use strict';
import Doc from './models/doc';
import Transaction from './transactions';

export {Plugin, PluginKey} from './plugin/index';
export {Mapping, MapResult} from './models/mapping';
export const ExcelDoc = Doc;
import {Selections} from './plugin/selection';

export {Selections};

function bind(f, self) {
    return !self || !f ? f : f.bind(self);
}

class FieldDesc {
    constructor(name, desc, self) {
        this.name = name;
        this.init = bind(desc.init, self);
        this.apply = bind(desc.apply, self);
    }
}

const baseFields = [
    new FieldDesc('doc', {
        init(config) {
            if (!Doc.isDoc(config.doc)) {
                return Doc.fromJSON(config.doc);
            }
            return config.doc;
        },
        apply(tr) {
            return tr.doc;
        }
    }),

    new FieldDesc('selections', {
        init(config) {
            return config.selections ? Selections.fromJSON(config.selections) : Selections.atStart(config.doc);
        },
        apply(tr) {
            return tr.selections;
        }
    })
];

export default class ExcelState {
    constructor({schema, plugins = [], state = {}} = {}) {
        this.schema = schema;
        this.plugins = plugins;
        Object.keys(state).forEach(key => this[key] = state[key]);
    }

    get tr() {
        return new Transaction(this);
    }

    static create(config) {
        const {schema = {marks: []}, plugins = []} = config;
        let state = {};
        plugins.forEach(plugin => {
            state[plugin.key] = plugin.spec.init(config);
        });
        baseFields.forEach(base => {
            state[base.name] = base.init(config);
        });
        return new ExcelState({state, schema, plugins});
    }

    apply(tr) {
        let state = {};
        tr.apply();
        baseFields.forEach(base => {
            state[base.name] = base.apply(tr);
        });
        this.plugins.forEach(plugin => {
            state[plugin.key] = plugin.apply(tr, plugin.key.getState(this));
        });
        return new ExcelState({schema: this.schema, plugins: this.plugins, state});
    }

}
