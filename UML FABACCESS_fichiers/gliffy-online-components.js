(function(){(function(){GliffyApp.ImagePanelView=Ember.View.extend({templateName:"gliffy-online-image-browser-template",openOnInit:false,uid:"com.gliffy.libraries.images",elementId:"gliffy-shape-library-com-gliffy-library-images",classNames:["gliffy-accordion-group","gliffy-shape-library-com-gliffy-library-images"],attributeBindings:["data-gliffy-library","data-uid"],"data-gliffy-library":"com.gliffy.library.images","data-uid":Ember.computed(function(){return this.uid}).property("uid"),didInsertElement:function(){$("#"+this.elementId).find(".gliffy-loading").removeClass("gliffy-loading");$("#"+this.elementId).find(".gliffy-panel-remove").tooltip(GLIFFY.Editor.TOOLTIP_OPTIONS_RIGHT);GliffyApp.imageBrowserController.fixImageButtons();GliffyApp.imageBrowserController.config();GliffyApp.imageBrowserController.render();$(".gliffy-shape-library-com-gliffy-library-images").on("click",function(){GliffyApp.imageBrowserController.handleOpenImagesTab()});if(this.openOnInit){$(".gliffy-shape-library-com-gliffy-library-images").find(".accordion-heading>a:first").click()}},removePanel:function(){GliffyApp.shapeLibraryModel.removePanel("com.gliffy.libraries.images");$(".tooltip.right").remove();GLIFFY.Utils.analyticsEvent("trackEvent",{category:"removePanel",action:this.uid})}})}());(function(){GliffyApp.OnlineImageBrowserView=GliffyApp.ImagePanelView.extend({didInsertElement:function(){var a=this;this._super();$("#gliffy-image-browser-button-previous").tooltip(GLIFFY.Editor.TOOLTIP_OPTIONS_STANDARD);$("#gliffy-image-browser-button-next").tooltip(GLIFFY.Editor.TOOLTIP_OPTIONS_STANDARD);if($.browser.msie){$(".gliffy-image-browser-drag-instr").hide()}$("#gliffy-shape-library-com-gliffy-library-images .gliffy-search-combobox input").on("keydown",function(b){a.handleInputKeyDown(b)})},handleUploadClick:function(){$(".gliffy-image-browser-image-fineuploader-button input").click()},handleInputKeyDown:function(a){if(a.keyCode===13){GliffyApp.imageBrowserController.handleSearch($("#gliffy-shape-library-com-gliffy-library-images .gliffy-search-combobox input").val())}}})}());(function(){GliffyApp.ImageBrowserController=Ember.Controller.extend({__editor:null,__numPages:1,__currentPage:1,__totalImages:0,init:function(){var a=this;$("body").on("click","#gliffy-image-browser-button-previous",function(b){a.handlePreviousClick()}).tooltip(GLIFFY.Editor.TOOLTIP_OPTIONS_STANDARD);$("body").on("click","#gliffy-image-browser-button-next",function(b){a.handleNextClick()}).tooltip(GLIFFY.Editor.TOOLTIP_OPTIONS_STANDARD);$("body").on("click","#gliffy-image-browser-button-refresh",function(b){b.preventDefault();$("#gliffy-shape-library-images-container").empty();a.buildImageShapes($("#gliffy-shape-library-com-gliffy-library-images"))})},setEditor:function(a){this.__editor=a},render:function(){$("#gliffy-shape-library-images-container").empty();this.buildImageShapes($("#gliffy-shape-library-com-gliffy-library-images"));$("#gliffy-image-browser-button-previous").tooltip(GLIFFY.Editor.TOOLTIP_OPTIONS_STANDARD);$("#gliffy-image-browser-button-next").tooltip(GLIFFY.Editor.TOOLTIP_OPTIONS_STANDARD);if(this.__editor.imageManager&&this.__editor.imageManager.refreshControls){this.__editor.imageManager.refreshControls()}},updateCounter:function(){var c,a,d,b;if(this.__totalImages<16){c=Math.ceil(this.__totalImages/3);$(".gliffy-shape-library-com-gliffy-library-images .gliffy-image-browser-pagination").hide();a=61*c;$("#gliffy-shape-library-images-container").height(a)}else{$(".gliffy-shape-library-com-gliffy-library-images .gliffy-image-browser-pagination").show();$("#gliffy-shape-library-images-container").height(304)}this.updateTotalImagesDisplay();if(this.__currentPage===1){$("#gliffy-image-browser-button-previous").addClass("disabled")}else{$("#gliffy-image-browser-button-previous").removeClass("disabled")}if(this.__currentPage===this.__numPages){$("#gliffy-image-browser-button-next").addClass("disabled")}else{$("#gliffy-image-browser-button-next").removeClass("disabled")}},updateTotalImagesDisplay:function(){var b=(this.__currentPage*15)-15+1,a=b+14;$(".gliffy-image-browser-counter").html(b+" - "+a+" of "+this.__totalImages)},buildImageShapes:function(b){var a=this;this.__editor.performAction("imageList",this.__editor.imageContext,function(c){a.buildImageShapesFromData(c);a.bindDragEvents(b)},function(e,d,c){})},buildImageShapesFromData:function(b){var c,a,j,g=0,f=0,d=3,e,h;this.__numPages=1;this.__currentPage=1;this.__totalImages=0;$("#gliffy-shape-library-images-container").empty();$("#gliffy-shape-library-images-container").append("<div id='gliffy-shape-library-imageBrowser-page1'></div>");e=$("#gliffy-shape-library-imageBrowser-page1");for(c=0;c<b.length;c++){this.__totalImages++;if(c>0&&(c%15===0)){this.__numPages++;e=$("<div id='gliffy-shape-library-imageBrowser-page"+this.__numPages+"'></div>");$("#gliffy-shape-library-images-container").append(e);e.hide()}a=$.extend({uid:"com.gliffy.shape.basic.basic_v1.default.image",tid:"com.gliffy.stencil.image"},b[c]);j=this._buildImageElementFromObject(a);e.append(j);g=g-50;if((c-(d-1))%d===0){g=0;f=f-50}}this.updateCounter()},_buildImageElementFromObject:function(b){var a=$('<div class="gliffy-shape-library-com-gliffy-shape-image"></div>').css({"background-image":"url("+b.thumbnail+")",width:50,height:50,"background-size":"cover"});a.data("params",b);return a},bindDragEvents:function(a){$(a).css("opacity","1")},handlePreviousClick:function(){if(!$("#gliffy-image-browser-button-previous").hasClass("disabled")){$("#gliffy-shape-library-imageBrowser-page"+this.__currentPage).hide();this.__currentPage--;$("#gliffy-shape-library-imageBrowser-page"+this.__currentPage).show();this.updateCounter()}},handleNextClick:function(){if(!$("#gliffy-image-browser-button-next").hasClass("disabled")){$("#gliffy-shape-library-imageBrowser-page"+this.__currentPage).hide();this.__currentPage++;$("#gliffy-shape-library-imageBrowser-page"+this.__currentPage).show();this.updateCounter()}},fixImageButtons:function(){if(this.__editor.language&&this.__editor.language.indexOf("ru")===0){$("#gliffy-image-browser-button-addImages").css("width","141px");$("#gliffy-image-browser-button-refresh").css("width","141px")}}})}());(function(){GliffyApp.OnlineImageBrowserController=GliffyApp.ImageBrowserController.extend({SEARCH_RESULTS_PER_PAGE:20,imageInfo:null,selectedImage:null,imagesLoaded:false,currentContextMenu:null,externalImageSearchPage:1,externalImageSearchResults:0,externalSearchContainer:null,allowedUploadExtensions:[GliffyApp.fileUploadController.FILE_EXTENSION_PNG,GliffyApp.fileUploadController.FILE_EXTENSION_JPG,GliffyApp.fileUploadController.FILE_EXTENSION_JPEG,GliffyApp.fileUploadController.FILE_EXTENSION_GIF],init:function(){},actions:{handleSearch:function(){$("#gliffy-shape-library-com-gliffy-library-images .gliffy-search-combobox .dropdown-toggle").click();this.handleSearch($("#gliffy-shape-library-com-gliffy-library-images .gliffy-search-combobox input").val())},handleBingSearch:function(){$("#gliffy-shape-library-com-gliffy-library-images .gliffy-search-combobox .dropdown-toggle").click();this.handleBingSearch($("#gliffy-shape-library-com-gliffy-library-images .gliffy-search-combobox input").val())},handleNextClick:function(){this.handleNextClick()},handlePreviousClick:function(){this.handlePreviousClick()},handleUpgradeClick:function(){GliffyApp.accountManageController.loadUsers();GliffyApp.accountUpgradePurchaseController.show();GLIFFY.Utils.analyticsEvent("trackEvent",{category:"imageBrowser",action:"upgradeClick",label:window.location.pathname})},handleTag:function(){$(".gliffy-tag-name-error").hide();this.handleTag($("#gliffy-modal-online-tag-image input").val(),function(){$("#gliffy-modal-online-tag-image").modal("hide")})},handleExternalImageSearch:function(){this.doExternalImageSearch($("#gliffy-modal-image-search-results input").val())},handleExternalNextClick:function(){this.handleExternalPageNext()},handleExternalPreviousClick:function(){this.handleExternalPagePrevious()},closeAlert:function(){$("#gliffy-modal-image-search-results .alert-floating").hide()}},config:function(){this.set("imageInfo",GliffyApp.ImageInfoModel);this.createImageUploadButton();$(".gliffy-shape-library-com-gliffy-library-images .gliffy-image-browser-pagination").hide()},__getImportOptions:function(){var a={accountId:GliffyApp.authController.getAccountId()};return{url:window.GLIFFY.API.getActionUrl("upload_image.json",a),allowExtensions:this.allowedUploadExtensions,sizeLimit:1024000,sizeLimitError:"{file} is too large, maximum file size is 1MB.",buttonText:$.i18n._("LIBRARY_MY_IMAGES_BUTTON"),click:function(b){if(!GliffyApp.authController.isAuthenticated()){GliffyApp.loginSignupController.show();return false}else{if(!GliffyApp.authController.canAccountAddImage()){GliffyApp.authController.showUpgradeDialog("storage");return false}}}}},createImageUploadButton:function(){var a=this;GliffyApp.fileUploadController.createFileUploaderButton($(".gliffy-image-browser-image-fineuploader-button"),this.__getImportOptions()).bind("gliffy_fileUploadSuccess",function(c,b){GliffyApp.progressBarController.hide();a.loadImages("");GLIFFY.Utils.analyticsEvent("trackEvent",{category:"imageBrowser",action:"uploadImage",label:b.filename.substring(b.filename.lastIndexOf(".")+1)})}).bind("gliffy_fileUploadError",function(c,b){GliffyApp.progressBarController.hide();GLIFFY.Dialog.showAlertDialog({title:$.i18n._("ERRORHANDLER_ERROR"),content:$.i18n._("online.file.upload.import.error")+" "+b.reason+". "+$.i18n._("online.file.upload.import.error.action"),buttons:[{text:$.i18n._("DIALOG_OK"),primary:true,dismiss:true}]})}).bind("gliffy_fileUploadProgress",function(c,b){GliffyApp.progressBarController.updateProgress(b.currentSize,b.totalSize)}).bind("gliffy_fileUploadStart",function(c,b){GliffyApp.progressBarController.show($.i18n._("online.welcome.importing")+" "+b)});GliffyApp.authController.addLoginCallback(function(){GliffyApp.fileUploadController.updateOptions($(".gliffy-image-browser-image-fineuploader-button"),a.__getImportOptions())})},updateCounter:function(){this._super();$(".gliffy-shape-library-com-gliffy-library-images").parent().css("height","auto")},handleOpenImagesTab:function(){if(!this.imagesLoaded){this.loadImages("")}},isOpen:function(){return $("#gliffy-sidebar-com-gliffy-library-images").hasClass("in")},loadImages:function(b){var a=this,c=$("#gliffy-shape-library-com-gliffy-library-images");this.clearImages();if(GliffyApp.authController.isAuthenticated()){this.showSpinner();window.GLIFFY.API.GET("images_search.json",{query:{accountId:GliffyApp.authController.getAccountId(),imageSize:null,searchTerm:b,searchTag:b},success:function(e,f,d){a.imagesLoaded=true;a.buildImageShapesFromData(e.images);a.bindDragEvents(c);a.hideSpinner();GliffyApp.authController.fetchAccount()},error:function(f,d,e){console.error("error loading gliffy image search list",f,d,e);a.hideSpinner()},context:this})}else{a.buildImageShapesFromData([]);a.bindDragEvents(c)}},clearImages:function(){this.imagesLoaded=false;$("#gliffy-shape-library-images-container").empty()},buildImageShapes:function(a){if(GLIFFY.PLUGINS.pluginManager.isGoogleDriveCurrentDocumentContext()){$("#gliffy-sidebar-com-gliffy-library-images").html("<div>"+$.i18n._("DESKTOP_IMAGES_ADD_INSTR")+"</div>")}else{if(this.isOpen()){this.loadImages("")}}},_buildImageElementFromObject:function(d){var c,b,a;d.thumbnail=window.GLIFFY.API.getAuthUrl(d.thumbnail.url);d.image=d.url;d.useOriginalDimensions=true;c=$('<div class="gliffy-shape-library-com-gliffy-shape-image"><img title="right click to<br/>delete or tag" src="'+d.thumbnail+'"/></div>');b=c.find("img");b.tooltip(GLIFFY.Editor.TOOLTIP_OPTIONS_STANDARD);c.data("params",d);this.createContextMenu(b);return c},updateTotalImagesDisplay:function(){$(".gliffy-image-browser-counter").html($.i18n._("LIBRARY_MY_IMAGES_PAGE",[this.__currentPage,this.__numPages]))},createContextMenu:function(d){var a=this,c,b=[];c=function(e,g){var f={};f[e]=g;b.push(f)};c($.i18n._("online.modal.delete"),{onclick:function(e,f){GLIFFY.Dialog.showYesNoDialog({title:$.i18n._("online.image.delete.title"),content:$.i18n._("online.image.delete.confirm"),cancelCallback:null,buttons:[{text:$.i18n._("DIALOG_NO"),callback:null,primary:false,dismiss:true},{text:$.i18n._("DIALOG_YES"),callback:function(g){a.deleteImage(d.parent())},primary:true,dismiss:true}]})},className:"gliffy-context-menu-item-images"});c($.i18n._("online.image.tag.button"),{onclick:function(e,f){a.showTagImageModal()},className:"gliffy-context-menu-item-images"});c($.i18n._("online.image.info.get"),{onclick:function(e,f){a.showImageInfoModal()},className:"gliffy-context-menu-item-images"});d.contextMenu(b,{theme:GLIFFY.Editor.CONTEXT_MENU_STYLE,shadow:false,className:"gliffy-context-menu-images",beforeShow:function(){if(a.currentContextMenu){a.currentContextMenu.hide()}a.currentContextMenu=this;a.selectedImage=d.parent();a.imageInfo.populate(a.selectedImage.data("params"))}})},showTagImageModal:function(){$("#gliffy-modal-online-tag-image").modal("show");$("#gliffy-image-tag-input").val(this.imageInfo.get("tags"));setTimeout(function(){$("#gliffy-image-tag-input").focus()},100)},handleTag:function(b,a){if(this.validateTagName(b)){this.tagImage(b,a)}},displayTagNameError:function(a){$(".gliffy-tag-name-error").show();$(".gliffy-tag-name-error p").html(a)},validateTagName:function(a){var d="abcdefghijklmnopqrstuvwxyz0123456789@.-_, ",b,c;if(a.replace(" ","")===""){this.displayTagNameError($.i18n._("online.image.tag.blank"));return false}else{for(b=0;b<a.length;b++){c=a.charAt(b).toLowerCase();if(d.indexOf(c)!=-1){continue}this.displayTagNameError($.i18n._("online.image.tag.alphanumeric.only"));return false}}return true},tagImage:function(c,a){var b=this;window.GLIFFY.API.PUT("image/"+this.imageInfo.get("id"),null,{query:{accountId:GliffyApp.authController.getAccountId(),tags:c},success:function(e,g,d){var f=b.selectedImage.data("params");f.tags=c;b.selectedImage.data("params",f);GLIFFY.Utils.analyticsEvent("trackEvent",{category:"imageBrowser",action:"addTags",label:c});a()},error:function(f,d,e){b.displayTagNameError(e);console.error("I borked")},context:this})},showImageInfoModal:function(){$("#gliffy-modal-image-info").modal("show")},deleteImage:function(b){var a=this;window.GLIFFY.API.DELETE("image/"+b.data("params").id,{query:{accountId:GliffyApp.authController.getAccountId()},success:function(d,e,c){b.hide();GliffyApp.authController.fetchAccount()},error:function(e,c,d){a.showErrorDialog(d);console.error("I borked")},context:this})},showErrorDialog:function(a){GLIFFY.Dialog.showAlertDialog({title:$.i18n._("ERRORHANDLER_ERROR"),content:a,buttons:[{text:$.i18n._("DIALOG_OK"),primary:true,dismiss:true}]})},handleSearch:GLIFFY.onlineUtils.requireAuth(function(a){GLIFFY.Utils.analyticsEvent("trackEvent",{category:"imageBrowser",action:"uploadedImageSearch",label:a});this.loadImages(a)}),handleBingSearch:GLIFFY.onlineUtils.requireAuth(function(a){this.externalSearchContainer=$("#gliffy-modal-image-search-results");this.externalSearchContainer.modal("show");this.externalSearchContainer.find("input").val(a);window.GLIFFY.KeyManager.setState("modals");this.doExternalImageSearch(a)}),doExternalImageSearch:function(a){GLIFFY.Utils.analyticsEvent("trackEvent",{category:"imageBrowser",action:"bingSearch",label:a});this.resetExternalImageSearch();this.clearExternalImageSearchContents();if(a.replace(" ","").length>0){this._getResults(a,this.SEARCH_RESULTS_PER_PAGE);$(".gliffy-image-search-enter-search-term").hide();this.externalSearchContainer.find(".gliffy-modal-instr").show()}else{this.hideExternalSearchSpinner()}this.updateExternalImageSearchPaging()},_getResults:function(c,b){var a=this;this.showExternalSearchSpinner();window.GLIFFY.API.GET("images_search.json",{query:{accountId:GliffyApp.authController.getAccountId(),imageSize:null,searchName:c,provider:"bing",pageNumber:this.externalImageSearchPage},success:function(e,f,d){this.clearExternalImageSearchContents();a._buildImageList(e);a.updateExternalImageSearchPaging();a.hideExternalSearchSpinner()},error:function(f,d,e){console.error("error loading external image list",f,d,e);a.hideExternalSearchSpinner();a.showExternalSearchError("There was a problem searching for images.<br/>"+e)},context:this})},_buildImageList:function(f){var c,a=175,j=130,l,d,g,e=this.externalSearchContainer.find(".gliffy-image-search-results"),k,m;for(c=0;c<f.images.length;c++){var b=f.images[c];k=$('<div class="gliffy-image-search-result"></div>');k.data("params",b);l=b.thumbnail.width;d=b.thumbnail.height;if(l>d){g=a/l;l=a;d=d*g}if(d>j){g=j/d;d=j;l=l*g}m=b.width+" x "+b.height+"<br/>Click to add<br/>to My Images";k.append('<img width="'+l+'" height="'+d+'" src="'+b.thumbnail.url+'" + title="'+m+'" />');e.append(k)}this.set("externalImageSearchResults",f.totalCount);if(f.totalCount>f.images.length){$("#gliffy-modal-image-search-results .gliffy-image-browser-pagination").show()}else{$("#gliffy-modal-image-search-results .gliffy-image-browser-pagination").hide()}setTimeout(function(){$(".gliffy-image-search-result img").tooltip(GLIFFY.Editor.TOOLTIP_OPTIONS_STANDARD)},500)},resetExternalImageSearch:function(){this.set("externalImageSearchPage",1);this.updateExternalImageSearchPaging();$(".gliffy-image-search-enter-search-term").show();this.externalSearchContainer.find(".gliffy-modal-instr").hide()},clearExternalImageSearchContents:function(){this.externalSearchContainer.find(".gliffy-image-search-results").empty();this.hideExternalSearchError()},addExternalImage:GLIFFY.onlineUtils.requireAuth(function(b){var a=this;a.showExternalSearchSpinner();GLIFFY.API.POST("upload_image_url.json",{url:b.url},{query:{accountId:GliffyApp.authController.getAccountId()},success:function(c){a.hideExternalSearchSpinner();if(c.success===false||c.success==="false"){a.showExternalSearchError("There was a problem uploading your image.<br/>"+c.error)}else{a.externalSearchContainer.modal("hide");a.loadImages("");GLIFFY.Utils.analyticsEvent("trackEvent",{category:"imageBrowser",action:"uploadSearchedImage",label:"bing"})}},error:function(e,c,d){a.hideExternalSearchSpinner();a.showExternalSearchError("There was a problem uploading your image.<br/>"+d)}})}),updateExternalImageSearchPaging:function(){var b=this.externalSearchContainer.find(".gliffy-pager-previous-btn"),a=this.externalSearchContainer.find(".gliffy-pager-next-btn");b.removeClass("disabled");a.removeClass("disabled");if(this.get("externalImageSearchPage")===1){this.externalSearchContainer.find(".gliffy-pager-previous-btn").addClass("disabled")}if(this.get("externalImageSearchPage")*this.SEARCH_RESULTS_PER_PAGE>this.externalImageSearchResults){this.externalSearchContainer.find(".gliffy-pager-next-btn").addClass("disabled")}},handleExternalPageNext:function(){if(this.get("externalImageSearchPage")*this.SEARCH_RESULTS_PER_PAGE<this.externalImageSearchResults){this.set("externalImageSearchPage",this.get("externalImageSearchPage")+1);this.updateExternalImageSearchPaging();this._getResults(this.externalSearchContainer.find("input").val(),this.SEARCH_RESULTS_PER_PAGE)}},handleExternalPagePrevious:function(){if(this.get("externalImageSearchPage")>1){this.set("externalImageSearchPage",this.get("externalImageSearchPage")-1);this.updateExternalImageSearchPaging();this._getResults(this.externalSearchContainer.find("input").val(),this.SEARCH_RESULTS_PER_PAGE)}},showExternalSearchError:function(b){var a=this.externalSearchContainer.find(".alert");a.show();a.find("span").html(b)},hideExternalSearchError:function(){this.externalSearchContainer.find(".alert").hide()},showSpinner:function(){$("#gliffy-shape-library-com-gliffy-library-images .gliffy-inner-spinner-icon").show()},hideSpinner:function(){$("#gliffy-shape-library-com-gliffy-library-images .gliffy-inner-spinner-icon").hide()},showExternalSearchSpinner:function(){this.externalSearchContainer.find(".gliffy-modal-ui-blocker").show()},hideExternalSearchSpinner:function(){this.externalSearchContainer.find(".gliffy-modal-ui-blocker").hide()},bingImageSearchJSONStub:{images:[{title:"File:Pug portrait.jpg - Wikipedia, the free encyclopedia",url:"http://upload.wikimedia.org/wikipedia/commons/7/7f/Pug_portrait.jpg",size:4530892,width:3888,height:2592,thumbnail:{url:"http://ts3.mm.bing.net/th?id=H.4552073504687978&amp;pid=15.1",size:6990,width:300,height:200}},{title:"Versione ad alta risoluzione ? (2 400 × 1 600 pixel, dimensione ...",url:"http://upload.wikimedia.org/wikipedia/commons/d/d7/Sad-pug.jpg",size:286029,width:2400,height:1600,thumbnail:{url:"http://ts3.mm.bing.net/th?id=H.4587219186942282&amp;pid=15.1",size:7953,width:200,height:300}},{title:"File:Pug portrait.jpg - Wikipedia, the free encyclopedia",url:"http://upload.wikimedia.org/wikipedia/commons/7/7f/Pug_portrait.jpg",size:4530892,width:3888,height:2592,thumbnail:{url:"http://ts3.mm.bing.net/th?id=H.4552073504687978&amp;pid=15.1",size:6990,width:300,height:200}},{title:"Versione ad alta risoluzione ? (2 400 × 1 600 pixel, dimensione ...",url:"http://upload.wikimedia.org/wikipedia/commons/d/d7/Sad-pug.jpg",size:286029,width:2400,height:1600,thumbnail:{url:"http://ts3.mm.bing.net/th?id=H.4587219186942282&amp;pid=15.1",size:7953,width:300,height:200}},{title:"File:Pug portrait.jpg - Wikipedia, the free encyclopedia",url:"http://upload.wikimedia.org/wikipedia/commons/7/7f/Pug_portrait.jpg",size:4530892,width:3888,height:2592,thumbnail:{url:"http://ts3.mm.bing.net/th?id=H.4552073504687978&amp;pid=15.1",size:6990,width:300,height:200}},{title:"Versione ad alta risoluzione ? (2 400 × 1 600 pixel, dimensione ...",url:"http://upload.wikimedia.org/wikipedia/commons/d/d7/Sad-pug.jpg",size:286029,width:2400,height:1600,thumbnail:{url:"http://ts3.mm.bing.net/th?id=H.4587219186942282&amp;pid=15.1",size:7953,width:300,height:200}},{title:"File:Pug portrait.jpg - Wikipedia, the free encyclopedia",url:"http://upload.wikimedia.org/wikipedia/commons/7/7f/Pug_portrait.jpg",size:4530892,width:3888,height:2592,thumbnail:{url:"http://ts3.mm.bing.net/th?id=H.4552073504687978&amp;pid=15.1",size:6990,width:200,height:300}},{title:"Versione ad alta risoluzione ? (2 400 × 1 600 pixel, dimensione ...",url:"http://upload.wikimedia.org/wikipedia/commons/d/d7/Sad-pug.jpg",size:286029,width:2400,height:1600,thumbnail:{url:"http://ts3.mm.bing.net/th?id=H.4587219186942282&amp;pid=15.1",size:7953,width:300,height:200}},{title:"File:Pug portrait.jpg - Wikipedia, the free encyclopedia",url:"http://upload.wikimedia.org/wikipedia/commons/7/7f/Pug_portrait.jpg",size:4530892,width:3888,height:2592,thumbnail:{url:"http://ts3.mm.bing.net/th?id=H.4552073504687978&amp;pid=15.1",size:6990,width:300,height:200}},{title:"Versione ad alta risoluzione ? (2 400 × 1 600 pixel, dimensione ...",url:"http://upload.wikimedia.org/wikipedia/commons/d/d7/Sad-pug.jpg",size:286029,width:2400,height:1600,thumbnail:{url:"http://ts3.mm.bing.net/th?id=H.4587219186942282&amp;pid=15.1",size:7953,width:300,height:200}},{title:"File:Pug portrait.jpg - Wikipedia, the free encyclopedia",url:"http://upload.wikimedia.org/wikipedia/commons/7/7f/Pug_portrait.jpg",size:4530892,width:3888,height:2592,thumbnail:{url:"http://ts3.mm.bing.net/th?id=H.4552073504687978&amp;pid=15.1",size:6990,width:300,height:200}},{title:"Versione ad alta risoluzione ? (2 400 × 1 600 pixel, dimensione ...",url:"http://upload.wikimedia.org/wikipedia/commons/d/d7/Sad-pug.jpg",size:286029,width:2400,height:1600,thumbnail:{url:"http://ts3.mm.bing.net/th?id=H.4587219186942282&amp;pid=15.1",size:7953,width:300,height:200}},{title:"File:Pug portrait.jpg - Wikipedia, the free encyclopedia",url:"http://upload.wikimedia.org/wikipedia/commons/7/7f/Pug_portrait.jpg",size:4530892,width:3888,height:2592,thumbnail:{url:"http://ts3.mm.bing.net/th?id=H.4552073504687978&amp;pid=15.1",size:6990,width:300,height:200}},{title:"Versione ad alta risoluzione ? (2 400 × 1 600 pixel, dimensione ...",url:"http://upload.wikimedia.org/wikipedia/commons/d/d7/Sad-pug.jpg",size:286029,width:2400,height:1600,thumbnail:{url:"http://ts3.mm.bing.net/th?id=H.4587219186942282&amp;pid=15.1",size:7953,width:300,height:200}},{title:"File:Pug portrait.jpg - Wikipedia, the free encyclopedia",url:"http://upload.wikimedia.org/wikipedia/commons/7/7f/Pug_portrait.jpg",size:4530892,width:3888,height:2592,thumbnail:{url:"http://ts3.mm.bing.net/th?id=H.4552073504687978&amp;pid=15.1",size:6990,width:300,height:200}},{title:"Versione ad alta risoluzione ? (2 400 × 1 600 pixel, dimensione ...",url:"http://upload.wikimedia.org/wikipedia/commons/d/d7/Sad-pug.jpg",size:286029,width:2400,height:1600,thumbnail:{url:"http://ts3.mm.bing.net/th?id=H.4587219186942282&amp;pid=15.1",size:7953,width:300,height:200}},{title:"File:Pug portrait.jpg - Wikipedia, the free encyclopedia",url:"http://upload.wikimedia.org/wikipedia/commons/7/7f/Pug_portrait.jpg",size:4530892,width:3888,height:2592,thumbnail:{url:"http://ts3.mm.bing.net/th?id=H.4552073504687978&amp;pid=15.1",size:6990,width:300,height:200}},{title:"Versione ad alta risoluzione ? (2 400 × 1 600 pixel, dimensione ...",url:"http://upload.wikimedia.org/wikipedia/commons/d/d7/Sad-pug.jpg",size:286029,width:2400,height:1600,thumbnail:{url:"http://ts3.mm.bing.net/th?id=H.4587219186942282&amp;pid=15.1",size:7953,width:300,height:200}},{title:"File:Pug portrait.jpg - Wikipedia, the free encyclopedia",url:"http://upload.wikimedia.org/wikipedia/commons/7/7f/Pug_portrait.jpg",size:4530892,width:3888,height:2592,thumbnail:{url:"http://ts3.mm.bing.net/th?id=H.4552073504687978&amp;pid=15.1",size:6990,width:300,height:200}},{title:"Versione ad alta risoluzione ? (2 400 × 1 600 pixel, dimensione ...",url:"http://upload.wikimedia.org/wikipedia/commons/d/d7/Sad-pug.jpg",size:286029,width:2400,height:1600,thumbnail:{url:"http://ts3.mm.bing.net/th?id=H.4587219186942282&amp;pid=15.1",size:7953,width:300,height:200}}]}});GliffyApp.imageBrowserController=GliffyApp.OnlineImageBrowserController.create()}());(function(){GLIFFY.Plugins.create({activate:function(a){},createPanel:function(e,c,f,d){var b=$.Deferred(),a;GliffyApp.imageBrowserController.setEditor(e);GliffyApp.imageBrowserController.openOnInit=f;a=GliffyApp.OnlineImageBrowserView.create({openOnInit:f});return b.resolve(a)},initTemplates:function(){},getTemplateNames:function(){return["gliffy-online-image-browser-template"]},getName:function(){return"ShapeLibraryImagePanel"}})}())}());