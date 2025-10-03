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

class H5_OIS380B_corrective_mtd {
    private controller: IInstanceController;
    private $host: JQuery;

    constructor(scriptArgs: IScriptArgs) {
        this.controller = scriptArgs.controller;
        this.$host = this.controller.ParentWindow;
    }

    public static Init(args: IScriptArgs) {
        new H5_OIS380B_corrective_mtd(args).run();
    }

    private run() {
        //get the field W1CIME
        const fieldW1CIME = $(this.controller.GetElement('W1CIME') as HTMLElement);
        SessionCache.Remove('correctiveMtd');
        SessionCache.Add('correctiveMtd', fieldW1CIME.val() as string);
        
        //action when the field change
        fieldW1CIME.on('change', () => {

            //get the value of the field
            const correctiveMtd = fieldW1CIME.val() as string;
            
            //stock in session variable
            SessionCache.Remove('correctiveMtd');
            SessionCache.Add('correctiveMtd', correctiveMtd);
        });
    }
}