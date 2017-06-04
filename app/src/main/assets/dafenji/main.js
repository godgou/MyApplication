window.onload=function(){
document.getElementById("contentdiv").style.height=h+"px";document.getElementById("startdiv").style.height=h+"px";
document.getElementById("maindiv").style.height=h+"px";
window.android.playaudio("music/dafenji.mp3",true);//android方法最后执行
}//窗口加载完成
window.onresize=jixu;//浏览器的窗口改变事件/重新加载游戏
var w=window.innerWidth;//窗口宽度
var h=window.innerHeight;//窗口高度
    //获得主界面
var mainDiv=document.getElementById("maindiv");
    //获得开始界面
var startdiv=document.getElementById("startdiv");
    //获得游戏中分数显示界面
var scorediv=document.getElementById("scorediv");
    //获得分数界面
var scorelabel=document.getElementById("label");
    //获得暂停界面
var suspenddiv=document.getElementById("suspenddiv");
    //获得游戏结束界面
var enddiv=document.getElementById("enddiv");
    //获得游戏结束后分数统计界面
var planscore=document.getElementById("planscore");
    //初始化分数
var scores=0;
/*
 创建飞机类
 */
function plan(hp,X,Y,sizeX,sizeY,score,dietime,sudu,boomimage,imagesrc){
    this.planX=X;
    this.planY=Y;
    this.imagenode=null;
    this.planhp=hp;
    this.planscore=score;
    this.plansizeX=sizeX;
    this.plansizeY=sizeY;
    this.planboomimage=boomimage;
    this.planisdie=false;
    this.plandietimes=0;
    this.plandietime=dietime;
    this.plansudu=sudu;
//行为
/*
移动行为
     */
    this.planmove=function(){
        if(scores<=50000){
            this.imagenode.style.top=this.imagenode.offsetTop+this.plansudu+"px";
        }
        else if(scores>50000&&scores<=100000){
            this.imagenode.style.top=this.imagenode.offsetTop+this.plansudu+1+"px";
        }
        else if(scores>100000&&scores<=150000){
            this.imagenode.style.top=this.imagenode.offsetTop+this.plansudu+2+"px";
        }
        else if(scores>150000&&scores<=200000){
            this.imagenode.style.top=this.imagenode.offsetTop+this.plansudu+3+"px";
        }
        else if(scores>200000&&scores<=300000){
            this.imagenode.style.top=this.imagenode.offsetTop+this.plansudu+4+"px";
        }
        else{
            this.imagenode.style.top=this.imagenode.offsetTop+this.plansudu+5+"px";
        }
    }
    this.init=function(){
        this.imagenode=document.createElement("img");
        this.imagenode.style.left=this.planX+"px";
        this.imagenode.style.top=this.planY+"px";
        this.imagenode.src=imagesrc;
        mainDiv.appendChild(this.imagenode);
    }
    this.init();
}

/*
创建子弹类
 */
function bullet(X,Y,sizeX,sizeY,imagesrc){
    this.bulletX=X;
    this.bulletY=Y;
    this.bulletimage=null;
    this.bulletattach=1;
    this.bulletsizeX=sizeX;
    this.bulletsizeY=sizeY;
//行为
/*
 移动行为
 */
    this.bulletmove=function(){
        this.bulletimage.style.top=this.bulletimage.offsetTop-20+"px";
    }
    this.init=function(){
        this.bulletimage=document.createElement("img");
        this.bulletimage.style.left= this.bulletX+"px";
        this.bulletimage.style.top= this.bulletY+"px";
        this.bulletimage.src=imagesrc;
        mainDiv.appendChild(this.bulletimage);
    }
    this.init();
}

/*
 创建单行子弹类
 */
function oddbullet(X,Y){
    bullet.call(this,X,Y,12,15,"bullet1.png");
}

/*
创建敌机类
 */
function enemy(hp,a,b,sizeX,sizeY,score,dietime,sudu,boomimage,imagesrc){
    plan.call(this,hp,random(a,b),-100,sizeX,sizeY,score,dietime,sudu,boomimage,imagesrc);
}
//产生min到max之间的随机数
function random(min,max){
    return Math.floor(min+Math.random()*(max-min));
}

/*
创建本方飞机类
 */
function ourplan(X,Y){
    var imagesrc="me.png";
    plan.call(this,1,X,Y,66,80,0,660,0,"iover.gif",imagesrc);
    this.imagenode.setAttribute('id','ourplan');
}

/*
 创建本方飞机
 */
var selfplan=new ourplan(w/2-33,h-80);
//移动事件
var ourPlan=document.getElementById('ourplan');
var yidong=function(){
    var oevent=window.event||arguments[0];
         // 如果这个元素的位置内只有一个手指的话
        if (oevent.targetTouches.length == 1) {
    　　　　 oevent.preventDefault();// 阻止浏览器默认事件，重要
            var touch = oevent.targetTouches[0];
    // 把元素放在手指所在的位置
    ourPlan.style.left=touch.pageX-selfplan.plansizeX/2+"px";
    ourPlan.style.top=touch.pageY-selfplan.plansizeY/2+"px";
            }
}
/*
暂停事件
 */
var number=0;
var zanting=function(){
                if(number==0){
                    suspenddiv.style.display="block";
                        mainDiv.removeEventListener("touchmove",yidong,true);
                    clearInterval(set);
                    number=1;
                }
                else{
                    suspenddiv.style.display="none";
                        mainDiv.addEventListener("touchmove",yidong,true);
                    set=setInterval(start,20);
                    number=0;
                }
}
var bodyobj=document.getElementsByTagName("body")[0];
    //为本方飞机添加移动和
    mainDiv.addEventListener("touchmove",yidong,true);
    //为本方飞机添加暂停事件
    selfplan.imagenode.addEventListener("click",zanting,true);
    //为暂停界面的继续按钮添加暂停事件
    suspenddiv.getElementsByTagName("button")[0].addEventListener("click",zanting,true);
    //为暂停界面的返回主页按钮添加事件
    suspenddiv.getElementsByTagName("button")[1].addEventListener("click",jixu,true);
