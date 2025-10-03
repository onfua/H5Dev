"use strict";
/*
    H5Script H5_OIS380E_check_invoiced_qty
  * @author: Joel Randrianarivelo
  * @version: 1.0.0
  * @since: 03-10-2025
  * @description: Get the corrective method and stock in session variable
*/
/**
 * CHANGELOGS
 * Version    Date       User        Description
 * 1.0.0   03-10-2025    JOEL        Initial Release
 */
var H5_OIS380E_check_invoiced_qty = /** @class */ (function () {
    function H5_OIS380E_check_invoiced_qty(scriptArgs) {
        this.POPUP_ID = 'pop_mesg';
        this.controller = scriptArgs.controller;
    }
    H5_OIS380E_check_invoiced_qty.Init = function (args) {
        new H5_OIS380E_check_invoiced_qty(args).run();
    };
    H5_OIS380E_check_invoiced_qty.prototype.run = function () {
        var _this = this;
        this.unsubscribeRequesting = this.controller.Requesting.On(function (e) {
            _this.onRequesting(e);
        });
        this.unsubscribeRequested = this.controller.Requested.On(function (e) {
            _this.onRequested(e);
        });
    };
    H5_OIS380E_check_invoiced_qty.prototype.onRequesting = function (args) {
        //action when F16 is pressed or Approve is clicked
        if (args.commandType === "KEY" && args.commandValue === "F16") {
            //get the variable correctiveMtd from session variable
            var correctiveMtd = SessionCache.Get('correctiveMtd');
            var invQty = (this.controller.GetValue('WXIVQT').trim().length == 0 ? '0' : this.controller.GetValue('WXIVQT').trim());
            if (correctiveMtd === '1') {
                //check if the invoiced qty is not 0 -> block the request
                if (invQty != 0) {
                    this.showMessage("La quantit\u00E9 factur\u00E9e doit \u00EAtre 0 si la m\u00E9thode corrective est 1", "error");
                    args.cancel = true;
                }
                else {
                    return; //allow the request
                }
            }
            else if (correctiveMtd === '2') {
                //check if the invoiced qty is 0 -> block the request
                if (invQty == 0) {
                    this.showMessage("La quantit\u00E9 factur\u00E9e ne doit pas \u00EAtre 0 si la m\u00E9thode corrective est 2", "error");
                    args.cancel = true;
                }
                else {
                    return; //allow the request
                }
            }
        }
    };
    H5_OIS380E_check_invoiced_qty.prototype.onRequested = function (args) {
        this.unsubscribeRequested();
        this.unsubscribeRequesting();
    };
    H5_OIS380E_check_invoiced_qty.prototype.showMessage = function (message, type) {
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
    return H5_OIS380E_check_invoiced_qty;
}());
