/**
 * Created by ximing on 10/29/17.
 */
'use strict';
import $ from 'jquery';
import tinycolor from 'tinycolor2';

function convertColor(color) {
    let _color = tinycolor(color);
    if (_color.isValid()) {
        return _color.toHexString();
    } else {
        return null;
    }

}

export default {
    /**
     * Decode spreadsheet html into array
     *
     * @param {String} html
     * @returns {Array}
     */
    parse: (html) => {
        console.log('sheet clip', html, html.indexOf('<table'), html.indexOf('table>'));
        let resArray = [];
        //处理html
        if (html.indexOf('<table') > 0 && html.indexOf('table>') > 0) {
            let el = $('<div id="dxStyleParseHtmlContainer" style="position: fixed;left: -1000px;top: -1000px;visibility: hidden"><div>');
            el.html(html);
            $('body').append(el);
            let $tr = $('tr', el);
            $tr.toArray().forEach((trItem, j) => {
                let tr = [];
                $(trItem).find('td').toArray().forEach((td, i) => {
                    //colspan rowspan
                    // console.log('====>', td, window.getComputedStyle(td));
                    let $td = $(td);
                    let computedStyle = window.getComputedStyle(td);
                    let bgColor = convertColor(computedStyle.getPropertyValue('background-color'));
                    if (bgColor === '#000000') {
                        bgColor = null;
                    }
                    tr[i] = {
                        v: $td.text(), s: {
                            color: convertColor(computedStyle.getPropertyValue('color')),
                            align: $td.attr('align') || null,
                            bgColor: bgColor,
                            b: !!window.getComputedStyle(td).getPropertyValue('fontWeight') || null,
                            colspan: $td.attr('colspan') || null,
                            rowspan: $td.attr('rowspan') || null
                        }
                    };
                });
                el.remove();
                resArray[j] = tr;
            });
        } else {
            //处理 text plain
            resArray[0] = [{v: html}];
        }
        console.log('resArray ====>', resArray);
        return resArray;
    },

    /**
     * Encode array into valid spreadsheet html
     *
     * @param arr
     * @returns {String}
     */
    stringify: (arr) => {
        let bodyStr = '';
        arr.forEach(tr => {
            let trStr = '<tr>';
            tr.forEach(td => {
                let style = td.s || {};
                trStr += `<td style='color:${style.color || '""'};align:${style.align || '""'};background-color:${style.bgColor || '""'}'>${td.v || ''}</td>`;
            });
            trStr += '</tr>';
            bodyStr += trStr;
        });
        let table = `<table>
            <tbody>
               ${bodyStr}
            </tbody>
        </table>`;
        console.log('stringify --->', arr, table);
        return table;
    }
};
