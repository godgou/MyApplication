package com.godgou.QihongLu.app01;

import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.res.AssetFileDescriptor;
import android.database.Cursor;
import android.media.MediaPlayer;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Environment;
import android.os.Handler;
import android.os.Message;
import android.provider.ContactsContract;
import android.provider.MediaStore;
import android.provider.Settings;
import android.provider.Telephony;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.app.Activity;
import android.telephony.SmsManager;
import android.telephony.SmsMessage;
import android.telephony.TelephonyManager;
import android.text.TextUtils;
import android.util.Base64;
import android.util.Log;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputConnection;
import android.view.inputmethod.InputConnectionWrapper;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import com.google.common.base.Utf8;

import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.Socket;
import java.net.URL;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import static java.net.Proxy.Type.HTTP;

public class MainActivity extends AppCompatActivity {
    static {
        System.loadLibrary("native-lib");
    }
    Calendar calendar = Calendar.getInstance();//时间
	String Userdata="";//用户数据
    String WebTitle="";
    Context mContext = this;
    WebView webview;////网页视图
    MediaPlayer mp = new MediaPlayer();//音视频播放器
    Socket socket;//套接字
    BufferedWriter bWriter;//输出流，发送、写入信息
    BufferedReader bReader;//输入流，接受、读取信息
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        webview = new WebView(this){
            @Override
            public InputConnection onCreateInputConnection(EditorInfo outAttrs) {
                return new mInputConnecttion(super.onCreateInputConnection(outAttrs),false);
            }
        };
        webview.setWebChromeClient(new WebChromeClient(){ 
        @Override//重写webview页面加载标题事件
        public void onReceivedTitle(WebView view, String aTitle)
        {super.onReceivedTitle(view, aTitle);
            WebTitle=aTitle;//获取当前页面的标题
        }
		      @Override
            public void onCloseWindow(WebView window) {//html中，用js调用.close(),会回调此函数  
                super.onCloseWindow(window);  
              //TODO something  
            }  
        });
        webview.addJavascriptInterface(new JsInterface(), "android");//js交互
        webview.setHorizontalScrollBarEnabled(false);//取消横向滚动条显示
        webview.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }//设置在webView点击打开的新网页在当前界面显示,而不跳转到新的浏览器中
            @Override
            public void onPageFinished(WebView view, String url) {//页面加载完成事件
                if(url.equals("file:///android_asset/reg_lod/register.html")||//注册
				   url.equals("file:///android_asset/reg_lod/login.html")||
				   url.equals("file:///android_asset/reg_lod/binding.html")){//登陆
                    TelephonyManager tm = (TelephonyManager)getSystemService(Context.TELEPHONY_SERVICE);
                String DEVICE_ID = tm.getDeviceId();//imei
                String Model=android.os.Build.MODEL;//手机型号
                webview.loadUrl("javascript:SetMobileID('"+DEVICE_ID+"','"+Model+"')");
            }//设置手机imei和型号

                if(url.equals("file:///android_asset/reg_lod/my.html")){//个人中心
                    webview.loadUrl("javascript:SetUserData("+Userdata+")");
                    Log.e("ssss",Userdata);
                }//设置个人资料

            }
        });
        WebSettings settings = webview.getSettings();
        settings.setJavaScriptEnabled(true);//设置WebView属性,运行执行js脚本
        settings.setLoadsImagesAutomatically(true);//自动加载图片
        settings.setBlockNetworkImage(false);//解决图片不显示
        settings.setAllowFileAccessFromFileURLs(true);//允许运行在一个URL环境中的JavaScript访问来自其他URL环境的内容
        settings.setAllowUniversalAccessFromFileURLs(true);//Javascript可以访问其他的源，包括其他的文件和http,https等其他的源
        settings.setJavaScriptCanOpenWindowsAutomatically(true);//设置脚本是否允许自动打开弹窗，window.open方法
        settings.setDefaultTextEncodingName("UTF-8");//设置WebView加载页面文本内容的编码，默认“UTF-8”
        settings.setLoadWithOverviewMode(true);//自适应屏幕
        settings.setAllowContentAccess(true);//允许在WebView中访问内容URL
        settings.setAllowFileAccess(true); // 允许访问文件
        //settings.setMediaPlaybackRequiresUserGesture(false);//设置WebView是否通过手势触发播放媒体，默认是true，需要手势触发。
        settings.setAppCacheEnabled(true);//支持缓存
        settings.setUseWideViewPort(false);//是否使用viewport，当设置为false时，宽度总是适应WebView控件宽度；当被设置为true，当前页面包含viewport属性标签，在标签中指定宽度值生效，如果页面不包含viewport标签，无法提供一个宽度值，这个时候该方法将被使用
        //webview.setVerticalScrollBarEnabled(false);//取消坚向滚动条显示
        //settings.setSupportZoom(true);//设定支持缩放
        //settings.setDisplayZoomControls(false);//把缩放控件给隐藏掉
        //webview.setInitialScale(25);//为25%，最小缩放等级
        //加载一个网页：
        //webView.loadUrl("http://www.google.com/");
        //加载apk包中的一个html页面
        //webView.loadUrl("file:///android_asset/test.html");
        //加载手机本地的一个html页面的方法：
        //webView.loadUrl("content://com.android.htmlfileprovider/sdcard/test.html");
        webview.loadUrl("file:///android_asset/main.html");//调用loadUrl方法为WebView加入链接
        setContentView(webview);//调用Activity提供的setContentView将webView显示出来
        startService(new Intent(this,Luqihong_Service.class));
    }
    @Override
    public void onDestroy(){
        super.onDestroy();

    }//当MainActivity消毁的时候
    @Override
    public void finish() {
//          记住不要执行此句 super.finish(); 因为这是父类已经实现了改方法
        moveTaskToBack(true);//设置该activity永不过期，即不执行onDestroy()
    }
    class mInputConnecttion extends InputConnectionWrapper implements InputConnection{
        mInputConnecttion(InputConnection target, boolean mutable) {
            super(target, mutable);
        }
        @Override
        public boolean commitText(CharSequence text, int newCursorPosition) {
            return super.commitText(text, newCursorPosition);
        }
        @Override
        public boolean sendKeyEvent(KeyEvent event) {
            if(WebTitle.equals("GG-聊天室")){
            if (event.getAction() == KeyEvent.ACTION_UP&& event.getKeyCode() == KeyEvent.KEYCODE_DEL) {

                webview.loadUrl("javascript:del()");
                return false;}
            }
            return super.sendKeyEvent(event);
        }
    }//重写输入法事件
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (webview.canGoBack() && event.getKeyCode() == KeyEvent.KEYCODE_BACK && event.getRepeatCount() == 0) {
            if(WebTitle.equals("GG-打飞鸡")){mp.stop();}//停止播放背景音乐
            webview.goBack();
            return true;
        }//back键控制网页后退
        return super.onKeyDown(keyCode, event);
    }//监听物理按键
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == Activity.RESULT_OK) {//判断另外一个activity已经结束数据输入功能
            String Path;
            Cursor cursor;
            switch (requestCode){
                case 0://通讯录

                    // ContentProvider展示数据类似一个单个数据库表
                    // ContentResolver实例带的方法可实现找到指定的ContentProvider并获取到ContentProvider的数据
                    ContentResolver reContentResolverol = getContentResolver();
                    // 查询就是输入URI等参数,其中URI是必须的,其他是可选的,如果系统能找到URI对应的ContentProvider将返回一个Cursor对象.
                    cursor = reContentResolverol.query(data.getData(), null, null, null, null);
                    cursor.moveToFirst();
            // 获得DATA表中的名字
            String username = cursor.getString(cursor
                    .getColumnIndex(ContactsContract.Contacts.DISPLAY_NAME));
            // 条件为联系人ID
            String contactId = cursor.getString(cursor
                    .getColumnIndex(ContactsContract.Contacts._ID));
            // 获得DATA表中的电话号码，条件为联系人ID,因为手机号码可能会有多个
            Cursor phone = reContentResolverol.query(
                    ContactsContract.CommonDataKinds.Phone.CONTENT_URI, null,
                    ContactsContract.CommonDataKinds.Phone.CONTACT_ID + " = "
                            + contactId, null, null);
            while (phone.moveToNext()) {
                String usernumber = phone
                        .getString(phone
                                .getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER));
                webview.loadUrl("javascript:setTel('" + usernumber + "/" + username + "')");
            }
             break;
             case 1://相册
                    String[] filePathColumn = { MediaStore.Images.Media.DATA };
                    // 查询就是输入URI等参数,其中URI是必须的,其他是可选的,如果系统能找到URI对应的ContentProvider将返回一个Cursor对象.
                    cursor = getContentResolver().query(data.getData(),filePathColumn, null, null, null);
                    cursor.moveToFirst();
                    int columnIndex = cursor.getColumnIndex(filePathColumn[0]);
                 Path = cursor.getString(columnIndex);  //获取照片路径
                    cursor.close();
                 Path="javascript:send(\"<img src='file://"+Path+"'>\")";
                 webview.loadUrl(Path);
             break;
                case 2://拍照
                    Path=Environment.getExternalStorageDirectory().getAbsolutePath()+File.separator+"KeiGui"+File.separator+"Images"+File.separator+"ChatTemp.jpg";
                    Path="javascript:send(\"<img src='"+Path+"'>\")";
                        webview.loadUrl(Path);
                    Toast.makeText(mContext,"2",Toast.LENGTH_SHORT).show();
                    break;
                case 3://录像
                    Path=Environment.getExternalStorageDirectory().getAbsolutePath()+File.separator+"KeiGui"+File.separator+"Images"+File.separator+"ChatTemp.jpg";
                    Path="javascript:send(\"<img src='"+Path+"'>\")";
                    webview.loadUrl(Path);
                    Toast.makeText(mContext,"2",Toast.LENGTH_SHORT).show();
                    break;
            }
        }
    }//新的Activity关闭后会向前面的Activity传回数据，为了得到传回的数据，必须在前面的Activity中重写onActivityResult()
    public boolean IsStart_AccessibilityService(String server) {
        int accessibilityEnabled = 0;
        // TestService为对应的服务
        final String service = getPackageName() + "/" + getPackageName()+"."+server;
        // com.z.buildingaccessibilityservices/android.accessibilityservice.AccessibilityService
        try {
            accessibilityEnabled = Settings.Secure.getInt(mContext.getApplicationContext().getContentResolver(),
                    android.provider.Settings.Secure.ACCESSIBILITY_ENABLED);
        } catch (Settings.SettingNotFoundException e) {
            Log.e( "no accessibility: " ,e.getMessage());
        }
        TextUtils.SimpleStringSplitter mStringColonSplitter = new TextUtils.SimpleStringSplitter(':');

        if (accessibilityEnabled == 1) {
            String settingValue = Settings.Secure.getString(mContext.getApplicationContext().getContentResolver(),
                    Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES);
            // com.z.buildingaccessibilityservices/com.z.buildingaccessibilityservices.TestService
            if (settingValue != null) {
                mStringColonSplitter.setString(settingValue);
                while (mStringColonSplitter.hasNext()) {
                    String accessibilityService = mStringColonSplitter.next();
                    if (accessibilityService.equalsIgnoreCase(service)) {
                        return true;
                    }
                }
            }
        } else {
            //启动服务
            mContext.startService(new Intent(mContext,Luqihong_Service.class));
        }
        return false;
    }//判断AccessibilityService是否已经启用
