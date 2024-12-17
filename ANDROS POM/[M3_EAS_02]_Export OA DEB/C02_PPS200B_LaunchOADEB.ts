/*
    H5Script C02_PPS200B_LaunchOADEB
  * @author: Joel Randrianarivelo
  * @version: 1.0.0
  * @since: 2024-11-15
*/
/**
 * CHANGELOGS
 * Version    Date       User        Description
 * 1.0.0      151124     JOEL        Initial Release
 * 1.0.1      191124     JOEL        Correction
 */

class C02_PPS200B_LaunchOADEB {
  private controller: IInstanceController;
  private miService;
  private contentElement: IContentElement;
  private POPUP_ID: string;
  private POPUP_CLOSE_ID: string;
  private POPUP_CONFIRM_ID: string;
  private iFDAT: string;
  private iTDAT: string;
  private iSUNO: string;
  private DATAGRID_ID: string;
  private BTNCLOSE_ID: string;
  private $host: JQuery;

  constructor(scriptArgs: IScriptArgs) {
    this.controller = scriptArgs.controller;
    if (ScriptUtil.version >= 2.0) {
      this.miService = MIService;
    } else {
      this.miService = MIService.Current;
    }
    this.contentElement = this.controller.GetContentElement();
    this.POPUP_ID = "POPUP_EASYLOG";
    this.POPUP_CLOSE_ID = "POPUP_EASYLOG_CLOSE";
    this.POPUP_CONFIRM_ID = "POPUP_EASYLOG_CONFIRM";
    this.iFDAT = "";
    this.iTDAT = "";
    this.iSUNO = "";
    this.DATAGRID_ID = "DATAGRID_SUNO";
    this.BTNCLOSE_ID = "BTNCLOSE_SUNO";
    this.$host = this.controller.ParentWindow;
  }

  public static Init(args: IScriptArgs) {
    new C02_PPS200B_LaunchOADEB(args).run();
  }

  private async run() {
    const ordreTri = this.controller.GetSortingOrder();
    if (ordreTri == "21") {
      this.createButton();
      this.$host.find("#EnvEasylog").on("click", (e: Event) => {
        e.preventDefault();
        this.showPopup();
      });
    }
  }

  private createButton() {
    const btnSend = new ButtonElement();
    btnSend.Name = "EnvEasylog";
    btnSend.Value = "Envoi vers Easylog";
    btnSend.Position = new PositionElement();
    btnSend.Position.Top = 7;
    btnSend.Position.Left = 70;
    btnSend.Position.Width = 15;
    this.contentElement.AddElement(btnSend);
  }

