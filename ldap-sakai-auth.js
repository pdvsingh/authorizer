var add_btn_ip, add_btn_course;
var animation_speed = 300;
var shake_speed = 600;


// Add IP address to whitelist.
function lsa_add_ip(ip) {
  if (jQuery.trim(ip) == '')
    return false;

  add_btn_ip.attr('disabled', 'disabled');

  // Check if the IP address being added already exists in the list.
  jQuery('#list_lsa_settings_misc_ips input[type=text]').each(function() {
    if (this.value == ip) {
      jQuery(this).parent().effect('shake',shake_speed);
      add_btn_ip.removeAttr('disabled');
      return false;
    }
  });

  jQuery('#newip').css('background', 'url(/wp-admin/images/loading.gif) no-repeat 148px 2px');
  jQuery.post(ajaxurl, { action: 'lsa_ip_check', 'ip_address': ip }, function(response) {
    jQuery('#newip').css('background', 'none');
    if (response) { // failed checking ip
      jQuery('#newip').parent().effect('shake',shake_speed);
      add_btn_ip.removeAttr('disabled');
      return false;
    } else { // succeeded checking ip
      jQuery('<li style="display: none;"><input type="text" name="lsa_settings[misc_ips][]" value="' + ip + '" readonly="true" /> <input type="button" class="button" onclick="lsa_remove_ip(this);" value="Remove" /></div>').appendTo('#list_lsa_settings_misc_ips').slideDown(250);
      // Reset the new ip textbox if we successfully added this ip
      if (ip == jQuery('#newip').val())
        jQuery('#newip').val('');
      jQuery('#addip').removeAttr('disabled');
      return true;
    }
  } );
}
// Remove IP address from whitelist.
function lsa_remove_ip(btnObj) {
  jQuery(btnObj).parent().slideUp(250,function(){ jQuery(this).remove(); });
}


// Add course to whitelist.
function lsa_add_course(course) {
  if (jQuery.trim(course) == '')
    return false;

  add_btn_course.attr('disabled', 'disabled');

  // Check if the IP address being added already exists in the list.
  jQuery('#list_lsa_settings_access_courses input[type=text]').each(function() {
    if (this.value == course) {
      jQuery(this).parent().effect('shake',shake_speed);
      add_btn_course.removeAttr('disabled');
      return false;
    }
  });

  jQuery('#newcourse').css('background', 'url(/wp-admin/images/loading.gif) no-repeat 253px 2px');
  jQuery.post(ajaxurl, {
    action: 'lsa_course_check', 
    'sakai_site_id': course, 
    'sakai_base_url': jQuery('#lsa_settings_sakai_base_url').val() 
  }, function(response) {
    jQuery('#newcourse').css('background', 'none');
    if (response==0) { // failed checking course
      jQuery('#newcourse').parent().effect('shake',shake_speed);
      add_btn_course.removeAttr('disabled');
      return false;
    } else { // succeeded checking course
      jQuery('<li style="display: none;"><input type="text" name="lsa_settings[access_courses][]" value="' + course + '" readonly="true" style="width:275px;" /> <input type="button" class="button" onclick="lsa_remove_course(this);" value="Remove" /> <span class="description">' + response + '</span></div>').appendTo('#list_lsa_settings_access_courses').slideDown(250);
      // Reset the new course textbox if we successfully added this course
      if (course == jQuery('#newcourse').val())
        jQuery('#newcourse').val('');
      jQuery('#addcourse').removeAttr('disabled');
      return true;
    }
  });
}
// Remove IP address from whitelist.
function lsa_remove_course(btnObj) {
  jQuery(btnObj).parent().slideUp(250,function(){ jQuery(this).remove(); });
}


// Helper function to grab a querystring param value by name
function getParameterByName(needle, haystack) {
  needle = needle.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + needle + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(haystack);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}


