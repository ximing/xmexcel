/**
 * Created by ximing on 10/23/17.
 */

'use strict';
import _ from 'jquery';
import Handsontable from '../handsontable/index';
import {
    empty, addClass, innerWidth, getCaretPosition, getComputedStyle,
    setCaretPosition
} from '../handsontable/helpers/dom/element';
import TextEditor from '../handsontable/editors/textEditor';
import {EditorState} from '../handsontable/editors/_baseEditor';
import {CellCoords} from '../handsontable/3rdparty/walkontable/src';
import {KEY_CODES} from '../handsontable/helpers/unicode';
import {
    stopPropagation,
    stopImmediatePropagation,
    isImmediatePropagationStopped
} from '../handsontable/helpers/dom/event';

import FormulaSelection from './FormulaSelection';
import {isFormula} from '../utils/util';
import {toLabel} from 'hot-formula-parser';
import CONSTS from '../consts';
import Bootstrap from '../bootstrap';

const onBeforeKeyDown = function onBeforeKeyDown(event) {
    let
        instance = this,
        that = instance.getActiveEditor(),
        ctrlDown;

    // catch CTRL but not right ALT (which in some systems triggers ALT+CTRL)
    ctrlDown = (event.ctrlKey || event.metaKey) && !event.altKey;

    // Process only events that have been fired in the editor
    if (event.target !== that.TEXTAREA || isImmediatePropagationStopped(event)) {
        return;
    }

    if (event.keyCode === 17 || event.keyCode === 224 || event.keyCode === 91 || event.keyCode === 93) {
        // when CTRL or its equivalent is pressed and cell is edited, don't prepare selectable text in textarea
        stopImmediatePropagation(event);
        return;
    }

    switch (event.keyCode) {
        case KEY_CODES.ARROW_RIGHT:
            if (that.isInFullEditMode()) {
                if ((!that.isWaiting() && !that.allowKeyEventPropagation) ||
                    (!that.isWaiting() && that.allowKeyEventPropagation && !that.allowKeyEventPropagation(event.keyCode))) {
                    stopImmediatePropagation(event);
                }
            }
            break;
        case KEY_CODES.ARROW_LEFT:
            if (that.isInFullEditMode()) {
                if ((!that.isWaiting() && !that.allowKeyEventPropagation) ||
                    (!that.isWaiting() && that.allowKeyEventPropagation && !that.allowKeyEventPropagation(event.keyCode))) {
                    stopImmediatePropagation(event);
                }
            }
            break;
        case KEY_CODES.ARROW_UP:
        case KEY_CODES.ARROW_DOWN:
            if (that.isInFullEditMode()) {
                if ((!that.isWaiting() && !that.allowKeyEventPropagation) ||
                    (!that.isWaiting() && that.allowKeyEventPropagation && !that.allowKeyEventPropagation(event.keyCode))) {
                    stopImmediatePropagation(event);
                }
            }
            break;

        case KEY_CODES.ENTER:
            var selected = that.instance.getSelected();
            var isMultipleSelection = !(selected[0] === selected[2] && selected[1] === selected[3]);
            if ((ctrlDown && !isMultipleSelection) || event.altKey) { // if ctrl+enter or alt+enter, add new line
                if (that.isOpened()) {
                    var
                        caretPosition = getCaretPosition(that.TEXTAREA),
                        value = that.getValue();

                    var newValue = `${value.slice(0, caretPosition)}\n${value.slice(caretPosition)}`;

                    that.setValue(newValue);

                    setCaretPosition(that.TEXTAREA, caretPosition + 1);

                } else {
                    that.beginEditing({v: that.originalValue});
                }
                stopImmediatePropagation(event);
            }
            event.preventDefault(); // don't add newline to field
            break;

        case KEY_CODES.A:
        case KEY_CODES.X:
        case KEY_CODES.C:
        case KEY_CODES.V:
            if (ctrlDown) {
                stopImmediatePropagation(event); // CTRL+A, CTRL+C, CTRL+V, CTRL+X should only work locally when cell is edited (not in table context)
            }
            break;

        case KEY_CODES.BACKSPACE:
        case KEY_CODES.DELETE:
        case KEY_CODES.HOME:
        case KEY_CODES.END:
            stopImmediatePropagation(event); // backspace, delete, home, end should only work locally when cell is edited (not in table context)
            break;
        default:
            break;
    }

    if ([KEY_CODES.ARROW_UP, KEY_CODES.ARROW_RIGHT, KEY_CODES.ARROW_DOWN, KEY_CODES.ARROW_LEFT].indexOf(event.keyCode) === -1) {
        that.autoResize.resize(String.fromCharCode(event.keyCode));
    }
};


class DXExcelEditor extends TextEditor {

    init() {
        super.init();
        this.bootstrap = Bootstrap.getSingleton();
    }

