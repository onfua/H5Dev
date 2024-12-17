/*
    H5Script C04_PMS010E_ConvertBatchOF
  * @author: Joel Randrianarivelo
  * @version: 1.0.0
  * @since: 2024-10-25
  * @description: Conversion en quantité batch
*/
/**
 * CHANGELOGS
 * Version    Date       User        Description
 * 1.0.0   25-10-2024    JOEL        Initial Release
 * 1.0.1   20-11-2024    JOEL        Ajustement spécifique suite utilisation PROJ et ELNO
 * 1.0.2   12-12-2024    JOEL        Calcule en rendement
 */
class C04_PMS010E_ConvertBatchOF {
  private controller: IInstanceController;
  private argument: string;
  private miService;
  private contentElement: IContentElement;
  private vMAUN_B: string;
  private vCOFA_B: string;
  private vDMCF_B: string;
  private vORQA_temp: number;
  private tabBatch: any[];
  private $host: JQuery;
  private DATAGRID_ID: string;
  private BTNCLOSE_ID: string;
  private U_B: TextBoxElement | null;
  private Q_B: TextBoxElement | null;
  private unsubscribeRequesting : any;
  private unsubscribeRequested : any;

  private onRequesting(args: CancelRequestEventArgs): void {
    if (args.commandType === "KEY" && args.commandValue === "F12") {
        const contentDialog = $(`<p>Merci de bien vouloir finaliser la reprogrammation et de vérifier les quantités batch</p>`)
        const dialogBut = [
          {
            text : 'OK',
            isDefault : true,
            with : 80,
            click : function (event : any, modal : any){
              if (ScriptUtil.version >= 2.0){
                modal.close(true)
              }else{
                $(this).inforDialog('close')
              }
            }
          }
        ]
        const dialogOption = {
          title : 'Information',
          dialogType : 'General',
          modal : true,
          width : 600,
          minHeight : 480,
          icon : 'info',
          closeOnEscape : true,
          close : () => {
            contentDialog.remove()
          },
          buttons : dialogBut
        }
        if (ScriptUtil.version >= 2.0){
          H5ControlUtil.H5Dialog.CreateDialogElement(contentDialog[0],dialogOption)
        }else{
          contentDialog.inforMessageDialog(dialogOption)
        }
        args.cancel = true
        return; // The user should be allowed to go back
    }
}

private onRequested(args: RequestEventArgs): void {
    this.unsubscribeRequested();
    this.unsubscribeRequesting();
}

  constructor(scriptArgs: IScriptArgs) {
    this.controller = scriptArgs.controller;
    this.argument = scriptArgs.args;
    if (ScriptUtil.version >= 2.0) {
      this.miService = MIService;
    } else {
      this.miService = MIService.Current;
    }
    this.contentElement = this.controller.GetContentElement();
    this.vMAUN_B = "0";
    this.vCOFA_B = "0";
    this.vDMCF_B = "0";
    this.vORQA_temp = 0;
    this.tabBatch = [];
    this.$host = this.controller.ParentWindow;
    this.DATAGRID_ID = "browse-datagrid";
    this.BTNCLOSE_ID = "browse-btn-close";
    this.U_B = null;
    this.Q_B = null;
  }

  public static Init(args: IScriptArgs) {
    new C04_PMS010E_ConvertBatchOF(args).run();
  }

  /** Ajout de label pour le champ ecran quantité batch */
  private addQuantiteLabel(): void {
    const labelElement = new LabelElement();
    labelElement.Name = "Qté_Batch";
    labelElement.Value = "Quantité Batch";
    labelElement.Position = new PositionElement();
    labelElement.Position.Top = 8;
    labelElement.Position.Left = 65;
    this.contentElement.AddElement(labelElement);
  }

  /** Ajout de input pour le champ ecran quantité batch */
  private addQuantiteTextBox(): void {
    var textElement = new TextBoxElement();
    textElement.Name = "Q_B";
    textElement.Value = "";
    textElement.Position = new PositionElement();
    textElement.Position.Top = 8;
    textElement.Position.Left = 76;
    textElement.Position.Width = 15;
    this.contentElement.AddElement(textElement);
    this.Q_B = textElement;
  }

  /** Ajout de label pour le champ ecran unité batch */
  private addUniteLabel(): void {
    const labelElement = new LabelElement();
    labelElement.Name = "UC_Batch";
    labelElement.Value = "Unité Batch";
    labelElement.Position = new PositionElement();
    labelElement.Position.Top = 8;
    labelElement.Position.Left = 94;
    this.contentElement.AddElement(labelElement);
  }

