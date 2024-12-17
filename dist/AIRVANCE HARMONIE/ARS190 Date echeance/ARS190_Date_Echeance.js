"use strict";
/*
    H5Script ARS190_Date_Echeance
  * @author: Joel Randrianarivelo
  * @version: 1.0.0
  * @since: 2024-11-04
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
var ARS190_Date_Echeance = /** @class */ (function () {
    function ARS190_Date_Echeance(scriptArgs) {
        //this.argument = scriptArgs.args;
        this.controller = scriptArgs.controller;
        this.contentElement = this.controller.GetContentElement();
        this.CONO = ScriptUtil.GetUserContext().CONO;
        this.DIVI = ScriptUtil.GetUserContext().DIVI;
        if (ScriptUtil.version >= 2.0) {
            this.miService = MIService;
        }
        else {
            this.miService = MIService.Current;
        }
    }
    ARS190_Date_Echeance.Init = function (args) {
        new ARS190_Date_Echeance(args).run();
    };
    ARS190_Date_Echeance.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var request, response, items, _i, items_1, item, tmp, cono, divi, jbno, jbdt, jbtm, litx, tmp2, dudt, request2, response2, items2, _a, items2_1, item2, tmp3, grpa, request3, response3, item3, e_1, e_2, e_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        //@ts-ignore
                        this.controller.ShowBusyIndicator();
                        request = new MIRequest();
                        request.program = 'EXPORTMI';
                        request.transaction = 'Select';
                        request.record = {
                            SEPC: '$',
                            QERY: "F1CONO, F1DIVI, F1JBNO, F1JBDT, F1JBTM, F1LITX from FSLGP1 where F1GPST = '0' and F1CONO = '".concat(this.CONO, "' and F1DIVI = '").concat(this.DIVI, "'")
                        };
                        request.outputFields = ['REPL'];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 15, , 16]);
                        return [4 /*yield*/, this.miService.executeRequestV2(request)];
                    case 2:
                        response = _b.sent();
                        items = response.items;
                        _i = 0, items_1 = items;
                        _b.label = 3;
                    case 3:
                        if (!(_i < items_1.length)) return [3 /*break*/, 14];
                        item = items_1[_i];
                        tmp = item['REPL'].split('$');
                        cono = tmp[0];
                        divi = tmp[1];
                        jbno = tmp[2];
                        jbdt = tmp[3];
                        jbtm = tmp[4];
                        litx = tmp[5];
                        if (!litx.includes('||ECH:')) return [3 /*break*/, 13];
                        tmp2 = litx.split('||ECH:');
                        dudt = tmp2[1];
                        request2 = new MIRequest();
                        request2.program = 'EXPORTMI';
                        request2.transaction = 'Select';
                        request2.record = {
                            SEPC: '$',
                            QERY: "F2CONO, F2DIVI, F2JBNO, F2JBDT, F2JBTM, F2GRPA from FSLGP2 where F2CONO = '".concat(cono, "' and F2DIVI = '").concat(divi, "' and F2JBNO = '").concat(jbno, "' and F2JBDT = '").concat(jbdt, "' and F2JBTM = '").concat(jbtm, "'")
                        };
                        _b.label = 4;
                    case 4:
                        _b.trys.push([4, 12, , 13]);
                        return [4 /*yield*/, this.miService.executeRequestV2(request2)];
                    case 5:
                        response2 = _b.sent();
                        items2 = response2.items;
                        _a = 0, items2_1 = items2;
                        _b.label = 6;
                    case 6:
                        if (!(_a < items2_1.length)) return [3 /*break*/, 11];
                        item2 = items2_1[_a];
                        tmp3 = item2['REPL'].split('$');
                        grpa = tmp3[5];
                        request3 = new MIRequest();
                        request3.program = 'EXT190MI';
                        request3.transaction = 'UpdFSLGP2';
                        request3.record = {
                            CONO: cono,
                            DIVI: divi,
                            JBNO: jbno,
                            JBDT: jbdt,
                            JBTM: jbtm,
                            GRPA: grpa,
                            DUDT: this.formatDate(dudt)
                        };
                        _b.label = 7;
                    case 7:
                        _b.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, this.miService.executeRequestV2(request3)];
                    case 8:
                        response3 = _b.sent();
                        item3 = response3.item;
                        if (item3['RSLT'] == 'KO')
                            throw 'erreur';
                        return [3 /*break*/, 10];
                    case 9:
                        e_1 = _b.sent();
                        console.error('Erreur lors de la modification du fature : ', item2);
                        return [3 /*break*/, 10];
                    case 10:
                        _a++;
                        return [3 /*break*/, 6];
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        e_2 = _b.sent();
                        console.error('Erreur lors de la récupération des factures du groupe : ', item);
                        return [3 /*break*/, 13];
                    case 13:
                        _i++;
                        return [3 /*break*/, 3];
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        e_3 = _b.sent();
                        console.error('Erreur lors de la récupération des groupes');
                        return [3 /*break*/, 16];
                    case 16:
                        //@ts-ignore
                        this.controller.HideBusyIndicator();
                        return [2 /*return*/];
                }
            });
        });
    };
    ARS190_Date_Echeance.prototype.formatDate = function (date) {
        var res = date.split('/').join('');
        return res;
    };
    return ARS190_Date_Echeance;
}());
