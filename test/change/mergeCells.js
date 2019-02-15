/**
 * Created by ximing on 1/29/18.
 */
"use strict";
import test from "ava";
import _ from "lodash";

import { ExcelModel, Empty, Delete, Insert, Change } from "../../src/index";

let state = {
    "1": {
        c: {
            "4:0": { v: 1 },
            "4:1": { v: 1 },
            "5:2": { v: 1 }
        }
    }
};

let getState = () => {
    return _.cloneDeep(state);
};
test("merge cell", t => {
    let op1 = new Change("1", ["mergeCells", "2:3"], {
        rowspan: 2,
        colspan: 2
    });
    let newState = op1.apply(getState());
    t.is(
        JSON.stringify(newState),
        '{"1":{"c":{"4:0":{"v":1},"4:1":{"v":1},"5:2":{"v":1}},"mergeCells":{"2:3":{"rowspan":2,"colspan":2}}}}'
    );
});

// local merge cells and remote add row/col

test("ic and merge cells1", t => {
    let op1 = new Change("1", ["mergeCells", "2:3"], {
        rowspan: 2,
        colspan: 2
    });
    let op2 = new Insert("1", "ic", 1, 2);
    let [a, b] = ExcelModel.transform(op1, op2);

    let state1 = b.apply(op1.apply(getState()));
    let state2 = a.apply(op2.apply(getState()));
    t.is(
        JSON.stringify(state1['1']['c']),
        JSON.stringify(state2['1']['c'])
    );
    t.is(
        JSON.stringify(state1['1']['mergeCells']),
        JSON.stringify(state2['1']['mergeCells'])
    );
    t.is(state1['1'].col, state2['1'].col);
});

test("ic and merge cells2", t => {
    let op1 = new Change("1", ["mergeCells", "2:3"], {
        rowspan: 2,
        colspan: 2
    });
    let op2 = new Insert("1", "ic", 3, 2);
    let [a, b] = ExcelModel.transform(op1, op2);

    let state1 = b.apply(op1.apply(getState()));
    let state2 = a.apply(op2.apply(getState()));
    t.is(
        JSON.stringify(state1['1']['c']),
        JSON.stringify(state2['1']['c'])
    );
    t.is(
        JSON.stringify(state1['1']['mergeCells']),
        JSON.stringify(state2['1']['mergeCells'])
    );
    t.is(state1['1'].col, state2['1'].col);
});

test("ic and merge cells3", t => {
    let op1 = new Change("1", ["mergeCells", "2:3"], {
        rowspan: 2,
        colspan: 2
    });
    let op2 = new Insert("1", "ic", 6, 2);
    let [a, b] = ExcelModel.transform(op1, op2);

    let state1 = b.apply(op1.apply(getState()));
    let state2 = a.apply(op2.apply(getState()));
    t.is(
        JSON.stringify(state1['1']['c']),
        JSON.stringify(state2['1']['c'])
    );
    t.is(
        JSON.stringify(state1['1']['mergeCells']),
        JSON.stringify(state2['1']['mergeCells'])
    );
    t.is(state1['1'].col, state2['1'].col);
});

test("ir and merge cells1", t => {
    let op1 = new Change("1", ["mergeCells", "2:3"], {
        rowspan: 2,
        colspan: 2
    });
    let op2 = new Insert("1", "ir", 3, 2);
    let [a, b] = ExcelModel.transform(op1, op2);

    let state1 = b.apply(op1.apply(getState()));
    let state2 = a.apply(op2.apply(getState()));
    t.is(
        JSON.stringify(state1['1']['c']),
        JSON.stringify(state2['1']['c'])
    );
    t.is(
        JSON.stringify(state1['1']['mergeCells']),
        JSON.stringify(state2['1']['mergeCells'])
    );
    t.is(state1['1'].row, state2['1'].row);
});

