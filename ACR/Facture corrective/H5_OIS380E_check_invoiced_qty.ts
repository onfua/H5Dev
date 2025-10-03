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

class H5_OIS380E_check_invoiced_qty {
    private controller: IInstanceController;
    private unsubscribeRequesting: any;
    private unsubscribeRequested: any;
    private POPUP_ID = 'pop_mesg'

    constructor(scriptArgs: IScriptArgs) {
        this.controller = scriptArgs.controller;
    }

    public static Init(args: IScriptArgs) {
        new H5_OIS380E_check_invoiced_qty(args).run();
    }

    private run() {
        this.unsubscribeRequesting = this.controller.Requesting.On((e: any) => {
            this.onRequesting(e);
        });
        this.unsubscribeRequested = this.controller.Requested.On((e: any) => {
            this.onRequested(e);
        });
    }

    private onRequesting(args: CancelRequestEventArgs): void {
        //action when F16 is pressed or Approve is clicked
        if (args.commandType === "KEY" && args.commandValue === "F16") {
            //get the variable correctiveMtd from session variable
            const correctiveMtd = SessionCache.Get('correctiveMtd') as string;

            const invQty = (this.controller.GetValue('WXIVQT').trim().length == 0?'0':this.controller.GetValue('WXIVQT').trim()) as number;

            if (correctiveMtd === '1') {
                //check if the invoiced qty is not 0 -> block the request
                if (invQty != 0) {
                    this.showMessage(`La quantité facturée doit être 0 si la méthode corrective est 1`,`error`);
                    args.cancel = true;
                }else{
                    return; //allow the request
                }
            }else if (correctiveMtd === '2') {
                //check if the invoiced qty is 0 -> block the request
                if (invQty == 0) {
                    this.showMessage(`La quantité facturée ne doit pas être 0 si la méthode corrective est 2`,`error`);
                    args.cancel = true;
                }else{
                    return; //allow the request
                }
            }
        }
    }


    private onRequested(args: RequestEventArgs): void {
        this.unsubscribeRequested();
        this.unsubscribeRequesting();
    }

    private showMessage(message: string, type: string) {
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
                    click: function (event: any, model: any) {
                        if (ScriptUtil.version >= 2.0) {
                            model.close(true);
                        } else {
                            $(this).inforDialog("close");
                        }
                    },
                },
            ],
        };

        if (ScriptUtil.version >= 2.0) {
            H5ControlUtil.H5Dialog.CreateDialogElement(popupElement, popupOptions);
        } else {
            $(popupElement).inforMessageDialog(popupOptions);
        }
    }
}