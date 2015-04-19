 define(function (require) {

     /**
      * js基础库
      * @param {object} selector
      *
      */

	// jQuery选择器  
	var sizzle = require("sizzle");  	
		  
    var $ = function (selector) {
		
		if (sizzle) {
			// selector = sizzle(selector);
		}


        return new $.fn.constructor(selector);
    };


    // 类名选择器
    function getClass(className) {
        if (document.getElementsByClassName) {
            return document.getElementsByClassName(className);
        } else {
            var arr = [],
                els = document.getElementsByTagName("*"),
                sim, j, i;
            for ( i=0; i<els.length; i++) {
                sim = els[i].className.split(" ");
                for( j=0; j< sim.length; j++) {
                    if( sim[j] === className ) {
                        arr.push(els[i]);
                    }

                }
            }
            return arr;
        }
    }

    $.fn = $.prototype = {
        constructor: function (selector) {


            if (typeof selector === "string") {
                if ( /([\.])/.test(selector) ) {
                    var className = getClass(selector.slice(1));
                    for (var i=0; i<className.length; i++) {
                        this[i] = className[i];
                    }
                    return this;
                }
            }

            //selector = document.getElementsByClassName( selector.slice(1) );

            if (typeof selector === "string2") {
                var sel = selector.slice(1);
                selector = document.getElementsByClassName(sel)[0];
            }


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
         * @param {string} type 事件类型
         * @param {Function} callback  监听函数
         */
        bind: function (type, callback) {
            var that = this[0];

			// 两个对象以上遍历 
			if (this[1]) {
				for (var i in this) {
					var num = parseInt(i);
					if (!isNaN(num)) {
						// ele = this[i];
					   // number.push(n)						
					   addEvent(this[i])
					}
				}
			} else {
				
				addEvent();
			}

            

            function addEvent (selecotr) {
                var ele = selecotr || that;
                if (ele.addEventListener) {
                    //ele.addEventListener(type, callback, false);
                    ele.addEventListener(type, function (e) {
						callback.call(ele, e)
					}, false);
					
                } else if (ele.attachEvent) {
                    // ele.attachEvent("on" + type, callback);
                    // 解决 IE8 以下this指向问题
                    ele.attachEvent("on" + type, function (e) {	
						// IE8传入window.event参数没用
                        callback.call(ele, window.event);
                    });
                }
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

     // 检查页面是否有重复id
     function isRepeatId(){
         var eles = document.getElementsByTagName("*");
         var arr = []; // 重复id数组
         var obj = {};
         var id = ''; // 重复id

         for (var i=0; i<eles.length; i++) {
             id = eles[i].id;
             if (id) {
                 // arr.push(id);
                 if ( obj[id] ) {
                     console.log("重复id:", id, ", 第一个元素位置:" + obj[id], ", 重复元素位置:" + i);
                     arr.push(id);
                 } else {
                     obj[id] = i;
                 }
             }

         }

         console.log(arr);

     }

     // 数组去重
     function isRepeatArray(){

         var arr = [];
         var obj2 = {};
         var arr2 = ["a", 232, 22, "a", 11, 22, "a", "sdfsd", "d", 11, "d"];


         for (var i=0; i<arr2.length; i++) {
             if ( !obj2[arr2[i]] ) {
                 arr.push(arr2[i]);
                 obj2[arr2[i]] = true;
             }
         }
         return arr;
     }

     // console.log(isRepeatArray());

    return $;
});