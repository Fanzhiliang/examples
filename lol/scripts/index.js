window.whole = (function(window,document){
	var log = console.log;
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

	function Tip(hero){//tip的创建和事件绑定  Tip类
		this.tip = hero.getElementsByTagName("div")[0];
		this.chlickLink = hero.getElementsByTagName("a")[0];
		this.chlickLink.tip = this.tip;
		this.link = this.chlickLink.cloneNode(true);
		this.name = hero.getElementsByTagName("p")[0].cloneNode(true);
		this.tipContent = this.tip.getElementsByClassName("tipContent")[0];
		if(!this.link||!this.name||!this.tip||!this.tipContent) return false;
		this.tipContent.insertBefore(this.name, this.tipContent.firstChild);
		this.tipContent.insertBefore(this.link, this.tipContent.firstChild);
		Tip.prototype.display = function(event){//显示tip
			this.tip.className = "display";
			this.tip.style.left = (event.clientX+10)+"px";
			this.tip.style.top = (event.clientY+10)+"px";
		};
		Tip.prototype.hidden = function(event){//隐藏tip
			this.tip.className = "hidden";
		};
		this.chlickLink.addEventListener("mousemove", this.display);
		this.chlickLink.addEventListener("mouseout", this.hidden);
	}

	function Whole(){//整体  Whole类
		Whole.prototype.getJson = function(url,that){//根据url读取文件
			if(xmlhttp){
				xmlhttp.open("GET", url, false);
				xmlhttp.onreadystatechange = function(){
					if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
						//that.heroJson = eval("("+xmlhttp.responseText+")");
						that.heroJson = JSON.parse(xmlhttp.responseText);
					}
				};
				xmlhttp.send(null);
			}else{
				alert("Sorry,your browser doesn\'t suppot XMLHttpRequest ")
			}
		};
		this.headerImg = (function(){//标题左边的小盾牌
			if(!document.getElementById) return false;
			if(!document.getElementsByTagName) return false;
			if(!document.createElement) return false;
			var herolist = document.getElementById("herolist");
			if(!herolist) return false;
			var header = herolist.getElementsByTagName("header")[0];
			var h5 = header.getElementsByTagName("h5")[0];
			if(!h5) return false;
			var img = document.createElement("img");
			img.setAttribute("src", "images/shield.png");
			img.style.float = "left";
			img.style.margin = "2px 4px";
			header.insertBefore(img, h5);
			return img;
		})();
		this.content = (function(that){//根据获取的Json重写类为content的div
			var content = document.getElementsByClassName("content")[0];
			if(!content) return false;
			if(content.childNodes.length<0) return false;
			that.getJson("hero_intro.txt",that);
			var jsonKeys = Object.keys(that.heroJson);
			var contentText = "";
			for (var i = 0; i < jsonKeys.length; i++) {
				var obj = that.heroJson[jsonKeys[i]];
				contentText += "<div class=\"hero\">";
				contentText += "<a href=\"./hero.html?english="+obj["english"]+"\" ";
				contentText += "id=\""+obj["english"]+"\" target=\"_blank\">";
				contentText += "<img src=\""+obj["head"]+"\"></a>";
				contentText += "<p>"+obj["name"]+"</p>";
				contentText += "<div class=\"hidden\"><div class=\"tipContent\">";
				contentText += "<p>"+obj["alias"]+"</p>";
				contentText += "<p class=\"intro\">"+obj["intro"]+"</p>";
				contentText += "<p class=\"tags\">tags:"+obj["tags"]+"</p>";
				contentText += "</div></div></div>";
			}
			content.innerHTML = contentText;
			return content;
		})(this);
		this.tips = (function(content){//修改tipContent并绑定显示tip事件
			if(!content) return false;
			if(!document.getElementsByClassName) return false;
			if(!document.getElementsByTagName) return false;
			if(!document.createElement) return false;
			var tips = new Array();
			var heros = document.getElementsByClassName("hero");
			if(heros.length<1) return false;
			for (var i = 0; i < heros.length; i++) {
				tips[tips.length] = new Tip(heros[i]);
			}
			return tips;
		})(this.content);
	}
	return new Whole();
})(this,this.document);
console.log(window.whole);
