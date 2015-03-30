define(function() {
	var $ = function (selector) {
        return new $.fn.constructor(selector);
    };

    $.fn = $.prototype = {
        constructor: function (selector) {




            this[0] = selector;

            return this;
        },

        // 删除当前节点
        remove: function () {
            var ele = this[0];
            ele.parentNode.removeChild(ele);
            return this;
        },

        // 绑定元素
        bind: function (type, callback) {
            var ele = this[0];
            if(ele.addEventListener){
                ele.addEventListener(type, callback, false)
            }else if(ele.attachEvent){
                ele.attachEvent("on"+type, callback)
            }
            return this;
        }
    };

    $.fn.constructor.prototype = $.fn;

    return $;
});