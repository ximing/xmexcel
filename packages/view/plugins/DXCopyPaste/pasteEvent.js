/**
 * Created by ximing on 10/29/17.
 */
'use strict';
import ClipboardData from './clipboardData';

export default class PasteEvent {
    constructor() {
        this.clipboardData = new ClipboardData();
    }
}
