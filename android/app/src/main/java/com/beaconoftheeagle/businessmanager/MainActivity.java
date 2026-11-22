package com.beaconoftheeagle.businessmanager;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.WindowInsets;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;
import androidx.webkit.WebViewAssetLoader;
import org.json.JSONObject;
import java.io.ByteArrayInputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class MainActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final String START = "https://" + HOST + "/assets/www/index.html";
    private static final int EXPORT_REQUEST = 100;
    private WebView web;
    private String pendingBackup;

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    @Override public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(243,246,252));
        web = new WebView(this);
        web.setBackgroundColor(Color.rgb(243,246,252));
        root.addView(web, new FrameLayout.LayoutParams(-1,-1));
        setContentView(root);
        if (Build.VERSION.SDK_INT >= 30) getWindow().setDecorFitsSystemWindows(false);
        root.setOnApplyWindowInsetsListener((view, insets) -> {
            if (Build.VERSION.SDK_INT >= 30) {
                android.graphics.Insets i = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.ime());
                view.setPadding(i.left,i.top,i.right,i.bottom);
            } else {
                view.setPadding(insets.getSystemWindowInsetLeft(),insets.getSystemWindowInsetTop(),insets.getSystemWindowInsetRight(),insets.getSystemWindowInsetBottom());
            }
            return insets;
        });
        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setSupportMultipleWindows(false);
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);
        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this)).build();
        web.setWebViewClient(new WebViewClient() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (isLocal(uri)) return loader.shouldInterceptRequest(uri);
                return new WebResourceResponse("text/plain","UTF-8",403,"Blocked",null,new ByteArrayInputStream(new byte[0]));
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return !isLocal(request.getUrl());
            }
        });
        web.addJavascriptInterface(new ExportBridge(),"BeaconAndroid");
        if (savedInstanceState == null || web.restoreState(savedInstanceState) == null) web.loadUrl(START);
        if (Build.VERSION.SDK_INT >= 33) getOnBackInvokedDispatcher().registerOnBackInvokedCallback(0,this::handleBack);
    }
    private boolean isLocal(Uri uri) {
        return "https".equals(uri.getScheme()) && HOST.equals(uri.getHost()) && uri.getPath() != null && uri.getPath().startsWith("/assets/www/");
    }
    private class ExportBridge {
        @JavascriptInterface public void exportBackup(String json) {
            if (json == null || json.length() > 10_000_000) return;
            try { new JSONObject(json); } catch (Exception e) { return; }
            beginExport(json,"application/json","beacon-business-backup.json");
        }
        @JavascriptInterface public void exportReport(String csv) {
            if (csv == null || csv.length() > 10_000_000) return;
            beginExport(csv,"text/csv","beacon-business-report.csv");
        }
        @JavascriptInterface public void importBackup() {
            runOnUiThread(() -> {
                Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("*/*");
                intent.putExtra(Intent.EXTRA_MIME_TYPES,new String[]{"application/json","text/plain","application/octet-stream"});
                try { startActivityForResult(intent,101); }
                catch (Exception e) { web.evaluateJavascript("document.dispatchEvent(new Event('beacon-import-error'));",null); }
            });
        }
    }
    private void beginExport(String text,String mime,String fileName) {
        runOnUiThread(() -> {
            if (pendingBackup != null) { Toast.makeText(MainActivity.this,R.string.export_in_progress,Toast.LENGTH_SHORT).show(); return; }
            pendingBackup=text;
            Intent intent=new Intent(Intent.ACTION_CREATE_DOCUMENT);
            intent.addCategory(Intent.CATEGORY_OPENABLE);
            intent.setType(mime);
            intent.putExtra(Intent.EXTRA_TITLE,fileName);
            try { startActivityForResult(intent,EXPORT_REQUEST); }
            catch (Exception e) { pendingBackup=null;notifyExport("error"); }
        });
    }
    private void receiveImport(Intent data) {
        Uri uri=data.getData();
        if(uri==null || !"content".equals(uri.getScheme()))return;
        new Thread(() -> {
            try(java.io.InputStream in=getContentResolver().openInputStream(uri);java.io.ByteArrayOutputStream out=new java.io.ByteArrayOutputStream()) {
                if(in==null)throw new java.io.IOException("No input stream");
                byte[] buffer=new byte[8192];int size;
                while((size=in.read(buffer))!=-1){if(out.size()+size>10_000_000)throw new java.io.IOException("File too large");out.write(buffer,0,size);}
                String text=new String(out.toByteArray(),StandardCharsets.UTF_8);
                new JSONObject(text);
                runOnUiThread(() -> {if(!isFinishing())web.evaluateJavascript("document.dispatchEvent(new CustomEvent('beacon-import-file',{detail:"+JSONObject.quote(text)+"}));",null);});
            } catch(Exception e) {runOnUiThread(() -> {if(!isFinishing())web.evaluateJavascript("document.dispatchEvent(new Event('beacon-import-error'));",null);});}
        }).start();
    }
    @Override protected void onActivityResult(int requestCode,int resultCode,Intent data) {
        super.onActivityResult(requestCode,resultCode,data);
        if(requestCode==101){if(resultCode==RESULT_OK&&data!=null)receiveImport(data);return;}
        if (requestCode != EXPORT_REQUEST) return;
        String backup=pendingBackup; pendingBackup=null;
        if (resultCode != RESULT_OK || data == null || data.getData() == null) { notifyExport("cancelled"); return; }
        if (backup == null) { notifyExport("error"); return; }
        Uri uri=data.getData();
        if (!"content".equals(uri.getScheme())) { notifyExport("error"); return; }
        new Thread(() -> {
            try (OutputStream stream=getContentResolver().openOutputStream(uri,"wt")) {
                if (stream == null) throw new java.io.IOException("No output stream");
                stream.write(backup.getBytes(StandardCharsets.UTF_8));
                runOnUiThread(() -> notifyExport("saved"));
            } catch (Exception e) { runOnUiThread(() -> { notifyExport("error"); Toast.makeText(MainActivity.this,R.string.export_error,Toast.LENGTH_LONG).show(); }); }
        }).start();
    }
    private void notifyExport(String status) {
        web.evaluateJavascript("document.dispatchEvent(new CustomEvent('beacon-export-result',{detail:'"+status+"'}));",null);
    }
    private void handleBack() {
        web.evaluateJavascript("(function(){var d=document.querySelector('dialog[open]');if(d){d.close();return true;}return false;})()",result -> {
            if (!"true".equals(result)) { if(web.canGoBack()) web.goBack(); else finish(); }
        });
    }
    @Override public void onBackPressed() { handleBack(); }
    @Override protected void onSaveInstanceState(Bundle outState) { web.saveState(outState); super.onSaveInstanceState(outState); }
    @Override protected void onDestroy() { if(web!=null){web.removeJavascriptInterface("BeaconAndroid");web.destroy();}super.onDestroy(); }
}
