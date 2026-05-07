/*
    H5Script C07_MWS068B_PrintEtiquette
  * @author: Joel Randrianarivelo
  * @version: 1.0.0
  * @since: 03-03-2025
  * @description: Impression etiquette depuis MWS068
*/
/**
 * CHANGELOGS
 * Version    Date       User        Description
 * 1.0.0   03-03-2025    JOEL        Initial Release
 */

class C07_MWS068B_PrintEtiquette {
    private controller: IInstanceController;
    private miService;
    private grid: IActiveGrid;
    private contentElement: IContentElement;
    private $host: JQuery;
    private POPUP_ID = "pop_mesg";
    private varDEV0 = "";
    private DATAGRID_ID = "pop_datagrid";
    private BTNCLOSE_ID = "ppopup_close";

    constructor(scriptArgs: IScriptArgs) {
        this.controller = scriptArgs.controller;
        this.grid = this.controller.GetGrid();
        this.contentElement = this.controller.GetContentElement();
        this.$host = this.controller.ParentWindow;
        if (ScriptUtil.version >= 2.0) {
            this.miService = MIService;
        } else {
            this.miService = MIService.Current;
        }
    }

    public static Init(args: IScriptArgs) {
        new C07_MWS068B_PrintEtiquette(args).run();
    }

    private run() {
        console.info("1.0.0   03-03-2025    JOEL        Initial Release");

        //récupération des colonnes du grid
        const columns = this.grid.getColumns();
        const columnNames = columns.map((column) => column.name);

        //Ajouter le bouton Envoyer Bon Transport
        this.addBtn();

        this.$host.find("#BtnPrintPackage").on("click", async (e: Event) => {
            e.preventDefault();

            //Verification de la vue
            if (
                !columnNames.includes("CAMU") ||
                !columnNames.includes("ITNO") ||
                !columnNames.includes("WHSL") ||
                !columnNames.includes("WHLO") ||
                !columnNames.includes("BANO") ||
                !columnNames.includes("STAS")
            ) {
                this.showMessage(
                    `Les colonnes ITNO, CAMU, WHSL, WHLO, BANO et STAS sont obligatoires dans la vue`,
                    "warning"
                );
                return;
            }

            //Affichage du popup d'impression
            this.showPopup();
        });
    }

    private async runConfirm(modal: any, model: any) {
        if (this.varDEV0.trim() == '') {
            this.showMessage('Veuillez choisir une imprimante', 'warning')
            return
        }


        //Récupération de la ligne selectionnée
        const selectedRows = this.grid.getSelectedGridRows()[0].data;
        if (!selectedRows) return;

        // if (selectedRows['MLSTAS'].trim()!='2'){
        //     this.showMessage('Impression disponible que pour les status approvés', 'warning')
        //     return
        // }

        if (selectedRows['MLCAMU'] && selectedRows['MLCAMU'].trim() != '' && selectedRows['MLCAMU'].trim() != '*') {
            const request = new MIRequest();
            request.program = "MMS470MI";
            request.transaction = "PrintPackage";
            request.record = {
                PANR: selectedRows['MLCAMU'],
                DEV0: this.varDEV0
            }
            try {
                //@ts-ignore
                const res = await this.miService.executeRequestV2(request);
                if (res.errorCode) {
                    this.showMessage(res.errorMessage, 'error');
                    return;
                }

                this.showMessage('Impression réussi', 'success');
            } catch {
                this.showMessage('Erreur lors de l\'impression', 'error');
            }
            if (ScriptUtil.version >= 2.0) {
                model.close(true);
            } else {
                $(modal).inforDialog("close");
            }
            return;
        } else if (
            selectedRows['MLWHLO'] && selectedRows['MLWHLO'].trim() != '' && selectedRows['MLWHLO'].trim() != '*' &&
            selectedRows['MLITNO'] && selectedRows['MLITNO'].trim() != '' && selectedRows['MLITNO'].trim() != '*' &&
            selectedRows['MLWHSL'] && selectedRows['MLWHSL'].trim() != '' && selectedRows['MLWHSL'].trim() != '*' &&
            selectedRows['MLBANO'] && selectedRows['MLBANO'].trim() != '' && selectedRows['MLBANO'].trim() != '*'
        ) {
            const request = new MIRequest();
            request.program = "MMS060MI";
            request.transaction = "PrtPutAwayLbl";
            request.record = {
                WHLO: selectedRows['MLWHLO'],
                ITNO: selectedRows['MLITNO'],
                WHSL: selectedRows['MLWHSL'],
                BANO: selectedRows['MLBANO'],
                DEV0: this.varDEV0
            }
            try {
                //@ts-ignore
                const res = await this.miService.executeRequestV2(request);
                if (res.errorCode) {
                    this.showMessage(res.errorMessage, 'error');
                    return;
                }
                this.showMessage('Impression réussi', 'success');
            } catch {
                this.showMessage('Erreur lors de l\'impression', 'error');
            }
            if (ScriptUtil.version >= 2.0) {
                model.close(true);
            } else {
                $(modal).inforDialog("close");
            }
            return;
        }

        this.showMessage('Impossible d\'imprimer l\'étiquette avec une information vide ou *', 'error');


        if (ScriptUtil.version >= 2.0) {
            model.close(true);
        } else {
            $(modal).inforDialog("close");
        }
    }

