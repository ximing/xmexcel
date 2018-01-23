```javascript
export {Op,ExcelModel} from 'xmexcel-model';
const excelModel = ExcelModel.fromJSON(jsonObj);
const op = Op.fromJSON(opJsonObj);
excelModel.apply(op);
//excelModel.excel 
```
ExcelModel 每次应用op将会产生新的excel和history
```javascript
export class ExcelModel {
    constructor(excel) {
        this.excel = excel;
        this.undo = [];
        this.redo = [];
    }
}
```
