(function(page,document){
	var i,len,
		href = window.location.href,//   http://localhost/b/bilibili/index.html
		pathName = window.location.pathname,//   /b/bilibili/index.html
		project = pathName.substring(0, pathName.substr(1).indexOf("/")+1),//   /b
		domain = href.substring(0, href.indexOf(pathName)),//   http://localhost
		pageWidth = page.innerWidth,
		pageHeight = page.innerHeight,
		head = document.getElementsByTagName("head")[0],
		link = {};
	if(!/Android|webOS|iPhone|iPod|BlackBerry|Phone/i.test(navigator.userAgent))//如果是pc端  主要!
		page.location.href= domain + project +"/bilibili";
	//获得宽高
	if(typeof pageWidth != "number"){
		if (document.compatMode == "CSS1Compat") {
			pageWidth = document.documentElement.clientWidth;
			pageHeight = document.documentElement.clientHeight;
		} else {
			pageWidth = document.body.clientWidth;
			pageHeight = document.body.clientHeight;
		}
	}
	//给html设置宽高，方便使用rem
	document.getElementsByTagName("html")[0].style.fontSize = pageWidth*0.0625 + "px";

})(window,window.document);