    createElements() {
        super.createElements();
        this.textareaStyle = this.TEXTAREA.style;
        this.textareaStyle.width = 0;
        this.textareaStyle.height = 0;
        this.textareaStyle.backgroundColor = 'blue';
        this.textareaStyle.color = 'blue';
        // addClass(this.TEXTAREA, 'dx-excel-cell-editor');
        this.TEXTAREA.className = 'handsontableInputHolder dx-excel-cell-editor';
        this.$TEXTAREA = $(this.TEXTAREA);
        empty(this.TEXTAREA_PARENT);
        this.TEXTAREA_PARENT.appendChild(this.TEXTAREA);
        this.shouldClose = true;
    }

    prepare(row, col, prop, td, originalValue, cellProperties) {
        if (!this.shouldClose) return;
        super.prepare(row, col, prop, td, originalValue, cellProperties);
    };

    refreshValue() {
        let sourceData = this.instance.getSourceDataAtCell(this.row, this.prop);
        this.originalValue = sourceData;
        let cellMeta = this.getCellMeta();
        this.setValue(cellMeta.f || sourceData);
        this.refreshDimensions();
    }

    refreshDimensions() {
        super.refreshDimensions();
        if (this.TD) {
            const cellComputedStyle = getComputedStyle(this.TD);
            this.TEXTAREA.style.fontWeight = cellComputedStyle.fontWeight;
            this.TEXTAREA.style.fontStyle = cellComputedStyle.fontStyle;
            this.TEXTAREA.style.color = cellComputedStyle.color;
            this.TEXTAREA.style.textDecoration = cellComputedStyle.textDecoration;
            this.TEXTAREA.style.textAlign = cellComputedStyle.textAlign;
            this.TEXTAREA.style.verticalAlign = cellComputedStyle.verticalAlign;
        }
    }

    beginEditing(initialValue, event) {
        if (this.state != EditorState.VIRGIN) {
            return;
        }
        this.instance.view.scrollViewport(new CellCoords(this.row, this.col));
        this.instance.view.render();
        this.state = EditorState.EDITING;
        initialValue = initialValue || this.originalValue;
        let cellMeta = this.getCellMeta();
        this.setValue(cellMeta.f || initialValue);
        this.open(event);
        this._opened = true;
        this.focus();

        // only rerender the selections (FillHandle should disappear when beginediting is triggered)
        this.instance.view.render();

        this.instance.runHooks('afterBeginEditing', this.row, this.col);
    };

    getCellMeta() {
        return this.bootstrap.getMainModule().getCellMeta(this.row, this.col) || {};
    }

    open() {
        this.refreshDimensions(); // need it instantly, to prevent https://github.com/handsontable/handsontable/issues/348

        this.instance.addHook('beforeKeyDown', onBeforeKeyDown);

        this.selectionStart = this.$TEXTAREA.prop('selectionStart');
        this.setFormulaSelection(this.$TEXTAREA.val())
        this.checkShouldClose();
    };

    setFormulaSelection(val) {
        if (isFormula(val)) {
            let excelCoords = val.match(CONSTS.regex.labelCoordinates);
            if (excelCoords) {
                this.clearFormulaSelection();
                FormulaSelection
                    .getSingleton()
                    .setFormulaSelectionByExcelCoords(excelCoords, this.instance.view.wt.wtTable.wot);
            }
        }
    }

    clearFormulaSelection() {
        FormulaSelection.getSingleton().clearFormulaSelection(this.instance.view.wt.wtTable.wot);
    }

    checkShouldClose() {
        let val = this.$TEXTAREA.val().trim();
        if (isFormula(val)) {
            let pos = this.$TEXTAREA.prop('selectionStart') - 1;
            if (pos >= 0 && (val.charAt(pos) === ',' || val.charAt(pos) === '(')) {
                this.instance.addHook('afterSelectionEnd', this.virtualSelect);
                this.shouldClose = false;
                return this.shouldClose;
            }
        }
        this.instance.removeHook('afterSelectionEnd', this.virtualSelect);
        this.shouldClose = true;
        return this.shouldClose;
    }

