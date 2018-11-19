layui.use(["element","laypage"],() => {
	let element = layui.element;
	let laypage = layui.laypage;
	const $ = layui.$;

	element.tabDelete('demo', 'xxx')

	laypage.render({
		elem : "laypage",
		count : $("#laypage").data("maxnum"),
		limit : 3,
		groups : 3,
		curr : location.pathname.replace("/page/",""),
		jump : function(obj,fri){
			$("#laypage a").each((i,v) => {
				//拼接路劲
				let pageValue = `/page/${$(v).data("page")}`;
				// console.log(pageValue)
				//添加路劲
				v.href = pageValue;
			})
		}
	})
})