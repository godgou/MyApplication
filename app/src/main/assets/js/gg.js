
var load_loca="";//网络地理位置

$(document).ready(function(){
$("body").append(gg_PopAndLoading);//添加对话框与加载动画html代码


    var gg_swiper = new Swiper('.swiper-container', {
    });/*---------------------滑动插件swiper.js----------------------*/

		$.get("http://42.51.158.129/php/get_loca.php",function(data){
		if(data['result']=="0"){load_loca=data['loca'];}
		else{
		load_loca="未知";}
        });//获取网络地理位置

/*-----------------所有单击事件-----------------------*/
$('#my').click(function(){
gg_swiper.slideTo(2, 1000, false);
/*切换到指定slide。
index:必选，num，指定将要切换到的slide的索引。
speed:可选，num(单位ms)，切换速度
runCallbacks:可选，boolean，设置为false时不会触发onSlideChange回调函数。*/
//onclick="window.open('file:///android_asset/reg_lod/my.html')"
});

});//$(document).ready() 方法允许我们在文档完全加载完后执行函数

//---------------------自定义函数----------------
function gg_B64toBlob(b64) {//base64转换为Blob对象
    var arr = b64.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}


function gg_Random_number(Min,Max){//取min到max范围整数(包括min and max)
var Range = Max - Min;
var Rand = Math.random();
var num = Min + Math.round(Rand * Range);
return num;
}
function gg_getloca(){//获取地理位置
		$.get("http://42.51.158.129/php/get_loca.php",function(data){
		if(data['result']=="0"){return data['loca'];}else{return "未知";}
        });
}

var gg_pop_animate=["zoomInDown","lightSpeedIn","slideInUp","rubberBand","flipInX","bounceInDown","jello","shake","flash"];
function gg_pop(text){//模态框
$('.modal-body').html(text);$('#myModal').modal();$('.modal-content').css("top",$(window).height()/3+"px");
var x=gg_pop_animate[gg_Random_number(0,8)];
    $('.modal-content').addClass(x);
        setTimeout(function(){
             $('.modal-content').removeClass(x);
          }, 1000);
}

$('#myModal').on('hide.bs.modal', function () {//当模态框调用 hide 实例方法时触发。
if($('#myModalLabel').text()=='非绑定设备登陆异常'){window.open("file:///android_asset/reg_lod/binding.html");}
});

function gg_loading(x){//加载动画
	if(x=="show"){
		$('.loading').css({"display":"flex","height":$(window).height()+"px"});
	}else{
		$('.loading').hide();
	}
}
/*---------html转js字符串------------*/
var gg_PopAndLoading='	<!--模态框-->'+
                  '	<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
                  '	<div class="modal-dialog" id="modal-dialog">'+
                  '		<div class="modal-content animated ">'+
                  '		<div class="modal-header" style="padding:3px;">'+
                  '				<button type="button" class="close" data-dismiss="modal" aria-hidden="true" style="color:red;">&times;</button>'+
                  '				<h4 class="modal-title" id="myModalLabel">神狗GG(godgou.com)</h4>'+
                  '			</div>'+
                  '			<div class="modal-body">'+
                  '			</div>'+
                  '			<div class="modal-footer" style="text-align:center;padding:3px;">'+
                  '				<button type="button" class="btn btn-default" data-dismiss="modal">I See'+
                  '				</button>'+
                  '			</div>'+
                  '		</div><!-- modal-content -->'+
                  '	</div><!-- modal -->'+
                  '</div>'+
                  '<!--加载动画-->'+
                  '<div class="loading">'+
                  '    <div class="loading_wrapp">'+
                  '<p><strong>Please Wait</strong></p>'+
                  '<i class="fa fa-spinner fa-pulse margin-bottom  fa-3x fa-fw "></i>'+
                  '</div>'+
                  '</div>';
