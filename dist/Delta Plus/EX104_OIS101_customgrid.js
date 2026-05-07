"use strict";
/*
    H5Script EX104_OIS101_customgrid
  * @author: Joel Randrianarivelo
  * @version: 1.0.0
  * @since: 21-11-2025
  * @description: Add a custom column on OIS101 datagrid
*/
/**
 * CHANGELOGS
 * Version    Date       User        Description
 * 1.0.0   21-11-2025    JOEL        Initial Release
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
var EX104_OIS101_customgrid = /** @class */ (function () {
    function EX104_OIS101_customgrid(scriptArgs) {
        this.PONRData = [];
        this.allData = [];
        this.controller = scriptArgs.controller;
        if (ScriptUtil.version >= 2.0) {
            this.miService = MIService;
        }
        else {
            this.miService = MIService.Current;
        }
        this.$host = this.controller.ParentWindow;
        this.list = ListControl.ListView.GetDatagrid(this.controller);
    }
    EX104_OIS101_customgrid.Init = function (args) {
        new EX104_OIS101_customgrid(args).run();
    };
    EX104_OIS101_customgrid.prototype.run = function () {
        var len = this.list.getColumns().length;
        this.appendColumn(this.list, len + 1);
        this.appendMBAVIQData();
    };
    EX104_OIS101_customgrid.prototype.appendColumn = function (list, columnNum) {
        var columns = list.getColumns();
        var newColumn = {
            id: 'MBAVIQ',
            field: 'MBAVIQ',
            name: "Av issue Qty",
            width: 100,
        };
        if (columns.length < columnNum) {
            columns.push(newColumn);
        }
        list.setColumns(columns);
    };
    EX104_OIS101_customgrid.prototype.appendMBAVIQData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dataset, _loop_1, this_1, i, i, data, columns, row, children, j;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPONR()];
                    case 1:
                        _a.sent();
                        dataset = this.list.getData();
                        _loop_1 = function (i) {
                            var data, find, whlo, itno, aviq;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        data = dataset[i];
                                        find = this_1.PONRData.find(function (x) { return x.PONR == data.OBPONR; });
                                        whlo = find[0] ? find[0].WHLO : find.WHLO || '' //this.controller.GetValue('OBWHLO')
                                        ;
                                        itno = data.OBITNO;
                                        return [4 /*yield*/, this_1.getMBAVIQ(itno, whlo)];
                                    case 1:
                                        aviq = _b.sent();
                                        data['MBAVIQ'] = aviq;
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < dataset.length)) return [3 /*break*/, 5];
                        return [5 /*yield**/, _loop_1(i)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5:
                        this.list.setData(dataset);
                        //await new Promise((resolve) => setTimeout(() => resolve, 100))
                        dataset = this.list.getData();
                        for (i = 0; i < dataset.length; i++) {
                            data = dataset[i];
                            columns = this.list.getColumns();
                            if (parseFloat(data.OBORQT) > parseFloat(data.MBAVIQ)) {
                                row = this.list.getRowElement(i);
                                children = $(row).children();
                                //$(row).css("background-color", "#ff9292ff");
                                for (j = 0; j < columns.length; j++) {
                                    if (columns[j].fullName == 'MBAVIQ' || columns[j].fullName == 'OBORQT') {
                                        $(children[j]).css("background-color", "#ff9292ff");
                                    }
                                }
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    EX104_OIS101_customgrid.prototype.getMBAVIQ = function (itemNo, whlo) {
        return __awaiter(this, void 0, void 0, function () {
            var req, response, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        req = new MIRequest();
                        req.program = "MMS200MI";
                        req.transaction = "GetItmWhsBasic";
                        req.record = {
                            ITNO: itemNo,
                            WHLO: whlo
                        };
                        req.outputFields = ['AVIQ'];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.miService.executeRequestV2(req)];
                    case 2:
                        response = _b.sent();
                        return [2 /*return*/, response.items[0]['AVIQ']];
                    case 3:
                        _a = _b.sent();
                        return [2 /*return*/, 0];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    EX104_OIS101_customgrid.prototype.getPONR = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req, response, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        req = new MIRequest();
                        req.program = "OIS100MI";
                        req.transaction = "LstLine";
                        req.record = {
                            ORNO: this.controller.GetValue("OAORNO")
                        };
                        req.outputFields = ['PONR', 'WHLO'];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.miService.executeRequestV2(req)];
                    case 2:
                        response = _b.sent();
                        this.PONRData = response.items;
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return EX104_OIS101_customgrid;
}());