test("ir and merge cells2", t => {
    let op1 = new Change("1", ["mergeCells", "2:3"], {
        rowspan: 2,
        colspan: 2
    });
    let op2 = new Insert("1", "ir", 1, 2);
    let [a, b] = ExcelModel.transform(op1, op2);

    let state1 = b.apply(op1.apply(getState()));
    let state2 = a.apply(op2.apply(getState()));
    t.is(
        JSON.stringify(state1['1']['c']),
        JSON.stringify(state2['1']['c'])
    );
    t.is(
        JSON.stringify(state1['1']['mergeCells']),
        JSON.stringify(state2['1']['mergeCells'])
    );
    t.is(state1['1'].row, state2['1'].row);
});

test("ir and merge cells3", t => {
    let op1 = new Change("1", ["mergeCells", "2:3"], {
        rowspan: 2,
        colspan: 2
    });
    let op2 = new Insert("1", "ir", 6, 2);
    let [a, b] = ExcelModel.transform(op1, op2);

    let state1 = b.apply(op1.apply(getState()));
    let state2 = a.apply(op2.apply(getState()));
    t.is(
        JSON.stringify(state1['1']['c']),
        JSON.stringify(state2['1']['c'])
    );
    t.is(
        JSON.stringify(state1['1']['mergeCells']),
        JSON.stringify(state2['1']['mergeCells'])
    );
    t.is(state1['1'].row, state2['1'].row);
});

// local add row/col and remote merge cells

test("merge cells and ic1", t => {
    let op2 = new Change("1", ["mergeCells", "2:3"], {
        rowspan: 2,
        colspan: 2
    });
    let op1 = new Insert("1", "ic", 1, 2);
    let [a, b] = ExcelModel.transform(op1, op2);

    let state1 = b.apply(op1.apply(getState()));
    let state2 = a.apply(op2.apply(getState()));
    t.is(
        JSON.stringify(state1['1']['c']),
        JSON.stringify(state2['1']['c'])
    );
    t.is(
        JSON.stringify(state1['1']['mergeCells']),
        JSON.stringify(state2['1']['mergeCells'])
    );
    t.is(state1['1'].col, state2['1'].col);
});

test("merge cells and ic2", t => {
    let op2 = new Change("1", ["mergeCells", "2:3"], {
        rowspan: 2,
        colspan: 2
    });
    let op1 = new Insert("1", "ic", 3, 2);
    let [a, b] = ExcelModel.transform(op1, op2);

    let state1 = b.apply(op1.apply(getState()));
    let state2 = a.apply(op2.apply(getState()));
    t.is(
        JSON.stringify(state1['1']['c']),
        JSON.stringify(state2['1']['c'])
    );
    t.is(
        JSON.stringify(state1['1']['mergeCells']),
        JSON.stringify(state2['1']['mergeCells'])
    );
    t.is(state1['1'].col, state2['1'].col);
});

test("merge cells and ic3", t => {
    let op2 = new Change("1", ["mergeCells", "2:3"], {
        rowspan: 2,
        colspan: 2
    });
    let op1 = new Insert("1", "ic", 4, 2);
    let [a, b] = ExcelModel.transform(op1, op2);

    let state1 = b.apply(op1.apply(getState()));
    let state2 = a.apply(op2.apply(getState()));
    t.is(
        JSON.stringify(state1['1']['c']),
        JSON.stringify(state2['1']['c'])
    );
    t.is(
        JSON.stringify(state1['1']['mergeCells']),
        JSON.stringify(state2['1']['mergeCells'])
    );
    t.is(state1['1'].col, state2['1'].col);
});

test("merge cells and ic4", t => {
    let op2 = new Change("1", ["mergeCells", "2:3"], {
        rowspan: 2,
        colspan: 2
    });
    let op1 = new Insert("1", "ic", 6, 2);
    let [a, b] = ExcelModel.transform(op1, op2);

    let state1 = b.apply(op1.apply(getState()));
    let state2 = a.apply(op2.apply(getState()));
    t.is(
        JSON.stringify(state1['1']['c']),
        JSON.stringify(state2['1']['c'])
    );
    t.is(
        JSON.stringify(state1['1']['mergeCells']),
        JSON.stringify(state2['1']['mergeCells'])
    );
    t.is(state1['1'].col, state2['1'].col);
});

