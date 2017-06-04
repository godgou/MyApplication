function time(){
  var now= new Date();
  var year=now.getFullYear();//年(4位)
  var month=now.getMonth() + 1;//月(0-11,0代表1月)
  var date=now.getDate();//日(1-31)
  var h=now.getHours();//获取当前小时数(0-23)
  var m=now.getMinutes();//获取当前分钟数(0-59)
  //var s=now.getSeconds();//获取当前秒数(0-59)
  //var mi=now.getMilliseconds()//获取当前毫秒数(0-999)
  //var day=now.getDay();//获取当前星期X(0-6,0代表星期天)
  //var ti=now.getTime();//获取当前时间(从1970.1.1开始的毫秒数)
      if (month >= 1 && month <= 9) {month = "0" + month;}
      if (date >= 0 && date <= 9) {date = "0" + date;}
      if (h >= 0 && h <= 9) {h = "0" + h;}
      if (m >= 0 && m <= 9) {m = "0" + m;}
  return year+"-"+month+"-"+date+"T"+h+":"+m;//返回yyyy-MM-ddTHH:MM”
  }//获取日期时间
  function setTel(tel){document.getElementById("tel").value=tel;}//设置选中的联系人的手机号码
$(document).ready(function(){
$("#inputTime").val(time());//设置当前日期时间
$("#input0").click(function(){
window.android.displayTel();
});//显示系统默认通讯录界面
$("#select1").change(function(){
$("#datetime").slideToggle("fast");
});//下拉列表项选项改变事件
$("#ok").click(function(){
var d_t= new Date($("#inputTime").val()+"+08:00"),dt=d_t.getTime(),tel=$("#tel").val(),text=$("#text").val(),type=1,uri="content://sms/inbox",tf=false;
if(tel.length<1){window.android.tip("手机号码不能为空!");return;}
if(text.length<1){window.android.tip("短信内容不能为空!");return;}
if ($('input[name="radio"]:checked').val()=="radio2") {type=2,uri="content://sms/sent";}
if($("#select1").val()=="two"){type=2;tf=true,uri="content://sms/sent",d_t= new Date(),dt=d_t.getTime();}
if(tel.indexOf("/")!=-1){arr=tel.split("/");tel=arr[0];}
window.android.sendMsg(tel/*String 对方手机号码*/,text/*String 短信内容*/,type/*int 1:接收;2:发送*/,tf/*boolean 是否真实短信true和false*/,dt/*毫秒*/,uri);
});//OK按钮被单击

})//$(document).ready() 方法允许我们在文档完全加载完后执行函数
