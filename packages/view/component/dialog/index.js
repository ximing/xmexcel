/**
 * Created by ximing on 1/4/18.
 */
'use strict';
import crel from 'crel';
import './dialog.scss';

export default class {
    constructor(wrapper, options) {
        const {
            mark = true,
            innerDom = crel('div'),
            title = ''
        } = options;
        this.wrapper = wrapper;
        this.options = options;
        this.inner = innerDom;
        if (this.options.title) {
            this.titleDom = crel('div', {class: 'xm-dialog-header'}, title);
        }
        this.inner = crel(
            'div', {class: 'xm-dialog'},
            crel(
                'div', {class: 'xm-dialog-inner'},
                this.titleDom, this.inner)
        );
        if (mark) {
            this.inner = crel('div', {class: 'xm-dialog-mark'}, this.inner);
            this.inner.addEventListener('click', this.markClick);
        }
    }

    markClick = () => {
        this.close();
    };

    open() {
        this.wrapper.appendChild(this.inner);
    }

    close() {
        if (this.options.mark) {
            this.inner.removeEventListener('click', this.markClick);
        }
        if (this.options.onClose) {
            this.options.onClose();
        }
        this.wrapper.removeChild(this.inner);
    }
}
