define(function (require) {
    // "use strict";

    //var type = require("type");
    var $ = require("core");
    //var jQuery = require("jquery");


    var Dialog = function (config) {
        //this.age = 25; // 严格模式不通过

        config = config || {};

        // 合并默认配置参数
        for (var i in Dialog.defaults) {
            if (config[i] === undefined) {
                config[i] = Dialog.defaults[i];
            }
        }

        if (!$.isArray(config.button)) {
            config.button = [];
        }

        // 确定按钮
        if (config.ok) {
            config.button.push({
                id: "ok",
                value: config.okValue,
                callback:  config.ok
            });
        }


        return new Dialog.prototype._create(config); // #001 new一个对象
    };

    Dialog.defaults = {
        // 取消
        cancel: null,
        hi: null,
        awa: null,
        // 确定
        ok: null,
        okValue: "确定OK"
    }

    Dialog.prototype = {
        constructor: Dialog,

        _create: function (config) {
            var dom;
            // 加载html结构
            this.dom = dom = this._innerHTML(config);

            this.button.call(config.button);

            this._addEvent();
        },

        _innerHTML: function (data) {
            // 创建最外层元素
            var wrap = this.wrap = document.createElement("div");
            var body = document.body;
            // 获得键值对,以便操作元素
            var elements = wrap.getElementsByTagName("*"),
                dom = {},
                key;

            wrap.innerHTML = this._html();

            for (var i = 0; i < elements.length; i++) {
                key = elements[i].className.split("-")[1];
                if (key) {
                    dom[key] = $(elements[i]);
                }
            }

            dom.wrap = $(wrap);
            // 作为body后第一个元素插入
            body.insertBefore(wrap, body.firstChild);
            return dom;
        },

        button: function (data) {
            var that = this;
            var dom = this.dom;

        },

        // 事件委托
        _addEvent: function () {
            var that = this,
                dom = that.dom;

            dom.wrap.bind("click", function (e) {
                that.close(e);
            });

        },

        // 关闭对话框
        close: function (e) {
            var dom = this.dom;
            e = e || event;
            var target = e.target || e.srcElement;
            if (target == dom.close[0]) {
                dom.wrap.remove();
            }
        },

        _html: function (config) {
            var _html = '<div class="dialog-outer" data-alert="alert">' +
                '<div class="dialog-title">' +
                '<span>对话框</span>' +
                '<span class="dialog-close">&times;</span>' +
                '</div>' +
                '<div class="dialog-content">内容</div>' +
                '<div class="dialog-buttons">' +
                    //'<button class="dialog-ok">确定</button>' +
                    //'<button class="dialog-cancel">取消</button>' +
                '</div>' +
                '</div>';
            return _html;
        }

    };

    Dialog.prototype._create.prototype = Dialog.prototype;

    return Dialog;

});

/*

 疑问:
 1. dialog对话框调用过程是怎样的?
 2. 我应该提供什么样的接口?
 3.

 思想:
 1.不依赖任何库,调用简单
 2.适应当前，面向未来


 得到:
 1.加深链式调用的理解--this

 知识点:
 1.直接调用模块Dialog，内部就已经进行new 对象操作了
 2. 在构造函数里new的对象是 Dialog原型上的函数 Dialog.prototype._create。
 3. 然后new的对象的函数的原型 等于 模块Dialog的原型
 Dialog.prototype._create.prototype = Dialog.prototype;
 这样 Dialog.prototype._create就获得 Dialog.prototype上所有的方法


 // 取消按钮
 if(data.cancel){
 var cancel = '<button class="dialog-cancel">取消</button>';
 dom.btn.innerHTML = cancel;
 }



 // 确定按钮
 if (data.ok) {
 var ele = document.createElement("button");
 ele.className = "dialog-ok";
 var text = document.createTextNode("确定");
 ele.appendChild(text)
 // var ok = '<button class="dialog-ok">确定</button>';
 dom.btn.appendChild(ele);

 // 回调确定按钮,并关闭
 if (type.isFunction(data.ok)) {
 ele.onclick = data.ok;
 }

 }


 dom.close.onclick = function(){
 body.removeChild(wrap);
 };

 */
