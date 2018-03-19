$(document).ready(function(){
	var animation = $.parseJSON($.ajax({url:"animation.txt",async:false}).responseText),
		content = $("#content"),
		namesText = "",
		episodesText = "",
		episodes = [];
	namesText += "<div class='seasons'>";
	for(var i=0,len=animation.parts.length;i<len;++i){
		namesText += "<span>"+animation.parts[i].name+"</span>";
	}
	namesText += "<div class='tag'>"+animation.tag+"</div>";
	namesText += "</div>";
	
	for(var j=0,lenj=animation.parts.length;j<lenj;++j){
		episodes = animation.parts[j].episodes;
		if(episodes.length>0){
			episodesText += "<div class='row'>";
			episodesText += "<div class='episodes'>";
			for(var k=0,lenk=episodes.length;k<lenk;++k){
				episodesText += "<span title='"+episodes[k].name+"' flash='"+episodes[k].flash+"'>";
				episodesText += (k+1)+". "+episodes[k].name+"</span>";
			}
			episodesText += "</div>";
			episodesText += "<div class='toggle'><span toggle='收起'>展开</span></div>";
			episodesText += "</div>";
		}
	}
	content.html(namesText+episodesText);

	var seasons = $("#content .seasons span"),
		rows = $("#content .row"),
		episodes = $("#content .row .episodes span"),
		toggles = $("#content .row .toggle span");

	seasons.each(function(i){
		if(i==0){$(this).addClass("selected");}
		$(this).click(function(event){
			$(this).siblings(".selected").removeClass("selected");
			$(this).addClass("selected");
			rows.each(function(index){
				index==i ? $(this).css("display","block") : $(this).css("display","none");
			});
		});
	});

	rows.each(function(i){
		i==0 ? $(this).css("display","block") : $(this).css("display","none");
	});

	episodes.each(function(i){
		if(i==0){$(this).addClass("selected");}
		$(this).click(function(event){
			$("#content .row .episodes span.selected").removeClass("selected");
			$(this).addClass("selected");
		});
	});

	toggles.click(function(event){
		var target = $(this),
			parent = target.parents(".row"),
			temp = target.attr("toggle");
		parent.toggleClass("show");
		target.toggleClass("selected");
		target.attr("toggle",target.text());
		target.text(temp);
	});
});