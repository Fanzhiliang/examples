(function(){
	var checkboxs = $("#value-content tbody input[type='checkbox']"),
		selectAll = $("#selectAll"),
		opposite = $("#opposite"),
		checkboxsClick = function(event){
			var status = $(this).prop("checked");
			$(this).prop("checked",status);
		},
		selectAllHandler = function(){
			checkboxs.prop("checked",true);
		},
		oppositeHandler = function(){
			for(i=0,len=checkboxs.length;i<len;++i){
				$(checkboxs[i]).prop("checked",!$(checkboxs[i]).prop("checked"));
			}
		},
		setTitle = function(obj){
			var td = {};
			for (i=0,len=obj.length;i<len;++i) {
				td = obj[i];
				td.setAttribute("title", td.getElementsByTagName("span")[0].innerHTML);
			}
		};
	//给商品名称、商品介绍设置title属性
	setTitle($("#goods-list #value-content .name"));
	setTitle($("#goods-list #value-content .info"));
	setTitle($("#bill-list #value-content .ps"));
	setTitle($("#bill-list #value-content .bill-number"));
	//绑定事件
	checkboxs.click(checkboxsClick);
	selectAll.click(selectAllHandler);
	opposite.click(oppositeHandler);
})();

