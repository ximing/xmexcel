/**
 * Created by ximing on 11/14/17.
 */
'use strict';
import numeral from 'numeral';
import moment from 'moment';

export default class NumFmt {
    static parse(value, fmt) {
        if (fmt == null || fmt == '') {
            return value;
        } else if (fmt.includes('#') || fmt.includes('0') || fmt.includes('%') ||
            fmt.includes('e+') || fmt.includes('E+')) {
            return numeral(value).format(fmt);
        } else if (fmt.includes('YY') || fmt.includes('MM') ||
            fmt.includes('DD') || fmt.includes('HH') ||
            fmt.includes('mm') || fmt.includes('ss')) {
            return moment(value, fmt);
        } else if (fmt.includes('@')) {
            return value;
        } else {
            return value;
        }
    }
}