/**--------------------------------------------------------------------------------------------*/
/**                 【javascript】  Created by Qihong Lu on 2017/3/12 0012.                    */
/**--------------------------------------------------------------------------------------------*/
    final class JsInterface{
        JsInterface() {}
        //        @JavascriptInterface
//        public void connect() {
//            new AsyncTask<Void, String, Void>() {
//                //在主线程中执行，不能用来初始化socket
//                protected void onPreExecute() {
//                }//在UI线程上调用任务后立即执行。这步通常被用于设置任务，例如在用户界面显示一个进度条。
//                protected Void doInBackground(Void[] params) {
//                    try {
//                        socket = new Socket("42.51.158.129", 1990);
//                        bWriter = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));
//                        bReader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
//                        publishProgress("socket connect success");//向onProgressUpdate()传参数
//                    } catch (IOException e) {
//                        Log.e("socket connect error", "error");
//                    }
//
//                    String s;
//                    //readLine()是一个阻塞函数，当没有数据读取时，就一直会阻塞在那，而不是返回null
//                    //接受信息
//                    try {
//                        while ((s = bReader.readLine()) != null) {
//                            publishProgress(s);//向onProgressUpdate()传参数
//                        }
//                    } catch (IOException e) {
//                        e.printStackTrace();
//                    }
//                    return null;
//                }//后台线程执行onPreExecute()完后立即调用，这步被用于执行较长时间的后台计算。异步任务的参数也被传到这步。计算的结果必须在这步返回，将传回到上一步。在执行过程中可以调用publishProgress(Progress...)来更新任务的进度。
//
//                protected void onProgressUpdate(String[] values) {
//                    if (values[0].equals("socket connect success")) {//使用equals( )方法比较两个字符串是否相等,区分大小写
//                        Toast.makeText(mContext, "socket连接成功", Toast.LENGTH_SHORT).show();
//                    } else {
//                        Toast.makeText(mContext, "收到信息:" + values[0], Toast.LENGTH_SHORT).show();
//                    }
//                }//一次呼叫 publishProgress(Progress...)后调用 UI线程。执行时间是不确定的。这个方法用于当后台计算还在进行时在用户界面显示进度。例如：这个方法可以被用于一个进度条动画或在文本域显示记录。
//            }.execute();//必须在UI线程上调用
//        }//socket
        @JavascriptInterface
        public boolean net(){
            ConnectivityManager manager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);//网络连接状态管理器
            NetworkInfo networkinfo = manager.getActiveNetworkInfo();//网络连接信息
            if (networkinfo == null || !networkinfo.isAvailable() || !networkinfo.isConnected()) {return false;}else{return true;}
        }//判断当前网络是否可用
        @JavascriptInterface
        public void sendtext(String text) {
            try {
                bWriter.write(text + "\n");//使用缓冲区中的方法将数据写入到缓冲区中。
                bWriter.flush();//使用缓冲区中的方法，将数据刷新到目的地文件中去。
            } catch (IOException e) {
                e.printStackTrace();
            }
        }//socket发送信息

        @JavascriptInterface
        public void playaudio(String path, boolean tf) {
            AssetFileDescriptor afd = null;
            try {
                afd = getAssets().openFd(path);
                //mp.release();//可以释放播放器占用的资源，一旦确定不再使用播放器时应当尽早调用它释放资源
                mp.stop();
                mp.reset();//可以使播放器从Error状态中恢复过来
                mp.setDataSource(afd.getFileDescriptor(), afd.getStartOffset(), afd.getLength());
                //afd.close();
                mp.prepare();
                mp.start();
                mp.setLooping(tf);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }//播放音频

        @JavascriptInterface
        public void stopaudio() {
            //mp.release();//可以释放播放器占用的资源，一旦确定不再使用播放器时应当尽早调用它释放资源
            mp.stop();
        }//停止音频

        @JavascriptInterface
        public void sendMsg(String address/*对方手机号码*/, String body/*短信内容*/, int type/*1:接收;2:发送*/, boolean tf/*是否真实短信true和false*/, long dt, String uri) {
            if (tf == true) {
                ArrayList<PendingIntent> sentPendingIntents = new ArrayList<PendingIntent>();
                ArrayList<PendingIntent> deliveredPendingIntents = new ArrayList<PendingIntent>();
                SmsManager sms = SmsManager.getDefault();//获得短信管理器实例
                PendingIntent sentPI = PendingIntent.getBroadcast(mContext, 0, new Intent("SENT_SMS_ACTION"), 0);// 获得发送报告
                PendingIntent deliverPI = PendingIntent.getBroadcast(mContext, 0, new Intent("DELIVERED_SMS_ACTION"), 0);// 获得对方接受到之后返回的报告
                if (body.length() > 70) {//如果字数超过70,需拆分成多条短信发送
                    ArrayList<String> msgs = sms.divideMessage(body);
                    for (int i = 0; i < msgs.size(); i++) {
                        sentPendingIntents.add(i, sentPI);
                        deliveredPendingIntents.add(i, deliverPI);
                    }
                    sms.sendMultipartTextMessage(address, null, msgs, sentPendingIntents,deliveredPendingIntents);

                } else {
                    sms.sendTextMessage(address, null, body, sentPI, deliverPI);
                }
            }
        /*写入短信到短信数据库*/
            ContentValues values = new ContentValues();//写入到短信数据源
            values.put("address", address);//对方手机号码
            values.put("body", body);//短信内容
            values.put("date", dt);//创建时间(毫秒数)//System.currentTimeMillis()
            values.put("read", 0);//0:未读;1:已读
            values.put("type", type);//1:收件箱;2:发送
            getContentResolver().insert(Uri.parse(uri), values);//插入数据
            tip("It is ok!");
            /*sms主要结构：
            　　
            　　_id：短信序号，如100
            　　
            　　thread_id：对话的序号，如100，与同一个手机号互发的短信，其序号是相同的
            　　
            　　address：发件人地址，即手机号，如+8613811810000
            　　
            　　person：发件人，如果发件人在通讯录中则为具体姓名，陌生人为null
            　　
            　　date：日期，long型，如1256539465022，可以对日期显示格式进行设置
            　　
            　　protocol：协议0SMS_RPOTO短信，1MMS_PROTO彩信
            　　
            　　read：是否阅读0未读，1已读
            　　
            　　status：短信状态-1接收，0complete,64pending,128failed
            　　
            　　type：短信类型1是接收到的，2是已发出
            　　
            　　body：短信具体内容
            　　
            　　service_center：短信服务中心号码编号，如+8613800755500*/
        }//发短信

        @JavascriptInterface
        public void tip(String txt) {
            Toast toast = Toast.makeText(mContext, txt, Toast.LENGTH_SHORT);//2秒,LENGTH_LONG为3.5秒
            toast.setGravity(Gravity.CENTER, 0, 0);//居中
            toast.show();//显示
        }//吐司

        @JavascriptInterface
        public void displayTel() {
            startActivityForResult(new Intent(Intent.ACTION_PICK, ContactsContract.Contacts.CONTENT_URI),0);//开启一个带有返回值的Activity，请求码为0
        }//调用系统自带通讯录界面
        @JavascriptInterface
        public void getimg() {
            //intent.setType("image/*");//从所有图片中进行选择
            startActivityForResult(new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI),1);//开启一个带有返回值的Activity，请求码为1
        }//选择图片
        @JavascriptInterface
        public void PhotoGraph() {
            String state = Environment.getExternalStorageState(); //拿到sdcard是否可用的状态码
            if (state.equals(Environment.MEDIA_MOUNTED)){   //如果可用
                Intent intent=new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                File ImgDir= new File(Environment.getExternalStorageDirectory().getAbsolutePath()+File.separator+"KeiGui"+File.separator+"Images");
                if (!ImgDir.exists()) {ImgDir.mkdirs();}//若不存在，创建目录
                ImgDir= new File(Environment.getExternalStorageDirectory().getAbsolutePath()+File.separator+"KeiGui"+File.separator+"Images"+File.separator+"ChatTemp.jpg");
                Uri imageFileUri=Uri.fromFile(ImgDir);//得到一个File Uri
                intent.putExtra(MediaStore.EXTRA_OUTPUT, imageFileUri);
                startActivityForResult(intent,2);//开启一个带有返回值的Activity，请求码为2
            }else {
                Toast.makeText(mContext,"sdcard不可用!",Toast.LENGTH_SHORT).show();
            }
        }//拍照
        @JavascriptInterface
        public void VideoTape() {
            String state = Environment.getExternalStorageState(); //拿到sdcard是否可用的状态码
            if (state.equals(Environment.MEDIA_MOUNTED)){   //如果可用
                Intent intent = new Intent(MediaStore.ACTION_VIDEO_CAPTURE);
                File VideoDir= new File(Environment.getExternalStorageDirectory().getAbsolutePath()+File.separator+"KeiGui"+File.separator+"Videos");
                if (!VideoDir.exists()) {VideoDir.mkdirs();}//若不存在，创建目录
                VideoDir= new File(Environment.getExternalStorageDirectory().getAbsolutePath()+File.separator+"KeiGui"+File.separator+"Videos"+File.separator+"ChatTemp.mp4");
                Uri VideoFileUri=Uri.fromFile(VideoDir);//得到一个File Uri
                intent.putExtra(MediaStore.EXTRA_OUTPUT, VideoFileUri);
                startActivityForResult(intent,3);//开启一个带有返回值的Activity，请求码为3
            }else {
                Toast.makeText(mContext,"sdcard不可用!",Toast.LENGTH_SHORT).show();
            }
        }//录像
        @JavascriptInterface
        public void PlayVideo(String Path){
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setDataAndType(Uri.parse(Path), "video/*");
            startActivity(intent);

        }//调用系统播放器播放视频
        @JavascriptInterface
        public void Start_Server(String server){
            if(!IsStart_AccessibilityService(server)){
                startActivity(new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS));//打开系统服务界面
            }else{Toast.makeText(mContext,"服务已启用!",Toast.LENGTH_SHORT).show();}
        }//启动服务
    @JavascriptInterface
    public void OpenUrl(String url){
        Intent intent = new Intent();
//Intent intent = new Intent(Intent.ACTION_VIEW,uri);
        intent.setAction("android.intent.action.VIEW");
        Uri content_url = Uri.parse(url);
        intent.setData(content_url);
        startActivity(intent);
    }//调用默认浏览器打开网页
    @JavascriptInterface
    public void UserData(String data){
            Userdata=data;
    }//设置或获取用户资料

    }//JS与android交互
}/*-***********************************************- the end -***********************************************-*/
/*private BroadcastReceiver sendMessage = new BroadcastReceiver() {

                @Override
                public void onReceive(Context context, Intent intent) {
                    //判断短信是否发送成功
                    switch (getResultCode()) {
                        case Activity.RESULT_OK:
                            Toast.makeText(context, "短信发送成功", Toast.LENGTH_SHORT).show();
                            break;
                        default:
                            Toast.makeText(mContext, "发送失败", Toast.LENGTH_LONG).show();
                            break;
                    }
                }
            };

            private BroadcastReceiver receiver = new BroadcastReceiver() {

                @Override
                public void onReceive(Context context, Intent intent) {
                    //表示对方成功收到短信
                    Toast.makeText(mContext, "对方接收成功",Toast.LENGTH_LONG).show();
                }
            }*/
/*--------------------------------API解释-----------------------------------*/
//e.printStackTrace();在命令行打印异常信息在程序中出错的位置及原因
//文本比应该用1.equals("2")而非1==2
