/**
 * Created by ximing on 10/27/17.
 */
'use strict';
import {
    numberFormat, decimalPointFormat, percentageDecimalPointFormat, percentageFormat, timeFormmat,
    exponentialFormat, moneyDecimalPointFormat, moneyFormat, dateFormmat, dateTimeFormmat
} from './format';
import crel from 'crel';

export const renderCell = function (v, f) {
    if (!!f) {
        let newVal = v;
        if (f === 'text') {
            return v;
        } else if (f === 'number') {
            return numberFormat(v);
        } else if (f === 'number-dp') {
            return decimalPointFormat(v);
        } else if (f === 'percentage') {
            return percentageFormat(v);
        } else if (f === 'percentage-dp') {
            return percentageDecimalPointFormat(v);
        } else if (f === 'exponential') {
            return exponentialFormat(v);
        } else if (f === 'money-$') {
            return moneyFormat(v, '$');
        } else if (f === 'money-￥') {
            return moneyFormat(v);
        } else if (f === 'money-dp-$') {
            return moneyDecimalPointFormat(v, '$');
        } else if (f === 'money-dp-￥') {
            return moneyDecimalPointFormat(v);
        } else if (f === 'date--') {
            return dateFormmat(v);
        } else if (f === 'date-/') {
            return dateFormmat(v, '/');
        } else if (f === 'datetime') {
            return dateTimeFormmat(v, '/');
        } else if (f === 'time') {
            return timeFormmat(v);
        }
        return v;
    } else {
        return v;
    }
};
export const renderFilter = function (node, row, col) {
    node.innerHTML = '';
    node.classList.add('dx-sh-filter-td-dropdown');
    node.appendChild(
        crel('div', {
            class: 'dx-filter-dropdown'
        },
        crel('i', {
            'data-filter-row': row,
            'data-filter-col': col,
            class: 'dx-icon docicon docicon-drop-down'
        })
        )
    );
};
