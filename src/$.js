define(function() {
	var $ = function (selector, context) {
            return new $.fn.constructor(selector, context);
        },
        quickExpr = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]+)$)/,
        rclass = /[\n\t]/g;

    if (window.$ === undefined) {
        window.$ = $;
    };

    $.fn = $.prototype = {

        constructor: function (selector, context) {
            var match, elem;
            context = context || document;

            if (!selector) {
                return this;
            };

            if (selector.nodeType) {
                this[0] = selector;
                return this;
            };

            if (typeof selector === 'string') {
                match = quickExpr.exec(selector);

                if (match && match[2]) {
                    elem = context.getElementById(match[2]);
                    if (elem && elem.parentNode) this[0] = elem;
                    return this;
                };
            };

            this[0] = selector;
            return this;
        },

        /**
         * 判断样式类是否存在
         * @param	{String}	名称
         * @return	{Boolean}
         */
        hasClass: function (name) {
            var className = ' ' + name + ' ';

            if ((' ' + this[0].className + ' ').replace(rclass, ' ').indexOf(className) > -1) {
                return true;
            };

            return false;
        },

        /**
         * 添加样式类
         * @param	{String}	名称
         */
        addClass: function (name) {
            if (!this.hasClass(name)) {
                this[0].className += ' ' + name;
            };

            return this;
        },

        /**
         * 移除样式类
         * @param	{String}	名称
         */
        removeClass: function (name) {
            var elem = this[0];

            if (!name) {
                elem.className = '';
            } else
            if (this.hasClass(name)) {
                elem.className = elem.className.replace(name, ' ');
            };

            return this;
        },

        /**
         * 读写样式<br />
         * css(name) 访问第一个匹配元素的样式属性<br />
         * css(properties) 把一个"名/值对"对象设置为所有匹配元素的样式属性<br />
         * css(name, value) 在所有匹配的元素中，设置一个样式属性的值<br />
         */
        css: function (name, value) {
            var i, elem = this[0], obj = arguments[0];

            if (typeof name === 'string') {
                if (value === undefined) {
                    return $.css(elem, name);
                } else {
                    elem.style[name] = value;
                };
            } else {
                for (i in obj) {
                    elem.style[i] = obj[i];
                };
            };

            return this;
        },

        /** 显示元素 */
        show: function () {
            return this.css('display', 'block');
        },

        /** 隐藏元素 */
        hide: function () {
            return this.css('display', 'none');
        },

        /**
         * 获取相对文档的坐标
         * @return	{Object}	返回left、top的数值
         */
        offset: function () {
            var elem = this[0],
                box = elem.getBoundingClientRect(),
                doc = elem.ownerDocument,
                body = doc.body,
                docElem = doc.documentElement,
                clientTop = docElem.clientTop || body.clientTop || 0,
                clientLeft = docElem.clientLeft || body.clientLeft || 0,
                top = box.top + (self.pageYOffset || docElem.scrollTop) - clientTop,
                left = box.left + (self.pageXOffset || docElem.scrollLeft) - clientLeft;

            return {
                left: left,
                top: top
            };
        },

        /**
         * 读写HTML - (不支持文本框)
         * @param	{String}	内容
         */
        html: function (content) {
            var elem = this[0];

            if (content === undefined) return elem.innerHTML;
            $.cleanData(elem.getElementsByTagName('*'));
            elem.innerHTML = content;

            return this;
        },

        /**
         * 移除节点
         */
        remove: function () {
            var elem = this[0];

            $.cleanData(elem.getElementsByTagName('*'));
            $.cleanData([elem]);
            elem.parentNode.removeChild(elem);

            return this;
        },

        /**
         * 事件绑定
         * @param	{String}	类型
         * @param	{Function}	要绑定的函数
         */
        bind: function (type, callback) {
            $.event.add(this[0], type, callback);
            return this;
        },

        /**
         * 移除事件
         * @param	{String}	类型
         * @param	{Function}	要卸载的函数
         */
        unbind: function(type, callback) {
            $.event.remove(this[0], type, callback);
            return this;
        }

    };

    $.fn.constructor.prototype = $.fn;


    /** 检测window */
    $.isWindow = function (obj) {
        return obj && typeof obj === 'object' && 'setInterval' in obj;
    };


    /**
     * 搜索子元素
     * 注意：只支持nodeName或.className的形式，并且只返回第一个元素
     * @param	{String}
     */
    $.fn.find = function (expr) {
        var value, elem = this[0],
            className = expr.split('.')[1];

        if (className) {
            if (document.getElementsByClassName) {
                value = elem.getElementsByClassName(className);
            } else {
                value = getElementsByClassName(className, elem);
            };
        } else {
            value = elem.getElementsByTagName(expr);
        };

        return $(value[0]);
    };
    function getElementsByClassName (className, node, tag) {
        node = node || document;
        tag = tag || '*';
        var i = 0,
            j = 0,
            classElements = [],
            els = node.getElementsByTagName(tag),
            elsLen = els.length,
            pattern = new RegExp("(^|\\s)" + className + "(\\s|$)");

        for (; i < elsLen; i ++) {
            if (pattern.test(els[i].className)) {
                classElements[j] = els[i];
                j ++;
            };
        };
        return classElements;
    };

    /**
     * 遍历
     * @param {Object}
     * @param {Function}
     */
    $.each = function (obj, callback) {
        var name, i = 0,
            length = obj.length,
            isObj = length === undefined;

        if (isObj) {
            for (name in obj) {
                if (callback.call(obj[name], name, obj[name]) === false) {
                    break;
                };
            };
        } else {
            for (
                var value = obj[0];
                i < length && callback.call(value, i, value) !== false;
                value = obj[++i]
            ) {};
        };

        return obj;
    };

    /**
     * 读写缓存
     * @param		{HTMLElement}	元素
     * @param		{String}		缓存名称
     * @param		{Any}			数据
     * @return		{Any}			如果无参数data则返回缓存数据
     */
    $.data = function (elem, name, data) {
        var cache = $.cache,
            id = uuid(elem);

        if (name === undefined) {
            return cache[id];
        };

        if (!cache[id]) {
            cache[id] = {};
        };

        if (data !== undefined) {
            cache[id][name] = data;
        };

        return cache[id][name];
    };

    /**
     * 删除缓存
     * @param		{HTMLElement}	元素
     * @param		{String}		缓存名称
     */
    $.removeData = function (elem, name) {
        var empty = true,
            expando = $.expando,
            cache = $.cache,
            id = uuid(elem),
            thisCache = id && cache[id];

        if (!thisCache) {
            return;
        };

        if (name) {

            delete thisCache[name];
            for (var n in thisCache) {
                empty = false;
            };

            if (empty) {
                delete $.cache[id];
            };

        } else {

            delete cache[id];

            if (elem.removeAttribute) {
                elem.removeAttribute(expando);
            } else {
                elem[expando] = null;
            };

        };
    };

    $.uuid = 0;
    $.cache = {};
    $.expando = '@cache' + (+ new Date);

