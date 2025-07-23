/**
 *      CST_PPS105_PrefacturationTransport - 
 * 
 * AUTHOR: Raoel Ntsoa
 * email: ntsoa.raoel@spoonconsulting.com
 * 
 * @Note
 *     If changes are needed to be done on the script.
 *     Kindly email the last person who modified to provide the test latest typescript file.
 * 
 * 
 * 
 * @CHANGELOGS
 * USER                 ActionLog   Date        Description
 * NRAOEL               1.0         18062025    Initial Release
 * */

class CST_PPS105_PrefacturationTransport {
    private miService;
    private controller: IInstanceController;
    private $host: JQuery;
    private log: IScriptLog;
    private version: number;
    private args: string;
    private contentElement: IContentElement;
    private componentsAdded: boolean;
    private unsubscribeRequesting: any;
    private unsubscribeRequested: any;
    private checkBoxElement: CheckBoxElement | null;
    private textBoxElement: TextBoxElement | null;

    constructor(scriptArgs: IScriptArgs) {
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
        this.args = scriptArgs.args;
        this.version = ScriptUtil.version;
        if (this.version >= 2.0) {
            this.miService = MIService;
        } else {
            this.miService = MIService.Current;
        }
        this.$host = this.controller.ParentWindow;
        this.contentElement = this.controller.GetContentElement();
        this.componentsAdded = false;
        this.checkBoxElement = null;
        this.textBoxElement = null;
    }

    public static Init(args: IScriptArgs) {
        new CST_PPS105_PrefacturationTransport(args).run();
    }

    private async onRequesting(args: CancelRequestEventArgs): Promise<void> {
        if (args.commandType === "KEY" && args.commandValue === "ENTER") {
            await this.updCUGEX3()
            args.cancel = true
            //return; // The user should be allowed to go back
        }
    }

    private onRequested(args: RequestEventArgs): void {
        this.unsubscribeRequested();
        this.unsubscribeRequesting();
    }

    private async run() {
        const addComponents = async () => {
            if (!this.componentsAdded) {
                this.addLabel();
                this.addCheckBox();
                this.addLabel1();
                this.addTextBox();

                const isReadOnly = this.$host.find("#WEFREL").prop('readonly');
                if (isReadOnly) {
                    this.$host.find("#TxtPoids").prop('readonly', true);
                    this.$host.find("#TxtPoids").css({ "pointer-events": "none" });
                    this.$host.find("#CBTarification").prop('disabled', true);
                    this.$host.find("#CBTarification").parent().css({ "pointer-events": "none" });
                    this.$host.find("#CBTarification").addClass("disable-checkbox");
                }

                this.componentsAdded = true;

                await this.getCUGEX3();
            }
        }
        const removeComponents = () => {
            if (this.componentsAdded) {
                this.$host.find("#LblTarification").remove();
                this.$host.find("#CBTarification").remove();
                this.$host.find("#LblPoids").remove();
                this.$host.find("#TxtPoids").remove();

                this.componentsAdded = false;
            }
        }

        const handleWEFROP = async () => {
            const WEFROP = this.controller.GetValue("WEFROP");
            if (WEFROP === "12" ||( WEFROP === "26" && this.controller.GetValue("WE3PFW").trim() === "")) {
                try {
                    await addComponents();
                } catch { }
            } else {
                removeComponents();
            }
        }

        await handleWEFROP();
        this.$host.find("#WEFROP").off("change").on("change", async () => {
            try {
                await handleWEFROP();
            } catch { }
        });
        this.unsubscribeRequesting = this.controller.Requesting.On(async (e: any) => {
            try{
                await this.onRequesting(e);
            }catch{}
        });
        this.unsubscribeRequested = this.controller.Requested.On((e: any) => {
            this.onRequested(e);
        });
    }

    private addLabel() {
        const labelElement = new LabelElement();
        labelElement.Name = "LblTarification";
        labelElement.Value = "Tarification Mixte Poids/Palette";
        labelElement.Position = new PositionElement();
        labelElement.Position.Top = 10;
        labelElement.Position.Left = 90;
        labelElement.Position.Width = 20;
        this.contentElement.AddElement(labelElement);
    }

    private addCheckBox() {
        const checkBoxElement = new CheckBoxElement();
        checkBoxElement.Name = "CBTarification";
        checkBoxElement.Position = new PositionElement();
        checkBoxElement.Position.Top = 10;
        checkBoxElement.Position.Left = 110;
        this.contentElement.AddElement(checkBoxElement);
        this.checkBoxElement = checkBoxElement;
    }

    private addLabel1() {
        const labelElement = new LabelElement();
        labelElement.Name = "LblPoids";
        labelElement.Value = "Palier de Poids en KG";
        labelElement.Position = new PositionElement();
        labelElement.Position.Top = 11;
        labelElement.Position.Left = 90;
        labelElement.Position.Width = 15;
        this.contentElement.AddElement(labelElement);
    }