  private showPopup() {
    const _this = this;
    const popupContent = $(
      `<div id="${this.POPUP_ID}" style="height:350px">
            </div>`
    );

    const popupButtons = [
      {
        text: "Annuler",
        width: 85,
        id: this.POPUP_CLOSE_ID,
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
        id: this.POPUP_CONFIRM_ID,
        click: function (event: Event, model: any) {
          //confirm action
          _this.runConfirm(this, model);
        },
      },
    ];

    const titleTxt = "Envoi vers Easylog";

    const popupOptions = {
      title: titleTxt,
      dialogType: "General",
      modal: true,
      width: 500,
      minHeight: 300,
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
                <span><p>Date réception de : </p><input type="text" id="inputFDAT" value="${this.iFDAT}" style="width: 150px"/></span>
                <span><p>A : </p><input type="text" id="inputTDAT" value="${this.iTDAT}" style="width: 150px"/></span>
                <span><p>Code Fournisseur : </p><input type="text" id="inputSUNO" value="${this.iSUNO}" style="width: 300px!important"/></span>
            </div>
        `);
    this.createDatePicker("inputFDAT");
    this.createDatePicker("inputTDAT");
    $("#inputSUNO").ready(() => {
      this.makeBrowserable("inputSUNO");
    });
    $("#inputFDAT").ready(() => {
      $("#inputFDAT").on("change", () => {
        $("#inputFDAT").ready(() => {
          this.iFDAT = $("#inputFDAT").val();
        });
      });
    });
    $("#inputTDAT").ready(() => {
      $("#inputTDAT").on("change", () => {
        $("#inputTDAT").ready(() => {
          this.iTDAT = $("#inputTDAT").val();
        });
      });
    });
    $("#inputSUNO").ready(() => {
      $("#inputSUNO").on("change", () => {
        $("#inputSUNO").ready(() => {
          this.iSUNO = $("#inputSUNO").val();
        });
      });
    });
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
        this.fetchFournisseur();
      });

    const style =
      $("#" + browseField).attr("style") + "padding-right: 18px !important";

    //ajout F4 listener
    $("#" + browseField)
      .attr("style", style)
      .keydown((e: KeyboardEvent) => {
        if (e.which === 115) {
          this.showBrowseDialog();
          this.fetchFournisseur();
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

    const titleTxt = "Fournisseur";

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

  private async fetchFournisseur() {
    const columns = [
      { id: "SUSUNO", field: "SUSUNO", name: "Code", filterType: "text" },
      { id: "SUSUNM", field: "SUSUNM", name: "Nom", filterType: "text" },
    ];

    const selectedField = "SUSUNO";

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
        $("#inputSUNO").ready(() => {
          $("#inputSUNO").val(args[0].data[selectedField]).focus();
          this.iSUNO = args[0].data[selectedField];
          ScriptUtil.version >= 2.0
            ? $("#" + this.BTNCLOSE_ID).click()
            : $(this).inforDialog("close");
        });
      });

    const request = new MIRequest();
    request.program = "CRS620MI";
    request.transaction = "LstSuppliers";
    request.outputFields = ["SUNO", "SUNM"];
    try {
      //@ts-ignore
      const response = await this.miService.executeRequestV2(request);
      const { items } = response;
      const resultat = items.map((item: any) => {
        return {
          SUSUNO: item["SUNO"],
          SUSUNM: item["SUNM"],
        };
      });

      $("#" + this.DATAGRID_ID)
        .data("datagrid")
        .updateDataset(resultat);
    } catch (e: any) {
      console.error("Error on CRS620MI");
    }
  }

  private createDatePicker(id: string) {
    $(`#${id}`).ready(() => {
      $(`#${id}`).datepicker({
        dateFormat: "yyyy/MM/dd",
      });
    });
  }

  //traitement
  private async runConfirm(modal: any, model: any) {
    //RG01 : Contrôle cohérence date et formatage
    if (this.iFDAT.trim() != "" && this.iTDAT.trim() != "") {
      if (this.isDateGreater(this.iTDAT, this.iFDAT)) {
        //RG02 : Contrôle existence données
        const requestCheck = new MIRequest();
        requestCheck.program = "CRS620MI";
        requestCheck.transaction = "GetBasicData";
        requestCheck.outputFields = ["SUNO"];
        requestCheck.record = {
          SUNO: this.iSUNO,
        };
        try {
          //@ts-ignore
          const responseCheck = await this.miService.executeRequestV2(
            requestCheck
          );
          //RG02 : Contrôle existence données
          if (responseCheck.items.length == 0) {
            if (this.iSUNO.trim() != "") {
              this.showPopupText(
                `Fournisseur ${this.iSUNO} n'existe pas`,
                "warning"
              );
              return;
            }
          }
          //RG04 : Initialisation des données
          /*if (this.iSUNO.trim() == "") {
              this.iSUNO = "?";
            }*/
          //RG05 : Déclencheur interface
          const requestInterface = new MIRequest();
          requestInterface.program = "CUSEXTMI";
          requestInterface.transaction = "ChgAlphaKPI";
          console.log(this.iSUNO);
          requestInterface.record = {
            KPID: "INTERFACE",
            PK01: "CustomTriggerDEB_Sync_Out",
            AL30: this.iFDAT.split("/").join(""),
            AL31: this.iTDAT.split("/").join(""),
            AL32: this.iSUNO.trim() == "" ? "?" : this.iSUNO.trim(),
          };
          try {
            //@ts-ignore
            const res = await this.miService.executeRequestV2(requestInterface);
            console.log(res);
            if (ScriptUtil.version >= 2.0) {
              model.close(true);
            } else {
              $(modal).inforDialog("close");
            }
            this.showPopupText(
              "La sélection a bien été envoyée à l'ESB",
              "success"
            );
          } catch (e: any) {
            console.error("Error on CUSEXTMI.ChgAlphaKPI");
            this.showPopupText(`Erreur API`, "error");
          }
        } catch (e: any) {
          console.error("Error on CRS620MI.GetBasicData");
          //RG02 : Contrôle existence données
          this.showPopupText(
            `Fournisseur ${this.iSUNO} n'existe pas`,
            "warning"
          );
        }
      } else {
        this.showPopupText("Date De doit être inférieur à Date à", "warning");
      }
    } else {
      this.showPopupText("Date obligatoire!", "warning");
    }
  }

  private isDateGreater(dateF: string, dateT: string): boolean {
    const d1 = new Date(dateF);
    const d2 = new Date(dateT);

    return d1 > d2;
  }

  private showPopupText(message: string, type: string) {
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
