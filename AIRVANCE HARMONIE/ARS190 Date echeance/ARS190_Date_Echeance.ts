/*
    H5Script ARS190_Date_Echeance
  * @author: Joel Randrianarivelo
  * @version: 1.0.0
  * @since: 2024-11-04
*/

class ARS190_Date_Echeance {
    //private argument: string;
    private controller: IInstanceController;
    private contentElement: IContentElement;
    private CONO: string;
    private DIVI: string;
    private miService;
  
    constructor(scriptArgs: IScriptArgs) {
      //this.argument = scriptArgs.args;
      this.controller = scriptArgs.controller;
      this.contentElement = this.controller.GetContentElement();
      this.CONO = ScriptUtil.GetUserContext().CONO;
      this.DIVI = ScriptUtil.GetUserContext().DIVI;
      if (ScriptUtil.version >= 2.0) {
        this.miService = MIService;
      } else {
        this.miService = MIService.Current;
      }
    }
  
    public static Init(args: IScriptArgs) {
      new ARS190_Date_Echeance(args).run();
    }
  
    private async run() {
        //@ts-ignore
        this.controller.ShowBusyIndicator();

      //get all group with status 0 and in the CONO and DIVI
      const request = new MIRequest()
      request.program = 'EXPORTMI'
      request.transaction = 'Select'
      request.record = {
        SEPC : '$',
        QERY : `F1CONO, F1DIVI, F1JBNO, F1JBDT, F1JBTM, F1LITX from FSLGP1 where F1GPST = '0' and F1CONO = '${this.CONO}' and F1DIVI = '${this.DIVI}'`
      }
      request.outputFields = ['REPL']
      try{
        //@ts-ignore
        const response = await this.miService.executeRequestV2(
            request
        );
        const {items} = response
        for (let item of items){
            const tmp = item['REPL'].split('$')
            const cono = tmp[0]
            const divi = tmp[1]
            const jbno = tmp[2]
            const jbdt = tmp[3]
            const jbtm = tmp[4]
            const litx = tmp[5]

            if (litx.includes('||ECH:')){
                const tmp2 = litx.split('||ECH:')
                const dudt = tmp2[1]
                const request2 = new MIRequest()
                request2.program = 'EXPORTMI'
                request2.transaction = 'Select'
                request2.record = {
                    SEPC : '$',
                    QERY : `F2CONO, F2DIVI, F2JBNO, F2JBDT, F2JBTM, F2GRPA from FSLGP2 where F2CONO = '${cono}' and F2DIVI = '${divi}' and F2JBNO = '${jbno}' and F2JBDT = '${jbdt}' and F2JBTM = '${jbtm}'`
                }
                try{
                    //@ts-ignore
                    const response2 = await this.miService.executeRequestV2(
                        request2
                    );
                    const items2 = response2.items
                    for (let item2 of items2){
                        const tmp3 = item2['REPL'].split('$')
                        const grpa = tmp3[5]
                        const request3 = new MIRequest()
                        request3.program = 'EXT190MI'
                        request3.transaction = 'UpdFSLGP2'
                        request3.record = {
                            CONO : cono,
                            DIVI : divi,
                            JBNO : jbno,
                            JBDT : jbdt,
                            JBTM : jbtm,
                            GRPA : grpa,
                            DUDT : this.formatDate(dudt)
                        }
                        try{
                            //@ts-ignore
                            const response3 = await this.miService.executeRequestV2(
                                request3
                            );
                            const item3 = response3.item
                            if (item3['RSLT'] == 'KO') throw 'erreur'
                        }catch(e : any){
                            console.error('Erreur lors de la modification du fature : ',item2)
                        }
                    }
                }catch(e : any){
                    console.error('Erreur lors de la récupération des factures du groupe : ',item)
                }
            }
        }
      }catch(e : any){
        console.error('Erreur lors de la récupération des groupes')
      }
      //@ts-ignore
      this.controller.HideBusyIndicator();
    }

    private formatDate(date : string) : string{
        let res : string = date.split('/').join('')
        return res
    }
  }
  