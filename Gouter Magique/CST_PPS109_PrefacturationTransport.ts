/*
    H5Script CST_PPS109_PrefacturationTransport
  * @author: Joel Randrianarivelo
  * @version: 1.0.0
  * @since: 2025-06-18
  * @description: Ajout de la colonne Taux forfaitaire dans la grille de l'ecran PPS109
*/
/**
 * CHANGELOGS
 * Version    Date       User        Description
 * 1.0.0   18-06-2025    JOEL        Initial Release
 * 1.0.1   23-07-2025    JOEL        Gestion de format de date par utilisateur
 */

class CST_PPS109_PrefacturationTransport {
    private miService;
    private controller: IInstanceController;
    private contentElement: IContentElement;
    private $host: JQuery;
    private taux: any = [];
    private mode: string;
    private dateFormat: string;

    constructor(scriptArgs: IScriptArgs) {
        this.controller = scriptArgs.controller;
        this.contentElement = this.controller.GetContentElement();
        this.$host = this.controller.ParentWindow;
        if (ScriptUtil.version >= 2.0) {
            this.miService = MIService;
        } else {
            this.miService = MIService.Current;
        }
        this.mode = this.controller.GetMode();
        this.dateFormat = 'YMD';
    }

    public static Init(args: IScriptArgs) {
        new CST_PPS109_PrefacturationTransport(args).run();
    }

