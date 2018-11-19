var Koa = require("koa");
var views = require("koa-views");//为koa提供视图文件服务中间件，如pug
var static = require("koa-static");//为koa提供静态文件服务中间件
var router = require("./routers/router");//用于控制路由的模块
var logger = require("koa-logger");//由于记录中间件的一个模块，需要设置在中间件的顶部
var body = require("koa-body");
var { join } = require("path");
var session = require("koa-session");

var app = new Koa;

app.keys = ["你好么"];//加密签名

//配置session对象
const CONFIG = {
	key : "Sid",
	maxAge : 36e5,//最大保存时间
	overwrite : true,//是否覆盖
	httpOnly : true,//HTTP是否可见
	signed : true,//签名
	rolling : true,//是否延长过期时间
}

//注册日志模块
app.use(logger());

//注册session
app.use(session({CONFIG},app))

//处理post请求的数据
app.use(body());

//配置静态资源路径
app.use(static(join(__dirname,"public")));

//配置pug视图模板
app.use(views(join(__dirname,"views")),{
	extension : "Pug"
});


//注册路由信息
app
  .use(router.routes())
  .use(router.allowedMethods());

//连接端口
app.listen(6001);


//创建管理员

{
	const User = require("./Modeis/user");
	const crypto = require("./cryptopw/crypto");//返回一个加密函数

	User
		.find({username : "admin"})
		.then(data => {
			if(data.length === 0){
				//添加管理员
				new User({
					username : "admin",
					password : crypto("admin"),
					role : 666,//管理员权限
					articleNum : 0,
					commentNum : 0
				})
				.save()
				.then(data => {
					
					console.log("管理员用户：admin，密码：admin");
				})
				.catch(err => {
					console.log(err);
				})

			}else{
				//管理员已存在



				console.log("管理员用户：admin，密码：admin");
			}
		})

}