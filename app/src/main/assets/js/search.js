

function iframe(x){document.getElementById("iframe").src=x;}
 $(document).ready(function(){
        $('#iframe').height($(window).height()-110).width($(window).width());
        $('#tourl').click(function(){
        $('#iframe').attr('src',$('#url').val());
        });
});//$(document).ready() 方法允许我们在文档完全加载完后执行函数
