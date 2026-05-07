/*
    H5Script CST_PPS201_Amalgame
  * @author: Joel Randrianarivelo
  * @version: 1.1.0
  * @since: 22-10-2025
  * @description: Handle amalgame in PPS100
*/
/**
 * CHANGELOGS
 * Version    Date       User        Description
 * 1.0.0                             Initial Release
 * 1.1.0   22-10-2025    JOEL        Fix fonctionality
 */
var DialogType = {
    Question: "Question",
    Information: "Information",
    Warning: "Warning",
    Error: "Error"
}
class CST_PPS201_Amalgame {
    private miService;
    private controller: IInstanceController;
    private log: IScriptLog;
    private scriptName: string;
    private translations: any;
    private groupIdentity: string;
    private args: string

    constructor(scriptArgs: IScriptArgs) {
        if (ScriptUtil.version >= 2.0) {
            this.miService = MIService;
        } else {
            this.miService = MIService.Current;
        }
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
        this.args = scriptArgs.args;
        this.scriptName = 'CST_PPS201_Amalgame';
        this.groupIdentity = '';
        this.translations = this.getTranslations();
    }

    public static Init(args: IScriptArgs) {
        new CST_PPS201_Amalgame(args).run();
    }

    private run() {
        this.log.Info(`Running script: ${this.scriptName}`);
        const scriptArguments = this.parseArguments(this.args);
        const [buttonText, buttonRow, buttonColumn, buttonColor, groupIdentity] = scriptArguments;
        const $button = this.addButton({
            name: buttonText || 'Update price',
            value: buttonText || 'Update price',
            width: '100%',
            top: buttonRow || '11',
            left: buttonColumn || '74',
        });
        $button.find('button').css({
            'border-color': buttonColor || '#1C86EF',
            color: buttonColor || '#1C86EF',
            'min-width': '100px',
        });
        this.groupIdentity = groupIdentity || '60';
        $button.click({}, () => {
            if (this.controller.GetProgramName() === 'PPS201') {
                this.handlePPS201();
            }
            else {
                this.onButtonClicked();
            }
        });
    }

    private async listPOs() {
        const request = new MIRequest();
        request.program = 'CMS100MI';
        request.transaction = 'LstZUGP_PPW192';
        request.includeMetadata = true;
        request.typedOutput = true;
        request.maxReturnedRecords = 6000;
        request.record = {};
        try {
            //@ts-ignore
            const response: any = await this.miService.executeRequestV2(request);
            return response.items || [];
        } catch (error: any) {
            this.log.Error(error.errorMessage || 'Unknown error');
            this.setBusy(false);
            throw [];
        }
    }

