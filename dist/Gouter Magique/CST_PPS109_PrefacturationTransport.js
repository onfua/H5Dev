"use strict";
/*
    H5Script CST_PPS109_PrefacturationTransport
  * @author: Joel Randrianarivelo
  * @version: 1.0.0
  * @since: 2025-06-18
  * @description: Ajout de la colonne Taux forfaitaire dans la grille de l'ecran PPS109
*/
/**
 * CHANGELOGS
 * Version    Date       User        Description
 * 1.0.0   18-06-2025    JOEL        Initial Release
 * 1.0.1   23-07-2025    JOEL        Gestion de format de date par utilisateur
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
var CST_PPS109_PrefacturationTransport = /** @class */ (function () {
    function CST_PPS109_PrefacturationTransport(scriptArgs) {
        this.taux = [];
        this.controller = scriptArgs.controller;
        this.contentElement = this.controller.GetContentElement();
        this.$host = this.controller.ParentWindow;
        if (ScriptUtil.version >= 2.0) {
            this.miService = MIService;
        }
        else {
            this.miService = MIService.Current;
        }
        this.mode = this.controller.GetMode();
        this.dateFormat = 'YMD';
    }
    CST_PPS109_PrefacturationTransport.Init = function (args) {
        new CST_PPS109_PrefacturationTransport(args).run();
    };
    CST_PPS109_PrefacturationTransport.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var list, _a, _b, customColumnNum, _c, _d, contents, len, _e, observateur, i, columnId, cell;
            var _this = this;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        //@ts-ignore
                        this.controller.ShowBusyIndicator();
                        list = ListControl.ListView.GetDatagrid(this.controller);
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, this.getDateFormat()];
                    case 2:
                        _a.dateFormat = _f.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _b = _f.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        customColumnNum = list.getColumns().length + 1;
                        this.appendColumn(list, customColumnNum);
                        _f.label = 5;
                    case 5:
                        _f.trys.push([5, 7, , 8]);
                        _c = this;
                        return [4 /*yield*/, this.getAllTauxForfaitaire()];
                    case 6:
                        _c.taux = _f.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        _d = _f.sent();
                        //@ts-ignore
                        this.controller.HideBusyIndicator();
                        return [3 /*break*/, 8];
                    case 8:
                        contents = list.getData().filter(function (item) { return item.WSFRQT || item.WSFRRA; });
                        len = ScriptUtil.version >= 2.0 ? contents.length : contents.getLength();
                        _f.label = 9;
                    case 9:
                        _f.trys.push([9, 11, , 12]);
                        return [4 /*yield*/, this.manageTaux(list, len)];
                    case 10:
                        _f.sent();
                        return [3 /*break*/, 12];
                    case 11:
                        _e = _f.sent();
                        //@ts-ignore
                        this.controller.HideBusyIndicator();
                        return [3 /*break*/, 12];
                    case 12:
                        if (this.mode == '2') {
                            observateur = new MutationObserver(function (mutationsList) { return __awaiter(_this, void 0, void 0, function () {
                                var _i, mutationsList_1, mutation, columnId, dataset, suno, agnb, rafd, rbv1, rbv2, i, cell, value, data, tfValue, req, e_1;
                                var _a, _b, _c;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            _i = 0, mutationsList_1 = mutationsList;
                                            _d.label = 1;
                                        case 1:
                                            if (!(_i < mutationsList_1.length)) return [3 /*break*/, 10];
                                            mutation = mutationsList_1[_i];
                                            if (!(mutation.type === 'characterData' || mutation.type === 'childList')) return [3 /*break*/, 9];
                                            if (!(mutation.target.tagName == 'SPAN' && mutation.removedNodes.length > 0)) return [3 /*break*/, 9];
                                            //@ts-ignore
                                            this.controller.ShowBusyIndicator();
                                            columnId = 'TFOF';
                                            dataset = list.getData();
                                            suno = this.$host.find("#WESUNO").val() ? this.$host.find("#WESUNO").val() : "";
                                            agnb = this.$host.find("#WEAGNB").val() ? this.$host.find("#WEAGNB").val() : "";
                                            rafd = this.$host.find("#WERAFD").val() ? this.getDateFormatted(this.$host.find("#WERAFD").val()) : "";
                                            rbv1 = this.$host.find("#WERBV1").val() ? this.$host.find("#WERBV1").val() : "";
                                            rbv2 = this.$host.find("#WERBV2").val() ? this.$host.find("#WERBV2").val() : "";
                                            i = 0;
                                            _d.label = 2;
                                        case 2:
                                            if (!(i < len)) return [3 /*break*/, 8];
                                            cell = list.getCellElement(i, columnId);
                                            value = (_a = cell.querySelector('span')) === null || _a === void 0 ? void 0 : _a.innerText;
                                            if (!(value === null || value === void 0 ? void 0 : value.trim()))
                                                return [3 /*break*/, 7];
                                            data = dataset[i];
                                            tfValue = value.trim() === 'OUI' ? '1' : '0';
                                            req = new MIRequest();
                                            req.program = "EXT109MI";
                                            req.transaction = 'AddOrUpdForfait';
                                            req.record = {
                                                SUNO: suno,
                                                AGNB: agnb,
                                                RAFD: rafd,
                                                RBV1: rbv1,
                                                RBV2: rbv2,
                                                FRQT: parseFloat(((_b = data.WSFRQT) === null || _b === void 0 ? void 0 : _b.replace(',', '.')) || '0'),
                                                FRRA: parseFloat(((_c = data.WSFRRA) === null || _c === void 0 ? void 0 : _c.replace(',', '.')) || '0'),
                                                TFOF: tfValue // 1 pour OUI, 0 pour NON
                                            };
                                            _d.label = 3;
                                        case 3:
                                            _d.trys.push([3, 5, , 6]);
                                            //@ts-ignore
                                            return [4 /*yield*/, this.miService.executeRequestV2(req)];
                                        case 4:
                                            //@ts-ignore
                                            _d.sent();
                                            return [3 /*break*/, 6];
                                        case 5:
                                            e_1 = _d.sent();
                                            console.error(e_1);
                                            return [3 /*break*/, 6];
                                        case 6:
                                            //@ts-ignore
                                            this.controller.HideBusyIndicator();
                                            _d.label = 7;
                                        case 7:
                                            i++;
                                            return [3 /*break*/, 2];
                                        case 8: return [3 /*break*/, 10];
                                        case 9:
                                            _i++;
                                            return [3 /*break*/, 1];
                                        case 10: return [2 /*return*/];
                                    }
                                });
                            }); });
                            for (i = 0; i < len; i++) {
                                columnId = 'TFOF';
                                cell = list.getCellElement(i, columnId);
                                observateur.observe(cell, {
                                    childList: true,
                                    subtree: true,
                                    characterData: true
                                });
                            }
                        }
                        //@ts-ignore
                        this.controller.HideBusyIndicator();
                        return [2 /*return*/];
                }
            });
        });
    };
    CST_PPS109_PrefacturationTransport.prototype.appendColumn = function (list, columnNum) {
        // const columnId = "C" + columnNum;
        var columns = list.getColumns();
        var newColumn = {
            id: 'TFOF',
            field: 'TFOF',
            name: "Taux Forfaitaire",
            width: 100,
            isEditable: true,
        };
        if (columns.length < columnNum) {
            columns.push(newColumn);
        }
        list.setColumns(columns);
        if (this.mode == '2') {
            var fields = [{
                    name: 'TFOF', columnType: "DROPDOWN", isEditable: true, isEnabled: true, valueMap: [
                        {
                            value: 'OUI',
                            label: 'OUI'
                        },
                        {
                            value: 'NON',
                            label: 'NON'
                        }
                    ]
                }];
            //@ts-ignore
            list.setColumnsFormat(fields);
        }
    };
    CST_PPS109_PrefacturationTransport.prototype.getAllTauxForfaitaire = function () {
        return __awaiter(this, void 0, void 0, function () {
            var suno, agnb, rafd, rbv1, rbv2, req, res, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        suno = this.$host.find("#WESUNO").val() ? this.$host.find("#WESUNO").val() : "";
                        agnb = this.$host.find("#WEAGNB").val() ? this.$host.find("#WEAGNB").val() : "";
                        rafd = this.$host.find("#WERAFD").val() ? this.getDateFormatted(this.$host.find("#WERAFD").val()) : "";
                        rbv1 = this.$host.find("#WERBV1").val() ? this.$host.find("#WERBV1").val() : "";
                        rbv2 = this.$host.find("#WERBV2").val() ? this.$host.find("#WERBV2").val() : "";
                        req = new MIRequest();
                        req.program = "CUSEXTMI";
                        req.transaction = 'LstAlphaKPI';
                        req.record = {
                            KPID: 'MPAGRF',
                            PK01: suno,
                            PK02: agnb,
                            PK03: rafd,
                            PK04: rbv1,
                            PK05: rbv2
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.miService.executeRequestV2(req)];
                    case 2:
                        res = _b.sent();
                        // console.log(res.items)
                        return [2 /*return*/, res.items];
                    case 3:
                        _a = _b.sent();
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CST_PPS109_PrefacturationTransport.prototype.manageTaux = function (list, len) {
        return __awaiter(this, void 0, void 0, function () {
            var columnId, dataset, _loop_1, this_1, i;
            return __generator(this, function (_a) {
                columnId = 'TFOF';
                dataset = list.getData();
                _loop_1 = function (i) {
                    var data = dataset[i];
                    var taux = this_1.taux.find(function (item) { var _a, _b, _c, _d; return parseFloat(((_a = item.PK06) === null || _a === void 0 ? void 0 : _a.replace(',', '.')) || '0') == parseFloat(((_b = data.WSFRQT) === null || _b === void 0 ? void 0 : _b.replace(',', '.')) || 0) && parseFloat(((_c = item.PK07) === null || _c === void 0 ? void 0 : _c.replace(',', '.')) || '0') == parseFloat(((_d = data.WSFRRA) === null || _d === void 0 ? void 0 : _d.replace(',', '.')) || '0'); });
                    if (taux) {
                        data[columnId] = taux.AL30 == '1' ? 'OUI' : 'NON';
                    }
                    else {
                        data[columnId] = 'NON';
                        // const req = new MIRequest();
                        // req.program = "CUSEXTMI";
                        // req.transaction = 'AddAlphaKPI';
                        // req.record = {
                        //     KPID: 'MPAGRF',
                        //     PK01: suno,
                        //     PK02: agnb,
                        //     PK03: rafd,
                        //     PK04: rbv1,
                        //     PK05: rbv2,
                        //     PK06: data.WSFRQT,
                        //     PK07: data.WSFRRA,
                        //     AL30: 'NON'
                        // }
                        // try {
                        //     //@ts-ignore
                        //     await this.miService.executeRequestV2(req);
                        // } catch (e) {
                        //     console.error(e);
                        // }
                    }
                };
                this_1 = this;
                // const suno = this.$host.find("#WESUNO").val() ? this.$host.find("#WESUNO").val() : "";
                // const agnb = this.$host.find("#WEAGNB").val() ? this.$host.find("#WEAGNB").val() : "";
                // const rafd = this.$host.find("#WERAFD").val() ? `20${this.$host.find("#WERAFD").val().substring(0, 2)}${this.$host.find("#WERAFD").val().substring(3, 5)}${this.$host.find("#WERAFD").val().substring(6, 8)}` : "";
                // const rbv1 = this.$host.find("#WERBV1").val() ? this.$host.find("#WERBV1").val() : "";
                // const rbv2 = this.$host.find("#WERBV2").val() ? this.$host.find("#WERBV2").val() : "";
                for (i = 0; i < len; i++) {
                    _loop_1(i);
                }
                list.setData(dataset);
                return [2 /*return*/];
            });
        });
    };
    CST_PPS109_PrefacturationTransport.prototype.getDateFormat = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = new MIRequest();
                        req.program = "MNS150MI";
                        req.transaction = "GetUserData";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.miService.executeRequestV2(req)];
                    case 2:
                        res = _a.sent();
                        return [2 /*return*/, res.item["DTFM"]];
                    case 3:
                        e_2 = _a.sent();
                        console.error(e_2);
                        return [2 /*return*/, 'YMD']; // Default format if error occurs
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CST_PPS109_PrefacturationTransport.prototype.getDateFormatted = function (date) {
        if (!date)
            return '';
        if (this.dateFormat === 'YMD') {
            return "20".concat(date.substring(0, 2)).concat(date.substring(3, 5)).concat(date.substring(6, 8));
        }
        else if (this.dateFormat === 'DMY') {
            return "20".concat(date.substring(6, 8)).concat(date.substring(3, 5)).concat(date.substring(0, 2));
        }
        else { //MDY
            return "20".concat(date.substring(6, 8)).concat(date.substring(0, 2)).concat(date.substring(3, 5)); // Default case, return as is
        }
    };
    return CST_PPS109_PrefacturationTransport;
}());
