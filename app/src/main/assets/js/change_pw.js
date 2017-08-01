
var tel="",//手机号
truetel="",//接收验证码的真实手机号
pw="",//密码
reg_loca="",//网络地理位置
imei="",//手机唯一imei号
brand="",//手机型号
code="";//验证码

function GgCodeInput(){//验证码输入框内容改变事件
ggcode= document.getElementById("GgCode").value;
var label_gcb=document.getElementById("label_gcb");
if(ggcode==code&&ggcode.length==6){//6位手机短信验证码
label_gcb.setAttribute("class","label label-success");label_gcb.innerHTML="验证码正确";
}else{label_gcb.setAttribute("class","label label-danger");label_gcb.innerHTML="验证码错误";}
}
function NameInput(){//昵称输入框内容改变事件
name= document.getElementById("name").value;
var label_name=document.getElementById("label_name");
if(name.length>=1 && /^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(name)){//中文，字母，数字组成的字符串，不要求三者同时出现
label_name.setAttribute("class","label label-success");label_name.innerHTML="此昵称可用";
}else{label_name.setAttribute("class","label label-danger");label_name.innerHTML="1-10个字符,中文,字母,数字";}
}
function PhoneInput(){//手机号码输入框内容改变事件
tel= document.getElementById("phone").value;
var label_phone=document.getElementById("label_phone");
if(tel.length==11 && /^1[3|4|5|7|8][0-9]{9}$/.test(tel)){
label_phone.setAttribute("class","label label-success");label_phone.innerHTML="手机号码格式正确!";
}else{label_phone.setAttribute("class","label label-danger");label_phone.innerHTML="请输入正确的11位手机号码!";}
}
function PasswordInput(){//密码输入框内容改变事件
            pw= document.getElementById("password").value;
			var label_password=document.getElementById("label_password");
            if(pw.length>=8&&pw.length<=16){
			if(/^[a-zA-Z0-9]*([a-zA-Z][0-9]|[0-9][a-zA-Z])[a-zA-Z0-9]*$/.test(pw)){//不允许纯字母或纯数字或特殊字符
            label_password.setAttribute("class","label label-success");label_password.innerHTML="此密码可用";
			}else{label_password.setAttribute("class","label label-danger");label_password.innerHTML="不允许纯字母或纯数字或特殊字符!";}
			}else{label_password.setAttribute("class","label label-danger");label_password.innerHTML="密码长度应为8~16个字符";}
}


