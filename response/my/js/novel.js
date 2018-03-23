$(document).ready(function(){
	var search = window.location.search,
		pair = search.substring(1).split("&"),
		params = {},
		temp = [];
	for(var i=0,len=pair.length;i<len;++i){
		temp = pair[i].split("=");
		params[temp[0]] = temp[1];
	}
	var novel = $.parseJSON($.ajax({url:"novel.txt",async:false}).responseText),
		novels = novel.novels,
		txtUrl = novel.txtUrl,
		coverUrl = novel.coverUrl,
		content = $("#content");

	if(params.length<1 || !params.novel){
		var htmlText = "",
			novelName = "";
		for(var i=0,len=novels.length;i<len;++i){
			novelName = novels[i];
			htmlText += "<a href='"+txtUrl+novelName+".txt' class='link'><img src='"+coverUrl+novelName+".jpg'></img><div class='mask'>"+novelName+"</div></a>"
		}
		content.html(htmlText);

		var href = "";
		$("#content a").click(function(event){
			event.preventDefault();
			href = window.location.href;
			window.location.href = href+"?novel="+$(this).find(".mask").text()+"&page="+1;
		});
	}else{
		var name = params.novel,//小说的名字
			page = !params.page ? 1 : params.page,//当前页数
			jsonObj = $.parseJSON($.ajax({url:txtUrl+params.novel+".txt",async:false}).responseText).txt,
			paraNum = 24,//每页段落数
			paraCount = jsonObj.length,//总段落数
			pageNum = paraCount%paraNum==0 ? paraCount/paraNum : parseInt(paraCount/paraNum)+1;//总页数
			startIndex = (page-1)*paraNum,
			htmlText = "",
			href = window.location.href,
			currPageUrl = href.substring(0,href.indexOf("?"));
		htmlText += "<h1>"+decodeURIComponent(name)+"<a href='"+currPageUrl+"'>返回</a></h1>"
		for (var i=startIndex,len=startIndex+paraNum;i<len;++i) {
			if(jsonObj[i]){htmlText += "<p>"+jsonObj[i]+"</p>";}
		}
		htmlText += "<div class='page-bar'><form class='bar' action='"+currPageUrl+"'>";
		page==1 ? htmlText+="<span class='disable'>上一页</span>":htmlText+="<a href='"+currPageUrl+"?novel="+name+"&page="+(parseInt(page)-1)+"'>上一页</a>";
		htmlText += "<input type='hidden' name='novel' value='"+decodeURIComponent(name)+"'>";
		htmlText += "<span>第<input type='text' name='page' value='"+page+"'>页/共<em>"+pageNum+"</em>页</span>";
		page==pageNum ? htmlText+="<span class='disable'>下一页</span>":htmlText+="<a href='"+currPageUrl+"?novel="+name+"&page="+(parseInt(page)+1)+"'>下一页</a>";
		htmlText += "</form></div>";
		content.html(htmlText);
	}
});