test("merge cells and ir1", t => {
    let op2 = new Change("1", ["mergeCells", "2:3"], {
        rowspan: 2,
        colspan: 2
    });
    let op1 = new Insert("1", "ir", 3, 2);
    let [a, b] = ExcelModel.transform(op1, op2);

    let state1 = b.apply(op1.apply(getState()));
    let state2 = a.apply(op2.apply(getState()));
    t.is(
        JSON.stringify(state1['1']['c']),
        JSON.stringify(state2['1']['c'])
    );
    t.is(
        JSON.stringify(state1['1']['mergeCells']),
        JSON.stringify(state2['1']['mergeCells'])
    );
    t.is(state1['1'].col, state2['1'].col);
});

test("merge cells and ir2", t => {
    let op2 = new Change("1", ["mergeCells", "2:3"], {
        rowspan: 2,
        colspan: 2
    });
    let op1 = new Insert("1", "ir", 1, 2);
    let [a, b] = ExcelModel.transform(op1, op2);
    let state1 = b.apply(op1.apply(getState()));
    let state2 = a.apply(op2.apply(getState()));
    t.is(
        JSON.stringify(state1['1']['c']),
        JSON.stringify(state2['1']['c'])
    );
    t.is(
        JSON.stringify(state1['1']['mergeCells']),
        JSON.stringify(state2['1']['mergeCells'])
    );
    t.is(state1['1'].col, state2['1'].col);
});

test("merge cells and ir3", t => {
    let op2 = new Change("1", ["mergeCells", "2:3"], {
        rowspan: 2,
        colspan: 2
    });
    let op1 = new Insert("1", "ir", 6, 2);
    let [a, b] = ExcelModel.transform(op1, op2);

    let state1 = b.apply(op1.apply(getState()));
    let state2 = a.apply(op2.apply(getState()));
    t.is(
        JSON.stringify(state1['1']['c']),
        JSON.stringify(state2['1']['c'])
    );
    t.is(
        JSON.stringify(state1['1']['mergeCells']),
        JSON.stringify(state2['1']['mergeCells'])
    );
    t.is(state1['1'].col, state2['1'].col);
});

// local is remove row/coll remote is merge cells

test("merge cells and dc1", t => {
    let op1 = new Delete("1", "dc", 1);
    let op2 = new Change("1", ["mergeCells", "2:3"], {
        rowspan: 2,
        colspan: 2
    });
    let [a, b] = ExcelModel.transform(op1, op2);

    let state1 = b.apply(op1.apply(getState()));
    let state2 = a.apply(op2.apply(getState()));
    t.is(
        JSON.stringify(state1['1']['c']),
        JSON.stringify(state2['1']['c'])
    );
    t.is(
        JSON.stringify(state1['1']['mergeCells']),
        JSON.stringify(state2['1']['mergeCells'])
    );
    t.is(state1['1'].col, state2['1'].col);
});

test("merge cells and dc2", t => {
    let op1 = new Delete("1", "dc", 3);
    let op2 = new Change("1", ["mergeCells", "2:3"], {
        rowspan: 2,
        colspan: 2
    });
    let [a, b] = ExcelModel.transform(op1, op2);

    let state1 = b.apply(op1.apply(getState()));
    let state2 = a.apply(op2.apply(getState()));
    t.is(
        JSON.stringify(state1['1']['c']),
        JSON.stringify(state2['1']['c'])
    );
    t.is(
        JSON.stringify(state1['1']['mergeCells']),
        JSON.stringify(state2['1']['mergeCells'])
    );
    t.is(state1['1'].col, state2['1'].col);
});

test("merge cells and dc3", t => {
    let op1 = new Delete("1", "dc", 4);
    let op2 = new Change("1", ["mergeCells", "2:3"], {
        rowspan: 2,
        colspan: 2
    });
    let [a, b] = ExcelModel.transform(op1, op2);

    let state1 = b.apply(op1.apply(getState()));
    let state2 = a.apply(op2.apply(getState()));
    t.is(
        JSON.stringify(state1['1']['c']),
        JSON.stringify(state2['1']['c'])
    );
    t.is(
        JSON.stringify(state1['1']['mergeCells']),
        JSON.stringify(state2['1']['mergeCells'])
    );
    t.is(state1['1'].col, state2['1'].col);
});

