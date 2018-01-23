```javascript
export {Op,ExcelModel} from 'xmexcel-model';
const excelModel = ExcelModel.fromJSON(jsonObj);
const op = Op.fromJSON(opJsonObj);
excelModel.apply(op);
//excelModel.excel 
```
