const { db } = require("../Schame/config");//获取数据库的操作权
//获取用户的Schema,拿到comment的操作权
const  ComSchema = require("../Schame/comment");
//通过db对象创建操作Comment数据库的模型对象
const Comment = db.model("comments",ComSchema);



module.exports = Comment;