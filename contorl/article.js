const User = require("../Modeis/user");
const Article = require("../Modeis/article");
const Comment = require("../Modeis/comment");

//进入文章发表页面
exports.addPage = async (ctx,next) => {

	await ctx.render("add-article.pug",{
		title : "文章发布页面",
		session : ctx.session,
	})

}

//添加文章 保存到数据库
exports.add = async ctx => {
	//判断用户是否登陆
	if(ctx.session.isNew){
		return ctx.body = {
			msg : "用户未登录",
			session : 0
		}
	}

	//用户登录状态下
	const data = ctx.request.body;
	//添加作者
	data.author = ctx.session.uid;
	//设置文章数量的初始值
	data.commentNum = 0;


	// console.log(data);//这里data有作者和文章信息
	await new Promise((resolve,reject) => {
		//将评论议案加到数据库
		new Article(data).save((err,data) => {
			// console.log(data);//这里只有数据库的一个id，就没有了
			if(err)return reject(err);

			//更新用户文章计数
			User.update({_id : data.author},{
				$inc : {//自增
					articleNum : 1
				}
			},err => {
				return console.log(err)
			})


			resolve(data);
		});
	})
	.then(data => {
		
		ctx.body = {
			msg : "发表成功",
			status :1
		}
	})
	.catch(err => {
		
		ctx.body = {
			msg : "发表失败",
			status :0
		}
	})
}

//文章列表
exports.getList = async ctx => {
	//查看用户对应的文章的头像
	let page = ctx.params.id || 1//获取id
	page--

	//动态获取数据库里面文章的最大数量
	const maxNum = await Article.estimatedDocumentCount((err,num) =>
	 err? console.log(err):num)

	// console.log(maxNum)
	//查询数据库
	const artList = await Article
		.find()//查询数据库 需要then,exec获者传毁掉它才会查询
		.sort('-created')//降序
		.skip(3 * page)//跳过多少文章
		.limit(3)//获取并显示当前多少文章
		.populate({
			path : "author",
			select : "username _id avatar"
		})//mongoose用于连表查询的一种方法
		.then(data => data)
		.catch(err => {
			console.log(err)
		})
	// console.log(artList)
	
	//渲染首页
	await ctx.render("index.pug",{
		title : "博客实战首页",
		session : ctx.session,
		artList,
		maxNum
	})
}

//文章详情
exports.details = async ctx => {

	const _id = ctx.params.id;

	//文章
	const article = await Article
		.findById(_id)//通过id获取
		.populate("author","username")
		.then(data => data)

	//评论
	const comment = await Comment
		.find({article : _id})//获取当前文章的 id
		.sort("-created")
		.populate("from","username avatar")
		.then(data => data)
		.catch(err => {
			console.log(err)
		})


	await ctx.render("article.pug",{
		title : article.title,
		article,
		comment,
		session : ctx.session
	})

}

//返回用户的所有文章
exports.artList = async ctx => {

	const uid = ctx.session.uid;

	const data = await Article.find({author : uid})

	ctx.body = {
		code : 0,
		count : data.length,
		data
	}

}

//删除用户的文章
exports.del = async ctx => {

	const _id = ctx.params.id;

	let res = {
		state : 1,
		message : "成功"
	}
	await Article
		.findById(_id)
		.then(data => data.remove())
		.catch(err => {
			res = {
				state : 0,
				message : "失败了"
			}
			console.log(err)
		})


	ctx.body = res;
}