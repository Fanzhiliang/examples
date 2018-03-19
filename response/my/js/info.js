$(document).ready(function(){
	var book = $.parseJSON($.ajax({url:"info.txt",async:false}).responseText),
		content = $("#content"),
		htmlText = "",
		parts = book.parts,
		organizes = {},
		members = {};
	//根据json添加内容
	htmlText += "<h1>"+book.name+" <span> "+book.tag+"</span></h1>";
	for(var i=0,len=parts.length;i<len;++i){
		htmlText += "<h2>"+parts[i].name+"</h2>";
		if(parts[i].infos&&parts[i].infos.length>0){
			for(var u=0,lenu=parts[i].infos.length;u<lenu;++u){
				htmlText += "<p>"+parts[i].infos[u]+"</p>";
			}
		}
		if(parts[i].organizes&&parts[i].organizes.length>0){
			organizes = parts[i].organizes;
			for(var j=0,lenj=organizes.length;j<lenj;++j){
				htmlText += "<h3>"+organizes[j].name+"</h3>";
				if(organizes[j].members&&organizes[j].members.length>0){
					members = organizes[j].members;
					for(var k=0,lenk=members.length;k<lenk;++k){
						htmlText += "<div class='info-item'>";
						htmlText += "<div class='info-img'>";
						htmlText += "<img src='"+members[k].img+"' alt='"+members[k].name+"'>";
						htmlText += "</div>";
						htmlText += "<div class='info-text'>";
						htmlText += "<p><a target='_blank' href='https://baike.baidu.com/item/"+encodeURIComponent(members[k].name)+"'>"+members[k].name+"</a></p>";
						htmlText += "<p>声优:<a target='_blank' href='https://baike.baidu.com/item/"+encodeURIComponent(members[k].actor)+"'>"+members[k].actor+"</a></p>";
						htmlText += "<p>"+members[k].info+"</p>";
						htmlText += "</div>";
						htmlText += "</div>";
					}
				}
			}
		}
	}
	content.html(htmlText);
});