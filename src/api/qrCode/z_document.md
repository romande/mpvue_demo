/******** 1、获取二维码内容接口 ********/
URL:
	http://192.168.8.109:59782/app/v1.1/cabinet/app-reverse/takePartQR
Method:
	POST
params:
	{
    	"reversePwd":"111", 		//取件码
    	"productId":"001",			//产品code		CONSTANT.PRODUCT_ID_201
    	"actionId":""				//产品动作		CONSTANT.PRODUCT_ID_201_ACTION_01
	}