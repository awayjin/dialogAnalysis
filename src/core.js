 define(function () {

     /**
      * js基础库
      * @param {object} selector
      *
      * @module  js基础库
      */

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

        /**
         * 添加事件监听.
         * @param   {string}    事件类型
         * @param   {Function}  监听函数
         * */
        bind: function (type, callback) {
            var ele = this[0];
            if (ele.addEventListener) {
                ele.addEventListener(type, callback, false)
            } else if (ele.attachEvent) {
                ele.attachEvent("on" + type, callback)
            }
            return this;
        }
    };

    $.fn.constructor.prototype = $.fn;


    // 基本类型检测
    $.type = function (obj) {
        var class2type = {}, // 存放各类型的 [object NativeConstructorName]
            toString = class2type.toString,
             // 可检测是否布尔值 数值 字符串 函数 数组 日期 正则 对象字面量 错误类型
            objType = "Boolean Number String Function Array Date RegExp Object Error Symbol",
            arr = objType.split(" "), // 把objType变成数组
            i; // arr数组的下标

        for (i in arr) {
            class2type["[object" + " " + arr[i] + "]"] = arr[i].toLowerCase();
        }

        // 这为了检测null,因为typeof null是object
        if (obj == null) {
            return obj + ""; // 这里必须要加一个"",才能返回字符
        }

        return typeof obj === "function" || typeof obj === "object" ?
            class2type[ toString.call(obj) ] :
            typeof obj;
    };

    // 函数检测
    $.isFunction = function (obj) {
        return $.type(obj) === "function";
    };

    // 数组检测
    $.isArray = function (arr) {
        return $.type(arr)  === "array";
    }

    return $;
});