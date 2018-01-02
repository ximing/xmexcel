/**
 * Created by ximing on 12/27/17.
 */
'use strict';
import {shortid, shortid1} from './cellsData';

export const defaultData = {
    "sheets": {
        shortid: {
            title: "表格1",
            cells: shortid,
            cellMetas: {
                "0": {
                    "0": {
                        "marks": [{
                            key: "b",
                            val: true
                        }, {
                            key: "i",
                            val: true
                        }, {
                            key: "color",
                            val: "#ffffff"
                        }, {
                            key: "bgColor",
                            val: "rgb(182, 221, 232)"
                        }
                        ],
                        "fmt": "0 %"
                    },
                    "1": {},
                    "2": {"f": "=SUM($d$1:d$3,$b2)"},
                    "3": {},
                    "5": {}
                },
                "1": {"1": {}, "3": {}, "5": {}},
                "2": {"0": {"f": "=SUM(1,"}, "1": {"f": "=SUM(a2,b1,SUM(b2,c1))"}, "3": {}, "5": {}},
                "3": {"3": {"f": "=SUM(D3,D2)"}, "4": {"f": "=SUM(D3)"}, "5": {}},
                "4": {"5": {}},
                "5": {"5": {}}
            },
            "mergeCells": [{"row": 4, "col": 0, "rowspan": 2, "colspan": 1}],
            "hiddenRows": [8, 9, 10],
            "meta": {"row": {"1": {"h": 40}}, "col": {"1": {"w": 300}}},
            "fixed": {"fixedRowsTop": 0, "fixedColumnsLeft": 0},
            "filter": {
                "filterId": "12345432",
                "enable": true,
                "range": {"row": 0, "col": 5, "rowspan": 10, "colspan": 1},
                "col": {"3": {"condition": {"type": "value", "value": ["2"]}}}
            },
            selection: [0, 0, 0, 0]
        },
        shortid1: {
            title: "表格2",
            cells: shortid1,
            cellMetas: {
                "0": {
                    "0": {
                        "marks": [{
                            key: "b",
                            val: true
                        }, {
                            key: "i",
                            val: true
                        }, {
                            key: "color",
                            val: "#ffffff"
                        }, {
                            key: "bgColor",
                            val: "#3fdaff"
                        }
                        ]
                    },
                    "1": {},
                    "2": {"f": "=SUM($d$1:d$3,$b2)"},
                    "3": {},
                    "5": {}
                }
            }

        },
    },
    "activeSheetId": "shortid1",
    "sheetOrder": ["shortid", "shortid1"]
};
