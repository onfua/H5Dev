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

class C02_PPS201F_ProtectFieldPROD {
    private controller: IInstanceController;
    private $host: JQuery;
    private argument: string;

    constructor(scriptArgs: IScriptArgs) {
        this.controller = scriptArgs.controller;
        this.$host = this.controller.ParentWindow;
        this.argument = scriptArgs.args;
    }

    public static Init(args: IScriptArgs) {
        new C02_PPS201F_ProtectFieldPROD(args).run();
    }

    private run() {
        //get the field by argument
        const field = this.$host.find(`#${this.argument}`);

        if (field.length) {
            field.prop('readonly', true);
            field.prop('disabled', true);
        }
    }
}