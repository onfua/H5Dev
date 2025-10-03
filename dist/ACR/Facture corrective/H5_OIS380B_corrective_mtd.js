"use strict";
/*
    H5Script H5_OIS380B_corrective_mtd
  * @author: Joel Randrianarivelo
  * @version: 1.0.0
  * @since: 03-10-2025
  * @description: Get the corrective method and stock in session variable
*/
/**
 * CHANGELOGS
 * Version    Date       User        Description
 * 1.0.0   03-10-2025    JOEL        Initial Release
 */
var H5_OIS380B_corrective_mtd = /** @class */ (function () {
    function H5_OIS380B_corrective_mtd(scriptArgs) {
        this.controller = scriptArgs.controller;
        this.$host = this.controller.ParentWindow;
    }
    H5_OIS380B_corrective_mtd.Init = function (args) {
        new H5_OIS380B_corrective_mtd(args).run();
    };
    H5_OIS380B_corrective_mtd.prototype.run = function () {
        //get the field W1CIME
        var fieldW1CIME = $(this.controller.GetElement('W1CIME'));
        SessionCache.Remove('correctiveMtd');
        SessionCache.Add('correctiveMtd', fieldW1CIME.val());
        //action when the field change
        fieldW1CIME.on('change', function () {
            //get the value of the field
            var correctiveMtd = fieldW1CIME.val();
            //stock in session variable
            SessionCache.Remove('correctiveMtd');
            SessionCache.Add('correctiveMtd', correctiveMtd);
        });
    };
    return H5_OIS380B_corrective_mtd;
}());
