const { db } = require("../Schame/config");//获取数据库的操作权


const  ArtSchema = require("../Schame/article");//获取Schema规范后的数据
//通过db对象创建操作Article数据库的模型对象
const Article = db.model("articles",ArtSchema);//创建集合

module.exports = Article;