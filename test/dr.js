/**
 * Created by ximing on 3/14/18.
 */
"use strict";

import test from "ava";
import { ExcelModel, Empty, Delete, Insert, Change } from "../src/index";

let state = {
    "1": {
        c: {},
        rh: { 3: 20 },
        cw: { 4: 200 }
    }
};
test("dr", t => {
    let op1 = new Delete("1", "dr", 4);
    t.is(
        JSON.stringify(op1.apply(state)),
        JSON.stringify({ "1": { c: {}, rh: { "3": 20 }, cw: { "4": 200 } } })
    );
});
