"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
/*
    H5Script C04_PMS010E_ConvertBatchOF
  * @author: Joel Randrianarivelo
  * @version: 1.0.0
  * @since: 2024-10-25
  * @description: Conversion en quantité batch
*/
/**
 * CHANGELOGS
 * Version    Date       User        Description
 * 1.0.0   25-10-2024    JOEL        Initial Release
 * 1.0.1   20-11-2024    JOEL        Ajustement spécifique suite utilisation PROJ et ELNO
 * 1.0.2   12-12-2024    JOEL        Calcule en rendement
 */
var C04_PMS010E_ConvertBatchOF = /** @class */ (function () {
    function C04_PMS010E_ConvertBatchOF(scriptArgs) {
        this.controller = scriptArgs.controller;
        this.argument = scriptArgs.args;
        if (ScriptUtil.version >= 2.0) {
            this.miService = MIService;
        }
        else {
            this.miService = MIService.Current;
        }
        this.contentElement = this.controller.GetContentElement();
        this.vMAUN_B = "0";
        this.vCOFA_B = "0";
        this.vDMCF_B = "0";
        this.vORQA_temp = 0;
        this.tabBatch = [];
        this.$host = this.controller.ParentWindow;
        this.DATAGRID_ID = "browse-datagrid";
        this.BTNCLOSE_ID = "browse-btn-close";
        this.U_B = null;
        this.Q_B = null;
    }
    C04_PMS010E_ConvertBatchOF.prototype.onRequesting = function (args) {
        if (args.commandType === "KEY" && args.commandValue === "F12") {
            var contentDialog_1 = $("<p>Merci de bien vouloir finaliser la reprogrammation et de v\u00E9rifier les quantit\u00E9s batch</p>");
            var dialogBut = [
                {
                    text: 'OK',
                    isDefault: true,
                    with: 80,
                    click: function (event, modal) {
                        if (ScriptUtil.version >= 2.0) {
                            modal.close(true);
                        }
                        else {
                            $(this).inforDialog('close');
                        }
                    }
                }
            ];
            var dialogOption = {
                title: 'Information',
                dialogType: 'General',
                modal: true,
                width: 600,
                minHeight: 480,
                icon: 'info',
                closeOnEscape: true,
                close: function () {
                    contentDialog_1.remove();
                },
                buttons: dialogBut
            };
            if (ScriptUtil.version >= 2.0) {
                H5ControlUtil.H5Dialog.CreateDialogElement(contentDialog_1[0], dialogOption);
            }
            else {
                contentDialog_1.inforMessageDialog(dialogOption);
            }
            args.cancel = true;
            return; // The user should be allowed to go back
        }
    };
    C04_PMS010E_ConvertBatchOF.prototype.onRequested = function (args) {
        this.unsubscribeRequested();
        this.unsubscribeRequesting();
    };
    C04_PMS010E_ConvertBatchOF.Init = function (args) {
        new C04_PMS010E_ConvertBatchOF(args).run();
    };
    /** Ajout de label pour le champ ecran quantité batch */
    C04_PMS010E_ConvertBatchOF.prototype.addQuantiteLabel = function () {
        var labelElement = new LabelElement();
        labelElement.Name = "Qté_Batch";
        labelElement.Value = "Quantité Batch";
        labelElement.Position = new PositionElement();
        labelElement.Position.Top = 8;
        labelElement.Position.Left = 65;
        this.contentElement.AddElement(labelElement);
    };
    /** Ajout de input pour le champ ecran quantité batch */
    C04_PMS010E_ConvertBatchOF.prototype.addQuantiteTextBox = function () {
        var textElement = new TextBoxElement();
        textElement.Name = "Q_B";
        textElement.Value = "";
        textElement.Position = new PositionElement();
        textElement.Position.Top = 8;
        textElement.Position.Left = 76;
        textElement.Position.Width = 15;
        this.contentElement.AddElement(textElement);
        this.Q_B = textElement;
    };
    /** Ajout de label pour le champ ecran unité batch */
    C04_PMS010E_ConvertBatchOF.prototype.addUniteLabel = function () {
        var labelElement = new LabelElement();
        labelElement.Name = "UC_Batch";
        labelElement.Value = "Unité Batch";
        labelElement.Position = new PositionElement();
        labelElement.Position.Top = 8;
        labelElement.Position.Left = 94;
        this.contentElement.AddElement(labelElement);
    };
    /** Ajout de input pour le champ ecran unité batch */
    C04_PMS010E_ConvertBatchOF.prototype.addUniteTextBox = function () {
        var textElement = new TextBoxElement();
        textElement.Name = "U_B";
        textElement.Value = "";
        textElement.Position = new PositionElement();
        textElement.Position.Top = 8;
        textElement.Position.Left = 100;
        textElement.Position.Width = 5;
        this.contentElement.AddElement(textElement);
        this.U_B = textElement;
    };
    /** Remplir la table de selection */
    C04_PMS010E_ConvertBatchOF.prototype.fetchData = function (BAQT, MFPC) {
        var _this = this;
        var columns = [
            { id: "OKALUN", field: "OKALUN", name: "ALUN", filterType: "text" },
            { id: "OKTX40", field: "OKTX40", name: "TX40", filterType: "text" },
        ];
        var selectedField = "OKALUN";
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
            _this.$host.find("#U_B").val(args[0].data[selectedField]).focus();
            _this.vMAUN_B = args[0].data[selectedField];
            _this.$host.find("#WAELNO").val(args[0].data[selectedField]);
            _this.vCOFA_B = args[0].data["OKCOFA"];
            _this.vDMCF_B = args[0].data["OKDMCF"];
            //this.$host.find("#Q_B").val("0");
            _this.calculQB(BAQT, MFPC);
            ScriptUtil.version >= 2.0
                ? $("#" + _this.BTNCLOSE_ID).click()
                : $(_this).inforDialog("close");
        });
        var resInprogress = this.tabBatch.map(function (e) {
            return {
                OKALUN: e["ALUN"],
                OKTX40: e["TX40"],
                OKCOFA: e["COFA"],
                OKDMCF: e["DMCF"],
            };
        });
        $("#" + this.DATAGRID_ID)
            .data("datagrid")
            .updateDataset(resInprogress);
        return resInprogress;
    };
    /** montrer le pop up de selection */
    C04_PMS010E_ConvertBatchOF.prototype.showBrowseDialog = function () {
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
        var titleTxt = "Unité batch";
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
    /** Rendre navigable */
    C04_PMS010E_ConvertBatchOF.prototype.makeBrowserable = function (BAQT, MFPC) {
        var _this = this;
        var browseField = "U_B";
        $('<span class="trigger h5-lookup-trigger">\n                <span class="h5-lookup-icon-container" style="height: 100%; display: flex; align-items: center;">\n                    <svg soho-icon="" class="h5-lookup-icon top-auto icon"\n                        aria-hidden="false" focusable="false" role="presentation">\n                        <use href="#icon-search-list-mod"></use>\n                    </svg>\n                </span>\n            </span>')
            .insertAfter(this.$host.find("#" + browseField))
            .css({
            "min-width": "14px",
            width: "14px",
            height: "100%",
            "margin-top": "0!important",
            "margin-left": "0!important",
            "margin-right": "0!important",
            left: "unset",
            right: "3px",
            position: "absolute",
            cursor: "pointer",
        })
            .click(function () {
            _this.showBrowseDialog();
            var resp = _this.fetchData(BAQT, MFPC);
        });
        var style = this.$host.find("#" + browseField).attr("style") +
            "padding-right: 18px !important";
        //ajout F4 listener
        this.$host
            .find("#" + browseField)
            .attr("style", style)
            .keydown(function (e) {
            if (e.which === 115) {
                _this.showBrowseDialog();
                _this.fetchData(BAQT, MFPC);
                e.preventDefault();
                e.stopPropagation();
            }
        });
    };
    C04_PMS010E_ConvertBatchOF.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var argument, tabFACI, tabORTY, WAFACI, WWPRNO, WWMFNO, req, ORTY, PROJ_1, MFPC_1, ELNO_1, BAQT_1, rep, e_1, MMS015Request, MMS015Response, items, _i, items_1, item, CRS050Request, CRS050Response, e_2, e_3;
            var _this = this;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.info("1.0.2   12-12-2024    JOEL        Calcule en rendement");
                        argument = this.argument.split(",");
                        tabFACI = argument[0].split("/");
                        tabORTY = argument[1].split("/");
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                setTimeout(function () {
                                    resolve("");
                                }, 1000);
                            })];
                    case 1:
                        _c.sent();
                        WAFACI = this.$host.find("#WAFACI");
                        WWPRNO = this.$host.find("#WWPRNO");
                        WWMFNO = this.$host.find("#WWMFNO");
                        if (!tabFACI.includes(WAFACI.val())) return [3 /*break*/, 15];
                        this.unsubscribeRequesting = this.controller.Requesting.On(function (e) {
                            _this.onRequesting(e);
                        });
                        this.unsubscribeRequested = this.controller.Requested.On(function (e) {
                            _this.onRequested(e);
                        });
                        req = new MIRequest();
                        req.program = "MDBREADMI";
                        req.transaction = "GetMWOHED00";
                        req.record = {
                            FACI: WAFACI.val(),
                            PRNO: WWPRNO.val(),
                            MFNO: WWMFNO.val(),
                        };
                        req.outputFields = ["ORTY", "PROJ", "MFPC", "ELNO", "BAQT"];
                        ORTY = void 0;
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.miService.executeRequestV2(req)];
                    case 3:
                        rep = _c.sent();
                        ORTY = rep.item["ORTY"];
                        PROJ_1 = rep.item["PROJ"];
                        MFPC_1 = rep.item["MFPC"];
                        ELNO_1 = rep.item["ELNO"];
                        BAQT_1 = rep.item["BAQT"];
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _c.sent();
                        console.error("erreur MDBREAMI");
                        return [2 /*return*/];
                    case 5:
                        //if (ELNO == "" || !ELNO) return;
                        //RG02 : Création de 2 champs spécifiques
                        this.addQuantiteLabel();
                        this.addQuantiteTextBox();
                        if (parseFloat(BAQT_1) > 0) {
                            if (MFPC_1 && MFPC_1.trim() != "") {
                                this.addUniteLabel();
                                this.addUniteTextBox();
                            }
                        }
                        else {
                            this.addUniteLabel();
                            this.addUniteTextBox();
                        }
                        if (ELNO_1) {
                            //@ts-ignore
                            (_a = this.U_B) === null || _a === void 0 ? void 0 : _a.Value = ELNO_1;
                            this.$host.find("#U_B").ready(function () {
                                _this.$host.find("#U_B").val(ELNO_1);
                            });
                        }
                        if (PROJ_1) {
                            console.log(PROJ_1);
                            //@ts-ignore
                            (_b = this.Q_B) === null || _b === void 0 ? void 0 : _b.Value = PROJ_1;
                            this.$host.find("Q_B").ready(function () {
                                _this.$host.find("Q_B").val(PROJ_1);
                            });
                        }
                        //RG04 : Récupération des unité Batch de l'OF
                        //@ts-ignore
                        this.controller.ShowBusyIndicator();
                        MMS015Request = new MIRequest();
                        MMS015Request.program = "MMS015MI";
                        MMS015Request.transaction = "Lst";
                        MMS015Request.record = {
                            ITNO: MFPC_1 ? (MFPC_1 != "" ? MFPC_1 : WWPRNO.val()) : WWPRNO.val(),
                            AUTP: "1",
                            NFTR: "2",
                        };
                        MMS015Request.outputFields = ["ALUN", "COFA", "DMCF", "AUS4"];
                        _c.label = 6;
                    case 6:
                        _c.trys.push([6, 14, , 15]);
                        return [4 /*yield*/, this.miService.executeRequestV2(MMS015Request)];
                    case 7:
                        MMS015Response = _c.sent();
                        items = MMS015Response.items;
                        this.tabBatch = [];
                        _i = 0, items_1 = items;
                        _c.label = 8;
                    case 8:
                        if (!(_i < items_1.length)) return [3 /*break*/, 13];
                        item = items_1[_i];
                        CRS050Request = new MIRequest();
                        CRS050Request.program = "CRS050MI";
                        CRS050Request.transaction = "Get";
                        CRS050Request.record = {
                            UNIT: item.ALUN,
                        };
                        CRS050Request.outputFields = ["UMCT", "TX40"];
                        _c.label = 9;
                    case 9:
                        _c.trys.push([9, 11, , 12]);
                        return [4 /*yield*/, this.miService.executeRequestV2(CRS050Request)];
                    case 10:
                        CRS050Response = _c.sent();
                        if (CRS050Response.item["UMCT"] == "2") {
                            this.tabBatch.push(__assign(__assign({}, item), { UMCT: CRS050Response.item["UMCT"], TX40: CRS050Response.item["TX40"] }));
                            if (item["ALUN"] == ELNO_1) {
                                this.vCOFA_B = item["COFA"];
                                this.vDMCF_B = item["DMCF"];
                                this.vMAUN_B = item["ALUN"];
                                this.$host.find("#U_B").ready(function () {
                                    _this.$host.find("#U_B").val(_this.vMAUN_B);
                                    _this.$host.find("#Q_B").ready(function () {
                                        _this.$host.find("#Q_B").val(PROJ_1);
                                    });
                                });
                            }
                        }
                        return [3 /*break*/, 12];
                    case 11:
                        e_2 = _c.sent();
                        console.error("Erreur lors de l'appel API CRS050MI.Get on :", item);
                        return [3 /*break*/, 12];
                    case 12:
                        _i++;
                        return [3 /*break*/, 8];
                    case 13:
                        //RG06  : Promt F4
                        this.makeBrowserable(BAQT_1, MFPC_1);
                        //@ts-ignore
                        this.controller.HideBusyIndicator();
                        //RG09 : Calcul Quantité UC OF
                        this.$host.find("#Q_B").ready(function () {
                            _this.$host.find("#Q_B").on("change", function () {
                                _this.calculQS(BAQT_1, MFPC_1);
                            });
                        });
                        //RG10 : Calcul Quantité Batch OF
                        this.$host.find("#WWORQA").ready(function () {
                            _this.$host.find("#WWORQA").on("change", function () {
                                _this.calculQB(BAQT_1, MFPC_1);
                            });
                        });
                        this.$host.find("#U_B").ready(function () {
                            _this.$host.find("#U_B").on("change", function () {
                                var unité = _this.$host.find("#U_B").val();
                                for (var _i = 0, _a = _this.tabBatch; _i < _a.length; _i++) {
                                    var i = _a[_i];
                                    if (unité == i["ALUN"]) {
                                        _this.vMAUN_B = i["ALUN"];
                                        _this.vCOFA_B = i["COFA"];
                                        _this.vDMCF_B = i["DMCF"];
                                        _this.calculQB(BAQT_1, MFPC_1);
                                    }
                                }
                            });
                        });
                        return [3 /*break*/, 15];
                    case 14:
                        e_3 = _c.sent();
                        console.error("Erreur sur l'appel api MMS015MI.Lst");
                        return [3 /*break*/, 15];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    C04_PMS010E_ConvertBatchOF.prototype.calculQS = function (BAQT, MFPC) {
        return __awaiter(this, void 0, void 0, function () {
            var WAFACI, WWPRNO, WWMFNO, req, err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.vDMCF_B == "1") {
                            this.vORQA_temp =
                                (parseFloat(this.$host.find("#Q_B").val())
                                    ? parseFloat(this.$host.find("#Q_B").val())
                                    : 0) * parseFloat(this.vCOFA_B);
                        }
                        if (this.vDMCF_B == "2") {
                            this.vORQA_temp =
                                (parseFloat(this.$host.find("#Q_B").val())
                                    ? parseFloat(this.$host.find("#Q_B").val())
                                    : 0) / parseFloat(this.vCOFA_B);
                        }
                        if (this.vORQA_temp.toString().trim() !=
                            this.$host.find("#WWORQA").val().trim()) {
                            this.$host.find("#WWORQA").ready(function () {
                                _this.$host.find("#WWORQA").val("".concat(_this.vORQA_temp));
                            });
                        }
                        //gestion en mode Rendement
                        if (parseFloat(BAQT) > 0 && (!MFPC || MFPC.trim() == "")) {
                            this.$host.find("#Q_B").ready(function () {
                                _this.$host
                                    .find("#WWORQA")
                                    .val("".concat(Number((parseFloat(_this.$host.find("#Q_B").val()) * parseFloat(BAQT)).toFixed(3))));
                            });
                            this.$host.find("#U_B").val("");
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, new Promise(function (resolve, rejection) {
                                setTimeout(function () {
                                    resolve('');
                                }, 500);
                            })];
                    case 2:
                        _a.sent();
                        WAFACI = this.$host.find("#WAFACI");
                        WWPRNO = this.$host.find("#WWPRNO");
                        WWMFNO = this.$host.find("#WWMFNO");
                        req = new MIRequest();
                        req.program = "PMS100MI";
                        req.transaction = "UpdMO";
                        req.record = {
                            FACI: WAFACI.val(),
                            PRNO: WWPRNO.val(),
                            MFNO: WWMFNO.val(),
                            PROJ: this.$host.find("#Q_B").val(),
                            ELNO: this.$host.find("#U_B").val(),
                        };
                        //@ts-ignore
                        return [4 /*yield*/, this.miService.executeRequestV2(req)];
                    case 3:
                        //@ts-ignore
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        console.error("Erreur PMS100MI.UpdMO : ", err_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    C04_PMS010E_ConvertBatchOF.prototype.calculQB = function (BAQT, MFPC) {
        return __awaiter(this, void 0, void 0, function () {
            var WAFACI, WWPRNO, WWMFNO, req, err_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.vDMCF_B == "1") {
                            this.vORQA_temp =
                                (parseFloat(this.$host.find("#WWORQA").val())
                                    ? parseFloat(this.$host.find("#WWORQA").val())
                                    : 0) / parseFloat(this.vCOFA_B);
                        }
                        if (this.vDMCF_B == "2") {
                            this.vORQA_temp =
                                (parseFloat(this.$host.find("#WWORQA").val())
                                    ? parseFloat(this.$host.find("#WWORQA").val())
                                    : 0) * parseFloat(this.vCOFA_B);
                        }
                        if (this.vORQA_temp.toString().trim() != this.$host.find("#Q_B").val().trim()) {
                            this.$host.find("#Q_B").ready(function () {
                                _this.$host.find("#Q_B").val("".concat(Number(_this.vORQA_temp.toFixed(3))));
                            });
                        }
                        //gestion en mode Rendement
                        if (parseFloat(BAQT) > 0 && (!MFPC || MFPC.trim() == "")) {
                            this.$host.find("#Q_B").ready(function () {
                                _this.$host
                                    .find("#Q_B")
                                    .val("".concat(Number((parseFloat(_this.$host.find("#WWORQA").val()) / parseFloat(BAQT)).toFixed(3))));
                            });
                            this.$host.find("#U_B").val("");
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, new Promise(function (resolve, rejection) {
                                setTimeout(function () {
                                    resolve('');
                                }, 500);
                            })];
                    case 2:
                        _a.sent();
                        WAFACI = this.$host.find("#WAFACI");
                        WWPRNO = this.$host.find("#WWPRNO");
                        WWMFNO = this.$host.find("#WWMFNO");
                        req = new MIRequest();
                        req.program = "PMS100MI";
                        req.transaction = "UpdMO";
                        req.record = {
                            FACI: WAFACI.val(),
                            PRNO: WWPRNO.val(),
                            MFNO: WWMFNO.val(),
                            PROJ: this.$host.find("#Q_B").val(),
                            ELNO: this.$host.find("#U_B").val(),
                        };
                        //@ts-ignore
                        return [4 /*yield*/, this.miService.executeRequestV2(req)];
                    case 3:
                        //@ts-ignore
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_2 = _a.sent();
                        console.error("Erreur PMS100MI.UpdMO : ", err_2);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return C04_PMS010E_ConvertBatchOF;
}());
