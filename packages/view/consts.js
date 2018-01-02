import shortid from 'shortid';

let defaultKey = shortid.generate();

export default {
    /**
     * Component names
     * @type {Object.<string, string>}
     */
    moduleNames: {
        'MAIN': 'MAIN',
        'STYLE': 'STYLE',
        'VIEW': 'VIEW',
        'HISTORY': 'history',
        'KEYMAP': 'keymap',
        'ASYNC_COMPUTE': 'ASYNC_COMPUTE',
        'COORDINATE_TRANSFORM': 'COORDINATE_TRANSFORM',
        'COMMAND': 'COMMAND'
    },

    /**
     * Command names
     * @type {Object.<string, string>}
     */
    commandNames: {
        ALIGN: 'align',
        FILL: 'fill',
        FONT: 'font',
        RESIZE_ROW: 'resize_row',
        RESIZE_COL: 'resize_col',
        INSERT_ROW: 'insert_row',
        INSERT_COL: 'insert_col',
        REMOVE_ROW: 'remove_row',
        REMOVE_COL: 'remove_col',
        FIX_ROW: 'fix_row',
        FIX_COL: 'fix_col',
        REMOVE_STYLE: 'remove_style',
        MERGE_CELL: 'merge_cell',
        UNMERGE_CELL: 'unmerge_cell',
        SET_FILTER: 'set_filter',
        CREATE_FILTER: 'create_filter',
        DISABLE_FILTER: 'disable_filter',
        SHOW_ROWS: 'show_rows',
        HIDE_ROWS: 'hide_rows',
        VALUE: 'value',
        SORT: 'sort',
        FORMUAL: 'formual',
        FORMAT: 'format',
        COMPOUND: 'compound'
    },

    /**
     * Event names
     * @type {Object.<string, string>}
     */
    eventNames: {
        BEFORE_CHANGE: 'before-change',
        CHANGE: 'change',
        BEFORE_COMMAND: 'before_command',
        AFTER_COMMAND: 'after_command'
    },

    source: {
        SILENCE: 'silence',
        USER: 'user',
        API: 'api'
    },

    /**
     * Editor states
     * @type {Object.<string, string>}
     */
    states: {},

    MIN_ROW: 100,

    MIN_COL: 40,

    DEFAULT_STATE: {
        sheets: {
            [defaultKey]: {
                title: 'sheet_1',
                cells: {},
                col: 0,
                row: 0,
                filter: {},
                mergeCells: [],
                meta: {
                    row: {},
                    col: {}
                },
                selection: [0, 0, 0, 0]
            }
        }
    },

    FORMAT: ['@', '0,000', '0,000.000', '0 %', '0.000 %', '0.00e+0',
        '$0,000', '￥0,000', '$0,000.00', '￥0,000.00',
        'YYYY-MM-DD', 'YYYY/MM/DD', 'YYYY-MM-DD HH:mm:ss', 'HH:mm:ss'],
    FORMAT_MAP: {
        '@': '文本', '0,000': '数字', '0,000.000': '数字(小数点)',
        '0 %': '百分比', '0.000 %': '百分比(小数点)', '0.00e+0': '科学计数',
        '$0,000': '货币', '￥0,000': '货币', '$0,000.00': '货币(小数点)', '￥0,000.00': '货币(小数点)',
        'YYYY-MM-DD': '日期', 'YYYY/MM/DD': '日期', 'HH:mm:ss': '时间', 'YYYY-MM-DD HH:mm:ss': '日期时间'
    },
    fn: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAcCAYAAAB75n/uAAAAAXNSR0IArs4c6QAAAwVJREFUSA3VlUtoU1EQhpvkNtW0SFwaob4o1Sqo6FoQBJ8LNz5QClVqmkITG1y4UDGgIu4SG9skIoKgYLci6qK6sCJqH6AFUdwJSVsUJTRtKXn4Tbgp15tzvSniwgMn58ycf/6ZMzPnpq7uHw/HUvkjkYgznU5v0zTtc39//4ydvdMOYDwPBALhTCYzjW40n89PIq81nqv2mkpp1oXD4eWzs7P3i8XihMvlaikUChGHw3HS6XTOm7FmuSYHc3NzFzHc5fP5jpKiPPuz+jTzVcm2Neju7m4l4vdE/CCZTJ6qYrBR2NaAtJyDw818YcOlPLZ1UCqV9oslNxhTMtgoLVMUDAZX0CltpOc1HPONjY2rkfPIxVras+JXeYOurq4rCwsL30nPKx24LJfLfUU3joNgxbiW1fIGYoyju6Sog/TcpsD+WgjNmD+2KeSbdYMPZkORCWAry03mPQK4Izoe33bsZD+GrlOZIgECInDHJn0/Iatx0L7rwVxH18x6ze/310tLk9Yk8ih6efF1ljfo6ekRwyYBNTQ0VDmAaIPX6z2WzWaPg0sBO4Ku3e12H47H42mxk2FZA65/AMPHYDKpVMpXRit+iHolhZ/itjPg94D9rZ0tUwRXm/BhOK7gXVQNDAz8QBhm1tPKHxcP9I2lA6LZomNGzEZGmRvsIIg14Jv4IJYfpfHc0gFG5Q7C8K3RwLjv7e31kp4oX9i94PNg2+Wcgq+Shyp7pYPBwUEXYElRgQK/FKBxQHCJdrxAxG/4ZF/mZX/h/ClODlG7AOstnJa5lV00NDTUioGH+a6vry9rJJc9BKfpGB/rmUQi8Vx0BHQDeR9riE46GI1Gf4pe6QCgPBYheiIg8+DvcidTi8ViU5UzumeYmzXzuCaxK1X0yjYFGAMQgqNFv34Fv+RVWQNYdhPFs78ll2iqUsQLXsdXcyMOTiw5XIWBRjqE7DzdEGedhjzKGqJ4VZ8Hhb2tSlLUSUE76OcR5ifkRxQqYWtZI0DzeDxX6edvRO3mFg95+uLk/xm/ACSoR2rr87JkAAAAAElFTkSuQmCC',
    FORMULA_COLOR: ['#00ace5', '#f2b600', '#3380cc', '#fa9119',
        '#a36cd9', '#12b2b2', '#f2798d', '#62b312'],
    meta: {
        row: {},
        col: {}
    },
    emptyCell: {
        v: '',
        f: '',
        fmt: '',
        s: {}
    },
    regex: {
        labelCoordinate: /(\$?[a-zA-Z]+\$?\d+)/g,
        labelCoordinates: /(\$?[a-zA-Z]+\$?\d+:\$?[a-zA-Z]+\$?\d+)|(\$?[a-zA-Z]+\$?\d+)/g
    }
};
