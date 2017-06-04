window.onload=function(){
var NewCss = document.getElementById("NewCss");
NewCss.innerHTML+="";
document.getElementById("input").innerHTML="";//初始化编辑框
timedcount();
window.scrollTo(0,document.body.scrollHeight);//竖向滚动条置底
//document.getElementById("contentdiv").style.height=h+"px";document.getElementById("startdiv").style.height=h+"px";
//document.getElementById("maindiv").style.height=h+"px";
}//窗口加载完成
//window.onresize=*;//浏览器的窗口改变事件
var w=window.innerWidth;//窗口宽度
var h=window.innerHeight;//窗口高度
//---------------------自定义方法start-------------------------//
function timedcount(){
var b=document.getElementById("bottom"),bh=b.offsetHeight,m=document.getElementById("main");
m.style.margin="0px 0px "+bh+"px";
setTimeout("timedcount()",100)
}//编辑器大小改变事件"
function del(){document.execCommand('Delete');}//编辑器删除内容
function send(html){
if(html.length>0){
var myDate = new Date(),now = "",weekday=new Array(7);weekday[0]="星期日";weekday[1]="星期一";weekday[2]="星期二";weekday[3]="星期三";weekday[4]="星期四";weekday[5]="星期五";weekday[6]="星期六";
now = myDate.getFullYear()+"/";
now = now + (myDate.getMonth()+1)+"/";
now = now + myDate.getDate()+" ";
now = now + myDate.getHours()+":";
now = now + myDate.getMinutes()+":";
now = now + myDate.getSeconds()+"";
now=now+" "+weekday[myDate.getDay()];
document.getElementById("main").innerHTML+='<div class="my"><p class="date">'+now+'</p><fieldset><legend><strong>卢其洪</strong><img src="../image/32x32.png"></legend><div>'+html+'</div></fieldset></div>';
}else{window.android.tip("发送内容不能为空!");}

}//发送信息
function insertimg(imgpath){document.execCommand('InsertImage', false, imgpath);}//插入图片
function playPause(obj)
{var obj1=obj.previousSibling;
if (obj.innerHTML=="▶"){
	obj.innerHTML="■"
	//obj.paused
	  obj1.play();
	}else{obj.innerHTML="▶";
	  obj1.pause();
	  }
}//视频控件
function LoadData(obj){if(obj.duration==0){return;}
var obj0=obj.parentNode,other = obj.duration % 3600,second=(other % 60).toFixed (),Minute=Math.floor (other / 60);
if(second<10) {second = '0' + second;}if(Minute<10) {Minute = '0' + Minute;}
obj0.getElementsByTagName("span")[1].innerHTML=Minute+":"+second;

}//视频基本数据获取完成
function TimeUpDate(obj){
var obj0=obj.parentNode;val=obj.currentTime/obj.duration*100,obj1=obj0.getElementsByTagName("input")[0],other = obj.currentTime % 3600,second=(other % 60).toFixed (),Minute=Math.floor (other / 60);
if(second<10) {second = '0' + second;}if(Minute<10) {Minute = '0' + Minute;}
obj0.getElementsByTagName("span")[0].innerHTML=Minute+":"+second;
obj1.value=val;
}//视频播放进度监听
function RangeChange(obj){
var ObjVideo=obj.parentNode.getElementsByTagName("video")[0];
ObjVideo.currentTime =obj.value/100*ObjVideo.duration;
//obj.style.background="-webkit-linear-gradient(#059CFA, #059CFA) no-repeat "+(obj.value-100)+"px";
}//拖动播放进度条
function DownLoad(obj){
var ranges = [],ctx=obj.parentNode.getElementsByTagName("canvas")[0].getContext("2d");
ctx.strokeStyle="#0000CD";ctx.lineWidth=3;ctx.shadowBlur=2;ctx.shadowColor="#00BFFF";ctx.lineCap = "round";
  for(var i = 0; i < obj.buffered.length; i ++)
  {
    ranges.push([obj.buffered.start(i),obj.buffered.end(i)]);
ctx.beginPath();
ctx.moveTo(Math.round((100 / obj.duration)*ranges[i][0]),2.5);
ctx.lineTo(Math.round((100 / obj.duration)*ranges[i][1]),2.5);
ctx.stroke();
  }
LoadData(obj);
}//获取正在下载进度
function PlayVideo(obj){
window.android.PlayVideo(obj.getAttribute("src"));
}//调用系统播放器播放视频
function VideoEnd(obj){
obj.currentTime=0;obj.nextSibling.innerHTML="▶";
}//视频播放完毕事件
//---------------------自定义方法end-------------------------//
$(document).ready(function(){
	/*$(window).scroll(function(){
		    if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
		    if($(".bottom").attr("class")=="bottom bottom01"){$(".bottom").removeClass("bottom01");}
		}else{if($(".bottom").attr("class")=="bottom"){$(".bottom").addClass("bottom01");}
		}
	});//滚动条滚动事件*/
  /*$("#input").focus(function(){
    $(this).css("height",h/3+"px");
  });//编辑框获得焦点
  $("#input").blur(function(){
    $(this).css("height","36px");
  });//编辑框失去焦点*/
    $("#flex").click(function(){
     $("#skill").fadeToggle();
    });//显示隐藏更多功能
    $("#delall").click(function(){
     $("#input").html("");
    });//清空编辑框内容
  $("#send").click(function(){
  send($("#input").html());
  });//发送信息
    $("#getimg").click(function(){
window.android.getimg();
    });//调用系统相册
    $("#PhotoGraph").click(function(){
window.android.PhotoGraph();
    });//拍照
    $("#VideoTape").click(function(){
window.android.VideoTape();
    });//录像

});