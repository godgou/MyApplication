
var Userdata="",//用户数据
    user_id="",//
	user_tel="",//
	user_sex="",//
	sex="",
	user_money="",//
	mobile_brand="",//
	money_pm="",//富豪榜
	user_mood="",//心情签名
	reg_age="",//注册年龄
	load_loca="",//上次登陆地点
	load_time="";//上次登陆时间


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

function SetUserData(data){//获取android返回的用户数据
if(data.result="ok"){
	Userdata=data;
	user_name=data.name;//
	document.getElementById("name").innerHTML=user_name;
	user_id=data.id;//
	document.getElementById("uid").innerHTML=user_id;
	user_sex=data.sex;//
	sex=document.getElementById("sex");
	if(user_sex=="男"){sex.setAttribute("class","fa fa-mars");}
	else if(user_sex=="女"){sex.setAttribute("class","fa fa-venus");}
	else{sex.setAttribute("class","fa fa-genderless");}
	user_money=data.money;//
	document.getElementById("money").innerHTML=user_money;
	money_pm=data.money_pm;//富豪榜
	document.getElementById("money_pm").innerHTML=money_pm;
	reg_age=data.reg_age;//注册年龄
	document.getElementById("reg_age").innerHTML=reg_age;
	mobile_brand=data.brand;//
	document.getElementById("mobile_brand").innerHTML=mobile_brand;
	load_loca=data.load_loca;//上次登陆地点
	document.getElementById("load_loca").innerHTML=load_loca;
	load_time=data.load_time;//上次登陆时间
	document.getElementById("load_time").innerHTML=load_time;
	user_mood=data.mood;//心情签名
	document.getElementById("mood").innerHTML=user_mood;
	}
}//设置用户数据

$(document).ready(function(){
	
		$.get("http://42.51.158.129/php/get_loca.php",function(data){//获取网络地理位置
		if(data['result']=="0"){reg_loca=data['loca'];}
		else{
		reg_loca="未知";}
        });

$("#login").click(function(){//发送登入信息
if($("#label_account").attr("class")=="label label-success"&&
$("#label_password").attr("class")=="label label-success"){
loading("show");
var d_t= new Date(),dt=d_t.getTime(),countdown=15,gogo=setInterval(gogogo,1000);
function gogogo(){
	countdown--;
	if(countdown==0){clearInterval(gogo);
	pop("服务器无响应，请重试");
	loading();
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
			window.android.SetUserData(data);
                window.open("file:///android_asset/main.html");
			}else{//登陆失败
			    if(data["result"]=="binding"){//非绑定设备异常登入处理
			    $('#myModalLabel').text('非绑定设备登陆异常');
				pop("此账号与这台设备("+brand+")非绑定关系,为了用户账号安全,需绑定后才能登陆");
				}else{
	                pop(data["result"]);
			}
	}
	clearInterval(gogo);loading();
		});
		
		
}//用户所填信息是否完整
else{pop("请把填空题都填对了才能登入");
}
});

//---------------------自定义函数----------------

function pop(text){//模态框
$('.modal-body').html(text);$('#myModal').modal();$('.modal-content').css("top",$(window).height()/3+"px");
}
$('#myModal').on('hide.bs.modal', function () {//当调用 hide 实例方法时触发。
if($('#myModalLabel').text()=='非绑定设备登陆异常'){window.open("file:///android_asset/reg_lod/binding.html");}
});

function loading(x){//加载动画
	if(x=="show"){
		$('.loading').css({"display":"flex","height":$(window).height()+"px"});
	}else{
		$('.loading').hide();
	}
}

})//$(document).ready() 方法允许我们在文档完全加载完后执行函数

