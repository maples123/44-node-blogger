const { Schema } = require("./config");

//用Schema规范数据结构
const UserSchema = new Schema({
	username : String,
	password : String,
	role : {//普通用户权限
		type : String,
		default : 1
	},
	avatar : {//头像
		type : String,
		default : "/avatar/default.jpg"
	},
	articleNum : Number,//当前用户文章数量
	commentNum : Number//当前用户文章的评论数量
},{
	versionKey : false//去除版本号
})

UserSchema.post("remove",(doc) => {


	/*
		删除用户
			文章全部删除
			文章的评论全部删除		

	*/


	const Article = require("../Modeis/article");
	const Comment = require("../Modeis/comment");

	const { _id } = doc

	
	//删除用户文章
	const a = Article.find({article : _id})
		.then(data => {
			data.forEach(v => v.remove())
		})
		.catch(err => {
			console.log(err)
		})

	//删除用户文章的评论
	const c = Comment.find({from : _id})
		.then(data => {
			data.forEach(v => v.remove())
		})
		.catch(err => {
			console.log(err)
		})

		// console.log(a,c)

})


//导出Schema规范后的数据
module.exports = UserSchema;