    private async onButtonClicked() {
        this.setBusy(true);
        let poList = await this.listPOs();
        if (!poList || poList.length === 0) {
            this.showMessage(this.translate('noPurchaseOrderLinesFoundInTablePPW192'));
            return;
        }
        let totalPurchaseQty = 0;
        for (const purcaseOrderLine of poList) {
            totalPurchaseQty += purcaseOrderLine.POPPQT || 0;
        }
        const pdln = ScriptUtil.GetFieldValue('W3OBKV');
        poList = poList.filter((p: any) => !pdln || p.PWPDLN === pdln);
        const firstPOLine = poList[0];
        const SUNO = firstPOLine.PWSUNO;
        const AGNB = firstPOLine.POOURR;
        const CUCD = firstPOLine.POCUCD;
        const PUCD = firstPOLine.POPUCD;
        poList = poList.filter((poLine: any) => poLine.POOURR === AGNB && poLine.POCUCD === CUCD);
        const uniqueItems = poList.map((purchaseOrderLine: any) => purchaseOrderLine.PWITNO).filter((v: any, i: number, a: any[]) => a.indexOf(v) === i);
        const agreements = await this.getFilteredAgreements(SUNO, AGNB);
        if (!agreements.length) {
            this.showMessage(this.translate(`noAgreementLinesFoundForAgreement`).replace('{0}', AGNB));
            return;
        }
        const agreement = this.getAgreement(agreements, uniqueItems.length);
        if (!agreement) {
            this.showMessage(this.translate(`couldNotParseAgreementLines`));
            return;
        }
        const GRPI = agreement.GRPI;
        const OBV1 = agreement.OBV1;
        const FVDT = agreement.FVDT;
        let staggeredPrices = await this.listStaggeredPrices(SUNO, AGNB, GRPI, OBV1, FVDT);
        if (!staggeredPrices || staggeredPrices.length === 0) {
            this.showMessage(this.translate('noStaggeredPricesFoundForAgreement').replace('{0}', `${AGNB}/${GRPI}/${OBV1}/${FVDT}`));
            return;
        }
        staggeredPrices = staggeredPrices.sort((a: any, b: any) => (parseFloat(a.FRQT) > parseFloat(b.FRQT) ? 1 : -1));
        let newPrice: any = 0;
        for (const priceLine of staggeredPrices) {
            const FRQT = priceLine.FRQT;
            const PUPR = priceLine.PUPR;
            if (totalPurchaseQty >= FRQT) {
                newPrice = parseFloat(PUPR.toString()).toFixed(6); // updated by Pierre AOUN, Old value :  PUPR;
            }
            else {
                break;
            }
        }
        let formattedPrice = `${newPrice} ${CUCD}`;
        const currencySign = this.getCurrencySign(CUCD);
        if (currencySign) {
            formattedPrice = `${currencySign}${newPrice}`;
        }
        ConfirmDialog.ShowMessageDialog({
            header: `${this.translate('confirmPromptTitle1')}${formattedPrice}${this.translate('confirmPromptTitle2')}`,
            message: `${this.translate('confirmPromptMessage1')}${uniqueItems.length}${this.translate('confirmPromptMessage2')}${totalPurchaseQty}${this.translate('confirmPromptMessage3')}${OBV1}${this.translate('confirmPromptMessage4')}${AGNB}${this.translate('confirmPromptMessage5')}${poList.length}${this.translate('confirmPromptMessage6')}\n${PUCD === 1000 ? this.translate('confirmPromptMessage7') + PUCD : ''}`,
            dialogType: DialogType.Question,
            closed: async (ret) => {
                if (ret.ok) {
                    await this.updatePOLines(poList, newPrice);
                    this.controller.PressKey('F5');
                }
                this.setBusy(false);
            },
        });
    }

    /**
     * 
     * @param scriptArguments 
     * @returns 
     */
    private parseArguments(scriptArguments: string) {
        return scriptArguments.split(`,`).map((argument) => argument.trim());
    }


    /**
     * 
     * @param param0 
     * @returns 
     */
    private addButton({ name, value, width, top, left }: { name: string; value: string; width: string; top: string; left: string; }): JQuery {
        const buttonElement = new ButtonElement();
        buttonElement.Name = name;
        buttonElement.Value = value;
        buttonElement.Position = new PositionElement();
        buttonElement.Position.Top = top;
        buttonElement.Position.Left = left;
        buttonElement.Position.Width = width;
        const contentElement = this.controller.GetContentElement();
        return contentElement.AddElement(buttonElement);
    }


    private async updatePOLines(poLines: any, price: string) {
        const promises = poLines.map(async (poLine: any) => {
            const request = new MIRequest();
            request.program = 'PPS170MI';
            request.transaction = 'UpdPOP';
            request.record = {
                PLPN: poLine.PWPLPN,
                PLPS: poLine.PWPLPS,
                PLP2: poLine.PWPLP2,
                PUPR: price,
                PUCD: poLine.POPUCD === 1000 ? poLine.POPUCD : 0,
            };
            request.includeMetadata = true;
            request.typedOutput = true;
            try {
                //@ts-ignore
                const response: any = await this.miService.executeRequestV2(request);
                if (response.hasError()) {
                    throw response;
                } else {
                    return response.items;
                }
            } catch (error: any) {
                this.handleError(error.error);
                throw [];
            }
        });
        try{
            await Promise.all(promises);
            return;
        }catch(error : any){
            this.showError(error)
        }
    }

    /**
     * @description: Set busy indicator
     * @param isBusy 
     */
    private setBusy(isBusy: boolean) {
        if (isBusy) {
            //@ts-ignore
            this.controller.ShowBusyIndicator();
        } else {
            setTimeout(() => {
                //@ts-ignore
                this.controller.HideBusyIndicator();
            }, 500); //wait for 500ms to avoid busy indicator flickering
        }
    }

