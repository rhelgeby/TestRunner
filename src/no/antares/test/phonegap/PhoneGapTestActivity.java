package no.antares.test.phonegap;

import com.phonegap.DroidGap;
import android.os.Bundle;

public class PhoneGapTestActivity extends DroidGap {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/testdemo/index.html");
        //super.loadUrl("http://192.168.1.128:8000/capture");
    }
}