    virtualSelect = (r, c, r2, c2) => {
        if ((r === this.row && c === this.col) || (r2 === this.row && c2 === this.col)) {
            return;
        }
        this.instance.deselectCell();
        this.instance.selectCell(this.row, this.col);
        this.focus();
        let textVal = this.getValue().trim();
        let label = (r === r2 && c === c2) ? toLabel({index: r}, {index: c}) : `${toLabel({index: r}, {index: c})}:${toLabel({index: r2}, {index: c2})}`;
        // console.log('textVal +++>'.repeat(10), textVal, textVal.slice(-1))
        if (textVal.slice(-1) === '(') {
            // console.log('ssss--->'.repeat(10), label, textVal, this.selectionStart,
            //     textVal.substring(0, this.selectionStart),
            //     textVal.substring(this.selectionStart, textVal.length))
            this.setValue(`${textVal.substring(0, this.selectionStart)}${label}${textVal.substring(this.selectionStart, textVal.length)}`)
        } else if (textVal.slice(-1) === ',') {
            this.setValue(`${textVal.substring(0, this.selectionStart)}${label}${textVal.substring(this.selectionStart, textVal.length)}`)
        } else {
            let index = textVal.lastIndexOf('(');
            let newVal = textVal.slice(index);
            if (newVal.indexOf(',') >= 0) {
                let index = textVal.lastIndexOf(',');
                let newVal = textVal.slice(0, index);
                this.setValue(`${newVal},${label}${textVal.substring(this.selectionStart, textVal.length)}`);
                this.selectionStart = index + 1;
            } else {
                let newVal = textVal.slice(0, index);
                this.setValue(`${newVal}(${label}${textVal.substring(this.selectionStart, textVal.length)}`);
                this.selectionStart = index + 1;
            }
        }
        this.refreshDimensions();
        this.selectionStart = this.selectionStart + label.length;
        this.$TEXTAREA.prop('selectionEnd', this.selectionStart);
        this.$TEXTAREA.prop('selectionStart', this.selectionStart);
        this.setFormulaSelection(this.getValue());
        // FormulaSelection
        //     .getSingleton()
        //     .setFormulaSelection([r, c], [r2, c2], this.instance.view.wt.wtTable.wot);
    };


    bindEvents() {
        this.eventManager.addEventListener(this.TEXTAREA, 'keydown', (event) => {
            this.selectionStart = this.$TEXTAREA.prop('selectionStart');
            if (event.keyCode === 13 || event.keyCode === 27) {
                this.shouldClose = true;
            }
        });
        this.eventManager.addEventListener(this.TEXTAREA, 'keyup', (event) => {
            this.selectionStart = this.$TEXTAREA.prop('selectionStart');
            if (event.keyCode === 13 || event.keyCode === 27) {
                this.shouldClose = true;
            } else {
                this.checkShouldClose();
            }
        });
        this.eventManager.addEventListener(this.TEXTAREA, 'click', (event) => {
            this.selectionStart = this.$TEXTAREA.prop('selectionStart');
            this.checkShouldClose();
        });
        super.bindEvents();
    }

    close(tdOutside) {
        this.textareaParentStyle.display = 'none';

        this.autoResize.unObserve();

        if (document.activeElement === this.TEXTAREA) {
            this.instance.listen(); // don't refocus the table if user focused some cell outside of HT on purpose
        }
        this.instance.removeHook('beforeKeyDown', onBeforeKeyDown);
    };

    finishEditing(restoreOriginalValue, ctrlDown, callback) {
        if (!this.shouldClose) {
            return;
        }
        this.clearFormulaSelection();
        var _this = this,
            val;

        if (callback) {
            var previousCloseCallback = this._closeCallback;

            this._closeCallback = function (result) {
                if (previousCloseCallback) {
                    previousCloseCallback(result);
                }

                callback(result);
                _this.instance.view.render();
            };
        }

        if (this.isWaiting()) {
            return;
        }

        if (this.state == EditorState.VIRGIN) {
            this.instance._registerTimeout(setTimeout(() => {
                _this._fireCallbacks(true);
            }, 0));

            return;
        }

        if (this.state == EditorState.EDITING) {
            if (restoreOriginalValue) {
                this.cancelChanges();
                this.instance.view.render();

                return;
            }

            let value = this.getValue();

            if (this.instance.getSettings().trimWhitespace) {
                // We trim only string values
                val = [
                    [typeof value === 'string' ? String.prototype.trim.call(value || '') : value]
                ];
            } else {
                val = [
                    [value]
                ];
            }

            this.state = EditorState.WAITING;
            this.saveValue(val, ctrlDown);

            if (this.instance.getCellValidator(this.cellProperties)) {
                this.instance.addHookOnce('postAfterValidate', (result) => {
                    _this.state = EditorState.FINISHED;
                    _this.discardEditor(result);
                });
            } else {
                this.state = EditorState.FINISHED;
                this.discardEditor(true);
            }
        }
    }

    saveValue(value, ctrlDown) {
        let selection;
        let tmp;

        // if ctrl+enter and multiple cells selected, behave like Excel (finish editing and apply to all cells)
        if (ctrlDown) {
            selection = this.instance.getSelected();

            if (selection[0] > selection[2]) {
                tmp = selection[0];
                selection[0] = selection[2];
                selection[2] = tmp;
            }
            if (selection[1] > selection[3]) {
                tmp = selection[1];
                selection[1] = selection[3];
                selection[3] = tmp;
            }
        } else {
            selection = [this.row, this.col, null, null];
        }

        // if (isFormula(value[0][0])) {
        //     this.bootstrap.getMainModule().setCellMeta(this.row, this.col, {f: value[0][0]});
        // } else {
        //     this.instance.populateFromArray(selection[0], selection[1], value, selection[2], selection[3], 'edit');
        // }

        this.instance.populateFromArray(selection[0], selection[1], value, selection[2], selection[3], 'edit');

    }
}

export default DXExcelEditor;