    /**
     * 
     * @param PUNO 
     * @param PNLI 
     * @param PNLS 
     * @returns 
     */
    private async getPOLine(PUNO: string, PNLI: string, PNLS: string) {
        const request = new MIRequest();
        request.program = 'PPS200MI';
        request.transaction = 'GetLine';
        request.includeMetadata = true;
        request.typedOutput = true;
        request.maxReturnedRecords = 1;
        request.record = {
            PUNO,
            PNLI,
            PNLS,
        };
        try {
            //@ts-ignore
            const response: any = await this.miService.executeRequestV2(request);
            return response.items || [];
        } catch (error: any) {
            this.log.Error(JSON.stringify(error.error, null, '\t') || 'Unknown error');
            this.setBusy(false);
            return [];
        }
    }

    /**
     * 
     * @param record 
     * @returns 
     */
    private async getFieldValue(record: any): Promise<any[]> {
        const request = new MIRequest();
        request.program = 'CUSEXTMI';
        request.transaction = 'GetFieldValue';
        request.includeMetadata = true;
        request.typedOutput = true;
        request.maxReturnedRecords = 1;
        request.record = record;
        try {
            //@ts-ignore
            const response: any = await this.miService.executeRequestV2(request);
            return response.items || [];
        } catch (error: any) {
            this.log.Error(JSON.stringify(error.error, null, '\t') || 'Unknown error');
            this.setBusy(false);
            return [];
        }
    }

    private async listAgreementLines(SUNO: string, AGNB: string): Promise<any[]> {
        const request = new MIRequest();
        request.program = 'PPS100MI';
        request.transaction = 'LstAgrLine';
        request.includeMetadata = true;
        request.typedOutput = false;
        request.maxReturnedRecords = 6000;
        request.record = {
            SUNO,
            AGNB,
        };
        try {
            //@ts-ignore
            const response: any = await this.miService.executeRequestV2(request);
            return response.items || [];
        } catch (error: any) {
            this.handleError(error.error);
            return [];
        }
    }

    private getAgreement(agreementLines: any, numberOfItems: number) {
        let agreement;
        try {
            const firstAgreement = agreementLines[0];
            const firstIdentifier = firstAgreement.OBV1;
            const identifierLetter = firstIdentifier[0];
            if (!this.isLetter(identifierLetter)) {
                this.showMessage(this.translate(`couldNotParseAgreementLines2`));
                return;
            }
            const fillerZero = numberOfItems < 10 ? '0' : '';
            const possibleIdentifier = `${identifierLetter}${fillerZero}${numberOfItems}`;
            const possibleAgreement = agreementLines.find((agreement: any) => agreement.OBV1 === possibleIdentifier);
            if (possibleAgreement) {
                agreement = possibleAgreement;
            }
            else {
                agreementLines = agreementLines.sort((a: any, b: any) => parseFloat(a.OBV1.slice(-2)) < parseFloat(b.OBV1.slice(-2)) ? 1 : -1);
                agreement = agreementLines[0];
            }
        }
        catch (error) {
            this.showMessage(this.translate(`couldNotParseAgreementLines`) + JSON.stringify(error));
            return;
        }
        return agreement;
    }

    /**
     * 
     * @param SUNO 
     * @param AGNB 
     */
    private async getFilteredAgreements(SUNO: string, AGNB: string) {
        try {
            const agreementLines = await this.listAgreementLines(SUNO, AGNB);
            return agreementLines.filter((a: any) => a.GRPI === this.groupIdentity);
        } catch {
            return [];
        }
    }

    /**
     * 
     * @param SUNO 
     * @param AGNB 
     * @param GRPI 
     * @param OBV1 
     * @param FVDT 
     * @returns 
     */
    private async listStaggeredPrices(SUNO: string, AGNB: string, GRPI: string, OBV1: string, FVDT: string) {
        const request = new MIRequest();
        request.program = 'PPS100MI';
        request.transaction = 'LstStgPrice';
        request.includeMetadata = true;
        request.typedOutput = true;
        request.maxReturnedRecords = 6000;
        request.record = {
            SUNO,
            AGNB,
            GRPI,
            OBV1,
            FVDT,
        };
        try {
            //@ts-ignore
            const response: any = await this.miService.executeRequestV2(request);
            return response.items || [];
        } catch (error: any) {
            this.handleError(error.error);
            return [];
        }
    }

    /**
     * 
     * @param CUCD 
     * @returns 
     */
    private getCurrencySign(CUCD: string): string {
        switch (CUCD) {
            case 'USD':
                return '$';
            case 'EUR':
                return '€';
            case 'GBP':
                return '£';
            case 'JPY':
                return '¥';
            default:
                return '';
        }
    }

