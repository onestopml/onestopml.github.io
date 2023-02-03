$(document).ready(function() {
  if($("#readtime_value").length && $("#readtime").length) {
    console.log($('#readtime').html('Estimated reading time: ' + $('#readtime_value').html() + '(s)'));
  }
});