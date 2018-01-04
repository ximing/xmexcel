/**
 * Created by ximing on 10/29/17.
 */
'use strict';
import BasePlugin from '../../handsontable/src/plugins/_base.js';
import Hooks from '../../handsontable/src/pluginHooks';
import SheetClip from './SheetClip';
import {CellCoords, CellRange} from '../../handsontable/src/3rdparty/walkontable/src';
import {getSelectionText} from '../../handsontable/src/helpers/dom/element';
import {arrayEach} from '../../handsontable/src/helpers/array';
import {rangeEach} from '../../handsontable/src/helpers/number';
import {registerPlugin, getPlugin} from '../../handsontable/src/plugins';
import Contenteditable from './contenteditable.js';
import EventManager from '../../handsontable/src/eventManager';
import PasteEvent from './pasteEvent';
// import Bootstrap from '../../bootstrap';

import './dxCopyPaste.scss';

Hooks.getSingleton().register('afterCopyLimit');
Hooks.getSingleton().register('modifyCopyableRange');
Hooks.getSingleton().register('beforeCut');
Hooks.getSingleton().register('afterCut');
Hooks.getSingleton().register('beforePaste');
Hooks.getSingleton().register('afterPaste');
Hooks.getSingleton().register('beforeCopy');
Hooks.getSingleton().register('afterCopy');

const ROWS_LIMIT = 1000;
const COLUMNS_LIMIT = 1000;
const privatePool = new WeakMap();

/**
 * @description
 * This plugin enables the copy/paste functionality in the Handsontable.
 *
 * @example
 * ```js
 * ...
 * dxCopyPaste: true,
 * ...
 * ```
 * @class DXCopyPaste
 * @plugin DXCopyPaste
 */
class DXCopyPaste extends BasePlugin {
    constructor(hotInstance) {
        super(hotInstance);

        // this.boot = Bootstrap.getSingleton();
        /**
         * Event manager
         *
         * @type {EventManager}
         */
        this.eventManager = new EventManager(this);
        /**
         * Maximum number of columns than can be copied to clipboard using <kbd>CTRL</kbd> + <kbd>C</kbd>.
         *
         * @private
         * @type {Number}
         * @default 1000
         */
        this.columnsLimit = COLUMNS_LIMIT;
        /**
         * Ranges of the cells coordinates, which should be used to copy/cut/paste actions.
         *
         * @private
         * @type {Array}
         */
        this.copyableRanges = [];
        /**
         * Defines paste (<kbd>CTRL</kbd> + <kbd>V</kbd>) behavior.
         * * Default value `"overwrite"` will paste clipboard value over current selection.
         * * When set to `"shift_down"`, clipboard data will be pasted in place of current selection, while all selected cells are moved down.
         * * When set to `"shift_right"`, clipboard data will be pasted in place of current selection, while all selected cells are moved right.
         *
         * @private
         * @type {String}
         * @default 'overwrite'
         */
        this.pasteMode = 'overwrite';
        /**
         * Maximum number of rows than can be copied to clipboard using <kbd>CTRL</kbd> + <kbd>C</kbd>.
         *
         * @private
         * @type {Number}
         * @default 1000
         */
        this.rowsLimit = ROWS_LIMIT;
        /**
         * The `contenteditable` element which is necessary to process copying, cutting off and pasting.
         *
         * @private
         * @type {HTMLElement}
         * @default undefined
         */
        this.contenteditable = void 0;

        privatePool.set(this, {
            isTriggeredByCopy: false,
            isTriggeredByCut: false,
            isBeginEditing: false,
            isFragmentSelectionEnabled: false
        });
    }

    /**
     * Check if plugin is enabled.
     *
     * @returns {Boolean}
     */
    isEnabled() {
        return !!this.hot.getSettings().dxCopyPaste;
    }

    /**
     * Enable the plugin.
     */
    enablePlugin() {
        if (this.enabled) {
            return;
        }
        const settings = this.hot.getSettings();
        const priv = privatePool.get(this);

        this.contenteditable = Contenteditable.getSingleton();
        priv.isFragmentSelectionEnabled = settings.fragmentSelection;

        if (typeof settings.dxCopyPaste === 'object') {
            this.pasteMode = settings.dxCopyPaste.pasteMode || this.pasteMode;
            this.rowsLimit = settings.dxCopyPaste.rowsLimit || this.rowsLimit;
            this.columnsLimit = settings.dxCopyPaste.columnsLimit || this.columnsLimit;
        }

        this.addHook('afterSelectionEnd', () => this.onAfterSelectionEnd());

        this.registerEvents();

        super.enablePlugin();
    }

