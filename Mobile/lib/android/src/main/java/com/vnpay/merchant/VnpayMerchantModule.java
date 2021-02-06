package com.vnpay.merchant;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.vnpay.authentication.VNP_AuthenticationActivity;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

public class VnpayMerchantModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    public VnpayMerchantModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.getReactApplicationContext().addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "VnpayMerchant";
    }

    @ReactMethod
    public void show(String scheme, boolean isSandbox, String paymentUrl, String tmn_code, String backAlert, String title, String titleColor, String beginColor, String endColor, String iconBackName) {
        Intent intent = new Intent(getReactApplicationContext(), VNP_AuthenticationActivity.class);
        intent.putExtra("url", paymentUrl);
        intent.putExtra("scheme", scheme);
        intent.putExtra("tmn_code", tmn_code);
        getReactApplicationContext().startActivityForResult(intent, 99, Bundle.EMPTY);
    }


    @Override
    public void onNewIntent(Intent intent) {
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if(requestCode==99){
            WritableMap params = Arguments.createMap();
            params.putInt("resultCode", resultCode);
            getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("PaymentBack",params);
        }
    }
}
