/*
    H5Script ARS191_Date_Echeance
  * @author: Joel Randrianarivelo
  * @version: 1.0.0
  * @since: 2024-10-28
*/

class ARS191_Date_Echeance {
  private argument: string;
  private controller: IInstanceController;
  private contentElement: IContentElement;
  private CONO: string;
  private DIVI: string;
  private $host: JQuery;
  private POPUP_ID: string;
  private gris: boolean;
  private miService;

  constructor(scriptArgs: IScriptArgs) {
    this.argument = scriptArgs.args;
    this.controller = scriptArgs.controller;
    this.contentElement = this.controller.GetContentElement();
    this.$host = this.controller.ParentWindow;
    this.CONO = ScriptUtil.GetUserContext().CONO;
    this.DIVI = ScriptUtil.GetUserContext().DIVI;
    this.POPUP_ID = "popup_alert_ars191";
    this.gris = false;
    if (ScriptUtil.version >= 2.0) {
      this.miService = MIService;
    } else {
      this.miService = MIService.Current;
    }
  }

  public static Init(args: IScriptArgs) {
    new ARS191_Date_Echeance(args).run();
  }

  private addBtn(): void {
    const btnSequencer = new ButtonElement();
    btnSequencer.Name = "BtnPreNext";
    btnSequencer.Value = "FIGER DATE D'ECHEANCE";
    btnSequencer.Position = new PositionElement();
    btnSequencer.Position.Top = 4;
    btnSequencer.Position.Left = 69;
    btnSequencer.Position.Width = 10;
    this.contentElement.AddElement(btnSequencer);
  }

  private async run() {
    this.gris = false;
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("");
      }, 1000);
    });
    this.$host.find("#WWLITX").val("");
    this.$host.find("#WTDUDT").val("");
    this.validated();

    this.$host.find("#WFPYCD").ready(() => {
      this.$host.find("#WFPYCD").on("change", () => {
        this.validated();
      });
    });

    this.$host.find("#WTPYCD").ready(() => {
      this.$host.find("#WTPYCD").on("change", () => {
        this.validated();
      });
    });

    this.$host.find("#WEUPCD").ready(() => {
      this.$host.find("#WEUPCD").on("change", () => {
        //@ts-ignore
        this.contentElement.RemoveScriptComponents();
        if (
          this.$host.find("#WFPYCD").val() == "LCR" &&
          this.$host.find("#WTPYCD").val() == "LCR" &&
          !this.$host.find("#WEUPCD").prop("checked")
        ) {
          this.action();
        } else {
          this.$host.find("#btn-next").removeAttr("disabled");
          this.$host.find("#WWLITX").removeAttr("disabled");
          this.$host.find("#WWLITX").val("");
          this.$host.find("#WWLITX").css({ "pointer-events": "auto" });
          this.gris = false;
        }
      });
    });

    this.$host.find("#WTDUDT").ready(() => {
      this.$host.find("#WTDUDT").on("change", async () => {
        if (this.gris) {
          const tmp = this.$host.find("#WWLITX").val();
          
          this.$host.find("#WTDUDT").ready(() => {
            let obj;
            const tp = this.$host.find("#WTDUDT")[0];
            for (const key of Object.keys(tp)) {
              //@ts-ignore
              if (tp[key].datepicker) {
                //@ts-ignore
                obj = tp[key].datepicker;
                break;
              }
            }
            if (obj && obj.currentDay) {
              const date = `${obj.currentYear}/${(obj.currentMonth + 1 + "")
                //@ts-ignore
                .padStart(2, "0")}/${(obj.currentDay + "").padStart(2, "0")}`;
              const res = tmp.split("||ECH:")[0] + "||ECH:" + date;
              this.$host.find("#WWLITX").val(res);
            } else {
              this.showPopupText("Mettez une date d'echéance", "warning");
            }
          });
        }
      });
    });
  }

  private validated(): void {
    //@ts-ignore
    this.contentElement.RemoveScriptComponents();
    if (
      this.$host.find("#WFPYCD").val() == "LCR" &&
      this.$host.find("#WTPYCD").val() == "LCR" &&
      this.$host.find("#WEUPCD").prop("checked")
    ) {
      this.action();
    } else {
      this.$host.find("#btn-next").removeAttr("disabled");
      this.$host.find("#WWLITX").removeAttr("disabled");
      this.$host.find("#WWLITX").css({ "pointer-events": "auto" });
      this.$host.find("#WWLITX").val("");
      this.gris = false;
    }
  }

  private async action() {
    /*const req = new MIRequest()
    req.program = 'MNS150MI'
    req.transaction = 'GetUserData'
    req.outputFields = ['DTFM','USID']
    let dtfm = ''
    try{
      //@ts-ignore
      const res = await this.miService.executeRequestV2(req)
      dtfm = res.item['DTFM']
      if (dtfm == 'YMD') {
        this.showPopupText(
          "Si vous saisissez la date d'echéance manuellement, veuillez mettre dans le format aa/mm/jj",
          "warning"
        );
      }
      if (dtfm == 'DMY') {
        this.showPopupText(
          "Si vous saisissez la date d'echéance manuellement, veuillez mettre dans le format jj/mm/yy",
          "warning"
        );
      }
      if (dtfm == 'MDY') {
        this.showPopupText(
          "Si vous saisissez la date d'echéance manuellement, veuillez mettre dans le format mm/jj/yy",
          "warning"
        );
      }
    }catch(e){
      console.error(e)
    }*/
    this.$host.find("#btn-next").attr("disabled", "true");
    this.addBtn();
    this.$host.find("#BtnPreNext").ready(() => {
      this.$host.find("#BtnPreNext").click((e: Event) => {
        e.preventDefault();
        this.$host.find("#WWLITX").ready(() => {
          /*if (!this.$host.find('#WWLITX').val().includes('||ECH:')){
            this.$host.find('#WWLITX').val(`${this.$host.find('#WWLITX').val()}||ECH:${this.$host.find('#WTDUDT').val()}`) 
          }*/
          const tmp = this.$host.find("#WWLITX").val();
          this.$host.find("#WTDUDT").ready(() => {
            let obj;
            const tp = this.$host.find("#WTDUDT")[0];
            for (const key of Object.keys(tp)) {
              //@ts-ignore
              if (tp[key].datepicker) {
                //@ts-ignore
                obj = tp[key].datepicker;
                break;
              }
            }
            if (obj && obj.currentDay) {
              const date = `${obj.currentYear}/${(obj.currentMonth + 1 + "")
                //@ts-ignore
                .padStart(2, "0")}/${(obj.currentDay + "").padStart(2, "0")}`;
              const res = tmp.split("||ECH:")[0] + "||ECH:" + date;
              this.$host.find("#WWLITX").val(res);
              this.$host.find("#WWLITX").attr("disabled", "true");
              this.gris = true;
              this.$host.find("#WWLITX").css({ "pointer-events": "none" });
              this.$host.find("#btn-next").removeAttr("disabled");
              this.$host.find("#BtnPreNext").ready(() => {
                this.$host.find("#BtnPreNext").attr("disabled", "true");
              });
            } else {
              this.showPopupText("Mettez une date d'echéance", "warning");
            }
          });
        });
      });
    });
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
