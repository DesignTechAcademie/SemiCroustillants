(function(){(function(b){var c=b.Experiments={};var a=c.Utils={};a.load=function(){b.optimizely=(b.optimizely&&b.optimizely.push)?b.optimizely:[]};a.sendOptimizelyExperimentAnalyticsData=function(d,e){a.sendCustomExperimentAnalyticsData(d,e,null)};a.sendCustomExperimentAnalyticsData=function(e,f,g){var d="Optimizely Experiment ID: "+e.toString()+" - "+f;if(g!=null){d+=" - "+g}b.dataLayer=b.dataLayer||[];dataLayer.push({optimizelyExperimentData:d,event:"sendOptimizelyDataToGA"})};a.sendGADimensionData=function(e,d){b.dataLayer=b.dataLayer||[];dataLayer.push({gaDimensionSlot:e.toString(),gaDimensionData:d.toString(),event:"sendDimensionDataToGA"})};a.sendGAEvent=function(f,g,h,e,d){b.dataLayer=b.dataLayer||[];h=(typeof(h)=="undefined")?"":h;e=(typeof(e)=="undefined")?"":e;d=(typeof(d)!="undefined"&&d=="true")?"true":"false";dataLayer.push({event:"genericGAEventFromDataLayer",gaEventCategory:f,gaEventAction:g,gaEventLabel:h,gaEventValue:e,gaEventNonInteractionHit:d})};a.logOptimizelyExperimentToDB=function(h,e,f,g,i){var j=null;if(typeof GliffyApp!=="undefined"&&typeof GliffyApp.authController!=="undefined"&&typeof GliffyApp.authController.getAccountId!=="undefined"&&GliffyApp.authController.getAccountId()!==null){j=GliffyApp.authController.getAccountId()}else{j=e}if(j){var d={accountId:j,experimentId:h,experimentType:f,experimentVariation:g,experimentMetadataJson:i};return $.ajax({type:"POST",url:"/go/api/analytics/experiment",data:JSON.stringify(d),contentType:"application/json"})}}}(window));(function(j){var c="Annual";var d="Annually";var b="YR";var l="Monthly";var g="Monthly";var n="MO";var k="Standard";var e="Business";var m=1;var a={billingType:c,userCount:5};var f={standardPrice:0,businessPrice:0,businessTeamPrice:0,billingAbbreviation:n,billingPeriodName:l,billingPeriodText:l};var i={};var h=j.BusinessTeamDeal={};h.init=function(v){var A=this,s,y,u,p,o=0,q,w;var t="Original";var x=$("#business-team-template");var z=$("#business-template");var r=$("#standard-template");if(x.length>0){this.businessTeamTemplate=Handlebars.compile(x.html())}if(z.length>0){this.businessTemplate=Handlebars.compile(z.html())}if(r.length>0){this.standardTemplate=Handlebars.compile(r.html())}$("body").on("Optimizely_GHAX_262",function(){s=j.optimizely&&j.optimizely.GHAX&&j.optimizely.GHAX.BusinessTeamDeal;if(s){y=j.optimizely.GHAX.BusinessTeamDeal.promoHash.length>0;u=j.optimizely.GHAX.BusinessTeamDeal.experimentId;p=j.optimizely.GHAX.BusinessTeamDeal.experimentName;q=j.optimizely.GHAX.BusinessTeamDeal.experimentVariation;if(y){t="Variant 1 (50% off Business Teams of 25+ Users)";o=1;if(x.length>0&&z.length>0&&r.length>0){A.bindEvents()}}if(typeof GliffyApp!=="undefined"&&GliffyApp.authController){var C=0;var B=function(){if(j.optimizely&&j.optimizely.GHAX&&j.optimizely.GHAX.BusinessTeamDeal){GliffyApp.authController.set("doNotShowUpgradeButton",true);if(j.optimizely.GHAX.BusinessTeamDeal.promoHash&&j.optimizely.GHAX.BusinessTeamDeal.promoHash.length>0){GliffyApp.accountUpgradeBusinessTeamDealController.getProductInfo();GliffyApp.accountExpireBusinessTeamDealController.getProductInfo()}}};var D=setInterval(function(){if($(".upgrade-business-team-deal-template").length>0){B();clearInterval(D)}else{if(C>10){clearInterval(D)}C++}},500);w=GliffyApp.authController.getAccountId();Experiments.Utils.sendOptimizelyExperimentAnalyticsData(u,t);if(w){Experiments.Utils.logOptimizelyExperimentToDB(u,w,"optimizely",o,{experimentVariationString:t,experimentName:p,experimentVariationId:q})}}}});j.optimizely.push(["activate",4678360619])};h.bindEvents=function(){var o=this,q,u;var p=".business-team #user-count";var t=p+" ul";var r=p+" .dropdown-toggle";var s="#userCountHidden";$.ajax({url:"/go/commerce/productinfo?promoHash="+j.optimizely.GHAX.BusinessTeamDeal.promoHash,dataType:"json",success:function(v){i=v;$("button[value='"+a.billingType+"'").addClass("active");$("button[value='"+a.userCount+"'").addClass("active");o.changePrices();$(t).on("click",function(w){w.preventDefault();q=($(w.target).is("span"))?$(w.target).parent():$(w.target);FormHelpers.updateDropDown(r,q);FormHelpers.updateHiddenField(s,q);a.userCount=q.data("index");o.changePrices()});if($(s).val()!=""){u=$(s).val();if(u!=""){$(t+' *[data-index="'+u+'"]').click()}}}});$("a[name='stdLink']").bind("click",function(){if(!$(this).parent().parent().hasClass("business-team")){a.userCount=1;o.updateForm(a)}j.optimizely.push(["trackEvent","commercePricingPageChosePaidPlan"]);o.postForm($(this).data("account-type"));event.preventDefault()})};h.postForm=function(o){$("#frmSaveOptions input[name='accountType']").val(o);$("#frmSaveOptions").submit()};h.updateForm=function(o){$("form input[name='billingPeriod']").val(o.billingType);$("form input[name='userCount']").val(o.userCount)};h.changePrices=function(){var o=i[e];f.businessTeamPrice=o[c][a.userCount].Price/a.userCount;f.businessTeamPrice=f.businessTeamPrice/12;f.businessTeamPrice=parseFloat((Math.round(f.businessTeamPrice*100)/100)).toFixed(2);f.billingPeriodName=g;f.billingAbbreviation=n;f.billingPeriodText=d;if(a.userCount>=25){a.billingType=c}$("#business-team-deal-cost").html("$"+f.businessTeamPrice);this.updateForm(a)}}(window));(function(b){var c=b.Experiments;var a=c.ShowRecommendGliffyMenu={};a.init=function(k){var n=this;var g,m,j,f,d=0,h,l;var i="Original";$("body").on("Optimizely_GHAX_244",function(){g=b.optimizely&&b.optimizely.GHAX&&b.optimizely.GHAX.ShowRecommendGliffyMenu;if(g){m=b.optimizely.GHAX.ShowRecommendGliffyMenu.showMenu===true;j=b.optimizely.GHAX.ShowRecommendGliffyMenu.experimentId;f=b.optimizely.GHAX.ShowRecommendGliffyMenu.experimentName;h=b.optimizely.GHAX.ShowRecommendGliffyMenu.experimentVariation;if(m){i="Variant 1 (Show Recommend Gliffy Menu')";d=1;n.showRecommendMenu()}l=GliffyApp.authController.getAccountId();c.Utils.sendOptimizelyExperimentAnalyticsData(j,i);c.Utils.logOptimizelyExperimentToDB(j,l,"optimizely",d,{experimentVariationString:i,experimentName:f,experimentVariationId:h})}});b.optimizely.push(["activate",4649661372])};a.bindEvents=function(){$(".gliffy-close-the-modal-x").on("click",a.hide);$("#gliffy-share-the-love-btn").on("click",a.sendInvites);$(".gliffy-close-the-thanks-modal-x").on("click",a.hideSuccessMessage);$("#gliffy-share-the-love-again").on("click",a.hideSuccessMessage)};a.showRecommendMenu=function(){var d=$("ul.nav.pull-right #dmmenu");if(d.length===0){d=$("#top-menu-user-signin")}if($("#recommend-gliffy-menu").length===0&&d.length>0){$('<li id="recommend-gliffy-menu" class="dropdown"><a class="dropdown-top-menu dropdown-toggle" href="#">'+$.i18n._("online.recommend.gliffy.menu")+"<span>&#10084;</span></a></li>").insertBefore(d.parent());$("#recommend-gliffy-menu").find("a").on("click",a.show)}};a.show=function(){c.ShowRecommendGliffyMenu.hideSuccessMessage();$("#gliffy-share-the-love-modal").modal("show")};a.hide=function(){$("#gliffy-share-the-love-modal").modal("hide")};a.sendInvites=function(){var d,e=$("#gliffy-share-the-love-textarea");if(e.val()!==""){d=e.val().replace(/ /g,"").split(",");b.optimizely.push(["trackEvent","userSentOutRecommendInvites"]);mixpanel.people.set({accountId:GliffyApp.authController.getAccountId(),numberOfInvitesSent:d.length});mixpanel.identify(GliffyApp.authController.getUserID());mixpanel.people.increment("recommendedInvites",d.length);GLIFFY.analyticsUtils.logMixpanelEvent("userSentOutRecommendInvites",{accountId:GliffyApp.authController.getAccountId(),userId:GliffyApp.authController.getUserID(),recommendedInvites:d.length});b.GLIFFY.API.POST("user/inviteUsers",{emailList:d},{success:function(g,h,f){$("#gliffy-share-the-love-textarea").val("");c.ShowRecommendGliffyMenu.showSuccessMessage()},error:function(h,f,g){console.error("error logging in",h,f,g)},context:a})}};a.showSuccessMessage=function(){$("#share-the-love-msg").hide();$("#thanks-for-sharing-love-msg").show()};a.hideSuccessMessage=function(){$("#thanks-for-sharing-love-msg").hide();$("#share-the-love-msg").show()};a.writeInvitedUsersTable=function(e,d){b.GLIFFY.API.POST("user/invitedUserSignedUp",{invitedByUserId:e,invitedUserId:d,experimentId:4649661372},{success:function(g,h,f){$.removeCookie("refererId",{path:"/"});b.optimizely.push(["trackEvent","recommendedInviteUserSignedUp"])},error:function(h,f,g){console.error("error logging in",h,f,g)}})}}(window));(function(b){var c=b.Experiments;var a=c.PromoteTeamPricingInPrint={};a.init=function(j){var m,l,i,f,d=0,g,k;var h="Original";$("body").on("Optimizely_GHAX_264",function(){m=b.optimizely&&b.optimizely.GHAX&&b.optimizely.GHAX.PromoteTeamPricingInPrint;if(m){l=b.optimizely.GHAX.PromoteTeamPricingInPrint.showInPrint===true;i=b.optimizely.GHAX.PromoteTeamPricingInPrint.experimentId;f=b.optimizely.GHAX.PromoteTeamPricingInPrint.experimentName;g=b.optimizely.GHAX.PromoteTeamPricingInPrint.experimentVariation;if(l){h="Variant 1 (Promote Team Pricing In Print Dialog)";d=1}k=GliffyApp.authController.getAccountId();c.Utils.sendOptimizelyExperimentAnalyticsData(i,h);c.Utils.logOptimizelyExperimentToDB(i,k,"optimizely",d,{experimentVariationString:h,experimentName:f,experimentVariationId:g})}});b.optimizely.push(["activate",4790371243])};a.showPrintMessage=function(){if(b.optimizely&&b.optimizely.GHAX&&b.optimizely.GHAX.PromoteTeamPricingInPrint&&b.optimizely.GHAX.PromoteTeamPricingInPrint.showInPrint&&$("#gliffy-team-pricing-in-print-menu").length===0){$(".gliffy-print-buttons").after("<div id='gliffy-team-pricing-in-print-menu'></div>");$("#gliffy-team-pricing-in-print-menu").on("click",this.sendToPurchasePage)}};a.sendToPurchasePage=function(){b.optimizely.push(["trackEvent","clickedPromoteTeamPricingInPrint"]);$.cookie("billingPeriod","Annual",{expires:365,path:"/"});$.cookie("accountType","Business",{expires:365,path:"/"});$.cookie("userCount",5,{expires:365,path:"/"});b.open("/go/commerce/purchase","_blank")}}(window));(function(b){var c=b.Experiments;var a=c.HideWelcomeDialog={};a.init=function(k){var m,h,j,f,d=0,g,l;var i="Original";$("body").on("Optimizely_GHAX_343",function(){m=b.optimizely&&b.optimizely.GHAX&&b.optimizely.GHAX.HideWelcomeDialog;if(m){var e=b.optimizely.GHAX.HideWelcomeDialog;h=e.hideDialog===true;j=e.experimentId;f=e.experimentName;g=e.experimentVariation;if(h){i="Variant 1 (Hide Welcome Dialog)";d=1;GliffyApp.welcomeScreenController.set("hideWelcomeScreen",true)}l=GliffyApp.authController.getAccountId();c.Utils.sendOptimizelyExperimentAnalyticsData(j,i);c.Utils.logOptimizelyExperimentToDB(j,l,"optimizely",d,{experimentVariationString:i,experimentName:f,experimentVariationId:g})}});b.optimizely.push(["activate",5310991369])}}(window));(function(a){var c=a.Experiments;var b=c.SimplifiedPricingPages={};b.init=function(k){var d,m,j,g,f=0,h,l;var i="Original";$("body").on("Optimizely_GHAX_331",function(){d=a.optimizely&&a.optimizely.GHAX&&a.optimizely.GHAX.SimplifiedPricingPages;if(d){var e=a.optimizely.GHAX.SimplifiedPricingPages;m=e.showSimplifiedPricingPages===true;j=e.experimentId;g=e.experimentName;h=e.experimentVariation;if(m){i="Variant 1 (Simplified Pricing Pages)";f=1;GliffyApp.accountUpgradeSimplifiedPricingPagesController.set("propInAppSimplifiedPricingPages",true);GliffyApp.accountExpireSimplifiedPricingPagesController.bindClickEvents();GliffyApp.accountUpgradeSimplifiedPricingPagesController.bindClickEvents()}GliffyApp.authController.set("doNotShowUpgradeButton",true);l=GliffyApp.authController.getAccountId();c.Utils.sendOptimizelyExperimentAnalyticsData(j,i);if(l){c.Utils.logOptimizelyExperimentToDB(j,l,"optimizely",f,{experimentVariationString:i,experimentName:g,experimentVariationId:h})}}});a.optimizely.push(["activate",5210331048])}}(window));(function(b){var c=b.Experiments;var a=c.EnhancedModals={};a.init=function(k){var m,g,j,f,d=0,h,l;var i="Original";$("body").on("Optimizely_GHAX_242",function(){m=b.optimizely&&b.optimizely.GHAX&&b.optimizely.GHAX.EnhancedModals;if(m){var e=b.optimizely.GHAX.EnhancedModals;g=e.showEnhancedModals===true;j=e.experimentId;f=e.experimentName;h=e.experimentVariation;if(g){i="Variant 1 (Enhanced Login / Signup Modals";d=1;a.addMenuLinks();a.bindEvents()}l=GliffyApp.authController.getAccountId();c.Utils.sendOptimizelyExperimentAnalyticsData(j,i);c.Utils.logOptimizelyExperimentToDB(j,l,"optimizely",d,{experimentVariationString:i,experimentName:f,experimentVariationId:h})}});b.optimizely.push(["activate",5634570740])};a.addMenuLinks=function(){var g,e,f,d=$("#top-menu-user-signin");f=d.closest(".pull-right");d.hide();g="<li><a href='#' class='enhanced-menu-login'>Login</a></li>";e="<li><a href='#' class='enhanced-menu-signup'>Sign up</a></li>";f.append(e);f.append(g)};a.bindEvents=function(){var f=$(".enhanced-menu-signup");var d=$(".enhanced-menu-login");var e=$(".modal-content").find(".enhanced-login-link");f.on("click",function(){GliffyApp.enhancedLoginSignupModalController.showSignup()});d.on("click",function(){GliffyApp.enhancedLoginSignupModalController.showLogin()});e.on("click",function(){GliffyApp.enhancedLoginSignupModalController.hideModal();GliffyApp.enhancedLoginSignupModalController.showLogin()})}}(window));(function(a){var c=a.Experiments;var b=c.DetailedPurchase={};b.init=function(k){var l,d,j,g,f=0,h,m;var i="Variant 0 (Detailed purchase page)";$("body").on("Optimizely_GHAX_423",function(){l=a.optimizely&&a.optimizely.GHAX&&a.optimizely.GHAX.DetailedPurchase;if(l){var e=a.optimizely.GHAX.DetailedPurchase;d=e.showUpgradeModal===false;j=e.experimentId;g=e.experimentName;h=e.experimentVariation;GliffyApp.detailedPurchasePageRedirectController.set("propInDetailedPurchasePage",true);GliffyApp.authController.set("propDoNotShowUpgradeButton",true);GliffyApp.detailedPurchasePageRedirectController.set("propShowRedirectUpgradeButton",false);if(d){i="Variant 1 (Detailed purchase page no upgrade modal)";f=1;GliffyApp.detailedPurchasePageRedirectController.load()}m=GliffyApp.authController.getAccountId();c.Utils.sendOptimizelyExperimentAnalyticsData(j,i);if(m){c.Utils.logOptimizelyExperimentToDB(j,m,"optimizely",f,{experimentVariationString:i,experimentName:g,experimentVariationId:h})}}});a.optimizely.push(["activate",5769920221])}}(window));(function(b){var c=b.Experiments;var a=c.OnboardingStepTwoChange={};a.init=function(j){var m,l,i,f,d=0,g,k;var h="Original";$("body").on("Optimizely_GHAX_478",function(){m=b.optimizely&&b.optimizely.GHAX&&b.optimizely.GHAX.OnboardingStepTwoChange;if(m){var e=b.optimizely.GHAX.OnboardingStepTwoChange;if(!$.cookie("template-opened")){$.cookie("template-opened",false,{expires:365,path:"/"})}l=e.showStepTwoChange===true;i=e.experimentId;f=e.experimentName;g=e.experimentVariation;if(l){h="Variant 1 (Onboarding step 2 change)";d=1;GliffyApp.explicitOnboardingStepsController.set("showAlternativeStepTwo",true);if($.cookie("template-opened")==="true"){GliffyApp.explicitOnboardingStepsController.set("alternativeStepTwoComplete",true)}}k=GliffyApp.authController.getAccountId();c.Utils.sendOptimizelyExperimentAnalyticsData(i,h);if(k){c.Utils.logOptimizelyExperimentToDB(i,k,"optimizely",d,{experimentVariationString:h,experimentName:f,experimentVariationId:g})}}});b.optimizely.push(["activate",6039593291])}}(window));(function(b){var c=b.Experiments;var a=c.EditorPurchasePage={};a.init=function(j){var m,l,i,f,d=0,g,k;var h="Original";$("body").on("Optimizely_GHAX_461",function(){m=b.optimizely&&b.optimizely.GHAX&&b.optimizely.GHAX.EditorPurchasePage;if(m){var e=b.optimizely.GHAX.EditorPurchasePage;l=e.showPurchasePage===true;i=e.experimentId;f=e.experimentName;g=e.experimentVariation;if(l){h="Variant 1 (Show Editor Purchase Pag)";d=1}k=GliffyApp.authController.getAccountId();c.Utils.sendOptimizelyExperimentAnalyticsData(i,h);c.Utils.logOptimizelyExperimentToDB(i,k,"optimizely",d,{experimentVariationString:h,experimentName:f,experimentVariationId:g})}});b.optimizely.push(["activate",6439642700])}}(window));(function(b){var c=b.Experiments;var a=c.StripeExperiment={};a.init=function(k){var m,j,i,f,d=0,g,l;var h="Original";$("body").on("Optimizely_DEVOPS_352",function(){m=b.optimizely&&b.optimizely.GHAX&&b.optimizely.GHAX.Stripe;if(m){var e=b.optimizely.GHAX.Stripe;j=e.useStripe===true;if(GliffyApp.authController.billingStatus.source==="ben"&&!j){j=true;b.optimizely.bucketUser(7097901053,1)}i=e.experimentId;f=e.experimentName;g=e.experimentVariation;if(j){h="Variant 1 (for stripe purchasing page)";d=1}l=GliffyApp.authController.getAccountId();c.Utils.sendOptimizelyExperimentAnalyticsData(i,h);if(l){c.Utils.logOptimizelyExperimentToDB(i,l,"optimizely",d,{experimentVariationString:h,experimentName:f,experimentVariationId:g})}}});b.optimizely.push(["activate",7097901053])}}(window));(function(a){var c=a.Experiments;var b=c.Editor={};$(function(){var d=$("body");$(".experiment-template").each(function(g){var f=$(this);f.load(f.data("path"))})});b.load=function(){if(c&&c.Utils){var d=(GliffyApp&&GliffyApp.authController&&GliffyApp.authController.account&&GliffyApp.authController.account.accountMetadata)?GliffyApp.authController.account.accountMetadata:null;if(GliffyApp.authController.account.isTrial){if(d&&d.organizationSizeMin>1){if(typeof c.Utils.sendGADimensionData=="function"){c.Utils.sendGADimensionData(5,JSON.stringify({orgSizeMin:d.organizationSizeMin}))}}if(c.ShowRecommendGliffyMenu){c.ShowRecommendGliffyMenu.init()}if(a.BusinessTeamDeal){a.BusinessTeamDeal.init()}if(c.PromoteTeamPricingInPrint){c.PromoteTeamPricingInPrint.init()}if(c.HideWelcomeDialog){c.HideWelcomeDialog.init()}if(c.OnboardingStepTwoChange){c.OnboardingStepTwoChange.init()}if(c.EditorPurchasePage){c.EditorPurchasePage.init()}}else{if(GliffyApp.authController.isFreeAccount()){if(c.ShowRecommendGliffyMenu){c.ShowRecommendGliffyMenu.init()}if(a.BusinessTeamDeal){a.BusinessTeamDeal.init()}if(c.HideWelcomeDialog){c.HideWelcomeDialog.init()}if(c.EditorPurchasePage){c.EditorPurchasePage.init()}}else{if(GliffyApp.authController.isPaidAccount()){if(GliffyApp.authController.getAccountMaxUsers()===1){if(a.BusinessTeamDeal){a.BusinessTeamDeal.init()}if(c.PromoteTeamPricingInPrint){c.PromoteTeamPricingInPrint.init()}}else{}if(c.ShowRecommendGliffyMenu){c.ShowRecommendGliffyMenu.init()}if(c.HideWelcomeDialog){c.HideWelcomeDialog.init()}if(c.EditorPurchasePage){c.EditorPurchasePage.init()}}else{if(GliffyApp.authController.isAnonymousAccount()){}}}}if(c.SimplifiedPricingPages){c.SimplifiedPricingPages.init()}if(c.EnhancedModals){c.EnhancedModals.init()}if(c.DetailedPurchase){c.DetailedPurchase.init()}if(c.StripeExperiment){c.StripeExperiment.init()}}}}(window))}());