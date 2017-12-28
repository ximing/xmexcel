import CONSTS from '../consts';
import _ from 'lodash';
import {SUPPORTED_FORMULAS} from 'hot-formula-parser';

export const nextTick = function (callback) {
    new Promise(function (res) {
        res();
    }).then(callback);
};
export const keyMirror = function (...args) {
    const obj = {};
    args.forEach(key => {
        obj[key] = key;
    });
    return obj;
};
export const convertToArray = function (sheets, xfs, styles, format = CONSTS.FORMAT) {
    let cells = {};
    Object.keys(sheets).forEach((key) => {
        let sheet;
        if (sheet = sheets[key]) {
            cells[key] = convertCellsToData(sheet.cells, sheet.row, sheet.col, xfs, styles, format);
        }
    });
    return cells;
};


export const convertCellsToData = function (obj, row, col, xfs, styles, format) {
    let arr = [];
    row = Math.max(row, CONSTS.MIN_ROW);
    col = Math.max(col, CONSTS.MIN_COL);
    for (let r = 0; r < row; r++) {
        let colArr = new Array(col);
        for (let c = 0; c < col; c++) {
            // if (!_.isNil(obj[r]) && !_.isNil(obj[r][c]) && !_.isNil(obj[r][c].v)) { DSADSA
            //     colArr[c] = obj[r][c].v;
            // } else {
            //     colArr[c] = '';
            // }
            if (!_.isNil(obj[r]) && obj[r][c]) {
                colArr[c] = obj[r][c].v || '';
            } else {
                colArr[c] = '';
            }
        }
        arr.push(colArr);
    }
    return arr;
};

export const convertCellsToMeta = function (obj, xfs, styles, format) {
    _.forEach(obj, (rowValue, rowKey) => {
        _.forEach(rowValue, (cellValue, colKey) => {
            if (cellValue) {
                delete cellValue.v;
                if (_.isNumber(cellValue.s)) {
                    let _style = {};
                    _.forEach(xfs[cellValue.s], (val, xfsKey) => {
                        //处理 styles 是数组的情况 font: [['b', 'i', 's', 'u']], border: [['left', 'right']],
                        //xfsKey 为  font border color等
                        if (Array.isArray(styles[xfsKey][val])) {
                            styles[xfsKey][val].forEach(v => {
                                _style[v] = true;
                            });
                        } else {
                            _style[xfsKey] = styles[xfsKey][val];
                        }
                    });
                    cellValue.s = _style;
                }
                if (_.isNumber(cellValue.fmt) && format[cellValue.fmt]) {
                    console.log('format[cellValue.fmt]', format[cellValue.fmt]);
                    cellValue.fmt = format[cellValue.fmt];
                }
            }
        });
    });
    return obj;
};

export const convertToDataArray = function (sheets, xfs, styles, format = CONSTS.FORMAT) {
    let cells = {};
    Object.keys(sheets).forEach((key) => {
        let sheet;
        if (sheet = sheets[key]) {
            cells[key] = convertCellsToData(sheet.cells, sheet.row, sheet.col, xfs, styles, format);
        }
    });
    return cells;
};

export const convertToMetaMap = function (sheets, xfs, styles, format = CONSTS.FORMAT) {
    let cells = {};
    Object.keys(sheets).forEach((key) => {
        let sheet;
        if (sheet = sheets[key]) {
            cells[key] = convertCellsToMeta(sheet.cells, xfs, styles, format);
        }
    });
    return cells;
};

export const verifyData = function (data) {
    if (!data.sheets || !_.isObject(data.sheets)) {
        throw new Error('sheets is required');
    }
};

