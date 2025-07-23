"use strict";
/*
    H5Script C02_MWS490B_LaunchBonTransport
  * @author: Joel Randrianarivelo
  * @version: 1.0.0
  * @since: 28-02-2025
  * @description: Bon de transport
*/
/**
 * CHANGELOGS
 * Version    Date       User        Description
 * 1.0.0   28-02-2025    JOEL        Initial Release
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
var C02_MWS490B_LaunchBonTransport = /** @class */ (function () {
    function C02_MWS490B_LaunchBonTransport(scriptArgs) {
        this.POPUP_ID = 'pop_mesg';
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
    C02_MWS490B_LaunchBonTransport.Init = function (args) {
        new C02_MWS490B_LaunchBonTransport(args).run();
    };
    C02_MWS490B_LaunchBonTransport.prototype.run = function () {
        var _this = this;
        console.info('1.0.0   28-02-2025    JOEL        Initial Release');
        //récupération des colonnes du grid
        var columns = this.grid.getColumns();
        //Existence des colonnes RIDN, RORC et FWNO
        var columnNames = columns.map(function (column) { return column.name; });
        //if (!columnNames.includes('RIDN') || !columnNames.includes('RORC') || !columnNames.includes('FWNO')) return;
        //Ajouter le bouton Envoyer Bon Transport
        this.addBtn();
        this.$host.find('#BtnSend').on('click', function (e) { return __awaiter(_this, void 0, void 0, function () {
            var selectedRows, crs111miReq, emal, res, _a, ahs150miReq, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        e.preventDefault();
                        selectedRows = this.grid.getSelectedGridRows()[0].data;
                        if (!selectedRows)
                            return [2 /*return*/];
                        if (!columnNames.includes('RIDN') || !columnNames.includes('RORC') || !columnNames.includes('FWNO')) {
                            this.showMessage("Les colonnes Ordre et Transitaire sont obligatoires dans la vue", 'warning');
                            return [2 /*return*/];
                        }
                        if (selectedRows['OQRORC'] != '2') {
                            this.showMessage("L'edition ne fonctionne que pour des OAs", 'warning');
                            return [2 /*return*/];
                        }
                        if (!selectedRows['OQFWNO']) {
                            this.showMessage("Transitaire est obligatoire", 'warning');
                            return [2 /*return*/];
                        }
                        crs111miReq = new MIRequest();
                        crs111miReq.program = 'CRS111MI';
                        crs111miReq.transaction = 'Get';
                        crs111miReq.record = {
                            EMTP: '02',
                            EMKY: selectedRows['OQFWNO']
                        };
                        crs111miReq.outputFields = ['EMAL'];
                        emal = '';
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.miService.executeRequestV2(crs111miReq)];
                    case 2:
                        res = _c.sent();
                        if (res.items.length > 0) {
                            emal = res.items[0].EMAL;
                        }
                        else {
                            this.showMessage("E-mail transitaire n'existe pas en CRS111", 'error');
                            return [2 /*return*/];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _c.sent();
                        this.showMessage("E-mail transitaire n'existe pas en CRS111", 'error');
                        return [2 /*return*/];
                    case 4:
                        ahs150miReq = new MIRequest();
                        ahs150miReq.program = 'AHS150MI';
                        ahs150miReq.transaction = 'Submit';
                        ahs150miReq.record = {
                            REPO: 'TRANSPORT',
                            REPV: '&BON_TRANSPORT',
                            EMAL: emal,
                            OBK1: selectedRows['OQRIDN'],
                            REEM: '4'
                        };
                        _c.label = 5;
                    case 5:
                        _c.trys.push([5, 7, , 8]);
                        //@ts-ignore
                        return [4 /*yield*/, this.miService.executeRequestV2(ahs150miReq)];
                    case 6:
                        //@ts-ignore
                        _c.sent();
                        this.showMessage("Edition envoy\u00E9e avec succ\u00E8s", 'success');
                        return [3 /*break*/, 8];
                    case 7:
                        _b = _c.sent();
                        this.showMessage("Edition non envoy\u00E9e", 'error');
                        return [2 /*return*/];
                    case 8: return [2 /*return*/];
                }
            });
        }); });
    };
    C02_MWS490B_LaunchBonTransport.prototype.addBtn = function () {
        var btnSequencer = new ButtonElement();
        btnSequencer.Name = "BtnSend";
        btnSequencer.Value = "Envoyer Bon Transport";
        btnSequencer.Position = new PositionElement();
        btnSequencer.Position.Top = 4;
        btnSequencer.Position.Left = 69;
        btnSequencer.Position.Width = 10;
        this.contentElement.AddElement(btnSequencer);
    };
    C02_MWS490B_LaunchBonTransport.prototype.showMessage = function (message, type) {
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
    return C02_MWS490B_LaunchBonTransport;
}());
