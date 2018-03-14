$(document).ready(function(){
window.Tools = function(){
	var tools = {};
	//事件
	tools.EventUtil = {
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
			if (event.preventDefault) {
				event.preventDefault();
			} else if(event.returnValue){
				event.returnValue = false;//ie
			}
		},
		getCharCode : function(event){
			if(typeof event.charCode == "number"){
				return event.charCode;
			}else{
				return event.keyCode;
			}
		}
	};
	//宽度高度
	tools.pageWidth = window.innerWidth,
	tools.pageHeight = window.innerHeight;
	if(typeof tools.pageWidth != "number"){
		if (document.compatMode == "CSS1Compat") {
			tools.pageWidth = document.documentElement.clientWidth;
			tools.pageHeight = document.documentElement.clientHeight;
		} else {
			tools.pageWidth = document.body.clientWidth;
			tools.pageHeight = document.body.clientHeight;
		}
	}
	//表单工具
	tools.FormScript = function(){
		var pair = [],i,len,j,optionsLen,option,selectStr,field,
			trim = function(value){
				return value.replace(/^\s+|\s+$/,"");
			};
		return	{
					isNull : function(field){
						switch (field.type) {
							case "text":
							case "password":
							case "textarea":
								if(trim(field.value)===""){
									return true;
								}
								return false;
							case "checkbox":
								if(!field.checked){
									var checkboxs = document.getElementsByName(field.name);
									for (var i = checkboxs.length - 1; i >= 0; i--) {
										if(checkboxs[i].checked){
											return false;
										}
									}
									return true;
								}
								return false;
							case "select-one":
							case "select-multiple":
								for (i = field.options.length - 1; i >= 0; i--) {
									option = field.options[i];
									if(option.selected){
										if(trim(option.value)!==""&&trim(option.innerHTML)!=="")
										return false;
									}
								}
								return true;
							default:
								return undefined;
						}
					},
					realLength :function(field){
						if(this.isNull(field)) return 0;
						switch (field.type) {
							case "text":
							case "password":
							case "textarea":
								return trim(field.value).length;
							default:
								return 0;
						}
					}
				}
	}();
	//当前时间
	tools.getNowFormatDate = function(date,seperator2){
	    var seperator1 = "-",
	    	seperator3 = ":",
	    	month = date.getMonth() + 1,
	    	strDate = date.getDate(),
	    	strHours = date.getHours(),
	    	strMinutes = date.getMinutes(),
	    	strSeconds = date.getSeconds();
	    if (month >= 1 && month <= 9) {
	        month = "0" + month;
	    }
	    if (strDate >= 0 && strDate <= 9) {
	        strDate = "0" + strDate;
	    }
	    if (strHours >= 0 && strHours <= 9) {
	        strHours = "0" + strHours;
	    }
	    if (strMinutes >= 0 && strMinutes <= 9) {
	        strMinutes = "0" + strMinutes;
	    }
	    if (strSeconds >= 0 && strSeconds <= 9) {
	        strSeconds = "0" + strSeconds;
	    }
	    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
	            + seperator2 + strHours + seperator3 + strMinutes
	            + seperator3 + strSeconds;
	    return currentdate;
	}
	return tools;
}();
Object.prototype.hover = function(enter,leave){
	Tools.EventUtil.addHandler(this,"mouseenter",enter);
	Tools.EventUtil.addHandler(this,"mouseleave",leave);
};
Object.prototype.getStyles = function(){//获得多个样式
	if(this.currentStyle)
		return this.currentStyle;
	else
		return getComputedStyle(this, null);
};
Object.prototype.setStyle = function(attr,value){//设置单个样式
	if(this.getStyles())
		this.style[attr] = value;
};
Object.prototype.getStyle = function(attr){//获得单个样式,并处理返回
	if(this.getStyles()){
		var styleString = this.style[attr],
			styleNumber = parseFloat(styleString);
		return isNaN(styleNumber)?styleString:styleNumber;
	}
};
window.globalPage = function(window,document){
	var i,len,
		addClassName = function(element,clazz){
			if(!element || !clazz) return false;
			if(!element.className) clazz = " "+clazz;
			element.className += clazz;
			return clazz;
		},
		deleteClassName = function(element,clazz){//删除class
			if(!element || !element.className || !clazz) return false;
			// var classNames = element.classList,classList不是数组不能用下面的splice方法
			var classNames = element.className.split(/\s+/),
				flag = -1;
			for (var i = 0,len = classNames.length; i < len; i++) {
				if(classNames[i] == clazz){
					flag = i;
					break;
				}
			}
			if(flag == -1) return false;
			classNames.splice(i,1);
			var result = classNames.join(" ");
			element.className = result;
			return result;
		},
		isArray = function(o){//判断是否是数组
			return Object.prototype.toString.call(o)=='[object Array]';
		},
		globalPage={
			cycleThreads : [],
			moveThreads : []
		},
		HeadDrop = function(){//下拉上拉
			var dropDownBut = $("#drop-down"),
				dropUpBut = $("#drop-up"),
				dropHeadNav = $("#drop-head-nav"),
				dropHeadNavDisplay = function(event){
					event.preventDefault();
					event.stopPropagation();
					deleteClassName(dropHeadNav[0],"drop-up");
					addClassName(dropHeadNav[0],"drop-down");
					return false;
				},
				dropHeadNavHidden = function(event){
					event.preventDefault();
					event.stopPropagation();
					deleteClassName(dropHeadNav[0],"drop-down");
					addClassName(dropHeadNav[0],"drop-up");
					return false;
				};
			//绑定事件
			dropDownBut.on("click",dropHeadNavDisplay);
			dropUpBut.on("click",dropHeadNavHidden);
			this.dropDown = dropHeadNavDisplay;
			this.dropUp = dropHeadNavHidden;
		},
		Slider = function(scrollx,speed,interval,cycleInterval){
			var cycleThreadsID = (function(len){return len;})(globalPage.cycleThreads.length),
				moveThreadsID = (function(len){return len;})(globalPage.moveThreads.length),
				i,len,
				setItems = function(temp,itemsTagName,isSetStyle){
					if(temp.length>0){
						var i,len,
							itemsParent = temp[0],
							items = itemsParent.getElementsByTagName(itemsTagName);
						if(items.length>0){
							if(isSetStyle){
								itemsParent.setStyle("width",items.length+"00%");
								itemsParent.setStyle("marginLeft","0%");
							}
							for(i=0,len=items.length;i<len;++i){
								items[i].itemsParent = itemsParent;
								items[i].index = (function(i){return i})(i);
							}
							itemsParent.curritems = items[0];
							itemsParent.items = items;
							return itemsParent;
						}
					}return false;
				},
				// 修改margin-left使图片移动
				images = setItems(scrollx.getElementsByClassName("images"),"li",true),
				trig = setItems(scrollx.getElementsByClassName("trig"),"a",false),
				// title = setItems(scrollx.getElementsByClassName("title"),"a",false),
				//speed为-左移，为+右移  小于等于limitX为界限重置
				targetX = 0,limitX=-100*(images.items.length-1),
				ToggleClass = function(targetParent,newTarget,clazz){//把旧target的class改为空，新target改为on
					if(!targetParent || !newTarget || typeof clazz != "string") return false;
					var oldTarget = targetParent.curritems;
					deleteClassName(oldTarget,clazz);
					addClassName(newTarget,clazz);
					targetParent.curritems = newTarget;
				},
				startMoveImages = function(targetX,speed,interval){//开始移动图片
					//images移动
					globalPage.moveThreads[moveThreadsID]=setTimeout(function(){
						var marginLeft = images.getStyle("marginLeft");
						marginLeft += speed;
						if(marginLeft<limitX) return stopMoveImages();
						images.setStyle("marginLeft",marginLeft+"%");
						if((speed<0&&marginLeft>targetX)||(speed>0&&marginLeft<targetX)){
							globalPage.moveThreads[moveThreadsID]=setTimeout(arguments.callee, interval);
						}else{
							images.setStyle("marginLeft",targetX+"%");
						}
					}, interval);
					//trig移动
					if(trig) ToggleClass(trig,trig.items[targetX/-100],"on");
					//title切换
					// if(title) ToggleClass(title,title.items[targetX/-100],"on");
				},
				stopMoveImages = function(){//停止移动图片
					clearTimeout(globalPage.moveThreads[moveThreadsID]);
					globalPage.moveThreads[moveThreadsID] = false;
					return false
				},
				startCycleImages = function(){//开始循环切换图片
					globalPage.cycleThreads[cycleThreadsID]=setTimeout(function(){
						targetX += -100;
						if(targetX<limitX){
							targetX = 0;
							stopMoveImages();
							startMoveImages(targetX,speed,1);
						}else
							startMoveImages(targetX,-speed,interval);
						globalPage.cycleThreads[cycleThreadsID]=setTimeout(arguments.callee, cycleInterval);
					}, cycleInterval);
				},
				stopCycleImages = function(){//停止循环切换图片
					clearTimeout(globalPage.cycleThreads[cycleThreadsID]);
					globalPage.cycleThreads[cycleThreadsID] = false;
					return false;
				},
				clickTrigSpan = function(event){
					var event = Tools.EventUtil.getEvent(event);
						target = Tools.EventUtil.getTarget(event),
						itemsParent = target.itemsParent,
						curritems = itemsParent.curritems,
						clickSpeed = 0,
						temp = target.index-curritems.index;
					Tools.EventUtil.stopPropagation(event);//阻止继续冒泡
					if(temp==0) return false;//相等则返回false
					clickSpeed = temp>0?-speed:speed;
					stopMoveImages();
					targetX = target.index*-100;
					startMoveImages(targetX,clickSpeed,interval-Math.abs(temp));
				};
			//鼠标进入scrollx停止循环切换图片，出去则开始
			scrollx.hover(stopCycleImages,startCycleImages);
			//给trig内的每个span绑定点击切换图片事件
			if(trig){
				for(i=0,len=trig.items.length;i<len;++i){
					Tools.EventUtil.addHandler(trig.items[i],"click",clickTrigSpan);
				}
			}
			this.scrollx = scrollx;
			this.startCycleImages = startCycleImages;
			this.stopCycleImages = stopCycleImages;
		};

	var headDrop = new HeadDrop();
	globalPage.imagesScrollx =  new Slider(document.getElementById("images-scrollx"),10,5,4000);

	globalPage.dropDown = headDrop.dropDown;
	globalPage.dropUp = headDrop.dropUp;

	globalPage.imagesScrollx.startCycleImages();
	return globalPage;
}(window,window.document);
});