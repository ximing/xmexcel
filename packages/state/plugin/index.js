/**
 * Created by ximing on 12/28/17.
 */
'use strict';

function bindProps(obj, self, target) {
    for (let prop in obj) {
        let val = obj[prop];
        if (val instanceof Function) val = val.bind(self);
        else if (prop == 'handleDOMEvents') val = bindProps(val, self, {});
        target[prop] = val;
    }
    return target;
}

export class Plugin {

    constructor(spec) {
        this.props = {};
        if (spec.props) bindProps(spec.props, this, this.props);
        this.spec = spec;
        this.key = spec.key ? spec.key.key : createKey('plugin');
    }

    getState(state) {
        return state[this.key];
    }

    apply(tr) {
        return this.spec.apply(tr);
    }

}

const keys = Object.create(null);

function createKey(name) {
    if (name in keys) return name + '$' + ++keys[name];
    keys[name] = 0;
    return name + '$';
}

export class PluginKey {
    // :: (?string)
    // Create a plugin key.
    constructor(name = 'key') {
        this.key = createKey(name);
    }

    // :: (EditorState) → ?Plugin
    // Get the active plugin with this key, if any, from an editor
    // state.
    get(state) {
        return state.config.pluginsByKey[this.key];
    }

    // :: (EditorState) → ?any
    // Get the plugin's state from an editor state.
    getState(state) {
        return state[this.key];
    }
}
