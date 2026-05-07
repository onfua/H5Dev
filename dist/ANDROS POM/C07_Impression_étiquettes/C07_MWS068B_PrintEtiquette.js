"use strict";
/*
    H5Script C07_MWS068B_PrintEtiquette
  * @author: Joel Randrianarivelo
  * @version: 1.0.0
  * @since: 03-03-2025
  * @description: Impression etiquette depuis MWS068
*/
/**
 * CHANGELOGS
 * Version    Date       User        Description
 * 1.0.0   03-03-2025    JOEL        Initial Release
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
var C07_MWS068B_PrintEtiquette = /** @class */ (function () {
    function C07_MWS068B_PrintEtiquette(scriptArgs) {
        this.POPUP_ID = "pop_mesg";
        this.varDEV0 = "";
        this.DATAGRID_ID = "pop_datagrid";
        this.BTNCLOSE_ID = "ppopup_close";
        this.controller = scriptArgs.controller;
        this.grid = this.controller.GetGrid();
        this.contentElement = this.controller.GetContentElement();
        this.$host = this.controller.ParentWindow;
        if (ScriptUtil.version >= 2.0) {
            this.miService = MIService;
        }
        else {
            this.miService = MIService.Current;
        }
    }
    C07_MWS068B_PrintEtiquette.Init = function (args) {
        new C07_MWS068B_PrintEtiquette(args).run();
    };
    C07_MWS068B_PrintEtiquette.prototype.run = function () {
        var _this_1 = this;
        console.info("1.0.0   03-03-2025    JOEL        Initial Release");
        //récupération des colonnes du grid
        var columns = this.grid.getColumns();
        var columnNames = columns.map(function (column) { return column.name; });
        //Ajouter le bouton Envoyer Bon Transport
        this.addBtn();
        this.$host.find("#BtnPrintPackage").on("click", function (e) { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                e.preventDefault();
                //Verification de la vue
                if (!columnNames.includes("CAMU") ||
                    !columnNames.includes("ITNO") ||
                    !columnNames.includes("WHSL") ||
                    !columnNames.includes("WHLO") ||
                    !columnNames.includes("BANO") ||
                    !columnNames.includes("STAS")) {
                    this.showMessage("Les colonnes ITNO, CAMU, WHSL, WHLO, BANO et STAS sont obligatoires dans la vue", "warning");
                    return [2 /*return*/];
                }
                //Affichage du popup d'impression
                this.showPopup();
                return [2 /*return*/];
            });
        }); });
    };
    C07_MWS068B_PrintEtiquette.prototype.runConfirm = function (modal, model) {
        return __awaiter(this, void 0, void 0, function () {
            var selectedRows, request, res, _a, request, res, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.varDEV0.trim() == '') {
                            this.showMessage('Veuillez choisir une imprimante', 'warning');
                            return [2 /*return*/];
                        }
                        selectedRows = this.grid.getSelectedGridRows()[0].data;
                        if (!selectedRows)
                            return [2 /*return*/];
                        if (!(selectedRows['MLCAMU'] && selectedRows['MLCAMU'].trim() != '' && selectedRows['MLCAMU'].trim() != '*')) return [3 /*break*/, 5];
                        request = new MIRequest();
                        request.program = "MMS470MI";
                        request.transaction = "PrintPackage";
                        request.record = {
                            PANR: selectedRows['MLCAMU'],
                            DEV0: this.varDEV0
                        };
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.miService.executeRequestV2(request)];
                    case 2:
                        res = _c.sent();
                        if (res.errorCode) {
                            this.showMessage(res.errorMessage, 'error');
                            return [2 /*return*/];
                        }
                        this.showMessage('Impression réussi', 'success');
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _c.sent();
                        this.showMessage('Erreur lors de l\'impression', 'error');
                        return [3 /*break*/, 4];
                    case 4:
                        if (ScriptUtil.version >= 2.0) {
                            model.close(true);
                        }
                        else {
                            $(modal).inforDialog("close");
                        }
                        return [2 /*return*/];
                    case 5:
                        if (!(selectedRows['MLWHLO'] && selectedRows['MLWHLO'].trim() != '' && selectedRows['MLWHLO'].trim() != '*' &&
                            selectedRows['MLITNO'] && selectedRows['MLITNO'].trim() != '' && selectedRows['MLITNO'].trim() != '*' &&
                            selectedRows['MLWHSL'] && selectedRows['MLWHSL'].trim() != '' && selectedRows['MLWHSL'].trim() != '*' &&
                            selectedRows['MLBANO'] && selectedRows['MLBANO'].trim() != '' && selectedRows['MLBANO'].trim() != '*')) return [3 /*break*/, 10];
                        request = new MIRequest();
                        request.program = "MMS060MI";
                        request.transaction = "PrtPutAwayLbl";
                        request.record = {
                            WHLO: selectedRows['MLWHLO'],
                            ITNO: selectedRows['MLITNO'],
                            WHSL: selectedRows['MLWHSL'],
                            BANO: selectedRows['MLBANO'],
                            DEV0: this.varDEV0
                        };
                        _c.label = 6;
                    case 6:
                        _c.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, this.miService.executeRequestV2(request)];
                    case 7:
                        res = _c.sent();
                        if (res.errorCode) {
                            this.showMessage(res.errorMessage, 'error');
                            return [2 /*return*/];
                        }
                        this.showMessage('Impression réussi', 'success');
                        return [3 /*break*/, 9];
                    case 8:
                        _b = _c.sent();
                        this.showMessage('Erreur lors de l\'impression', 'error');
                        return [3 /*break*/, 9];
                    case 9:
                        if (ScriptUtil.version >= 2.0) {
                            model.close(true);
                        }
                        else {
                            $(modal).inforDialog("close");
                        }
                        return [2 /*return*/];
                    case 10:
                        this.showMessage('Impossible d\'imprimer l\'étiquette avec une information vide ou *', 'error');
                        if (ScriptUtil.version >= 2.0) {
                            model.close(true);
                        }
                        else {
                            $(modal).inforDialog("close");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    C07_MWS068B_PrintEtiquette.prototype.addBtn = function () {
        var btnSequencer = new ButtonElement();
        btnSequencer.Name = "BtnPrintPackage";
        btnSequencer.Value = "Imprimer étiquette";
        btnSequencer.Position = new PositionElement();
        btnSequencer.Position.Top = 4;
        btnSequencer.Position.Left = 69;
        btnSequencer.Position.Width = 10;
        this.contentElement.AddElement(btnSequencer);
    };
    C07_MWS068B_PrintEtiquette.prototype.showMessage = function (message, type) {
        var popupElement = document.createElement("div");
        popupElement.id = this.POPUP_ID;
        popupElement.style.padding = "20px";
        popupElement.style.position = "relative";
        var messageElement = document.createElement("p");
        messageElement.textContent = message;
        // Customize button and popup based on type
        switch (type) {
            case "warning":
                popupElement.style.backgroundColor = "#ffcc00";
                messageElement.style.color = "#333";
                break;
            case "success":
                popupElement.style.backgroundColor = "#d4edda";
                messageElement.style.color = "#155724";
                break;
            case "error":
                popupElement.style.backgroundColor = "#f8d7da";
                messageElement.style.color = "#721c24";
                break;
            default:
                popupElement.style.backgroundColor = "#e0e0e0";
                messageElement.style.color = "#000";
                break;
        }
        popupElement.appendChild(messageElement);
        var popupOptions = {
            title: type.charAt(0).toUpperCase() + type.slice(1),
            dialogType: "General",
            modal: true,
            width: 400,
            minHeight: 200,
            icon: type,
            closeOnEscape: true,
            content: popupElement,
            buttons: [
                {
                    text: "Close",
                    width: 85,
                    click: function (event, model) {
                        if (ScriptUtil.version >= 2.0) {
                            model.close(true);
                        }
                        else {
                            $(this).inforDialog("close");
                        }
                    },
                },
            ],
        };
        if (ScriptUtil.version >= 2.0) {
            H5ControlUtil.H5Dialog.CreateDialogElement(popupElement, popupOptions);
        }
        else {
            $(popupElement).inforMessageDialog(popupOptions);
        }
    };
    C07_MWS068B_PrintEtiquette.prototype.showPopup = function () {
        var _this = this;
        var popupContent = $("<div id=\"".concat(this.POPUP_ID, "\" style=\"height:100px\">\n                </div>"));
        var popupButtons = [
            {
                text: "Annuler",
                width: 85,
                id: "ppopup_close",
                click: function (event, model) {
                    if (ScriptUtil.version >= 2.0) {
                        model.close(true);
                    }
                    else {
                        $(this).inforDialog("close");
                    }
                },
            },
            {
                text: "Confirmer",
                width: 85,
                id: "ppopup_confirm",
                click: function (event, model) {
                    //confirm action
                    _this.runConfirm(this, model);
                },
            },
        ];
        var titleTxt = "Impression étiquette";
        var popupOptions = {
            title: titleTxt,
            dialogType: "General",
            modal: true,
            width: 300,
            minHeight: 200,
            //icon: 'search',
            closeOnEscape: true,
            buttons: popupButtons,
        };
        if (ScriptUtil.version >= 2.0) {
            H5ControlUtil.H5Dialog.CreateDialogElement(popupContent[0], popupOptions);
        }
        else {
            popupContent.inforMessageDialog(popupOptions);
        }
        this.createChamp(popupContent);
    };
    C07_MWS068B_PrintEtiquette.prototype.createChamp = function (container) {
        container.append("\n                <div style=\"display:flex;flex-direction:column\" id=\"inputContainer\">\n                    <span><p>Imprimante : </p><input type=\"text\" id=\"inputDEV\" value=\"".concat(this.varDEV0, "\" style=\"width: 150px\"/></span>\n                </div>\n            "));
        this.makeBrowserable("inputDEV");
    };
    C07_MWS068B_PrintEtiquette.prototype.makeBrowserable = function (browseField) {
        var _this_1 = this;
        $('<span class="trigger h5-lookup-trigger">\n                <span class="h5-lookup-icon-container" style="height: 38px; display: flex; align-items: center;">\n                    <svg soho-icon="" class="h5-lookup-icon top-auto icon"\n                        aria-hidden="false" focusable="false" role="presentation">\n                        <use href="#icon-search-list-mod"></use>\n                    </svg>\n                </span>\n            </span>')
            .insertAfter($("#" + browseField))
            .css({
            "min-width": "14px",
            width: "14px",
            height: "100%",
            "margin-top": "0!important",
            "margin-left": "0!important",
            "margin-right": "0!important",
            left: "300px",
            //right: "3px",
            position: "absolute",
            cursor: "pointer",
        })
            .click(function () {
            _this_1.showBrowseDialog();
            _this_1.fetchPrinter();
        });
        var style = $("#" + browseField).attr("style") + "padding-right: 18px !important";
        //ajout F4 listener
        $("#" + browseField)
            .attr("style", style)
            .keydown(function (e) {
            if (e.which === 115) {
                _this_1.showBrowseDialog();
                _this_1.fetchPrinter();
                e.preventDefault();
                e.stopPropagation();
            }
        });
    };
    C07_MWS068B_PrintEtiquette.prototype.showBrowseDialog = function () {
        var browseDialogContent = $('<div id="' + this.DATAGRID_ID + '" style="height: 350px"></div>');
        var browseDialogButtons = [
            {
                text: "Fermer",
                width: 85,
                id: this.BTNCLOSE_ID,
                click: function (event, model) {
                    if (ScriptUtil.version >= 2.0) {
                        model.close(true);
                    }
                    else {
                        $(this).inforDialog("close");
                    }
                },
            },
        ];
        var titleTxt = "Imprimantes";
        var browseDialogOptions = {
            title: titleTxt,
            dialogType: "General",
            modal: true,
            width: 500,
            minHeight: 300,
            //icon: 'search',
            closeOnEscape: true,
            buttons: browseDialogButtons,
        };
        if (ScriptUtil.version >= 2.0) {
            H5ControlUtil.H5Dialog.CreateDialogElement(browseDialogContent[0], browseDialogOptions);
        }
        else {
            browseDialogContent.inforMessageDialog(browseDialogOptions);
        }
    };
    C07_MWS068B_PrintEtiquette.prototype.fetchPrinter = function () {
        return __awaiter(this, void 0, void 0, function () {
            var columns, selectedField, request, response, items, resultat, filtred, notFilterd, e_1;
            var _this_1 = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        columns = [
                            { id: "DEV1", field: "DEV1", name: "Imprimante", filterType: "text" }
                        ];
                        selectedField = "DEV1";
                        $("#" + this.DATAGRID_ID)
                            .datagrid({
                            columns: columns,
                            data: [],
                            filterable: true,
                            selectable: "single",
                            rowHeight: "small",
                            spacerColumn: true,
                        })
                            .on("selected", function (e, args) {
                            $("#inputDEV").ready(function () {
                                $("#inputDEV").val(args[0].data[selectedField]).focus();
                                _this_1.varDEV0 = args[0].data[selectedField];
                                ScriptUtil.version >= 2.0
                                    ? $("#" + _this_1.BTNCLOSE_ID).click()
                                    : $(_this_1).inforDialog("close");
                            });
                        });
                        request = new MIRequest();
                        request.program = "MNS205MI";
                        request.transaction = "Lst";
                        request.record = {
                            PRTF: 'ETIQUETTE',
                            MEDC: '*PRT'
                        };
                        request.outputFields = ["DEV1", "PRFT", "USID"];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.miService.executeRequestV2(request)];
                    case 2:
                        response = _a.sent();
                        items = response.items;
                        resultat = items.map(function (item) {
                            return {
                                DEV1: item["DEV1"],
                                USID: item["USID"]
                            };
                        });
                        filtred = resultat.filter(function (i) { return i.USID === ScriptUtil.GetUserContext('USID'); });
                        notFilterd = resultat.filter(function (i) { return !i.USID; });
                        if (filtred.length > 0) {
                            $("#" + this.DATAGRID_ID)
                                .data("datagrid")
                                .updateDataset(filtred);
                        }
                        else {
                            $("#" + this.DATAGRID_ID)
                                .data("datagrid")
                                .updateDataset(notFilterd);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.error("Error on fetching printer");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return C07_MWS068B_PrintEtiquette;
}());
