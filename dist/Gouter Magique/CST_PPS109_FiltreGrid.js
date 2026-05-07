"use strict";
var CST_PPS109_FiltreGrid = /** @class */ (function () {
    function CST_PPS109_FiltreGrid(scriptArgs) {
        this.allData = [];
        this.controller = scriptArgs.controller;
        this.$host = this.controller.ParentWindow;
    }
    CST_PPS109_FiltreGrid.Init = function (args) {
        new CST_PPS109_FiltreGrid(args).run();
    };
    CST_PPS109_FiltreGrid.prototype.run = function () {
        var _a;
        var list = ListControl.ListView.GetDatagrid(this.controller);
        var shadowRoot1 = this.$host.find("ids-data-grid")[0].shadowRoot;
        var shadowRoot2 = (_a = shadowRoot1 === null || shadowRoot1 === void 0 ? void 0 : shadowRoot1.querySelector("#ids-data-grid-filter-WSRAFD-PPA109BS")) === null || _a === void 0 ? void 0 : _a.shadowRoot;
        //@ts-ignore
        var inputFilter = $(shadowRoot2 === null || shadowRoot2 === void 0 ? void 0 : shadowRoot2.querySelector("input"));
        var date = new Date().toISOString().slice(2, 5).replace(/-/g, '');
        // console.log('filterInput',inputFilter.parent());
        if (inputFilter.val() === date + '0101')
            return;
        inputFilter.val(date + '0101');
        inputFilter.trigger('input');
        inputFilter.trigger('change');
        inputFilter.focus();
        this.controller.PressKey('ENTER');
    };
    return CST_PPS109_FiltreGrid;
}());
