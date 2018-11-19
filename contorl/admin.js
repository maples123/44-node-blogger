const User = require("../Modeis/user");
const Article = require("../Modeis/article");
const Comment = require("../Modeis/comment");


const fs = require("fs");
const { join } = require("path"); 

//管理员页面
exports.index = async ctx => {
	//用户未登录
	if(ctx.session.isNew){

		ctx.status = 404;

		return await ctx.render("404.pug",{
			title : 404
		})
	}
	//获取id
	const id = ctx.params.id;
	//拼接路径
	const arr = fs.readdirSync(join(__dirname,"../views/admin"));

	let flag = false;//开关
	arr.forEach(v => {

		const name  = v.replace(/^(admin\-)|(\.pug)$/g,"");
		if(name === id){
			flag = true;
		}
	})

	if(flag){
		//true 用户登陆了
		await ctx.render("./admin/admin-" + id + ".pug",{
			role : ctx.session.role,
		})
	}else{
		ctx.status = 404;
		await ctx.render("404.pug",{
			title : 404
		})
	}
} 

//querySelector(selectors: DOMString)