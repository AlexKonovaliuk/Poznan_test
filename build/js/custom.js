$(document).ready(function(){
  $('.header-nav > ul > li > a').each(function () {
    if($(this).attr('href') == location.href)
      $(this).addClass('active');
  });
});