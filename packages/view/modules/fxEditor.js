/**
 * Created by ximing on 1/2/18.
 */
'use strict';
import Base from './base';
import CONSTS from '../consts';

export default class FxEditor extends Base {
    constructor(dom, view) {
        super();
        this.name = CONSTS.moduleNames.FX_EDITOR;
        this.dom = dom;
        this.view = view;
    }
}
