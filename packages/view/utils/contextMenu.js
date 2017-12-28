/**
 * Created by ximing on 11/16/17.
 */
'use strict';

function getValidSelection(hot) {
    let selected = hot.getSelected();

    if (!selected) {
        return null;
    }
    if (selected[0] < 0) {
        return null;
    }

    return selected;
}

export default function contextMenu(boot, hot) {

    hot.updateSettings({
        contextMenu: {
            callback: function (key, options) {
                if (key === 'about') {
                    setTimeout(function () {
                        // timeout is used to make sure the menu collapsed before alert is shown
                        alert('This is a context menu with default and custom options mixed');
                    }, 100);
                }
            },
            items: {
                'copy': {
                    name: '复制'
                },
                'paste': {
                    name: '粘贴'
                },
                'cut': {
                    name: '剪切'
                },
                'hsep0': '---------',
                'col_left': {
                    key: 'col_left',
                    name: '向左侧插入1列',
                    callback: function (key, selection) {
                        // if first row, disable this option
                        let col = hot.getSelected()[1];
                        let tr = boot.excel.state.tr;
                        boot.dispatchTransaction(tr.insertCol(boot.getActiveSheetId(), col - 1, 1));
                    },
                    disabled() {
                        return false;
                        let selected = getValidSelection(hot);

                        if (!selected) {
                            return true;
                        }
                        if (!this.isColumnModificationAllowed()) {
                            return true;
                        }
                        // let entireRowSelection = [selected[0], 0, selected[0], this.countCols() - 1];
                        // let rowSelected = entireRowSelection.join(',') == selected.join(',');
                        console.log('___===== '.repeat(10), hot.countCols(), selected, hot.getSettings().maxCols);
                        let onlyOneColumn = hot.countCols() === 1;
                        return selected[1] < 0 || hot.countCols() >= hot.getSettings().maxCols || (!onlyOneColumn);
                    }
                },
                'col_right': {
                    name: '向右侧插入1列',
                    callback: function (key, selection) {
                        // if first row, disable this option
                        let col = hot.getSelected()[1];
                        let tr = boot.excel.state.tr;
                        boot.dispatchTransaction(tr.insertCol(boot.getActiveSheetId(), col, 1));
                    },
                    disabled() {
                        return false;
                    }
                },
                'remove_col': {
                    name: '删除此列',
                    callback: function (key, selection) {
                        // if first row, disable this option
                        let col = hot.getSelected()[1];
                        let tr = boot.excel.state.tr;
                        boot.dispatchTransaction(tr.removeCol(boot.getActiveSheetId(), col - 1, 1));
                    }
                },
                'set_col_width': {
                    name: '设置列宽',
                    callback: function (key, selection) {
                        // if first row, disable this option
                        return hot.getSelected()[0] === 0;
                    }
                },
                'hsep1': '---------',
                'row_above': {
                    name: '向上插入1行',
                    callback: function (key, selection) {
                        let row = hot.getSelected()[0];
                        let tr = boot.excel.state.tr;
                        boot.dispatchTransaction(tr.insertRow(boot.getActiveSheetId(), row - 1, 1));
                    }
                },
                'row_below': {
                    name: '向下插入1行',
                    callback: function (key, selection) {
                        let row = hot.getSelected()[0];
                        let tr = boot.excel.state.tr;
                        boot.dispatchTransaction(tr.insertRow(boot.getActiveSheetId(), row, 1));
                    }
                },
                'remove_row': {
                    name: '删除此行',
                    callback: function (key, selection) {
                        let row = hot.getSelected()[0];
                        let tr = boot.excel.state.tr;
                        boot.dispatchTransaction(tr.removeRow(boot.getActiveSheetId(), row - 1, 1));
                    }
                },
                'set_row_height': {
                    name: '设置行高',
                    callback: function (key, selection) {
                        // if first row, disable this option
                        return hot.getSelected()[0] === 0;
                    }
                }
            }
        }
    });
    let contextMenu = hot.getPlugin('ContextMenu');
    hot.addHook('afterScrollHorizontally', () => {
        tryCloseMenu();
    });
    hot.addHook('afterScrollVertically', () => {
        tryCloseMenu();
    });

    function tryCloseMenu() {
        if (contextMenu.menu && contextMenu.menu.isOpened()) {
            contextMenu.close();
        }
    }
}
