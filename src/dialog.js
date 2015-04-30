/**
 * dialog模块
 *
 * @module dialog
 *
 */


/** @namespace Dialog */

define(function (require) {
    /**
     *
     * @constructor
     * @alias module:dialog
     * @param {Object} config - 对象字面量
     * @return {Function} Dialog - 返回函数
     */

    // "use strict";
    //var type = require("type");
    //var jQuery = require("jquery");

    var $ = require("core");

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

        // 确定
        if (config.ok) {
            config.button.push({
                id: "ok",
                value: config.okValue,
                callback: config.ok
            });
        }

        // 取消
        if (config.cancel) {
            config.button.push({
                id: "cancel",
                value: config.cancelValue,
                callback: config.cancel
            });
        }

        // 每个dialog生成唯一ID
        config.id = "dialog" + (+new Date());


        return new Dialog.prototype._create(config); // #001 new一个对象
    };

    // 默认配置参数
    Dialog.defaults = {
        // 确定
        ok: null,
        okValue: "确定",
        // 取消
        cancel: null,
        cancelValue: "取消",
        fixed: false,
        // 锁屏
        lock: false,
        zIndex: 1987
    }

    Dialog.prototype = {
        constructor: Dialog,

        _create: function (config) {
            var dom;

            this.dom = dom = this._innerHTML(config); // 加载html结构
            this.button.apply(this, config.button); // 自定义按钮

            dom.wrap.css("position", config.fixed ? "fixed" : "absolute");
            dom.wrap.css({
               // "z-index": config.zIndex,
                width: 'auto',
                "-webkit-transform": "rotate(2deg)"
            });

            this.position(); // 位置

            this.zIndex();
            config.lock && this.lock();

            this._addEvent(); // 绑定事件
        },

        /** 图层顺序 */
        zIndex: function () {
            var
                dom = this.dom,
                mask = this.mask,
                index = Dialog.defaults.zIndex++;

            dom.wrap.css({"z-index": index});

            return this;
        },


        /** 设置锁屏 */
        lock: function (index) {
            var
                doc = document,
                body = doc.body,
                mask,
                index = Dialog.defaults.zIndex - 1;

            this.zIndex();

            mask = doc.createElement("div");
            mask.className = "d-mask";

            // 锁屏
            this.mask = $(mask);
            this.mask.css({"z-index": index})

            body.appendChild(mask);

            return this;
        },

        /*
        * 疑问:
        * 1.每个对象的位置一样? A: button和css 位置
        * 2.兼容scrollTop ?  A: win.pageYOffset || doc.docElement.scrollTop
        *
        * */
        position: function () {

            var doc = document,
                width = doc.body.clientWidth,
                left = (width - this.wrap.clientWidth) / 2,
                win = doc.defaultView || doc.parentWindow,
               // scrollTop兼容处理
               top = win.pageYOffset || doc.documentElement.scrollTop;

            this.wrap.style.left =  left + "px";
            this.wrap.style.top =  (top + 50) + "px";

            return this;
        },

        _innerHTML: function (data) {
            // 创建最外层元素
            var wrap = this.wrap = document.createElement("div");
            var body = document.body;
            // 获得键值对,以便操作元素
            var elements = wrap.getElementsByTagName("*"),
                dom = {},
                key,
                i;

            wrap.innerHTML = this._html();

            for (i = 0; i < elements.length; i++) {
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

        // 确定和取消按钮
        button: function () {
            var dom = this.dom,
                $buttons = dom.buttons[0],
                args = [].slice.call(arguments),    // 把类数组转换为数组
                listener = this._listener = {};  // 事件回调组

            var val, i, id = "", button;

            for (i = 0; i < args.length; i++) {
                val = args[i];
                id = val.id;
                button = document.createElement("input");
                button.type = "button";
                button.value = val.value;
                // 标记id,鼠标点击确定、取消时用
                button.setAttribute("data-id", id);
                button.className = "d-button"

                // 事件回调
                listener[id] = {}
                listener[id].callback = val.callback;

                // 按钮添加到dom里
                $buttons.appendChild(button);

            }

            return this;

        },

        // 事件委托
        _addEvent: function () {
            var that = this,
                dom = that.dom,
                id, //目标元素的id
                target; // 目标元素

            // 委托在最外层元素上
            dom.wrap.bind("click", function (e) { 
			
				var target = e.target || window.event.srcElement
				
                if (target == dom.close[0]) { // 关闭
                    that.close();
                } else {
                    id = target.getAttribute("data-id");
                    // 确定or取消
                    id && that._click(id);
                }
            });

            return this;
        },

        // 按钮回调触发
        _click: function (id) {
            var fn = this._listener[id] && this._listener[id].callback;
            // 处理回调非函数 和回调里包含 return false不关闭
            return typeof fn !== "function" || fn.call(this) !== false ?
                this.close() :
                this;
        },

        // 关闭对话框
        close: function () {
            var dom = this.dom;
            dom.wrap.remove();
            this.mask && this.mask.remove();
            return this;
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

 具体问题:
 1.z-index怎么关联到dialog, lock锁屏层
 2.关闭时怎样关闭对应的lock锁屏层


 得到:
 1.加深链式调用的理解--this

 知识点:
 1.直接调用模块Dialog，内部就已经进行new 对象操作了
 2. 在构造函数里new的对象是 Dialog原型上的函数 Dialog.prototype._create。
 3. 然后new的对象的函数的原型 等于 模块Dialog的原型
 Dialog.prototype._create.prototype = Dialog.prototype;
 这样 Dialog.prototype._create就获得 Dialog.prototype上所有的方法


 
 (1) 数组相关
	 数组去重 检查页面重复ID





 */
