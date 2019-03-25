$(function(){
	if(!Modernizr.input.placeholder) {
		$('input').setup_placeholders();
	}
});

$.fn.setup_placeholders = function() {
	$(this).each(function() {
		var placeholder = $(this).attr('placeholder');
		if(placeholder) {
			if(!$(this).val() || $(this).val() == placeholder) {
				$(this).val(placeholder);
				$(this).addClass('placeholder');
			}
			$(this).focus(function(){
				if($(this).val() == placeholder) {
					$(this).val('');
					$(this).removeClass('placeholder');
				}
			});
			$(this).blur(function(){
				if(!$(this).val()) {
					$(this).val(placeholder);
					$(this).addClass('placeholder');
				}
			});
			$(this).parents('form').submit(function(){
				$('input').each(function(){
					if($(this).val() == placeholder)
						$(this).val('');
				});
			});
		}
	});
}