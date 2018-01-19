/**
 * Created by ximing on 1/9/18.
 */
'use strict';
export {AddMark, RemoveMark, ClearMark, SetFmt, SetFormula} from './mark';
export {Value} from './value';
export {AddCol, AddRow, RemoveCol, RemoveRow} from './cell';
export {SetSheetSetting, ChangeSheet, SwitchSheet, AddSheet, RemoveSheet} from './sheet';

import {OP_NAME} from '../constants/op-consts';

export class Operation {
    static fromJSON(op) {

    }

    /*
    * 
    * */
    static rebase(lOp, rOp) {
        if (lOp.name === rOp.name) {
            if (lOp.name === OP_NAME.ADD_MARK) {

            }
        } else {
        }
    }
}
