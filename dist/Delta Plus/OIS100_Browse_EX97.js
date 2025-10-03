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
    H5Script OIS100_Browse_EX97
  * @author: Joel Randrianarivelo
  * @version: 1.0.0
  * @since: 2025-08-20
  * @description: Ajout d'un popup sur le Browse CCUCHA40 dans OIS100
*/
/**
 * CHANGELOGS
 * Version    Date       User        Description
 * 1.0.0   20-08-2025    JOEL        Initial Release
 */
var OIS100_Browse_EX97 = /** @class */ (function () {
    function OIS100_Browse_EX97(scriptArgs) {
        this.btnExist = false;
        this.DATAGRID_ID = "OIS100_Browse_EX97_datagrid";
        this.BTNCLOSE_ID = "OIS100_Browse_EX97_btnClose";
        this.allData = [];
        this.controller = scriptArgs.controller;
        if (ScriptUtil.version >= 2.0) {
            this.miService = MIService;
        }
        else {
            this.miService = MIService.Current;
        }
        this.$host = this.controller.ParentWindow;
        this.contentElement = this.controller.GetContentElement();
    }
    OIS100_Browse_EX97.Init = function (args) {
        new OIS100_Browse_EX97(args).run();
    };
    OIS100_Browse_EX97.prototype.getAllData = function (tab) {
        return __awaiter(this, void 0, void 0, function () {
            var request, response, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = new MIRequest();
                        request.program = "CMS100MI";
                        request.transaction = "LstEX97_CCUCHAO";
                        request.record = {
                            F_ORCU: this.controller.GetValue("OACUNO"),
                            T_ORCU: this.controller.GetValue("OACUNO"),
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.miService.executeRequestV2(request)];
                    case 2:
                        response = _a.sent();
                        this.allData = response.items.filter(function (item) {
                            var from = item["CUFDAT"] ? parseInt(item["CUFDAT"]) : 0;
                            var to = item["CUTDAT"] ? parseInt(item["CUTDAT"]) : 0;
                            var today = parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ''));
                            return (from < today) && (to > today);
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.error("Error");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OIS100_Browse_EX97.prototype.run = function () {
        var _this = this;
        // Création de l'observateur
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) { // Élément DOM
                        // Vérifie si un div.modal-content existe à l'intérieur
                        if (node instanceof Element) {
                            var modalContent = node.querySelector("div.modal-content");
                            if (modalContent && modalContent.innerText.includes("CCUCHA40")) {
                                _this.action(modalContent);
                            }
                        }
                    }
                });
            });
        });
        // Démarrer l'observation sur tout le document
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };
    OIS100_Browse_EX97.prototype.action = function (modalContent) {
        return __awaiter(this, void 0, void 0, function () {
            var menu, $menu, button, trs, tabDelCust;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.btnExist) {
                            return [2 /*return*/];
                        }
                        menu = modalContent.querySelector('div.modal-body-wrapper #btn-grp .upperButtons');
                        $menu = $(menu);
                        if (document.getElementById('btnShowMore')) {
                            return [2 /*return*/];
                        }
                        button = $('<button>', {
                            text: 'Show More Information',
                            id: 'btnShowMore',
                        });
                        $menu.append(button);
                        button.css({
                            'width': '90px',
                            'padding-top': '3px',
                            'padding-bottom': '3px',
                            'background-color': 'transparent',
                            'border-radius': '8px',
                            'color': '#0054b1',
                            'border': '1px solid #0054b1',
                            'font-weight': 'bold',
                            'font-size': '15px',
                        });
                        trs = modalContent.querySelectorAll('div.modal-body-wrapper .datagrid-wrapper table tbody tr');
                        tabDelCust = Array.from(trs).map(function (tr) {
                            var _a, _b;
                            return ((_b = (_a = tr.querySelector('td:first-child')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || '';
                        });
                        return [4 /*yield*/, this.getAllData(tabDelCust)];
                    case 1:
                        _a.sent();
                        button.on('click', function () {
                            _this.showBrowseDialog();
                            _this.fetchData(modalContent);
                        });
                        this.btnExist = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    OIS100_Browse_EX97.prototype.showBrowseDialog = function () {
        var browseDialogContent = $('<div id="' + this.DATAGRID_ID + '" style="height: 500px"></div>');
        var browseDialogButtons = [
            {
                text: "Close",
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
        var titleTxt = "More Information";
        var browseDialogOptions = {
            title: titleTxt,
            dialogType: "General",
            modal: true,
            width: 750,
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
    OIS100_Browse_EX97.prototype.fetchData = function (modalContent) {
        return __awaiter(this, void 0, void 0, function () {
            var columns, selectedField, resInprogress;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        columns = [
                            { id: "CUCCAC", field: "CUCCAC", name: "Activity", filterType: "text" },
                            { id: "CUCUCH", field: "CUCUCH", name: "Cust channel ID", filterType: "text" },
                            { id: "CUDECU", field: "CUDECU", name: "Deliv customer", filterType: "text" },
                            { id: "OKCUNM", field: "OKCUNM", name: "Name Deliv Cust", filterType: "text" },
                            { id: "OKCUA1", field: "OKCUA1", name: "Address line 1", filterType: "text" },
                            { id: "OKCUA2", field: "OKCUA2", name: "Address line 2", filterType: "text" },
                            { id: "OKCUA3", field: "OKCUA3", name: "Address line 3", filterType: "text" },
                            { id: "OKPONO", field: "OKPONO", name: "CP Deliv Cust", filterType: "text" },
                            { id: "OKTOWN", field: "OKTOWN", name: "Ville Deliv Cust", filterType: "text" },
                            { id: "OKCSCD", field: "OKCSCD", name: "Pays Deliv Cust", filterType: "text" },
                            { id: "CUINRC", field: "CUINRC", name: "Code facturé", filterType: "text" },
                            { id: "R1CUNM", field: "R1CUNM", name: "Nom facturé", filterType: "text" },
                            { id: "CUPYNO", field: "CUPYNO", name: "Code client payer", filterType: "text" },
                            { id: "P1CUNM", field: "P1CUNM", name: "Name Payer", filterType: "text" },
                            // { id: "CUFDAT", field: "CUFDAT", name: "From date", filterType: "text" },
                            // { id: "CUTDAT", field: "CUTDAT", name: "To date", filterType: "text" },
                            { id: "P1PYGR", field: "P1PYGR", name: "Code client risque groupe crédit", filterType: "text" },
                            { id: "PYCUNM", field: "PYCUNM", name: "Nom groupe crédit", filterType: "text" },
                        ];
                        selectedField = "CUDECU";
                        $("#" + this.DATAGRID_ID)
                            .datagrid({
                            columns: columns,
                            data: [],
                            filterable: true,
                            selectable: "single",
                            rowHeight: "small",
                            spacerColumn: true,
                        })
                            .on("selected", function (e, args) { return __awaiter(_this, void 0, void 0, function () {
                            var trs, find, _i, trs_1, tr, tmp, _a, trs_2, tr, tmp;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        ScriptUtil.version >= 2.0
                                            ? $("#" + this.BTNCLOSE_ID).click()
                                            : $(this).inforDialog("close");
                                        // await new Promise(resolve => setTimeout(resolve, 1000));
                                        // const input = document.querySelector("#-BROWSE_LIST-1-header-filter-0") as HTMLInputElement;
                                        // input.value = args[0].data[selectedField];
                                        // await new Promise(resolve => setTimeout(resolve, 100)); // Wait for the input to be updated
                                        // $(input).focus();
                                        // $(input).trigger("change");
                                        // const event = new KeyboardEvent('keydown', {
                                        //     bubbles: true,
                                        //     cancelable: true,
                                        //     key: 'Enter',
                                        //     code: 'Enter',
                                        //     keyCode: 13
                                        // });
                                        // input.dispatchEvent(event);
                                        // document.dispatchEvent(event)
                                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                                    case 1:
                                        // await new Promise(resolve => setTimeout(resolve, 1000));
                                        // const input = document.querySelector("#-BROWSE_LIST-1-header-filter-0") as HTMLInputElement;
                                        // input.value = args[0].data[selectedField];
                                        // await new Promise(resolve => setTimeout(resolve, 100)); // Wait for the input to be updated
                                        // $(input).focus();
                                        // $(input).trigger("change");
                                        // const event = new KeyboardEvent('keydown', {
                                        //     bubbles: true,
                                        //     cancelable: true,
                                        //     key: 'Enter',
                                        //     code: 'Enter',
                                        //     keyCode: 13
                                        // });
                                        // input.dispatchEvent(event);
                                        // document.dispatchEvent(event)
                                        _b.sent(); // Wait for the grid to update
                                        trs = modalContent.querySelectorAll('div.modal-body-wrapper .datagrid-wrapper table tbody tr');
                                        find = false;
                                        for (_i = 0, trs_1 = trs; _i < trs_1.length; _i++) {
                                            tr = trs_1[_i];
                                            if (tr.innerText.includes(args[0].data[selectedField]) && tr.innerText.includes(args[0].data['CUGCAC']) && tr.innerText.includes(args[0].data['CUINRC'])) {
                                                tmp = tr;
                                                find = true;
                                                $(tmp).find('td')[0].click();
                                                $('#BTN_L52T23').click();
                                                break;
                                            }
                                        }
                                        if (!find) {
                                            for (_a = 0, trs_2 = trs; _a < trs_2.length; _a++) {
                                                tr = trs_2[_a];
                                                if (tr.innerText.includes(args[0].data[selectedField])) {
                                                    tmp = tr;
                                                    find = true;
                                                    $(tmp).find('td')[0].click();
                                                    $('#BTN_L52T23').click();
                                                    break;
                                                }
                                            }
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(this.allData.map(function (e) { return __awaiter(_this, void 0, void 0, function () {
                                var req, pycunm, res, _a;
                                var _b;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            req = new MIRequest();
                                            req.program = "CRS610MI";
                                            req.transaction = "GetBasicData";
                                            req.record = {
                                                CUNO: e["P1PYGR"]
                                            };
                                            req.outputFields = ["CUNM"];
                                            pycunm = '';
                                            if (!e["P1PYGR"]) return [3 /*break*/, 4];
                                            _c.label = 1;
                                        case 1:
                                            _c.trys.push([1, 3, , 4]);
                                            return [4 /*yield*/, this.miService.executeRequestV2(req)];
                                        case 2:
                                            res = _c.sent();
                                            pycunm = ((_b = res.items[0]) === null || _b === void 0 ? void 0 : _b.CUNM) || '';
                                            return [3 /*break*/, 4];
                                        case 3:
                                            _a = _c.sent();
                                            return [3 /*break*/, 4];
                                        case 4: return [2 /*return*/, {
                                                CUDECU: e["CUDECU"],
                                                OKCUNM: e["OKCUNM"],
                                                OKCUA1: e["OKCUA1"],
                                                OKCUA2: e["OKCUA2"],
                                                OKCUA3: e["OKCUA3"],
                                                OKTOWN: e["OKTOWN"],
                                                OKPONO: e["OKPONO"],
                                                CUINRC: e["CUINRC"],
                                                R1CUNM: e["R1CUNM"],
                                                CUPYNO: e["CUPYNO"],
                                                P1CUNM: e["P1CUNM"],
                                                CUCCAC: e["CUCCAC"],
                                                CUCUCH: e["CUCUCH"],
                                                OKCSCD: e["OKCSCD"],
                                                P1PYGR: e["P1PYGR"],
                                                PYCUNM: pycunm,
                                            }];
                                    }
                                });
                            }); }))];
                    case 1:
                        resInprogress = _a.sent();
                        $("#" + this.DATAGRID_ID)
                            .data("datagrid")
                            .updateDataset(resInprogress);
                        return [2 /*return*/, resInprogress];
                }
            });
        });
    };
    return OIS100_Browse_EX97;
}());
