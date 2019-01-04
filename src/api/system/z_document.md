/******** 1、后台登录 ********/
URL:
	http://192.168.8.109:59782/app/v1.0/system/wechat/mp/login
Method:
	POST
params:
	{
		"userName": "zhangsan",				//用户名
		"password": "123456",				//密码
		"useOpenIdLogin": "",				//是否用openId登录，目前为false
		"openId": "",						//小程序唯一标识
	}

/******** 2、用户信息 ********/
URL:
	http://192.168.8.123/app/v1.0/system/appUser/getInfo
Method:
	GET
 

/******** 3、用户可使用模块列表 ********/
URL:
	http://192.168.8.123/app/v1.0/global/product/Usage
Method:
	POST
Data:{}	//根据上下文的当前用户信息去查询，不需要其他参数