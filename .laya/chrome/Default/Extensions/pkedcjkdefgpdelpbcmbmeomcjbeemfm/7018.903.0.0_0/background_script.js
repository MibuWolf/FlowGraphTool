'use strict';db("mr.TestProvider");var dx,Cw,ex=db("mr.Init"),fx=function(a){void 0!==a&&ex.info("Using the "+(a?"Views (Harmony)":"WebUI")+" dialog.")};sp().init();dx=new sb("MediaRouter.Provider.WakeDuration");Cw=new Rw;
var gx=(new Promise(function(a,b){switch(window.location.host){case "enhhojjnijigcajfphajepfemndkmdlo":a();break;case "pkedcjkdefgpdelpbcmbmeomcjbeemfm":chrome.management.get("enhhojjnijigcajfphajepfemndkmdlo",function(c){chrome.runtime.lastError||!c.enabled?a():b(Error("Dev extension is enabled"))});break;default:b(Error("Unknown extension id"))}})).then(function(){return chrome.mojoPrivate&&chrome.mojoPrivate.requireAsync?new Promise(function(a){chrome.mojoPrivate.requireAsync("media_router_bindings").then(function(b){mojo=b.getMojoExports&&
b.getMojoExports();b.start().then(function(c){a({mrService:b,mrInstanceId:c.instance_id||c,mrConfig:c.config})})})}):Promise.reject(Error("No mojo service loaded"))}).then(function(a){if(!a.mrService)throw Error("Failed to get MR service");var b=a.mrInstanceId;if(!b)throw Error("Failed to get MR instance ID.");ex.info("MR instance ID: "+b);fx(a.mrConfig.use_views_dialog);var c=a.mrService;if(!Cw)throw Error("providerManager not initialized.");c.setHandlers(Cw);gj(b)&&(dx.f="MediaRouter.Provider.FirstWakeDuration");
chrome.runtime.onSuspend.addListener(dx.b.bind(dx));kj(b);vp();b=Bw();window.addEventListener("unhandledrejection",function(a){a=a.reason;a.stack||(a=Error(a));ex.error("Unhandled promise rejection.",a)});Cw.Wa(c,b,a.mrConfig)}).then(void 0,function(a){ex.F(a.message);throw a;});[].concat(n([Aw(),xw()].concat(n(Hm()),n([kt(),gt()])))).forEach(function(a){ej(a)});Aw().addListener();xw().addListener();chrome.runtime.onStartup.addListener(function(){});gx.then(void 0,function(){return window.close()});
