class H5SampleTest {
    private controller : IInstanceController
    private log : IScriptLog
    private args : string

    private contentElement : IContentElement

    constructor(scriptArgs : IScriptArgs){
        this.controller = scriptArgs.controller
        this.log = scriptArgs.log
        this.args = scriptArgs.args
        this.contentElement = this.controller.GetContentElement()
    }

    public static Init(args : IScriptArgs) : void {
        new H5SampleTest(args).run()
    }

    private run() : void{
        console.log('test')
    }
}