"use strict";
/*
    H5Script C02_PPS200B_LaunchOADEB
  * @author: Joel Randrianarivelo
  * @version: 1.0.0
  * @since: 2024-11-15
*/
/**
 * CHANGELOGS
 * Version    Date       User        Description
 * 1.0.0      151124     JOEL        Initial Release
 * 1.0.1      191124     JOEL        Correction
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
var C02_PPS200B_LaunchOADEB = /** @class */ (function () {
    function C02_PPS200B_LaunchOADEB(scriptArgs) {
        this.controller = scriptArgs.controller;
        if (ScriptUtil.version >= 2.0) {
            this.miService = MIService;
        }
        else {
            this.miService = MIService.Current;
        }
        this.contentElement = this.controller.GetContentElement();
        this.POPUP_ID = "POPUP_EASYLOG";
        this.POPUP_CLOSE_ID = "POPUP_EASYLOG_CLOSE";
        this.POPUP_CONFIRM_ID = "POPUP_EASYLOG_CONFIRM";
        this.iFDAT = "";
        this.iTDAT = "";
        this.iSUNO = "";
        this.DATAGRID_ID = "DATAGRID_SUNO";
        this.BTNCLOSE_ID = "BTNCLOSE_SUNO";
        this.$host = this.controller.ParentWindow;
    }
    C02_PPS200B_LaunchOADEB.Init = function (args) {
        new C02_PPS200B_LaunchOADEB(args).run();
    };
    C02_PPS200B_LaunchOADEB.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ordreTri;
            var _this_1 = this;
            return __generator(this, function (_a) {
                ordreTri = this.controller.GetSortingOrder();
                if (ordreTri == "21") {
                    this.createButton();
                    this.$host.find("#EnvEasylog").on("click", function (e) {
                        e.preventDefault();
                        _this_1.showPopup();
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    C02_PPS200B_LaunchOADEB.prototype.createButton = function () {
        var btnSend = new ButtonElement();
        btnSend.Name = "EnvEasylog";
        btnSend.Value = "Envoi vers Easylog";
        btnSend.Position = new PositionElement();
        btnSend.Position.Top = 7;
        btnSend.Position.Left = 70;
        btnSend.Position.Width = 15;
        this.contentElement.AddElement(btnSend);
    };
    C02_PPS200B_LaunchOADEB.prototype.showPopup = function () {
        var _this = this;
        var popupContent = $("<div id=\"".concat(this.POPUP_ID, "\" style=\"height:350px\">\n            </div>"));
        var popupButtons = [
            {
                text: "Annuler",
                width: 85,
                id: this.POPUP_CLOSE_ID,
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
                id: this.POPUP_CONFIRM_ID,
                click: function (event, model) {
                    //confirm action
                    _this.runConfirm(this, model);
                },
            },
        ];
        var titleTxt = "Envoi vers Easylog";
        var popupOptions = {
            title: titleTxt,
            dialogType: "General",
            modal: true,
            width: 500,
            minHeight: 300,
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
    C02_PPS200B_LaunchOADEB.prototype.createChamp = function (container) {
        var _this_1 = this;
        container.append("\n            <div style=\"display:flex;flex-direction:column\" id=\"inputContainer\">\n                <span><p>Date r\u00E9ception de : </p><input type=\"text\" id=\"inputFDAT\" value=\"".concat(this.iFDAT, "\" style=\"width: 150px\"/></span>\n                <span><p>A : </p><input type=\"text\" id=\"inputTDAT\" value=\"").concat(this.iTDAT, "\" style=\"width: 150px\"/></span>\n                <span><p>Code Fournisseur : </p><input type=\"text\" id=\"inputSUNO\" value=\"").concat(this.iSUNO, "\" style=\"width: 300px!important\"/></span>\n            </div>\n        "));
        this.createDatePicker("inputFDAT");
        this.createDatePicker("inputTDAT");
        $("#inputSUNO").ready(function () {
            _this_1.makeBrowserable("inputSUNO");
        });
        $("#inputFDAT").ready(function () {
            $("#inputFDAT").on("change", function () {
                $("#inputFDAT").ready(function () {
                    _this_1.iFDAT = $("#inputFDAT").val();
                });
            });
        });
        $("#inputTDAT").ready(function () {
            $("#inputTDAT").on("change", function () {
                $("#inputTDAT").ready(function () {
                    _this_1.iTDAT = $("#inputTDAT").val();
                });
            });
        });
        $("#inputSUNO").ready(function () {
            $("#inputSUNO").on("change", function () {
                $("#inputSUNO").ready(function () {
                    _this_1.iSUNO = $("#inputSUNO").val();
                });
            });
        });
    };
    C02_PPS200B_LaunchOADEB.prototype.makeBrowserable = function (browseField) {
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
            _this_1.fetchFournisseur();
        });
        var style = $("#" + browseField).attr("style") + "padding-right: 18px !important";
        //ajout F4 listener
        $("#" + browseField)
            .attr("style", style)
            .keydown(function (e) {
            if (e.which === 115) {
                _this_1.showBrowseDialog();
                _this_1.fetchFournisseur();
                e.preventDefault();
                e.stopPropagation();
            }
        });
    };
    C02_PPS200B_LaunchOADEB.prototype.showBrowseDialog = function () {
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
        var titleTxt = "Fournisseur";
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
    C02_PPS200B_LaunchOADEB.prototype.fetchFournisseur = function () {
        return __awaiter(this, void 0, void 0, function () {
            var columns, selectedField, request, response, items, resultat, e_1;
            var _this_1 = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        columns = [
                            { id: "SUSUNO", field: "SUSUNO", name: "Code", filterType: "text" },
                            { id: "SUSUNM", field: "SUSUNM", name: "Nom", filterType: "text" },
                        ];
                        selectedField = "SUSUNO";
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
                            $("#inputSUNO").ready(function () {
                                $("#inputSUNO").val(args[0].data[selectedField]).focus();
                                _this_1.iSUNO = args[0].data[selectedField];
                                ScriptUtil.version >= 2.0
                                    ? $("#" + _this_1.BTNCLOSE_ID).click()
                                    : $(_this_1).inforDialog("close");
                            });
                        });
                        request = new MIRequest();
                        request.program = "CRS620MI";
                        request.transaction = "LstSuppliers";
                        request.outputFields = ["SUNO", "SUNM"];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.miService.executeRequestV2(request)];
                    case 2:
                        response = _a.sent();
                        items = response.items;
                        resultat = items.map(function (item) {
                            return {
                                SUSUNO: item["SUNO"],
                                SUSUNM: item["SUNM"],
                            };
                        });
                        $("#" + this.DATAGRID_ID)
                            .data("datagrid")
                            .updateDataset(resultat);
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.error("Error on CRS620MI");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    C02_PPS200B_LaunchOADEB.prototype.createDatePicker = function (id) {
        $("#".concat(id)).ready(function () {
            $("#".concat(id)).datepicker({
                dateFormat: "yyyy/MM/dd",
            });
        });
    };
    //traitement
    C02_PPS200B_LaunchOADEB.prototype.runConfirm = function (modal, model) {
        return __awaiter(this, void 0, void 0, function () {
            var requestCheck, responseCheck, requestInterface, res, e_2, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.iFDAT.trim() != "" && this.iTDAT.trim() != "")) return [3 /*break*/, 11];
                        if (!this.isDateGreater(this.iTDAT, this.iFDAT)) return [3 /*break*/, 9];
                        requestCheck = new MIRequest();
                        requestCheck.program = "CRS620MI";
                        requestCheck.transaction = "GetBasicData";
                        requestCheck.outputFields = ["SUNO"];
                        requestCheck.record = {
                            SUNO: this.iSUNO,
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, this.miService.executeRequestV2(requestCheck)];
                    case 2:
                        responseCheck = _a.sent();
                        //RG02 : Contrôle existence données
                        if (responseCheck.items.length == 0) {
                            if (this.iSUNO.trim() != "") {
                                this.showPopupText("Fournisseur ".concat(this.iSUNO, " n'existe pas"), "warning");
                                return [2 /*return*/];
                            }
                        }
                        requestInterface = new MIRequest();
                        requestInterface.program = "CUSEXTMI";
                        requestInterface.transaction = "ChgAlphaKPI";
                        console.log(this.iSUNO);
                        requestInterface.record = {
                            KPID: "INTERFACE",
                            PK01: "CustomTriggerDEB_Sync_Out",
                            AL30: this.iFDAT.split("/").join(""),
                            AL31: this.iTDAT.split("/").join(""),
                            AL32: this.iSUNO.trim() == "" ? "?" : this.iSUNO.trim(),
                        };
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.miService.executeRequestV2(requestInterface)];
                    case 4:
                        res = _a.sent();
                        console.log(res);
                        if (ScriptUtil.version >= 2.0) {
                            model.close(true);
                        }
                        else {
                            $(modal).inforDialog("close");
                        }
                        this.showPopupText("La sélection a bien été envoyée à l'ESB", "success");
                        return [3 /*break*/, 6];
                    case 5:
                        e_2 = _a.sent();
                        console.error("Error on CUSEXTMI.ChgAlphaKPI");
                        this.showPopupText("Erreur API", "error");
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        e_3 = _a.sent();
                        console.error("Error on CRS620MI.GetBasicData");
                        //RG02 : Contrôle existence données
                        this.showPopupText("Fournisseur ".concat(this.iSUNO, " n'existe pas"), "warning");
                        return [3 /*break*/, 8];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        this.showPopupText("Date De doit être inférieur à Date à", "warning");
                        _a.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        this.showPopupText("Date obligatoire!", "warning");
                        _a.label = 12;
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    C02_PPS200B_LaunchOADEB.prototype.isDateGreater = function (dateF, dateT) {
        var d1 = new Date(dateF);
        var d2 = new Date(dateT);
        return d1 > d2;
    };
    C02_PPS200B_LaunchOADEB.prototype.showPopupText = function (message, type) {
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
    return C02_PPS200B_LaunchOADEB;
}());
