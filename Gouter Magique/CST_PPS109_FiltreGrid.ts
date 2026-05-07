class CST_PPS109_FiltreGrid {
    private controller: IInstanceController;
    private $host: JQuery;
    allData: any[] = [];

    constructor(scriptArgs: IScriptArgs) {
        this.controller = scriptArgs.controller;
        this.$host = this.controller.ParentWindow;
    }

    public static Init(args: IScriptArgs) {
        new CST_PPS109_FiltreGrid(args).run();
    }

    private run() {
        const list = ListControl.ListView.GetDatagrid(this.controller);
        const shadowRoot1 = (this.$host.find(`ids-data-grid`)[0] as HTMLElement).shadowRoot;
        const shadowRoot2 = shadowRoot1?.querySelector(`#ids-data-grid-filter-WSRAFD-PPA109BS`)?.shadowRoot;
        //@ts-ignore
        const inputFilter = $(shadowRoot2?.querySelector(`input`))
        const date = new Date().toISOString().slice(2, 5).replace(/-/g, '');
        // console.log('filterInput',inputFilter.parent());
        if (inputFilter.val() === date + '0101') return;
        inputFilter.val(date + '0101');
        inputFilter.trigger('input')
        inputFilter.trigger('change');
        inputFilter.focus();
        this.controller.PressKey('ENTER')
    }
}