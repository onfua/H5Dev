/*
    H5Script C04_PMS230B_ConvertBatchOfAll
  * @author: Joel Randrianarivelo
  * @version: 1.0.0
  * @since: 2025-03-28
  * @description: Calcul de la somme des quantités des OA dans PMS230
*/
/**
 * CHANGELOGS
 * Version    Date       User        Description
 * 1.0.0   28-03-2025    JOEL        Initial Release
 * 1.0.1   14-04-2025    JOEL        Ajout de la gestion des structures alternatives
 */

class C04_PMS230B_ConvertBatchOfAll {
    private argument: string;
    private FACI: string;
    private miService;
    private controller: IInstanceController;
    private contentElement: IContentElement;
    private grid: IActiveGrid;
    private $host: JQuery;

    constructor(scriptArgs: IScriptArgs) {
        this.argument = scriptArgs.args;
        this.controller = scriptArgs.controller;
        this.contentElement = this.controller.GetContentElement();
        this.FACI = ScriptUtil.GetUserContext().FACI;
        this.grid = this.controller.GetGrid();
        this.$host = this.controller.ParentWindow;
        if (ScriptUtil.version >= 2.0) {
            this.miService = MIService;
        } else {
            this.miService = MIService.Current;
        }
    }

    public static Init(args: IScriptArgs) {
        new C04_PMS230B_ConvertBatchOfAll(args).run();
    }

    private addBtn(): void {
        const btnSequencer = new ButtonElement();
        btnSequencer.Name = "BtnCalculerBatchAll";
        btnSequencer.Value = "Recalcul Batch";
        btnSequencer.Position = new PositionElement();
        btnSequencer.Position.Top = 5;
        btnSequencer.Position.Left = 25;
        btnSequencer.Position.Width = 15;
        this.contentElement.AddElement(btnSequencer);
    }

    private run() {
        const argument = this.argument.split(",");
        const tabFACI: any = argument[0].split("/");
        const tabORTY: any = argument[1].split("/");
        console.info('1.0.0   28-03-2025    JOEL        Initial Release')
        this.addBtn();
        this.$host.find("#BtnCalculerBatchAll").on("click", async () => {
            //@ts-ignore
            this.controller.ShowBusyIndicator();
            const data = this.grid.getData();
            console.log(data)
            for (const dt of data) {
                const mfno = dt.VOMFNO;
                const reqMDREADMI = new MIRequest()
                reqMDREADMI.program = "MDBREADMI"
                reqMDREADMI.transaction = "SelMWOHED55"
                reqMDREADMI.record = {
                    SQRY: `MFNO:${mfno}`,
                }
                reqMDREADMI.outputFields = ['ORTY', 'ELNO', 'PROJ', 'FACI', 'MFPC', 'PRNO', 'ORQA', 'BAQT']
                try {
                    //@ts-ignore
                    const resMDREADMI = await this.miService.executeRequestV2(reqMDREADMI)
                    if (resMDREADMI.items.length <= 0) continue
                    const result = resMDREADMI.items[0]
                    if (!tabFACI.includes(result.FACI)) continue
                    if (!tabORTY.includes(result.ORTY)) continue
                    // if (result.PROJ) continue

                    //Récupération Unité Batch en MMS015
                    const MMS015Request = new MIRequest();
                    MMS015Request.program = "MMS015MI";
                    MMS015Request.transaction = "Lst";
                    MMS015Request.record = {
                        ITNO: result.MFPC ? result.MFPC : result.PRNO,
                        AUTP: "1",
                        NFTR: "2",
                    };
                    MMS015Request.outputFields = ["ALUN", "COFA", "DMCF", "AUS4"];
                    let ALUN, COFA, DMCF
                    try {
                        //@ts-ignore
                        const MMS015Response = await this.miService.executeRequestV2(
                            MMS015Request
                        );
                        const items = MMS015Response.items;
                        for (let item of items) {
                            /** Appel API CRS050MI.Get */
                            const CRS050Request = new MIRequest();
                            CRS050Request.program = "CRS050MI";
                            CRS050Request.transaction = "Get";
                            CRS050Request.record = {
                                UNIT: item.ALUN,
                            };
                            CRS050Request.outputFields = ["UMCT", "TX40"];
                            try {
                                //@ts-ignore
                                const CRS050Response = await this.miService.executeRequestV2(
                                    CRS050Request
                                );
                                if (CRS050Response.item["UMCT"] == "2") {
                                    if (item["AUS4"] == "1") {
                                        ALUN = item["ALUN"];
                                        COFA = item["COFA"];
                                        DMCF = item["DMCF"];
                                        break;
                                    }
                                }
                            } catch (e) {
                                console.error(`Erreur lors de l'appel API CRS050MI.Get on :`, item);
                            }
                        }
                        if (items.length > 0 && !ALUN && !COFA) {
                            ALUN = items[0]["ALUN"];
                            COFA = items[0]["COFA"];
                            DMCF = items[0]["DMCF"];
                        }
                    } catch (err) {
                        console.error(err)
                    }

                    if (!ALUN && !result.BAQT) continue

                    let batch = 0
                    let unite = ''
                    if (ALUN) {
                        if (DMCF == '1') {
                            batch = Number(((parseFloat(result.ORQA.replace(',', '.'))
                                ? parseFloat(result.ORQA.replace(',', '.'))
                                : 0) / parseFloat(COFA.replace(',', '.'))).toFixed(3))
                        }
                        if (DMCF == '2') {
                            batch = Number(((parseFloat(result.ORQA.replace(',', '.'))
                                ? parseFloat(result.ORQA.replace(',', '.'))
                                : 0) * parseFloat(COFA.replace(',', '.'))).toFixed(3))
                        }
                        unite = ALUN
                    } else {
                        if (result.BAQT) {
                            batch = Number(
                                (
                                    parseFloat(result.ORQA.replace(',', '.')) /
                                    parseFloat(result.BAQT.replace(',', '.'))
                                ).toFixed(3))
                        }
                    }
                    if (result.MFPC && !ALUN) continue;
                    if (batch) {
                        console.log(dt, result.ORQA, COFA, batch)
                        const req = new MIRequest()
                        req.program = "PMS100MI";
                        req.transaction = "UpdMO";
                        req.record = {
                            FACI: result.FACI,
                            PRNO: result.PRNO,
                            MFNO: mfno,
                            PROJ: batch,
                            ELNO: unite,
                        };
                        try {
                            //@ts-ignore
                            await this.miService.executeRequestV2(req);
                        }
                        catch (err: any) {
                            console.error("Erreur PMS100MI.UpdMO : ", err);
                        }
                    }
                } catch (er) {
                    console.error(er)
                }
            }
            //@ts-ignore
            this.controller.HideBusyIndicator();
            this.controller.PressKey("F5");
        })
    }
}
