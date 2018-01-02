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
                'div', {class: 'xm-footer-wrap',id: 'xmSheetFooter'}
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

    updateState(newState) {
        if (this.state !== newState) {
            this.observeChange = false;
            // refresh sheet View
            // update sheet setting
            // refresh toolbar View
            let needRender = false, loadData = false,
                updateSetting = false, updateSelection = false;
            let doc = this.state.doc;
            let newDoc = newState.doc;
            if (doc !== newDoc) {
                if (doc.activeSheetId !== newDoc.activeSheetId) {
                    //TODO change Active Id
                } else {
                    if (doc.sheets !== newDoc.sheets) {
                        if (doc.sheets[doc.activeSheetId] !== newDoc.sheets[newDoc.activeSheetId]) {
                            if (doc.sheets[doc.activeSheetId].cells !== newDoc.sheets[newDoc.activeSheetId].cells) {
                                loadData = true;
                            }
                            if (doc.sheets[doc.activeSheetId].cellMetas !== newDoc.sheets[newDoc.activeSheetId].cellMetas) {
                                needRender = true;
                            }
                            if (doc.sheets[doc.activeSheetId].setting !== newDoc.sheets[newDoc.activeSheetId].setting) {
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
                this.mainModule.updateSettings(newDoc.sheets[newDoc.activeSheetId].setting);
                this.mainModule.loadData(newDoc.sheets[newDoc.activeSheetId].cells);
                this.mainModule.setSelection(newDoc.sheets[newDoc.activeSheetId].selection, true, true);
            } else if (loadData) {
                this.mainModule.loadData(newDoc.sheets[newDoc.activeSheetId].cells);
            } else if (updateSetting) {
                this.mainModule.updateSettings(newDoc.sheets[newDoc.activeSheetId].setting);
            } else if (updateSelection) {
                this.mainModule.setSelection(newDoc.sheets[newDoc.activeSheetId].selection, true, true);
            } else if (needRender) {
                this.mainModule.render();
            }
            this.observeChange = true;
        }
    }

    registerModule(Module) {
        const m = new Module(this);
        this._moduleMap[m.getName()] = m;
    }

}

export default DXExcelView;
