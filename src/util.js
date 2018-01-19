/**
 * Created by ximing on 1/19/18.
 */
'use strict';
export const convertCoor = function (key) {
    return key.split(':').map(item => parseInt(item));
};
