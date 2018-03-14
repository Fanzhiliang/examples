$(document).ready(function(){
	$(document).ready();
	//获取class为button的节点 如果类数组小于1返回false
	var buttons = $(".button");
	if(buttons.length<1){return false;}
	//把这两个ie8不能使用的方法设为空的function 取消canvas画圆动画
	buttons.each(function(){
		this.drawCircle = function(targetAngle){
			this.clearCircle();
			$(this).addClass("ie8-"+Math.floor(targetAngle/45));
		};
		this.clearCircle = function(){
			for(var i=1,len=8;i<=len;++i){//去className为ie8-* 不能用toggleClass()
				if($(this).hasClass("ie8-"+i)){$(this).removeClass("ie8-"+i);}
			}
		};
	});
	$(".button.on").addClass("ie8-1");
	console.log("ie8及以下不能使用canvas，画圈功能用替换background代替!");
	//把div.img-frame改为img.img-frame src相同
	var tips = $(".tip");
	tips.each(function(){
		this.showTip = function(){$(this).css("display","block");};
		this.hiddenTip = function(){$(this).css("display","none");};
		var imgFrame = $(this).find(".img-frame"),
			src = imgFrame.css("background-image").split("\"")[1];
		imgFrame.replaceWith("<img class='"+imgFrame.attr("class")+"' src='"+src+"'>");

	});
});