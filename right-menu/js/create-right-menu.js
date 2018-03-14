(function(){
	EventUtil = {
		addHandler : function(element,type,handler){
			if(!element){return false;}
			if(element.addEventListener){
				element.addEventListener(type, handler, false);
			}else if(element.attachEvent){
				element.attachEvent("on"+type,handler);
			}else{
				element["on"+type] = handler;
			}
		},
		removeHandler : function(element,type,handler){
			if(!element){return false;}
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
			return false;
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
		}
	};
	//添加class
	function addClassName(element,clazz){
		if(!element || !clazz) return false;
		if(element.className.length>0) clazz = " "+clazz;
		element.className += clazz;
		return clazz;
	}
	//删除class
	function deleteClassName(element,clazz){
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
	}
	//获得多个样式
	function getStyles(that){
		if(that.currentStyle)
			return that.currentStyle;
		else
			return window.getComputedStyle(that, null);
	};
	//节点后添加节点
	function insertAfter(target,newElement){
		var targetNext = target.nextSibling;
		if(targetNext) {
			target.parentNode.insertBefore(newElement, targetNext);
		} else {
			target.parentNode.appendChild(newElement);
		}
	}
	//如果没有getElementsByClassName方法就重写
	function getListByClassName(that,clazz){
		var children = that.childNodes,
			child = {},
			childClassNames = [],
			results = [];
		for(var i=0,len=children.length;i<len;++i){
			child = children[i];
			if(child.nodeType == "1"){
				childClassNames = child.className.split(" ");
				for(var j=0,lenj=childClassNames.length;j<lenj;++j){
					if(childClassNames[j]==clazz){
						results.push(child);
					}
				}
			}
		}
		return results;
	}
//参数
	var rowHeight = 365;//class为row的div的高度(包含border和padding)
//主要操作
	var content = document.getElementById("content"),
		rows = getListByClassName(content,"row");
		// fragment = document.createDocumentFragment();
	if(!content){return false;}
	var rightMenu = document.getElementById("right-menu"),
		backTop = document.getElementById("back-top"),
		sort = document.createElement("div"),
		i = document.createElement("i"),
		link = {},
		row = {},
		rowText = "";
//将sort插入到back-top前
	i.setAttribute("class", "icon");
	sort.appendChild(i);
	sort.setAttribute("id","sort");
	sort.setAttribute("title","排序");
	rightMenu.insertBefore(sort,backTop);
//根据rows循环创建rightMenu内容
	var headHeight = document.getElementById("head").clientHeight,
		tuijianHeight = document.getElementById("tuijian").clientHeight,
		tuiguangHeight = document.getElementById("tuiguang").clientHeight,
		preHeight = headHeight+tuijianHeight+tuiguangHeight;
	for(var i=0,len=rows.length;i<len;++i){
		//获得row和row的text
		row = rows[i];
		rowText = row.getElementsByTagName("h1")[0].childNodes[0].nodeValue;;
		//新建里面的a
		link = document.createElement("a");
		//给div添加class、a添加href和text
		link.setAttribute("class", "anchor");
		link.setAttribute("id", "b"+row.getAttribute("id").replace("r",""));
		link.setAttribute("href", "#"+row.getAttribute("id"));
		link.appendChild(document.createTextNode(rowText));
		//a添加到div、div添加到rightMenu
		rightMenu.insertBefore(link,sort);
	}

//修改rightMenu定位
	var contentWidth = content.clientWidth,
		rowWidth = document.getElementById("r1").clientWidth,
		headHeight = document.getElementById("head").clientHeight+3;//+3避免贴紧
	rightMenu.style.top = headHeight+"px";
	rightMenu.style.right = "";//取消右定位
	rightMenu.style.left = rowWidth+(contentWidth-rowWidth)/2+10+"px";//+10避免贴紧
	//将rightMenu添加到content中
	insertAfter(content,rightMenu);

//事件监听部分
//滚动事件
	var scrollHandler = function(){
		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop,//窗口顶
			windowBottom = scrollTop + rowHeight,//窗口底
			anchors = getListByClassName(rightMenu,"anchor"),
			selected = getListByClassName(rightMenu,"selected");
		//定位rightMenu
		if(scrollTop>headHeight){
			rightMenu.style.top = "0px";
		}else{
			rightMenu.style.top = headHeight+"px";
		};

		//在不进行拖拉时进行
		if(!startDrag){
			//去除旧selected的class
			if(selected.length>0){
				deleteClassName(selected[0],"selected");
			}

			//获得所有row的y坐标  重新给anchor添加class 
			for(var i=0,len=anchors.length;i<len;++i){
				var link = anchors[i],
					posy = preHeight+i*rowHeight;
				deleteClassName(link,"selected");
				if(posy>scrollTop-10 && posy<windowBottom-10){
					addClassName(link,"selected");
				}
			}
		}	
	};
	EventUtil.addHandler(window,"scroll",scrollHandler);

//开始结束排序事件
	var rightMenuMask = document.getElementById("right-menu-mask"),
		selected = {},
		startDrag = false;
	EventUtil.addHandler(sort,"click",function(){
		var temp = getListByClassName(rightMenu,"selected");
		if(startDrag==false){//开始排序事件
			if(rightMenuMask){rightMenuMask.style.display = "block";}
			if(temp.length>0){
				deleteClassName(temp[0],"selected");
				selected = temp[0];
			}
			startDrag = true;
		}else{//结束排序事件
			if(selected){
				addClassName(selected,"selected");
				selected = {};
			}
			if(rightMenuMask){rightMenuMask.style.display = "none";}
			startDrag = false;
			scrollHandler();
		}
	});
//结束排序事件
	EventUtil.addHandler(rightMenuMask,"click",function(){
		if(selected){
			addClassName(selected,"selected");
			selected = {};
		}
		rightMenuMask.style.display = "none";
		startDrag = false;
		scrollHandler();
	});

//回到顶部事件
	EventUtil.addHandler(backTop,"click",function(){
		document.documentElement.scrollTop = document.body.scrollTop =0;
		var selected = getListByClassName(rightMenu,"selected");
		//去除旧selected的class
		if(selected.length>0){
			deleteClassName(selected[0],"selected");
		}
	});
	

//拖拉事件
	var dragObj = {},
		blankObj = {},
		linkHeight = rightMenu.getElementsByTagName("a")[0].clientHeight,
		prevY = 0,currY = 0,currTop = 0,dist = 0,newTop = 0;

	EventUtil.addHandler(document,"mousemove",function(event){//移动鼠标
		if(startDrag){
			if(!dragObj.style){return false;}
			var event = EventUtil.getEvent(event);
			EventUtil.stopPropagation(event);
			EventUtil.preventDefault(event);
			//获得移动距离和top值
			currY = event.screenY;//记录当前y
			currTop = parseInt(dragObj.style.top);//当前top
			currTop = !!currTop ? currTop : 0;
			dist = currY-prevY;//移动距离 +向下 -向上
			newTop = currTop+dist;
			//修改代码
			dragObj.style.top = newTop+"px";
			prevY = currY;
			//判断blankObj是否需要移动
			var links = rightMenu.getElementsByTagName("a"),
				link = {},
				offsetHead = 0,
				newBottom = 0;
			for(var i=0,len=links.length;i<len;++i){
				link = links[i];
				offsetHead = link.offsetTop;
				newBottom = parseInt(newTop+linkHeight);
				if(link===blankObj || link === dragObj){continue;}
				if(dist<0&&newTop>offsetHead&&newTop<parseInt(offsetHead+linkHeight/2)){
					rightMenu.insertBefore(blankObj, link);
				}else if(dist>0&&newBottom>parseInt(offsetHead+linkHeight/2)&&newBottom<offsetHead+linkHeight){
					insertAfter(link,blankObj);
				}
			}
		}
	});
//松开鼠标
	EventUtil.addHandler(document,"mouseup",function(event){
		if(startDrag && EventUtil.getButton(event)==0){
			//交换dragObj,和blankObj  删除blankObj
			deleteClassName(dragObj,"selected");
			rightMenu.insertBefore(dragObj, blankObj);
			rightMenu.removeChild(blankObj);

			var content = document.getElementById("content"),
				rows = getListByClassName(content,"row"),
				links = rightMenu.getElementsByTagName("a"),
				link = {},
				indexs = [];
			//清除rows	
			for(var i=0,len=rows.length;i<len;++i){
				content.removeChild(rows[i]);
			}
			//重新添加
			for (var i=0,len=links.length;i<len;++i){
				(function(i){
					link = links[i];
					link.style.position = "relative";
					link.style.zIndex = 1;
					link.style.top = "";
					content.appendChild(rows[link.index]);
					link.posy = preHeight+i*rowHeight + 5;//重置
					link.index = i;//重置
				})(i)
			}
			//点击
			clickScroll(dragObj.posy);
			dragObj = {};
			blankObj = {};
		}
	});
//点击滚动
	function clickScroll(posy){
		document.documentElement.scrollTop = document.body.scrollTop = posy;
		scrollHandler();//模拟滚动
	}

//遍历link绑定事件  点击  滚动
	function bindLinks(){
		var links = rightMenu.getElementsByTagName("a");
		for (var i=0,len=links.length;i<len;++i) {
			(function(i,links){
				var link = links[i];
				link.posy = preHeight+i*rowHeight + 5;
				link.index = i;
				EventUtil.addHandler(link,"click",function(event){//阻止默认事件
					var event = EventUtil.getEvent(event);
					return EventUtil.preventDefault(event);
				});
				EventUtil.addHandler(link,"mousedown",function(event){//鼠标
					var event = EventUtil.getEvent(event);
					if(startDrag && EventUtil.getButton(event)==0){//拖拉
						dragObj = this;

						blankObj = dragObj.cloneNode(true);
						blankObj.style.color = "transparent";

						insertAfter(dragObj,blankObj);

						dragObj.style.top = dragObj.offsetTop+"px";
						dragObj.style.zIndex = 9;
						dragObj.style.position = "absolute";
						addClassName(dragObj,"selected");
						
						prevY = event.screenY;//记录初始y

						EventUtil.stopPropagation(event);
						return EventUtil.preventDefault(event);
					}else{//点击
						clickScroll(this.posy);
					}
				});
			})(i,links);
		}
	}
	bindLinks();
})();