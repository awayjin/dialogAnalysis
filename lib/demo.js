define(function(require){
    var $ = require("./jquery");
    var dialog = require("dialog");

    $("body").prepend("<h1>away title</h1>");

    dialog();

    return dialog
});