    /**
     * 
     * @param poLine 
     * @returns 
     */
    private async updatePOLine(poLine: any) {
        const request = new MIRequest();
        request.program = 'PPS200MI';
        request.transaction = 'UpdLine';
        request.record = poLine;
        request.includeMetadata = true;
        request.typedOutput = true;
        try {
            //@ts-ignore
            const response: any = await this.miService.executeRequestV2(request);
            if (response.hasError()) {
                throw response;
            } else {
                return response.items;
            }
        } catch (error: any) {
            this.handleError(error.error);
            return [];
        }
    };


    /**
     * 
     * @param record 
     * @returns 
     */
    private async addFieldValue(record: any) {
        const request = new MIRequest();
        request.program = 'CUSEXTMI';
        request.transaction = 'AddFieldValue';
        request.includeMetadata = true;
        request.typedOutput = true;
        request.maxReturnedRecords = 1;
        request.record = record;
        try {
            //@ts-ignore
            const response: any = await this.miService.executeRequestV2(request);
            return response.items || [];
        } catch (error: any) {
            this.log.Error(JSON.stringify(error.error, null, '\t') || 'Unknown error');
            this.setBusy(false);
            throw [];
        }
    }

    /**
     * 
     * @param record 
     * @returns 
     */
    private async delFieldValue(record: any) {
        const request = new MIRequest();
        request.program = 'CUSEXTMI';
        request.transaction = 'DelFieldValue';
        request.includeMetadata = true;
        request.typedOutput = true;
        request.maxReturnedRecords = 1;
        request.record = record;
        try {
            //@ts-ignore
            const response: any = await this.miService.executeRequestV2(request);
            return response.items || [];
        } catch (error: any) {
            this.log.Error(JSON.stringify(error.error, null, '\t') || 'Unknown error');
            this.setBusy(false);
            throw [];
        }
    }