  /** Ajout de input pour le champ ecran unité batch */
  private addUniteTextBox(): void {
    var textElement = new TextBoxElement();
    textElement.Name = "U_B";
    textElement.Value = "";
    textElement.Position = new PositionElement();
    textElement.Position.Top = 8;
    textElement.Position.Left = 100;
    textElement.Position.Width = 5;
    this.contentElement.AddElement(textElement);
    this.U_B = textElement;
  }

  /** Remplir la table de selection */
  private fetchData(BAQT: any, MFPC: any): any[] {
    const columns = [
      { id: "OKALUN", field: "OKALUN", name: "ALUN", filterType: "text" },
      { id: "OKTX40", field: "OKTX40", name: "TX40", filterType: "text" },
    ];

    const selectedField = "OKALUN";

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
        this.$host.find("#U_B").val(args[0].data[selectedField]).focus();
        this.vMAUN_B = args[0].data[selectedField];
        this.$host.find("#WAELNO").val(args[0].data[selectedField]);
        this.vCOFA_B = args[0].data["OKCOFA"];
        this.vDMCF_B = args[0].data["OKDMCF"];
        //this.$host.find("#Q_B").val("0");
        this.calculQB(BAQT, MFPC);
        ScriptUtil.version >= 2.0
          ? $("#" + this.BTNCLOSE_ID).click()
          : $(this).inforDialog("close");
      });

    const resInprogress = this.tabBatch.map((e: any) => {
      return {
        OKALUN: e["ALUN"],
        OKTX40: e["TX40"],
        OKCOFA: e["COFA"],
        OKDMCF: e["DMCF"],
      };
    });

    $("#" + this.DATAGRID_ID)
      .data("datagrid")
      .updateDataset(resInprogress);

    return resInprogress;
  }

  /** montrer le pop up de selection */
  private showBrowseDialog(): void {
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

    const titleTxt = "Unité batch";

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

  /** Rendre navigable */
  private makeBrowserable(BAQT: any, MFPC: any): void {
    const browseField = "U_B";
    $(
      '<span class="trigger h5-lookup-trigger">\n                <span class="h5-lookup-icon-container" style="height: 100%; display: flex; align-items: center;">\n                    <svg soho-icon="" class="h5-lookup-icon top-auto icon"\n                        aria-hidden="false" focusable="false" role="presentation">\n                        <use href="#icon-search-list-mod"></use>\n                    </svg>\n                </span>\n            </span>'
    )
      .insertAfter(this.$host.find("#" + browseField))
      .css({
        "min-width": "14px",
        width: "14px",
        height: "100%",
        "margin-top": "0!important",
        "margin-left": "0!important",
        "margin-right": "0!important",
        left: "unset",
        right: "3px",
        position: "absolute",
        cursor: "pointer",
      })
      .click(() => {
        this.showBrowseDialog();
        const resp = this.fetchData(BAQT, MFPC);
      });

    const style =
      this.$host.find("#" + browseField).attr("style") +
      "padding-right: 18px !important";

    //ajout F4 listener
    this.$host
      .find("#" + browseField)
      .attr("style", style)
      .keydown((e: KeyboardEvent) => {
        if (e.which === 115) {
          this.showBrowseDialog();
          this.fetchData(BAQT, MFPC);
          e.preventDefault();
          e.stopPropagation();
        }
      });
  }

  private async run(): Promise<any> {
    console.info(
      "1.0.2   12-12-2024    JOEL        Calcule en rendement"
    );
    //RG00 : Récupération argument en input
    const argument = this.argument.split(",");
    const tabFACI: any = argument[0].split("/");
    const tabORTY: any = argument[1].split("/");
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("");
      }, 1000);
    });

    //RG01 : Limitation du script
    const WAFACI = this.$host.find("#WAFACI");
    const WWPRNO = this.$host.find("#WWPRNO");
    const WWMFNO = this.$host.find("#WWMFNO");

    //VHORTY, VHELNO, VHSCOM from MWOHED where VHFACI = 'A01' and VHPRNO = 'Y10001' and VHMFNO = '0000000023'
    //MDBREAD - GetMWOHED00 - FACI PRNO MFNO

    if (tabFACI.includes(WAFACI.val())) {
      this.unsubscribeRequesting = this.controller.Requesting.On((e : any) => {
        this.onRequesting(e);
      });
      this.unsubscribeRequested = this.controller.Requested.On((e : any) => {
          this.onRequested(e);
      });
      const req = new MIRequest();
      req.program = "MDBREADMI";
      req.transaction = "GetMWOHED00";
      req.record = {
        FACI: WAFACI.val(),
        PRNO: WWPRNO.val(),
        MFNO: WWMFNO.val(),
      };
      req.outputFields = ["ORTY", "PROJ", "MFPC", "ELNO", "BAQT"];
      let ORTY, PROJ, MFPC, ELNO, BAQT;
      try {
        //@ts-ignore
        const rep = await this.miService.executeRequestV2(req);
        ORTY = rep.item["ORTY"];
        PROJ = rep.item["PROJ"];
        MFPC = rep.item["MFPC"];
        ELNO = rep.item["ELNO"];
        BAQT = rep.item["BAQT"];
      } catch (e: any) {
        console.error("erreur MDBREAMI");
        return;
      }

      //if (ELNO == "" || !ELNO) return;

      //RG02 : Création de 2 champs spécifiques
      this.addQuantiteLabel();
      this.addQuantiteTextBox();
      if (parseFloat(BAQT) > 0) {
        if (MFPC && MFPC.trim() != "") {
          this.addUniteLabel();
          this.addUniteTextBox();
        }
      }else{
        this.addUniteLabel();
        this.addUniteTextBox();
      }

      if (ELNO) {
        //@ts-ignore
        this.U_B?.Value = ELNO;
        this.$host.find("#U_B").ready(() => {
          this.$host.find("#U_B").val(ELNO);
        });
      }

      if (PROJ) {
        console.log(PROJ)
        //@ts-ignore
        this.Q_B?.Value = PROJ;
        this.$host.find("Q_B").ready(() => {
          this.$host.find("Q_B").val(PROJ);
        });
      }

      //RG04 : Récupération des unité Batch de l'OF
      //@ts-ignore
      this.controller.ShowBusyIndicator();
      const MMS015Request = new MIRequest();
      MMS015Request.program = "MMS015MI";
      MMS015Request.transaction = "Lst";
      MMS015Request.record = {
        ITNO: MFPC ? (MFPC != "" ? MFPC : WWPRNO.val()) : WWPRNO.val(),
        AUTP: "1",
        NFTR: "2",
      };
      MMS015Request.outputFields = ["ALUN", "COFA", "DMCF", "AUS4"];
      try {
        //@ts-ignore
        const MMS015Response = await this.miService.executeRequestV2(
          MMS015Request
        );
        const items = MMS015Response.items;
        this.tabBatch = [];
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
              this.tabBatch.push({
                ...item,
                UMCT: CRS050Response.item["UMCT"],
                TX40: CRS050Response.item["TX40"],
              });
              if (item["ALUN"] == ELNO) {
                this.vCOFA_B = item["COFA"];
                this.vDMCF_B = item["DMCF"];
                this.vMAUN_B = item["ALUN"];
                this.$host.find("#U_B").ready(() => {
                  this.$host.find("#U_B").val(this.vMAUN_B);
                  this.$host.find("#Q_B").ready(() => {
                    this.$host.find("#Q_B").val(PROJ);
                  });
                });
              }
            }
          } catch (e) {
            console.error(`Erreur lors de l'appel API CRS050MI.Get on :`, item);
          }
        }

        //RG06  : Promt F4
        this.makeBrowserable(BAQT, MFPC);

        //@ts-ignore
        this.controller.HideBusyIndicator();

        //RG09 : Calcul Quantité UC OF
        this.$host.find("#Q_B").ready(() => {
          this.$host.find("#Q_B").on("change", () => {
            this.calculQS(BAQT, MFPC);
          });
        });

        //RG10 : Calcul Quantité Batch OF
        this.$host.find("#WWORQA").ready(() => {
          this.$host.find("#WWORQA").on("change", () => {
            this.calculQB(BAQT, MFPC);
          });
        });

        this.$host.find("#U_B").ready(() => {
          this.$host.find("#U_B").on("change", () => {
            const unité = this.$host.find("#U_B").val();
            for (let i of this.tabBatch) {
              if (unité == i["ALUN"]) {
                this.vMAUN_B = i["ALUN"];
                this.vCOFA_B = i["COFA"];
                this.vDMCF_B = i["DMCF"];
                this.calculQB(BAQT, MFPC);
              }
            }
          });
        });
      } catch (e: any) {
        console.error("Erreur sur l'appel api MMS015MI.Lst");
      }
    }
  }

  private async calculQS(BAQT: any, MFPC: any) {
    if (this.vDMCF_B == "1") {
      this.vORQA_temp =
        (parseFloat(this.$host.find("#Q_B").val())
          ? parseFloat(this.$host.find("#Q_B").val())
          : 0) * parseFloat(this.vCOFA_B);
    }
    if (this.vDMCF_B == "2") {
      this.vORQA_temp =
        (parseFloat(this.$host.find("#Q_B").val())
          ? parseFloat(this.$host.find("#Q_B").val())
          : 0) / parseFloat(this.vCOFA_B);
    }
    if (
      this.vORQA_temp.toString().trim() !=
      this.$host.find("#WWORQA").val().trim()
    ) {
      this.$host.find("#WWORQA").ready(() => {
        this.$host.find("#WWORQA").val(`${this.vORQA_temp}`);
      });
    }

    //gestion en mode Rendement
    if (parseFloat(BAQT) > 0 && (!MFPC || MFPC.trim() == "")) {
      this.$host.find("#Q_B").ready(() => {
        this.$host
          .find("#WWORQA")
          .val(
            `${Number(
              (
                parseFloat(this.$host.find("#Q_B").val()) * parseFloat(BAQT)
              ).toFixed(3)
            )}`
          );
      });
      this.$host.find("#U_B").val("");
    }

    try {
      await new Promise((resolve,rejection) => {
        setTimeout(() => {
          resolve('')
        }, 500);
      })
      const WAFACI = this.$host.find("#WAFACI");
      const WWPRNO = this.$host.find("#WWPRNO");
      const WWMFNO = this.$host.find("#WWMFNO");
      const req = new MIRequest();
      req.program = "PMS100MI";
      req.transaction = "UpdMO";
      req.record = {
        FACI: WAFACI.val(),
        PRNO: WWPRNO.val(),
        MFNO: WWMFNO.val(),
        PROJ: this.$host.find("#Q_B").val(),
        ELNO: this.$host.find("#U_B").val(),
      };
      //@ts-ignore
      await this.miService.executeRequestV2(req);
    } catch (err: any) {
      console.error("Erreur PMS100MI.UpdMO : ", err);
    }
  }

  private async calculQB(BAQT: any, MFPC: any) {
    if (this.vDMCF_B == "1") {
      this.vORQA_temp =
        (parseFloat(this.$host.find("#WWORQA").val())
          ? parseFloat(this.$host.find("#WWORQA").val())
          : 0) / parseFloat(this.vCOFA_B);
    }
    if (this.vDMCF_B == "2") {
      this.vORQA_temp =
        (parseFloat(this.$host.find("#WWORQA").val())
          ? parseFloat(this.$host.find("#WWORQA").val())
          : 0) * parseFloat(this.vCOFA_B);
    }
    if (
      this.vORQA_temp.toString().trim() != this.$host.find("#Q_B").val().trim()
    ) {
      this.$host.find("#Q_B").ready(() => {
        this.$host.find("#Q_B").val(`${Number(this.vORQA_temp.toFixed(3))}`);
      });
    }

    //gestion en mode Rendement
    if (parseFloat(BAQT) > 0 && (!MFPC || MFPC.trim() == "")) {
      this.$host.find("#Q_B").ready(() => {
        this.$host
          .find("#Q_B")
          .val(
            `${Number(
              (
                parseFloat(this.$host.find("#WWORQA").val()) / parseFloat(BAQT)
              ).toFixed(3)
            )}`
          );
      });
      this.$host.find("#U_B").val("");
    }

    try {
      await new Promise((resolve,rejection) => {
        setTimeout(() => {
          resolve('')
        }, 500);
      })
      const WAFACI = this.$host.find("#WAFACI");
      const WWPRNO = this.$host.find("#WWPRNO");
      const WWMFNO = this.$host.find("#WWMFNO");
      const req = new MIRequest();
      req.program = "PMS100MI";
      req.transaction = "UpdMO";
      req.record = {
        FACI: WAFACI.val(),
        PRNO: WWPRNO.val(),
        MFNO: WWMFNO.val(),
        PROJ: this.$host.find("#Q_B").val(),
        ELNO: this.$host.find("#U_B").val(),
      };
      //@ts-ignore
      await this.miService.executeRequestV2(req);
    } catch (err: any) {
      console.error("Erreur PMS100MI.UpdMO : ", err);
    }
  }
}
