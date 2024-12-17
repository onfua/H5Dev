"use strict";
/*
    H5Script ARS191_Date_Echeance
  * @author: Joel Randrianarivelo
  * @version: 1.0.0
  * @since: 2024-10-28
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
var ARS191_Date_Echeance = /** @class */ (function () {
    function ARS191_Date_Echeance(scriptArgs) {
        this.argument = scriptArgs.args;
        this.controller = scriptArgs.controller;
        this.contentElement = this.controller.GetContentElement();
        this.$host = this.controller.ParentWindow;
        this.CONO = ScriptUtil.GetUserContext().CONO;
        this.DIVI = ScriptUtil.GetUserContext().DIVI;
        this.POPUP_ID = "popup_alert_ars191";
        this.gris = false;
        if (ScriptUtil.version >= 2.0) {
            this.miService = MIService;
        }
        else {
            this.miService = MIService.Current;
        }
    }
    ARS191_Date_Echeance.Init = function (args) {
        new ARS191_Date_Echeance(args).run();
    };
    ARS191_Date_Echeance.prototype.addBtn = function () {
        var btnSequencer = new ButtonElement();
        btnSequencer.Name = "BtnPreNext";
        btnSequencer.Value = "FIGER DATE D'ECHEANCE";
        btnSequencer.Position = new PositionElement();
        btnSequencer.Position.Top = 4;
        btnSequencer.Position.Left = 69;
        btnSequencer.Position.Width = 10;
        this.contentElement.AddElement(btnSequencer);
    };
    ARS191_Date_Echeance.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.gris = false;
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                setTimeout(function () {
                                    resolve("");
                                }, 1000);
                            })];
                    case 1:
                        _a.sent();
                        this.$host.find("#WWLITX").val("");
                        this.$host.find("#WTDUDT").val("");
                        this.validated();
                        this.$host.find("#WFPYCD").ready(function () {
                            _this.$host.find("#WFPYCD").on("change", function () {
                                _this.validated();
                            });
                        });
                        this.$host.find("#WTPYCD").ready(function () {
                            _this.$host.find("#WTPYCD").on("change", function () {
                                _this.validated();
                            });
                        });
                        this.$host.find("#WEUPCD").ready(function () {
                            _this.$host.find("#WEUPCD").on("change", function () {
                                //@ts-ignore
                                _this.contentElement.RemoveScriptComponents();
                                if (_this.$host.find("#WFPYCD").val() == "LCR" &&
                                    _this.$host.find("#WTPYCD").val() == "LCR" &&
                                    !_this.$host.find("#WEUPCD").prop("checked")) {
                                    _this.action();
                                }
                                else {
                                    _this.$host.find("#btn-next").removeAttr("disabled");
                                    _this.$host.find("#WWLITX").removeAttr("disabled");
                                    _this.$host.find("#WWLITX").val("");
                                    _this.$host.find("#WWLITX").css({ "pointer-events": "auto" });
                                    _this.gris = false;
                                }
                            });
                        });
                        this.$host.find("#WTDUDT").ready(function () {
                            _this.$host.find("#WTDUDT").on("change", function () { return __awaiter(_this, void 0, void 0, function () {
                                var tmp_1;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    if (this.gris) {
                                        tmp_1 = this.$host.find("#WWLITX").val();
                                        this.$host.find("#WTDUDT").ready(function () {
                                            var obj;
                                            var tp = _this.$host.find("#WTDUDT")[0];
                                            for (var _i = 0, _a = Object.keys(tp); _i < _a.length; _i++) {
                                                var key = _a[_i];
                                                //@ts-ignore
                                                if (tp[key].datepicker) {
                                                    //@ts-ignore
                                                    obj = tp[key].datepicker;
                                                    break;
                                                }
                                            }
                                            if (obj && obj.currentDay) {
                                                var date = "".concat(obj.currentYear, "/").concat((obj.currentMonth + 1 + "")
                                                    //@ts-ignore
                                                    .padStart(2, "0"), "/").concat((obj.currentDay + "").padStart(2, "0"));
                                                var res = tmp_1.split("||ECH:")[0] + "||ECH:" + date;
                                                _this.$host.find("#WWLITX").val(res);
                                            }
                                            else {
                                                _this.showPopupText("Mettez une date d'echéance", "warning");
                                            }
                                        });
                                    }
                                    return [2 /*return*/];
                                });
                            }); });
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    ARS191_Date_Echeance.prototype.validated = function () {
        //@ts-ignore
        this.contentElement.RemoveScriptComponents();
        if (this.$host.find("#WFPYCD").val() == "LCR" &&
            this.$host.find("#WTPYCD").val() == "LCR" &&
            this.$host.find("#WEUPCD").prop("checked")) {
            this.action();
        }
        else {
            this.$host.find("#btn-next").removeAttr("disabled");
            this.$host.find("#WWLITX").removeAttr("disabled");
            this.$host.find("#WWLITX").css({ "pointer-events": "auto" });
            this.$host.find("#WWLITX").val("");
            this.gris = false;
        }
    };
    ARS191_Date_Echeance.prototype.action = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                /*const req = new MIRequest()
                req.program = 'MNS150MI'
                req.transaction = 'GetUserData'
                req.outputFields = ['DTFM','USID']
                let dtfm = ''
                try{
                  //@ts-ignore
                  const res = await this.miService.executeRequestV2(req)
                  dtfm = res.item['DTFM']
                  if (dtfm == 'YMD') {
                    this.showPopupText(
                      "Si vous saisissez la date d'echéance manuellement, veuillez mettre dans le format aa/mm/jj",
                      "warning"
                    );
                  }
                  if (dtfm == 'DMY') {
                    this.showPopupText(
                      "Si vous saisissez la date d'echéance manuellement, veuillez mettre dans le format jj/mm/yy",
                      "warning"
                    );
                  }
                  if (dtfm == 'MDY') {
                    this.showPopupText(
                      "Si vous saisissez la date d'echéance manuellement, veuillez mettre dans le format mm/jj/yy",
                      "warning"
                    );
                  }
                }catch(e){
                  console.error(e)
                }*/
                this.$host.find("#btn-next").attr("disabled", "true");
                this.addBtn();
                this.$host.find("#BtnPreNext").ready(function () {
                    _this.$host.find("#BtnPreNext").click(function (e) {
                        e.preventDefault();
                        _this.$host.find("#WWLITX").ready(function () {
                            /*if (!this.$host.find('#WWLITX').val().includes('||ECH:')){
                              this.$host.find('#WWLITX').val(`${this.$host.find('#WWLITX').val()}||ECH:${this.$host.find('#WTDUDT').val()}`)
                            }*/
                            var tmp = _this.$host.find("#WWLITX").val();
                            _this.$host.find("#WTDUDT").ready(function () {
                                var obj;
                                var tp = _this.$host.find("#WTDUDT")[0];
                                for (var _i = 0, _a = Object.keys(tp); _i < _a.length; _i++) {
                                    var key = _a[_i];
                                    //@ts-ignore
                                    if (tp[key].datepicker) {
                                        //@ts-ignore
                                        obj = tp[key].datepicker;
                                        break;
                                    }
                                }
                                if (obj && obj.currentDay) {
                                    var date = "".concat(obj.currentYear, "/").concat((obj.currentMonth + 1 + "")
                                        //@ts-ignore
                                        .padStart(2, "0"), "/").concat((obj.currentDay + "").padStart(2, "0"));
                                    var res = tmp.split("||ECH:")[0] + "||ECH:" + date;
                                    _this.$host.find("#WWLITX").val(res);
                                    _this.$host.find("#WWLITX").attr("disabled", "true");
                                    _this.gris = true;
                                    _this.$host.find("#WWLITX").css({ "pointer-events": "none" });
                                    _this.$host.find("#btn-next").removeAttr("disabled");
                                    _this.$host.find("#BtnPreNext").ready(function () {
                                        _this.$host.find("#BtnPreNext").attr("disabled", "true");
                                    });
                                }
                                else {
                                    _this.showPopupText("Mettez une date d'echéance", "warning");
                                }
                            });
                        });
                    });
                });
                return [2 /*return*/];
            });
        });
    };
    ARS191_Date_Echeance.prototype.showPopupText = function (message, type) {
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
    return ARS191_Date_Echeance;
}());
