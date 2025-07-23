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
                this.$host.find("#BtnSequencer").on("click", function (e) {
                    e.preventDefault();
                    var seq = 0;
                    var tmp = _this.grid.getData();
                    var result = tmp.map(function (item) {
                        seq += 10;
                        item.VOSCHS = seq.toString();
                        return item;
                    });
                    _this.grid.setData(result);
                    _this.$host.find('#XT_0168').click();
                });
            }
        }
    };
    return C04_PMS230B_SommeBatchOF;
}());
