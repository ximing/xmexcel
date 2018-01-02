/**
 * Created by ximing on 1/2/18.
 */
'use strict';
const addStyle = function (node, key, val) {
    node.style[key] = val;
};
const appendStyle = function (node, key, val) {
    node.style[key] += ` ${val}`;
};
export default {
    'b': (node, data) => {
        if (data) {
            addStyle(node, 'fontWeight', 'bold');
        }
    },
    'i': (node, data) => {
        if (data.val) {
            addStyle(node, 'fontStyle', 'italic');
        }
    },
    's': (node, data) => {
        if (data.val) {
            appendStyle(node, 'textDecoration', 'line-through');
        }
    },
    'u': (node, data) => {
        if (data.val) {
            appendStyle(node, 'textDecoration', 'underline');
        }
    },
    'color': (node, data) => {
        if (data.val) {
            addStyle(node, 'color', data.val);
        }
    },
    'bgColor': (node, data) => {
        if (data.val) {
            addStyle(node, 'background-color', data.val);
        }
    },
    'center': (node, data) => {

    },
    'fontSize': (node, data) => {
        if (data.val) {
            addStyle(node, 'font-size', data.val);
            addStyle(node, 'line-height', 1.2);
            addStyle(node, 'height', data.val || '23px');
        }
    },
    'v': (node, data) => {
        addStyle(node, 'vertical-align', data.val);
    },
    'h': (node, data) => {
        addStyle(node, 'text-align', data.val);
    }
};
