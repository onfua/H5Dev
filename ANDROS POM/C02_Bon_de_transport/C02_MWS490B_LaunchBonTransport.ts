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

class C02_MWS490B_LaunchBonTransport {
    private controller: IInstanceController;
    private miService;
    private grid: IActiveGrid;
    private contentElement: IContentElement;
    private $host: JQuery
    private POPUP_ID = 'pop_mesg'

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
        new C02_MWS490B_LaunchBonTransport(args).run();
    }

    private run() {
        console.info('1.0.0   28-02-2025    JOEL        Initial Release')

        //récupération des colonnes du grid
        const columns = this.grid.getColumns();


        //Existence des colonnes RIDN, RORC et FWNO
        const columnNames = columns.map(column => column.name);
        //if (!columnNames.includes('RIDN') || !columnNames.includes('RORC') || !columnNames.includes('FWNO')) return;

        //Ajouter le bouton Envoyer Bon Transport
        this.addBtn()

        this.$host.find('#BtnSend').on('click', async (e: Event) => {
            e.preventDefault()

            //Récupération de la ligne selectionnée
            const selectedRows = this.grid.getSelectedGridRows()[0].data
            if (!selectedRows) return;

            if (!columnNames.includes('RIDN') || !columnNames.includes('RORC') || !columnNames.includes('FWNO')) {
                this.showMessage(`Les colonnes Ordre et Transitaire sont obligatoires dans la vue`,'warning')
                return;
            }
            if (selectedRows['OQRORC'] != '2') {
                this.showMessage(`L'edition ne fonctionne que pour des OAs`,'warning')
                return;
            }
            if (!selectedRows['OQFWNO']) {
                this.showMessage(`Transitaire est obligatoire`,'warning')
                return;
            }

            //Tester si E-mail transitaire existe dans CRS111MI
            const crs111miReq = new MIRequest()
            crs111miReq.program = 'CRS111MI'
            crs111miReq.transaction = 'Get'
            crs111miReq.record = {
                EMTP: '02',
                EMKY: selectedRows['OQFWNO']
            }
            crs111miReq.outputFields = ['EMAL']

            let emal: string = ''
            try {
                //@ts-ignore
                const res = await this.miService.executeRequestV2(crs111miReq)

                if (res.items.length > 0) {
                    emal = res.items[0].EMAL
                } else {
                    this.showMessage(`E-mail transitaire n'existe pas en CRS111`,'error')
                    return;
                }
            } catch {
                this.showMessage(`E-mail transitaire n'existe pas en CRS111`,'error')
                return;
            }


            //Soumettre le rapport Ad Hoc
            const ahs150miReq = new MIRequest()
            ahs150miReq.program = 'AHS150MI'
            ahs150miReq.transaction = 'Submit'
            ahs150miReq.record = {
                REPO: 'TRANSPORT',
                REPV: '&BON_TRANSPORT',
                EMAL: emal,
                OBK1: selectedRows['OQRIDN'],
                REEM: '4'
            }
            try {
                //@ts-ignore
                await this.miService.executeRequestV2(ahs150miReq)
                this.showMessage(`Edition envoyée avec succès`,'success')
            } catch {
                this.showMessage(`Edition non envoyée`,'error')
                return;
            }


        })
    }

    private addBtn(): void {
        const btnSequencer = new ButtonElement();
        btnSequencer.Name = "BtnSend";
        btnSequencer.Value = "Envoyer Bon Transport";
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
}