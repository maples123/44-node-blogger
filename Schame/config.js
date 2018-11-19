const mongoose = require("mongoose");

//链接mongodb服务器 创建数据库
const db = mongoose.createConnection("mongodb://localhost:27017/loger",
	{useNewUrlParser : true});

//用原生es6的promise取代mongoose自带的promise
mongoose.promise = global.promise;


db.on("error",function(){
	console.log("数据连接失败");
})

db.on("open",function(){
	console.log("数据连接成功");
})

//获取Schema
const Schema = mongoose.Schema;


module.exports = {
	db,
	Schema
}