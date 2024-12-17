"use strict";
var InjectScript = /** @class */ (function () {
    function InjectScript(scriptArgs) {
        this.argument = scriptArgs.args;
    }
    InjectScript.Init = function (args) {
        new InjectScript(args).run();
    };
    InjectScript.prototype.run = function () {
        ScriptUtil.LoadScript("http://127.0.0.1:5500/dist/C04_Gestion_de_conversion/C04_PMS010E_ConvertBatchOF.js", function (data) {
            console.log(data);
        });
    };
    return InjectScript;
}());
