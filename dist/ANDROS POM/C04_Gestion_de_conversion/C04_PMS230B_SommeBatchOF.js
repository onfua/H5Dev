"use strict";
/*
    H5Script C04_PMS230B_SommeBatchOF
  * @author: Joel Randrianarivelo
  * @version: 1.0.0
  * @since: 2024-10-24
  * @description: Calcul de la somme des quantités des OA selectionnés
*/
/**
 * CHANGELOGS
 * Version    Date       User        Description
 * 1.0.0   24-10-2024    JOEL        Initial Release
 * 1.0.1   12-12-2024    JOEL        sauvegarde du tableau après changement de sequence
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var C04_PMS230B_SommeBatchOF = /** @class */ (function () {
    function C04_PMS230B_SommeBatchOF(scriptArgs) {
        this.argument = scriptArgs.args;
        this.controller = scriptArgs.controller;
        this.contentElement = this.controller.GetContentElement();
        this.FACI = ScriptUtil.GetUserContext().FACI;
        this.totalBatch = 0;
        this.totalStandart = 0;
        this.grid = this.controller.GetGrid();
        this.$host = this.controller.ParentWindow;
    }
    C04_PMS230B_SommeBatchOF.Init = function (args) {
        new C04_PMS230B_SommeBatchOF(args).run();
    };
    /** Ajout de label pour le champ ecran quantité standart */
    C04_PMS230B_SommeBatchOF.prototype.addStandartLabel = function () {
        var labelElement = new LabelElement();
        labelElement.Name = "Qté_Standard";
        labelElement.Value = "Qté Standard";
        labelElement.Position = new PositionElement();
        labelElement.Position.Top = 3;
        labelElement.Position.Left = 40;
        this.contentElement.AddElement(labelElement);
    };
    /** Ajout de input pour le champ ecran quantité standart */
    C04_PMS230B_SommeBatchOF.prototype.addStandartTextBox = function () {
        var textElement = new TextBoxElement();
        textElement.Name = "Q_S";
        textElement.Value = "0";
        textElement.Position = new PositionElement();
        textElement.Position.Top = 3;
        textElement.Position.Left = 48;
        textElement.Position.Width = 10;
        textElement.IsEnabled = false;
        this.contentElement.AddElement(textElement);
    };
    /** Ajout de label pour le champ ecran quantité batch */
    C04_PMS230B_SommeBatchOF.prototype.addBatchLabel = function () {
        var labelElement = new LabelElement();
        labelElement.Name = "Qté_Batch";
        labelElement.Value = "Qté Batch";
        labelElement.Position = new PositionElement();
        labelElement.Position.Top = 3;
        labelElement.Position.Left = 62;
        this.contentElement.AddElement(labelElement);
    };
    /** Ajout de input pour le champ ecran quantité batch */
    C04_PMS230B_SommeBatchOF.prototype.addBatchTextBox = function () {
        var textElement = new TextBoxElement();
        textElement.Name = "Q_B";
        textElement.Value = "0";
        textElement.Position = new PositionElement();
        textElement.Position.Top = 3;
        textElement.Position.Left = 69;
        textElement.Position.Width = 10;
        textElement.IsEnabled = false;
        this.contentElement.AddElement(textElement);
    };
    C04_PMS230B_SommeBatchOF.prototype.addBtnSequencer = function () {
        var btnSequencer = new ButtonElement();
        btnSequencer.Name = "BtnSequencer";
        btnSequencer.Value = "Sequencer";
        btnSequencer.Position = new PositionElement();
        btnSequencer.Position.Top = 4;
        btnSequencer.Position.Left = 69;
        btnSequencer.Position.Width = 10;
        this.contentElement.AddElement(btnSequencer);
    };
    C04_PMS230B_SommeBatchOF.prototype.run = function () {
        var _this = this;
        //RG00 : Récupération argument
        var argument = this.argument.split(",");
        var tabFACI = argument[0].split("/");
        var tabORTY = argument[1].split("/");
        console.info('1.0.1   12-12-2024    JOEL        sauvegarde du tableau après changement de sequence');
        //RG01 : Limitaiton du script
        if (this.controller.GetSortingOrder() == "2") {
            if (tabFACI.includes(this.FACI)) {
                //RG02 création de 2 champs spécifiques
                this.addStandartLabel();
                this.addStandartTextBox();
                this.addBatchLabel();
                this.addBatchTextBox();
                this.addBtnSequencer();
                var handler = function (e, args) {
                    _this.totalStandart = 0;
                    for (var _i = 0, _a = e.rows; _i < _a.length; _i++) {
                        var item = _a[_i];
                        _this.totalStandart += item.data["VHORQT"]
                            ? parseFloat(item.data["VHORQT"].toString().replace(",", "."))
                            : 0;
                    }
                    _this.totalBatch = 0;
                    for (var _b = 0, _c = e.rows; _b < _c.length; _b++) {
                        var item = _c[_b];
                        _this.totalBatch += item.data["VHPROJ"]
                            ? parseFloat(item.data["VHPROJ"].toString().replace(",", "."))
                            : 0;
                    }
                    _this.$host.find("#Q_S").val(_this.totalStandart.toString());
                    _this.$host.find("#Q_B").val(Number(_this.totalBatch.toFixed(3)).toString());
                };
                this.grid.onSelectedRowsChanged.subscribe(handler);
                //btnSequencer
                this.$host.find("#BtnSequencer").on("click", function (e) { return __awaiter(_this, void 0, void 0, function () {
                    var seq, tmp, result, columnId, list, contents, len, _loop_1, key, i;
                    return __generator(this, function (_a) {
                        e.preventDefault();
                        seq = 0;
                        tmp = this.grid.getData();
                        result = tmp.map(function (item) {
                            seq += 10;
                            item.VOSCHS = seq.toString();
                            return item;
                        });
                        columnId = 'VOSCHS';
                        list = ListControl.ListView.GetDatagrid(this.controller);
                        contents = list.getData().filter(function (item) { return item.MMITDS; });
                        len = ScriptUtil.version >= 2.0 ? contents.length : contents.getLength();
                        _loop_1 = function (i) {
                            // get the column Id letter (C1, C2 ...)
                            var clId = "";
                            var clName = columnId.substr(columnId.length - 4);
                            list.getColumns().forEach(function (column) {
                                if (column.name == clName) {
                                    clId = column.colId;
                                }
                            });
                            // set changed data
                            key = "R" + (i + 1) + clId;
                            //@ts-ignore
                            list.editedCells[key] = { oldValue: "", newValue: result[i].VOSCHS };
                            // set displayed data
                            var data = list.getData()[i];
                            data[columnId] = result[i].VOSCHS;
                        };
                        for (i = 0; i < len; i++) {
                            _loop_1(i);
                        }
                        this.$host.find('#XT_0168').click();
                        return [2 /*return*/];
                    });
                }); });
            }
        }
    };
    C04_PMS230B_SommeBatchOF.prototype.updateRowCell = function (list, gridData, columns, rowNumber, columnName, clValue) {
        var clId = '';
        var clName = columnName.substr(columnName.length - 4);
        columns.forEach(function (col) {
            if (col.name == clName) {
                clId = columnName.colId;
            }
        });
    };
    return C04_PMS230B_SommeBatchOF;
}());
