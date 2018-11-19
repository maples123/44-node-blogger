const { db } = require("../Schame/config");//获取数据库的操作权
//获取用户的Schema,拿到users的操作权
const  UserSchema = require("../Schame/user");
const User = db.model("users",UserSchema);

module.exports = User;