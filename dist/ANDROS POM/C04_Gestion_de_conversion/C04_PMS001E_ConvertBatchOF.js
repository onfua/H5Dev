"use strict";
/*
    H5Script C04_PMS001E_ConvertBatchOF
  * @author: Joel Randrianarivelo
  * @version: 1.0.0
  * @since: 2024-10-22
  * @description: Conversion en quantité batch
*/
/**
 * CHANGELOGS
 * Version    Date       User        Description
 * 1.0.0   22-10-2024    JOEL        Initial Release
 * 1.0.1   20-11-2024    JOEL        Ajustement spécifique suite utilisation PROJ et ELNO
 * 1.0.2   12-12-2024    JOEL        Calcule en rendement
 */
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
var C04_PMS001E_ConvertBatchOF = /** @class */ (function () {
    function C04_PMS001E_ConvertBatchOF(scriptArgs) {
        this.controller = scriptArgs.controller;
        this.argument = scriptArgs.args;
        if (ScriptUtil.version >= 2.0) {
            this.miService = MIService;
        }
        else {
            this.miService = MIService.Current;
        }
        this.$host = this.controller.ParentWindow;
        this.DATAGRID_ID = "browse-datagrid";
        this.BTNCLOSE_ID = "browse-btn-close";
        this.vMAUN_B = "0";
        this.vCOFA_B = "0";
        this.vDMCF_B = "0";
        this.vORQA_temp = 0;
        this.contentElement = this.controller.GetContentElement();
        this.tabBatch = [];
    }
    C04_PMS001E_ConvertBatchOF.Init = function (args) {
        new C04_PMS001E_ConvertBatchOF(args).run();
    };
    /** Remplir la table de selection */
    C04_PMS001E_ConvertBatchOF.prototype.fetchData = function () {
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
            _this.$host.find("#WAELNO").val(args[0].data[selectedField]).focus();
            _this.vMAUN_B = args[0].data[selectedField];
            _this.vCOFA_B = args[0].data["OKCOFA"];
            _this.vDMCF_B = args[0].data["OKDMCF"];
            _this.calculQB();
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
    C04_PMS001E_ConvertBatchOF.prototype.showBrowseDialog = function () {
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
    C04_PMS001E_ConvertBatchOF.prototype.makeBrowserable = function () {
        var _this = this;
        this.$host.find("#btnLookup_WAELNO").remove();
        var browseField = "WAELNO";
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
            var resp = _this.fetchData();
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
                _this.fetchData();
                e.preventDefault();
                e.stopPropagation();
            }
        });
    };
    C04_PMS001E_ConvertBatchOF.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var argument, tabFACI, tabORTY, WAORTY, WAFACI, WWPRNO_1, WAMFPC_1, MMS015Request, MMS015Response, items, _i, items_1, item, CRS050Request, CRS050Response, e_1, e_2;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        argument = this.argument.split(",");
                        tabFACI = argument[0].split("/");
                        tabORTY = argument[1].split("/");
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                setTimeout(function () {
                                    resolve("");
                                }, 500);
                            })];
                    case 1:
                        _b.sent();
                        WAORTY = this.$host.find("#WAORTY").val();
                        WAFACI = this.$host.find("#WAFACI").val();
                        if (!(tabFACI.includes(WAFACI) && tabORTY.includes(WAORTY))) return [3 /*break*/, 11];
                        console.info("1.0.2   12-12-2024    JOEL        Calcule en rendement");
                        WWPRNO_1 = this.$host.find("#WWPRNO").val();
                        WAMFPC_1 = (_a = this.$host.find("#WAMFPC")) === null || _a === void 0 ? void 0 : _a.val();
                        //@ts-ignore
                        this.controller.ShowBusyIndicator();
                        MMS015Request = new MIRequest();
                        MMS015Request.program = "MMS015MI";
                        MMS015Request.transaction = "Lst";
                        MMS015Request.record = {
                            ITNO: (WAMFPC_1 === null || WAMFPC_1 === void 0 ? void 0 : WAMFPC_1.trim()) != "" ? WAMFPC_1 : WWPRNO_1,
                            AUTP: "1",
                            NFTR: "2",
                        };
                        MMS015Request.outputFields = ["ALUN", "COFA", "DMCF", "AUS4"];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 10, , 11]);
                        return [4 /*yield*/, this.miService.executeRequestV2(MMS015Request)];
                    case 3:
                        MMS015Response = _b.sent();
                        items = MMS015Response.items;
                        this.tabBatch = [];
                        _i = 0, items_1 = items;
                        _b.label = 4;
                    case 4:
                        if (!(_i < items_1.length)) return [3 /*break*/, 9];
                        item = items_1[_i];
                        CRS050Request = new MIRequest();
                        CRS050Request.program = "CRS050MI";
                        CRS050Request.transaction = "Get";
                        CRS050Request.record = {
                            UNIT: item.ALUN,
                        };
                        CRS050Request.outputFields = ["UMCT", "TX40"];
                        _b.label = 5;
                    case 5:
                        _b.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, this.miService.executeRequestV2(CRS050Request)];
                    case 6:
                        CRS050Response = _b.sent();
                        if (CRS050Response.item["UMCT"] == "2") {
                            this.tabBatch.push(__assign(__assign({}, item), { UMCT: CRS050Response.item["UMCT"], TX40: CRS050Response.item["TX40"] }));
                            if (item["AUS4"] == "1") {
                                this.vMAUN_B = item["ALUN"];
                                this.vCOFA_B = item["COFA"];
                                this.vDMCF_B = item["DMCF"];
                                this.$host.find("#WAELNO").val(this.vMAUN_B);
                                this.calculQB();
                            }
                        }
                        return [3 /*break*/, 8];
                    case 7:
                        e_1 = _b.sent();
                        console.error("Erreur lors de l'appel API CRS050MI.Get on :", item);
                        return [3 /*break*/, 8];
                    case 8:
                        _i++;
                        return [3 /*break*/, 4];
                    case 9:
                        /** Suppression des ecrans et sorti du script si aucun element dans tabBatch */
                        if (this.tabBatch.length == 0) {
                            if ((parseFloat(this.$host.find("#WWBAQT").val()) > 0 &&
                                this.$host.find("#WAMFPC").val() &&
                                this.$host.find("#WAMFPC").val().trim() == "") ||
                                (parseFloat(this.$host.find("#WWBAQT").val()) > 0 &&
                                    !this.$host.find("#WAMFPC").val())) {
                                this.$host
                                    .find('div[componentname="WAMAUN"]')
                                    .css({ "pointer-events": "none" });
                                //@ts-ignore
                                this.controller.HideBusyIndicator();
                                this.$host.find("#btnLookup_WAPROJ").remove();
                                this.calculQB();
                                this.$host.find("#WWORQA").ready(function () {
                                    _this.$host.find("#WWORQA").on("change", function () {
                                        _this.calculQB();
                                    });
                                });
                                this.$host.find("#WAPROJ").css({ "pointer-events": "none" });
                                this.$host
                                    .find('div[componentname="WAELNO"]')
                                    .css({ display: "none" });
                            }
                            else {
                                //@ts-ignore
                                this.contentElement.RemoveScriptComponents();
                                //@ts-ignore
                                this.controller.HideBusyIndicator();
                                return [2 /*return*/];
                            }
                        }
                        else {
                            //RG03 : Initialiser des champs standarts
                            //this.controller.SetValue("WAWHST", "10");
                            //this.$host.find('div[componentname="WAWHST"]').css({ "pointer-events": "none" });
                            this.$host
                                .find('div[componentname="WAMAUN"]')
                                .css({ "pointer-events": "none" });
                            if ((parseFloat(this.$host.find("#WWBAQT").val()) > 0 &&
                                this.$host.find("#WAMFPC").val() &&
                                this.$host.find("#WAMFPC").val().trim() == "") ||
                                (parseFloat(this.$host.find("#WWBAQT").val()) > 0 &&
                                    !this.$host.find("#WAMFPC").val())) {
                                this.$host.find("#WAPROJ").css({ "pointer-events": "none" });
                                this.$host
                                    .find('div[componentname="WAELNO"]')
                                    .css({ display: "none" });
                            }
                            //this.contentElement.GetElement("WAELNO").css("display", "none");
                            //@ts-ignore
                            this.controller.HideBusyIndicator();
                            //RG05 : Init
                            /*this.vCOFA_B = "0";
                            this.vDMCF_B = "0";*/
                            //RG06
                            this.makeBrowserable();
                            this.$host.find("#btnLookup_WAPROJ").remove();
                            //RG08 : Recalcul tabBATCH
                            this.$host.find("#WAMFPC").ready(function () {
                                _this.$host.find("#WAMFPC").on("change", function () { return __awaiter(_this, void 0, void 0, function () {
                                    var MMS015Request, MMS015Response_1, items_3, _i, items_2, item, CRS050Request, CRS050Response, e_3, e_4;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (parseFloat(this.$host.find("#WWBAQT").val()) > 0 &&
                                                    this.$host.find("#WAMFPC").val().trim() == "") {
                                                    this.$host.find("#WAPROJ").css({ "pointer-events": "none" });
                                                    this.$host
                                                        .find('div[componentname="WAELNO"]')
                                                        .css({ display: "none" });
                                                }
                                                this.vCOFA_B = "0";
                                                this.vDMCF_B = "0";
                                                //@ts-ignore
                                                this.controller.ShowBusyIndicator();
                                                MMS015Request = new MIRequest();
                                                MMS015Request.program = "MMS015MI";
                                                MMS015Request.transaction = "Lst";
                                                MMS015Request.record = {
                                                    ITNO: WAMFPC_1.trim() != "" ? WAMFPC_1 : WWPRNO_1,
                                                    AUTP: "1",
                                                    NFTR: "2",
                                                };
                                                MMS015Request.outputFields = ["ALUN", "COFA", "DMCF", "AUS4"];
                                                _a.label = 1;
                                            case 1:
                                                _a.trys.push([1, 9, , 10]);
                                                return [4 /*yield*/, this.miService.executeRequestV2(MMS015Request)];
                                            case 2:
                                                MMS015Response_1 = _a.sent();
                                                items_3 = MMS015Response_1.items;
                                                this.tabBatch = [];
                                                _i = 0, items_2 = items_3;
                                                _a.label = 3;
                                            case 3:
                                                if (!(_i < items_2.length)) return [3 /*break*/, 8];
                                                item = items_2[_i];
                                                CRS050Request = new MIRequest();
                                                CRS050Request.program = "CRS050MI";
                                                CRS050Request.transaction = "Get";
                                                CRS050Request.record = {
                                                    UNIT: item.ALUN,
                                                };
                                                CRS050Request.outputFields = ["UMCT", "TX40"];
                                                _a.label = 4;
                                            case 4:
                                                _a.trys.push([4, 6, , 7]);
                                                return [4 /*yield*/, this.miService.executeRequestV2(CRS050Request)];
                                            case 5:
                                                CRS050Response = _a.sent();
                                                if (CRS050Response.item["UMCT"] == "2") {
                                                    this.tabBatch.push(__assign(__assign({}, item), { UMCT: CRS050Response.item["UMCT"], TX40: CRS050Response.item["TX40"] }));
                                                    if (item["AUS4"] == "1") {
                                                        this.vMAUN_B = item["ALUN"];
                                                        this.vCOFA_B = item["COFA"];
                                                        this.vDMCF_B = item["DMCF"];
                                                        this.$host.find("#WAELNO").val(this.vMAUN_B);
                                                        this.calculQB();
                                                    }
                                                }
                                                return [3 /*break*/, 7];
                                            case 6:
                                                e_3 = _a.sent();
                                                console.error("Erreur lors de l'appel API CRS050MI.Get sur le recalcule on :", item);
                                                return [3 /*break*/, 7];
                                            case 7:
                                                _i++;
                                                return [3 /*break*/, 3];
                                            case 8: return [3 /*break*/, 10];
                                            case 9:
                                                e_4 = _a.sent();
                                                console.error("Erreur lors du recalcule du tabBatch");
                                                return [3 /*break*/, 10];
                                            case 10:
                                                //@ts-ignore
                                                this.controller.HideBusyIndicator();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                            });
                            //RG09 : Calcul Quantité UC OF
                            this.$host.find("#WAPROJ").ready(function () {
                                _this.$host.find("#WAPROJ").on("change", function () {
                                    _this.calculQS();
                                });
                            });
                            //RG10 : Calcul Quantité Batch OF
                            this.$host.find("#WWORQA").ready(function () {
                                _this.$host.find("#WWORQA").on("change", function () {
                                    _this.calculQB();
                                });
                            });
                            this.$host.find("#WAELNO").ready(function () {
                                _this.$host.find("#WAELNO").on("change", function () {
                                    var unité = _this.$host.find("#WAELNO").val();
                                    for (var _i = 0, _a = _this.tabBatch; _i < _a.length; _i++) {
                                        var i = _a[_i];
                                        if (unité == i["ALUN"]) {
                                            _this.vMAUN_B = i["ALUN"];
                                            _this.vCOFA_B = i["COFA"];
                                            _this.vDMCF_B = i["DMCF"];
                                            _this.calculQB();
                                        }
                                    }
                                });
                            });
                        }
                        return [3 /*break*/, 11];
                    case 10:
                        e_2 = _b.sent();
                        console.error("Erreur lors de l'appel API MMS015MI.Lst ", e_2);
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    C04_PMS001E_ConvertBatchOF.prototype.calculQS = function () {
        var _this = this;
        if (this.vDMCF_B == "1") {
            this.vORQA_temp =
                (parseFloat(this.$host.find("#WAPROJ").val())
                    ? parseFloat(this.$host.find("#WAPROJ").val())
                    : 0) * parseFloat(this.vCOFA_B);
        }
        if (this.vDMCF_B == "2") {
            this.vORQA_temp =
                (parseFloat(this.$host.find("#WAPROJ").val())
                    ? parseFloat(this.$host.find("#WAPROJ").val())
                    : 0) / parseFloat(this.vCOFA_B);
        }
        if (this.vORQA_temp.toString().trim() !=
            this.$host.find("#WWORQA").val().trim()) {
            this.$host.find("#WWORQA").ready(function () {
                _this.$host.find("#WWORQA").val("".concat(_this.vORQA_temp));
            });
        }
        //gestion en mode Rendement
        if ((parseFloat(this.$host.find("#WWBAQT").val()) > 0 &&
            this.$host.find("#WAMFPC").val() &&
            this.$host.find("#WAMFPC").val().trim() == "") ||
            (parseFloat(this.$host.find("#WWBAQT").val()) > 0 &&
                !this.$host.find("#WAMFPC").val())) {
            this.$host.find("#WWORQA").ready(function () {
                _this.$host
                    .find("#WWORQA")
                    .val("".concat(Number((parseFloat(_this.$host.find("#WAPROJ").val()) *
                    parseFloat(_this.$host.find("#WWBAQT").val())).toFixed(3))));
            });
            this.$host.find("#WAELNO").val("");
        }
    };
    C04_PMS001E_ConvertBatchOF.prototype.calculQB = function () {
        var _this = this;
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
        if (this.vORQA_temp.toString().trim() !=
            this.$host.find("#WAPROJ").val().trim()) {
            this.$host.find("#WAPROJ").ready(function () {
                _this.$host.find("#WAPROJ").val("".concat(Number(_this.vORQA_temp.toFixed(3))));
            });
        }
        //gestion en mode Rendement
        if ((parseFloat(this.$host.find("#WWBAQT").val()) > 0 &&
            this.$host.find("#WAMFPC").val() &&
            this.$host.find("#WAMFPC").val().trim() == "") ||
            (parseFloat(this.$host.find("#WWBAQT").val()) > 0 &&
                !this.$host.find("#WAMFPC").val())) {
            this.$host.find("#WAPROJ").ready(function () {
                _this.$host
                    .find("#WAPROJ")
                    .val("".concat(Number((parseFloat(_this.$host.find("#WWORQA").val()) /
                    parseFloat(_this.$host.find("#WWBAQT").val())).toFixed(3))));
            });
            this.$host.find("#WAELNO").val("");
        }
    };
    return C04_PMS001E_ConvertBatchOF;
}());
