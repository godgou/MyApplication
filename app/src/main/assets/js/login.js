
var account="",//账号
login="",//登陆类型
pw="",//密码
imei="",//手机唯一imei号
brand="";//手机型号

function AccountInput(){//账号输入框内容改变事件
account= document.getElementById("account").value;
var label_account=document.getElementById("label_account");
if(!/^\+?[1-9][0-9]*$/.test(account)){
	label_account.setAttribute("class","label label-danger");
	label_account.innerHTML="uid或手机号码只能是非零正整数";return;}
label_account.setAttribute("class","label label-success");
if(account.length==11 && /^1[3|4|5|7|8][0-9]{9}$/.test(account)){
login="tel";label_account.innerHTML="您将用此手机号码账号登入";
}else{login="id";label_account.innerHTML="您将用此uid账号登入";}
}

function PasswordInput(){//密码输入框内容改变事件
            pw= document.getElementById("password").value;
			var label_password=document.getElementById("label_password");
            if(pw.length>=8&&pw.length<=16){
			if(/^[a-zA-Z0-9]*([a-zA-Z][0-9]|[0-9][a-zA-Z])[a-zA-Z0-9]*$/.test(pw)){//不允许纯字母或纯数字或特殊字符
            label_password.setAttribute("class","label label-success");label_password.innerHTML="您输入的内容符合密码要求";
			}else{label_password.setAttribute("class","label label-danger");label_password.innerHTML="不允许纯字母或纯数字或特殊字符!";}
			}else{label_password.setAttribute("class","label label-danger");label_password.innerHTML="密码长度应为8~16个字符";}
}

function SetMobileID(i,b){imei=i;brand=b;}//设置手机imei和型号
$(document).ready(function(){

$("#login").click(function(){//发送登入信息
if($("#label_account").attr("class")=="label label-success"&&
$("#label_password").attr("class")=="label label-success"){
gg_loading("show");
var d_t= new Date(),dt=d_t.getTime(),countdown=15,gogo=setInterval(gogogo,1000);
function gogogo(){
	countdown--;
	if(countdown==0){clearInterval(gogo);
	gg_pop("服务器无响应，请重试");
	gg_loading();
	}//停止
}//倒数15秒后才可以重新登入

		$.post("http://42.51.158.129/php/app_loading.php",{//发出登入请求
			type:"login",
			idortel:login,
			id:account,
			tel:account,
			pw:pw,
			imei:imei,
			brand:brand,
			load_loca:load_loca
		},
		function(data){
			if(data["result"]=="ok"){//登陆成功
			var date1 = new Date(data.reg_time),//注册时间
			date2 = new Date(),//现在时间
			total = (date2.getTime() - date1.getTime())/1000,//现在时间减去注册时间
			year = parseInt(total / (24*60*60*365)),//计算整数年
			day = parseInt(total / (24*60*60))%365;//计算取年后的所剩整数天数
			data.reg_age=year+"年"+day+"天";
			data=JSON.stringify(data);
			window.android.UserData(data);alert(data);
            window.open("file:///android_asset/main.html");
			}else{//登陆失败
			    if(data["result"]=="binding"){//非绑定设备异常登入处理
			    $('#myModalLabel').text('非绑定设备登陆异常');
				gg_pop("此账号与这台设备("+brand+")非绑定关系,为了用户账号安全,需绑定后才能登陆");
				}else{
	                gg_pop(data["result"]);
			}
	}
	clearInterval(gogo);gg_loading();
		});
		
		
}//用户所填信息是否完整
else{gg_pop("请把填空题都填对了才能登入");
}
});

})//$(document).ready() 方法允许我们在文档完全加载完后执行函数

