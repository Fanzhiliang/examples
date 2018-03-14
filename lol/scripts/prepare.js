var ua = navigator.userAgent;
window.client = function(){//用户代理检测
	var engine = {
		//保存大概的版本浮点数，用来比较
		ie:0,
		gecko:0,
		webkit:0,
		khtml:0,
		opera:0,
		ver:null//具体的版本字符串
	};
	var browser = {
		//浏览器
		ie:0,
		firefox:0,
		safari:0,
		konq:0,
		opera:0,
		chrome:0,
		//具体版本
		ver:null
	};
	var system = {
		//识别平台
		win:false,
		mac:false,
		unix:false,
		//移动设备
		iphone:false,
		ipod:false,
		ipad:false,
		ios:false,
		android:false,
		nokiaN:false,
		winMobile:false,
		//游戏系统
		wii:false,
		ps:false
	}

	//识别浏览器
	if(window.opera){//识别opera
		engine.ver = browser.ver = window.opera.version();
		engine.opera = browser.opera = parseFloat(engine.ver);
	}else if(/AppleWebKit\/(\S+)/.test(ua)){//识别webkit
		engine.ver = RegExp.$1;
		engine.webkit = parseFloat(engine.ver);
		//确认是chrome还是safari
		if(/Chrome\/(\S+)/.test(ua)){
			browser.ver = RegExp.$1;
			browser.chrome = parseFloat(browser.ver);
		}else if(/Version\/(\S+)/.test(ua)){
			browser.ver = RegExp.$1;
			browser.safari = parseFloat(browser.ver);
		}else{
			safariVersion = 1;
			if(engine.webkit < 100){
				safariVersion = 1;
			}else if(engine.webkit < 312){
				safariVersion = 1.2;
			}else if(engine.webkit < 412){
				safariVersion = 1.3;
			}else{
				safariVersion = 2;
			}
			browser.safari = borwser.ver = safariVersion;
		}
	}else if(/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)){//识别khtml
		engine.ver = browser.ver = RegExp.$1;
		engine.khtml = browser.konq = parseFloat(engine.ver);
	}else if(/rv:([^\)]+) Gecko\/\d{8}/.test(ua)){//识别gecko
		engine.ver = RegExp.$1;
		engine.gecko = parseFloat(engine.ver);
		//确定是不是Firefox
		if(/Firefox\/(\S+)/.test(ua)){
			browser.ver = RegExp.$1;
			browser.firefox = parseFloat(browser.ver);
		}
	}else if(/MSIE ([^;]+)/.test(ua)){//识别ie
		engine.ver = browser.ver = RegExp.$1;
		engine.ie = browser.ie = parseFloat(engine.ver);
	}

	//识别平台
	var p = navigator.platform;
	system.win = p.indexOf("Win")!=-1;
	system.mac = p.indexOf("Mac")!=-1;
	system.unix = (p.indexOf("X11")!=-1) || (p.indexOf("Linux")!=-1);
	//识别Windows系统
	if(system.win){
		if(/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)){
			switch (RegExp.$2) {
				case "5.0":
					system.win = "2000";
					break;
				case "5.1":
					system.win = "XP";
					break;
				case "6.0":
					system.win = "Vista";
					break;
				case "6.1":
					system.win = "7";
					break;
				default:
					system.win = "NT";
					break;
			}
		}
	}else if(RegExp.$1 == "9x"){
		system.win = "ME";
	}else{
		system.win = RegExp.$1;
	}
	//检测iphone,ipod,ipad
	system.iphone = ua.indexOf("iPhone") != -1;
	system.ipod = ua.indexOf("iPod") != -1;
	system.ipad = ua.indexOf("iPad") != -1;
	//检测ios
	if(system.mac && ua.indexOf("Mobile") != -1){
		if(/CPU (?:iPone )?OS (\d+_\d+)/.test(ua)){
			system.ios = parseFloat(RegExp.$1.replace("_","."));
		}else{
			system.ios = 2;
		}
	}
	//检测Android
	if(/Android (\d+\.\d+)/.test(ua)){
		system.android = parseFloat(RegExp.$1);
	}
	//检测诺基亚
	system.nokiaN = ua.indexOf("NokiaN") != -1;
	//检测Windows Mobile(Windows CE)
	if(system.win == "CE"){
		system.winMobile = system.win;
	}else if(system.win == "Ph"){
		if(/Windows Phone OS (\d+.\d+)/.test(ua)){
			system.win = "Phone";
			system.winMobile = parseFloat(RegExp.$1);
		}
	}
	//检测游戏系统
	system.wii =ua.indexOf("Wii") !=-1;
	system.ps = /playstation/i.test(ua);

	return {
		engine:engine,
		browser:browser,
		system:system
	};
}();
//Event
window.EventUtil = {
	addHandler : function(element,type,handler){
		if(element.addEventListener){
			element.addEventListener(type, handler, false);
		}else if(element.attachEvent){
			element.attachEvent("on"+type,handler);
		}else{
			element["on"+type] = handler;
		}
	},
	removeHandler : function(element,type,handler){
		if(element.removeEventListener){
			element.removeEventListener(type, handler, false);
		}else if(element.detachEvent){
			element.detachEvent("on"+type,handler);
		}else{
			element["on"+type] = null;
		}
	},
	getEvent :　function(event){
		return window.event || event;
	},
	getTarget : function(event){
		return event.target||event.srcElement;
	},
	stopPropagation : function(event){//阻止事件继续传播
		if(event.stopPropagation){
			event.stopPropagation();
		}else if(event.cancelBubble){
			event.cancelBubble = true;//这个不是方法
		}
	},
	preventDefault : function(event){//阻止事件默认行为
		try {
			event.preventDefault();
		} catch(e) {
			event.returnValue = false;//ie
		}
	},
	getRelateTarget : function(event){//相关元素
		if(event.relatedTarget){
			return event.relatedTarget;
		}else if(event.toElement){//ie mouseout
			return event.toElement;
		}else if(event.fromElement){//ie mouseover
			return event.fromElement;
		}else{
			return null;
		}
	},
	getButton : function(event){//鼠标按钮
		if(document.implementation.hasFeature("MouseEvents","1.0")){//支持DOM版鼠标事件
			return event.button;
		}else{
			switch (event.button) {//ie8及之前浏览器的button属性很复杂
				case 0:
				case 1:
				case 3:
				case 5:
				case 7:
					return 0;
				case 2:
				case 6:
					return 2;
				case 4:
					return 1;
			}
		}
	},
	getWheelDelta : function(event){
		if(event.wheelDelta){
			//Opera早期正负相反
			return (client.engine.opera && client.engine.opera < 9.5 ? -event.wheelDelta : event.wheelDelta);
		}else{
			return -event.detail * 40;//Firefox
		}
	},
	getCharCode : function(event){
		if(typeof event.charCode == "number"){
			return event.charCode;
		}else{
			return event.keyCode;
		}
	},
	getClipboardText : function(event){
		var clipboardData = (event.clipboardData || window.clipboardData);
		return clipboardData.getData("text");
	},
	setClipboardText : function(event){
		if(event.clipboardData){
			return event.clipboardData.setDatta("text/plain",value);
		}else if(window.clipboardData){
			return window.clipboardData.setData("text", value);
		}
	},
};