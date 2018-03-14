(function(page,document){
	var href = window.location.href,//   http://localhost/b/bilibili/index.html
		pathName = window.location.pathname,//   /b/bilibili/index.html
		project = pathName.substring(0, pathName.substr(1).indexOf("/")+1),//   /b
		domain = href.substring(0, href.indexOf(pathName)),//   http://localhost
		pageWidth = page.innerWidth,
		pageHeight = page.innerHeight,
		link = {},
		head = page.document.getElementsByTagName("head")[0];
	if(/Android|webOS|iPhone|iPod|BlackBerry|Phone/i.test(navigator.userAgent))//如果是移动端  主要没!
		page.location.href= domain + project +"/mbilibili";
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
	//如果宽度大于等于1440，添加1440+样式
	if(pageWidth>=1440){
		link = page.document.createElement("link");
		link.setAttribute("rel", "stylesheet");
		link.setAttribute("href", "../styles/1440+.css");
		head.append(link);
	}
})(window,window.document);