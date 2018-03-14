var Tools = {
	//svg改变class  ie需改变className.baseVal属性  chrome需改变classList.value  firefox俩个都可以
	removeToArr : function(list,clazz){
		var flag = 0;
		for (var i = 0,len = list.length; i < len; i++) {
			if(list[i] == clazz){
				flag = i;
				break;
			}
		}
		if(flag == -1) return false;
		list.splice(i,1);
		return result = list.join(" ");
	},
	addSvgClass : function(element,clazz){
		if(!element || !clazz) return false;
		if(element.classList){
			if(element.classList.value.length>0) {clazz = " "+clazz;}
			element.classList.value += clazz;
		}else if(element.className){
			if(element.className.baseVal.length>0) {clazz = " "+clazz;}
			element.className.baseVal += clazz;
			element.className.animVal = element.className.baseVal;
		}
	},
	deleteSvgClass : function(element,clazz){
		if(!element || !element.className || !clazz) return false;
		var list = {};
		if(element.classList){
			list = element.classList.value.split(/\s+/);
			element.classList.value = this.removeToArr(list,clazz);
		}else if(element.className){
			list = element.className.baseVal.split(/\s+/);
			element.className = this.removeToArr(list,clazz);
			element.className.animVal = element.className.baseVal;
		}
	},
	getIndexToArr : function(arr,obj){
		if(arr.length<1){return false;}
		for(var i=0,len=arr.length;i<len;++i){
			if(obj===arr[i]){return i;}
		}
	},
	addClassName : function(element,clazz){
		if(!element || !clazz) return false;
		if(element.className.length>0) clazz = " "+clazz;
		element.className += clazz;
		return clazz;
	},
	deleteClassName : function(element,clazz){//删除class
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
}
$(document).ready(function(){
	//检测是否存在#ie9-
	var ie9=true;
	if($("#ie9-").length<1){
		var head = $("head");
		ie9=false;
		//ie9及以下用不了fontawesome5 图标节点是i不是svg
		head.append($("<script src='fontawesome-5/svg-with-js/js/fontawesome-all.min.js'></script>"));
		head.append($("<script src='fontawesome-5/svg-with-js/js/fa-v4-shims.min.js'></script>"));

	}else{
		var primary = $(".primary");
		primary.css("overflow-x","hidden");
		primary.css("overflow-y","scroll");
	}
	//左菜单点击 导航栏点击
	var itemNames = $(".item-name"),
		childs = $(".child"),
		bar = $(".bar"),
		primary = $(".primary"),
		movePage = $(".move-page");
	if(itemNames.length<1 || childs.length<1 || bar.length<1) {return false};
	var itemNamesClick = function(next,angle){
			//根据next当前高度设置动画
			//ie9及以下用不了fontawesome5 图标节点是i不是svg
			if(parseInt(next.css("height"))>0){
				next.animate({height:"0"});
				//改变svg的class
				if(ie9){
					Tools.deleteClassName(angle,"fa-angle-down");
					Tools.addClassName(angle,"fa-angle-right");
				}else{
					Tools.deleteSvgClass(angle,"fa-angle-down");
					Tools.addSvgClass(angle,"fa-angle-right");
				}
			}else{
				next.animate({height:next.attr("prevHeight")});
				//改变svg的class
				if(ie9){
					Tools.deleteClassName(angle,"fa-angle-right");
					Tools.addClassName(angle,"fa-angle-down");
				}else{
					Tools.deleteSvgClass(angle,"fa-angle-right");
					Tools.addSvgClass(angle,"fa-angle-down");
				}
			}
		},
		pageClick = function(event){
			//交换class
			var selected = $(".page.selected"),
				that = $(this);
			if(that.hasClass("selected")) {return false;}
			selected.removeClass("selected");
			that.addClass("selected");
			//显示value
			var pages = $(".page"),values = $(".value"),
				index = Tools.getIndexToArr(pages,this);
			values.each(function(i){
				if(i!=index){
					$(this).css("z-index",0);
				}else if(i==index){
					$(this).css("z-index",1);
				}
			})
		},
		childsAnimate = function(selected,that){
			if(that.hasClass("selected")) {return false;}
			selected.animate({paddingLeft : "10%"});
			selected.removeClass("selected");
			that.animate({paddingLeft : "20%"});
			that.addClass("selected");
		},
		createPage = function(text,href){
			var pages = $(".page"),values = $(".value");
			for(var i=0,len=pages.length;i<len;++i){//判断是否有重复页面
				if(text==pages[i].getElementsByTagName("span")[0].innerHTML){
					pages[i].click();//点击重复页面
					return false;
				}
			}
			//如果没重复则创建
			var page = $("<div class='page'><span>"+text+"</span><i class='fa fa-close'></i></div>"),
				value = $("<div class='value'><img src='images/loading.gif' alt='请等待...' class='loading'></div>");
			//添加到父节点
			bar.append(page);
			primary.append(value);
			//ajax添加
			if(href){
				$.get(href,function(date,status){
					if(status="success"){
						value.html(date);
					}
				});
			}
			page.click();//创建完点击新页面
		},
		removePage = function(event){
			//如果ie9及下是.svg 其他是svg
			var svg = ie9==true ? $(this).find(".page .svg") :  $(this).find(".page svg");
			var index = Tools.getIndexToArr(svg,this)+1,//因为首页不能删除index应该+1
				pages = $(".page"),
				values = $(".value"),
				selected = $(".child.selected");
			pages.each(function(i){
				if(i==index){
					$(this).remove();
					pages[i-1].click();
				}
			});
			values.each(function(i){
				if(i==index){
					$(this).remove();
				}
			});
			//去除左边菜单中的.selected
			if(pages[index].getElementsByTagName("span")[0].innerHTML==selected.find("span").html()){
				selected.animate({paddingLeft : "10%"});
				selected.removeClass("selected");
			}
		};
	itemNames.each(function(){
		var next = $(this).next();
		
		if(next.length>0){
			//把原来的高度设为prevHeight属性
			next.attr("prevHeight",next.css("height"));
			//所有高度设为0
			next.css("height",0);
			$(this).click(function(){
				var angle = (ie9==true) ? $(this).find(".svg") : $(this).find("svg");
				itemNamesClick.call(this,next,angle[1]);
			});
		}else{
			$(this).click(function(){
				$(".page")[0].click();
			})
		}
	});
	childs.click(function(event){
		event.preventDefault();
		event.stopPropagation();
		var selected = $(".child.selected"),
			that = $(this);
		childsAnimate(selected,that);
		createPage(that.find("span").text(),that.attr("href"));
		return false;
	});
	bar.delegate(".page","click",pageClick);//点击页面
	//如果ie9及下是.svg 其他是svg 这里绑定两种事件
	bar.delegate(".page .svg","click",removePage);//关闭页面
	bar.delegate(".page svg","click",removePage);//关闭页面
	movePage.click(function(){//移动导航栏
		//如果ie9及下是.svg 其他是svg
		var svg = ie9==true ? $(this).find(".svg")[0] : $(this).find("svg")[0];
		if(bar.css("margin-left")=="-2px"){
			$(this).css("left","-1px");
			bar.animate({marginLeft:"-90%"});
			Tools.deleteSvgClass(svg,"fa-angle-double-right");
			Tools.addSvgClass(svg,"fa-angle-double-left");
		}else{
			$(this).css("left","");
			bar.animate({marginLeft:"-2px"});
			Tools.deleteSvgClass(svg,"fa-angle-double-left");
			Tools.addSvgClass(svg,"fa-angle-double-right");
		}
	});
});