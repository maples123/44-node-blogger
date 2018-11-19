layui.use(["layedit","layer","element"],function(){
	const layedit = layui.layedit;
	const layer = layui.layer;
	const element = layui.element;
	const $ = layui.$;


	//建立编辑器
	const idx = layedit.build("comment-txt",{
		tool : [],
		height : 160
	});

	$(".layui-unselect.layui-layedit-tool").hide();


	$(".comment button").click(async () => {

		//评论内容
		let content = layedit.getContent(idx).trim();
		
		if(content.length === 0){
			return layer.msg("评论内容不能为空");
		}

		//评论内容和用户id
		const data = {
	      content,
	      article: $(".art-title").data("artid")
	    }



	    $.post("/comment", data, (data) => {
	      layer.msg(data.msg, {
	        time: 1000,
	        end(){
	          if(data.status === 1){
	            // 评论成功就承载页面
	            window.location.reload()
	          }
	        }
	      })
	    })
	 
	})
})