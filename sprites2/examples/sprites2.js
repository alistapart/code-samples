/*

	-- -- -- -- -- -- --
	css sprites 2
	nav behaviour

	http://www.alistapart.com/articles/sprites2
	-- -- -- -- -- -- --
	
*/

function generateSprites(parent, selectedPrefix, setActive, hoverSpeed, style) {
	// throw the parent object's class into a variable
	var parentClass = $(parent).attr("class");

	// start a loop that cycles through each of the li elements inside the parent element
	$(parent).children("li").each(function() {
		// create a few variables that we'll need during this function:
		// myClass = the class of the object we're currently inspecting
		// current = what the selected class should look like for the parent of the object we're currently inspecting
		var myClass = ($(this).attr("class"))
		var current = parent.substring(1) + " current-" + ($(this).attr("class"));

		// turn on nav events for element this loop identifies
		attachNavEvents(parent, myClass, setActive, hoverSpeed, style);
	
		// let's hide the CSS-defined background image, but only if this isn't the currently-selected item
		if (parentClass != current) {
			$(this).children("a").css({backgroundImage:"none"});
		}

	});
}


function attachNavEvents(parent, myClass, setActive, hoverSpeed, style) {
	$(parent + " ." + myClass).mouseover(function() {
		// create pseudo-link
		$(this).append('<div class="nav-' + myClass + '"></div>');
		// either slide or fade, depending on the style value
		if (style == "slide") {
			// slide down the pseudo-link
			$("div.nav-" + myClass).css({display:"none"}).slideDown(hoverSpeed);
		} else {
			// fade in the pseudo-link
			$("div.nav-" + myClass).css({display:"none"}).fadeIn(hoverSpeed);
		}
	}).mouseout(function() {
		// either slide or fade, depending on the style value
		if (style == "slide") {
			// slide up & destroy pseudo-link
			$("div.nav-" + myClass).slideUp(hoverSpeed, function() {
				$(this).remove();
			});
		} else {
			// fade out & destroy pseudo-link
			$("div.nav-" + myClass).fadeOut(hoverSpeed, function() {
				$(this).remove();
			});
		}
	});


	// we only want to check the mousedown/up events if the CSS exists for :active states
	// if so, let's apply our selective filtering to undo the events above
	if (setActive) {
		$(parent + " ." + myClass).mousedown(function() {
			$("div.nav-" + myClass).attr("class", "nav-" + myClass + "-click");
		}).mouseup(function() {
			$("div.nav-" + myClass + "-click").attr("class", "nav-" + myClass);
		});
	}
}