/*
{
    "0": {
        "0": {
            v: 1,
            f: "=SUM(a1,b2)",
            s: 0
        },
        "1": {
            v: 1
        }
    }
}
* */
export const convertSheetStyle = function (cells, row, col, xfs, styles) {
    let style = {};
    _.forEach(cells, function (row, rowKey) {
        style[rowKey] = {};
        _.forEach(row, (cell, colKey) => {
            style[rowKey][colKey] = cell;
            let tempCellStyle = cell.s;
            cell.s = {};
            /* xfs[cell.s]
            * {
                    font: 0,
                    color: 2,
                    bgColor: 0
              }
            * */
            _.forEach(xfs[tempCellStyle], (val, xfsKey) => {
                //处理 styles 是数组的情况 font: [['b', 'i', 's', 'u']], border: [['left', 'right']],
                //xfsKey 为  font border color等
                if (Array.isArray(styles[xfsKey][val])) {
                    styles[xfsKey][val].forEach(v => {
                        cell.s[v] = true;
                    });
                } else {
                    cell.s[xfsKey] = styles[xfsKey][val];
                }
            });
        });
    });
    return style;
};

export const convertStyle = function (data) {
    let styles = {};
    Object.keys(data.sheets).forEach((key) => {
        let sheet;
        if (sheet = data.sheets[key]) {
            styles[key] = convertSheetStyle(sheet.cells, sheet.row, sheet.col, data.xfs, data.styles);
        }
    });
    console.log('styles', styles);
    return styles;
};

export function platform() {
    let p = navigator.platform;
    return p.indexOf('Win') === 0 ? 'windows' : 'mac';
}

export const getCtrl = function () {
    return platform() === 'mac' ? 'Cmd' : 'Ctrl';
};