//初始化隐藏本方飞机
selfplan.imagenode.style.display="none";

/*
敌机对象数组
 */
var enemys=[];

/*
子弹对象数组
 */
var bullets=[];
var mark=0;
var mark1=0;
var backgroundPositionY=0;
/*
开始函数
 */
function start(){
    mainDiv.style.backgroundPositionY=backgroundPositionY+"px";
    backgroundPositionY+=0.5;
    if(backgroundPositionY==h){
        backgroundPositionY=0;
    }
    mark++;
    /*
    创建敌方飞机
     */

    if(mark==20){
        mark1++;
        //中飞机
        if(mark1%5==0){
            enemys.push(new enemy(6,25,w-46,46,60,5000,360,random(1,3),"midover.gif","enemy3_fly_1.png"));
        }
        //大飞机
        if(mark1==20){
            enemys.push(new enemy(12,57,w-110,110,164,30000,540,1,"maxover.gif","enemy2_fly_1.png"));
            mark1=0;
        }
        //小飞机
        else{
            enemys.push(new enemy(1,19,w-34,34,24,1000,360,random(1,4),"minover.gif","enemy1_fly_1.png"));
        }
        mark=0;
    }

/*
移动敌方飞机
 */
    var enemyslen=enemys.length;
    for(var i=0;i<enemyslen;i++){
        if(enemys[i].planisdie!=true){
            enemys[i].planmove();
        }
/*
 如果敌机超出边界,删除敌机
 */
        if(enemys[i].imagenode.offsetTop>h){
            mainDiv.removeChild(enemys[i].imagenode);
            enemys.splice(i,1);
            enemyslen--;
        }
        //当敌机死亡标记为true时，经过一段时间后清除敌机
        if(enemys[i].planisdie==true){
            enemys[i].plandietimes+=20;
            if(enemys[i].plandietimes==enemys[i].plandietime){
                mainDiv.removeChild(enemys[i].imagenode);
                enemys.splice(i,1);
                enemyslen--;
            }
        }
    }

/*
创建子弹
*/
    if(mark%5==0){
            bullets.push(new oddbullet(parseInt(selfplan.imagenode.style.left)+27,parseInt(selfplan.imagenode.style.top)-10));
    }

/*
移动子弹
*/
    var bulletslen=bullets.length;
    for(var i=0;i<bulletslen;i++){
        bullets[i].bulletmove();
/*
如果子弹超出边界,删除子弹
*/
        if(bullets[i].bulletimage.offsetTop<0){
            mainDiv.removeChild(bullets[i].bulletimage);
            bullets.splice(i,1);
            bulletslen--;
        }
    }

/*
碰撞判断
*/
    for(var k=0;k<bulletslen;k++){
        for(var j=0;j<enemyslen;j++){
            //判断碰撞本方飞机
            if(enemys[j].planisdie==false){
                if(enemys[j].imagenode.offsetLeft+enemys[j].plansizeX>=selfplan.imagenode.offsetLeft&&enemys[j].imagenode.offsetLeft<=selfplan.imagenode.offsetLeft+selfplan.plansizeX){
                  if(enemys[j].imagenode.offsetTop+enemys[j].plansizeY>=selfplan.imagenode.offsetTop+40&&enemys[j].imagenode.offsetTop<=selfplan.imagenode.offsetTop-20+selfplan.plansizeY){
                      //碰撞本方飞机，游戏结束，统计分数
                      selfplan.imagenode.src="iover.gif";
                      enddiv.style.display="block";
                      planscore.innerHTML=scores;
                          mainDiv.removeEventListener("touchmove",yidong,true);
                      clearInterval(set);
                  }
                }
                //判断子弹与敌机碰撞
                if((bullets[k].bulletimage.offsetLeft+bullets[k].bulletsizeX>enemys[j].imagenode.offsetLeft)&&(bullets[k].bulletimage.offsetLeft<enemys[j].imagenode.offsetLeft+enemys[j].plansizeX)){
                    if(bullets[k].bulletimage.offsetTop<=enemys[j].imagenode.offsetTop+enemys[j].plansizeY&&bullets[k].bulletimage.offsetTop+bullets[k].bulletsizeY>=enemys[j].imagenode.offsetTop){
                        //敌机血量减子弹攻击力
                        enemys[j].planhp=enemys[j].planhp-bullets[k].bulletattach;
                        //敌机血量为0，敌机图片换为爆炸图片，死亡标记为true，计分
                        if(enemys[j].planhp==0){
                            scores=scores+enemys[j].planscore;
                            scorelabel.innerHTML=scores;
                            enemys[j].imagenode.src=enemys[j].planboomimage;
                            enemys[j].planisdie=true;
                        }
                        //删除子弹
                        mainDiv.removeChild(bullets[k].bulletimage);
                            bullets.splice(k,1);
                            bulletslen--;
                            break;
                    }
                }
            }
        }
    }
}
/*
开始游戏按钮点击事件
 */
var set;
function begin(){
    startdiv.style.display="none";
    mainDiv.style.display="block";
    selfplan.imagenode.style.display="block";
    scorediv.style.display="block";
    /*
     调用开始函数
     */
    set=setInterval(start,20);
}
//游戏结束后点击继续按钮事件
function jixu(){
    location.reload(true);
}