    private addBtn(): void {
        const btnSequencer = new ButtonElement();
        btnSequencer.Name = "BtnPrintPackage";
        btnSequencer.Value = "Imprimer étiquette";
        btnSequencer.Position = new PositionElement();
        btnSequencer.Position.Top = 4;
        btnSequencer.Position.Left = 69;
        btnSequencer.Position.Width = 10;
        this.contentElement.AddElement(btnSequencer);
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

    private showPopup() {
        const _this = this;
        const popupContent = $(
            `<div id="${this.POPUP_ID}" style="height:100px">
                </div>`
        );

        const popupButtons = [
            {
                text: "Annuler",
                width: 85,
                id: "ppopup_close",
                click: function (event: Event, model: any) {
                    if (ScriptUtil.version >= 2.0) {
                        model.close(true);
                    } else {
                        $(this).inforDialog("close");
                    }
                },
            },
            {
                text: "Confirmer",
                width: 85,
                id: "ppopup_confirm",
                click: function (event: Event, model: any) {
                    //confirm action
                    _this.runConfirm(this, model);
                },
            },
        ];

        const titleTxt = "Impression étiquette";

        const popupOptions = {
            title: titleTxt,
            dialogType: "General",
            modal: true,
            width: 300,
            minHeight: 200,
            //icon: 'search',
            closeOnEscape: true,
            buttons: popupButtons,
        };

        if (ScriptUtil.version >= 2.0) {
            H5ControlUtil.H5Dialog.CreateDialogElement(popupContent[0], popupOptions);
        } else {
            popupContent.inforMessageDialog(popupOptions);
        }

        this.createChamp(popupContent);
    }

    private createChamp(container: JQuery) {
        container.append(`
                <div style="display:flex;flex-direction:column" id="inputContainer">
                    <span><p>Imprimante : </p><input type="text" id="inputDEV" value="${this.varDEV0}" style="width: 150px"/></span>
                </div>
            `);
        this.makeBrowserable("inputDEV");
    }

    private makeBrowserable(browseField: string) {
        $(
            '<span class="trigger h5-lookup-trigger">\n                <span class="h5-lookup-icon-container" style="height: 38px; display: flex; align-items: center;">\n                    <svg soho-icon="" class="h5-lookup-icon top-auto icon"\n                        aria-hidden="false" focusable="false" role="presentation">\n                        <use href="#icon-search-list-mod"></use>\n                    </svg>\n                </span>\n            </span>'
        )
            .insertAfter($("#" + browseField))
            .css({
                "min-width": "14px",
                width: "14px",
                height: "100%",
                "margin-top": "0!important",
                "margin-left": "0!important",
                "margin-right": "0!important",
                left: "300px",
                //right: "3px",
                position: "absolute",
                cursor: "pointer",
            })
            .click(() => {
                this.showBrowseDialog();
                this.fetchPrinter();
            });

        const style =
            $("#" + browseField).attr("style") + "padding-right: 18px !important";

        //ajout F4 listener
        $("#" + browseField)
            .attr("style", style)
            .keydown((e: KeyboardEvent) => {
                if (e.which === 115) {
                    this.showBrowseDialog();
                    this.fetchPrinter();
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
    }

    private showBrowseDialog() {
        const browseDialogContent = $(
            '<div id="' + this.DATAGRID_ID + '" style="height: 350px"></div>'
        );

        const browseDialogButtons = [
            {
                text: "Fermer",
                width: 85,
                id: this.BTNCLOSE_ID,
                click: function (event: any, model: any) {
                    if (ScriptUtil.version >= 2.0) {
                        model.close(true);
                    } else {
                        $(this).inforDialog("close");
                    }
                },
            },
        ];

        const titleTxt = "Imprimantes";

        const browseDialogOptions = {
            title: titleTxt,
            dialogType: "General",
            modal: true,
            width: 500,
            minHeight: 300,
            //icon: 'search',
            closeOnEscape: true,
            buttons: browseDialogButtons,
        };

        if (ScriptUtil.version >= 2.0) {
            H5ControlUtil.H5Dialog.CreateDialogElement(
                browseDialogContent[0],
                browseDialogOptions
            );
        } else {
            browseDialogContent.inforMessageDialog(browseDialogOptions);
        }
    }

    private async fetchPrinter() {
        const columns = [
            { id: "DEV1", field: "DEV1", name: "Imprimante", filterType: "text" }
        ];

        const selectedField = "DEV1";

        $("#" + this.DATAGRID_ID)
            .datagrid({
                columns: columns,
                data: [],
                filterable: true,
                selectable: "single",
                rowHeight: "small",
                spacerColumn: true,
            })
            .on("selected", (e: any, args: any) => {
                $("#inputDEV").ready(() => {
                    $("#inputDEV").val(args[0].data[selectedField]).focus();
                    this.varDEV0 = args[0].data[selectedField];
                    ScriptUtil.version >= 2.0
                        ? $("#" + this.BTNCLOSE_ID).click()
                        : $(this).inforDialog("close");
                });
            });

        const request = new MIRequest();
        request.program = "MNS205MI";
        request.transaction = "Lst";
        request.record = {
            PRTF: 'ETIQUETTE',
            MEDC: '*PRT'
        };
        request.outputFields = ["DEV1", "PRFT", "USID"];
        try {
            //@ts-ignore
            const response = await this.miService.executeRequestV2(request);
            const { items } = response;
            const resultat = items.map((item: any) => {
                return {
                    DEV1: item["DEV1"],
                    USID: item["USID"]
                };
            });
            const filtred = resultat.filter((i: any) => i.USID === ScriptUtil.GetUserContext('USID'));
            const notFilterd = resultat.filter((i: any) => !i.USID);

            if (filtred.length > 0) {
                $("#" + this.DATAGRID_ID)
                    .data("datagrid")
                    .updateDataset(filtred);
            } else {
                $("#" + this.DATAGRID_ID)
                    .data("datagrid")
                    .updateDataset(notFilterd);
            }

        } catch (e: any) {
            console.error("Error on fetching printer");
        }
    }
}
