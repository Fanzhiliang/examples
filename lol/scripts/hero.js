window.whole = (function(window,document){
	var log = console.log,
		barsWidth = 60,
		skinWidth = 1100,
		currentSkin = "skin_1";
	var xmlhttp = (function(){//获取XMLHttpRequest对象
		if(typeof XMLHttpRequest =="undefined"){
			XMLHttpRequest = function(){
				var versions = ["Msxml2.XMLHTTP.6.0","Msxml2.XMLHTTP.3.0","Msxml2.XMLHTTP","Microsoft.XMLHTTP"];
				for (var i = 0; i < versions.length; i++) {
					try{return new ActiveXObject(versions[i]);}
						catch(e){}
				}
				return false;
			};
		}
		return new XMLHttpRequest();
	})();
	var english = (function(href){//获取url中的english参数
		var target = "english=";
		return href.substring(href.indexOf(target)+target.length);
	})(window.location.href);

	function Whole(){
		(function(url,that){//根据url读取文件
			if(xmlhttp){
				xmlhttp.open("GET", url, false);
				xmlhttp.onreadystatechange = function(){
					if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
						//that.heroJson = eval("("+xmlhttp.responseText+")");
						that.hero = JSON.parse(xmlhttp.responseText)[english];
					}
				};
				xmlhttp.send(null);
			}else{
				alert("Sorry,your browser doesn\'t suppot XMLHttpRequest ")
			}
		})("hero_intro.txt",this);

		Whole.prototype.bind = function(func,that){
			return function(){
				return func.apply(that, [that]);
			}
		}

		Whole.prototype.moveSkin = function(newSkinId,oldSkinId,x,speed){
			if(!document.getElementById) return false;
			var newSkin = document.getElementById(newSkinId),
				oldSkin = document.getElementById(oldSkinId),
				left = document.getElementById("left"),
				right = document.getElementById("right"),
				alias = document.getElementById("alias");
			if(!newSkin || !oldSkin) return false;
			newSkin.style.zIndex = "1";
			oldSkin.style.zIndex = "0";
			var currentX = parseInt(newSkin.style.left);
			if(currentX>0){
				speed = -speed;
			}
			(function(that){
				log(that);
				currentX += speed;
				newSkin.style.left = currentX+"px";
				if((currentX<=0 && speed<0) || (currentX>=0 && speed>0)){
					newSkin.style.left = 0+"px";
					oldSkin.style.left = x+"px";
					currentSkin = newSkinId;
					alias.innerHTML = newSkin.getAttribute("alt"); 
					EventUtil.addHandler(left,"click",that.lr);
					EventUtil.addHandler(right,"click",that.lr);
				}else{
					EventUtil.removeHandler(left,"click",that.lr);
					EventUtil.removeHandler(right,"click",that.lr);
					setTimeout(that.bind(arguments.callee,that), 3);
				}
			})(this);
		}

		Whole.prototype.lr = function(event){
			var event = EventUtil.getEvent(event),
				target = EventUtil.getTarget(event),
				aim = document.getElementById("aim"),
				bars = document.getElementById("bars"),
				j = 0;
			if(bars.imgs.length<1) return false;
			aim.style.left = !aim.style.left ? "0px" : aim.style.left;
			var aimCurrentX = parseInt(aim.style.left),
				currentId = parseInt(currentSkin.substring(currentSkin.indexOf("_")+1)),
				barWidth = 0,
				x = 0;
			if(target.id=="right"){
				barWidth=barsWidth;
				x=-skinWidth;
				++currentId;
			}else{
				barWidth=-barsWidth;
				x= skinWidth;
				--currentId;
			}
			aimCurrentX += barWidth;
			j = (bars.imgs.length>5) ? 5 : bars.imgs.length;
			if(aimCurrentX<0 || aimCurrentX > (j-1)*barsWidth){
				if(bars.imgs.length>5){
					for(var i=0,len=bars.imgs.length;i<len;++i){
						var imgX = parseInt(bars.imgs[i].style.left),
							newImgX = imgX - barWidth,
							extra = len - 5;
						if((newImgX<-extra*barsWidth)||(newImgX>=(i+1)*barsWidth)){
							break;
						}
						bars.imgs[i].style.left = newImgX+"px";
					}
				}
				aimCurrentX -= barWidth;
			}
			this.that.moveSkin("skin_"+currentId,currentSkin,x,20);
			aim.style.left = aimCurrentX+"px";
		}

		Whole.prototype.imgClick = function(event){
			var event = EventUtil.getEvent(event),
				target = EventUtil.getTarget(event),
				aim = document.getElementById("aim"),
				bars = document.getElementById("bars");
			if(bars.imgs.length<1) return false;
			target.style.left = !target.style.left ? "0px" : target.style.left;
			var targetX=parseInt(target.style.left),
				targetId=parseInt(target.id.substring(target.id.indexOf("_")+1)),
				currentId=parseInt(currentSkin.substring(currentSkin.indexOf("_")+1)),
				x = 0;
			aim.style.left = targetX+"px";
			if(targetId==currentId) return false;
			(targetId>currentId) ? x = -skinWidth : x = skinWidth;
			this.that.moveSkin("skin_"+targetId,currentSkin,x,20);
		}

		this.title = (function(that){
			if(!that.hero) return false;
			if(!document.getElementsByTagName) return false;
			var title = document.getElementsByTagName("title")[0];
			if(!title) return "no title";
			title.innerHTML = that.hero.alias;
			return title.innerHTML;
		})(this);

		this.guide = (function(that){
			if(!that.hero) return false;
			if(!document.getElementsByClassName) return false;
			if(!document.getElementsByTagName) return false;
			var guide = document.getElementsByClassName("guide")[0];
			if(!guide) return false;
			var span = guide.getElementsByTagName("span")[0];
			if(!span) return false;
			span.innerHTML += that.hero.alias + that.hero.name;
			var link = guide.getElementsByTagName("a")[0];
			if(!link || !link.getAttribute("href")) return guide;
			EventUtil.addHandler(link,"click",function(event){
				var event = EventUtil.getEvent(event);
				var target = EventUtil.getTarget(event);
				EventUtil.preventDefault(event);
				var href = window.location.href;
				window.location.href = href.substring(0, href.lastIndexOf("/"));
			});
			return guide;
			//上面的最好用动态网页
		})(this);

		this.skin = (function(that){
			if(!that.hero) return false;
			if(!document.getElementsByClassName) return false;
			if(!document.getElementsByTagName) return false;
			var file = that.hero.head.substring(0,that.hero.head.lastIndexOf("/")),
				skins = that.hero.skin,
				skin = document.getElementsByClassName("skin")[0],
				clientWidth = skin.width || skin.clientWidth,
				skinList = new Array();
			for(var i=0,len=skins.length;i<len;++i){
				var img = new Image();
				img.setAttribute("src", file+"/skin_"+(i+1)+".png");
				img.setAttribute("alt", skins[i]);
				img.setAttribute("id", "skin_"+(i+1))
				if(i!=0){
					img.style.left = clientWidth+"px";
					img.style.zIndex = "0";
				}else{
					img.style.left = "0px";
				}
				skin.appendChild(img);
			}
			skin.clientWidth = clientWidth;
			return skin;
			//上面的最好用动态网页
		})(this);

		this.skinInfo = (function(that){//这部分最好用动态网页用
			if(!that.hero) return false;
			if(!document.getElementById) return false;
			var textInfo = document.getElementById("textInfo"),//textInfo部分
				alias = document.createElement("h2"),
				name = document.createElement("h1"),
				tags = that.hero.tags.split(", ");
			alias.innerHTML = that.hero.alias;
			alias.id = "alias";
			name.innerHTML = that.hero.name;
			textInfo.appendChild(alias);
			textInfo.appendChild(name);
			for(var i=0,len=tags.length,span=null;i<len;++i){
				div = document.createElement("div");
				div.innerHTML = tags[i];
				textInfo.appendChild(div);
			}
		})(this);

		this.skinCtrl = (function(that){
			if(!that.hero) return false;
			if(!document.getElementById) return false;
			var bars = document.getElementById("bars");
			bars.imgs = new Array();
			if(!bars) return false;
			var file = that.hero.head.substring(0,that.hero.head.lastIndexOf("/")),
				skins = that.hero.skin;
			for(var i=0,len=skins.length;i<len;++i){
				var img = new Image();
				img.src = file+"/"+"bar_"+(i+1)+".png";
				img.id = "bar_"+(i+1);
				img.that = that;//不能动态网页
				img.style.left = (i*barsWidth)+"px";//60
				img.style.top = "0px";
				bars.appendChild(img);
				bars.imgs[bars.imgs.length] = img;
			}
			//上面的最好用动态网页，下面绑定事件
			if(!window.EventUtil){
				log("no prepare.js.");
				return bars.parentNode;
			}
			//left right 事件
			var left = document.getElementById("left");
			var right = document.getElementById("right");
			if(!left || !right) return bars.parentNode;
			left.that = that;
			right.that = that;
			EventUtil.addHandler(left,"click",that.lr);
			EventUtil.addHandler(right,"click",that.lr);
			//bars事件
			for(var i=0,len=bars.imgs.length;i<len;++i){
				EventUtil.addHandler(bars.imgs[i],"click",that.imgClick);
			}
			return bars.parentNode;
		})(this);
	}
	return new Whole();
})(this,this.document);
console.log(window.whole);
