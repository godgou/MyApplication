var reg = /^1[3|4|5|7|8][0-9]{9}$/; //手机号码验证规则
function IsPhone(tel){
if(tel.length==11 && reg.test(tel)){return true;}
window.android.tip("手机号码有误!");
return false;
}//验证是否为手机号码

var json="",//向手机发送的注册信息
tel="",//手机号
email="",//邮箱
pw="",//密码
reg_loca="",//网络地理位置
imei="",//手机唯一imei号
model="",//手机型号
password = document.getElementById("password");//密码框
function PasswordInput(){
            pw= password.value;
			var label-danger=document.getElementById("label-danger"),
			label-warning=document.getElementById("label-warning"),
			label-success=document.getElementById("label-success"),
			alert-password=document.getElementById("alert-password");
            //密码强度为弱正则表达式
            var low = /(^\d{6,16}$)|(^[a-z]{6,16}$)|(^[A-Z]{6,16}$)|(^_{6,16}$)/g;
               //密码强度为中等正则表达式
            var middle = /(^[a-zA-Z]{6,16}$)|(^[a-z\d]{6,16}$)|(^[A-Z\d]{6,16}$)|(^[A-Z_]{6,16}$)|(^[_\d]{6,16}$)|(^[a-z_]{6,16}$)|(^[A-Z\d]{6,16}$)/g;
               //密码强度为强正则表达式
            var high = /(^[a-zA-Z\d]{6,16}$)|(^[a-zA-Z_]{6,16}$)|(^[a-z\d_]{6,16}$)(^[A-Z\d_]{6,16}$)|(^[a-zA-Z\d_]{6,16}$)/g;
            if (low.test(pw)) {  //low.test(passcord) 如果满足low正则表达式，则返回true
			label-dangerstyle.style.display = "block";
			label-warning.style.display = "none";
			label-success.style.display = "none";
            } else if (middle.test(pw)) {     //如果满足middle正则表达式，则返回true
			label-dangerstyle.style.display = "none";
			label-warning.style.display = "block";
			label-success.style.display = "none";

            } else if(high.test(pw)){    //如果满足high正则表达式，则返回true
			label-danger.style.display = "none";
			label-warning.style.display = "none";
			label-success.style.display = "block";

            } else { //如果不满足正则方程则不会显示密码强度
			label-danger.style.display = "none";
			label-warning.style.display = "none";
			label-success.style.display = "none";
            }
　　　　//假如输入密码位数超过16位，则会显示密码长度应为6~16个字符
            if (pw.length >= 16) {
            alert-password.innerHTML="密码长度应为6~16个字符";
            } else {
　　　　//假如输入密码位数没超过16位，则会显示：6~16个字符，区分大小写
            alert-password.innerHTML="6~16个字符,区分大小写";
            }
			if(!/^[A-Za-z0-9]+$/.test(passcword)){
				alert-password.innerHTML="只能含有数字和字母";//只能含有数字和字母
			}
}


function SetMobileID(i,m){imei=i;model=m;document.getElementById("imei").innerHTML="您的账号将绑定此手机设备:"+m;}//设置手机imei和型号
$(document).ready(function(){
password.addEventListener('input',PasswordInput,false);//密码框输入事件
function getloca(){//获取地理位置
		$.get("http://42.51.158.129/php/get_loca.php",function(data,status){
		data=eval("("+data+")");
		if(data['result']==0){return data['loca'];}
        });
		return "未知";
}
$("#register").click(function(){//发送注册信息
if(IsPhone(tel)){
tel=$("#tel").val(),//手机号
email=$("#email").val(),//邮箱
reg_loca=getloca(),//网络地理位置
json='{type:"register",tel:'+tel+',email:"'+email+'",name:"'+name+'",pw:"'+pw+'",reg_loca:"'+reg_loca+'"}';
}//是否为手机号码
});



})//$(document).ready() 方法允许我们在文档完全加载完后执行函数

