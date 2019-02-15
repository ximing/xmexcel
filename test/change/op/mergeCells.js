/**
 * Created by ximing on 1/29/18.
 */
"use strict";
import test from "ava";

import { ExcelModel, Empty, Delete, Insert, Change } from "../../../src/index";

let state = {
    "1": {
        c: {},
        mergeCells: {
            "7:1": { rowspan: 6, colspan: 4 },
            "8:5": { rowspan: 3, colspan: 1 },
            "8:6": { rowspan: 1, colspan: 2 }
        }
    }
};

test("merge cells and dr1", t => {
    let op1 = new Delete("1", "dr", 6);
    t.is(
        JSON.stringify(op1.apply(state)),
        JSON.stringify({
            "1": {
                c: {},
                mergeCells: {
                    "6:1": { rowspan: 6, colspan: 4 },
                    "7:5": { rowspan: 3, colspan: 1 },
                    "7:6": { rowspan: 1, colspan: 2 }
                },
                row: 199,
                col: 20
            }
        })
    );
});

test("merge cells and dr2", t => {
    let op1 = new Delete("1", "dr", 8);
    t.is(
        JSON.stringify(op1.apply(state)),
        JSON.stringify({
            "1": {
                c: {},
                mergeCells: {
                    "7:1": { rowspan: 5, colspan: 4 },
                    "8:5": { rowspan: 2, colspan: 1 }
                },
                row: 199,
                col: 20
            }
        })
    );
});

test("merge cells and dr3", t => {
    let op1 = new Delete("1", "dr", 9);
    t.is(
        JSON.stringify(op1.apply(state)),
        JSON.stringify({
            "1": {
                c: {},
                mergeCells: {
                    "7:1": { rowspan: 5, colspan: 4 },
                    "8:5": { rowspan: 2, colspan: 1 },
                    "8:6": { rowspan: 1, colspan: 2 }
                },
                row: 199,
                col: 20
            }
        })
    );
});

test("merge cells and dc1", t => {
    let op1 = new Delete("1", "dc", 6);
    t.is(
        JSON.stringify(op1.apply(state)),
        JSON.stringify({
            "1": {
                c: {},
                mergeCells: {
                    "7:1": { rowspan: 6, colspan: 4 },
                    "8:5": { rowspan: 3, colspan: 1 }
                },
                row: 200,
                col: 19
            }
        })
    );
});

test("merge cells and dc2", t => {
    let op1 = new Delete("1", "dc", 2);
    t.is(
        JSON.stringify(op1.apply(state)),
        JSON.stringify({
            "1": {
                c: {},
                mergeCells: {
                    "7:1": { rowspan: 6, colspan: 3 },
                    "8:4": { rowspan: 3, colspan: 1 },
                    "8:5": { rowspan: 1, colspan: 2 }
                },
                row: 200,
                col: 19
            }
        })
    );
});

test("merge cells and ic1", t => {
    let op1 = new Insert("1", "ic", 2, 2);
    t.is(
        JSON.stringify(op1.apply(state)),
        JSON.stringify({
            "1": {
                c: {},
                mergeCells: {
                    "7:1": { rowspan: 6, colspan: 6 },
                    "8:7": { rowspan: 3, colspan: 1 },
                    "8:8": { rowspan: 1, colspan: 2 }
                },
                row: 200,
                col: 22
            }
        })
    );
});

test("merge cells and ic2", t => {
    let op1 = new Insert("1", "ic", 4, 2);
    let _state = op1.apply(state);
    t.is(
        JSON.stringify(_state),
        JSON.stringify({
            "1": {
                c: {},
                mergeCells: {
                    "7:1": { rowspan: 6, colspan: 6 },
                    "8:7": { rowspan: 3, colspan: 1 },
                    "8:8": { rowspan: 1, colspan: 2 }
                },
                row: 200,
                col: 22
            }
        })
    );
    let op2 = op1.revert();
    op2.forEach(op => {
        _state = op.apply(_state);
    });
    delete _state['1']['row'];
    delete _state['1']['col'];
    t.is(JSON.stringify(_state), JSON.stringify(state));
});

test("merge cells and ic3", t => {
    let op1 = new Insert("1", "ic", 3, 2);
    t.is(
        JSON.stringify(op1.apply(state)),
        JSON.stringify({
            "1": {
                c: {},
                mergeCells: {
                    "7:1": { rowspan: 6, colspan: 6 },
                    "8:7": { rowspan: 3, colspan: 1 },
                    "8:8": { rowspan: 1, colspan: 2 }
                },
                row: 200,
                col: 22
            }
        })
    );
});

test("merge cells and ir1", t => {
    let op1 = new Insert("1", "ir", 3, 2);
    t.is(
        JSON.stringify(op1.apply(state)),
        JSON.stringify({
            "1": {
                c: {},
                mergeCells: {
                    "9:1": { rowspan: 6, colspan: 4 },
                    "10:5": { rowspan: 3, colspan: 1 },
                    "10:6": { rowspan: 1, colspan: 2 }
                },
                row: 202,
                col: 20
            }
        })
    );
});

test("merge cells and ir2", t => {
    let op1 = new Insert("1", "ir", 8, 2);
    t.is(
        JSON.stringify(op1.apply(state)),
        JSON.stringify({
            "1": {
                c: {},
                mergeCells: {
                    "7:1": { rowspan: 8, colspan: 4 },
                    "10:5": { rowspan: 3, colspan: 1 },
                    "10:6": { rowspan: 1, colspan: 2 }
                },
                row: 202,
                col: 20
            }
        })
    );
});