test("merge cells and dc6", t => {
    let op1 = new Delete("1", "dc", 6);
    let op2 = new Change("1", ["mergeCells", "2:3"], {
        rowspan: 2,
        colspan: 2
    });
    let [a, b] = ExcelModel.transform(op1, op2);

    let state1 = b.apply(op1.apply(getState()));
    let state2 = a.apply(op2.apply(getState()));
    t.is(
        JSON.stringify(state1['1']['c']),
        JSON.stringify(state2['1']['c'])
    );
    t.is(
        JSON.stringify(state1['1']['mergeCells']),
        JSON.stringify(state2['1']['mergeCells'])
    );
    t.is(state1['1'].col, state2['1'].col);
});

test("merge cells and dr1", t => {
    let op1 = new Delete("1", "dr", 3);
    let op2 = new Change("1", ["mergeCells", "2:3"], {
        rowspan: 2,
        colspan: 2
    });
    let [a, b] = ExcelModel.transform(op1, op2);

    let state1 = b.apply(op1.apply(getState()));
    let state2 = a.apply(op2.apply(getState()));
    t.is(
        JSON.stringify(state1['1']['c']),
        JSON.stringify(state2['1']['c'])
    );
    t.is(
        JSON.stringify(state1['1']['mergeCells']),
        JSON.stringify(state2['1']['mergeCells'])
    );
    t.is(state1['1'].col, state2['1'].col);
});

test("merge cells and dr2", t => {
    let op1 = new Delete("1", "dr", 1);
    let op2 = new Change("1", ["mergeCells", "2:3"], {
        rowspan: 2,
        colspan: 2
    });
    let [a, b] = ExcelModel.transform(op1, op2);

    let state1 = b.apply(op1.apply(getState()));
    let state2 = a.apply(op2.apply(getState()));
    t.is(
        JSON.stringify(state1['1']['c']),
        JSON.stringify(state2['1']['c'])
    );
    t.is(
        JSON.stringify(state1['1']['mergeCells']),
        JSON.stringify(state2['1']['mergeCells'])
    );
    t.is(state1['1'].col, state2['1'].col);
});

test("merge cells and dr3", t => {
    let op1 = new Delete("1", "dr", 6);
    let op2 = new Change("1", ["mergeCells", "2:3"], {
        rowspan: 2,
        colspan: 2
    });
    let [a, b] = ExcelModel.transform(op1, op2);

    let state1 = b.apply(op1.apply(getState()));
    let state2 = a.apply(op2.apply(getState()));
    t.is(
        JSON.stringify(state1['1']['c']),
        JSON.stringify(state2['1']['c'])
    );
    t.is(
        JSON.stringify(state1['1']['mergeCells']),
        JSON.stringify(state2['1']['mergeCells'])
    );
    t.is(state1['1'].col, state2['1'].col);
});

// local merge cells remote remove row/col

test("merge cells and dc4", t => {
    let op1 = new Change("1", ["mergeCells", "2:3"], {
        rowspan: 2,
        colspan: 2
    });
    let op2 = new Delete("1", "dc", 1);
    let [a, b] = ExcelModel.transform(op1, op2);

    let state1 = b.apply(op1.apply(getState()));
    let state2 = a.apply(op2.apply(getState()));
    t.is(
        JSON.stringify(state1['1']['c']),
        JSON.stringify(state2['1']['c'])
    );
    t.is(
        JSON.stringify(state1['1']['mergeCells']),
        JSON.stringify(state2['1']['mergeCells'])
    );
    t.is(state1['1'].col, state2['1'].col);
});

