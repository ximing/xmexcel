/**
 * Created by ximing on 12/27/17.
 */
'use strict';
import crel from 'crel';

import './handsontable/src/css/handsontable.css';
import './styles/index.scss';
import MainModule from './modules/main';
import FooterModule from './modules/footer';
import FxEditorModule from './modules/fxEditor';
import CONST from './consts';

localStorage.debug = 'excel:*';

class DXExcelView {
    constructor(element, option) {
        this.element = element;
        this.state = option.state;
        this.dispatchTransaction = option.dispatchTransaction || this.dispatchTransaction;
        this._moduleMap = {};
        this.setUpView();
        this.initModules();
        this.observeChange = true;
    }

    setUpView() {
        let editorWrap = crel(
            'div', {class: 'xm-excel-editor'},
            crel(
                'div', {class: 'xm-editor-wrap'},
                crel('div', {class: 'xm-left-label'}, crel('img', {src: CONST.fn})),
                crel('div', {class: 'xm-sheet-fx-editor', id: "xmSheetFxEditor", contenteditable: "true"})),
            crel(
                'div', {class: 'xm-view-wrap'},
                crel('div', {class: 'xm-sheet-view', id: 'xmSheetView'})
            ),
            crel(
                'div', {class: 'xm-footer-wrap', id: 'xmSheetFooter'}
            )
        );
        this.element.appendChild(editorWrap);
    }

    initModules() {
        let mainModule = this.mainModule = new MainModule(document.getElementById('xmSheetView'), this);
        let footerModule = this.footerModule = new FooterModule(document.getElementById('xmSheetFooter'), this);
        let fxEditorModule = this.fxEditorModule = new FxEditorModule(document.getElementById('xmSheetFxEditor'), this);
        this._moduleMap[mainModule.getName()] = mainModule;
        this._moduleMap[footerModule.getName()] = footerModule;
        this._moduleMap[fxEditorModule.getName()] = fxEditorModule;
    }

    dispatchTransaction = (tr) => {
        let newState = this.state.apply(tr);
        console.log(newState, tr);
        this.updateState(newState);
    };

    updateState = (newState) => {
        if (this.state !== newState) {
            this.observeChange = false;
            // refresh sheet View
            // update sheet setting
            // refresh toolbar View
            let needRender = false, loadData = false,
                updateSetting = false, updateSelection = false,
                renderFooter = false;
            let doc = this.state.doc;
            let newDoc = newState.doc;
            if (doc !== newDoc) {
                if (doc.activeSheetId !== newDoc.activeSheetId) {
                    // debugger
                    loadData = true;
                    updateSetting = true;
                    renderFooter = true;
                } else {
                    if (doc.sheets !== newDoc.sheets) {
                        if (doc.sheets[doc.activeSheetId] !== newDoc.sheets[newDoc.activeSheetId]) {
                            if (doc.sheets[doc.activeSheetId].cells !== newDoc.sheets[newDoc.activeSheetId].cells) {
                                loadData = true;
                            }
                            if (doc.sheets[doc.activeSheetId].cellMetas !== newDoc.sheets[newDoc.activeSheetId].cellMetas) {
                                needRender = true;
                            }
                            if (doc.sheets[doc.activeSheetId].settings !== newDoc.sheets[newDoc.activeSheetId].settings) {
                                updateSetting = true;
                            }
                            if (doc.sheets[doc.activeSheetId].selection !== newDoc.sheets[newDoc.activeSheetId].selection) {
                                updateSelection = true;
                            }
                        }
                    } else if (doc.sheetOrder !== newDoc.sheetOrder) {
                        //TODO  change footer
                    }
                }
            }
            this.state = newState;
            if (loadData && updateSetting) {
                this.mainModule.loadData(newDoc.sheets[newDoc.activeSheetId].cells);
                this.mainModule.updateSettings(newDoc.sheets[newDoc.activeSheetId].settings);
                console.log('selections', newState.selections.getSelection(newDoc.activeSheetId));
                this.mainModule.setSelection(newState.selections.getSelection(newDoc.activeSheetId).r || [0, 0, 0, 0], true, true);
            } else if (loadData) {
                this.mainModule.loadData(newDoc.sheets[newDoc.activeSheetId].cells);
            } else if (updateSetting) {
                this.mainModule.updateSettings(newDoc.sheets[newDoc.activeSheetId].settings);
            } else if (updateSelection) {
                this.mainModule.setSelection(newState.selections.getSelection(newDoc.activeSheetId).r || [0, 0, 0, 0], true, true);
            } else if (needRender) {
                this.mainModule.render();
            }
            if (renderFooter) {
                this.footerModule.render();
            }
            this.observeChange = true;
        }
    };

    registerModule(Module) {
        const m = new Module(this);
        this._moduleMap[m.getName()] = m;
    }

    getModule(name) {
        return this._moduleMap[name]
    }

    dispatch = (tr) => {
        this.dispatchTransaction(tr);
    }

}

export default DXExcelView;
