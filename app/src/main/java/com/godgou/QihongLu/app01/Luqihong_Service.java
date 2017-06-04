package com.godgou.QihongLu.app01;

import android.app.ActivityManager;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.graphics.BitmapFactory;
import android.media.RingtoneManager;
import android.os.IBinder;
import android.support.v7.app.NotificationCompat;
import android.util.Log;

import java.util.List;

import static android.app.PendingIntent.FLAG_UPDATE_CURRENT;

/**
 * Created by Administrator on 2017/1/30 0030.
 */

public class Luqihong_Service extends Service {
    public static final String TAG = "Luqihong_Service";
    int i=0;
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        return Service.START_STICKY;
    }
    public void simpleNotify() {    //为了版本兼容  选择V7包下的NotificationCompat进行构造
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this);
        //Ticker是状态栏显示的提示
        builder.setTicker("您有新的消息!来自Luqihong");
        //第一行内容  通常作为通知栏标题
        builder.setContentTitle("标题");
        //第二行内容 通常是通知正文
        builder.setContentText("通知内容");
        //第三行内容 通常是内容摘要什么的 在低版本机器上不一定显示
        builder.setSubText("这里显示的是通知第三行内容！");
        //number设计用来显示同种通知的数量,在通知的右侧 时间的下面 用来展示一些其他信息
        i=i+1;
        builder.setNumber(i);
        //系统状态栏显示的小图标
        builder.setSmallIcon(R.drawable.ico_24px);
        //下拉显示的大图标
        builder.setLargeIcon(BitmapFactory.decodeResource(getResources(), R.drawable.ico_72px));
        Intent intent = new Intent(this, MainActivity.class);
        PendingIntent pIntent = PendingIntent.getActivity(this,i, intent,FLAG_UPDATE_CURRENT);
        builder.setContentIntent(pIntent);//设置点击通知后操作（可以跳转Activity，打开Service，或者发送广播）
        builder.setAutoCancel(true);//在被单击后自动取消自己
        builder.setOngoing(true);//设置为ture，表示它为一个正在进行的通知。简单的说，当为ture时，不可以被侧滑消失
        builder.setPriority(Notification.PRIORITY_MAX);//设置优先级，级别高的排在前面
        builder.setDefaults(Notification.DEFAULT_ALL);// 默认显示带有默认铃声、震动、呼吸灯效果的通知
        Notification nf = builder.build();
        //notification.sound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION); // 系统默认铃声
        //notification.sound = Uri.parse("file:///sdcard/notification/ringer.mp3");// 播放自定义的铃声
        nf.flags= Notification.FLAG_INSISTENT; // 通知会一直响起，直到你触碰通知栏的时间就会停止
       //notification.flags=Notification.FLAG_NO_CLEAR;//通知栏点击“清除”按钮时，该通知将不会被清除
        //notification.flags=Notification.FLAG_FOREGROUND_SERVICE;//前台服务标记
        //(NotificationManager) getSystemService(NOTIFICATION_SERVICE).notify(1990, notification);
        //NotificationManager nm=(NotificationManager)getSystemService(NOTIFICATION_SERVICE);
        //int id=1990;//通过 NotificationManager 调用 cancelAll() 方法清除所有该应用之前发送的通知,cancel(id) 方法清除指定ID的通知
        startForeground(i, nf);
    }
    @Override
    public void onCreate() {
        super.onCreate();
        simpleNotify();
    }
    @Override
    public void onDestroy() {
        super.onDestroy();
        Intent localIntent = new Intent(this, Luqihong_Service.class);//销毁时重新启动Service
        startService(localIntent);
    }
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