    private async run() {
        //@ts-ignore
        this.controller.ShowBusyIndicator();
        const list = ListControl.ListView.GetDatagrid(this.controller);

        //recuparation du format de date de l'utilisateur
        try {
            this.dateFormat = await this.getDateFormat();
        } catch{}

        //Ajout de la colonne Taux Forfaitaire
        const customColumnNum = list.getColumns().length + 1;
        this.appendColumn(list, customColumnNum);

        //Recupération des données pour la colonne Taux Forfaitaire et contenus du tableau
        try {
            this.taux = await this.getAllTauxForfaitaire()
        } catch {
            //@ts-ignore
            this.controller.HideBusyIndicator();
        }

        const contents = list.getData().filter((item: any) => item.WSFRQT || item.WSFRRA);

        //Gérer la nouvelle colonne Taux Forfaitaire par rapport aux données du tableau
        const len = ScriptUtil.version >= 2.0 ? contents.length : contents.getLength();
        try {
            await this.manageTaux(list, len);
        } catch {
            //@ts-ignore
            this.controller.HideBusyIndicator();
        }

        if (this.mode == '2') {
            //Observateur du changement dans la colonne Taux Forfaitaire
            const observateur = new MutationObserver( async (mutationsList: any) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'characterData' || mutation.type === 'childList') {
                        if (mutation.target.tagName == 'SPAN' && mutation.removedNodes.length > 0) {
                            //@ts-ignore
                            this.controller.ShowBusyIndicator();
                            const columnId = 'TFOF';
                            const dataset: any[] = list.getData();

                            const suno = this.$host.find("#WESUNO").val() ? this.$host.find("#WESUNO").val() : "";
                            const agnb = this.$host.find("#WEAGNB").val() ? this.$host.find("#WEAGNB").val() : "";
                            const rafd = this.$host.find("#WERAFD").val() ? this.getDateFormatted(this.$host.find("#WERAFD").val()) : "";
                            const rbv1 = this.$host.find("#WERBV1").val() ? this.$host.find("#WERBV1").val() : "";
                            const rbv2 = this.$host.find("#WERBV2").val() ? this.$host.find("#WERBV2").val() : "";
                            for (let i = 0; i < len; i++) {
                                //@ts-ignore
                                const cell = list.getCellElement(i, columnId) as HTMLElement;
                                const value = cell.querySelector('span')?.innerText
                                if (!value?.trim()) continue;
                                const data = dataset[i];
                                const tfValue = value.trim() === 'OUI' ? '1' : '0';
                                const req = new MIRequest();
                                req.program = "EXT109MI";
                                req.transaction = 'AddOrUpdForfait';
                                req.record = {
                                    SUNO: suno,
                                    AGNB: agnb,
                                    RAFD: rafd,
                                    RBV1: rbv1,
                                    RBV2: rbv2,
                                    FRQT: parseFloat(data.WSFRQT?.replace(',', '.') || '0'),
                                    FRRA: parseFloat(data.WSFRRA?.replace(',', '.') || '0'),
                                    TFOF: tfValue // 1 pour OUI, 0 pour NON
                                };
                                try {
                                    //@ts-ignore
                                    await this.miService.executeRequestV2(req);
                                } catch (e) {
                                    console.error(e);
                                }
                                //@ts-ignore
                                this.controller.HideBusyIndicator();
                            }
                            break;
                        }
                    }
                }
            })

            for (let i = 0; i < len; i++) {
                const columnId = 'TFOF';
                //@ts-ignore
                const cell = list.getCellElement(i, columnId) as HTMLElement;
                observateur.observe(cell, {
                    childList: true,
                    subtree: true,
                    characterData: true
                });
            }
        }

        //@ts-ignore
        this.controller.HideBusyIndicator();

        // console.log(list.getColumns())
        // console.log(contents)
    }

    private appendColumn(list: IActiveGrid, columnNum: number) {
        // const columnId = "C" + columnNum;
        let columns = list.getColumns();
        let newColumn = {
            id: 'TFOF',
            field: 'TFOF',
            name: "Taux Forfaitaire",
            width: 100,
            isEditable: true,
        }
        if (columns.length < columnNum) {
            columns.push(newColumn);
        }
        list.setColumns(columns);
        if (this.mode == '2') {
            const fields = [{
                name: 'TFOF', columnType: "DROPDOWN", isEditable: true, isEnabled: true, valueMap: [
                    {
                        value: 'OUI',
                        label: 'OUI'
                    },
                    {
                        value: 'NON',
                        label: 'NON'
                    }
                ]
            }];


            //@ts-ignore
            list.setColumnsFormat(fields);
        }

    }

    private async getAllTauxForfaitaire() {
        const suno = this.$host.find("#WESUNO").val() ? this.$host.find("#WESUNO").val() : "";
        const agnb = this.$host.find("#WEAGNB").val() ? this.$host.find("#WEAGNB").val() : "";
        const rafd = this.$host.find("#WERAFD").val() ? this.getDateFormatted(this.$host.find("#WERAFD").val()) : "";
        const rbv1 = this.$host.find("#WERBV1").val() ? this.$host.find("#WERBV1").val() : "";
        const rbv2 = this.$host.find("#WERBV2").val() ? this.$host.find("#WERBV2").val() : "";

        const req = new MIRequest();
        req.program = "CUSEXTMI";
        req.transaction = 'LstAlphaKPI';
        req.record = {
            KPID: 'MPAGRF',
            PK01: suno,
            PK02: agnb,
            PK03: rafd,
            PK04: rbv1,
            PK05: rbv2
        }

        try {
            //@ts-ignore
            const res = await this.miService.executeRequestV2(req);
            // console.log(res.items)
            return res.items
        } catch {
            return [];
        }
    }

    private async manageTaux(list: IActiveGrid, len: number) {
        const columnId = 'TFOF';
        const dataset: any[] = list.getData();
        // const suno = this.$host.find("#WESUNO").val() ? this.$host.find("#WESUNO").val() : "";
        // const agnb = this.$host.find("#WEAGNB").val() ? this.$host.find("#WEAGNB").val() : "";
        // const rafd = this.$host.find("#WERAFD").val() ? `20${this.$host.find("#WERAFD").val().substring(0, 2)}${this.$host.find("#WERAFD").val().substring(3, 5)}${this.$host.find("#WERAFD").val().substring(6, 8)}` : "";
        // const rbv1 = this.$host.find("#WERBV1").val() ? this.$host.find("#WERBV1").val() : "";
        // const rbv2 = this.$host.find("#WERBV2").val() ? this.$host.find("#WERBV2").val() : "";
        for (let i = 0; i < len; i++) {
            const data = dataset[i];
            const taux = this.taux.find((item: any) => parseFloat(item.PK06?.replace(',', '.') || '0') == parseFloat(data.WSFRQT?.replace(',', '.') || 0) && parseFloat(item.PK07?.replace(',', '.') || '0') == parseFloat(data.WSFRRA?.replace(',', '.') || '0'));
            if (taux) {
                data[columnId] = taux.AL30 == '1' ? 'OUI' : 'NON';
            } else {
                data[columnId] = 'NON';
                // const req = new MIRequest();
                // req.program = "CUSEXTMI";
                // req.transaction = 'AddAlphaKPI';
                // req.record = {
                //     KPID: 'MPAGRF',
                //     PK01: suno,
                //     PK02: agnb,
                //     PK03: rafd,
                //     PK04: rbv1,
                //     PK05: rbv2,
                //     PK06: data.WSFRQT,
                //     PK07: data.WSFRRA,
                //     AL30: 'NON'
                // }
                // try {
                //     //@ts-ignore
                //     await this.miService.executeRequestV2(req);
                // } catch (e) {
                //     console.error(e);
                // }
            }
        }
        list.setData(dataset);
    }

    private async getDateFormat() {
        const req = new MIRequest();
        req.program = "MNS150MI";
        req.transaction = "GetUserData";
        try {
            //@ts-ignore
            const res = await this.miService.executeRequestV2(req);
            return res.item["DTFM"];
        } catch (e) {
            console.error(e);
            return 'YMD'; // Default format if error occurs
        }
    }

    private getDateFormatted(date: string) {
        if (!date) return '';
        if (this.dateFormat === 'YMD') {
            return `20${date.substring(0, 2)}${date.substring(3, 5)}${date.substring(6, 8)}`;
        } else if (this.dateFormat === 'DMY') {
            return `20${date.substring(6, 8)}${date.substring(3, 5)}${date.substring(0, 2)}`;
        } else { //MDY
            return `20${date.substring(6, 8)}${date.substring(0, 2)}${date.substring(3, 5)}`; // Default case, return as is
        }
    }
}
