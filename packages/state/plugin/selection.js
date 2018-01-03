/**
 * Created by ximing on 1/3/18.
 */
'use strict';

export class Selection {
    static atStart(doc) {
        let selections = {};
        if (doc) {
            doc.sheetOrder.forEach(key => {
                selections[key] = [0, 0, 0, 0];
            });
        }
        return selections;
    }
};
