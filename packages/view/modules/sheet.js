/**
 * Created by ximing on 1/4/18.
 */
'use strict';
import crel from 'crel';
import Base from './base';
import CONSTS from '../consts';

import Dialog from '../component/dialog';

class SheetDialog extends Dialog {
    constructor(wrapper, {title = '新建'} = {}) {
        super(wrapper, {
            innerDom: crel(
                'div', {class: 'xm-sheet-dialog'},
                crel('input')
            ),
            mark: true,
            title: title
        });
    }
}

export default class Sheet extends Base {
    constructor(dom, view) {
        super();
        this.name = CONSTS.moduleNames.SHEET;
        this.dom = dom;
        this.view = view;
    }

    openAddDialog() {
        let sheetDialog = new SheetDialog(this.dom);
        sheetDialog.open();
    }

    openRenameDialog() {
    }
}
