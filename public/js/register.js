layui.use("element",function(){
	const elememt = layui.elememt;
	const $ = layui.$;

	let $username = $(".layui-show input[name=username]");
	let $password = $(".layui-show input[name=password]");
	let $passwords = $(".layui-show input[name=passwords]");
	
	$passwords.on("blur",function(){

		const pwd = $password.val();
		if($(this).val() !== pwd){
			alert("两次密码输入不一致")
			$(this).val("");
		}
	})
})