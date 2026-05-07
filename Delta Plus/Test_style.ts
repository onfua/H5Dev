class Test_style {
    private miService;
    private controller: IInstanceController;
    private contentElement: IContentElement;
    private $host: JQuery;
    private btnExist: boolean = false;
    DATAGRID_ID = "OIS100_Browse_EX97_datagrid";
    BTNCLOSE_ID = "OIS100_Browse_EX97_btnClose";
    allData: any[] = [];

    constructor(scriptArgs: IScriptArgs) {
        this.controller = scriptArgs.controller;
        if (ScriptUtil.version >= 2.0) {
            this.miService = MIService;
        } else {
            this.miService = MIService.Current;
        }
        this.$host = this.controller.ParentWindow;
        this.contentElement = this.controller.GetContentElement();
    }

    public static Init(args: IScriptArgs) {
        new Test_style(args).run();
    }

    private run() {
        const list = ListControl.ListView.GetDatagrid(this.controller);
        //@ts-ignore        
        const row = list.getRowElement(0) as HTMLElement;
        $(row).css("background-color", "yellow");
    }
}