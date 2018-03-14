var Tools = {};
Tools.getStyles = function(obj){//获得多个样式
	if(obj.currentStyle){
		return obj.currentStyle;
	}else{
		return getComputedStyle(obj, null);
	}
};
Tools.setStyle = function(obj,attr,value){//设置单个样式
	if(Tools.getStyles(obj)){
		obj.style[attr] = value;
	}
};
Tools.getStyle = function(obj,attr){//获得单个样式,并处理返回
	if(Tools.getStyles(obj)){
		var styleString = obj.style[attr],
			styleNumber = parseFloat(styleString);
		return isNaN(styleNumber)?styleString:styleNumber;
	}
};
$(document).ready(function(){
	//获取class为button、item的节点 如果两种节点数量不一致、数量小于1也返回false
	var buttons = $(".button"),
		items = $(".item"),
		tips = $(".tip");
	if(buttons.length<1 || items.length<1 || buttons.length!=items.length){return false;}
	//方法
	var circle = {
			interval : 10, //间隔时间
			changeSpeed : 1, //改变速度
			color : "#05a0fa", //颜色
			lineWidth : 5, //线宽
			angle_start : -Math.PI/2, //-Math.PI/2=第0度
			angle : Math.PI/180 //每1度=Math.PI*/180
		},
		item = {
			widthSpeed : 0.04, //宽度改变速度
			opacitySpeed : 0.01 //透明度改变速度
		},
		tip = {
			interval : 25, //间隔时间
			changeSpeed : 1 //改变速度
		},
		cycleThread = {},//动画循环对象
		tipThread = {},//提示动画对象
		drawCircle = function(targetAngle){//从0点钟方向顺时针度数
			var ctx = this.clearCircle();
			if(!ctx){return false;} 
			ctx.strokeStyle = circle.color;
			ctx.lineWidth = circle.lineWidth;
			ctx.beginPath();
			//第0度是3点钟方向 -Math.PI/2=第0度  Math.PI*/180=1度
			ctx.arc(11,12,8,circle.angle_start,circle.angle_start+circle.angle*targetAngle,false);
			ctx.stroke();
		},
		clearCircle = function(){//清空画板
			var canvas = $(this).find("canvas")[0],
				ctx = canvas.getContext("2d");
			if(!canvas || !ctx){return false;}
			ctx.clearRect(0,0,canvas.width,canvas.height);
			return ctx;
		},
		change = function(){//设置item的css -1图片变小 +1图片放大
			var newWidth = parseFloat(Tools.getStyle(this,"width"))+item.widthSpeed*$(this).attr("dir"),
				newOpacity = parseFloat($(this).css("opacity"));
			newOpacity = newOpacity>=1?1:(newOpacity+item.opacitySpeed);
			$(this).css("width",newWidth+"%");
			$(this).css("opacity",newOpacity);
		},
		reset = function(){//重设item的css
			$(this).css("opacity",0);
			$(this).css("width","120%");
			if(Math.round(Math.random())==0){
				$(this).css("width","120%");
				$(this).attr("dir",-1);
			}else{
				$(this).css("width","105%");
				$(this).attr("dir",+1);
			}
			if(Math.round(Math.random())==0){
				$(this).css("top",0);
				$(this).css("bottom","");
			}else{
				$(this).css("top","");
				$(this).css("bottom",0);
			}
			if(Math.round(Math.random())==0){
				$(this).css("left",-(Math.floor(Math.random()*5)+1)+"%");
				$(this).css("right","");
			}else{
				$(this).css("left","");
				$(this).css("right",-(Math.floor(Math.random()*5)+1)+"%");
			}
		},
		startCycle = function(){//开始动画
			var button = $(".button.on")[0];
			cycleThread = setTimeout(function(){
				var newAngle = button.currAngle+circle.changeSpeed;
				if(newAngle>360+10){//完成循环 +10为了圆进度100%时停顿一下 不能大于45
					button.drawCircle(360);
					button.currAngle = 0;//将当前度数重设为0
					$(".item.on")[0].reset();
					scrollButton(+1);//向右
				}else {//继续循环
					button.drawCircle(newAngle);
					button.currAngle = newAngle;//将当前度数重设为新度数
					$(".item.on")[0].change();
					cycleThread = setTimeout(arguments.callee,circle.interval);
				}
			}, circle.interval);
		},
		stopCycle = function(){clearTimeout(cycleThread);cycleThread = {};},//停止动画
		toggleButton = function(i){//切换 下一个button和item的数组下标
			var oldButton = $(".button.on"),
				tempOldButton = this.className,
				oldItem = $(".item.on"),
				tempOldItem = items[i].className;
			if(oldButton === this) {return false;}//如果点击正在画圆的button就返回false
			if(oldButton.length==1 && oldItem.length==1){
				oldButton = oldButton[0];
				oldItem = oldItem[0];
			}else return false;
			//reset样式
			oldItem.reset();
			//交换class
			this.className = oldButton.className;
			oldButton.className = tempOldButton;
			items[i].className = oldItem.className;
			oldItem.className = tempOldItem;
			//oldButton和this的当前度数设为0
			oldButton.currAngle = 0;
			this.currAngle = 0;
			//停止动画
			stopCycle();
			//清除圆
			oldButton.clearCircle();
			//重新开始
			startCycle();
		},
		clickButton = function(event){//点击button
			toggleButton.call(buttons[this.index],this.index);
		},
		scrollButton = function(dir){//+1下一个(向右)  -1上一个(向左)
			var obj = $(".button.on")[0],i = obj.index,len = buttons.length;
			if(i==len-1 && dir==+1){//当前button为最后一个并且，方向为下一个(向右)
				toggleButton.call(buttons[0],0);
			}else if(i==0 && dir==-1){//当前button为第一个并且，方向为上一个(向左)
				toggleButton.call(buttons[len-1],len-1);
			}else{//正常情况
				toggleButton.call(buttons[i+dir],i+dir);
			}
		},
		showTip = function(){//显示tip
			$(this).css("display","block");
			var newSize = 0,imgFrame = $(this).find(".img-frame");
			tipThread = setTimeout(function(){
				newSize = parseInt(imgFrame.css("background-size"))-tip.changeSpeed;
				if(newSize<=95){
					imgFrame.css("background-size","95px auto");
				}else{
					imgFrame.css("background-size",newSize+"px auto");
					//如果背景宽度小于等于150px 增加事件间隔 减慢速度
					tipThread = setTimeout(arguments.callee,(newSize<=150?tip.interval+10:tip.interval));
				}
			},tip.interval);
		},
		hiddenTip = function(){//隐藏tip
			$(this).css("display","none");
			$(this).find(".img-frame").css("background-size","250px auto");
			clearTimeout(tipThread);
			tipThread = {};
		};
	//给每个button添加方法
	buttons.each(function(i){
		this.drawCircle = drawCircle;
		this.clearCircle = clearCircle;
		this.currAngle = 0;
		this.index = i;
		$(this).click(clickButton);
		if(tips.length>0){//如果tip数量不为0 绑定hover事件 
			$(this).hover(function(){tips[i].showTip();},function(){tips[i].hiddenTip();});
		}
	});
	//给每个item添加方法
	items.each(function(){
		this.change = change;
		this.reset = reset;
		this.reset();
	});
	tips.each(function(){
		this.showTip = showTip;
		this.hiddenTip = hiddenTip;
		this.hiddenTip();
	});
	//鼠标进入carousel停止循环动画
	$(".carousel").mouseenter(stopCycle);
	//鼠标离开carousel继续循环动画
	$(".carousel").mouseout(startCycle);
	//给左右按钮绑定事件
	$(".prev").click(function(){scrollButton(-1)});
	$(".next").click(function(){scrollButton(+1)});
	//从第一个开始循环
	startCycle();
})