
$(document).ready(function(){
/*-------------------------------注册登陆------------------------------------*/
$("#register").click(function(){
window.open("file:///android_asset/reg_lod/register.html");
});//注册
/*---------------------------------应用--------------------------------------*/
$("#chat").click(function(){
if(window.android.net()){//window.android.connect();
window.open("file:///android_asset/chat/chat.html");//聊天室
}else{window.android.tip("网络不可用!")}
});//聊天室
$("#sms").click(function(){
window.open("file:///android_asset/sms.html");
});//虚拟短信
$("#phone").click(function(){
window.android.StartWeiXin_Server();
});//虚拟通话
/*---------------------------------插件--------------------------------------*/
$("#vpn").click(function(){
window.open("file:///android_asset/vpn/vpn.html");
//window.android.SendMobSms("15013763711");
});//vpn
/*---------------------------------游戏--------------------------------------*/
$("#dafenji").click(function(){
window.open("file:///android_asset/dafenji/dafeiji.html");
});//打飞鸡

})//$(document).ready() 方法允许我们在文档完全加载完后执行函数
