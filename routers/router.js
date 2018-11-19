var Router = require("koa-router");
var user = require("../contorl/user");
var article = require("../contorl/article");
var comment = require("../contorl/comment");
const admin = require("../contorl/admin");
const uploda = require("../cryptopw/uploda");

var router = new Router;

//设置首页
router.get("/",user.keepLog,article.getList);

//处理用户的登陆注册
router.get(/^\/user\/(?=reg|login)/,async (ctx,next) => {

	//show为true显是注册  false登录  
	const show = /reg$/.test(ctx.path)


	await ctx.render("register.pug",{show})
})

//用户登录 处理post请求
router.post("/user/login",user.login);

//用胡注册 
router.post("/user/reg",user.reg);

//用户退出
router.get("/user/logout",user.logout);

//文章发表页面
router.get("/article",user.keepLog,article.addPage)

//文章添加
router.post("/article",user.keepLog,article.add)

//文章分页列表路由
router.get("/page/:id",user.keepLog)

//文章详情 路由
router.get("/article/:id",user.keepLog,article.details)


//发表评论
router.post("/comment",user.keepLog,comment.addCom)


//用户管理页面
router.get("/admin/:id",user.keepLog,admin.index)

//上传头像
router.post("/upload",user.keepLog,uploda.single("file"),user.uploda)

//获取用户评论
router.get("/user/comments",user.keepLog,comment.comList)

//删除用户评论
router.del("/comment/:id",user.keepLog,comment.del)

//查询文章
router.get("/user/articles",user.keepLog,article.artList)

//删除文章
router.del("/article/:id",user.keepLog,article.del)

//查询所有用户
router.get("/user/users",user.keepLog,user.userList)

//删除普通的用户
router.del("/user/:id",user.keepLog,user.del)

//404
router.get("*",async ctx => {
	await ctx.render("404.pug",{
		title : "404"
	})
})


module.exports = router;
