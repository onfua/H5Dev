/*
    H5Script C04_PMS001E_ConvertBatchOF
  * @author: Joel Randrianarivelo
  * @version: 1.0.0
  * @since: 2024-10-22
  * @description: Conversion en quantité batch
*/
/**
 * CHANGELOGS
 * Version    Date       User        Description
 * 1.0.0   22-10-2024    JOEL        Initial Release
 * 1.0.1   20-11-2024    JOEL        Ajustement spécifique suite utilisation PROJ et ELNO
 * 1.0.2   12-12-2024    JOEL        Calcule en rendement
 */

class C04_PMS001E_ConvertBatchOF {
  private controller: IInstanceController;
  private argument: string;
  private miService;
  private $host: JQuery;
  private DATAGRID_ID: string;
  private BTNCLOSE_ID: string;
  private vMAUN_B: string;
  private vCOFA_B: string;
  private vDMCF_B: string;
  private vORQA_temp: number;
  private contentElement: IContentElement;
  private tabBatch: any[];

  constructor(scriptArgs: IScriptArgs) {
    this.controller = scriptArgs.controller;
    this.argument = scriptArgs.args;
    if (ScriptUtil.version >= 2.0) {
      this.miService = MIService;
    } else {
      this.miService = MIService.Current;
    }
    this.$host = this.controller.ParentWindow;
    this.DATAGRID_ID = "browse-datagrid";
    this.BTNCLOSE_ID = "browse-btn-close";
    this.vMAUN_B = "0";
    this.vCOFA_B = "0";
    this.vDMCF_B = "0";
    this.vORQA_temp = 0;
    this.contentElement = this.controller.GetContentElement();
    this.tabBatch = [];
  }

  public static Init(args: IScriptArgs) {
    new C04_PMS001E_ConvertBatchOF(args).run();
  }