jQuery(document).ready(function($){
  // hide and show relevant pieces
  add_btn_ip = $('#addip');
  add_btn_course = $('#addcourse');

  // Show and hide specific options on page load
  var lsa_settings_access_redirect_to_login = $('#radio_lsa_settings_access_redirect_to_login').closest('tr');
  var lsa_settings_access_redirect_to_url = $('#lsa_settings_access_redirect_to_url').closest('tr');
  var lsa_settings_access_redirect_to_message = $('#wp-lsa_settings_access_redirect_to_message-wrap').closest('tr');
  var lsa_settings_access_redirect_to_page = $('#lsa_settings_access_redirect_to_page').closest('tr');
  var lsa_settings_access_courses = $('#list_lsa_settings_access_courses').closest('tr');

  // Wrap the th and td in the rows above so we can animate their heights (can't animate tr heights with jquery)
  $('th, td', lsa_settings_access_redirect_to_login).wrapInner('<div class="animated_wrapper" />');
  $('th, td', lsa_settings_access_redirect_to_url).wrapInner('<div class="animated_wrapper" />');
  $('th, td', lsa_settings_access_redirect_to_message).wrapInner('<div class="animated_wrapper" />');
  $('th, td', lsa_settings_access_redirect_to_page).wrapInner('<div class="animated_wrapper" />');
  $('th, td', lsa_settings_access_courses).wrapInner('<div class="animated_wrapper" />');

  if (!$('#radio_lsa_settings_access_redirect_to_url').is(':checked')) {
    $('div.animated_wrapper', lsa_settings_access_redirect_to_url).hide();
  }
  if (!$('#radio_lsa_settings_access_redirect_to_message').is(':checked')) {
    $('div.animated_wrapper', lsa_settings_access_redirect_to_message).hide();
  }
  if (!$('#radio_lsa_settings_access_redirect_to_page').is(':checked')) {
    $('div.animated_wrapper', lsa_settings_access_redirect_to_page).hide();
  }

  if (!$('#radio_lsa_settings_access_restriction_course').is(':checked')) {
    $('div.animated_wrapper', lsa_settings_access_courses).hide();
  }

  // show and hide specific options based on "Handle unauthorized visitors" selection
  $('input[name="lsa_settings[access_redirect]"]').change(function() {
    if ($('#radio_lsa_settings_access_redirect_to_url').is(':checked')) {
      $('div.animated_wrapper', lsa_settings_access_redirect_to_url).slideDown(animation_speed);
    } else {
      $('div.animated_wrapper', lsa_settings_access_redirect_to_url).slideUp(animation_speed);
    }
    if ($('#radio_lsa_settings_access_redirect_to_message').is(':checked')) {
      $('div.animated_wrapper', lsa_settings_access_redirect_to_message).slideDown(animation_speed);
    } else {
      $('div.animated_wrapper', lsa_settings_access_redirect_to_message).slideUp(animation_speed);
    }
    if ($('#radio_lsa_settings_access_redirect_to_page').is(':checked')) {
      $('div.animated_wrapper', lsa_settings_access_redirect_to_page).slideDown(animation_speed);
    } else {
      $('div.animated_wrapper', lsa_settings_access_redirect_to_page).slideUp(animation_speed);
    }
  });

  // Hide "Handle unauthorized visitors" option if access is granted to "Everyone"
  $('input[name="lsa_settings[access_restriction]"]').change(function(){
    if ($('#radio_lsa_settings_access_restriction_everyone').is(':checked'))
      $('div.animated_wrapper', lsa_settings_access_redirect_to_login).slideUp(animation_speed);
    else
      $('div.animated_wrapper', lsa_settings_access_redirect_to_login).slideDown(animation_speed);
  
    // Hide "Course Site IDs with access" unless "Students enrolled in specific course(s)" is checked
    if (!$('#radio_lsa_settings_access_restriction_course').is(':checked')) {
      $('div.animated_wrapper', lsa_settings_access_courses).slideUp(animation_speed);
    } else {
      $('div.animated_wrapper', lsa_settings_access_courses).slideDown(animation_speed);
    }
});

  

  // Get course name for Site ID from Sakai
  $('#list_lsa_settings_access_courses label').each(function() {
    $.post(ajaxurl, {
      action: 'lsa_course_check', 
      'sakai_site_id': $(this).siblings('input[type=text]').val(), 
      'sakai_base_url': $('#lsa_settings_sakai_base_url').val(),
      'element_to_update': $(this).attr('for')
      }, function(response) {
      if (response!=0) { // failed checking course
        $('#' + getParameterByName('element_to_update',this.data)).siblings('label').children('.description').html(response);
      }
    });
  });
});