export const isFormula = function (str) {
    return /^=(ABS|ACCRINT|ACOS|ACOSH|ACOT|ACOTH|ADD|AGGREGATE|AND|ARABIC|ARGS2ARRAY|ASIN|ASINH|ATAN|ATAN2|ATANH|AVEDEV|AVERAGE|AVERAGEA|AVERAGEIF|AVERAGEIFS|BASE|BESSELI|BESSELJ|BESSELK|BESSELY|BETA.DIST|BETA.INV|BETADIST|BETAINV|BIN2DEC|BIN2HEX|BIN2OCT|BINOM.DIST|BINOM.DIST.RANGE|BINOM.INV|BINOMDIST|BITAND|BITLSHIFT|BITOR|BITRSHIFT|BITXOR|CEILING|CEILINGMATH|CEILINGPRECISE|CHAR|CHISQ.DIST|CHISQ.DIST.RT|CHISQ.INV|CHISQ.INV.RT|CHOOSE|CHOOSE|CLEAN|CODE|COLUMN|COLUMNS|COMBIN|COMBINA|COMPLEX|CONCATENATE|CONFIDENCE|CONFIDENCE.NORM|CONFIDENCE.T|CONVERT|CORREL|COS|COSH|COT|COTH|COUNT|COUNTA|COUNTBLANK|COUNTIF|COUNTIFS|COUNTIN|COUNTUNIQUE|COVARIANCE.P|COVARIANCE.S|CSC|CSCH|CUMIPMT|CUMPRINC|DATE|DATEVALUE|DAY|DAYS|DAYS360|DB|DDB|DEC2BIN|DEC2HEX|DEC2OCT|DECIMAL|DEGREES|DELTA|DEVSQ|DIVIDE|DOLLAR|DOLLARDE|DOLLARFR|E|EDATE|EFFECT|EOMONTH|EQ|ERF|ERFC|EVEN|EXACT|EXP|EXPON.DIST|EXPONDIST|F.DIST|F.DIST.RT|F.INV|F.INV.RT|FACT|FACTDOUBLE|FALSE|FDIST|FDISTRT|FIND|FINV|FINVRT|FISHER|FISHERINV|FIXED|FLATTEN|FLOOR|FORECAST|FREQUENCY|FV|FVSCHEDULE|GAMMA|GAMMA.DIST|GAMMA.INV|GAMMADIST|GAMMAINV|GAMMALN|GAMMALN.PRECISE|GAUSS|GCD|GEOMEAN|GESTEP|GROWTH|GTE|HARMEAN|HEX2BIN|HEX2DEC|HEX2OCT|HOUR|HTML2TEXT|HYPGEOM.DIST|HYPGEOMDIST|IF|IMABS|IMAGINARY|IMARGUMENT|IMCONJUGATE|IMCOS|IMCOSH|IMCOT|IMCSC|IMCSCH|IMDIV|IMEXP|IMLN|IMLOG10|IMLOG2|IMPOWER|IMPRODUCT|IMREAL|IMSEC|IMSECH|IMSIN|IMSINH|IMSQRT|IMSUB|IMSUM|IMTAN|INT|INTERCEPT|INTERVAL|IPMT|IRR|ISBINARY|ISBLANK|ISEVEN|ISLOGICAL|ISNONTEXT|ISNUMBER|ISODD|ISODD|ISOWEEKNUM|ISPMT|ISTEXT|JOIN|KURT|LARGE|LCM|LEFT|LEN|LINEST|LN|LOG|LOG10|LOGEST|LOGNORM.DIST|LOGNORM.INV|LOGNORMDIST|LOGNORMINV|LOWER|LT|LTE|MATCH|MAX|MAXA|MEDIAN|MID|MIN|MINA|MINUS|MINUTE|MIRR|MOD|MODE.MULT|MODE.SNGL|MODEMULT|MODESNGL|MONTH|MROUND|MULTINOMIAL|MULTIPLY|NE|NEGBINOM.DIST|NEGBINOMDIST|NETWORKDAYS|NOMINAL|NORM.DIST|NORM.INV|NORM.S.DIST|NORM.S.INV|NORMDIST|NORMINV|NORMSDIST|NORMSINV|NOT|NOW|NPER|NPV|NUMBERS|NUMERAL|OCT2BIN|OCT2DEC|OCT2HEX|ODD|OR|PDURATION|PEARSON|PERCENTILEEXC|PERCENTILEINC|PERCENTRANKEXC|PERCENTRANKINC|PERMUT|PERMUTATIONA|PHI|PI|PMT|POISSON.DIST|POISSONDIST|POW|POWER|PPMT|PROB|PRODUCT|PROPER|PV|QUARTILE.EXC|QUARTILE.INC|QUARTILEEXC|QUARTILEINC|QUOTIENT|RADIANS|RAND|RANDBETWEEN|RANK.AVG|RANK.EQ|RANKAVG|RANKEQ|RATE|REFERENCE|REGEXEXTRACT|REGEXMATCH|REGEXREPLACE|REPLACE|REPT|RIGHT|ROMAN|ROUND|ROUNDDOWN|ROUNDUP|ROW|ROWS|RRI|RSQ|SEARCH|SEC|SECH|SECOND|SERIESSUM|SIGN|SIN|SINH|SKEW|SKEW.P|SKEWP|SLN|SLOPE|SMALL|SPLIT|SPLIT|SQRT|SQRTPI|STANDARDIZE|STDEV.P|STDEV.S|STDEVA|STDEVP|STDEVPA|STDEVS|STEYX|SUBSTITUTE|SUBTOTAL|SUM|SUMIF|SUMIFS|SUMPRODUCT|SUMSQ|SUMX2MY2|SUMX2PY2|SUMXMY2|SWITCH|SYD|T|T.DIST|T.DIST.2T|T.DIST.RT|T.INV|T.INV.2T|TAN|TANH|TBILLEQ|TBILLPRICE|TBILLYIELD|TDIST|TDIST2T|TDISTRT|TEXT|TIME|TIMEVALUE|TINV|TINV2T|TODAY|TRANSPOSE|TREND|TRIM|TRIMMEAN|TRUE|TRUNC|UNICHAR|UNICODE|UNIQUE|UPPER|VALUE|VAR.P|VAR.S|VARA|VARP|VARPA|VARS|WEEKDAY|WEEKNUM|WEIBULL.DIST|WEIBULLDIST|WORKDAY|XIRR|XNPV|XOR|YEAR|YEARFRAC)/i.test(str);
};

