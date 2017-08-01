var Icon_Blob;
$(function () {
  //'use strict';
//TODO--------------------------------腾讯cos start, 裁剪图片end----------------------------------------------------
  var console = window.console || { log: function () {} };
  var URL = window.URL || window.webkitURL;
  var $image = $('#image');
  var $download = $('#download');
  var options = {
	    minContainerWidth :  $(window).width(), //容器的最小宽度 
        minContainerHeight : $(window).height()-70, //容器的最小高度
	    viewMode:0,//0图片可自由移动,1图片不能移出裁剪框
        aspectRatio: 1 / 1,//裁剪框比例
		dragMode: 'move', // 'crop', 'move' or 'none'
        preview: '.img-preview',//预览图的jq选择器
		cropBoxMovable: false,//是否允许拖动裁剪框
		cropBoxResizable :false,//是否允许改变裁剪框大小
        crop: function (e) {
        }
      };
  var originalImageURL = $image.attr('src');
  var uploadedImageType = 'image/png';
  var uploadedImageURL;

  // Tooltip
  $('[data-toggle="tooltip"]').tooltip();


  // Cropper
  $image.on({
    ready: function (e) {
      console.log(e.type);
    },
    cropstart: function (e) {
      console.log(e.type, e.action);
    },
    cropmove: function (e) {
      console.log(e.type, e.action);
    },
    cropend: function (e) {
      console.log(e.type, e.action);
    },
    crop: function (e) {
      console.log(e.type, e.x, e.y, e.width, e.height, e.rotate, e.scaleX, e.scaleY);
    },
    zoom: function (e) {
      console.log(e.type, e.ratio);
    }
  }).cropper(options);


  // Buttons
  if (!$.isFunction(document.createElement('canvas').getContext)) {
    $('button[data-method="getCroppedCanvas"]').prop('disabled', true);
  }

  if (typeof document.createElement('cropper').style.transition === 'undefined') {
    $('button[data-method="rotate"]').prop('disabled', true);
    $('button[data-method="scale"]').prop('disabled', true);
  }

  // Options
  $('.docs-toggles').on('change', 'input', function () {
    var $this = $(this);
    var name = $this.attr('name');
    var type = $this.prop('type');
    var cropBoxData;
    var canvasData;

    if (!$image.data('cropper')) {
      return;
    }

    if (type === 'checkbox') {
      options[name] = $this.prop('checked');
      cropBoxData = $image.cropper('getCropBoxData');
      canvasData = $image.cropper('getCanvasData');

      options.ready = function () {
        $image.cropper('setCropBoxData', cropBoxData);
        $image.cropper('setCanvasData', canvasData);
      };
    } else if (type === 'radio') {
      options[name] = $this.val();
    }

    $image.cropper('destroy').cropper(options);
  });


  // Methods
  $('.docs-buttons').on('click', '[data-method]', function () {

    var $this = $(this);
    var data = $this.data();
    var $target;
    var result;

    if ($this.prop('disabled') || $this.hasClass('disabled')) {
      return;
    }

    if ($image.data('cropper') && data.method) {
      data = $.extend({}, data); // Clone a new one

      if (typeof data.target !== 'undefined') {
        $target = $(data.target);

        if (typeof data.option === 'undefined') {
          try {
            data.option = JSON.parse($target.val());
          } catch (e) {
            console.log(e.message);
          }
        }
      }

      switch (data.method) {
        case 'rotate':
          $image.cropper('clear');
          break;

        case 'getCroppedCanvas':
          if (uploadedImageType === 'image/jpeg') {
            if (!data.option) {
              data.option = {};
            }

            data.option.fillColor = '#fff';
          }

          break;
      }

      result = $image.cropper(data.method, data.option, data.secondOption);

      switch (data.method) {
      case 'reset':
      $('#rotate_img01').val(180).css('background-size','50% 100%');//归位缩放滑块
      break;

        case 'rotate':
          $image.cropper('crop');
          break;

        case 'scaleX':
        case 'scaleY':
          $(this).data('option', -data.option);
          break;

        case 'getCroppedCanvas':
        gg_loading('show');
          if (result) {
            Icon_Blob = gg_B64toBlob(result.toDataURL(uploadedImageType));
             //上传文件,适合小于20M的文件上传
              //insertOnly==0 表示允许覆盖文件 1表示不允许
              cos.uploadFile(successCallBack, errorCallBack, progressCallBack, bucket, myFolder + "3.png", Icon_Blob, 0, taskReady);

          }

          break;

        case 'destroy':
          if (uploadedImageURL) {
            URL.revokeObjectURL(uploadedImageURL);
            uploadedImageURL = '';
            $image.attr('src', originalImageURL);
          }

          break;
      }

      if ($.isPlainObject(result) && $target) {
        try {
          $target.val(JSON.stringify(result));
        } catch (e) {
          console.log(e.message);
        }
      }

    }
  });

  // Import image
  var $inputImage = $('#inputImage');

  if (URL) {
    $inputImage.change(function () {
      var files = this.files;
      var file;

      if (!$image.data('cropper')) {
        return;
      }

      if (files && files.length) {
        file = files[0];
        if (/^image\/\w+$/.test(file.type)) {
         $('#rotate_img01').val(180).css('background-size','50% 100%');//归位缩放滑块
          uploadedImageType = 'image/png';

          if (uploadedImageURL) {
            URL.revokeObjectURL(uploadedImageURL);
          }

          uploadedImageURL = URL.createObjectURL(file);
          $image.cropper('destroy').attr('src', uploadedImageURL).cropper(options);
          $inputImage.val('');
        } else {
          gg_pop('Please choose an image file.');
        }
      }
    });
  } else {
    $inputImage.prop('disabled', true).parent().addClass('disabled');
  }
//TODO--------------------------------腾讯cos start, 裁剪图片end----------------------------------------------------
//TODO 以下几个值请确保填上再调用示例里的sdk方法
            //具体可以到https://console.qcloud.com/cos 进行查看
            var bucket = 'androidapp';
            var appid = '1251514212';
            var sid = 'AKID20InOAD6DBBbD7t3ZRTnPFY5y9vqncZO';
            var skey = '0y9gHTnGvirFYwQD6GYvDSscWi0Pi7xr';
            var region = 'gz';
            //TODO 以上几个值请确保填上再调用示例里的sdk方法

            var myFolder = '/3/icons/';//需要操作的目录

            //初始化逻辑
            //特别注意: JS-SDK使用之前请先到console.qcloud.com/cos 对相应的Bucket进行跨域设置
            var cos = new CosCloud({
                appid: appid,// APPID 必填参数
                bucket: bucket,//bucketName 必填参数
                region: region,//地域信息 必填参数 华南地区填gz 华东填sh 华北填tj
                getAppSign: function (callback) {//获取签名 必填参数


                    //下面简单讲一下获取签名的几种办法，签名请做一次 url encode
                    //1.搭建一个鉴权服务器，自己构造请求参数获取签名，推荐实际线上业务使用，优点是安全性好，不会暴露自己的私钥
                    /**
                     $.ajax('SIGN_URL').done(function (data) {
                        var sig = data.sign;
                        callback(sig);
                    });
                     **/


                    //2.直接在浏览器前端计算签名，需要获取自己的accessKey和secretKey, 一般在调试阶段使用
                    var self = this;
                    var random = parseInt(Math.random() * Math.pow(2, 32));
                    var now = parseInt(new Date().getTime() / 1000);
                    var e = now + 60; //签名过期时间为当前+60s
                    var path = '';//多次签名这里填空
                    var str = 'a=' + self.appid + '&k=' + sid + '&e=' + e + '&t=' + now + '&r=' + random +
                            '&f=' + path + '&b=' + self.bucket;

                    var sha1Res = CryptoJS.HmacSHA1(str, skey);//这里使用CryptoJS计算sha1值，你也可以用其他开源库或自己实现
                    var strWordArray = CryptoJS.enc.Utf8.parse(str);
                    var resWordArray = sha1Res.concat(strWordArray);
                    var res = resWordArray.toString(CryptoJS.enc.Base64);

                    setTimeout(function () {//setTimeout模拟一下网络延迟的情况
                        callback(res);
                    }, 1000);


                    //3.直接复用别人算好的签名字符串, 一般在调试阶段使用
                    //callback('YOUR_SIGN_STR')


                },
                getAppSignOnce: function (callback) {//单次签名，参考上面的注释即可
                    var self = this;
                    var random = parseInt(Math.random() * Math.pow(2, 32));
                    var now = parseInt(new Date().getTime() / 1000);
                    var e = 0; //单次签名 expire==0
                    var path = self.path;
                    var str = 'a=' + self.appid + '&k=' + sid + '&e=' + e + '&t=' + now + '&r=' + random +
                            '&f=' + path + '&b=' + self.bucket;

                    var sha1Res = CryptoJS.HmacSHA1(str, skey);//这里使用CryptoJS计算sha1值，你也可以用其他开源库或自己实现
                    var strWordArray = CryptoJS.enc.Utf8.parse(str);
                    var resWordArray = sha1Res.concat(strWordArray);
                    var res = resWordArray.toString(CryptoJS.enc.Base64);

                    setTimeout(function () {//setTimeout模拟一下网络延迟的情况
                        callback(res);
                    }, 1000);
                }
            });

            var successCallBack = function (result) {
                $("#result").val(JSON.stringify(result));
                if(result.code==0){
                gg_loading();//关闭加载动画
                var icon_url=result.data.source_url;//icon url
                //TODO:icon上传成功,please do something

                }
            };

            var errorCallBack = function (result) {
                result = result || {};
                console.log('request error:', result && result.message);
                $("#result").val(result.responseText || 'error');
            };

            var progressCallBack = function (curr, sha1) {
                var sha1CheckProgress = ((sha1 * 100).toFixed(2) || 100) + '%';
                var uploadProgress = ((curr || 0) * 100).toFixed(2) + '%';
                var msg = 'upload progress:' + uploadProgress + '; sha1 check:' + sha1CheckProgress + '.';
                console.log(msg);
                $("#result").val(msg);
            };

            var lastTaskId;
            var taskReady = function (taskId) {
                lastTaskId = taskId;
            };
$('#Show_CropWindow').off('change').on('change', function (e) {
                    var file = e.target.files[0];
                            if (/^image\/\w+$/.test(file.type)) {
                             $('#rotate_img01').val(180).css('background-size','50% 100%');//归位缩放滑块
                              uploadedImageType = 'image/png';
                              if (uploadedImageURL) {
                                URL.revokeObjectURL(uploadedImageURL);
                              }
                              uploadedImageURL = URL.createObjectURL(file);
                              $image.cropper('destroy').attr('src', uploadedImageURL).cropper(options);
                              $inputImage.val('');
                              $('.crop_window').show();
                            } else {
                              gg_pop('Please choose an image file.');
                            }
                    });
            //分片上传文件,当选择大于20M大小的文件的时候用分片上传
            var taskId = 0;
            $('#sliceUploadFile').on('click', function () {


                $('#js-file').off('change').on('change', function (e) {
                    var file = e.target.files[0];
                    // 分片上传直接调用uploadFile方法，内部会判断是否需要分片
                    // 分片上传过程可能会有 op=upload_slice_list 的 POST 请求返回 404，不会影响上传：https://github.com/tencentyun/cos-js-sdk-v4/issues/16
                    taskId = cos.uploadFile(successCallBack, errorCallBack, progressCallBack, bucket, myFolder + file.name, file, 0, taskReady);//insertOnly==0 表示允许覆盖文件 1表示不允许

                    //分片上传也可以直接调用sliceUploadFile方法，分片大小设置暂定不超过1M
                    //cos.sliceUploadFile(successCallBack, errorCallBack, progressCallBack, bucket, myFolder + file.name, file, 0, 1024*1024);

                    $('#form')[0].reset();
                    return false;
                });

                setTimeout(function () {
                    $('#js-file').click();
                }, 0);

                return false;
            });


            //创建文件夹
            $('#createFolder').on('click', function () {
                var newFolder = '/333/';//填你需要创建的文件夹，记得用斜杠包一下
                cos.createFolder(successCallBack, errorCallBack, bucket, newFolder);
            });

            //删除文件夹
            $('#deleteFolder').on('click', function () {
                var newFolder = '/333/';//填你需要删除的文件夹，记得用斜杠包一下
                cos.deleteFolder(successCallBack, errorCallBack, bucket, newFolder);
            });

            //获取指定文件夹内的列表,默认每次返回20条
            $('#getFolderList').on('click', function () {
                cos.getFolderList(successCallBack, errorCallBack, bucket, myFolder);
            });

            //获取文件夹属性
            $('#getFolderStat').on('click', function () {
                cos.getFolderStat(successCallBack, errorCallBack, bucket, '/333/');
            });

            //更新文件夹属性
            $('#updateFolder').on('click', function () {
                cos.updateFolder(successCallBack, errorCallBack, bucket, '/333/', 'authority');
            });


            //删除文件
            $('#deleteFile').on('click', function () {
                var myFile = myFolder + '2.txt';//填你自己实际存在的文件
                cos.deleteFile(successCallBack, errorCallBack, bucket, myFile);
            });

            //获取文件属性
            $('#getFileStat').on('click', function () {
                var myFile = myFolder + '2.txt';//填你自己实际存在的文件
                cos.getFileStat(successCallBack, errorCallBack, bucket, myFile);
            });

            //更新文件属性
            $('#updateFile').on('click', function () {
                var myFile = myFolder + '2.txt';//填你自己实际存在的文件
                cos.updateFile(successCallBack, errorCallBack, bucket, myFile, 'my new file attr');
            });

            //拷贝文件，从源文件地址复制一份到新地址
            $('#copyFile').on('click', function () {

                var myFile = '111/2.txt';//填你自己实际存在的文件

                //注意一下目标的路径，这里如果填333/2.txt 则表示文件复制到111/333/2.txt
                //如果填/333/2.txt 则表示文件复制到bucket根目录下的333/2.txt
                var newFile = '/333/2.txt';
                var overWrite = 1;//0 表示不覆盖 1表示覆盖
                cos.copyFile(successCallBack, errorCallBack, bucket, myFile, newFile, overWrite);
            });

            //移动文件，把源文件移动到新地址，如果是同一个目录移动且文件名不同的话，相当于改了一个文件名
            //如果是移动到新目录，相当于剪切当前的文件，粘贴到了新目录
            $('#moveFile').on('click', function () {

                var myFile = '/111/2.txt';//填你自己实际存在的文件

                //注意一下目标的路径，这里如果填333/2.txt 则表示文件移动到111/333/2.txt
                //如果填/333/2.txt 则表示文件移动到bucket根目录下的333/2.txt
                //如果填/111/3.txt 则相当于把2.txt改名成3.txt
                var newFile = '/333/2.txt';
                var overWrite = 1;//0 表示不覆盖 1表示覆盖
                cos.moveFile(successCallBack, errorCallBack, bucket, myFile, newFile, overWrite);
            });

            $('#cancelTask').on('click', function () {
                cos.cancelTask(lastTaskId);
            });
//TODO--------------------------------腾讯cos end ----------------------------------------------------
});