test("merge cells and dc5", t => {
    let op1 = new Change("1", ["mergeCells", "2:3"], {
        rowspan: 2,
        colspan: 2
    });
    let op2 = new Delete("1", "dc", 3);
    let [a, b] = ExcelModel.transform(op1, op2);

    let state1 = b.apply(op1.apply(getState()));
    let state2 = a.apply(op2.apply(getState()));
    t.is(
        JSON.stringify(state1['1']['c']),
        JSON.stringify(state2['1']['c'])
    );
    t.is(
        JSON.stringify(state1['1']['mergeCells']),
        JSON.stringify(state2['1']['mergeCells'])
    );
    t.is(state1['1'].col, state2['1'].col);
});

test("merge cells and ic6", t => {
    let op1 = new Change("1", ["mergeCells", "2:3"], {
        rowspan: 2,
        colspan: 2
    });
    let op2 = new Delete("1", "dc", 4);
    let [a, b] = ExcelModel.transform(op1, op2);

    let state1 = b.apply(op1.apply(getState()));
    let state2 = a.apply(op2.apply(getState()));
    t.is(
        JSON.stringify(state1['1']['c']),
        JSON.stringify(state2['1']['c'])
    );
    t.is(
        JSON.stringify(state1['1']['mergeCells']),
        JSON.stringify(state2['1']['mergeCells'])
    );
    t.is(state1['1'].col, state2['1'].col);
});

test("merge cells and dc7", t => {
    let op1 = new Change("1", ["mergeCells", "2:3"], {
        rowspan: 2,
        colspan: 2
    });
    let op2 = new Delete("1", "dc", 6);
    let [a, b] = ExcelModel.transform(op1, op2);

    let state1 = b.apply(op1.apply(getState()));
    let state2 = a.apply(op2.apply(getState()));
    t.is(
        JSON.stringify(state1['1']['c']),
        JSON.stringify(state2['1']['c'])
    );
    t.is(
        JSON.stringify(state1['1']['mergeCells']),
        JSON.stringify(state2['1']['mergeCells'])
    );
    t.is(state1['1'].col, state2['1'].col);
});

test("merge cells and dr5", t => {
    let op1 = new Change("1", ["mergeCells", "2:3"], {
        rowspan: 2,
        colspan: 2
    });
    let op2 = new Delete("1", "dr", 3);
    let [a, b] = ExcelModel.transform(op1, op2);

    let state1 = b.apply(op1.apply(getState()));
    let state2 = a.apply(op2.apply(getState()));
    t.is(
        JSON.stringify(state1['1']['c']),
        JSON.stringify(state2['1']['c'])
    );
    t.is(
        JSON.stringify(state1['1']['mergeCells']),
        JSON.stringify(state2['1']['mergeCells'])
    );
    t.is(state1['1'].col, state2['1'].col);
});

test("merge cells and dr6", t => {
    let op1 = new Change("1", ["mergeCells", "2:3"], {
        rowspan: 2,
        colspan: 2
    });
    let op2 = new Delete("1", "dr", 1);
    let [a, b] = ExcelModel.transform(op1, op2);

    let state1 = b.apply(op1.apply(getState()));
    let state2 = a.apply(op2.apply(getState()));
    t.is(
        JSON.stringify(state1['1']['c']),
        JSON.stringify(state2['1']['c'])
    );
    t.is(
        JSON.stringify(state1['1']['mergeCells']),
        JSON.stringify(state2['1']['mergeCells'])
    );
    t.is(state1['1'].col, state2['1'].col);
});

test("merge cells and dr7", t => {
    let op1 = new Change("1", ["mergeCells", "2:3"], {
        rowspan: 2,
        colspan: 2
    });
    let op2 = new Delete("1", "dr", 6);
    let [a, b] = ExcelModel.transform(op1, op2);

    let state1 = b.apply(op1.apply(getState()));
    let state2 = a.apply(op2.apply(getState()));
    t.is(
        JSON.stringify(state1['1']['c']),
        JSON.stringify(state2['1']['c'])
    );
    t.is(
        JSON.stringify(state1['1']['mergeCells']),
        JSON.stringify(state2['1']['mergeCells'])
    );
    t.is(state1['1'].col, state2['1'].col);
});
