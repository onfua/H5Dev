"use strict";
/*
    H5Script C04_PMS230B_ConvertBatchOfAll
  * @author: Joel Randrianarivelo
  * @version: 1.0.0
  * @since: 2025-03-28
  * @description: Calcul de la somme des quantités des OA dans PMS230
*/
/**
 * CHANGELOGS
 * Version    Date       User        Description
 * 1.0.0   28-03-2025    JOEL        Initial Release
 * 1.0.1   14-04-2025    JOEL        Ajout de la gestion des structures alternatives
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
var C04_PMS230B_ConvertBatchOfAll = /** @class */ (function () {
    function C04_PMS230B_ConvertBatchOfAll(scriptArgs) {
        this.argument = scriptArgs.args;
        this.controller = scriptArgs.controller;
        this.contentElement = this.controller.GetContentElement();
        this.FACI = ScriptUtil.GetUserContext().FACI;
        this.grid = this.controller.GetGrid();
        this.$host = this.controller.ParentWindow;
        if (ScriptUtil.version >= 2.0) {
            this.miService = MIService;
        }
        else {
            this.miService = MIService.Current;
        }
    }
    C04_PMS230B_ConvertBatchOfAll.Init = function (args) {
        new C04_PMS230B_ConvertBatchOfAll(args).run();
    };
    C04_PMS230B_ConvertBatchOfAll.prototype.addBtn = function () {
        var btnSequencer = new ButtonElement();
        btnSequencer.Name = "BtnCalculerBatchAll";
        btnSequencer.Value = "Recalcul Batch";
        btnSequencer.Position = new PositionElement();
        btnSequencer.Position.Top = 5;
        btnSequencer.Position.Left = 25;
        btnSequencer.Position.Width = 15;
        this.contentElement.AddElement(btnSequencer);
    };
    C04_PMS230B_ConvertBatchOfAll.prototype.run = function () {
        var _this = this;
        var argument = this.argument.split(",");
        var tabFACI = argument[0].split("/");
        var tabORTY = argument[1].split("/");
        console.info('1.0.0   28-03-2025    JOEL        Initial Release');
        this.addBtn();
        this.$host.find("#BtnCalculerBatchAll").on("click", function () { return __awaiter(_this, void 0, void 0, function () {
            var data, _i, data_1, dt, mfno, reqMDREADMI, resMDREADMI, result, MMS015Request, ALUN, COFA, DMCF, MMS015Response, items, _a, items_1, item, CRS050Request, CRS050Response, e_1, err_1, batch, unite, req, err_2, er_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        //@ts-ignore
                        this.controller.ShowBusyIndicator();
                        data = this.grid.getData();
                        console.log(data);
                        _i = 0, data_1 = data;
                        _b.label = 1;
                    case 1:
                        if (!(_i < data_1.length)) return [3 /*break*/, 20];
                        dt = data_1[_i];
                        mfno = dt.VOMFNO;
                        reqMDREADMI = new MIRequest();
                        reqMDREADMI.program = "MDBREADMI";
                        reqMDREADMI.transaction = "SelMWOHED55";
                        reqMDREADMI.record = {
                            SQRY: "MFNO:".concat(mfno),
                        };
                        reqMDREADMI.outputFields = ['ORTY', 'ELNO', 'PROJ', 'FACI', 'MFPC', 'PRNO', 'ORQA', 'BAQT'];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 18, , 19]);
                        return [4 /*yield*/, this.miService.executeRequestV2(reqMDREADMI)];
                    case 3:
                        resMDREADMI = _b.sent();
                        if (resMDREADMI.items.length <= 0)
                            return [3 /*break*/, 19];
                        result = resMDREADMI.items[0];
                        if (!tabFACI.includes(result.FACI))
                            return [3 /*break*/, 19];
                        if (!tabORTY.includes(result.ORTY))
                            return [3 /*break*/, 19];
                        MMS015Request = new MIRequest();
                        MMS015Request.program = "MMS015MI";
                        MMS015Request.transaction = "Lst";
                        MMS015Request.record = {
                            ITNO: result.MFPC ? result.MFPC : result.PRNO,
                            AUTP: "1",
                            NFTR: "2",
                        };
                        MMS015Request.outputFields = ["ALUN", "COFA", "DMCF", "AUS4"];
                        ALUN = void 0, COFA = void 0, DMCF = void 0;
                        _b.label = 4;
                    case 4:
                        _b.trys.push([4, 12, , 13]);
                        return [4 /*yield*/, this.miService.executeRequestV2(MMS015Request)];
                    case 5:
                        MMS015Response = _b.sent();
                        items = MMS015Response.items;
                        _a = 0, items_1 = items;
                        _b.label = 6;
                    case 6:
                        if (!(_a < items_1.length)) return [3 /*break*/, 11];
                        item = items_1[_a];
                        CRS050Request = new MIRequest();
                        CRS050Request.program = "CRS050MI";
                        CRS050Request.transaction = "Get";
                        CRS050Request.record = {
                            UNIT: item.ALUN,
                        };
                        CRS050Request.outputFields = ["UMCT", "TX40"];
                        _b.label = 7;
                    case 7:
                        _b.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, this.miService.executeRequestV2(CRS050Request)];
                    case 8:
                        CRS050Response = _b.sent();
                        if (CRS050Response.item["UMCT"] == "2") {
                            if (item["AUS4"] == "1") {
                                ALUN = item["ALUN"];
                                COFA = item["COFA"];
                                DMCF = item["DMCF"];
                                return [3 /*break*/, 11];
                            }
                        }
                        return [3 /*break*/, 10];
                    case 9:
                        e_1 = _b.sent();
                        console.error("Erreur lors de l'appel API CRS050MI.Get on :", item);
                        return [3 /*break*/, 10];
                    case 10:
                        _a++;
                        return [3 /*break*/, 6];
                    case 11:
                        if (items.length > 0 && !ALUN && !COFA) {
                            ALUN = items[0]["ALUN"];
                            COFA = items[0]["COFA"];
                            DMCF = items[0]["DMCF"];
                        }
                        return [3 /*break*/, 13];
                    case 12:
                        err_1 = _b.sent();
                        console.error(err_1);
                        return [3 /*break*/, 13];
                    case 13:
                        if (!ALUN && !result.BAQT)
                            return [3 /*break*/, 19];
                        batch = 0;
                        unite = '';
                        if (ALUN) {
                            if (DMCF == '1') {
                                batch = Number(((parseFloat(result.ORQA.replace(',', '.'))
                                    ? parseFloat(result.ORQA.replace(',', '.'))
                                    : 0) / parseFloat(COFA.replace(',', '.'))).toFixed(3));
                            }
                            if (DMCF == '2') {
                                batch = Number(((parseFloat(result.ORQA.replace(',', '.'))
                                    ? parseFloat(result.ORQA.replace(',', '.'))
                                    : 0) * parseFloat(COFA.replace(',', '.'))).toFixed(3));
                            }
                            unite = ALUN;
                        }
                        else {
                            if (result.BAQT) {
                                batch = Number((parseFloat(result.ORQA.replace(',', '.')) /
                                    parseFloat(result.BAQT.replace(',', '.'))).toFixed(3));
                            }
                        }
                        if (result.MFPC && !ALUN)
                            return [3 /*break*/, 19];
                        if (!batch) return [3 /*break*/, 17];
                        console.log(dt, result.ORQA, COFA, batch);
                        req = new MIRequest();
                        req.program = "PMS100MI";
                        req.transaction = "UpdMO";
                        req.record = {
                            FACI: result.FACI,
                            PRNO: result.PRNO,
                            MFNO: mfno,
                            PROJ: batch,
                            ELNO: unite,
                        };
                        _b.label = 14;
                    case 14:
                        _b.trys.push([14, 16, , 17]);
                        //@ts-ignore
                        return [4 /*yield*/, this.miService.executeRequestV2(req)];
                    case 15:
                        //@ts-ignore
                        _b.sent();
                        return [3 /*break*/, 17];
                    case 16:
                        err_2 = _b.sent();
                        console.error("Erreur PMS100MI.UpdMO : ", err_2);
                        return [3 /*break*/, 17];
                    case 17: return [3 /*break*/, 19];
                    case 18:
                        er_1 = _b.sent();
                        console.error(er_1);
                        return [3 /*break*/, 19];
                    case 19:
                        _i++;
                        return [3 /*break*/, 1];
                    case 20:
                        //@ts-ignore
                        this.controller.HideBusyIndicator();
                        this.controller.PressKey("F5");
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return C04_PMS230B_ConvertBatchOfAll;
}());
