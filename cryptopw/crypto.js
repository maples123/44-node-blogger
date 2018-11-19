const crypto = require("crypto");


module.exports = function (password,key="zhe shi yi ge jia mi mi ma"){

	const hamc = crypto.createHmac("sha256",key);//创建加密方式是、

	hamc.update(password);//加密

	const passwordHamc = hamc.digest("hex");//输出加密的结果

	return passwordHamc;
}