    /**
     * @description: Handle PPS201
     */
    private async handlePPS201() {
        this.setBusy(true);
        const PUNO = this.controller.GetValue('IAPUNO').trim();
        const SUNO = this.controller.GetValue('IASUNO').trim();

        let AGNB = '';
        let PUCD = 0;
        let totalPurchaseQty = 0;
        const uniqueItems: any = [];
        const savedPrices: any = [];
        const rows = this.controller
            .GetGrid()
            .getData()
            .filter((i: any) => i.WSPNLI);

        for (const row of rows) {
            const [line] = await this.getPOLine(PUNO, row.WSPNLI, row.WSPNLS);
            const [savedPrice] = await this.getFieldValue({
                FILE: 'MPLINE',
                PK01: PUNO,
                PK02: row.WSPNLI,
                PK03: row.WSPNLS,
            })
            if (line && Number(line.PUSL) < 32) {
                AGNB || (AGNB = line.OURR);
                PUCD || (PUCD = Number(line.PUCD));
                totalPurchaseQty += line.ORQA;
                uniqueItems.push(line);
                if (savedPrice) {
                    savedPrices.push(savedPrice);
                }
            }
        }
        if (!rows.length) {
            this.showMessage(this.translate(`noPoLinesFound`));
            return;
        }
        if (!uniqueItems.length) {
            this.showMessage(this.translate(`allPoLinesAreConfirmed`));
            return;
        }
        const agreements = await this.getFilteredAgreements(SUNO, AGNB);
        if (!agreements.length) {
            this.showMessage(this.translate(`noAgreementLinesFoundForAgreement`).replace('{0}', AGNB));
            return;
        }
        const agreement = this.getAgreement(agreements, uniqueItems.length);
        if (!agreement) {
            this.showMessage(this.translate(`couldNotParseAgreementLines`));
            return;
        }

        const CUCD = agreement.CUCD;
        const GRPI = agreement.GRPI;
        const OBV1 = agreement.OBV1;
        const FVDT = agreement.FVDT;

        let staggeredPrices = await this.listStaggeredPrices(SUNO, AGNB, GRPI, OBV1, FVDT);
        if (!staggeredPrices.length) {
            this.showMessage(this.translate('noStaggeredPricesFoundForAgreement').replace('{0}', `${AGNB}/${GRPI}/${OBV1}/${FVDT}`));
            return;
        }
        staggeredPrices = staggeredPrices.sort((a: any, b: any) => (parseFloat(a.FRQT) > parseFloat(b.FRQT) ? 1 : -1));
        let newPrice = 0;
        let ODI3 = 0;
        for (const priceLine of staggeredPrices) {
            if (totalPurchaseQty >= priceLine.FRQT) {
                newPrice = priceLine.PUPR;
                ODI3 = priceLine.DIP3;
            }
            else {
                break;
            }
        }
        if (PUCD) {
            newPrice *= PUCD;
        }
        let formattedPrice = `${newPrice} ${CUCD}`;
        const currencySign = this.getCurrencySign(CUCD);
        if (currencySign) {
            formattedPrice = `${currencySign}${newPrice.toFixed(2)}`;
        }

        const updatePrices = () => ConfirmDialog.ShowMessageDialog({
            header: `${this.translate('confirmPromptTitle1')}${formattedPrice}${this.translate('confirmPromptTitle2')}`,
            message: this.translate('confirmPromptMessagePPS201')
                .replace('{0}', String(uniqueItems.length))
                .replace('{1}', String(totalPurchaseQty))
                .replace('{2}', OBV1)
                .replace('{3}', AGNB)
                .replace('{4}', String(uniqueItems.length)) +
                (PUCD === 1000 ? this.translate('purchasePriceQuantity').replace('{0}', String(PUCD)) : ''),
            dialogType: DialogType.Question,
            closed: (ret) => async () => {
                if (ret.ok) {
                    await Promise.all(uniqueItems.map((i: any) => this.addFieldValue({
                        FILE: 'MPLINE',
                        PK01: PUNO,
                        PK02: String(i.PNLI),
                        PK03: String(i.PNLS),
                        N096: i.PUPR,
                    }))).catch((error) => this.showError(error));
                    await Promise.all(uniqueItems.map((i: any) => this.updatePOLine({
                        PUNO,
                        PNLI: i.PNLI,
                        PNLS: i.PNLS,
                        PUPR: parseFloat(newPrice.toString()).toFixed(6), // updated by Pierre AOUN, Old value : newPrice,
                        ODI3,
                    }))).catch((error) => this.showError(error));
                    this.controller.PressKey('F5');
                }
                this.setBusy(false);
            },
        });

        const revertPrices = () => ConfirmDialog.ShowMessageDialog({
            header: this.translate('revertToOriginalPrice'),
            message: this.translate(`confirmToChangeBackToOriginalPrice`) +
                '<br/ >' +
                savedPrices
                    .map((s: any) => this.translate('line')
                        .replace('{0}', `${Number(s.PK02)}`)
                        .replace('{1}', `${currencySign}${s.N096}`))
                    .join('<br/>'),
            dialogType: DialogType.Question,
            closed: (ret) => async () => {
                if (ret.ok) {
                    await Promise.all(savedPrices.map((i: any) => this.updatePOLine({
                        PUNO,
                        PNLI: Number(i.PK02),
                        PNLS: Number(i.PK03),
                        PUPR: parseFloat(i.N096.toString()).toFixed(6), // updated by Pierre AOUN, Old value : i.N096,
                    }))).catch((error) => this.showError(error));
                    await Promise.all(savedPrices.map((i: any) => this.delFieldValue({
                        FILE: 'MPLINE',
                        PK01: i.PK01,
                        PK02: i.PK02,
                        PK03: i.PK03,
                    }))).catch((error) => this.showError(error));
                    this.controller.PressKey('F5');
                }
                else {
                    updatePrices();
                }
                this.setBusy(false);
            }
        })

        if (savedPrices.length) {
            revertPrices();
        }
        else {
            updatePrices();
        }
    }

    private showError(error: any) {
        const { errorCode, errorMessage } = error;
        if (errorMessage) {
            if (errorCode === 'PP20138') {
                this.showMessage(this.translate('pleaseCheckYourOrderType'));
                return;
            }
            this.showMessage(errorMessage);
            return;
        }
        this.showMessage(JSON.stringify(error));
    }

    private showMessage(message: string, dialogType?: string) {
        this.setBusy(false);
        const options = {
            header: this.scriptName,
            message: message,
            dialogType: dialogType || DialogType.Error,
            id: `${this.scriptName}`,
        };
        ConfirmDialog.ShowMessageDialog(options);
    }


    /**
     * 
     * @param translation 
     * @returns 
     */
    private translate(translation: string): string {
        const LANC = ScriptUtil.GetUserContext('CurrentLanguage');
        const language = this.translations[LANC] || this.translations[`GB`];
        return language[translation] || this.translations[`GB`][translation] || 'No translation found!';
    }

    private isLetter(str: any) {
        return str.length === 1 && str.match(/[a-z]/i);
    }

