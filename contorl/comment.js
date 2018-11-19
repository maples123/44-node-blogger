const User = require("../Modeis/user");
const Article = require("../Modeis/article");
const Comment = require("../Modeis/comment");

//评论
exports.addCom = async ctx => {

	let message = {
		status : 0,
		msg : "登陆了才能评论"
	}
	//用户未登录
	if(ctx.session.isNew)return ctx.body = message;

	//post从前端传到后端的数据
	const data = ctx.request.body;
	//用户id
	data.from = ctx.session.uid;

	const _comment = new Comment(data)
		await _comment
			.save(data)//将数据保存到数据库
			.then(data => {

				message = {
					status : 1,
					msg : "评论成功"
				}
			//更新评论数量 定时器

				Article
					.update({_id : data.article},{$inc : {//自增
						commentNum : 1
					}},err => {
						if(err)return console.log(err)
						console.log("评论计数器更新成功");
					})
				//更新用户评论的计数器
				User.update({_id : data.from},{
					$inc : {
						commentNum : 1
					}
				},err => {
					return console.log(err)
					console.log(1)
				})

			})
			.catch(err => {
				console.log(err)

				message = {
					status : 0,
					msg : "评论失败"
				}
			})

	ctx.body = message;
}

//查询用户评论
exports.comList = async ctx => {

	const uid = ctx.session.uid;


	const data = await Comment
		.find({from:uid})
		.populate("article","title")

	ctx.body = {
		code : 0,
		count : data.length,
		data
	}
}
//删除用户评论
exports.del = async ctx => {

	var commentId = ctx.params.id;

	let res = {
		state : 1,
		message : "成功"
	}

	await Comment
		.findById(commentId)
		.then(data => data.remove())
		.catch(err => {
			res = {
				state : 0,
				message : "失败了"
			}
		})

	ctx.body = res;
}
