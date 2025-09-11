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
class OIS100_Browse_EX97 {
    private miService;
    private controller: IInstanceController;
    private contentElement: IContentElement;
    private $host: JQuery;
    private btnExist: boolean = false;
    DATAGRID_ID = "OIS100_Browse_EX97_datagrid";
    BTNCLOSE_ID = "OIS100_Browse_EX97_btnClose";
    allData: any[] = [];

    constructor(scriptArgs: IScriptArgs) {
        this.controller = scriptArgs.controller;
        if (ScriptUtil.version >= 2.0) {
            this.miService = MIService;
        } else {
            this.miService = MIService.Current;
        }
        this.$host = this.controller.ParentWindow;
        this.contentElement = this.controller.GetContentElement();
    }

    public static Init(args: IScriptArgs) {
        new OIS100_Browse_EX97(args).run();
    }

    private async getAllData(tab: any) {
        const request = new MIRequest();
        request.program = "CMS100MI";
        request.transaction = "LstEX97_CCUCHAO";
        request.record = {
            F_ORCU: this.controller.GetValue("OACUNO"),
            T_ORCU: this.controller.GetValue("OACUNO"),
        };
        try {
            //@ts-ignore
            const response = await this.miService.executeRequestV2(request);
            this.allData = response.items.filter((item: any) => {
                const from = item["CUFDAT"] ? parseInt(item["CUFDAT"]) : 0;
                const to = item["CUTDAT"] ? parseInt(item["CUTDAT"]) : 0;
                const today = parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ''));
                return (from < today) && (to > today);
            });
        } catch (e) {
            console.error("Error");
        }
    }

    private run() {

        // Création de l'observateur
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Élément DOM
                        // Vérifie si un div.modal-content existe à l'intérieur
                        if (node instanceof Element) {
                            const modalContent = node.querySelector("div.modal-content");
                            if (modalContent && (modalContent as HTMLElement).innerText.includes("CCUCHA40")) {
                                this.action(modalContent)
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
    }

    private async action(modalContent: Element) {
        if (this.btnExist) {
            return;
        }

        const menu = modalContent.querySelector('div.modal-body-wrapper #btn-grp .upperButtons')
        const $menu = $(menu as HTMLElement);
        if (document.getElementById('btnShowMore')) {
            return;
        }
        const button = $('<button>', {
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
        })

        const trs = modalContent.querySelectorAll('div.modal-body-wrapper .datagrid-wrapper table tbody tr');
        const tabDelCust = Array.from(trs).map((tr: Element) => {
            return tr.querySelector('td:first-child')?.textContent?.trim() || '';
        })

        await this.getAllData(tabDelCust);


        button.on('click', () => {
            this.showBrowseDialog();
            this.fetchData(modalContent);
        })

        this.btnExist = true;
    }

    private showBrowseDialog(): void {
        const browseDialogContent = $(
            '<div id="' + this.DATAGRID_ID + '" style="height: 500px"></div>'
        );

        const browseDialogButtons = [
            {
                text: "Close",
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

        const titleTxt = "More Information";

        const browseDialogOptions = {
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
            H5ControlUtil.H5Dialog.CreateDialogElement(
                browseDialogContent[0],
                browseDialogOptions
            );
        } else {
            browseDialogContent.inforMessageDialog(browseDialogOptions);
        }
    }

    private async fetchData(modalContent: any) {
        const columns = [
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

        const selectedField = "CUDECU";

        $("#" + this.DATAGRID_ID)
            .datagrid({
                columns: columns,
                data: [],
                filterable: true,
                selectable: "single",
                rowHeight: "small",
                spacerColumn: true,
            })
            .on("selected", async (e: any, args: any) => {
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
                await new Promise(resolve => setTimeout(resolve, 100)); // Wait for the grid to update
                const trs = modalContent.querySelectorAll('div.modal-body-wrapper .datagrid-wrapper table tbody tr');
                let find = false
                for (const tr of trs) {
                    if ((tr as HTMLElement).innerText.includes(args[0].data[selectedField]) && (tr as HTMLElement).innerText.includes(args[0].data['CUGCAC']) && (tr as HTMLElement).innerText.includes(args[0].data['CUINRC'])) {
                        const tmp = (tr as HTMLElement)
                        find = true
                        $(tmp).find('td')[0].click();
                        $('#BTN_L52T23').click();
                        break;
                    }
                }
                if (!find) {
                    for (const tr of trs) {
                        if ((tr as HTMLElement).innerText.includes(args[0].data[selectedField])) {
                            const tmp = (tr as HTMLElement)
                            find = true
                            $(tmp).find('td')[0].click();
                            $('#BTN_L52T23').click();
                            break;
                        }
                    }
                }
            });

        // Utiliser Promise.all pour attendre tous les appels async dans map
        const resInprogress = await Promise.all(this.allData.map(async (e: any) => {
            const req: MIRequest = new MIRequest();
            req.program = "CRS610MI";
            req.transaction = "GetBasicData";
            req.record = {
                CUNO: e["P1PYGR"]
            };
            req.outputFields = ["CUNM"];
            let pycunm = '';
            if (e["P1PYGR"]) {
                try {
                    //@ts-ignore
                    const res = await this.miService.executeRequestV2(req);
                    pycunm = res.items[0]?.CUNM || '';
                } catch { }
            }

            return {
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
            };
        }));

        $("#" + this.DATAGRID_ID)
            .data("datagrid")
            .updateDataset(resInprogress);

        return resInprogress;
    }
}