function SetMobileID(i,b){imei=i;brand=b;document.getElementById("label_phone").innerHTML="您的账号将绑定此手机设备:"+b;}//设置手机imei和型号
$(document).ready(function(){
		$.get("http://42.51.158.129/php/get_loca.php",function(data){//获取网络地理位置
		if(data['result']=="0"){reg_loca=data['loca'];}
		else{
		reg_loca="未知";}
        });
		
$("#verifyCanvas").click(function(){
	verifyInput();//刷新图片验证码后事件
});

$("#to_agreement").click(function(){$('#myModal02').modal();});//显示用户服务协议

$("#yesagreement,#noagreement").click(function(){//是否同意用户协议
	if($(this).text()=="同意"){
$('#checkbox').text("[✔]");$('#checkbox').css("color","#5cb85c");//同意
$("#label_agreement").attr("class","label label-success");
$("#label_agreement").html("您已同意用户服务协议");
}else{
$('#checkbox').text("[✘]");$('#checkbox').css("color","#d9534f");//不同意
$("#label_agreement").attr("class","label label-danger");
$("#label_agreement").html("您必须同意用户服务协议,否则您无权注册");
	}
});

		
$("#gcb").click(function(){//获取手机验证码
if($("#label_phone").attr("class")!="label label-success"){
$("#label_phone").html("手机号码有误无法获取手机验证码");
$("#label_phone").attr("class","label label-danger");return;}

if($("#label_verify").attr("class")!="label label-success"){
$("#label_verify").html("4位图片验证码有误不允许获取手机验证码");
$("#label_verify").attr("class","label label-danger");return;}

$('#code_input').val("");//刷新图片验证码
$("#label_verify").attr("class","label label-info");
$("#label_verify").html("请输入图片中的4位验证码");

$("#gcb").css("background-color","rgba(0,0,0,0.3)");
$("#gcb").attr('disabled',"true");//添加disabled属性
var countdown01=60,GoCode=setInterval(GoToCode,1000);
function GoToCode(){
$("#gcb").val("获取验证码("+countdown01+")");countdown01--;
if(countdown01==0){
$("#gcb").val("获取验证码");clearInterval(GoCode);
$("#gcb").css("background-color","rgba(255,255,255,0.5)");
$("#gcb").removeAttr("disabled"); //移除disabled属性
}//停止
}//倒计时
$.post("http://42.51.158.129/php/app_loading.php",//检查手机号码是否已注册
    {
        type:"querytel",
		tel:tel
    },
        function(data){
        if(data['result']=="ok"){//已注册
		truetel=data['tel'];//确定注册的手机号码
		var nd= new Date(),nd=nd.getTime()+""+nd.getFullYear();
		for(var i = 0; i < 6; i += 1){//生成随机6位验证码
        code += Math.floor(Math.random() * 10);
        }
		$.post("http://42.51.158.129/php/alidayu/sendsms.php",//请求发送验证码
    {
        confirm:nd,
        ggtel:truetel,
		ggcode:code
    },
        function(data){
        if(data==truetel){//请求发送验证码成功
			$("#label_gcb").attr("class","label label-info");$("#label_gcb").html("验证码已发送,请查看手机短信");
		}else{
		$("#label_gcb").attr("class","label label-danger");$("#label_gcb").html("下发验证码失败,请稍后重试");	
		}
    });
			
		}else{
		$("#label_phone").attr("class","label label-danger");$("#label_phone").html("此手机号码已注册");
		}
    });

});
$("#change_pw").click(function(){//发送更改密码信息
if($("#label_phone").attr("class")=="label label-success"&&
$("#label_gcb").attr("class")=="label label-success"&&
$("#label_password").attr("class")=="label label-success"){
loading("show");
var d_t= new Date(),dt=d_t.getTime(),countdown02=15,gogo=setInterval(gogogo,1000);
function gogogo(){
	countdown02--;
	if(countdown02==0){clearInterval(gogo);
	pop("服务器无响应，请重试");
	loading();
	}//停止
}//倒数15秒后才可以重新更改密码

		$.post("http://42.51.158.129/php/app_loading.php",{//发出更改密码请求
			type:"change_pw",
			tel:truetel,
			pw:pw
		},
		function(data){
			if(data["result"]=="ok"){//更改密码成功
			$('#myModalLabel').text('更改密码成功');
				pop("更改密码成功,您的新密码为:"+data['pw']);
				window.android.sendMsg(//虚拟一条信息
"godgou.com"/*String 对方手机号码*/,
"[神狗]更改密码成功,您的新密码为:"+data['pw']+",可用您的uid或手机号码作为账号登陆--来自GG官网(godgou.com)"/*String 短信内容*/,
1/*int 1:接收;2:发送*/,
false/*boolean 是否真实短信true和false*/,
dt/*毫秒*/,
"content://sms/inbox"/*收件箱*/);
				
			}else{//更改密码失败
				pop(data["result"]);
				}
				clearInterval(gogo);loading();
		});
		
		
}//用户所填信息是否完整
else{pop("必须所有选项及表单填写符合要求才能更改密码");
}
});

//---------------------自定义函数----------------
function getloca(){//获取地理位置
		$.get("http://42.51.158.129/php/get_loca.php",function(data){
		if(data['result']=="0"){return data['loca'];}else{return "未知";}
        });
}

function pop(text){//模态框
$('#modal-body').html(text);$('#myModal').modal();$('#modal_content').css("top",$(window).height()/3+"px");
}

$('#myModal').on('hide.bs.modal', function () {//当调用 hide 实例方法时触发。
if($('#myModalLabel').text()=='更改密码成功'){window.open("file:///android_asset/reg_lod/login.html");}
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

