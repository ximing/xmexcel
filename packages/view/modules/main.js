/**
 * Created by ximing on 12/27/17.
 */
'use strict';
import _ from 'lodash';
import Handsontable from '../handsontable/src/index';
import HiddenRows from '../plugins/DXHiddenRows/hiddenRows';
import DXCopyPaste from '../plugins/DXCopyPaste/dxCopyPaste';
import DXExcelEditor from '../plugins/DXExcelEditor';
import FormulaSelection from '../plugins/FormulaSelection';
import NumFmt from '../utils/numFmt';
import CONSTS from '../consts';

Handsontable.editors.registerEditor('text', DXExcelEditor);

export default class Main {
    constructor(dom, view) {
        this.name = CONSTS.moduleNames.MAIN;
        this.dom = dom;
        this.view = view;
        let {width, height} = this.dom.getBoundingClientRect();
        this.width = width;
        this.height = height;
        this.setUpHandsontable();
    }

    setUpHandsontable() {
        window.handsontableInstance = this.hot = new Handsontable(this.dom, {
            data: this.view.doc.getActiveData(),
            colHeaders: true,
            rowHeaders: true,
            maxCols: 20000,
            undo: false,
            formulas: true,
            fixedRowsTop: 0,
            width: this.width,
            height: this.height,
            observeChanges: true,
            mergeCells: true,
            dxUndoRedo: true,
            copyPaste: false,
            dxCopyPaste: true,
            fillHandle: true,
            manualColumnResize: true,
            manualRowResize: true,
            outsideClickDeselects: false,
            comments: false,
            cell: [],
            dxHiddenRows: {
                rows: [],
                indicators: true
            },
            beforeInitWalkontable: function (walkontableConfig) {
                FormulaSelection.getSingleton().init(walkontableConfig.selections);
            },
            columns: (index) => {
                return {
                    editor: 'text'
                };
            },
            rowHeights: (index) => {
                let meta = this.getActiveMeta();
                if (meta && meta['row'] && meta['row'][index]) {
                    return meta['row'][index]['h'] || 23;
                }
                return 23;
            },
            colWidths: (index) => {
                let meta = this.getActiveMeta();
                if (meta && meta['col'] && meta['col'][index]) {
                    return meta['col'][index]['w'] || 100;
                }
                return 100;
            },
            afterColumnResize: (currentCol, newSize) => {
                // boot.applyCommand(new ResizeCol(this.getActiveSheetId(), currentCol, newSize));
            },
            afterRowResize: (currentRow, newSize) => {
                // boot.applyCommand(new ResizeRow(this.getActiveSheetId(), currentRow, newSize));
            },
            renderer: (instance, td, row, col, prop, value, cellProperties) => {
                let cellMeta = this.view.state.getActiveSheet().getCellMeta(row, col);
                if (cellMeta) {
                    cellMeta.getMarks.forEach(mark => {
                        if (this.view.state.schema.marks[mark.key]) {
                            this.view.state.schema.marks[mark.key](td, mark.val);
                        }
                    });
                    if (cellMeta.fmt) {
                        let vNumber = Number(value);
                        td.innerHTML = NumFmt.parse(value, _.isNaN(vNumber) ? null : cellMeta.fmt);
                    } else {
                        td.innerHTML = value;
                    }
                }

                // let filter = this.getSheet().filter;
                // if (filter && filter.enable && filter.range &&
                //     row === filter.range.row &&
                //     (col >= filter.range.col && col < filter.range.col + filter.range.colspan)
                // ) {
                //     renderFilter(td, row, col);
                // }
            },


            beforeCut(...args) {
                // console.log('beforeCut', args);
            },
            afterCut(...args) {
                // console.log('afterCut', args);
            },
            beforePaste(...args) {
                // console.log('beforePaste', args);
            },
            beforeCopy(...args) {
                // console.log('beforePaste', args);
            },
            afterCopy(...args) {
                // console.log('afterCopy', args);
            },
            afterPaste(...args) {
                // console.log('afterPaste', args);
            },
            // modifyData(...args){
            //     console.log('modifyData', args);
            // },
            beforeSetRangeStartOnly(...args) {
                // console.log('beforeSetRangeStartOnly', args);
            },
            beforeSetRangeStart(...args) {
                // console.log('beforeSetRangeStart', args);
            },
            beforeStretchingColumnWidth(...args) {
                // console.log('beforeStretchingColumnWidth', args);
            },
            afterDeselect(...args) {
                // console.log('afterDeselect', args);
            },
            beforeRenderer(...args) {
                // console.log('beforeRenderer',args)
            },
            afterChangesObserved: (...args) => {
                // console.log('afterChangesObserved', args);
            },
            afterUpdateSettings: () => {
            },
            afterRemoveCol(...args) {
                // console.log('afterRemoveCol', args);
            },
            afterRemoveRow(...args) {
                // console.log('afterRemoveRow', args);
            },
            afterSelectionEnd(...args) {
                // console.log('afterSelectionEnd', args);
                // boot.emit('selection', ...args);
            },
            afterSetDataAtCell(data, type) {
                // console.log('afterSetDataAtCell', data, type);
            }
        });
    }


    render() {

    }

    updateSettings() {

    }

    updateData() {

    }
}
