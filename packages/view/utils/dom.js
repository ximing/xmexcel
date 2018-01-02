/**
 * Created by ximing on 1/2/18.
 */

'use strict';
export const getData = function (element, key) {
    if (element.dataset) {
        return element.dataset[key];
    } else {
        return element.getAttribute(`data-${key}`);
    }
};
