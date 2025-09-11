"use strict";
/*
    H5Script C02_PPS201F_ProtectFieldPROD
  * @author: Joel Randrianarivelo
  * @version: 1.0.0
  * @since: 10-09-2025
  * @description: Protect a field from argument
*/
/**
 * CHANGELOGS
 * Version    Date       User        Description
 * 1.0.0   10-09-2025    JOEL        Initial Release
 */
var C02_PPS201F_ProtectFieldPROD = /** @class */ (function () {
    function C02_PPS201F_ProtectFieldPROD(scriptArgs) {
        this.controller = scriptArgs.controller;
        this.$host = this.controller.ParentWindow;
        this.argument = scriptArgs.args;
    }
    C02_PPS201F_ProtectFieldPROD.Init = function (args) {
        new C02_PPS201F_ProtectFieldPROD(args).run();
    };
    C02_PPS201F_ProtectFieldPROD.prototype.run = function () {
        //get the field by argument
        var field = this.$host.find("#".concat(this.argument));
        if (field.length) {
            field.prop('readonly', true);
            field.prop('disabled', true);
        }
    };
    return C02_PPS201F_ProtectFieldPROD;
}());