    /**
     * Updates the plugin to use the latest options you have specified.
     */
    updatePlugin() {
        this.disablePlugin();
        this.enablePlugin();

        super.updatePlugin();
    }

    /**
     * Disable plugin for this Handsontable instance.
     */
    disablePlugin() {
        if (this.contenteditable) {
            this.contenteditable.destroy();
        }

        super.disablePlugin();
    }

    /**
     * Prepares copyable text from the cells selection in the invisible contenteditable.
     *
     * @function setCopyable
     * @memberof CopyPaste#
     */
    setCopyableText() {
        let selRange = this.hot.getSelectedRange();

        if (!selRange) {
            return;
        }

        let topLeft = selRange.getTopLeftCorner();
        let bottomRight = selRange.getBottomRightCorner();
        let startRow = topLeft.row;
        let startCol = topLeft.col;
        let endRow = bottomRight.row;
        let endCol = bottomRight.col;
        let finalEndRow = Math.min(endRow, startRow + this.rowsLimit - 1);
        let finalEndCol = Math.min(endCol, startCol + this.columnsLimit - 1);

        this.copyableRanges.length = 0;

        this.copyableRanges.push({
            startRow,
            startCol,
            endRow: finalEndRow,
            endCol: finalEndCol
        });

        this.copyableRanges = this.hot.runHooks('modifyCopyableRange', this.copyableRanges);

        if (endRow !== finalEndRow || endCol !== finalEndCol) {
            this.hot.runHooks('afterCopyLimit', endRow - startRow + 1, endCol - startCol + 1, this.rowsLimit, this.columnsLimit);
        }
    }

    /**
     * Create copyable text releated to range objects.
     *
     * @since 0.19.0
     * @param {Array} ranges Array of Objects with properties `startRow`, `endRow`, `startCol` and `endCol`.
     * @returns {String} Returns string which will be copied into clipboard.
     */
    getRangedCopyableData(ranges) {
        let dataSet = [];
        let copyableRows = [];
        let copyableColumns = [];

        // Count all copyable rows and columns
        arrayEach(ranges, (range) => {
            rangeEach(range.startRow, range.endRow, (row) => {
                if (copyableRows.indexOf(row) === -1) {
                    copyableRows.push(row);
                }
            });
            rangeEach(range.startCol, range.endCol, (column) => {
                if (copyableColumns.indexOf(column) === -1) {
                    copyableColumns.push(column);
                }
            });
        });
        // Concat all rows and columns data defined in ranges into one copyable string
        arrayEach(copyableRows, (row) => {
            let rowSet = [];

            arrayEach(copyableColumns, (column) => {
                rowSet.push(this.hot.getCopyableData(row, column));
            });

            dataSet.push(rowSet);
        });
        return SheetClip.stringify(dataSet);
    }

    /**
     * Create copyable text releated to range objects.
     *
     * @since 0.31.1
     * @param {Array} ranges Array of Objects with properties `startRow`, `startCol`, `endRow` and `endCol`.
     * @returns {Array} Returns array of arrays which will be copied into clipboard.
     */
    getRangedData(ranges) {
        let dataSet = [];
        let copyableRows = [];
        let copyableColumns = [];

        // Count all copyable rows and columns
        arrayEach(ranges, (range) => {
            rangeEach(range.startRow, range.endRow, (row) => {
                if (copyableRows.indexOf(row) === -1) {
                    copyableRows.push(row);
                }
            });
            rangeEach(range.startCol, range.endCol, (column) => {
                if (copyableColumns.indexOf(column) === -1) {
                    copyableColumns.push(column);
                }
            });
        });
        // Concat all rows and columns data defined in ranges into one copyable string
        arrayEach(copyableRows, (row) => {
            let rowSet = [];

            arrayEach(copyableColumns, (column) => {
                rowSet.push(this.hot.getCopyableData(row, column));
            });

            dataSet.push(rowSet);
        });

        return dataSet;
    }


