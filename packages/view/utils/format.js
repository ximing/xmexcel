/**
 * Created by ximing on 10/27/17.
 */
'use strict';
import numeral from 'numeral';
import moment from 'moment';

window.numeral = numeral;
export const numberFormat = function (num) {
    return numeral(num).format('0,000');
};

export const decimalPointFormat = function (num) {
    return numeral(num).format('0,000.000');
};

export const percentageFormat = function (num) {
    return numeral(num).format('0 %');
};

export const percentageDecimalPointFormat = function (num) {
    return numeral(num).format('0.000 %');
};

export const exponentialFormat = function (num) {
    return numeral(num).format('0.00e+0');
};

export const moneyFormat = function (num, unit = '￥') {
    return numeral(num).format(`${unit}0,000`);
};

export const moneyDecimalPointFormat = function (num, unit = '￥') {
    return numeral(num).format(`${unit}0,000.00`);
};

export const dateFormmat = function (num, separator = '-') {
    return moment(num, `YYYY${separator}MM${separator}DD`);
};

export const timeFormmat = function (num, separator = ':') {
    return moment(num, `HH${separator}mm${separator}ss`);
};

export const dateTimeFormmat = function (num, separator = '-') {
    return moment(num, `YYYY${separator}MM${separator}DD HH:mm:ss`);
};

//=TEXT(9,"0000000") google doc
function TEXT(n, format) {
    return format.substring(0, format.length - n.toString().length) + n;
}

