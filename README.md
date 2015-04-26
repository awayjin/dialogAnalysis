# dialogAnalysis
native dialog analysis

# JavaScript知识结构

#A.原始类型Primitive
## 1.Boolean 

## 2.Number

## 3.String
	String.prototype.replace()
	
## 4.Undefined

## 5.Null

## 6.Symbol

#B.复杂数据类型
## 7.Object
    类型检测
    	typeof /s/  // chrome1-12 return function
    	Object.prototype.toString.call(RegExp)
	对象自身属性检测
		{}.hasOwnProperty(prop)
		Object.prototype.hasOwnProperty.call(o, prop); // 安全的检测
		
### 7.1Function
        7.1.1 apply和call	

### 7.2RegExp
        7.2.1 test和search 是否匹配
        7.2.2 exec和search 是否匹配，得到更多的信息

### 7.3Array
	    7.3.1 转换数组
	    [].slice.call(arguments)	// IE8 COM对象非DOM对象 
		
#C.文档对象类型 
	##8.DOM与COM-标准与IE8-
	
	###8.1 事件监听器 addEventListener和attachEvent
		// 标准
		ele.addEventLisnter(type, function(event){
			callback.call(ele, event)
		}, false);
		// IE8-
		ele.attachEvent("on"+type, function(event){
			callback.call(ele, window.event)
		});
	
	###8.2 取消事件冒泡
		event.stopPropation(); // 标准
		window.event.cancelBubble = true; // IE8-
		
	###8.3 取消默认事件
		event.preventDefault(); // 标准
		window.event.returnValue = false; // IE8-
		
#D.Window对象
	#9.Window对象
		##9.1 scollTop
		self == window.self;
		document.defaultView.pageYOffset // 标准
		document.parentWindow.pageYOffset //IE 
		document.documentElement.scollTop  // IE
		self.pageYOffset || document.documentElement.scrollTop // 兼容
		
