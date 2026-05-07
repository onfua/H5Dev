"use strict";
var Test_style = /** @class */ (function () {
    function Test_style(scriptArgs) {
        this.btnExist = false;
        this.DATAGRID_ID = "OIS100_Browse_EX97_datagrid";
        this.BTNCLOSE_ID = "OIS100_Browse_EX97_btnClose";
        this.allData = [];
        this.controller = scriptArgs.controller;
        if (ScriptUtil.version >= 2.0) {
            this.miService = MIService;
        }
        else {
            this.miService = MIService.Current;
        }
        this.$host = this.controller.ParentWindow;
        this.contentElement = this.controller.GetContentElement();
    }
    Test_style.Init = function (args) {
        new Test_style(args).run();
    };
    Test_style.prototype.run = function () {
        var list = ListControl.ListView.GetDatagrid(this.controller);
        //@ts-ignore        
        var row = list.getRowElement(0);
        $(row).css("background-color", "yellow");
    };
    return Test_style;
}());
