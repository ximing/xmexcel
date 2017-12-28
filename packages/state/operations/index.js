/**
 * Created by ximing on 12/26/17.
 */
import {OP_NAME} from '../constants/op-consts'

export class Value {
    constructor({m, v}) {
        this.name = OP_NAME.VALUE;
        this.m = m;
        this.v = v;
    }

    static fromJSON(object) {
        return new Value({m: object.m, v: object.v});
    }

    toJSON() {
        return JSON.stringify(this);
    }

}
