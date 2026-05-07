"use strict";
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
    H5Script CST_PPS201_Amalgame
  * @author: Joel Randrianarivelo
  * @version: 1.1.0
  * @since: 22-10-2025
  * @description: Handle amalgame in PPS100
*/
/**
 * CHANGELOGS
 * Version    Date       User        Description
 * 1.0.0                             Initial Release
 * 1.1.0   22-10-2025    JOEL        Fix fonctionality
 */
var DialogType = {
    Question: "Question",
    Information: "Information",
    Warning: "Warning",
    Error: "Error"
};
var CST_PPS201_Amalgame = /** @class */ (function () {
    function CST_PPS201_Amalgame(scriptArgs) {
        if (ScriptUtil.version >= 2.0) {
            this.miService = MIService;
        }
        else {
            this.miService = MIService.Current;
        }
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
        this.args = scriptArgs.args;
        this.scriptName = 'CST_PPS201_Amalgame';
        this.groupIdentity = '';
        this.translations = this.getTranslations();
    }
    CST_PPS201_Amalgame.Init = function (args) {
        new CST_PPS201_Amalgame(args).run();
    };
    CST_PPS201_Amalgame.prototype.run = function () {
        var _this = this;
        this.log.Info("Running script: ".concat(this.scriptName));
        var scriptArguments = this.parseArguments(this.args);
        var buttonText = scriptArguments[0], buttonRow = scriptArguments[1], buttonColumn = scriptArguments[2], buttonColor = scriptArguments[3], groupIdentity = scriptArguments[4];
        var $button = this.addButton({
            name: buttonText || 'Update price',
            value: buttonText || 'Update price',
            width: '100%',
            top: buttonRow || '11',
            left: buttonColumn || '74',
        });
        $button.find('button').css({
            'border-color': buttonColor || '#1C86EF',
            color: buttonColor || '#1C86EF',
            'min-width': '100px',
        });
        this.groupIdentity = groupIdentity || '60';
        $button.click({}, function () {
            if (_this.controller.GetProgramName() === 'PPS201') {
                _this.handlePPS201();
            }
            else {
                _this.onButtonClicked();
            }
        });
    };
    CST_PPS201_Amalgame.prototype.listPOs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var request, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = new MIRequest();
                        request.program = 'CMS100MI';
                        request.transaction = 'LstZUGP_PPW192';
                        request.includeMetadata = true;
                        request.typedOutput = true;
                        request.maxReturnedRecords = 6000;
                        request.record = {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.miService.executeRequestV2(request)];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.items || []];
                    case 3:
                        error_1 = _a.sent();
                        this.log.Error(error_1.errorMessage || 'Unknown error');
                        this.setBusy(false);
                        throw [];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CST_PPS201_Amalgame.prototype.onButtonClicked = function () {
        return __awaiter(this, void 0, void 0, function () {
            var poList, totalPurchaseQty, _i, poList_1, purcaseOrderLine, pdln, firstPOLine, SUNO, AGNB, CUCD, PUCD, uniqueItems, agreements, agreement, GRPI, OBV1, FVDT, staggeredPrices, newPrice, _a, staggeredPrices_1, priceLine, FRQT, PUPR, formattedPrice, currencySign;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.setBusy(true);
                        return [4 /*yield*/, this.listPOs()];
                    case 1:
                        poList = _b.sent();
                        if (!poList || poList.length === 0) {
                            this.showMessage(this.translate('noPurchaseOrderLinesFoundInTablePPW192'));
                            return [2 /*return*/];
                        }
                        totalPurchaseQty = 0;
                        for (_i = 0, poList_1 = poList; _i < poList_1.length; _i++) {
                            purcaseOrderLine = poList_1[_i];
                            totalPurchaseQty += purcaseOrderLine.POPPQT || 0;
                        }
                        pdln = ScriptUtil.GetFieldValue('W3OBKV');
                        poList = poList.filter(function (p) { return !pdln || p.PWPDLN === pdln; });
                        firstPOLine = poList[0];
                        SUNO = firstPOLine.PWSUNO;
                        AGNB = firstPOLine.POOURR;
                        CUCD = firstPOLine.POCUCD;
                        PUCD = firstPOLine.POPUCD;
                        poList = poList.filter(function (poLine) { return poLine.POOURR === AGNB && poLine.POCUCD === CUCD; });
                        uniqueItems = poList.map(function (purchaseOrderLine) { return purchaseOrderLine.PWITNO; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
                        return [4 /*yield*/, this.getFilteredAgreements(SUNO, AGNB)];
                    case 2:
                        agreements = _b.sent();
                        if (!agreements.length) {
                            this.showMessage(this.translate("noAgreementLinesFoundForAgreement").replace('{0}', AGNB));
                            return [2 /*return*/];
                        }
                        agreement = this.getAgreement(agreements, uniqueItems.length);
                        if (!agreement) {
                            this.showMessage(this.translate("couldNotParseAgreementLines"));
                            return [2 /*return*/];
                        }
                        GRPI = agreement.GRPI;
                        OBV1 = agreement.OBV1;
                        FVDT = agreement.FVDT;
                        return [4 /*yield*/, this.listStaggeredPrices(SUNO, AGNB, GRPI, OBV1, FVDT)];
                    case 3:
                        staggeredPrices = _b.sent();
                        if (!staggeredPrices || staggeredPrices.length === 0) {
                            this.showMessage(this.translate('noStaggeredPricesFoundForAgreement').replace('{0}', "".concat(AGNB, "/").concat(GRPI, "/").concat(OBV1, "/").concat(FVDT)));
                            return [2 /*return*/];
                        }
                        staggeredPrices = staggeredPrices.sort(function (a, b) { return (parseFloat(a.FRQT) > parseFloat(b.FRQT) ? 1 : -1); });
                        newPrice = 0;
                        for (_a = 0, staggeredPrices_1 = staggeredPrices; _a < staggeredPrices_1.length; _a++) {
                            priceLine = staggeredPrices_1[_a];
                            FRQT = priceLine.FRQT;
                            PUPR = priceLine.PUPR;
                            if (totalPurchaseQty >= FRQT) {
                                newPrice = parseFloat(PUPR.toString()).toFixed(6); // updated by Pierre AOUN, Old value :  PUPR;
                            }
                            else {
                                break;
                            }
                        }
                        formattedPrice = "".concat(newPrice, " ").concat(CUCD);
                        currencySign = this.getCurrencySign(CUCD);
                        if (currencySign) {
                            formattedPrice = "".concat(currencySign).concat(newPrice);
                        }
                        ConfirmDialog.ShowMessageDialog({
                            header: "".concat(this.translate('confirmPromptTitle1')).concat(formattedPrice).concat(this.translate('confirmPromptTitle2')),
                            message: "".concat(this.translate('confirmPromptMessage1')).concat(uniqueItems.length).concat(this.translate('confirmPromptMessage2')).concat(totalPurchaseQty).concat(this.translate('confirmPromptMessage3')).concat(OBV1).concat(this.translate('confirmPromptMessage4')).concat(AGNB).concat(this.translate('confirmPromptMessage5')).concat(poList.length).concat(this.translate('confirmPromptMessage6'), "\n").concat(PUCD === 1000 ? this.translate('confirmPromptMessage7') + PUCD : ''),
                            dialogType: DialogType.Question,
                            closed: function (ret) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!ret.ok) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this.updatePOLines(poList, newPrice)];
                                        case 1:
                                            _a.sent();
                                            this.controller.PressKey('F5');
                                            _a.label = 2;
                                        case 2:
                                            this.setBusy(false);
                                            return [2 /*return*/];
                                    }
                                });
                            }); },
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * @param scriptArguments
     * @returns
     */
    CST_PPS201_Amalgame.prototype.parseArguments = function (scriptArguments) {
        return scriptArguments.split(",").map(function (argument) { return argument.trim(); });
    };
    /**
     *
     * @param param0
     * @returns
     */
    CST_PPS201_Amalgame.prototype.addButton = function (_a) {
        var name = _a.name, value = _a.value, width = _a.width, top = _a.top, left = _a.left;
        var buttonElement = new ButtonElement();
        buttonElement.Name = name;
        buttonElement.Value = value;
        buttonElement.Position = new PositionElement();
        buttonElement.Position.Top = top;
        buttonElement.Position.Left = left;
        buttonElement.Position.Width = width;
        var contentElement = this.controller.GetContentElement();
        return contentElement.AddElement(buttonElement);
    };
    CST_PPS201_Amalgame.prototype.updatePOLines = function (poLines, price) {
        return __awaiter(this, void 0, void 0, function () {
            var promises, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = poLines.map(function (poLine) { return __awaiter(_this, void 0, void 0, function () {
                            var request, response, error_3;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        request = new MIRequest();
                                        request.program = 'PPS170MI';
                                        request.transaction = 'UpdPOP';
                                        request.record = {
                                            PLPN: poLine.PWPLPN,
                                            PLPS: poLine.PWPLPS,
                                            PLP2: poLine.PWPLP2,
                                            PUPR: price,
                                            PUCD: poLine.POPUCD === 1000 ? poLine.POPUCD : 0,
                                        };
                                        request.includeMetadata = true;
                                        request.typedOutput = true;
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, this.miService.executeRequestV2(request)];
                                    case 2:
                                        response = _a.sent();
                                        if (response.hasError()) {
                                            throw response;
                                        }
                                        else {
                                            return [2 /*return*/, response.items];
                                        }
                                        return [3 /*break*/, 4];
                                    case 3:
                                        error_3 = _a.sent();
                                        this.handleError(error_3.error);
                                        throw [];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Promise.all(promises)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                    case 3:
                        error_2 = _a.sent();
                        this.showError(error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description: Set busy indicator
     * @param isBusy
     */
    CST_PPS201_Amalgame.prototype.setBusy = function (isBusy) {
        var _this = this;
        if (isBusy) {
            //@ts-ignore
            this.controller.ShowBusyIndicator();
        }
        else {
            setTimeout(function () {
                //@ts-ignore
                _this.controller.HideBusyIndicator();
            }, 500); //wait for 500ms to avoid busy indicator flickering
        }
    };
    /**
     *
     * @param PUNO
     * @param PNLI
     * @param PNLS
     * @returns
     */
    CST_PPS201_Amalgame.prototype.getPOLine = function (PUNO, PNLI, PNLS) {
        return __awaiter(this, void 0, void 0, function () {
            var request, response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = new MIRequest();
                        request.program = 'PPS200MI';
                        request.transaction = 'GetLine';
                        request.includeMetadata = true;
                        request.typedOutput = true;
                        request.maxReturnedRecords = 1;
                        request.record = {
                            PUNO: PUNO,
                            PNLI: PNLI,
                            PNLS: PNLS,
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.miService.executeRequestV2(request)];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.items || []];
                    case 3:
                        error_4 = _a.sent();
                        this.log.Error(JSON.stringify(error_4.error, null, '\t') || 'Unknown error');
                        this.setBusy(false);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * @param record
     * @returns
     */
    CST_PPS201_Amalgame.prototype.getFieldValue = function (record) {
        return __awaiter(this, void 0, void 0, function () {
            var request, response, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = new MIRequest();
                        request.program = 'CUSEXTMI';
                        request.transaction = 'GetFieldValue';
                        request.includeMetadata = true;
                        request.typedOutput = true;
                        request.maxReturnedRecords = 1;
                        request.record = record;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.miService.executeRequestV2(request)];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.items || []];
                    case 3:
                        error_5 = _a.sent();
                        this.log.Error(JSON.stringify(error_5.error, null, '\t') || 'Unknown error');
                        this.setBusy(false);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CST_PPS201_Amalgame.prototype.listAgreementLines = function (SUNO, AGNB) {
        return __awaiter(this, void 0, void 0, function () {
            var request, response, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = new MIRequest();
                        request.program = 'PPS100MI';
                        request.transaction = 'LstAgrLine';
                        request.includeMetadata = true;
                        request.typedOutput = false;
                        request.maxReturnedRecords = 6000;
                        request.record = {
                            SUNO: SUNO,
                            AGNB: AGNB,
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.miService.executeRequestV2(request)];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.items || []];
                    case 3:
                        error_6 = _a.sent();
                        this.handleError(error_6.error);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CST_PPS201_Amalgame.prototype.getAgreement = function (agreementLines, numberOfItems) {
        var agreement;
        try {
            var firstAgreement = agreementLines[0];
            var firstIdentifier = firstAgreement.OBV1;
            var identifierLetter = firstIdentifier[0];
            if (!this.isLetter(identifierLetter)) {
                this.showMessage(this.translate("couldNotParseAgreementLines2"));
                return;
            }
            var fillerZero = numberOfItems < 10 ? '0' : '';
            var possibleIdentifier_1 = "".concat(identifierLetter).concat(fillerZero).concat(numberOfItems);
            var possibleAgreement = agreementLines.find(function (agreement) { return agreement.OBV1 === possibleIdentifier_1; });
            if (possibleAgreement) {
                agreement = possibleAgreement;
            }
            else {
                agreementLines = agreementLines.sort(function (a, b) { return parseFloat(a.OBV1.slice(-2)) < parseFloat(b.OBV1.slice(-2)) ? 1 : -1; });
                agreement = agreementLines[0];
            }
        }
        catch (error) {
            this.showMessage(this.translate("couldNotParseAgreementLines") + JSON.stringify(error));
            return;
        }
        return agreement;
    };
    /**
     *
     * @param SUNO
     * @param AGNB
     */
    CST_PPS201_Amalgame.prototype.getFilteredAgreements = function (SUNO, AGNB) {
        return __awaiter(this, void 0, void 0, function () {
            var agreementLines, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.listAgreementLines(SUNO, AGNB)];
                    case 1:
                        agreementLines = _b.sent();
                        return [2 /*return*/, agreementLines.filter(function (a) { return a.GRPI === _this.groupIdentity; })];
                    case 2:
                        _a = _b.sent();
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * @param SUNO
     * @param AGNB
     * @param GRPI
     * @param OBV1
     * @param FVDT
     * @returns
     */
    CST_PPS201_Amalgame.prototype.listStaggeredPrices = function (SUNO, AGNB, GRPI, OBV1, FVDT) {
        return __awaiter(this, void 0, void 0, function () {
            var request, response, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = new MIRequest();
                        request.program = 'PPS100MI';
                        request.transaction = 'LstStgPrice';
                        request.includeMetadata = true;
                        request.typedOutput = true;
                        request.maxReturnedRecords = 6000;
                        request.record = {
                            SUNO: SUNO,
                            AGNB: AGNB,
                            GRPI: GRPI,
                            OBV1: OBV1,
                            FVDT: FVDT,
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.miService.executeRequestV2(request)];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.items || []];
                    case 3:
                        error_7 = _a.sent();
                        this.handleError(error_7.error);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * @param CUCD
     * @returns
     */
    CST_PPS201_Amalgame.prototype.getCurrencySign = function (CUCD) {
        switch (CUCD) {
            case 'USD':
                return '$';
            case 'EUR':
                return '€';
            case 'GBP':
                return '£';
            case 'JPY':
                return '¥';
            default:
                return '';
        }
    };
    /**
     *
     * @param poLine
     * @returns
     */
    CST_PPS201_Amalgame.prototype.updatePOLine = function (poLine) {
        return __awaiter(this, void 0, void 0, function () {
            var request, response, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = new MIRequest();
                        request.program = 'PPS200MI';
                        request.transaction = 'UpdLine';
                        request.record = poLine;
                        request.includeMetadata = true;
                        request.typedOutput = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.miService.executeRequestV2(request)];
                    case 2:
                        response = _a.sent();
                        if (response.hasError()) {
                            throw response;
                        }
                        else {
                            return [2 /*return*/, response.items];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_8 = _a.sent();
                        this.handleError(error_8.error);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ;
    /**
     *
     * @param record
     * @returns
     */
    CST_PPS201_Amalgame.prototype.addFieldValue = function (record) {
        return __awaiter(this, void 0, void 0, function () {
            var request, response, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = new MIRequest();
                        request.program = 'CUSEXTMI';
                        request.transaction = 'AddFieldValue';
                        request.includeMetadata = true;
                        request.typedOutput = true;
                        request.maxReturnedRecords = 1;
                        request.record = record;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.miService.executeRequestV2(request)];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.items || []];
                    case 3:
                        error_9 = _a.sent();
                        this.log.Error(JSON.stringify(error_9.error, null, '\t') || 'Unknown error');
                        this.setBusy(false);
                        throw [];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * @param record
     * @returns
     */
    CST_PPS201_Amalgame.prototype.delFieldValue = function (record) {
        return __awaiter(this, void 0, void 0, function () {
            var request, response, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = new MIRequest();
                        request.program = 'CUSEXTMI';
                        request.transaction = 'DelFieldValue';
                        request.includeMetadata = true;
                        request.typedOutput = true;
                        request.maxReturnedRecords = 1;
                        request.record = record;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.miService.executeRequestV2(request)];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.items || []];
                    case 3:
                        error_10 = _a.sent();
                        this.log.Error(JSON.stringify(error_10.error, null, '\t') || 'Unknown error');
                        this.setBusy(false);
                        throw [];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description: Handle PPS201
     */
    CST_PPS201_Amalgame.prototype.handlePPS201 = function () {
        return __awaiter(this, void 0, void 0, function () {
            var PUNO, SUNO, AGNB, PUCD, totalPurchaseQty, uniqueItems, savedPrices, rows, _i, rows_1, row, line, savedPrice, agreements, agreement, CUCD, GRPI, OBV1, FVDT, staggeredPrices, newPrice, ODI3, _a, staggeredPrices_2, priceLine, formattedPrice, currencySign, updatePrices, revertPrices;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.setBusy(true);
                        PUNO = this.controller.GetValue('IAPUNO').trim();
                        SUNO = this.controller.GetValue('IASUNO').trim();
                        AGNB = '';
                        PUCD = 0;
                        totalPurchaseQty = 0;
                        uniqueItems = [];
                        savedPrices = [];
                        rows = this.controller
                            .GetGrid()
                            .getData()
                            .filter(function (i) { return i.WSPNLI; });
                        _i = 0, rows_1 = rows;
                        _b.label = 1;
                    case 1:
                        if (!(_i < rows_1.length)) return [3 /*break*/, 5];
                        row = rows_1[_i];
                        return [4 /*yield*/, this.getPOLine(PUNO, row.WSPNLI, row.WSPNLS)];
                    case 2:
                        line = (_b.sent())[0];
                        return [4 /*yield*/, this.getFieldValue({
                                FILE: 'MPLINE',
                                PK01: PUNO,
                                PK02: row.WSPNLI,
                                PK03: row.WSPNLS,
                            })];
                    case 3:
                        savedPrice = (_b.sent())[0];
                        if (line && Number(line.PUSL) < 32) {
                            AGNB || (AGNB = line.OURR);
                            PUCD || (PUCD = Number(line.PUCD));
                            totalPurchaseQty += line.ORQA;
                            uniqueItems.push(line);
                            if (savedPrice) {
                                savedPrices.push(savedPrice);
                            }
                        }
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5:
                        if (!rows.length) {
                            this.showMessage(this.translate("noPoLinesFound"));
                            return [2 /*return*/];
                        }
                        if (!uniqueItems.length) {
                            this.showMessage(this.translate("allPoLinesAreConfirmed"));
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.getFilteredAgreements(SUNO, AGNB)];
                    case 6:
                        agreements = _b.sent();
                        if (!agreements.length) {
                            this.showMessage(this.translate("noAgreementLinesFoundForAgreement").replace('{0}', AGNB));
                            return [2 /*return*/];
                        }
                        agreement = this.getAgreement(agreements, uniqueItems.length);
                        if (!agreement) {
                            this.showMessage(this.translate("couldNotParseAgreementLines"));
                            return [2 /*return*/];
                        }
                        CUCD = agreement.CUCD;
                        GRPI = agreement.GRPI;
                        OBV1 = agreement.OBV1;
                        FVDT = agreement.FVDT;
                        return [4 /*yield*/, this.listStaggeredPrices(SUNO, AGNB, GRPI, OBV1, FVDT)];
                    case 7:
                        staggeredPrices = _b.sent();
                        if (!staggeredPrices.length) {
                            this.showMessage(this.translate('noStaggeredPricesFoundForAgreement').replace('{0}', "".concat(AGNB, "/").concat(GRPI, "/").concat(OBV1, "/").concat(FVDT)));
                            return [2 /*return*/];
                        }
                        staggeredPrices = staggeredPrices.sort(function (a, b) { return (parseFloat(a.FRQT) > parseFloat(b.FRQT) ? 1 : -1); });
                        newPrice = 0;
                        ODI3 = 0;
                        for (_a = 0, staggeredPrices_2 = staggeredPrices; _a < staggeredPrices_2.length; _a++) {
                            priceLine = staggeredPrices_2[_a];
                            if (totalPurchaseQty >= priceLine.FRQT) {
                                newPrice = priceLine.PUPR;
                                ODI3 = priceLine.DIP3;
                            }
                            else {
                                break;
                            }
                        }
                        if (PUCD) {
                            newPrice *= PUCD;
                        }
                        formattedPrice = "".concat(newPrice, " ").concat(CUCD);
                        currencySign = this.getCurrencySign(CUCD);
                        if (currencySign) {
                            formattedPrice = "".concat(currencySign).concat(newPrice.toFixed(2));
                        }
                        updatePrices = function () { return ConfirmDialog.ShowMessageDialog({
                            header: "".concat(_this.translate('confirmPromptTitle1')).concat(formattedPrice).concat(_this.translate('confirmPromptTitle2')),
                            message: _this.translate('confirmPromptMessagePPS201')
                                .replace('{0}', String(uniqueItems.length))
                                .replace('{1}', String(totalPurchaseQty))
                                .replace('{2}', OBV1)
                                .replace('{3}', AGNB)
                                .replace('{4}', String(uniqueItems.length)) +
                                (PUCD === 1000 ? _this.translate('purchasePriceQuantity').replace('{0}', String(PUCD)) : ''),
                            dialogType: DialogType.Question,
                            closed: function (ret) { return function () { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!ret.ok) return [3 /*break*/, 3];
                                            return [4 /*yield*/, Promise.all(uniqueItems.map(function (i) { return _this.addFieldValue({
                                                    FILE: 'MPLINE',
                                                    PK01: PUNO,
                                                    PK02: String(i.PNLI),
                                                    PK03: String(i.PNLS),
                                                    N096: i.PUPR,
                                                }); })).catch(function (error) { return _this.showError(error); })];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, Promise.all(uniqueItems.map(function (i) { return _this.updatePOLine({
                                                    PUNO: PUNO,
                                                    PNLI: i.PNLI,
                                                    PNLS: i.PNLS,
                                                    PUPR: parseFloat(newPrice.toString()).toFixed(6), // updated by Pierre AOUN, Old value : newPrice,
                                                    ODI3: ODI3,
                                                }); })).catch(function (error) { return _this.showError(error); })];
                                        case 2:
                                            _a.sent();
                                            this.controller.PressKey('F5');
                                            _a.label = 3;
                                        case 3:
                                            this.setBusy(false);
                                            return [2 /*return*/];
                                    }
                                });
                            }); }; },
                        }); };
                        revertPrices = function () { return ConfirmDialog.ShowMessageDialog({
                            header: _this.translate('revertToOriginalPrice'),
                            message: _this.translate("confirmToChangeBackToOriginalPrice") +
                                '<br/ >' +
                                savedPrices
                                    .map(function (s) { return _this.translate('line')
                                    .replace('{0}', "".concat(Number(s.PK02)))
                                    .replace('{1}', "".concat(currencySign).concat(s.N096)); })
                                    .join('<br/>'),
                            dialogType: DialogType.Question,
                            closed: function (ret) { return function () { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!ret.ok) return [3 /*break*/, 3];
                                            return [4 /*yield*/, Promise.all(savedPrices.map(function (i) { return _this.updatePOLine({
                                                    PUNO: PUNO,
                                                    PNLI: Number(i.PK02),
                                                    PNLS: Number(i.PK03),
                                                    PUPR: parseFloat(i.N096.toString()).toFixed(6), // updated by Pierre AOUN, Old value : i.N096,
                                                }); })).catch(function (error) { return _this.showError(error); })];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, Promise.all(savedPrices.map(function (i) { return _this.delFieldValue({
                                                    FILE: 'MPLINE',
                                                    PK01: i.PK01,
                                                    PK02: i.PK02,
                                                    PK03: i.PK03,
                                                }); })).catch(function (error) { return _this.showError(error); })];
                                        case 2:
                                            _a.sent();
                                            this.controller.PressKey('F5');
                                            return [3 /*break*/, 4];
                                        case 3:
                                            updatePrices();
                                            _a.label = 4;
                                        case 4:
                                            this.setBusy(false);
                                            return [2 /*return*/];
                                    }
                                });
                            }); }; }
                        }); };
                        if (savedPrices.length) {
                            revertPrices();
                        }
                        else {
                            updatePrices();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CST_PPS201_Amalgame.prototype.showError = function (error) {
        var errorCode = error.errorCode, errorMessage = error.errorMessage;
        if (errorMessage) {
            if (errorCode === 'PP20138') {
                this.showMessage(this.translate('pleaseCheckYourOrderType'));
                return;
            }
            this.showMessage(errorMessage);
            return;
        }
        this.showMessage(JSON.stringify(error));
    };
    CST_PPS201_Amalgame.prototype.showMessage = function (message, dialogType) {
        this.setBusy(false);
        var options = {
            header: this.scriptName,
            message: message,
            dialogType: dialogType || DialogType.Error,
            id: "".concat(this.scriptName),
        };
        ConfirmDialog.ShowMessageDialog(options);
    };
    /**
     *
     * @param translation
     * @returns
     */
    CST_PPS201_Amalgame.prototype.translate = function (translation) {
        var LANC = ScriptUtil.GetUserContext('CurrentLanguage');
        var language = this.translations[LANC] || this.translations["GB"];
        return language[translation] || this.translations["GB"][translation] || 'No translation found!';
    };
    CST_PPS201_Amalgame.prototype.isLetter = function (str) {
        return str.length === 1 && str.match(/[a-z]/i);
    };
    CST_PPS201_Amalgame.prototype.handleError = function (error) {
        this.log.Error(error ? JSON.stringify(error, null, '\t') : 'Unknown error');
        this.setBusy(false);
    };
    CST_PPS201_Amalgame.prototype.getTranslations = function () {
        return {
            GB: {
                example: "There are 4 different SKUs with a total quantity of 55000. Agreement line Y03 from agreement 2000040 will be used. 6 planned purchase orders will be affected.",
                allPoLinesAreConfirmed: "All PO lines are confirmed.",
                confirmPromptTitle1: "Update purchase price to ",
                confirmPromptTitle2: "?",
                confirmPromptMessage1: "There are ",
                confirmPromptMessage2: " different SKUs with a total quantity of ",
                confirmPromptMessage3: ". Agreement line ",
                confirmPromptMessage4: " from agreement ",
                confirmPromptMessage5: " will be used. ",
                confirmPromptMessage6: " planned purchase orders will be affected.",
                confirmPromptMessage7: "Purchase price quantity is ",
                confirmPromptMessage8: " purchase order line(s) will be affected.",
                confirmPromptMessagePPS201: 'There are {0} different SKUs with a total quantity of {1}. ' +
                    'Agreement line {2} from agreement {3} will be used. ' +
                    '{4} purchase order line(s) will be affected. ',
                confirmToChangeBackToOriginalPrice: "Confirm to change back to original price.",
                couldNotParseAgreementLines: "Could not parse agreement lines.",
                couldNotParseAgreementLines2: "Could not parse agreement lines, start value 1 (OBV1) is using an unexpected format.",
                line: "Line {0}: {1}",
                noAgreementLinesFoundForAgreement: "No agreement lines found for agreement {0}",
                noPoLinesFound: "No PO lines found.",
                noStaggeredPricesFoundForAgreement: "No staggered prices found for agreement {0}",
                noPurchaseOrderLinesFoundInTablePPW192: "No purchase order lines found in table PPW192",
                pleaseCheckYourOrderType: "Please check your order type. \n Agreement check active - price cannot be changed",
                purchasePriceQuantity: "Purchase price quantity is {0}.",
                revertToOriginalPrice: "Revert to original price?",
            },
            FR: {
                allPoLinesAreConfirmed: "Toutes les lines d'ordre d'achat sont confirm\u00E9es.",
                confirmPromptTitle1: "Mise \u00E0 jour Prix \u00E0 ",
                confirmPromptTitle2: "?",
                confirmPromptMessage1: "Il existe ",
                confirmPromptMessage2: " SKU diff\u00E9rents avec une quantit\u00E9 totale de ",
                confirmPromptMessage3: ". La ligne de contrat ",
                confirmPromptMessage4: " du contrat ",
                confirmPromptMessage5: " sera utilis\u00E9e. ",
                confirmPromptMessage6: " Propositions de commande achat seront concern\u00E9es.",
                confirmPromptMessage7: "Purchase price quantity is ",
                confirmPromptMessage8: " planned purchase orders will be affected.",
                confirmPromptMessagePPS201: 'Il y a {0} SKUs différentes avec une quantité totale de {1}. ' +
                    'La ligne {2} du contrat {3} sera utilisée. ' +
                    "{4} lignes d'ordre d'achat seront affect\u00E9es. ",
                confirmToChangeBackToOriginalPrice: "Confirmer le retour au prix initial.",
                couldNotParseAgreementLines: "Impossible d'analyser les lignes du contrat.",
                couldNotParseAgreementLines2: "Impossible d'analyser les lignes du contrat, la valeur de d\u00E9part 1 (OBV1) utilise un format inattendu.",
                line: "Ligne {0}: {1}",
                noAgreementLinesFoundForAgreement: "Aucune ligne de contrat trouv\u00E9e pour le contrat {0}",
                noPoLinesFound: "Aucune ligne d'ordre d'achat trouv\u00E9e.",
                noPurchaseOrderLinesFoundInTablePPW192: "Aucune ligne d'ordre d'achat trouv\u00E9e dans la table PPW192",
                noStaggeredPricesFoundForAgreement: "Aucun prix \u00E9chelonn\u00E9 n'a \u00E9t\u00E9 trouv\u00E9 pour le contrat {0}",
                pleaseCheckYourOrderType: "Veuillez v\u00E9rifier votre type d'ordre d'achat. \n Contr\u00F4le contrat activ\u00E9 - le prix ne peut pas \u00EAtre modifi\u00E9",
                purchasePriceQuantity: "La quantit\u00E9 prix d'achat est {0}.",
                revertToOriginalPrice: "Revenir au prix initial?",
            }
        };
    };
    return CST_PPS201_Amalgame;
}());