    private addTextBox() {
        const textElement = new TextBoxElement();
        textElement.Name = "TxtPoids";
        textElement.Value = "";
        textElement.Position = new PositionElement();
        textElement.Position.Top = 11;
        textElement.Position.Left = 110;
        textElement.Position.Width = 5;
        this.contentElement.AddElement(textElement);
        this.textBoxElement = textElement;
    }

    private async addCUGEX3() {
        const POID = this.textBoxElement?.Value;
        //const POID = this.$host.find("#TxtPoids")?.val();
        const WEAGNB = this.$host.find("#WEAGNB")?.val();
        const WEFREL = this.$host.find("#WEFREL")?.val();
        const WEFROP = this.$host.find("#WEFROP")?.val();

        if (!WEFREL?.trim() || !WEFROP?.trim() || !WEAGNB?.trim()) {
            return;
        }
        const al31Value = this.checkBoxElement?.IsChecked ? "1" : "0";
        // const cbTarification = this.$host.find("#CBTarification");
        // const al31Value = (cbTarification && cbTarification.is(':checked')) ? "1" : "0";

        const myRequest = new MIRequest();
        myRequest.program = "CUSEXTMI";
        myRequest.transaction = "AddAlphaKPI";
        myRequest.record = { KPID: "PREFACT_PPS105", PK01: WEAGNB, PK02: WEFREL, PK03: WEFROP, AL30: POID, AL31: al31Value };
        myRequest.outputFields = [];
        try {
            //@ts-ignore
            await this.miService.executeRequestV2(myRequest);
        } catch { }

    }

    private async updCUGEX3() {
        const POID = this.$host.find("#TxtPoids")?.val();
        const WEAGNB = this.$host.find("#WEAGNB")?.val();
        const WEFREL = this.$host.find("#WEFREL")?.val();
        const WEFROP = this.$host.find("#WEFROP")?.val();
        const cbTarification = this.$host.find("#CBTarification");
        const al31Value = (cbTarification && cbTarification.is(':checked')) ? "1" : "0";

        const requestGet = new MIRequest();
        requestGet.program = "CUSEXTMI";
        requestGet.transaction = "GetAlphaKPI";
        requestGet.record = {
            KPID: "PREFACT_PPS105",
            PK01: WEAGNB,
            PK02: WEFREL,
            PK03: WEFROP
        };
        requestGet.outputFields = ["AL30", "AL31"];
        try {
            //@ts-ignore
            const response = await this.miService.executeRequestV2(requestGet);
            const exist = response.items && response.items.length > 0;

            if (!exist) {
                const isPoidsVide = !POID || POID.trim() === "";
                const isTarifVide = al31Value !== "1";

                if (isPoidsVide && isTarifVide) {
                    console.log("Aucune donnée à ajouter dans CUGEX.");
                    return;
                }

                await this.addCUGEX3();
                return;
            }

            const item = response.items[0];
            const oldPoids = item.AL30 || "";
            const oldTarif = item.AL31 || "0";

            if (oldPoids === POID && oldTarif === al31Value) {
                return;
            }

            const requestUpdate = new MIRequest();
            requestUpdate.program = "CUSEXTMI";
            requestUpdate.transaction = "ChgAlphaKPI";
            requestUpdate.record = {
                KPID: "PREFACT_PPS105",
                PK01: WEAGNB,
                PK02: WEFREL,
                PK03: WEFROP,
                AL30: POID,
                AL31: al31Value
            };
            requestUpdate.outputFields = [];

            try{
                //@ts-ignore
                await this.miService.executeRequestV2(requestUpdate);
            }catch{ }
        } catch { 
            await this.addCUGEX3();
        }

    }

    private async getCUGEX3() {
        const WEAGNB = this.$host.find("#WEAGNB").val();
        const WEFREL = this.$host.find("#WEFREL").val();
        const WEFROP = this.$host.find("#WEFROP").val();

        const myRequest = new MIRequest();
        myRequest.program = "CUSEXTMI";
        myRequest.transaction = "GetAlphaKPI";
        myRequest.record = { KPID: "PREFACT_PPS105", PK01: WEAGNB, PK02: WEFREL, PK03: WEFROP };
        myRequest.outputFields = ["AL30", "AL31"];

        try {
            //@ts-ignore
            const response = await this.miService.executeRequestV2(myRequest);
            if (response.items.length > 0) {
                const item = response.items[0];
                const poids = item.AL30;
                const tarification = item.AL31;

                if (tarification == "1") {
                    this.$host.find("#CBTarification").prop('checked', true);
                }

                this.$host.find("#TxtPoids").val(poids);
            } else {
                this.$host.find("#TxtPoids").val("");
            }
        } catch {
            this.$host.find("#TxtPoids").val("");
        }
    }
}