  /** Remplir la table de selection */
  private fetchData(): any[] {
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
        this.$host.find("#WAELNO").val(args[0].data[selectedField]).focus();
        this.vMAUN_B = args[0].data[selectedField];
        this.vCOFA_B = args[0].data["OKCOFA"];
        this.vDMCF_B = args[0].data["OKDMCF"];
        this.calculQB();
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
  private makeBrowserable(): void {
    this.$host.find("#btnLookup_WAELNO").remove();
    const browseField = "WAELNO";
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
        const resp = this.fetchData();
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
          this.fetchData();
          e.preventDefault();
          e.stopPropagation();
        }
      });
  }

  private async run(): Promise<any> {
    //RG00 : récupération argument en input
    const argument = this.argument.split(",");
    const tabFACI: any = argument[0].split("/");
    const tabORTY: any = argument[1].split("/");
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("");
      }, 500);
    });

    //RG01 : Limitation du script
    const WAORTY = this.$host.find("#WAORTY").val();
    const WAFACI = this.$host.find("#WAFACI").val();

    //CRS050

    /** declenchement du script seulement si WAORTY existe dans tabORTY et WAFACI existe dans tabFACI */
    if (tabFACI.includes(WAFACI) && tabORTY.includes(WAORTY)) {
      console.info("1.0.2   12-12-2024    JOEL        Calcule en rendement");
      //RG02 : Récupération des Unité Batch de l'OF
      const WWPRNO = this.$host.find("#WWPRNO").val();
      const WAMFPC = this.$host.find("#WAMFPC")?.val();

      //@ts-ignore
      this.controller.ShowBusyIndicator();
      /** Appel API MMS015MI.Lst */
      const MMS015Request = new MIRequest();
      MMS015Request.program = "MMS015MI";
      MMS015Request.transaction = "Lst";
      MMS015Request.record = {
        ITNO: WAMFPC?.trim() != "" ? WAMFPC : WWPRNO,
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
              if (item["AUS4"] == "1") {
                this.vMAUN_B = item["ALUN"];
                this.vCOFA_B = item["COFA"];
                this.vDMCF_B = item["DMCF"];
                this.$host.find("#WAELNO").val(this.vMAUN_B);
                this.calculQB();
              }
            }
          } catch (e) {
            console.error(`Erreur lors de l'appel API CRS050MI.Get on :`, item);
          }
        }

        /** Suppression des ecrans et sorti du script si aucun element dans tabBatch */
        if (this.tabBatch.length == 0) {
          if (
            (parseFloat(this.$host.find("#WWBAQT").val()) > 0 &&
              this.$host.find("#WAMFPC").val() &&
              this.$host.find("#WAMFPC").val().trim() == "") ||
            (parseFloat(this.$host.find("#WWBAQT").val()) > 0 &&
              !this.$host.find("#WAMFPC").val())
          ) {
            this.$host
              .find('div[componentname="WAMAUN"]')
              .css({ "pointer-events": "none" });
            //@ts-ignore
            this.controller.HideBusyIndicator();
            this.$host.find("#btnLookup_WAPROJ").remove();
            this.calculQB();
            this.$host.find("#WWORQA").ready(() => {
              this.$host.find("#WWORQA").on("change", () => {
                this.calculQB();
              });
            });
            this.$host.find("#WAPROJ").css({ "pointer-events": "none" });
            this.$host
              .find('div[componentname="WAELNO"]')
              .css({ display: "none" });
          } else {
            //@ts-ignore
            this.contentElement.RemoveScriptComponents();
            //@ts-ignore
            this.controller.HideBusyIndicator();
            return;
          }
        } else {
          //RG03 : Initialiser des champs standarts
          //this.controller.SetValue("WAWHST", "10");
          //this.$host.find('div[componentname="WAWHST"]').css({ "pointer-events": "none" });
          this.$host
            .find('div[componentname="WAMAUN"]')
            .css({ "pointer-events": "none" });
          if (
            (parseFloat(this.$host.find("#WWBAQT").val()) > 0 &&
              this.$host.find("#WAMFPC").val() &&
              this.$host.find("#WAMFPC").val().trim() == "") ||
            (parseFloat(this.$host.find("#WWBAQT").val()) > 0 &&
              !this.$host.find("#WAMFPC").val())
          ) {
            this.$host.find("#WAPROJ").css({ "pointer-events": "none" });
            this.$host
              .find('div[componentname="WAELNO"]')
              .css({ display: "none" });
          }
          //this.contentElement.GetElement("WAELNO").css("display", "none");

          //@ts-ignore
          this.controller.HideBusyIndicator();

          //RG05 : Init
          /*this.vCOFA_B = "0";
          this.vDMCF_B = "0";*/

          //RG06
          this.makeBrowserable();

          this.$host.find("#btnLookup_WAPROJ").remove();

          //RG08 : Recalcul tabBATCH
          this.$host.find("#WAMFPC").ready(() => {
            this.$host.find("#WAMFPC").on("change", async () => {
              if (
                parseFloat(this.$host.find("#WWBAQT").val()) > 0 &&
                this.$host.find("#WAMFPC").val().trim() == ""
              ) {
                this.$host.find("#WAPROJ").css({ "pointer-events": "none" });
                this.$host
                  .find('div[componentname="WAELNO"]')
                  .css({ display: "none" });
              }
              this.vCOFA_B = "0";
              this.vDMCF_B = "0";
              //@ts-ignore
              this.controller.ShowBusyIndicator();
              /** Appel API MMS015MI.Lst */
              const MMS015Request = new MIRequest();
              MMS015Request.program = "MMS015MI";
              MMS015Request.transaction = "Lst";
              MMS015Request.record = {
                ITNO: WAMFPC.trim() != "" ? WAMFPC : WWPRNO,
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
                    const CRS050Response = await this.miService.executeRequestV2(CRS050Request);
                    if (CRS050Response.item["UMCT"] == "2") {
                      this.tabBatch.push({
                        ...item,
                        UMCT: CRS050Response.item["UMCT"],
                        TX40: CRS050Response.item["TX40"],
                      });
                      if (item["AUS4"] == "1") {
                        this.vMAUN_B = item["ALUN"];
                        this.vCOFA_B = item["COFA"];
                        this.vDMCF_B = item["DMCF"];
                        this.$host.find("#WAELNO").val(this.vMAUN_B);
                        this.calculQB();
                      }
                    }
                  } catch (e) {
                    console.error(
                      `Erreur lors de l'appel API CRS050MI.Get sur le recalcule on :`,
                      item
                    );
                  }
                }
              } catch (e: any) {
                console.error("Erreur lors du recalcule du tabBatch");
              }
              //@ts-ignore
              this.controller.HideBusyIndicator();
            });
          });

          //RG09 : Calcul Quantité UC OF

          this.$host.find("#WAPROJ").ready(() => {
            this.$host.find("#WAPROJ").on("change", () => {
              this.calculQS();
            });
          });

          //RG10 : Calcul Quantité Batch OF
          this.$host.find("#WWORQA").ready(() => {
            this.$host.find("#WWORQA").on("change", () => {
              this.calculQB();
            });
          });

          this.$host.find("#WAELNO").ready(() => {
            this.$host.find("#WAELNO").on("change", () => {
              const unité = this.$host.find("#WAELNO").val();
              for (let i of this.tabBatch) {
                if (unité == i["ALUN"]) {
                  this.vMAUN_B = i["ALUN"];
                  this.vCOFA_B = i["COFA"];
                  this.vDMCF_B = i["DMCF"];
                  this.calculQB();
                }
              }
            });
          });
        }
      } catch (e: any) {
        console.error(`Erreur lors de l'appel API MMS015MI.Lst `, e);
      }
    }
  }

  private calculQS(): void {
    if (this.vDMCF_B == "1") {
      this.vORQA_temp =
        (parseFloat(this.$host.find("#WAPROJ").val())
          ? parseFloat(this.$host.find("#WAPROJ").val())
          : 0) * parseFloat(this.vCOFA_B);
    }
    if (this.vDMCF_B == "2") {
      this.vORQA_temp =
        (parseFloat(this.$host.find("#WAPROJ").val())
          ? parseFloat(this.$host.find("#WAPROJ").val())
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
    if (
      (parseFloat(this.$host.find("#WWBAQT").val()) > 0 &&
        this.$host.find("#WAMFPC").val() &&
        this.$host.find("#WAMFPC").val().trim() == "") ||
      (parseFloat(this.$host.find("#WWBAQT").val()) > 0 &&
        !this.$host.find("#WAMFPC").val())
    ) {
      this.$host.find("#WWORQA").ready(() => {
        this.$host
          .find("#WWORQA")
          .val(
            `${Number(
              (
                parseFloat(this.$host.find("#WAPROJ").val()) *
                parseFloat(this.$host.find("#WWBAQT").val())
              ).toFixed(3)
            )}`
          );
      });
      this.$host.find("#WAELNO").val("");
    }
  }

  private calculQB(): void {
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
      this.vORQA_temp.toString().trim() !=
      this.$host.find("#WAPROJ").val().trim()
    ) {
      this.$host.find("#WAPROJ").ready(() => {
        this.$host.find("#WAPROJ").val(`${Number(this.vORQA_temp.toFixed(3))}`);
      });
    }

    //gestion en mode Rendement
    if (
      (parseFloat(this.$host.find("#WWBAQT").val()) > 0 &&
        this.$host.find("#WAMFPC").val() &&
        this.$host.find("#WAMFPC").val().trim() == "") ||
      (parseFloat(this.$host.find("#WWBAQT").val()) > 0 &&
        !this.$host.find("#WAMFPC").val())
    ) {
      this.$host.find("#WAPROJ").ready(() => {
        this.$host
          .find("#WAPROJ")
          .val(
            `${Number(
              (
                parseFloat(this.$host.find("#WWORQA").val()) /
                parseFloat(this.$host.find("#WWBAQT").val())
              ).toFixed(3)
            )}`
          );
      });
      this.$host.find("#WAELNO").val("");
    }
  }
}
