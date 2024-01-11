(function($) {
    $.fn.objSmsSet = function(InIt) {
        var savedSMSInfo = {};
        this.onLoad = function() {
            LoadWebPage("html/sms/SmsSettings.html");
            GetSmsSettings();
	    clearErrorInfo();
        }
        this.SaveData = function() {
			var mobilePhone = $("#txtCenterNumber").val();
        	var report = $("#SendReportEnabled").prop("checked") ? "1" : "0";
        	 if(savedSMSInfo.center_num == mobilePhone) {
             	saveSmsSettings(mobilePhone,report);
             } else {
             	if(validatePhoneNum(mobilePhone,report)){
 	                ShowDlg("confirmDlg",350,150);
 	                $("#lt_confirmDlg_title").text(jQuery.i18n.prop("lt_SmsSet_stcTitle"));
 	                $("#lt_confirmDlg_msg").text(jQuery.i18n.prop("lSMSCenterModificationWarning"));
 	                $("#lt_btnConfirmYes").click(function() {                  
 	                    saveSmsSettings(mobilePhone,report);
 	                });
             	}
             }		
        }
        
        function validatePhoneNum(mobilePhone,report){
        	if(savedSMSInfo.report == report && savedSMSInfo.center_num == $("#txtCenterNumber").val()){
        		return false;
            }
            if(mobilePhone.indexOf("+") != -1){
                if (mobilePhone == "" || (mobilePhone.length-1)>15 || (mobilePhone.length-1)<3) { 
                    $("#lt_sms_setting_error").show().text(jQuery.i18n.prop("dialog_message_sms_settings_title") + ":" +jQuery.i18n.prop("lphoneNumbertoolong"));
                    return false;
                }
            }else{
                if (mobilePhone == "" || mobilePhone.length>15 || mobilePhone.length<3) { 
                    $("#lt_sms_setting_error").show().text(jQuery.i18n.prop("dialog_message_sms_settings_title") + ":" +jQuery.i18n.prop("lphoneNumbertoolong"));
                    return false;
                }
            }
        	
			 
            if (!IsPhoneNumber(mobilePhone)) {
                $("#lt_sms_setting_error").show().text(jQuery.i18n.prop("dialog_message_sms_settings_title") + ":" +jQuery.i18n.prop("lMobilePhoneError"));
                return false;
            }
            return true;
        }
        
        function saveSmsSettings(mobilePhone,report) {
            var configMap = new Map();
            configMap.put("RGW/sms_set/sms/over_mode","0");
            configMap.put("RGW/sms_set/sms/report",report);
            configMap.put("RGW/sms_set/sms/save_location",savedSMSInfo.save_location);
            configMap.put("RGW/sms_set/sms/center_num",mobilePhone);
            configMap.put("RGW/sms_set/sms/validity",savedSMSInfo.validity);
            var retXml = PostXml("sms","sms.set_config",configMap);

            GetSmsSettings();
            if(0 != $(retXml).find("resp").text()) {
                showMsgBox(jQuery.i18n.prop("dialog_message_sms_settings_title"), jQuery.i18n.prop("dialog_message_sms_settings_set_fail"));
            } else {
                showMsgBoxAutoClose(jQuery.i18n.prop("dialog_message_sms_settings_title"), jQuery.i18n.prop("dialog_message_sms_settings_set_success"));
            }
        }
        function GetSmsSettings() {
			savedSMSInfo = {};
            var xmlText = PostXml("sms","sms.get_config");
			savedSMSInfo.save_location = $(xmlText).find("save_location").text();
			savedSMSInfo.report = $(xmlText).find("report").text();
			savedSMSInfo.over_mode = $(xmlText).find("over_mode").text();
			savedSMSInfo.center_num = $(xmlText).find("center_num").text();
			savedSMSInfo.validity = $(xmlText).find("validity").text();
         
			 $("#txtCenterNumber").val(savedSMSInfo.center_num);
			 
            if (0 == $(xmlText).find("report").text()) {
                $("#SendReportDisabled").prop("checked", true);
            } else {
                $("#SendReportEnabled").prop("checked", true);
            }
        }


        return this;
    }
})(jQuery);