    getRangedMeta(ranges) {
        let dataSet = [];
        let copyableRows = [];
        let copyableColumns = [];

        // Count all copyable rows and columns
        arrayEach(ranges, (range) => {
            rangeEach(range.startRow, range.endRow, (row) => {
                if (copyableRows.indexOf(row) === -1) {
                    copyableRows.push(row);
                }
            });
            rangeEach(range.startCol, range.endCol, (column) => {
                if (copyableColumns.indexOf(column) === -1) {
                    copyableColumns.push(column);
                }
            });
        });
        // Concat all rows and columns data defined in ranges into one copyable string
        arrayEach(copyableRows, (row) => {
            let rowSet = [];

            arrayEach(copyableColumns, (column) => {
                rowSet.push(this.boot.getMainModule().getCellMeta(row, column));
            });

            dataSet.push(rowSet);
        });

        return dataSet;
    }

    /**
     * Copy action.
     */
    copy() {
        const priv = privatePool.get(this);

        priv.isTriggeredByCopy = true;

        this.contenteditable.select();
        document.execCommand('copy');
    }

    /**
     * Cut action.
     */
    cut() {
        const priv = privatePool.get(this);

        priv.isTriggeredByCut = true;

        this.contenteditable.select();
        document.execCommand('cut');
    }

    /**
     * Simulated paste action.
     *
     * @param {String} [value=''] New value, which should be `pasted`.
     */
    paste(value = '') {
        let pasteData = new PasteEvent();
        pasteData.clipboardData.setData('text/html', value);

        this.onPaste(pasteData);
    }

    /**
     * Register event listeners.
     *
     * @private
     */
    registerEvents() {
        this.eventManager.addEventListener(this.contenteditable.element, 'paste', (event) => this.onPaste(event));
        this.eventManager.addEventListener(this.contenteditable.element, 'cut', (event) => this.onCut(event));
        this.eventManager.addEventListener(this.contenteditable.element, 'copy', (event) => this.onCopy(event));
    }

    /**
     * `copy` event callback on contenteditable element.
     *
     * @param {Event} event ClipboardEvent.
     * @private
     */
    onCopy(event) {
        const priv = privatePool.get(this);

        if (!this.hot.isListening() && !priv.isTriggeredByCopy) {
            return;
        }

        this.setCopyableText();
        priv.isTriggeredByCopy = false;

        let rangedData = this.getRangedData(this.copyableRanges);
        let rangedMeta = this.getRangedMeta(this.copyableRanges);

        let allowCopying = !!this.hot.runHooks('beforeCopy', rangedData, this.copyableRanges);
        let value = '';

        if (allowCopying) {
            value = SheetClip.stringify(rangedData, rangedMeta);

            if (event && event.clipboardData) {
                event.clipboardData.setData('text/html', value);

            } else if (typeof ClipboardEvent === 'undefined') {
                window.clipboardData.setData('Html', value);
            }

            this.hot.runHooks('afterCopy', rangedData, this.copyableRanges);
        }

        event.preventDefault();
    }

    /**
     * `cut` event callback on contenteditable element.
     *
     * @param {Event} event ClipboardEvent.
     * @private
     */
    onCut(event) {
        const priv = privatePool.get(this);

        if (!this.hot.isListening() && !priv.isTriggeredByCut) {
            return;
        }

        this.setCopyableText();
        priv.isTriggeredByCut = false;

        let rangedData = this.getRangedData(this.copyableRanges);
        let allowCuttingOut = !!this.hot.runHooks('beforeCut', rangedData, this.copyableRanges);
        let value;

        if (allowCuttingOut) {
            //TODO 粘贴的时候  添加样式
            value = SheetClip.stringify(rangedData);

            if (event && event.clipboardData) {
                event.clipboardData.setData('text/html', value);

            } else if (typeof ClipboardEvent === 'undefined') {
                window.clipboardData.setData('Text', value);
            }

            this.hot.selection.empty();
            this.hot.runHooks('afterCut', rangedData, this.copyableRanges);
        }

        event.preventDefault();
    }

