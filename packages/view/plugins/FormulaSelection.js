/**
 * Created by ximing on 10/30/17.
 */
'use strict';
import {CellCoords, Selection} from '../handsontable/src/3rdparty/walkontable/src';
import {extractLabel} from 'hot-formula-parser';
import _ from 'lodash';
import CONSTS from '../consts';

class FormulaSelection {
    static getSingleton() {
        return globalSingleton;
    }

    constructor(selections = []) {
        this.selections = selections;
        this.vernier = 4;
    }

    init(selections) {
        this.selections = selections;
    }

    setFormulaSelection(start, end, wot) {
        this.addFormulaSelection(wot, start, end);
    }

    setFormulaSelectionByExcelCoords(excelCoords, wot) {
        excelCoords.forEach(excelCoord => {
            if (!!excelCoord && _.isNaN(Number(excelCoord))) {
                if (excelCoord.indexOf(':') > 0) {
                    let [start, end] = excelCoord.split(':');
                    let [startRow, startCol] = extractLabel(start);
                    let [endRow, endCol] = extractLabel(end);
                    this.addFormulaSelection(wot, [startRow.index, startCol.index], [endRow.index, endCol.index]);
                } else {
                    let [row, col] = extractLabel(excelCoord);
                    this.addFormulaSelection(wot, [row.index, col.index]);
                }
            }
        });
    }

    clearFormulaSelection(wot) {
        for (let i = 4; i < this.selections.length; i++) {
            this.selections[i].clear();
            this.selections[i].draw(wot);
        }
        this.vernier = 4;
    }

    addFormulaSelection(wot, ...coords) {
        if (this.vernier < this.selections.length) {
            let selection = this.selections[this.vernier];
            coords.forEach(coord => {
                selection.add(new CellCoords(coord[0], coord[1]));
            });
            selection.draw(wot);
        } else {
            let selection = new Selection({
                className: 'dx-formula',
                border: {
                    width: 1.5,
                    color: CONSTS.FORMULA_COLOR[this.vernier % 8]
                }
            });
            coords.forEach(coord => {
                selection.add(new CellCoords(coord[0], coord[1]));
            });
            selection.draw(wot);
            this.selections.push(selection);
        }
        this.vernier += 1;
    }
}

const globalSingleton = new FormulaSelection();

export default FormulaSelection;
