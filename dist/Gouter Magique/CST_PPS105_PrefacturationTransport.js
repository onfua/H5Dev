"use strict";
/**
 *      CST_PPS105_PrefacturationTransport -
 *
 * AUTHOR: Raoel Ntsoa
 * email: ntsoa.raoel@spoonconsulting.com
 *
 * @Note
 *     If changes are needed to be done on the script.
 *     Kindly email the last person who modified to provide the test latest typescript file.
 *
 *
 *
 * @CHANGELOGS
 * USER                 ActionLog   Date        Description
 * NRAOEL               1.0         18062025    Initial Release
 * */
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
var CST_PPS105_PrefacturationTransport = /** @class */ (function () {
    function CST_PPS105_PrefacturationTransport(scriptArgs) {
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
        this.args = scriptArgs.args;
        this.version = ScriptUtil.version;
        if (this.version >= 2.0) {
            this.miService = MIService;
        }
        else {
            this.miService = MIService.Current;
        }
        this.$host = this.controller.ParentWindow;
        this.contentElement = this.controller.GetContentElement();
        this.componentsAdded = false;
        this.checkBoxElement = null;
        this.textBoxElement = null;
    }
    CST_PPS105_PrefacturationTransport.Init = function (args) {
        new CST_PPS105_PrefacturationTransport(args).run();
    };
    CST_PPS105_PrefacturationTransport.prototype.onRequesting = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(args.commandType === "KEY" && args.commandValue === "ENTER")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.updCUGEX3()];
                    case 1:
                        _a.sent();
                        args.cancel = true;
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    CST_PPS105_PrefacturationTransport.prototype.onRequested = function (args) {
        this.unsubscribeRequested();
        this.unsubscribeRequesting();
    };
    CST_PPS105_PrefacturationTransport.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var addComponents, removeComponents, handleWEFROP;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        addComponents = function () { return __awaiter(_this, void 0, void 0, function () {
                            var isReadOnly;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!!this.componentsAdded) return [3 /*break*/, 2];
                                        this.addLabel();
                                        this.addCheckBox();
                                        this.addLabel1();
                                        this.addTextBox();
                                        isReadOnly = this.$host.find("#WEFREL").prop('readonly');
                                        if (isReadOnly) {
                                            this.$host.find("#TxtPoids").prop('readonly', true);
                                            this.$host.find("#TxtPoids").css({ "pointer-events": "none" });
                                            this.$host.find("#CBTarification").prop('disabled', true);
                                            this.$host.find("#CBTarification").parent().css({ "pointer-events": "none" });
                                            this.$host.find("#CBTarification").addClass("disable-checkbox");
                                        }
                                        this.componentsAdded = true;
                                        return [4 /*yield*/, this.getCUGEX3()];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); };
                        removeComponents = function () {
                            if (_this.componentsAdded) {
                                _this.$host.find("#LblTarification").remove();
                                _this.$host.find("#CBTarification").remove();
                                _this.$host.find("#LblPoids").remove();
                                _this.$host.find("#TxtPoids").remove();
                                _this.componentsAdded = false;
                            }
                        };
                        handleWEFROP = function () { return __awaiter(_this, void 0, void 0, function () {
                            var WEFROP, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        WEFROP = this.controller.GetValue("WEFROP");
                                        if (!(WEFROP === "12" || (WEFROP === "26" && this.controller.GetValue("WE3PFW").trim() === ""))) return [3 /*break*/, 5];
                                        _b.label = 1;
                                    case 1:
                                        _b.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, addComponents()];
                                    case 2:
                                        _b.sent();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        _a = _b.sent();
                                        return [3 /*break*/, 4];
                                    case 4: return [3 /*break*/, 6];
                                    case 5:
                                        removeComponents();
                                        _b.label = 6;
                                    case 6: return [2 /*return*/];
                                }
                            });
                        }); };
                        return [4 /*yield*/, handleWEFROP()];
                    case 1:
                        _a.sent();
                        this.$host.find("#WEFROP").off("change").on("change", function () { return __awaiter(_this, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _b.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, handleWEFROP()];
                                    case 1:
                                        _b.sent();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        _a = _b.sent();
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); });
                        this.unsubscribeRequesting = this.controller.Requesting.On(function (e) { return __awaiter(_this, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _b.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, this.onRequesting(e)];
                                    case 1:
                                        _b.sent();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        _a = _b.sent();
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); });
                        this.unsubscribeRequested = this.controller.Requested.On(function (e) {
                            _this.onRequested(e);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    CST_PPS105_PrefacturationTransport.prototype.addLabel = function () {
        var labelElement = new LabelElement();
        labelElement.Name = "LblTarification";
        labelElement.Value = "Tarification Mixte Poids/Palette";
        labelElement.Position = new PositionElement();
        labelElement.Position.Top = 10;
        labelElement.Position.Left = 90;
        labelElement.Position.Width = 20;
        this.contentElement.AddElement(labelElement);
    };
    CST_PPS105_PrefacturationTransport.prototype.addCheckBox = function () {
        var checkBoxElement = new CheckBoxElement();
        checkBoxElement.Name = "CBTarification";
        checkBoxElement.Position = new PositionElement();
        checkBoxElement.Position.Top = 10;
        checkBoxElement.Position.Left = 110;
        this.contentElement.AddElement(checkBoxElement);
        this.checkBoxElement = checkBoxElement;
    };
    CST_PPS105_PrefacturationTransport.prototype.addLabel1 = function () {
        var labelElement = new LabelElement();
        labelElement.Name = "LblPoids";
        labelElement.Value = "Palier de Poids en KG";
        labelElement.Position = new PositionElement();
        labelElement.Position.Top = 11;
        labelElement.Position.Left = 90;
        labelElement.Position.Width = 15;
        this.contentElement.AddElement(labelElement);
    };
    CST_PPS105_PrefacturationTransport.prototype.addTextBox = function () {
        var textElement = new TextBoxElement();
        textElement.Name = "TxtPoids";
        textElement.Value = "";
        textElement.Position = new PositionElement();
        textElement.Position.Top = 11;
        textElement.Position.Left = 110;
        textElement.Position.Width = 5;
        this.contentElement.AddElement(textElement);
        this.textBoxElement = textElement;
    };
    CST_PPS105_PrefacturationTransport.prototype.addCUGEX3 = function () {
        return __awaiter(this, void 0, void 0, function () {
            var POID, WEAGNB, WEFREL, WEFROP, al31Value, myRequest, _a;
            var _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        POID = (_b = this.textBoxElement) === null || _b === void 0 ? void 0 : _b.Value;
                        WEAGNB = (_c = this.$host.find("#WEAGNB")) === null || _c === void 0 ? void 0 : _c.val();
                        WEFREL = (_d = this.$host.find("#WEFREL")) === null || _d === void 0 ? void 0 : _d.val();
                        WEFROP = (_e = this.$host.find("#WEFROP")) === null || _e === void 0 ? void 0 : _e.val();
                        if (!(WEFREL === null || WEFREL === void 0 ? void 0 : WEFREL.trim()) || !(WEFROP === null || WEFROP === void 0 ? void 0 : WEFROP.trim()) || !(WEAGNB === null || WEAGNB === void 0 ? void 0 : WEAGNB.trim())) {
                            return [2 /*return*/];
                        }
                        al31Value = ((_f = this.checkBoxElement) === null || _f === void 0 ? void 0 : _f.IsChecked) ? "1" : "0";
                        myRequest = new MIRequest();
                        myRequest.program = "CUSEXTMI";
                        myRequest.transaction = "AddAlphaKPI";
                        myRequest.record = { KPID: "PREFACT_PPS105", PK01: WEAGNB, PK02: WEFREL, PK03: WEFROP, AL30: POID, AL31: al31Value };
                        myRequest.outputFields = [];
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 3, , 4]);
                        //@ts-ignore
                        return [4 /*yield*/, this.miService.executeRequestV2(myRequest)];
                    case 2:
                        //@ts-ignore
                        _g.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _g.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CST_PPS105_PrefacturationTransport.prototype.updCUGEX3 = function () {
        return __awaiter(this, void 0, void 0, function () {
            var POID, WEAGNB, WEFREL, WEFROP, cbTarification, al31Value, requestGet, response, exist, isPoidsVide, isTarifVide, item, oldPoids, oldTarif, requestUpdate, _a, _b;
            var _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        POID = (_c = this.$host.find("#TxtPoids")) === null || _c === void 0 ? void 0 : _c.val();
                        WEAGNB = (_d = this.$host.find("#WEAGNB")) === null || _d === void 0 ? void 0 : _d.val();
                        WEFREL = (_e = this.$host.find("#WEFREL")) === null || _e === void 0 ? void 0 : _e.val();
                        WEFROP = (_f = this.$host.find("#WEFROP")) === null || _f === void 0 ? void 0 : _f.val();
                        cbTarification = this.$host.find("#CBTarification");
                        al31Value = (cbTarification && cbTarification.is(':checked')) ? "1" : "0";
                        requestGet = new MIRequest();
                        requestGet.program = "CUSEXTMI";
                        requestGet.transaction = "GetAlphaKPI";
                        requestGet.record = {
                            KPID: "PREFACT_PPS105",
                            PK01: WEAGNB,
                            PK02: WEFREL,
                            PK03: WEFROP
                        };
                        requestGet.outputFields = ["AL30", "AL31"];
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 9, , 11]);
                        return [4 /*yield*/, this.miService.executeRequestV2(requestGet)];
                    case 2:
                        response = _g.sent();
                        exist = response.items && response.items.length > 0;
                        if (!!exist) return [3 /*break*/, 4];
                        isPoidsVide = !POID || POID.trim() === "";
                        isTarifVide = al31Value !== "1";
                        if (isPoidsVide && isTarifVide) {
                            console.log("Aucune donnée à ajouter dans CUGEX.");
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.addCUGEX3()];
                    case 3:
                        _g.sent();
                        return [2 /*return*/];
                    case 4:
                        item = response.items[0];
                        oldPoids = item.AL30 || "";
                        oldTarif = item.AL31 || "0";
                        if (oldPoids === POID && oldTarif === al31Value) {
                            return [2 /*return*/];
                        }
                        requestUpdate = new MIRequest();
                        requestUpdate.program = "CUSEXTMI";
                        requestUpdate.transaction = "ChgAlphaKPI";
                        requestUpdate.record = {
                            KPID: "PREFACT_PPS105",
                            PK01: WEAGNB,
                            PK02: WEFREL,
                            PK03: WEFROP,
                            AL30: POID,
                            AL31: al31Value
                        };
                        requestUpdate.outputFields = [];
                        _g.label = 5;
                    case 5:
                        _g.trys.push([5, 7, , 8]);
                        //@ts-ignore
                        return [4 /*yield*/, this.miService.executeRequestV2(requestUpdate)];
                    case 6:
                        //@ts-ignore
                        _g.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        _a = _g.sent();
                        return [3 /*break*/, 8];
                    case 8: return [3 /*break*/, 11];
                    case 9:
                        _b = _g.sent();
                        return [4 /*yield*/, this.addCUGEX3()];
                    case 10:
                        _g.sent();
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    CST_PPS105_PrefacturationTransport.prototype.getCUGEX3 = function () {
        return __awaiter(this, void 0, void 0, function () {
            var WEAGNB, WEFREL, WEFROP, myRequest, response, item, poids, tarification, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        WEAGNB = this.$host.find("#WEAGNB").val();
                        WEFREL = this.$host.find("#WEFREL").val();
                        WEFROP = this.$host.find("#WEFROP").val();
                        myRequest = new MIRequest();
                        myRequest.program = "CUSEXTMI";
                        myRequest.transaction = "GetAlphaKPI";
                        myRequest.record = { KPID: "PREFACT_PPS105", PK01: WEAGNB, PK02: WEFREL, PK03: WEFROP };
                        myRequest.outputFields = ["AL30", "AL31"];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.miService.executeRequestV2(myRequest)];
                    case 2:
                        response = _b.sent();
                        if (response.items.length > 0) {
                            item = response.items[0];
                            poids = item.AL30;
                            tarification = item.AL31;
                            if (tarification == "1") {
                                this.$host.find("#CBTarification").prop('checked', true);
                            }
                            this.$host.find("#TxtPoids").val(poids);
                        }
                        else {
                            this.$host.find("#TxtPoids").val("");
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _b.sent();
                        this.$host.find("#TxtPoids").val("");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return CST_PPS105_PrefacturationTransport;
}());
