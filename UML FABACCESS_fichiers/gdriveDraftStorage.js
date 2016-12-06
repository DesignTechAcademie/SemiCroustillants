var module$gdriveDraftStorage={};
(function(){window.GLIFFY=window.GLIFFY||{};window.GLIFFY.ONLINE=window.GLIFFY.ONLINE||{};window.GLIFFY.ONLINE.INTEGRATION=window.GLIFFY.ONLINE.INTEGRATION||{};window.GLIFFY.ONLINE.INTEGRATION.gdriveDraftStorage={checkDraft:function(document,successCallback,errorCallback){if(!GliffyApp.authController.isAuthenticated())return successCallback([]);var documentId=document.urls.id;if(documentId==null)documentId=0;GLIFFY.API.GET("externalautosave/query",{query:{documentId:documentId},success:function(data){if(data.drafts.length>
0){var offset=(new Date).getTimezoneOffset();var server=Date.parse(data.drafts[0].friendlyDate);var local=new Date(server.getTime()-offset*6E4);var months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];data.drafts[0].friendlyDate=months[local.getMonth()]+" "+local.getDate()+", "+local.getFullYear()+" "+local.getHours()+":"+local.getMinutes()}successCallback(data.drafts)},error:function(xhr,text,error){errorCallback(xhr,text,error)}})},saveDraft:function(document,successCallback,
errorCallback){if(!GliffyApp.authController.isAuthenticated())return successCallback([]);var documentId=document.urls.id;if(documentId==null)documentId=0;var json=document;delete json.image;GLIFFY.API.POST("externalautosave/save?documentId\x3d"+documentId,json,{success:function(data){successCallback(data.drafts[0])},error:function(xhr,text,error){errorCallback(xhr,text,error)}})},getDraft:function(url,successCallback,errorCallback){if(!GliffyApp.authController.isAuthenticated())return successCallback([]);
GLIFFY.API.GET(url,{success:function(data){successCallback(JSON.parse(data.drafts[0].content))},error:function(xhr,text,error){errorCallback(xhr,text,error)}})},deleteDraft:function(document,successCallback,errorCallback){if(!GliffyApp.authController.isAuthenticated())return successCallback([]);var documentId=document.urls.id;if(documentId==null)documentId=0;GLIFFY.API.DELETE("externalautosave/delete",{query:{documentId:documentId},success:function(data){successCallback()},error:function(xhr,text,
error){errorCallback(xhr,text,error)}})}}})();