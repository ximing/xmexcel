/**
 * Created by yeanzhi on 17/4/12.
 */
'use strict';
import React, {Component} from "react";
import $ from 'jquery';

import XMExcelView from '../packages/view/index';
import XMExcelState from '../packages/state/index';

import {defaultData} from '../test/lib/index';

export default class ViewContainer extends Component {

    componentDidMount() {
        console.log(defaultData, this.body);
        window.excelView = new XMExcelView(this.body, {
            state: XMExcelState.create({
                doc: defaultData
            })
        });
    }

    render() {
        return (
            <div className="view">
                <div id="header">
                    这是一个header
                </div>
                <div id="body" ref={r => this.body = r}>
                </div>
            </div>
        )
    }
}
