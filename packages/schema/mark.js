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
        if (data) {
            addStyle(node, 'fontStyle', 'italic');
        }
    },
    's': (node, data) => {
        if (data) {
            appendStyle(node, 'textDecoration', 'line-through');
        }
    },
    'u': (node, data) => {
        if (data) {
            appendStyle(node, 'textDecoration', 'underline');
        }
    },
    'color': (node, data) => {
        if (data) {
            addStyle(node, 'color', data);
        }
    },
    'bgColor': (node, data) => {
        if (data) {
            addStyle(node, 'background-color', data);
        }
    },
    'fontSize': (node, data) => {
        if (data) {
            addStyle(node, 'font-size', data);
            addStyle(node, 'line-height', 1.2);
            addStyle(node, 'height', data || '23px');
        }
    },
    'v': (node, data) => {
        addStyle(node, 'vertical-align', data);
    },
    'h': (node, data) => {
        addStyle(node, 'text-align', data);
    }
};
