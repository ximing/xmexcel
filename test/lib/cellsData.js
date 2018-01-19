/**
 * Created by ximing on 12/28/17.
 */
'use strict';
let data = {}
for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        data[`${i}:${j}`] = {v: `${i}:${j}`};
    }
}

export let c = data;
