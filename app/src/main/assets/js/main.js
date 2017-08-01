
function search(x){
window.open("file:///android_asset/search/"+x+".html");
}
$(document).ready(function(){
/*-------------------------------登陆注册------------------------------------*/
$("#login").click(function(){
window.open("file:///android_asset/reg_lod/login.html");
});//登陆
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
/*-------------------------------背景动画------------------------------------*/
//Initializing the canvas
var canvas01 = document.getElementById("canvas01");

var ctx = canvas01.getContext("2d");

//Canvas dimensions
var W = $(window).width(); var H = 48;
$("#canvas01").attr({"width":W+"px","height":H+"px"});

//Lets create an array of particles
var particles = [];
for(var i = 0; i <50; i++)
{
	//This will add 50 particles to the array with random positions
	particles.push(new create_particle());
}

//Lets create a function which will help us to create multiple particles
function create_particle()
{
	//Random position on the canvas
	this.x = Math.random()*W;
	this.y = Math.random()*H;
	
	//Lets add random velocity to each particle
	this.vx = Math.random()*20-10;
	this.vy = Math.random()*20-10;
	
	//Random colors
	var r = Math.random()*255>>0;
	var g = Math.random()*255>>0;
	var b = Math.random()*255>>0;
	this.color = "rgba("+r+", "+g+", "+b+", 0.5)";
	
	//Random size
	this.radius = Math.random()*20+20;
}

var x = 100; var y = 100;

//Lets animate the particle
function draw()
{
	//Moving this BG paint code insde draw() will help remove the trail
	//of the particle
	//Lets paint the canvas black
	//But the BG paint shouldn't blend with the previous frame
	ctx.globalCompositeOperation = "source-over";
	//Lets reduce the opacity of the BG paint to give the final touch
	ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
	ctx.fillRect(0, 0, W, H);
	
	//Lets blend the particle with the BG
	ctx.globalCompositeOperation = "lighter";
	
	//Lets draw particles from the array now
	for(var t = 0; t < particles.length; t++)
	{
		var p = particles[t];
		
		ctx.beginPath();
		
		//Time for some colors
		var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
		gradient.addColorStop(0.05, "white");
		gradient.addColorStop(0.05, "white");
		gradient.addColorStop(0.05, p.color);
		gradient.addColorStop(0.2, "black");
		
		ctx.fillStyle = gradient;
		ctx.arc(p.x, p.y, p.radius, Math.PI*2, false);
		ctx.fill();
		
		//Lets use the velocity now
		p.x += p.vx;
		p.y += p.vy;
		
		//To prevent the balls from moving out of the canvas
		if(p.x < -50) p.x = W+50;
		if(p.y < -50) p.y = H+50;
		if(p.x > W+50) p.x = -50;
		if(p.y > H+50) p.y = -50;
	}
	//标题背景色变换
	     var i="rgba("+i1+","+i2+","+i3+",0.5)";$(".title").css("background-color",i);
         if(i1==255){i1=Math.floor(Math.random()*256);}if(i2==255){i2=Math.floor(Math.random()*256);}if(i3==255){i3=Math.floor(Math.random()*256);}
         i1++;i2++;i3++;
}
var i1=Math.floor(Math.random()*256),i2=Math.floor(Math.random()*256),i3=Math.floor(Math.random()*256);
setInterval(draw, 100);
//I hope that you enjoyed the tutorial :)
})//$(document).ready() 方法允许我们在文档完全加载完后执行函数
