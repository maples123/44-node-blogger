const { Schema } = require("./config");
const ObjectId = Schema.Types.ObjectId;//获取用户数据库里面的id值



const ComSchema = new Schema({
	content : String,//文章内容
	from : {//用户
		type : ObjectId,
		ref : "users"
	},
	//文章
	article : {
		type : ObjectId,
		ref : "articles"
	}
},{
	versionKey : false,
	timestamps : {
		createdAt : "created"
	}
})


//设置comment的钩子 

ComSchema.post("remove",(doc) => {


	const Article = require("../Modeis/article");
	const User = require("../Modeis/user");

	const { from, article } = doc

	//对应文章的评论减一
	Article.updateOne({_id:article},{$inc : {
		commentNum : -1
	}}).exec();
	//当前被删除评论的作者的commentNum-1
	User.updateOne({_id:from},{$inc : {
		commentNum : -1
	}}).exec();



})


module.exports = ComSchema;