    private handleError(error: any) {
        this.log.Error(error ? JSON.stringify(error, null, '\t') : 'Unknown error');
        this.setBusy(false);
    }

    private getTranslations(): any {
        return {
            GB: {
                example: `There are 4 different SKUs with a total quantity of 55000. Agreement line Y03 from agreement 2000040 will be used. 6 planned purchase orders will be affected.`,
                allPoLinesAreConfirmed: `All PO lines are confirmed.`,
                confirmPromptTitle1: `Update purchase price to `,
                confirmPromptTitle2: `?`,
                confirmPromptMessage1: `There are `,
                confirmPromptMessage2: ` different SKUs with a total quantity of `,
                confirmPromptMessage3: `. Agreement line `,
                confirmPromptMessage4: ` from agreement `,
                confirmPromptMessage5: ` will be used. `,
                confirmPromptMessage6: ` planned purchase orders will be affected.`,
                confirmPromptMessage7: `Purchase price quantity is `,
                confirmPromptMessage8: ` purchase order line(s) will be affected.`,
                confirmPromptMessagePPS201: 'There are {0} different SKUs with a total quantity of {1}. ' +
                    'Agreement line {2} from agreement {3} will be used. ' +
                    '{4} purchase order line(s) will be affected. ',
                confirmToChangeBackToOriginalPrice: `Confirm to change back to original price.`,
                couldNotParseAgreementLines: `Could not parse agreement lines.`,
                couldNotParseAgreementLines2: `Could not parse agreement lines, start value 1 (OBV1) is using an unexpected format.`,
                line: `Line {0}: {1}`,
                noAgreementLinesFoundForAgreement: `No agreement lines found for agreement {0}`,
                noPoLinesFound: `No PO lines found.`,
                noStaggeredPricesFoundForAgreement: `No staggered prices found for agreement {0}`,
                noPurchaseOrderLinesFoundInTablePPW192: `No purchase order lines found in table PPW192`,
                pleaseCheckYourOrderType: `Please check your order type. \n Agreement check active - price cannot be changed`,
                purchasePriceQuantity: `Purchase price quantity is {0}.`,
                revertToOriginalPrice: `Revert to original price?`,
            },
            FR: {
                allPoLinesAreConfirmed: `Toutes les lines d'ordre d'achat sont confirmées.`,
                confirmPromptTitle1: `Mise à jour Prix à `,
                confirmPromptTitle2: `?`,
                confirmPromptMessage1: `Il existe `,
                confirmPromptMessage2: ` SKU différents avec une quantité totale de `,
                confirmPromptMessage3: `. La ligne de contrat `,
                confirmPromptMessage4: ` du contrat `,
                confirmPromptMessage5: ` sera utilisée. `,
                confirmPromptMessage6: ` Propositions de commande achat seront concernées.`,
                confirmPromptMessage7: `Purchase price quantity is `,
                confirmPromptMessage8: ` planned purchase orders will be affected.`,
                confirmPromptMessagePPS201: 'Il y a {0} SKUs différentes avec une quantité totale de {1}. ' +
                    'La ligne {2} du contrat {3} sera utilisée. ' +
                    `{4} lignes d'ordre d'achat seront affectées. `,
                confirmToChangeBackToOriginalPrice: `Confirmer le retour au prix initial.`,
                couldNotParseAgreementLines: `Impossible d'analyser les lignes du contrat.`,
                couldNotParseAgreementLines2: `Impossible d'analyser les lignes du contrat, la valeur de départ 1 (OBV1) utilise un format inattendu.`,
                line: `Ligne {0}: {1}`,
                noAgreementLinesFoundForAgreement: `Aucune ligne de contrat trouvée pour le contrat {0}`,
                noPoLinesFound: `Aucune ligne d'ordre d'achat trouvée.`,
                noPurchaseOrderLinesFoundInTablePPW192: `Aucune ligne d'ordre d'achat trouvée dans la table PPW192`,
                noStaggeredPricesFoundForAgreement: `Aucun prix échelonné n'a été trouvé pour le contrat {0}`,
                pleaseCheckYourOrderType: `Veuillez vérifier votre type d'ordre d'achat. \n Contrôle contrat activé - le prix ne peut pas être modifié`,
                purchasePriceQuantity: `La quantité prix d'achat est {0}.`,
                revertToOriginalPrice: `Revenir au prix initial?`,
            }
        }
    }
}