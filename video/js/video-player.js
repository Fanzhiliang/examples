$(document.getElementById("video")).ready(function(){
	var href = window.location.href,//   http://localhost/bilibili/index.html
		pathName = window.location.pathname,//   /bilibili/index.html/
		project = pathName.substring(0, pathName.substr(1).indexOf("/"));//   bilibili
		domain = href.substring(0, href.indexOf(pathName));//   http://localhost
	var videoPlayer = $("#video-player"),
		video  = $("#video"),
		control = $("#control"),
		smallPlay = $("#small-play"),
		start = $("#start"),
		loading = $("#loading"),
		progressBar = $("#progress-bar"),
		exist = $("#exist"),
		cache  = $("#cache"),
		pointer = $("#pointer"),
		toggleWidth = $("#toggle-width"),
		toggleScreen = $("#toggle-screen"),
		timeOfCurrent = $("#timer-of-current"),
		timerOfAll = $("#timer-of-all"),
		timeTip = $("#time-tip"),
		timeTipText = timeTip.find("span"),
		volumeBar = $("#volume-bar"),
		volumePointer = $("#volume-pointer"),
		existVolume = $("#exist-volume"),
		volumeControl = $("#volume-control"),
		volumeText = $("#volume-text"),
		pageWidth = parseInt($("html").css("width")),//视图宽度
		playerSmallWidth = parseInt(videoPlayer.css("width")),//播放器小的宽度
		barSmallWidth = parseInt(progressBar.css("width")),//进度条小的宽度
		barFullWidth = barSmallWidth+pageWidth-playerSmallWidth,//进度条全屏的宽度 +10是因为有滚动条
		videoLength = 0,//视频总长度 video完全加载才有值
		playing = false,//是否正在播放
		isMouseDown = false,//是否在指针处按下鼠标
		screenMethods = (function(document){//全屏方法
			var all = [["requestFullscreen", "exitFullscreen", "fullscreenchange", "fullscreen", "fullscreenElement"], 
			["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitIsFullScreen", "webkitCurrentFullScreenElement"], 
			["mozRequestFullScreen", "mozCancelFullScreen", "mozfullscreenchange", "mozFullScreen", "mozFullScreenElement"],
			["msRequestFullscreen", "msExitFullscreen", "msfullscreenchange", "msFullScreen", "msFullscreenElement"]];
			for(var i=0,len=all.length;i<len;++i){
				var temp = all[i];
				if(temp[1] in document){
					return temp;
				}
			}
		})(document),
		setScreenElement = function(element,callback){//设置全屏方法
			if(!screenMethods){
				var x = screen.availWidth,  
					y = screen.availHeight;
				element.openFull = function(){//打开新的窗口 
					window.open(domain+pathName+"/video-full.html","makeful",'fullscreen=yes,channelmode=yes,titlebar=no,toolbar=no,scrollbars=auto,resizable=no,status=no,copyhistory=no,location=no,menubar=no,width='+x+',height='+y); 
				};		
			}else{
				element.full = function(){
					this[screenMethods[0]](Element.ALLOW_KEYBOARD_INPUT);
				};
				element.exit = function(){
					document[screenMethods[1]]();
				};
				element.isFull = document[screenMethods[4]];
				var fun = function(){
					if(callback){callback.call(element,event);}
					element.isFull = document[screenMethods[4]];
				};
				// document.addEventListener(screenMethods[2],fun);
				document["on"+screenMethods[2]] = fun;
			}
		},
		formatSecond = function(seconds){//根据秒数得到 分:秒 时间格式
			if(typeof seconds != "number" && seconds < 0){return false;}
			seconds = parseInt(seconds);
			var s = seconds % 60,
				m = parseInt(seconds/60);
			m = m<=9 ? "0"+m : m;
			s = s<=9 ? "0"+s : s;
			return m+":"+s;
		},
		getCache = function(){//获得最新缓存
			var buffered = video[0].buffered;
			if(buffered.length<1){return 0;}
			var cacheEnd = buffered.end(buffered.length-1);
			if(typeof cacheEnd == "number" && cacheEnd>0){
				return cacheEnd;
			}
		},
		setCurrentTime = function(seconds){//修改的是秒数
			if(typeof seconds != "number" && seconds < 0){return false;}
			video[0].currentTime = seconds;
		},
		getCurrentTime = function(){//获得当前时间秒数
			var c =video[0].currentTime;
			if(c<0 || !c){return 0;}
			return c;
		},
		setTimeOfCurrent = function(){//显示当前时间
			timeOfCurrent.text(formatSecond(getCurrentTime()));
		},
		setTimerOfAll = function(){//显示总时间
			timerOfAll.text(formatSecond(videoLength));
		},
		setCacheBar = function(rate){//设置缓存条长度
			if(isNaN(video[0].duration)){return false};
			if(videoLength<=0){videoLength = video[0].duration;}
			if(!rate){rate = ((getCache()/videoLength)*100).toFixed(2)+"%";}
			cache.css("width",rate);
		},
		setExistBar = function(rate){//设置进度条长度和进度指针
			if(isNaN(video[0].duration)){return false};
			if(videoLength<=0){videoLength = video[0].duration;}
			if(!rate){rate = ((getCurrentTime()/videoLength)*100).toFixed(2)+"%";}
			exist.css("width",rate);
			pointer.css("left",rate);
		},
		judgeCacheing = function(){//判断是否正在缓存
			if(getCache()<getCurrentTime()){
				loading.css("display","block");
			}else{
				loading.css("display","none");
			}
		},
		startPlay = function(){//开始播放
			video[0].play();
			start.css("display","none");
			smallPlay.removeClass("start");
			smallPlay.addClass("pause");
			playing = true;
		},
		pausePlay = function(){//暂停播放
			video[0].pause();
			start.css("display","block");
			smallPlay.addClass("start");
			smallPlay.removeClass("pause");
			playing = false;
		},
		endPlay = function(){//完成播放
			setCacheBar("0%");
			setExistBar("0%");
			start.css("display","block");
			smallPlay.addClass("start");
			smallPlay.removeClass("pause");
			playing = false;
			video[0].load();
		},
		playClick = function(event){//点击播放暂停按钮
			event.stopPropagation();
			event.preventDefault();
			if(playing){
				pausePlay();
			}else{
				startPlay();
			}
		},
		toggleWidthClick = function(){//切换宽屏
			//全屏时不能切换
			if(videoPlayer[0].isFull){return false;}
			//切换图标class
			toggleWidth.toggleClass("video-biger");
			toggleWidth.toggleClass("video-smaller");
			var span = toggleWidth.find("span"),
				spanText = span.text();
			span.text(span.attr("toggle"));
			span.attr("toggle",spanText);
			//变大
			videoPlayer.toggleClass("big");
		},
		progressBarClick = function(event){//点击进度条
			event.stopPropagation();
			event.preventDefault();
			var posx = event.pageX-$(this).offset().left,
				barLength = parseFloat(progressBar.css("width")),
				rate = posx/barLength;
			if(rate<0 || rate>1){return false;}
			setCurrentTime(videoLength*rate);
			startPlay();
		},
		progressBarEnter = function(event){//鼠标进入进度条
			timeTip.css("display","block");
		},
		progressBarOut = function(event){//鼠标离开进度条
			timeTip.css("display","none");
		},
		progressBarMove = function(event){//鼠标在进度条内移动
			var posx = event.pageX-$(this).offset().left,
				barLength = parseFloat(progressBar.css("width")),
				rate = posx/barLength,
				leftRate = ((rate)*100).toFixed(2)+"%";
			if(rate<0 || rate>1){return false;}
			timeTip.css("left",leftRate);
			timeTipText.text(formatSecond(videoLength*rate));
			if(isMouseDown){
				setCurrentTime(videoLength*rate);
			}
		},
		pointerMouseDown = function(event){//鼠标在指针内按下
			event.stopPropagation();
			event.preventDefault();
			isMouseDown = true;
			pausePlay();
		},
		pointerMouseUp = function(event){//鼠标在指针内松开
			event.stopPropagation();
			event.preventDefault();
			isMouseDown = false;
			startPlay();
		},
		pointerClick = function(event){//点击指针
			event.stopPropagation();
			event.preventDefault();
		},
		keydownHandler = function(event){//按下键盘事件
			event.stopPropagation();
			event.preventDefault();
			var temp = 0;
			switch (event.keyCode) {
				case 32://空格
					playClick();
					break;
				case 37://左
					temp = getCurrentTime()-10;
					if(temp<=0){
						temp = 0;
					}else if(temp>=videoLength){
						temp = videoLength;
					}
					setCurrentTime(temp);
					break;
				case 39://右
					temp = getCurrentTime()+10;
					if(temp<=0){
						temp = 0;
					}else if(temp>=videoLength){
						temp = videoLength;
					}
					setCurrentTime(temp);
					break;
				case 38://上
					temp = parseFloat(video[0].volume);
					temp += 0.1;
					if(temp>1){temp = 1;}
					setVolume(parseFloat(temp).toFixed(2));
					break;
				case 40://下
					temp = parseFloat(video[0].volume);
					temp -= 0.1;
					if(temp<0){temp = 0;}
					setVolume(parseFloat(temp).toFixed(2));
					break;
			}
		},
		volumePointerMousedown = function(event){//按下音量指针
			isMouseDown = true;
		},
		volumeBarMouseup = function(event){//按下音量条
			isMouseDown = false;
		},
		setVolume = function(rate){//设置音量
			if(!rate){
				if(arguments.callee.rate){
					rate = arguments.callee.rate;
				}else{
					var cookieRate = getCookie("volumeRate");
					if(cookieRate){
						rate = cookieRate;
					}else{
						rate = video[0].volume;
					}
				}
			}
			setCookie("volumeRate",rate,7);
			arguments.callee.rate = rate;
			video[0].volume = rate;
			volumePointer.css("bottom",rate*100+"%");
			existVolume.css("height",rate*100+"%");
			volumeText.text(parseInt(rate*100));
		},
		volumeBarMouseMove = function(event){//在音量条内移动
			if(isMouseDown){
				var posy = event.pageY-$(this).offset().top,
					volumeBarLength = parseFloat(volumeBar.css("height")),
					rate = ((volumeBarLength-posy)/volumeBarLength).toFixed(2);
				if(rate<0 || rate > 1){return false;}
				setVolume(rate);
			}
		},
		toggleScreenClick = function(){//点击全屏按钮
			var player = videoPlayer[0];
			if(player.openFull){
				player.openFull();
			}else{
				if(!screenMethods){return false;}
				if(player.isFull){
					progressBar.css("width","");
					player.exit();
				}else{
					progressBar.css("width",barFullWidth+"px");
					player.full();
				}
				videoPlayer.toggleClass("full");
				var span = $(this).find("span"),
					temp = span.text();
				span.text(span.attr("toggle"));
				span.attr("toggle",temp);
			}
			//退出宽屏
			toggleWidth.removeClass("video-biger");
			toggleWidth.addClass("video-smaller");
			var span = toggleWidth.find("span");
			span.text("宽屏模式");
			span.attr("toggle","退出宽屏");
			videoPlayer.removeClass("big");
		},
		windowResize = function(){//全屏时按esc不会触发keydown事件，所以用resize并且player.isFull==false来判断
			var player = videoPlayer[0],
				browserName = BrowserMatch.browser;
			if(screenMethods){
				if((!player.isFull && browserName == "firefox") ||
				 (player.isFull && browserName == "chrome") ||
				 (!player.isFull && browserName == "IE")){
					progressBar.css("width","");
					videoPlayer.removeClass("full");
					setTimeout(function(){control.css("bottom",0);},500);
				}
			}
		},
		fullScreenThread = {},//全屏时控制条消失计时器
		videoPlayerMousemove = function(event){
			var posy = event.pageY,
				videoPlayerHeight = parseInt(videoPlayer.css("height")),
				controlHeight = parseInt(control.css("height"));
			if(videoPlayer[0].isFull){
				if(posy<videoPlayerHeight-controlHeight-30){
					fullScreenThread = setTimeout(function(){
						control.css("bottom",-controlHeight+"px");
					}, 4000);
				}else{
					control.css("bottom",0);
					clearTimeout(fullScreenThread);
				}
			}
		};

	//给元素设置全屏方法和属性
	setScreenElement(videoPlayer[0]);
	
	//循环计时器
	setTimeout(function(){
		setCacheBar();//设置缓存条长度
		setExistBar();//设置进度条长度和进度指针
		setTimeout(arguments.callee, 2);
		setTimeOfCurrent();//显示当前时间
		judgeCacheing();//判断是否正在缓存
		setVolume();//设置音量
		setTimerOfAll();//显示总时间
	}, 2);
	
	var onlyone = false;
	//完成加载事件 绑定事件、开始计时器、设置初始音量和视频总时间
	video.bind("canplaythrough",function(){
		//只运行一次
		if(onlyone){return false;}
		onlyone = true;
		//隐藏loading.gif
		loading.hide();
		//绑定事件
		smallPlay.click(playClick);
		start.click(playClick);
		video.click(playClick);
		toggleWidth.click(toggleWidthClick);
		progressBar.click(progressBarClick);
		progressBar.hover(progressBarEnter,progressBarOut);
		progressBar.mousemove(progressBarMove);
		pointer.click(pointerClick);
		pointer.hover(progressBarOut,progressBarEnter);
		pointer.mousedown(pointerMouseDown);
		pointer.mouseup(pointerMouseUp);
		volumePointer.mousedown(volumePointerMousedown);
		volumeControl.mouseup(volumeBarMouseup);
		volumeBar.mousemove(volumeBarMouseMove);
		toggleScreen.click(toggleScreenClick);
		videoPlayer.keydown(keydownHandler);
		videoPlayer.mousemove(videoPlayerMousemove);
		$(window).resize(windowResize);
		video[0].onended = endPlay;
	});
	//设置cookie
	function setCookie(cname,cvalue,exdays){
	    var d = new Date();
	    d.setTime(d.getTime()+(exdays*24*60*60*1000));
	    var expires = "expires="+d.toGMTString();
	    document.cookie = cname + "=" + cvalue + "; " + expires;
	}
	//读取cookie
	function getCookie(cname){
	    var name = cname + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0; i<ca.length; i++) {
	    	var c = ca[i].trim();
	    	if (c.indexOf(name)==0) return c.substring(name.length,c.length);
	    }
	    return "";
	}
});