# dialogAnalysis
native dialog analysis

# js知识结构
1. String
2. Boolean
3. Number

4. RegExp
	4.1 test和search 是否匹配
	4.2 exec和search 是否匹配，得到更多的信息

5. Array
	5.1 转换数组: [].slice.call(arguments)	// IE8 COM对象非DOM对象 
	
6. Object
	6.1 类型检测
		typeof /s/  // chrome1-12 return function
		Object.prototype.toString.call(RegExp)

7. Function
	7.1 apply和call	