// 标记元素唯一身份
    function uuid (elem) {
        var expando = $.expando,
            id = elem === window ? 0 : elem[expando];
        if (id === undefined) elem[expando] = id = ++ $.uuid;
        return id;
    };


    /**
     * 事件机制
     * @namespace
     * @requires	[$.data, $.removeData]
     */
    $.event = {

        /**
         * 添加事件
         * @param		{HTMLElement}	元素
         * @param		{String}		事件类型
         * @param		{Function}		要添加的函数
         */
        add: function (elem, type, callback) {
            var cache, listeners,
                that = $.event,
                data = $.data(elem, '@events') || $.data(elem, '@events', {});

            cache = data[type] = data[type] || {};
            listeners = cache.listeners = cache.listeners || [];
            listeners.push(callback);

            if (!cache.handler) {
                cache.elem = elem;
                cache.handler = that.handler(cache);

                elem.addEventListener
                    ? elem.addEventListener(type, cache.handler, false)
                    : elem.attachEvent('on' + type, cache.handler);
            };
        },

        /**
         * 卸载事件
         * @param		{HTMLElement}	元素
         * @param		{String}		事件类型
         * @param		{Function}		要卸载的函数
         */
        remove: function (elem, type, callback) {
            var i, cache, listeners,
                that = $.event,
                empty = true,
                data = $.data(elem, '@events');

            if (!data) {
                return;
            };

            if (!type) {
                for (i in data) that.remove(elem, i);
                return;
            };

            cache = data[type];

            if (!cache) {
                return;
            };

            listeners = cache.listeners;
            if (callback) {
                for (i = 0; i < listeners.length; i ++) {
                    listeners[i] === callback && listeners.splice(i--, 1);
                };
            } else {
                cache.listeners = [];
            };

            if (cache.listeners.length === 0) {
                elem.removeEventListener
                    ? elem.removeEventListener(type, cache.handler, false)
                    : elem.detachEvent('on' + type, cache.handler);

                delete data[type];
                cache = $.data(elem, '@events');

                for (var n in cache) {
                    empty = false;
                };

                if (empty) {
                    $.removeData(elem, '@events');
                };
            };
        },

        /** @inner 事件句柄 */
        handler: function (cache) {
            return function (event) {
                event = $.event.fix(event || window.event);
                for (var i = 0, list = cache.listeners, fn; fn = list[i++];) {
                    if (fn.call(cache.elem, event) === false) {
                        event.preventDefault();
                        event.stopPropagation();
                    };
                };
            };
        },

        /** @inner Event对象兼容处理 */
        fix: function (event) {
            if (event.target) {
                return event;
            };

            var eventObj = {
                target: event.srcElement || document,
                preventDefault: function () {event.returnValue = false},
                stopPropagation: function () {event.cancelBubble = true}
            };

            // IE6/7/8 在原生window.event对象写入数据会导致内存无法回收，应当采用拷贝
            for (var i in event) {
                eventObj[i] = event[i];
            }

            return eventObj;
        }

    };

    /**
     * 清理元素集的事件与缓存
     * @requires	[$.removeData, $.event]
     * @param		{HTMLCollection}	元素集
     */
    $.cleanData = function (elems) {
        var i = 0, elem,
            len = elems.length,
            removeEvent = $.event.remove,
            removeData = $.removeData;

        for (; i < len; i ++) {
            elem = elems[i];
            removeEvent(elem);
            removeData(elem);
        };
    };

