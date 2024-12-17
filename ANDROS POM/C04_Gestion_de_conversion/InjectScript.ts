class InjectScript{
    private argument : string
    
    constructor(scriptArgs : IScriptArgs){
        this.argument = scriptArgs.args
    }

    public static Init(args : IScriptArgs){
        new InjectScript(args).run()
    }

    private run() : void{
        ScriptUtil.LoadScript("http://127.0.0.1:5500/dist/C04_Gestion_de_conversion/C04_PMS010E_ConvertBatchOF.js",(data : any) => {
            console.log(data)
        })
    }
}