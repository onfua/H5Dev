/*
    H5Script C04_PMS230B_SommeBatchOF
  * @author: Joel Randrianarivelo
  * @version: 1.0.0
  * @since: 2024-10-24
  * @description: Calcul de la somme des quantités des OA selectionnés
*/
/**
 * CHANGELOGS
 * Version    Date       User        Description
 * 1.0.0   24-10-2024    JOEL        Initial Release
 * 1.0.1   12-12-2024    JOEL        sauvegarde du tableau après changement de sequence
 */

class C04_PMS230B_SommeBatchOF {
  private argument: string;
  private FACI: string;
  private controller: IInstanceController;
  private contentElement: IContentElement;
  private totalStandart: number;
  private totalBatch: number;
  private grid: IActiveGrid;
  private $host: JQuery;

  constructor(scriptArgs: IScriptArgs) {
    this.argument = scriptArgs.args;
    this.controller = scriptArgs.controller;
    this.contentElement = this.controller.GetContentElement();
    this.FACI = ScriptUtil.GetUserContext().FACI;
    this.totalBatch = 0;
    this.totalStandart = 0;
    this.grid = this.controller.GetGrid();
    this.$host = this.controller.ParentWindow;
  }

  public static Init(args: IScriptArgs) {
    new C04_PMS230B_SommeBatchOF(args).run();
  }

  /** Ajout de label pour le champ ecran quantité standart */
  private addStandartLabel(): void {
    const labelElement = new LabelElement();
    labelElement.Name = "Qté_Standard";
    labelElement.Value = "Qté Standard";
    labelElement.Position = new PositionElement();
    labelElement.Position.Top = 3;
    labelElement.Position.Left = 40;
    this.contentElement.AddElement(labelElement);
  }

  /** Ajout de input pour le champ ecran quantité standart */
  private addStandartTextBox(): void {
    var textElement = new TextBoxElement();
    textElement.Name = "Q_S";
    textElement.Value = "0";
    textElement.Position = new PositionElement();
    textElement.Position.Top = 3;
    textElement.Position.Left = 48;
    textElement.Position.Width = 10;
    textElement.IsEnabled = false;
    this.contentElement.AddElement(textElement);
  }

  /** Ajout de label pour le champ ecran quantité batch */
  private addBatchLabel(): void {
    const labelElement = new LabelElement();
    labelElement.Name = "Qté_Batch";
    labelElement.Value = "Qté Batch";
    labelElement.Position = new PositionElement();
    labelElement.Position.Top = 3;
    labelElement.Position.Left = 62;
    this.contentElement.AddElement(labelElement);
  }

  /** Ajout de input pour le champ ecran quantité batch */
  private addBatchTextBox(): void {
    var textElement = new TextBoxElement();
    textElement.Name = "Q_B";
    textElement.Value = "0";
    textElement.Position = new PositionElement();
    textElement.Position.Top = 3;
    textElement.Position.Left = 69;
    textElement.Position.Width = 10;
    textElement.IsEnabled = false;
    this.contentElement.AddElement(textElement);
  }

  private addBtnSequencer(): void {
    const btnSequencer = new ButtonElement();
    btnSequencer.Name = "BtnSequencer";
    btnSequencer.Value = "Sequencer";
    btnSequencer.Position = new PositionElement();
    btnSequencer.Position.Top = 4;
    btnSequencer.Position.Left = 69;
    btnSequencer.Position.Width = 10;
    this.contentElement.AddElement(btnSequencer);
  }

  private run() {
    //RG00 : Récupération argument
    const argument = this.argument.split(",");
    const tabFACI: any = argument[0].split("/");
    const tabORTY: any = argument[1].split("/");

    console.info('1.0.1   12-12-2024    JOEL        sauvegarde du tableau après changement de sequence');
    //RG01 : Limitaiton du script
    if (this.controller.GetSortingOrder() == "2") {
      if (tabFACI.includes(this.FACI)) {
        //RG02 création de 2 champs spécifiques
        this.addStandartLabel();
        this.addStandartTextBox();
        this.addBatchLabel();
        this.addBatchTextBox();
        this.addBtnSequencer();

        const handler = (e: any, args: any) => {
          this.totalStandart = 0;
          for (let item of e.rows) {
            this.totalStandart += item.data["VHORQT"]
              ? parseFloat(item.data["VHORQT"].toString().replace(",", "."))
              : 0;
          }
          this.totalBatch = 0;
          for (let item of e.rows) {
            this.totalBatch += item.data["VHPROJ"]
              ? parseFloat(item.data["VHPROJ"].toString().replace(",", "."))
              : 0;
          }
          this.$host.find("#Q_S").val(this.totalStandart.toString());
          this.$host.find("#Q_B").val(Number(this.totalBatch.toFixed(3)).toString());
        };
        this.grid.onSelectedRowsChanged.subscribe(handler);

        //btnSequencer
        this.$host.find("#BtnSequencer").on("click", async (e: Event) => {
          e.preventDefault();
          let seq = 0;
          const tmp = this.grid.getData();
          const result = tmp.map((item: any) => {
            seq += 10;
            item.VOSCHS = seq.toString();
            return item;
          });
          // this.grid.setData(result);
          const columnId = 'VOSCHS';
          const list = ListControl.ListView.GetDatagrid(this.controller);
          const contents = list.getData().filter((item: any) => item.MMITDS);
          const len = ScriptUtil.version >= 2.0 ? contents.length : contents.getLength();



          for (let i = 0; i < len; i++) {
            // get the column Id letter (C1, C2 ...)
            let clId = "";
            const clName = columnId.substr(columnId.length - 4);
            list.getColumns().forEach(function (column) {
              if (column.name == clName) {
                clId = column.colId;
              }
            });
            // set changed data
            var key = "R" + (i + 1) + clId;
            //@ts-ignore
            list.editedCells[key] = { oldValue: "", newValue: result[i].VOSCHS };
            // set displayed data
            const data = list.getData()[i];
            data[columnId] = result[i].VOSCHS;
          }


          this.$host.find('#XT_0168').click()
        });
      }
    }
  }

  private updateRowCell(list: any, gridData: any, columns: any, rowNumber: any, columnName: any, clValue: any) {
    let clId = ''
    const clName = columnName.substr(columnName.length - 4)
    columns.forEach((col: any) => {
      if (col.name == clName) {
        clId = columnName.colId
      }
    })
  }
}