// 获取css
    $.css = 'defaultView' in document && 'getComputedStyle' in document.defaultView ?
        function (elem, name) {
            return document.defaultView.getComputedStyle(elem, false)[name];
        } :
        function (elem, name) {
            return elem.currentStyle[name] || '';
        };


    /**
     * 获取滚动条位置 - [不支持写入]
     * $.fn.scrollLeft, $.fn.scrollTop
     * @example		获取文档垂直滚动条：$(document).scrollTop()
     * @return		{Number}	返回滚动条位置
     */
    $.each(['Left', 'Top'], function (i, name) {
        var method = 'scroll' + name;

        $.fn[method] = function () {
            var elem = this[0], win;

            win = getWindow(elem);
            return win ?
                ('pageXOffset' in win) ?
                    win[i ? 'pageYOffset' : 'pageXOffset'] :
                win.document.documentElement[method] || win.document.body[method] :
                elem[method];
        };
    });

    function getWindow (elem) {
        return $.isWindow(elem) ?
            elem :
            elem.nodeType === 9 ?
            elem.defaultView || elem.parentWindow :
                false;
    };

    /**
     * 获取窗口或文档尺寸 - [只支持window与document读取]
     * @example
     获取文档宽度：$(document).width()
     获取可视范围：$(window).width()
     * @return	{Number}
     */
    $.each(['Height', 'Width'], function (i, name) {
        var type = name.toLowerCase();

        $.fn[type] = function (size) {
            var elem = this[0];
            if (!elem) {
                return size == null ? null : this;
            };

            return $.isWindow(elem) ?
            elem.document.documentElement['client' + name] || elem.document.body['client' + name] :
                (elem.nodeType === 9) ?
                    Math.max(
                        elem.documentElement['client' + name],
                        elem.body['scroll' + name], elem.documentElement['scroll' + name],
                        elem.body['offset' + name], elem.documentElement['offset' + name]
                    ) : null;
        };

    });

    return $;
	
});