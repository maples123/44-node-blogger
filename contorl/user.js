const User = require("../Modeis/user");
const crypto = require("../cryptopw/crypto");//返回一个加密函数



//处理并返回用户注册信息
exports.reg = async (ctx,next) => {

	//用户post请求发送过来的数据
	const user = ctx.request.body;
	// console.log(user);
	//获取用户注册信息
	const username = user.username;
	const password = user.password;

	//查询数据库数据 io操作
	await new Promise((resolve,reject) => {

		//查询用户名是否存在
		User.find({username},(err,data) => {
			
			if(err) return reject(err);
			// console.log(data);
			//数据不能为空
			if(data.length !== 0){
				//返回空字符串，表明用户已存在
				return resolve("");
			}

			//用户不存在 正常注册 加密用户密码
			const _user = new User({
				username,
				password : crypto(password),
				articleNum : 0,
				commentNum : 0
			})

			//将数据插入数据库
			_user.save((err,data) => {
				// console.log(data);
				if(err){
					reject(err);
				}else{
					resolve(data);
				}
			})

		})

	})
	.then(async data => {

		if(data){//正常注册

			console.log(data);

			await ctx.render("isOk.pug",{
				status : "用户注册成功"
			})
			console.log(1)
		}else{//用户已存在

			await ctx.render("isOK.pug",{
				status : "该用户已存在"
			})
		}
	})
	.catch(async err => {
		//返回注册失败信息 
		if(err){
			console.log(err);
		}
		//注册失败 
		await ctx.render("isOK.pug",{
			status : "注册失败，请重新注册"
		})
	})
}


//用户登录
exports.login = async (ctx,next) => {

	const user = ctx.request.body;
	const username = user.username;
	const password = user.password;
	
	await new Promise((resolve,reject) => {

		User.find({username},(err,data) => {

			if(err) return reject(err);
			if(data.length === 0) return reject("用户不存在")
			
			//将用户传入的密码与数据库的密码进行比较
			if(data[0].password === crypto(password)){
				return resolve(data);
			}

			resolve("");//用户传入的密码与数据库的密码不相同
		})
	})
	.then(async data => {
		//登陆失败
		if(!data){
			return ctx.render("isOk.pug",{
				status : "登陆失败，密码错误"
			})
		}

		//设置用户的cookie里的username和password，加密后的密码，权限
		ctx.cookies.set("username",username,{//设置用户名
			domain : "localhost",//主机名
			path : "/",//路径
			maxAge : 36e5,//过期时间
			httpOnly : true,//HTTP是否显示
			overwrite : false
		})

		ctx.cookies.set("uid",data[0]._id,{//设置用户id
			domain : "localhost",//主机名
			path : "/",//路径
			maxAge : 36e5,//过期时间
			httpOnly : true,//HTTP是否显示
			overwrite : false
		})

		//保存用户数据
		ctx.session = {
			username,
			uid : data[0]._id,
			avatar : data[0].avatar,
			role : data[0].role
		}

		// console.log(data)

		//登陆成功
		await ctx.render("isOk.pug",{
			status : "登陆成功"
		})

	})
	.catch(async err => {

		//登陆失败
		await ctx.render("isOk.pug",{
			status : "登陆失败"
		})
	})
};

//保持用户的登录状态
exports.keepLog = async (ctx,next) => {
	/*
		当ctx.session.isNew为true时，表明session里面没有数据,用户未登录
		当ctx.session.isNew为undefiend时，表明session里面有数据
		ctx.cookies.get("username")

	*/

	if(ctx.session.isNew){
		if(ctx.cookies.get("username")){
			let uid = ctx.cookies.get("uid");
			//用户上传头像后，更新用户头像
			await User
				.findById(uid)
				.then(data => {
					console.log(data)
					return data.avatar
				})

			//保存用户名，用户ID，用户头像
			ctx.session = {
				username : ctx.cookies.get("username"),
				uid,
				avatar
			}
		}
	}
	await next();
} 


//用户退出
exports.logout = async (ctx,next) => {

	//清空session
	ctx.session = null;

	//清空cookie
	ctx.cookies.set("username",null,{
		maxAge : 0
	})
	//清空id
	ctx.cookies.set("uid",null,{
		maxAge : 0
	})

	//重新定向到首页
	ctx.redirect("/");
}


//用户头像上传
exports.uploda = async ctx => {

	//获取图片名
	const filename = ctx.req.file.filename;


	//设置图片保存路径
	const data = await User.update({_id : ctx.session.uid},{
		$set : {
			avatar : "/avatar/" + filename
		}
	})

	

	ctx.body = {
		status : 1,
		message : "头像上传成功"
	}
}
//查询所有普通用户
exports.userList = async ctx => {

	//用户的id
	const uid = User._id;

	//查询用户数据库的的id获取用户信息
	const data = await User.find(uid)
	
	ctx.body = {
		code : 0,
		count : data.length,
		data
	}
}

//删除普通用户
exports.del = async ctx => {

	const userId = ctx.params.id;


	let res = {
		state : 1,
		msg : "成功"
	}

	//删除用户
	await User
		.findById(userId)
		.then(data => data.remove())
		.catch(err => {
			res = {
				state : 0,
				msg : "失败"
			}
		})

		ctx.body = res;
}

