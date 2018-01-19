/**
 * Created by ximing on 1/18/18.
 */
'use strict';
//insert r c i
//delete 1,2,3,4,5,6,7
//change
//id row col propertyKey propertyVal
//id propertyKey propertyVal


//transform(op,op,'left')
//apply
//undo redo

/*
{
    "title":'DXExcelState',
    "type":'object',
    "properties":{
        "id": {
            "description": "",
            "type": "object",
            "properties": {
                "cells":{
                    title:"DXExcelCells",
                    "type": "object",
                    "properties": {
                        "id":{
                            title:"DXExcelCell",
                            "type": "object",
                            "properties":{
                                v:''
                            }
                        }
                    }
                },
                "name":{
                    "type": "string"
                },
                "id":{
                    "type": "string"
                },
                "fixedCol":{
                    "type": "integer",
                    "minimum": 0
                },
                "fixedRow":{
                    "type": "integer",
                    "minimum": 0
                },
                "mergeCells":[]
            }
        }
    }
}

* */
