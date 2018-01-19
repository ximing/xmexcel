/**
 * Created by ximing on 1/18/18.
 */
'use strict';
import {Empty, Delete, Insert, Change} from './op';

export class ExcelModel {
    constructor(state) {
        this.state = state;
    }

    static fromJSON(obj) {
        return new ExcelModel(obj);
    }

    apply(ops) {
        if (!Array.isArray(ops)) {
            ops = [ops];
        }

        ops.forEach(op => {
            this.state = op.apply(this.state);
        });
        return this.state;
    }

    static transform(op1, op2) {
        if (op1.id !== op2.id) {
            return [op1, op2];
        }
        let a = op1.clone(), b = op2.clone();
        if (op1.t === op2.t) {
            if (op2.t === 'c') {
                if (op2.p[0] === 'c' && op1.p[1] === op2.p[1] && op1.p[2] === op2.p[2]) {
                    b.oi = a.oi;
                    b.od = a.od;
                }
                return [a, b];
            } else if (op2.t === 'ir' || op2.t === 'ic') {
                if (op2.i >= op1.i) {
                    b.i += a.a;
                } else {
                    a.i += b.a;
                }
                return [a, b];
            } else if (op2.t === 'dr' || op2.t === 'dc') {
                if (op2.i >= op1.i) {
                    /*
                    * a 01234
                    * b    34567
                    * a 01234
                    * b      5678
                    * */
                    b.i = Math.max(0, b.i - a.a);
                    // b.a = Math.max(0, b.a - a.a);
                    let offset;
                    if ((offset = a.i + a.a - b.i) > 0) {
                        b.a = Math.max(0, b.a - offset);
                    }
                } else {
                    /*
                    * a   23
                    * b 01234
                    * */
                    if (b.a + b.i >= a.i + a.a) {
                        b.a -= a.a;
                    } else if (b.a + b.i > a.i) {
                        /*
                         * a    3456
                         * b 01234
                         * */
                        b.a = a.i - b.i;
                    }
                }
                return [a, b];
            } else {
                throw new Error('无效的类型');
            }
        } else {
            if (op2.t === 'ir') {
                if (op1.t === 'c') {
                    if (a.p[1] >= b.i) {
                        a.p[1] += b.a;
                    }
                } else if (op1.t === 'dr') {
                    if (a.i > b.i) {
                        b.i = a.i + a.a;
                    }
                }
                return [a, b];
            } else if (op2.t === 'ic') {
                if (op1.t === 'c') {
                    if (a.p[2] >= b.i) {
                        a.p[2] += b.a;
                    }
                } else if (op1.t === 'dc') {
                    if (a.i > b.i) {
                        b.i = a.i + a.a;
                    }
                }
                return [a, b];
            } else if (op2.t === 'dr') {
                if (op1.t === 'c') {
                    if (a.p[1] >= b.i && a.p[1] < b.i + b.a) {
                        a = Empty.create();
                    } else if (a.p[1] >= b.i + b.a) {
                        a.p[1] -= b.a;
                    }
                } else if (op1.t === 'ir') {
                    //完全在右侧
                    if (b.i >= a.i + a.a) {
                        b.i -= a.a;
                    } else if (b.i + b.a <= a.i) {
                        //完全在左侧
                        a.i -= b.a;
                    } else {
                        b = [new Delete(b.id, b.i, a.i - b.i), new Delete(b.id, a.i + a.a - 1, b.a - a.i + b.i)];
                    }
                }
                return [a, b];
            } else if (op2.t === 'dc') {
                if (op1.t === 'c') {
                    if (a.p[2] >= b.i && a.p[2] < b.i + b.a) {
                        a = Empty.create();
                    } else if (a.p[2] >= b.i + b.a) {
                        a.p[2] -= b.a;
                    }
                } else if (op1.t === 'ic') {
                    if (b.i >= a.i + a.a) {
                        b.i -= a.a;
                    } else if (b.i + b.a <= a.i) {
                        //完全在左侧
                        a.i -= b.a;
                    } else {
                        b = [new Delete(b.id, b.i, a.i - b.i), new Delete(b.id, a.i + a.a - 1, b.a - a.i + b.i)];
                    }
                }
                return [a, b];
            } else if (op2.t === 'c') {
                if (op1.t === 'ic') {
                    if (a.i < b.p[1]) {
                        b.p[1] += a.a;
                    }
                } else if (op1.t === 'ir') {
                    if (a.i < b.p[2]) {
                        b.p[2] += a.a;
                    }
                } else if (op1.t === 'dc') {
                    if (a.i + a.a <= b.p[1]) {
                        b.p[1] -= a.a;
                    } else if (a.i < b.p[1]) {
                        b = Empty.create();
                    }
                } else if (op1.t === 'dr') {
                    if (a.i + a.a <= b.p[2]) {
                        b.p[2] -= a.a;
                    } else if (a.i < b.p[2]) {
                        b = Empty.create();
                    }
                }
                return [a, b];
            } else {
                throw new Error('无效的类型');
            }

        }
    }
}
