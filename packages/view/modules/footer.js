/**
 * Created by ximing on 1/2/18.
 */
'use strict';
import crel from 'crel';

import Base from './base';
import CONSTS from '../consts';
import {getData} from '../utils/dom';

export default class FxEditor extends Base {
    constructor(dom, view) {
        super();
        this.name = CONSTS.moduleNames.FOOTER;
        this.dom = dom;
        this.view = view;
        this.render();
        this.bindEvent();
    }

    onClick = (event) => {
        if (event.target) {
            if (event.target.nodeName.toLocaleUpperCase() === 'A' && event.target.className.includes('sheet-tab')) {
                if (!event.target.className.includes('active')) {
                    let id = getData(event.target, 'id');
                    this.view.dispatch(this.view.state.tr.changeSheet(id));
                }
            }
        }
    };

    bindEvent() {
        this.dom.addEventListener('click', this.onClick);
    }

    destory() {
        this.dom.removeEventListener('click', this.onClick);
    }

    render() {
        if (this.footer) {
            this.dom.removeChild(this.footer);
        }
        let tabs = this.view.state.doc.sheetOrder.map(item => {
            let className = `sheet-tab ${this.view.state.doc.activeSheetId === item ? 'active' : ''}`;
            return crel(
                'a', {class: className, 'data-id': item},
                this.view.state.doc.sheets[item].title
            );
        });
        this.footer = crel(
            'div', {class: 'xm-footer-view'},
            crel(
                'div', {class: 'xm-footer-opver-container'},
                '+'
            ),
            crel(
                'div', {class: 'xm-footer-tab-container'},
                ...tabs
            )
        );
        this.dom.appendChild(this.footer);
    }
}
