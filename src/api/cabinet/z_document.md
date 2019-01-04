/******** 1、云柜列表 ********/
URL:
	http://192.168.8.109:59782/app/v1.0/cabinet/app-reverse/cabinetList
Method:
	POST
params:
	{
		"pageIndex": 1,					//分页
		"caseOrFileNo": "",				//查询条件：案件或文件号
		"reverseUserRole": "",			//我的-存件、取件(001、002)
		"reverseStates": "",			//流转状态-待指派、待取件、已收件（0、1、2）
		"reverseOverDueStates": ""		//逾期状态（0、1）
	}

/******** 2、云柜流转详情 ********/
URL:
	http://192.168.8.123/app/v1.0/cabinet/app-reverse/{reverseId}
Method:
	GET
Data:
	{
		reverseId					//流转ID
	}
 

/******** 3、获取法院列表 ********/
URL:
	http://192.168.8.123/app/v1.0/system/company/deptList
Method:
	GET
Data:
	{
		 
	}
 

/******** 4、获取部门列表 ********/
URL:
	http://192.168.8.123/app/v1.0/cabinet/app-reverse/list-by-companyId/{companyId}
Method:
	GET
Data:
	{
		companyId					//法院ID
	}
 


/******** 5、获取部门成员列表 ********/
URL:
	http://192.168.8.123/app/v1.0/cabinet/app-reverse/list-by-office/{officeId}
Method:
	GET
Data:
	{
		officeId					//部门ID
	}


/******** 6、指派 ********/
URL:
	http://192.168.8.123/app/v1.0/cabinet/app-reverse/appoint
Method:
	POST
Data:
	{	
		reverseId: "6187346047008768",				//流转ID
		appointUserId: 6095264801226752,			//要指派用户ID
		caseNos: ["(2018)苏05民初567号"]			//案号
	}

/******** 7、撤销流转 ********/
URL:
	http://192.168.8.123/app/v1.0/cabinet/app-reverse/cancel-reverse
Method:
	POST
Data:
	{	
	    reverseId: "",			//流转ID
        reversePwd: "",			//流转密码
        mobile: "",				//联系方式
        caseNos:[]				//案号
	}