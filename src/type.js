define(function(){
    "use strict";

    // 基本类型检测
    var type = function (obj) {

        var class2type = {}, // 存放各类型的 [object NativeConstructorName]
            toString = class2type.toString,
            objType = "Boolean Number String Function Array Date RegExp Object Error Symbol", // 可检测是否布尔值 数值 字符串 函数 数组 日期 正则 对象字面量 错误类型
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
    type.isFunction = function(obj){
        return type(obj) === "function";
    };

    // 数组检测
    type.isArray = function (arr) {
        return type(arr)  === "array";
    }

    return type;
});

/*
var class2type = {}, // 存放各类型的 [object NativeConstructorName]
    toString = class2type.toString,
// 可检测是否布尔值 数值 字符串 函数 数组 日期 正则 对象字面量 错误类型
    objType = "Boolean Number String Function Array Date RegExp Object Error",
    arr = objType.split(" ");


for (var i in arr) {
    class2type["[object" + " " + arr[i] + "]"] = arr[i].toLowerCase();
}

//基本类型检测
var type = function (obj) {

    // 这为了检测null,因为typeof null是object
    if (obj == null) {
        return obj + ""; // 这里必须要加一个"",才能返回字符
    }

    return typeof obj === "function" || typeof obj === "object" ?
        class2type[ toString.call(obj) ] :
        typeof obj;
}

// 函数检测
function isFunction(obj) {
    return type(obj) === "function";
}
console.log("func:", isFunction(function(){}));
console.log("func:", isFunction([]) );

// 数组检测
function isArray(arr) {
    return type(arr)  === "array";
}
console.log("array:", isArray([]) );
console.log("array:", isArray({}) );

// 布尔值检测
function isBoolean(obj) {
    return type(arr) === "boolean"
}

// 布尔值
console.log("type:", type(false) === "boolean" );

// null
console.log("null:", type(null) === "null" );


 */