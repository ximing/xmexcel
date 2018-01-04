/**
 * Created by ximing on 1/4/18.
 */
'use strict';
import {Plugin, PluginKey} from './index';

class Rebaseable {
    constructor(step, inverted, origin) {
        this.step = step;
        this.inverted = inverted;
        this.origin = origin;
    }
}

// : ([Rebaseable], [Step], Transform) → [Rebaseable]
// Undo a given set of steps, apply a set of other steps, and then
// redo them.
export function rebaseOps(ops, over, transform) {
    for (let i = ops.length - 1; i >= 0; i--) transform.step(ops[i].inverted);
    for (let i = 0; i < over.length; i++) transform.step(over[i]);
    let result = [];
    for (let i = 0, mapFrom = ops.length; i < ops.length; i++) {
        let mapped = ops[i].step.map(transform.mapping.slice(mapFrom));
        mapFrom--;
        if (mapped && !transform.maybeStep(mapped).failed) {
            transform.mapping.setMirror(mapFrom, transform.ops.length - 1);
            result.push(new Rebaseable(mapped, mapped.invert(transform.docs[transform.docs.length - 1]), ops[i].origin));
        }
    }
    return result;
}

// This state field accumulates changes that have to be sent to the
// central authority in the collaborating group and makes it possible
// to integrate changes made by peers into our local document. It is
// defined by the plugin, and will be available as the `collab` field
// in the resulting editor state.
class CollabState {
    constructor(version, unconfirmed) {
        // : number
        // The version number of the last update received from the central
        // authority. Starts at 0 or the value of the `version` property
        // in the option object, for the editor's value when the option
        // was enabled.
        this.version = version;

        // : [Rebaseable]
        // The local steps that havent been successfully sent to the
        // server yet.
        this.unconfirmed = unconfirmed;
    }
}

function unconfirmedFrom(transform) {
    let result = [];
    for (let i = 0; i < transform.ops.length; i++) {
        result.push(
            new Rebaseable(
                transform.ops[i],
                transform.ops[i].invert(transform.docs[i]),
                transform
            )
        );
    }
    return result;
}

const collabKey = new PluginKey('collab');

// :: (?Object) → Plugin
//
// Creates a plugin that enables the collaborative editing framework
// for the editor.
//
//   config::- An optional set of options
//
//     version:: ?number
//     The starting version number of the collaborative editing.
//     Defaults to 0.
//
//     clientID:: ?union<number, string>
//     This client's ID, used to distinguish its changes from those of
//     other clients. Defaults to a random 32-bit number.
export function collab(config = {}) {
    config = {
        version: config.version || 0,
        clientID: config.clientID == null ? Math.floor(Math.random() * 0xFFFFFFFF) : config.clientID
    };

    return new Plugin({
        key: collabKey,

        state: {
            init: () => new CollabState(config.version, []),
            apply(tr, collab) {
                let newState = tr.getMeta(collabKey);
                if (newState) {
                    return newState;
                }
                if (tr.docChanged) {
                    return new CollabState(collab.version, collab.unconfirmed.concat(unconfirmedFrom(tr)));
                }
                return collab;
            }
        },

        config,
        // This is used to notify the history plugin to not merge steps,
        // so that the history can be rebased.
        historyPreserveItems: true
    });
}

// :: (state: EditorState, steps: [Step], clientIDs: [union<number, string>]) → Transaction
// Create a transaction that represents a set of new steps received from
// the authority. Applying this transaction moves the state forward to
// adjust to the authority's view of the document.
export function receiveTransaction(state, ops, clientIDs) {
    // Pushes a set of steps (received from the central authority) into
    // the editor state (which should have the collab plugin enabled).
    // Will recognize its own changes, and confirm unconfirmed steps as
    // appropriate. Remaining unconfirmed steps will be rebased over
    // remote steps.
    let collabState = collabKey.getState(state);
    let version = collabState.version + ops.length;
    let ourID = collabKey.get(state).spec.config.clientID;

    // Find out which prefix of the steps originated with us
    let ours = 0;
    while (ours < clientIDs.length && clientIDs[ours] == ourID) ++ours;
    let unconfirmed = collabState.unconfirmed.slice(ours);
    ops = ours ? ops.slice(ours) : ops;

    // If all steps originated with us, we're done.
    if (!ops.length) {
        return state.tr.setMeta(collabKey, new CollabState(version, unconfirmed));
    }

    let nUnconfirmed = unconfirmed.length;
    let tr = state.tr;
    if (nUnconfirmed) {
        unconfirmed = rebaseOps(unconfirmed, ops, tr);
    } else {
        for (let i = 0; i < ops.length; i++) tr.step(ops[i]);
        unconfirmed = [];
    }

    let newCollabState = new CollabState(version, unconfirmed);
    return tr.setMeta('rebased', nUnconfirmed).setMeta('addToHistory', false).setMeta(collabKey, newCollabState);
}

// :: (state: EditorState) → ?{version: number, steps: [Step], clientID: union<number, string>, origins: [Transaction]}
// Provides data describing the editor's unconfirmed steps, which need
// to be sent to the central authority. Returns null when there is
// nothing to send.
//
// `origins` holds the _original_ transactions that produced each
// steps. This can be useful for looking up time stamps and other
// metadata for the steps, but note that the steps may have been
// rebased, whereas the origin transactions are still the old,
// unchanged objects.
export function sendableOps(state) {
    let collabState = collabKey.getState(state);
    if (collabState.unconfirmed.length == 0) return null;
    return {
        version: collabState.version,
        ops: collabState.unconfirmed.map(s => s.op),
        clientID: collabKey.get(state).spec.config.clientID,
        get origins() {
            return this._origins || (this._origins = collabState.unconfirmed.map(s => s.origin));
        }
    };
}

// :: (EditorState) → number
// Get the version up to which the collab plugin has synced with the
// central authority.
export function getVersion(state) {
    return collabKey.getState(state).version;
}
