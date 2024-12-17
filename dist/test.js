"use strict";
var H5SampleTest = /** @class */ (function () {
    function H5SampleTest(scriptArgs) {
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
        this.args = scriptArgs.args;
        this.contentElement = this.controller.GetContentElement();
    }
    H5SampleTest.Init = function (args) {
        new H5SampleTest(args).run();
    };
    H5SampleTest.prototype.run = function () {
        console.log('test');
    };
    return H5SampleTest;
}());