export const addStyle = function (node, key, val) {
    node.style[key] = val;
};
export const appendStyle = function (node, key, val) {
    node.style[key] += ` ${val}`;
};

export const addFontStyleToNode = function (node, key, val) {
    // console.log('addFontStyleToNode', key, val)
    if (key === 'b' && val) {
        addStyle(node, 'fontWeight', 'bold');
    } else if (key === 'i' && val) {
        addStyle(node, 'fontStyle', 'italic');
    } else if (key === 'u' && val) {
        appendStyle(node, 'textDecoration', 'underline');
    } else if (key === 's' && val) {
        appendStyle(node, 'textDecoration', 'line-through');
    }
};

export const addMarkToNode = function (node, key, val) {
    if (key === 'v' && val) {
        addStyle(node, 'vertical-align', val);
    } else if (key === 'h' && val) {
        addStyle(node, 'text-align', val);
    } else if (key === 'w' && val === 'wrap') {
        addStyle(node, 'word-wrap', 'break-word');
        addStyle(node, 'white-space', 'pre-wrap');
    } else if (key === 'color') {
        addStyle(node, 'color', val);
    } else if (key === 'bgColor') {
        addStyle(node, 'background-color', val);
    } else if (key === 'fontSize') {
        addStyle(node, 'font-size', val);
        addStyle(node, 'line-height', 1.2);
        addStyle(node, 'height', val || '23px');
    }
};

export const defaultStyleBehavior = function (node, value, cellMeta) {
    if (cellMeta) {
        if (!cellMeta.fmt || cellMeta.fmt !== 'text') {
            if (value != null && value != '' && !isNaN(Number(value))) {
                addStyle(node, 'text-align', 'right');
            }
        }
    }
};

export const injectStyle = function (node, value, cellMeta) {
    if (cellMeta) {
        defaultStyleBehavior(node, value, cellMeta);
        _.forEach(cellMeta.s, (val, key) => {
            addFontStyleToNode(node, key, val);
            addMarkToNode(node, key, val);
        });
    }
};

//10进制转26进制
export const convertDSTo26BS = function (num) {
    let code = '';
    let reg = /^\d+$/g;
    if (!reg.test(num)) {
        return code;
    }
    while (num > 0) {
        let m = num % 26;
        if (m == 0) {
            m = 26;
        }
        code = String.fromCharCode(64 + parseInt(m)) + code;
        num = (num - m) / 26;
    }
    return code;
};
//26进制转10进制
export const convert26BSToDS = function (code) {
    var num = -1;
    var reg = /^[A-Z]+$/g;
    if (!reg.test(code)) {
        return num;
    }
    num = 0;
    for (var i = code.length - 1, j = 1; i >= 0; i--, j *= 26) {
        num += (code[i].charCodeAt() - 64) * j;
    }
    return num;
};


export const mergeCellData = function (oldData, newData, overwrite = false) {
    Object.keys(newData).forEach(key => {
        if (key === 's') {
            if (overwrite) {
                oldData[key] = Object.assign({}, newData[key]);
            } else {
                oldData[key] = Object.assign({}, oldData[key], newData[key]);
            }
        } else {
            oldData[key] = newData[key];
        }

    });
    return oldData;
};

export const swap = function (a, b) {
    let temp = a;
    b = a;
    a = temp;
};

export const selectionSwap = function (row, col, endRow, endCol) {
    if (row > endRow) {
        endRow = [row, row = endRow][0];
    }
    if (col > endCol) {
        endCol = [col, col = endCol][0];
    }
    return [row, col, endRow, endCol];
};


/**
 * 检测某个节点是否包含在另一节点中
 * @param a 父节点
 * @param b 子节点
 * @returns {boolean|*}
 */
export function contains(a, b) {
    return (a == b) || (a && a.contains ?
        (a != b && a.contains(b)) :
        !!(a.compareDocumentPosition(b) & 16));
}

export function is(type, obj) {
    var clas = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== undefined && obj !== null && clas === type;
}

export function loop() {
}

export function convertEditorStateToSnap(editorState) {

}
