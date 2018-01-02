/**
 * Created by ximing on 12/27/17.
 */
'use strict';
import crel from 'crel';

import './handsontable/src/css/handsontable.css';
import './styles/index.scss';
import MainModule from './modules/main';

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
                crel('div', {class: 'xm-left-label'},crel('img',{src:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAcCAYAAAB75n/uAAAAAXNSR0IArs4c6QAAAwVJREFUSA3VlUtoU1EQhpvkNtW0SFwaob4o1Sqo6FoQBJ8LNz5QClVqmkITG1y4UDGgIu4SG9skIoKgYLci6qK6sCJqH6AFUdwJSVsUJTRtKXn4Tbgp15tzvSniwgMn58ycf/6ZMzPnpq7uHw/HUvkjkYgznU5v0zTtc39//4ydvdMOYDwPBALhTCYzjW40n89PIq81nqv2mkpp1oXD4eWzs7P3i8XihMvlaikUChGHw3HS6XTOm7FmuSYHc3NzFzHc5fP5jpKiPPuz+jTzVcm2Neju7m4l4vdE/CCZTJ6qYrBR2NaAtJyDw818YcOlPLZ1UCqV9oslNxhTMtgoLVMUDAZX0CltpOc1HPONjY2rkfPIxVras+JXeYOurq4rCwsL30nPKx24LJfLfUU3joNgxbiW1fIGYoyju6Sog/TcpsD+WgjNmD+2KeSbdYMPZkORCWAry03mPQK4Izoe33bsZD+GrlOZIgECInDHJn0/Iatx0L7rwVxH18x6ze/310tLk9Yk8ih6efF1ljfo6ekRwyYBNTQ0VDmAaIPX6z2WzWaPg0sBO4Ku3e12H47H42mxk2FZA65/AMPHYDKpVMpXRit+iHolhZ/itjPg94D9rZ0tUwRXm/BhOK7gXVQNDAz8QBhm1tPKHxcP9I2lA6LZomNGzEZGmRvsIIg14Jv4IJYfpfHc0gFG5Q7C8K3RwLjv7e31kp4oX9i94PNg2+Wcgq+Shyp7pYPBwUEXYElRgQK/FKBxQHCJdrxAxG/4ZF/mZX/h/ClODlG7AOstnJa5lV00NDTUioGH+a6vry9rJJc9BKfpGB/rmUQi8Vx0BHQDeR9riE46GI1Gf4pe6QCgPBYheiIg8+DvcidTi8ViU5UzumeYmzXzuCaxK1X0yjYFGAMQgqNFv34Fv+RVWQNYdhPFs78ll2iqUsQLXsdXcyMOTiw5XIWBRjqE7DzdEGedhjzKGqJ4VZ8Hhb2tSlLUSUE76OcR5ifkRxQqYWtZI0DzeDxX6edvRO3mFg95+uLk/xm/ACSoR2rr87JkAAAAAElFTkSuQmCC'})),
                crel('div', {class: 'xm-sheet-fx-editor', contenteditable: "true"})),
            crel(
                'div', {class: 'xm-view-wrap'},
                crel('div', {class: 'xm-sheet-view', id: 'xmSheetView'})
            ),
            crel(
                'div', {class: 'xm-footer-wrap'},
                crel('div', {class: 'xm-footer-view', id: 'xmSheetFooter'})
            )
        );
        this.element.appendChild(editorWrap);
    }

    initModules() {
        let mainModule = this.mainModule = new MainModule(document.getElementById('xmSheetView'), this);
        this._moduleMap[mainModule.getName()] = mainModule;
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
