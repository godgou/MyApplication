var account="",//账号
binding="",//绑定类型
pw="",//密码
load_loca="",//网络地理位置
imei="",//手机唯一imei号
brand="";//手机型号

function AccountInput(){//账号输入框内容改变事件
account= document.getElementById("account").value;
var label_account=document.getElementById("label_account");
if(!/^\+?[1-9][0-9]*$/.test(account)){
	label_account.setAttribute("class","label label-danger");
	label_account.innerHTML="uid或手机号码只能是非零正整数";return;}
label_account.setAttribute("class","label label-success");
label_account.innerHTML="您的账号将绑定此手机设备:"+brand;
if(account.length==11 && /^1[3|4|5|7|8][0-9]{9}$/.test(account)){
binding="tel";}else{binding="id";}}

function PasswordInput(){//密码输入框内容改变事件
            pw= document.getElementById("password").value;
			var label_password=document.getElementById("label_password");
            if(pw.length>=8&&pw.length<=16){
			if(/^[a-zA-Z0-9]*([a-zA-Z][0-9]|[0-9][a-zA-Z])[a-zA-Z0-9]*$/.test(pw)){//不允许纯字母或纯数字或特殊字符
            label_password.setAttribute("class","label label-success");label_password.innerHTML="您输入的内容符合密码要求";
			}else{label_password.setAttribute("class","label label-danger");label_password.innerHTML="不允许纯字母或纯数字或特殊字符!";}
			}else{label_password.setAttribute("class","label label-danger");label_password.innerHTML="密码长度应为8~16个字符";}
}

function SetMobileID(i,b){imei=i;brand=b;document.getElementById("label_account").innerHTML="您的账号将绑定此手机设备:"+b;}//设置手机imei和型号
$(document).ready(function(){
		$.get("http://42.51.158.129/php/get_loca.php",function(data){//获取网络地理位置
		if(data['result']=="0"){reg_loca=data['loca'];}
		else{
		reg_loca="未知";}
        });
		
$("#verifyCanvas").click(function(){
	verifyInput();//刷新图片验证码后事件
});

$("#binding").click(function(){//发送绑定信息
if($("#label_account").attr("class")=="label label-success"&&
$("#label_password").attr("class")=="label label-success"){//用户所填信息是否完整

if($("#label_verify").attr("class")!="label label-success"){
$("#label_verify").html("4位图片验证码有误");
$("#label_verify").attr("class","label label-danger");return;}

$('#code_input').val("");//刷新图片验证码
$("#label_verify").attr("class","label label-info");
$("#label_verify").html("请输入图片中的4位验证码");

loading("show");
var d_t= new Date(),dt=d_t.getTime(),countdown=15,gogo=setInterval(gogogo,1000);
function gogogo(){
	countdown--;
	if(countdown==0){clearInterval(gogo);
	pop("服务器无响应，请重试");
	loading();
	}//停止
}//倒数15秒后才可以重新绑定

		$.post("http://42.51.158.129/php/app_loading.php",{//发出绑定请求
			type:"binding",
			idortel:binding,
			id:account,
			tel:account,
			pw:pw,
			imei:imei,
			brand:brand,
			load_loca:load_loca
		},
		function(data){
			if(data["result"]=="ok"){//绑定成功顺便登陆
                window.open("file:///android_asset/main.html");
			}else{//绑定失败
	pop(data["result"]);
			}
	clearInterval(gogo);loading();
                      }
            );
		}
else{pop("请把填空题都填对了才能绑定");
}
});

//---------------------自定义函数----------------
function getloca(){//获取地理位置
		$.get("http://42.51.158.129/php/get_loca.php",function(data){
		if(data['result']=="0"){return data['loca'];}else{return "未知";}
        });
}

function pop(text){//模态框
$('.modal-body').html(text);$('#myModal').modal();$('.modal-content').css("top",$(window).height()/3+"px");
}

$('#myModal').on('hide.bs.modal', function () {//当调用 hide 实例方法时触发。
if($('#myModalLabel').text()=='非绑定设备登陆异常'){window.open("file:///android_asset/reg_lod/login.html");}
});

function loading(x){//加载动画
	if(x=="show"){
		$('.loading').css({"display":"flex","height":$(window).height()+"px"});
		$('.loading').show();
	}else{
		$('.loading').hide();
	}
}

})//$(document).ready() 方法允许我们在文档完全加载完后执行函数