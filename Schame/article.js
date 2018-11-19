const { Schema } = require("./config");
const ObjectId = Schema.Types.ObjectId;//获取用户数据库里面的id值

const ArtSchema = new Schema({
	title : String,
	content : String,
	author : {
		type : ObjectId,
		ref : "users"//关联存储用户数据集合
	},
	tips : String,
	commentNum : Number
},{
	versionKey : false,
	timestamps : {
		createdAt : "created"
	}
})

ArtSchema.post("remove",(doc) => {

	const Comment = require("../Modeis/comment");
	const User = require("../Modeis/user");

	const { _id : artId, author : authorId } = doc

	// console.log(doc)
	//更新用户的articleNum -1
	User.findByIdAndUpdate(authorId,{
		$inc : {
			articleNum : -1
		}
	}).exec();

	//循环遍历用户的评论依次删除
	Comment.find({article : artId})
		.then(data => {
			data.forEach(v => v.remove())
		})
		.catch(err => {
			console.log(err)
		})

})

module.exports = ArtSchema;