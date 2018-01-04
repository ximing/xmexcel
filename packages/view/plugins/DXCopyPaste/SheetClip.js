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
                    let textDecoration = computedStyle.getPropertyValue('text-decoration') || '';
                    let fontStyle = computedStyle.getPropertyValue('font-style');
                    tr[i] = {
                        v: $td.text(), s: {
                            color: convertColor(computedStyle.getPropertyValue('color')),
                            align: $td.attr('align') || null,
                            bgColor: bgColor,
                            u: textDecoration.indexOf('underline') >= 0,
                            s: textDecoration.indexOf('line-through') >= 0,
                            i: fontStyle.indexOf('italic') >= 0,
                            b: computedStyle.getPropertyValue('font-weight') === 'bold' || null,
                            colspan: $td.attr('colspan') || null,
                            rowspan: $td.attr('rowspan') || null
                        },
                        f: $td.data('formual'),
                        fmt: $td.data('fmt')
                    };
                });
                el.remove();
                resArray[j] = tr;
            });
        } else {
            //处理 text plain
            resArray[0] = [{v: html}];
        }
        return resArray;
    },

    /**
     * Encode array into valid spreadsheet html
     *
     * @param arr
     * @returns {String}
     */
    stringify: (arr, metaArr) => {
        let bodyStr = '';
        arr.forEach((tr, row) => {
            let trStr = '<tr>';
            tr.forEach((td, col) => {
                let meta = metaArr[row] ? metaArr[row][col] || {} : {};
                let style = meta.s || {};
                let textDecoration = '';
                if (style.u) {
                    textDecoration += ' underline';
                }
                if (style.s) {
                    textDecoration += ' line-through';
                }
                trStr += `<td style='
${textDecoration ? `text-decoration:${textDecoration};` : ''}
${style.b ? 'font-weight:bold;' : ''}${style.i ? 'font-style:italic;' : ''}
${!!style.color ? `color:${style.color};` : ''}${!!style.align ? `text-align:${style.align};` : ''}
${!!style.v ? `vertical-align:${style.v};` : ''}${!!style.bgColor ? `background-color:${style.bgColor};` : ''}'
${!!meta.f ? `data-formual="${meta.f}"` : ''} ${!!meta.fmt ? `data-fmt="${meta.fmt}"` : ''}>${td || ''}</td>`;
            });
            trStr += '</tr>';
            bodyStr += trStr;
        });
        let table = `<table>
            <tbody>
               ${bodyStr}
            </tbody>
        </table>`;
        console.log('stringify --->', arr, table, metaArr);
        return table;
    }
};
