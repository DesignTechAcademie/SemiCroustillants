var module$main={};
GliffyApp.ApplicationController.reopen(GliffyApp.require("ember-sharing/mixins/share-actions"),{commentSidebarRetracted:true,diagramIsSavedInternally:false,diagramIsSavedExternally:false,commentSidebarVisible:Ember.computed("features.commentingPermitted","commentsExist","diagramIsSavedInternally",function(){return this.get("diagramIsSavedInternally")&&(this.get("features.commentingPermitted")||this.get("commentsExist"))}),hasBeenSavedDuringThisSession:false,shareModalVisible:false,shareModel:null,
canAccountUseShare:false,canAccountUseShareEdit:false,isPublic:false,accountId:null,eventHub:Ember.inject.service(),init:function(){var self=this;this._super();this.set("accountId",GliffyApp.authController.getAccountId());if(window.GLIFFY.ENV.diagramId){this.set("diagramId",window.GLIFFY.ENV.diagramId);this.set("shareModel",this.get("store").queryRecord("share",{diagramId:this.get("diagramId")}))}Ember.run.scheduleOnce("afterRender",function(){self.refreshState();$(window).on("gliffy-editor-save-complete",
function(event,data){if(GLIFFY.PLUGINS.pluginManager.isCurrentDocumentContext("gliffyDrivePlugin")&&data.id){window.GLIFFY.ENV.diagramId=data.id;self.set("diagramId",window.GLIFFY.ENV.diagramId);if(self.features.get("sharingSupported"))self.set("shareModel",self.get("store").queryRecord("share",{diagramId:self.get("diagramId")}))}else{delete window.GLIFFY.ENV.diagramId;delete window.GLIFFY.ENV.diagramHash}self.set("hasBeenSavedDuringThisSession",true);self.refreshState()});$(window).on("gliffy-editor-open-document",
function(event,data){self.set("commentSidebarRetracted",true);self.refreshState();if(self.features.get("commentingSupported")&&!window.GLIFFY.ENV.diagramId){var firstDiagramIdChar=data.url?data.url.indexOf("diagramId\x3d")+10:-1;if(firstDiagramIdChar>=0){window.GLIFFY.ENV.diagramId=Number(data.url.slice(firstDiagramIdChar));if(window.GLIFFY.ENV.diagramId){self.set("diagramId",window.GLIFFY.ENV.diagramId);if(self.features.get("sharingSupported"))self.set("shareModel",self.get("store").queryRecord("share",
{diagramId:self.get("diagramId")}));self.getDiagramHashAndInfo(false)}}}});self.get("eventHub").on("showShareModal",self.showShareModal.bind(self));self.get("eventHub").on("showCollaborateModal",self.showCollaborateModal.bind(self));GliffyApp.authController.addLoginCallback(self.refreshState.bind(self));GliffyApp.authController.addLoginCallback(function(){if(window.GLIFFY.ENV.diagramHash)self.updateModel(window.GLIFFY.ENV.diagramHash)})});$(window).on("gliffy.authController.accountLoadedEvent",function(){self.features.setGopFeatures()})},
refreshState:function(){var usingGliffyDrive=GLIFFY.PLUGINS.pluginManager.isCurrentDocumentContext("gliffyDrivePlugin");if(!usingGliffyDrive){delete window.GLIFFY.ENV.diagramId;delete window.GLIFFY.ENV.diagramHash}var hasGliffyDiagramId=!!window.GLIFFY.ENV.diagramId;var saveHasOccurred=!!window.GLIFFY.ENV.openUrl||this.get("hasBeenSavedDuringThisSession");this.features.setGopFeatures();this.set("diagramIsSavedInternally",usingGliffyDrive&&hasGliffyDiagramId);this.set("diagramIsSavedExternally",!usingGliffyDrive&&
saveHasOccurred)},updateModel:function(diagramHash){var self=this;return self.get("diagramInfo").loadDiagramAndComments(diagramHash,self.store).then(function(threads){self.initializeThreads(self.getId(),threads)})},getDiagramHashAndInfo:function(expandSidebar){var self=this;if(!window.GLIFFY.ENV.diagramId)return;$.ajax({method:"POST",url:"/go/api/commenting/v1/diagram/"+window.GLIFFY.ENV.diagramId+"/urlHash",dataType:"json",success:function(response){window.GLIFFY.ENV.diagramHash=response.urlHash;
self.updateModel(window.GLIFFY.ENV.diagramHash).then(function(){self.set("commentSidebarRetracted",!(self.get("commentSidebarVisible")&&expandSidebar))});self.refreshState()},error:function(response){self.set("commentSidebarRetracted",true);self.refreshState();GLIFFY.Dialog.showAlertDialog({title:$.i18n._("commenting.comments"),buttons:[{text:$.i18n._("online.modal.close.cap"),primary:true,dismiss:true}]})}})},showUnsavedDialog:function(){this.get("analytics").event("trackEvent",{category:"commenting",
action:"showUnsavedDialog"});GLIFFY.Dialog.showAlertDialog({title:$.i18n._("commenting.comments"),content:$.i18n._("commenting.requires.save"),buttons:[{text:$.i18n._("online.modal.close.cap"),primary:false,dismiss:true},{text:$.i18n._("commenting.save"),primary:true,dismiss:true,callback:function(){GliffyApp.toolbarController.doSave()}}]})},showUnsavedDialogForSharing:function(){this.get("analytics").event("trackEvent",{category:"commenting",action:"showUnsavedDialog"});GLIFFY.Dialog.showAlertDialog({title:"Sharing",
content:"Please save the diagram in Gliffy to share with your collaborators.",buttons:[{text:$.i18n._("online.modal.close.cap"),primary:false,dismiss:true},{text:$.i18n._("commenting.save"),primary:true,dismiss:true,callback:function(){GliffyApp.toolbarController.doSave()}}]})},showGdriveDialog:function(){this.get("analytics").event("trackEvent",{category:"commenting",action:"showGdriveDialog"});GLIFFY.Dialog.showAlertDialog({title:$.i18n._("commenting.comments"),content:$.i18n._("commenting.gdrive.unsupported"),
buttons:[{text:$.i18n._("online.modal.close.cap"),primary:true,dismiss:true}]})},showGdriveDialogForSharing:function(){this.get("analytics").event("trackEvent",{category:"sharing",action:"showGdriveDialogForSharing"});GLIFFY.Dialog.showAlertDialog({title:"Sharing",content:"Sharing is not available for diagrams saved in Google Drive. Please save the diagram in Gliffy to share with your collaborators, or share this diagram through Google Drive",buttons:[{text:$.i18n._("online.modal.close.cap"),primary:true,
dismiss:true}]})},showUpgradeDialog:function(commentsExist){this.get("analytics").event("trackEvent",{category:"commenting",action:"showUpgradeDialog"});this.showModal("ineligible-for-comment-modal")},confirmEmailAndShare:function(){if(GLIFFY.PLUGINS.pluginManager.isCurrentDocumentContext("gliffyDrivePlugin")&&!!GLIFFY.ENV.diagramId){this.set("canAccountUseShare",this.features.get("sharingPermitted"));this.set("canAccountUseShareEdit",this.features.get("sharingEditPermitted"));this.set("shareModalVisible",
true);this.set("isPublic",GliffyApp.documentModel.isPublic)}else if(GLIFFY.PLUGINS.pluginManager.isCurrentDocumentContext("googleDrivePlugin"))this.showGdriveDialogForSharing();else this.showUnsavedDialogForSharing()},showShareModal:function(){GliffyApp.authController.requireEmailVerification(this.confirmEmailAndShare.bind(this));this.get("analytics").event("trackEvent",{category:"share",action:"toolbar-share"})},showCollaborateModal:function(){if(this.features.get("sharingSupported")){this.showShareModal();
if(this.get("shareModalVisible"))this.send("manageCollaborators")}else window.GLIFFY.toolbarController.doCollaborate()},showCommentSidebar:function(){var self=this;if(self.get("diagramInfo.diagramId"))self.set("commentSidebarRetracted",false);else self.updateModel(window.GLIFFY.ENV.diagramHash).then(function(){self.set("commentSidebarRetracted",false)})},actions:{commentsButtonClicked:function(){this.get("analytics").event("trackEvent",{category:"commenting",action:"commentsButton"});if(this.get("commentSidebarRetracted"))if(!this.features.get("commentingPermitted"))if(GliffyApp.authController.get("isLoggedIn")){var threadsExist=
this.get("activeThreads.length")>0||this.get("archivedThreads.length")>0;this.showUpgradeDialog(threadsExist);if(threadsExist)this.showCommentSidebar()}else GliffyApp.loginSignupController.signupLinkClick();else if(this.get("diagramIsSavedInternally"))if(!window.GLIFFY.ENV.diagramHash)this.getDiagramHashAndInfo(true);else this.showCommentSidebar();else if(this.get("diagramIsSavedExternally"))this.showGdriveDialog();else this.showUnsavedDialog();else this.set("commentSidebarRetracted",true)},shareButtonClicked:function(){this.showShareModal()},
collaborate:function(){this.showCollaborateModal()}}});GliffyApp.ApplicationAdapter.reopen({namespace:"/go/api/commenting/v1"});
GliffyApp.ApplicationRoute.reopen({init:function(){this._super();this.features.setGopFeatures=function(){this.addFlags({sharingSupported:GliffyApp.authController.canAccountViewShare(),sharingPermitted:GliffyApp.authController.canAccountViewShare()&&GliffyApp.authController.canAccountUseShare(),sharingEditPermitted:GliffyApp.authController.canAccountViewShare()&&GliffyApp.authController.canAccountUseShareEdit(),commentingSupported:GliffyApp.authController.canAccountViewComment(),commentingPermitted:GliffyApp.authController.canAccountViewComment()&&
GliffyApp.authController.canAccountUseComment()})};this.features.setGopFeatures()},model:function(params){if(!this.features.get("commentingSupported")||!window.GLIFFY.ENV.diagramHash||!GLIFFY.PLUGINS.pluginManager.isCurrentDocumentContext("gliffyDrivePlugin"))return Ember.A([]);return this.get("diagramInfo").loadDiagramAndComments(window.GLIFFY.ENV.diagramHash,this.store)}});
(function(){GliffyApp.features=GLIFFY.FEATURES;GliffyApp.plugins=GLIFFY.PLUGINS;Ember.Application.initializer({name:"registerGlobalClassesGop",before:"registerGlobalClasses",initialize:function(registry,application){application.register("view:share-menu-view",GliffyApp.ShareMenuView);application.register("view:account-upgrade-business-team-deal-view",GliffyApp.AccountUpgradeBusinessTeamDealView);application.register("view:account-upgrade-simplified-pricing-pages-view",GliffyApp.AccountUpgradeSimplifiedPricingPagesView);
application.register("view:account-user-additional-info-view",GliffyApp.AccountUserAdditionalInfoView);application.register("view:explicit-onboarding-steps-view",GliffyApp.ExplicitOnboardingStepsView);application.register("view:final-view",GliffyApp.FinalView);application.register("view:share-the-gliffy-love-view",GliffyApp.ShareTheGliffyLoveView);application.register("view:account-folders-view",GliffyApp.AccountFoldersView);application.register("view:account-manage-modal-view",GliffyApp.AccountManageModalView);
application.register("view:account-menu-view",GliffyApp.AccountMenuView);application.register("view:account-manager-button-view",GliffyApp.AccountManagerButtonView);application.register("view:account-switch-view",GliffyApp.AccountSwitchView);application.register("view:account-upgrade-purchase-view",GliffyApp.AccountUpgradePurchaseView);application.register("view:account-upgrade-purchase-modal-view",GliffyApp.AccountUpgradePurchaseModalView);application.register("view:authorize-g-drive-view",GliffyApp.AuthorizeGDriveView);
application.register("view:banner-view",GliffyApp.BannerView);application.register("view:collaboration-modal-view",GliffyApp.CollaborationModalView);application.register("view:collaborator-list-item-experiment-add-to-team-account-view",GliffyApp.CollaboratorListItemExperimentAddToTeamAccountView);application.register("view:collaborator-list-item-view",GliffyApp.CollaboratorListItemView);application.register("view:document-list-item-view",GliffyApp.DocumentListItemView);application.register("view:document-list-view",
GliffyApp.DocumentListView);application.register("view:document-search-text-field",GliffyApp.DocumentSearchTextField);application.register("view:document-search-view",GliffyApp.DocumentSearchView);application.register("view:document-sort-view",GliffyApp.DocumentSortView);application.register("view:expiration-notice-view",GliffyApp.ExpirationNoticeView);application.register("view:feedback-modal-view",GliffyApp.FeedbackModalView);application.register("view:file-menu-view",GliffyApp.FileMenuView);application.register("view:file-open-browser-view",
GliffyApp.FileOpenBrowserView);application.register("view:folder-create-modal-view",GliffyApp.FolderCreateModalView);application.register("view:folder-permissions-modal-view",GliffyApp.FolderPermissionsModalView);application.register("view:header-view",GliffyApp.HeaderView);application.register("view:help-menu-customer-support-view",GliffyApp.HelpMenuCustomerSupportView);application.register("view:help-menu-send-feedback-view",GliffyApp.HelpMenuSendFeedbackView);application.register("view:image-info-view",
GliffyApp.ImageInfoView);application.register("view:image-search-results-modal-view",GliffyApp.ImageSearchResultsModalView);application.register("view:login-signup-modal-view",GliffyApp.LoginSignupModalView);application.register("view:login-view",GliffyApp.LoginView);application.register("view:manage-users-view",GliffyApp.ManageUsersView);application.register("view:modal-alert-view",GliffyApp.ModalAlertView);application.register("view:open-from-view",GliffyApp.OpenFromView);application.register("view:publish-modal-view",
GliffyApp.PublishModalView);application.register("view:rename-modal-view",GliffyApp.RenameModalView);application.register("view:save-as-override-view",GliffyApp.SaveAsOverrideView);application.register("view:save-before-google-drive-open-view",GliffyApp.SaveBeforeGoogleDriveOpenView);application.register("view:save-modal-view",GliffyApp.SaveModalView);application.register("view:share-menu-view",GliffyApp.ShareMenuView);application.register("view:signup-view",GliffyApp.SignupView);application.register("view:tag-image-modal-view",
GliffyApp.TagImageModalView);application.register("view:template-browser-view",GliffyApp.TemplateBrowserView);application.register("view:temp-password-view",GliffyApp.TempPasswordView);application.register("view:trial-signup-invite-modal-view",GliffyApp.TrialSignupInviteModalView);application.register("view:trial-team-invite-modal-view",GliffyApp.TrialTeamInviteModalView);application.register("view:user-list-item-view",GliffyApp.UserListItemView);application.register("view:verify-email-view",GliffyApp.VerifyEmailView);
application.register("view:welcome-screen-document-list-item-view",GliffyApp.WelcomeScreenDocumentListItemView);application.register("view:welcome-screen-view",GliffyApp.WelcomeScreenView);application.register("view:welcome-screen-template-view",GliffyApp.WelcomeScreenTemplateView);application.register("view:mind-map-tab-view",GliffyApp.MindMapTabView);application.register("view:network-rack-tab-view",GliffyApp.NetworkRackTabView);application.register("view:opacity-widget-view",GliffyApp.OpacityWidgetView);
application.register("view:popup-notes-button-view",GliffyApp.PopupNotesButtonView);application.register("view:popup-notes-dialog-view",GliffyApp.PopupNotesDialogView);application.register("view:print-view",GliffyApp.PrintView);application.register("view:selected-tab-view",GliffyApp.SelectedTabView);application.register("view:selected-tab-view-v2",GliffyApp.SelectedTabViewV2);application.register("view:shape-library-custom-panel-delete-modal-view",GliffyApp.ShapeLibraryCustomPanelDeleteModalView);
application.register("view:shape-library-custom-panel-view",GliffyApp.ShapeLibraryCustomPanelView);application.register("view:image-panel-view",GliffyApp.ImagePanelView);application.register("view:shape-library-panel-view",GliffyApp.ShapeLibraryPanelView);application.register("view:swimlane-tab-view",GliffyApp.SwimlaneTabView);application.register("view:tables-tab-view",GliffyApp.TablesTabView);application.register("view:enhanced-team-invite-modal-view",GliffyApp.EnhancedTeamInviteModalView);application.register("view:enhanced-login-signup-modal-view",
GliffyApp.EnhancedLoginSignupModalView);application.register("view:account-editor-purchase-page-view",GliffyApp.AccountEditorPurchasePageView);application.register("view:account-editor-stripe-purchase-page-view",GliffyApp.AccountEditorStripePurchasePageView);application.register("view:enhanced-modal-view",GliffyApp.EnhancedModalView);application.register("view:font-loader-view",GliffyApp.FontLoaderView);application.register("view:enhanced-login-signup-modal-view",GliffyApp.EnhancedLoginSignupModalView);
application.register("view:enhanced-team-invite-modal-view",GliffyApp.EnhancedTeamInviteModalView);application.register("view:font-loader-view",GliffyApp.FontLoaderView);application.register("service:analytics-gop",GliffyApp.require("ember-common/services/analytics-gop"));application.inject("controller","analytics","service:analytics-gop");application.inject("component","analytics","service:analytics-gop");application.register("model:share",GliffyApp.require("ember-sharing/models/share"));application.register("model:collab",
GliffyApp.require("ember-sharing/models/collab"));application.register("serializer:share",GliffyApp.require("ember-sharing/serializers/share"));application.register("adapter:share",GliffyApp.require("ember-sharing/adapters/share"));application.register("adapter:collab",GliffyApp.require("ember-sharing/adapters/collab"))}});Ember.Application.instanceInitializer({name:"registerGlobalInstancesGop",before:"registerGlobalInstances",initialize:function(instance){function registerGlobalAsService(id,global){if(global!=
null){var serviceId="services:"+id;instance.registry.register(serviceId,global,{instantiate:false,singleton:true});instance.registry.injection("controller",id,serviceId)}else console.log("Null global registered: "+id)}registerGlobalAsService("authController",GliffyApp.authController);registerGlobalAsService("documentModel",GliffyApp.documentModel);registerGlobalAsService("templateBrowserController",GliffyApp.templateBrowserController);registerGlobalAsService("collaborationController",GliffyApp.collaborationController);
registerGlobalAsService("verifyEmailController",GliffyApp.verifyEmailController);registerGlobalAsService("accountSwitchController",GliffyApp.accountSwitchController);registerGlobalAsService("publishController",GliffyApp.publishController);registerGlobalAsService("detailedPurchasePageRedirectController",GliffyApp.detailedPurchasePageRedirectController);registerGlobalAsService("accountUpgradePurchaseController",GliffyApp.accountUpgradePurchaseController);registerGlobalAsService("expirationNoticeController",
GliffyApp.expirationNoticeController);registerGlobalAsService("apiEditorController",GliffyApp.apiEditorController);registerGlobalAsService("trialTeamInviteModalController",GliffyApp.trialTeamInviteModalController);registerGlobalAsService("accountExpireBusinessTeamDealController",GliffyApp.accountExpireBusinessTeamDealController);registerGlobalAsService("accountExpireSimplifiedPricingPagesController",GliffyApp.accountExpireSimplifiedPricingPagesController);registerGlobalAsService("accountUpgradeBusinessTeamDealController",
GliffyApp.accountUpgradeBusinessTeamDealController);registerGlobalAsService("accountUpgradeSimplifiedPricingPagesController",GliffyApp.accountUpgradeSimplifiedPricingPagesController);registerGlobalAsService("accountFoldersController",GliffyApp.accountFoldersController);registerGlobalAsService("accountManageController",GliffyApp.accountManageController);registerGlobalAsService("authController",GliffyApp.authController);registerGlobalAsService("bannerController",GliffyApp.bannerController);registerGlobalAsService("documentSortController",
GliffyApp.documentSortController);registerGlobalAsService("feedbackController",GliffyApp.feedbackController);registerGlobalAsService("gdriveConnectedModalController",GliffyApp.gdriveConnectedModalController);registerGlobalAsService("googleDriveController",GliffyApp.googleDriveController);registerGlobalAsService("loginSignupController",GliffyApp.loginSignupController);registerGlobalAsService("loginWelcomeController",GliffyApp.loginWelcomeController);registerGlobalAsService("trialSignupInviteModalController",
GliffyApp.trialSignupInviteModalController);registerGlobalAsService("welcomeScreenController",GliffyApp.welcomeScreenController);registerGlobalAsService("toolbarController",GliffyApp.toolbarController);registerGlobalAsService("saveDialogController",GliffyApp.saveDialogController);registerGlobalAsService("fileOpenBrowserController",GliffyApp.fileOpenBrowserController);registerGlobalAsService("imageBrowserController",GliffyApp.imageBrowserController);registerGlobalAsService("enhancedTeamInviteModalController",
GliffyApp.enhancedTeamInviteModalController);registerGlobalAsService("enhancedLoginSignupModalController",GliffyApp.enhancedLoginSignupModalController);registerGlobalAsService("enhancedModalController",GliffyApp.enhancedModalController);registerGlobalAsService("accountUserAdditionalInfoController",GliffyApp.accountUserAdditionalInfoController);registerGlobalAsService("accountEditorPurchasePageController",GliffyApp.accountEditorPurchasePageController);registerGlobalAsService("accountEditorStripePurchasePageController",
GliffyApp.accountEditorStripePurchasePageController)}});GliffyApp.instanceInitializer(GliffyApp.require("ember-common/instance-initializers/features")["default"])})();
GliffyApp.initGliffyEditor=function(){function logInitAnalyticsEvents(){GLIFFY.Utils.analyticsEvent("trackEvent",{category:"time",action:"startup",value:((new Date).getTime()-window.GLIFFY.startTime)/1E3,non_interaction:true});var allowedCategories=["collaborate"];var url;if(window.GLIFFY.ENV.gaCategoryOnInit&&window.GLIFFY.ENV.gaCategoryOnInit!==""&&window.GLIFFY.ENV.gaActionOnInit&&window.GLIFFY.ENV.gaActionOnInit!==""){if(allowedCategories.indexOf(window.GLIFFY.ENV.gaCategoryOnInit)>-1)GLIFFY.Utils.analyticsEvent("trackEvent",
{category:window.GLIFFY.ENV.gaCategoryOnInit,action:window.GLIFFY.ENV.gaActionOnInit});else console.warn("eventCategory parameter not allowed!");url=GLIFFY.onlineUtils.updateQueryString("eventCategory",null,window.location.toString());url=GLIFFY.onlineUtils.updateQueryString("eventAction",null,url);GLIFFY.onlineUtils.setLocation(url)}}var tips;var editor;var windowHasFocus=true;GLIFFY.Renderer.StageSingleCanvas.prototype.boundingBoxFit=true;if(GLIFFY.ENV.documentManagerUrl)GliffyApp.authController.addLoginCallback(function(){GLIFFY.ENV.documentManagerUrl=
GLIFFY.API.reauthUrl(GLIFFY.ENV.documentManagerUrl)});if(GLIFFY.ENV.newDiagramUrl)GliffyApp.authController.addLoginCallback(function(){GLIFFY.ENV.newDiagramUrl=GLIFFY.API.reauthUrl(GLIFFY.ENV.newDiagramUrl)});$("#gliffy-anchor-feedback").remove();tips=[{"title":$.i18n._("TIP_TITLE0"),"content":$.i18n._("TIP_CONTENT0"),"image":"../images/gif/tips/drag-and-drop.gif"},{"title":$.i18n._("TIP_TITLE1"),"content":$.i18n._("TIP_CONTENT1"),"image":"../images/gif/tips/connectors.gif"},{"title":$.i18n._("TIP_TITLE2"),
"content":$.i18n._("TIP_CONTENT2"),"image":"../images/gif/tips/text.gif"},{"title":$.i18n._("TIP_TITLE3"),"content":$.i18n._("TIP_CONTENT3"),"image":"../images/gif/tips/style.gif"},{"title":$.i18n._("TIP_TITLE4"),"content":$.i18n._("TIP_CONTENT4"),"image":"../images/gif/tips/connector-style.gif"},{"title":$.i18n._("online.tips.title.storage"),"content":$.i18n._("online.tips.content.storage"),"image":"../assets/images/gdrive-integration.png"},{"title":$.i18n._("TIP_TITLE5"),"content":$.i18n._("TIP_CONTENT5"),
"image":"../images/gif/tips/dragndrop_images.gif"},{"title":$.i18n._("TIP_TITLE6"),"content":$.i18n._("TIP_CONTENT6"),"image":"../images/gif/tips/drawing-guides.gif"}];editor=new window.GLIFFY.Editor({draftManagerConfig:window.GLIFFY.ONLINE.INTEGRATION.draftStorageManager,customShapeLibraryManager:GLIFFY.ONLINE.INTEGRATION.customShapeLibraryManager,editorUiObserver:GLIFFY.ONLINE.INTEGRATION.editorUiObserver,diagramManager:GLIFFY.ONLINE.INTEGRATION.diagramManager,shapeLibraryObserver:GLIFFY.ONLINE.INTEGRATION.shapeLibraryObserver,
printOptionsStorage:GLIFFY.ONLINE.INTEGRATION.printOptionsStorage,imageManager:GLIFFY.ONLINE.INTEGRATION.imageManager,target:$("#container"),tips:tips,rootServiceUrl:window.GLIFFY.API.getApiRoot().replace(/\/$/,""),rootResourceUrl:"/legal/terms-of-use/#",productVersion:"Online-"+window.GLIFFY.ENV.productVersion,analyticsEnabled:true,enableGoogleTagManager:true,analyticsAccount:window.GLIFFY.ENV.isProduction?"UA-248648-1":"UA-248648-12",analyticsProduct:"Online",analyticsLicense:GliffyApp.authController.getProductType(),
newDiagramPanels:null,language:window.GLIFFY.ENV.language});fileImportHandler=function(){var importAction=GLIFFY.FEATURES.browserTabs?"upload_file.json?accountId\x3d"+GliffyApp.authController.getAccountId():"import_file.json";importOptions={url:window.GLIFFY.API.getActionUrl(importAction,null),allowExtensions:[GliffyApp.fileUploadController.FILE_EXTENSION_GON,GliffyApp.fileUploadController.FILE_EXTENSION_GXML,GliffyApp.fileUploadController.FILE_EXTENSION_GLIFFY,GliffyApp.fileUploadController.FILE_EXTENSION_VDX,
GliffyApp.fileUploadController.FILE_EXTENSION_VSDX,GliffyApp.fileUploadController.FILE_EXTENSION_JPG,GliffyApp.fileUploadController.FILE_EXTENSION_JPEG,GliffyApp.fileUploadController.FILE_EXTENSION_GIF,GliffyApp.fileUploadController.FILE_EXTENSION_PNG],buttonText:$.i18n._("online.welcome.import")+"...",click:function(e){GLIFFY.Utils.analyticsEvent("trackEvent",{category:"menuClick",action:"import"});setTimeout(function(){$(".gliffy-filemenu-import .gliffy-file-upload-button").css("background-color",
"#FFFFFF")},100);if(!GliffyApp.authController.isAuthenticated()){GliffyApp.loginSignupController.show();$(".gliffy-filemenu").click();return false}}};GliffyApp.fileUploadController.createFileUploaderButton($(".gliffy-nav-menus .gliffy-filemenu-import .gliffy-file-upload-button"),importOptions).bind("gliffy_fileUploadSuccess",function(e,response){GliffyApp.progressBarController.hide();if(response.data.type=="image"){GLIFFY.Dialog.showAlertDialog({title:$.i18n._("IMAGEUPLOAD_SUCCESS"),content:$.i18n._("online.file.upload.import.image.success"),
buttons:[{text:$.i18n._("DIALOG_OK"),primary:true,dismiss:true}]});if(typeof GliffyApp.imageBrowserController!="undefined")GliffyApp.imageBrowserController.handleSearch("")}else{var options={callback:function(){GLIFFY.editor.handleCreateNewTab()}};if(GLIFFY.FEATURES.browserTabs)GliffyApp.fileUploadController.importDocument();else GLIFFY.editor.createUntitledTab(function(){GLIFFY.editor.openTemplateFromGON(response.data.diagram,options);GLIFFY.editor.handleCreateNewTab()})}GLIFFY.Utils.analyticsEvent("trackEvent",
{category:"import",action:"importSuccess",label:"fileMenu;"+GLIFFY.onlineUtils.getFileHandle(response.filename)});GLIFFY.analyticsUtils.logMixpanelEvent("documentImportSuccess",{})}).bind("gliffy_fileUploadError",function(e,response){GliffyApp.progressBarController.hide();GLIFFY.Dialog.showAlertDialog({title:$.i18n._("ERRORHANDLER_ERROR"),content:$.i18n._("online.file.upload.import.error")+" "+response.reason+".  "+$.i18n._("online.file.upload.import.error.action"),buttons:[{text:$.i18n._("DIALOG_OK"),
primary:true,dismiss:true}]});GLIFFY.Utils.analyticsEvent("trackEvent",{category:"import",action:"importError",label:response.reason+";fileMenu;"+GLIFFY.onlineUtils.getFileHandle(response.filename)})}).bind("gliffy_fileUploadProgress",function(e,response){GliffyApp.progressBarController.updateProgress(response.currentSize,response.totalSize)}).bind("gliffy_fileUploadStart",function(e,filename){GliffyApp.progressBarController.show($.i18n._("online.welcome.importing")+" "+filename)});GliffyApp.authController.addLoginCallback(function(){GliffyApp.fileUploadController.updateOptions($(".gliffy-filemenu-import .gliffy-file-upload-button"),
{url:window.GLIFFY.API.getActionUrl("import_file.json",null),allowExtensions:[GliffyApp.fileUploadController.FILE_EXTENSION_GON,GliffyApp.fileUploadController.FILE_EXTENSION_GXML,GliffyApp.fileUploadController.FILE_EXTENSION_GLIFFY,GliffyApp.fileUploadController.FILE_EXTENSION_VDX,GliffyApp.fileUploadController.FILE_EXTENSION_VSDX],buttonText:$.i18n._("online.welcome.import")+"..."})})};refreshEditorAfterOAuth=function(){GliffyApp.authController.refreshAccountSettings(GliffyApp.loginSignupController.resumeExplicit,
null)};addTopLevelItem=function(menuId,label,itemId,clickEvent){$("div.navbar-fixed-top ul.pull-right").prepend('\x3cli class\x3d"dropdown"\x3e\x3ca class\x3d"dropdown-top-menu dropdown-toggle" href\x3d"#" id\x3d"'+itemId+'"\x3e\x3cspan id\x3d"gliffy-menu-label-'+itemId+'"\x3e'+label+"\x3c/span\x3e\x3c/a\x3e\x3c/li\x3e");$("#"+itemId).click(function(e){e.preventDefault();clickEvent()})};addTopLevelMenu=function(label,menuId){$("div.navbar-fixed-top ul.pull-right").prepend('\x3cli class\x3d"dropdown" id\x3d"'+
menuId+'"\x3e'+'\x3ca class\x3d"dropdown-toggle" data-toggle\x3d"dropdown" href\x3d"#'+menuId+'"\x3e\x3cspan id\x3d"gliffy-menu-label-'+menuId+'"\x3e'+label+'\x3c/span\x3e \x3cb class\x3d"caret"\x3e \x3c/b\x3e\x3c/a\x3e\x3cul class\x3d"dropdown-menu" id\x3d"sub-'+menuId+'"\x3e\x3c/ul\x3e \x3c/li\x3e')};addTopLevelMenuItem=function(menuId,label,itemId,clickEvent){$("#sub-"+menuId).append('\x3cli\x3e\x3ca href\x3d"#" id\x3d"'+itemId+'"\x3e\x3cspan id\x3d"gliffy-menu-label-'+itemId+'"\x3e'+label+"\x3c/span\x3e\x3c/a\x3e\x3c/li\x3e");
$("#"+itemId).click(function(e){e.preventDefault();clickEvent()})};hideToolbarItems=function(){$(".gliffy-toolbar-btns .gliffy-logo").parent().hide()};var templates=["font-loader-template","gliffy-file-open-browser-template","gliffy-welcome-screen-template","gliffy-template-browser-template","gliffy-online-tag-image-modal-template","gliffy-image-info-modal-template","gliffy-image-search-results-modal-template","gliffy-login-signup-modal-template","gliffy-login-modal-template","gliffy-temp-password-modal-template",
"gliffy-collaboration-modal-template","gliffy-publish-modal-template","gliffy-save-modal-template","gliffy-folder-create-modal-template","gliffy-verify-email-modal-template","gliffy-account-template","gliffy-rename-document-modal-template","gliffy-feedback-modal-template","gliffy-trial-team-invite-modal-template","editor-upgrade-template","expiration-notice-template","gliffy-preview-zoom-view-template","gliffy-account-switch-template","gliffy-trial-signup-invite-modal-template","open-from-template",
"saveAs-override-template","help-menu-send-feedback-template","ineligible-for-google-drive-template","ineligible-for-comment-template","save-before-google-drive-open-template","reinstall-google-drive","gliffy-modal-gdrive-connected","help-menu-customer-support","explicit-onboarding-steps-template","account-user-additional-info-template"];templates.push("account-expiration-business-team-deal-template");templates.push("share-the-gliffy-love-template");templates.push("account-expiration-simplified-pricing-pages-template");
templates.push("enhanced-modal-template");templates.push("enhanced-login-signup-modal-template");templates.push("enhanced-team-invite-modal-template");templates.push("final-view-template");GLIFFY.onlineUtils.appendTemplates(templates);GLIFFY.onlineUtils.appendTemplate("gliffy-banner-template","gliffy-bottom-panel");GLIFFY.editor=editor;GLIFFY.editor.findOpenDocumentByUrl=function(openUrl){for(var i=0;i<GLIFFY.editor.getDocumentManager().getDocuments().length;i++){doc=GLIFFY.editor.getDocumentManager().getDocuments()[i];
if(openUrl.indexOf("diagramId\x3d"+doc.__urls.id)>-1)return doc}return null};GLIFFY.editor.handleCreateNewTab=function(){GLIFFY.editor.getDocumentManager().getActiveDocument().getUrls().isPublic=!GliffyApp.authController.canAccountCreatePrivateDiagrams();GliffyApp.documentModel.update(GLIFFY.editor.getDocumentManager().getActiveDocument())};GLIFFY.editor.mapDto=function(data){data.title=data.name;data.revision=data.version;if(typeof data.urls==="undefined")data.urls={};data.urls.id=data.id;data.urls.isPublic=
data.isPublic};GLIFFY.onlineUtils.override(GLIFFY.Editor,"bindBeforeUnload",function(){var self=this;if(!_gliffy.Debug.NO_NAVIGATE_WARNING)window.addEventListener("beforeunload",function(e){if(GLIFFY.FEATURES.browserTabs&&GLIFFY.BrowserDetect.browser==="Firefox"&&!GLIFFY.editor.unsavedChanges()&&!windowHasFocus){if(e)e.returnValue="This page will reload.";return"This page will reload."}else{var warningString=$.i18n._("EDITOR_YOU_HAVE_UNSAVED_CHANGES.");if(GLIFFY.editor.unsavedChanges()){if(e)e.returnValue=
warningString;return warningString}}},false)});GLIFFY.activityLog=function(eventLabel,statusVal){var accountId=typeof GliffyApp.authController.getAccountId()==="undefined"?0:GliffyApp.authController.getAccountId();var userId=typeof GliffyApp.authController.getUserID()==="undefined"?0:GliffyApp.authController.getUserID();GLIFFY.API.GET("log",{query:{userId:userId,accountId:accountId,event:eventLabel,status:statusVal}})}};if(GliffyApp.gliffyMirageServer){GliffyApp.gliffyMirageServer.shutdown();delete GliffyApp.gliffyMirageServer};