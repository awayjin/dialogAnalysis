define(function(require){

    var $ = require("jquery");
    $("body").append("<h1>away seajs</h1>");

    var pur = {};
    pur.alert = function(message){
        var msg = message,
            _html = "",
            doc = document,
            body = doc.body,
            wrap;

        _html = '<div class="dialog-outer" data-alert="alert">' +
        '<div class="dialog-title">' +
        '<span>对话框</span>' +
        '<span class="dialog-close">&times;</span>' +
        '</div>' +
        '<div class="dialog-content">内容</div>' +
        '<div class="dialog-btn">' +
        '<button class="dialog-ok">确定</button>' +
        '<button class="dialog-cancel">取消</button>' +
        '</div>' +
        '</div>';

        //创建最外层元素
        wrap = doc.createElement("div");
        wrap.innerHTML = _html;

        //作为body后第一个元素插入
        body.insertBefore(wrap, body.firstChild);

        var i,
            eles, //得到所有元素
            elesLen,
            obj = {},
            name;

        eles = wrap.getElementsByTagName("*");
        elesLen = eles.length;


        for(i=0; i<elesLen; i++){
            name = eles[i].className.split("-")[1];
            obj[name] = eles[i];
        }

        obj["close"].onclick = function(){
            wrap.style.display = "none";
        }

        obj["cancel"].onclick = function(){
            wrap.style.display = "none";
        }


    }

    return pur;
});