/*
    H5Script EX104_OIS101_customgrid
  * @author: Joel Randrianarivelo
  * @version: 1.0.0
  * @since: 21-11-2025
  * @description: Add a custom column on OIS101 datagrid
*/
/**
 * CHANGELOGS
 * Version    Date       User        Description
 * 1.0.0   21-11-2025    JOEL        Initial Release
 */

class EX104_OIS101_customgrid {
    private miService;
    private controller: IInstanceController;
    private $host: JQuery;
    private list: IActiveGrid
    private PONRData: any[] = [];
    allData: any[] = [];

    constructor(scriptArgs: IScriptArgs) {
        this.controller = scriptArgs.controller;
        if (ScriptUtil.version >= 2.0) {
            this.miService = MIService;
        } else {
            this.miService = MIService.Current;
        }
        this.$host = this.controller.ParentWindow;
        this.list = ListControl.ListView.GetDatagrid(this.controller);
    }

    public static Init(args: IScriptArgs) {
        new EX104_OIS101_customgrid(args).run();
    }

    private run() {

        const len = this.list.getColumns().length;
        this.appendColumn(this.list, len + 1);
        this.appendMBAVIQData()


    }

    private appendColumn(list: IActiveGrid, columnNum: number) {
        let columns = list.getColumns();
        let newColumn = {
            id: 'MBAVIQ',
            field: 'MBAVIQ',
            name: "Av issue Qty",
            width: 100,
        }
        if (columns.length < columnNum) {
            columns.push(newColumn);
        }
        list.setColumns(columns);

    }

    private async appendMBAVIQData() {
        await this.getPONR()
        let dataset = this.list.getData()
        for (let i = 0; i < dataset.length; i++) {
            const data = dataset[i];
            const find = this.PONRData.find(x => x.PONR == data.OBPONR)
            const whlo = find[0]?find[0].WHLO:find.WHLO || ''//this.controller.GetValue('OBWHLO')
            const itno = data.OBITNO
            const aviq = await this.getMBAVIQ(itno, whlo)
            data['MBAVIQ'] = aviq
        }
        this.list.setData(dataset)
        //await new Promise((resolve) => setTimeout(() => resolve, 100))
        dataset = this.list.getData()
        
        for (let i = 0; i < dataset.length; i++) {
            const data = dataset[i];
            const columns = this.list.getColumns()
            if (parseFloat(data.OBORQT) > parseFloat(data.MBAVIQ)) {
                //@ts-ignore        
                const row = this.list.getRowElement(i) as HTMLElement;
                const children = $(row).children();
                //$(row).css("background-color", "#ff9292ff");
                for (let j = 0; j < columns.length; j++) {
                    if (columns[j].fullName == 'MBAVIQ' || columns[j].fullName == 'OBORQT') {
                        $(children[j]).css("background-color", "#ff9292ff");
                    }
                }
            }

        }
    }

    private async getMBAVIQ(itemNo: string, whlo: string) {
        const req: MIRequest = new MIRequest();
        req.program = "MMS200MI";
        req.transaction = "GetItmWhsBasic";
        req.record = {
            ITNO: itemNo,
            WHLO: whlo
        };
        req.outputFields = ['AVIQ']
        try {
            //@ts-ignore
            const response = await this.miService.executeRequestV2(req);
            return response.items[0]['AVIQ'];
        } catch {
            return 0;
        }
    }

    private async getPONR(){
        const req: MIRequest = new MIRequest();
        req.program = "OIS100MI";
        req.transaction = "LstLine";
        req.record = {
            ORNO: this.controller.GetValue("OAORNO")
        };
        req.outputFields = ['PONR','WHLO']
        try{
            //@ts-ignore
            const response = await this.miService.executeRequestV2(req);
            this.PONRData = response.items;
        }catch{}
    }
}