    /**
     * `paste` event callback on contenteditable element.
     *
     * @param {Event} event ClipboardEvent or pseudo ClipboardEvent, if paste was called manually.
     * @private
     */
    onPaste(event) {
        if (!this.hot.isListening()) {
            return;
        }
        if (event && event.preventDefault) {
            event.preventDefault();
        }

        let inputArray;

        if (event && typeof event.clipboardData !== 'undefined') {
            this.contenteditable.setValue(event.clipboardData.getData('text/html') || event.clipboardData.getData('text/plain'));

        } else if (typeof ClipboardEvent === 'undefined' && typeof window.clipboardData !== 'undefined') {
            this.contenteditable.setValue(window.clipboardData.getData('HTML') || event.clipboardData.getData('Text'));
        }

        inputArray = SheetClip.parse(this.contenteditable.getValue());
        this.contenteditable.setValue(' ');

        if (inputArray.length === 0) {
            return;
        }

        let allowPasting = !!this.hot.runHooks('beforePaste', inputArray, this.copyableRanges);
        console.log('allowPasting', allowPasting, this.copyableRanges);
        if (!allowPasting) {
            return;
        }

        let selected = this.hot.getSelected();
        let coordsFrom = new CellCoords(selected[0], selected[1]);
        let coordsTo = new CellCoords(selected[2], selected[3]);
        let cellRange = new CellRange(coordsFrom, coordsFrom, coordsTo);
        let topLeftCorner = cellRange.getTopLeftCorner();
        let bottomRightCorner = cellRange.getBottomRightCorner();
        let areaStart = topLeftCorner;
        let areaEnd = new CellCoords(
            Math.max(bottomRightCorner.row, inputArray.length - 1 + topLeftCorner.row),
            Math.max(bottomRightCorner.col, inputArray[0].length - 1 + topLeftCorner.col));

        let isSelRowAreaCoverInputValue = coordsTo.row - coordsFrom.row >= inputArray.length - 1;
        let isSelColAreaCoverInputValue = coordsTo.col - coordsFrom.col >= inputArray[0].length - 1;

        this.hot.addHookOnce('afterChange', (changes) => {
            console.log('after change ', changes);
            let changesLength = changes ? changes.length : 0;

            if (changesLength) {
                let offset = {row: 0, col: 0};
                let highestColumnIndex = -1;

                arrayEach(changes, (change, index) => {
                    let nextChange = changesLength > index + 1 ? changes[index + 1] : null;

                    if (nextChange) {
                        if (!isSelRowAreaCoverInputValue) {
                            offset.row += Math.max(nextChange[0] - change[0] - 1, 0);
                        }
                        if (!isSelColAreaCoverInputValue && change[1] > highestColumnIndex) {
                            highestColumnIndex = change[1];
                            offset.col += Math.max(nextChange[1] - change[1] - 1, 0);
                        }
                    }
                });
                this.hot.selectCell(areaStart.row, areaStart.col, areaEnd.row + offset.row, areaEnd.col + offset.col);
            }
        });

        console.log('populate from array', this.hot === handsontableInstance, inputArray, areaStart.row, areaStart.col, areaEnd.row, areaEnd.col);

        let dataArray = [], meta = [];
        for (let i = 0, l = inputArray.length; i < l; i++) {
            for (let j = 0, ll = inputArray[i].length; j < ll; j++) {
                let cell = [areaStart.row + i, areaStart.col + j, inputArray[i][j].v];
                dataArray.push(cell);
                meta.push([areaStart.row + i, areaStart.col + j, {
                    f: inputArray[i][j].f,
                    fmt: inputArray[i][j].fmt,
                    s: inputArray[i][j].s
                }]);
            }
        }
        console.log('sssss --->', dataArray);
        this.hot.setDataAtCell(dataArray, null, null, 'CopyPaste.paste');
        // this.hot.populateFromArray(areaStart.row, areaStart.col, inputArray, areaEnd.row, areaEnd.col, 'CopyPaste.paste', this.pasteMode);
        const boot = Bootstrap.getSingleton();
        boot.setCellMetasFromArray(boot.getActiveSheetId(), meta);
        this.hot.runHooks('afterPaste', inputArray, this.copyableRanges);
    }

    /**
     * We have to keep focus on contenteditable element, to make possible use of the browser tools (copy, cut, paste).
     *
     * @private
     */
    onAfterSelectionEnd() {
        const priv = privatePool.get(this);
        const editor = this.hot.getActiveEditor();

        if (editor && typeof editor.isOpened !== 'undefined' && editor.isOpened()) {
            return;
        }
        if (priv.isFragmentSelectionEnabled && !this.contenteditable.isActive() && getSelectionText()) {
            return;
        }

        this.setCopyableText();
        this.contenteditable.select();
    }

    /**
     * Destroy plugin instance.
     */
    destroy() {
        if (this.contenteditable) {
            this.contenteditable.destroy();
        }

        super.destroy();
    }
}

registerPlugin('DXCopyPaste', DXCopyPaste);

export default DXCopyPaste;
