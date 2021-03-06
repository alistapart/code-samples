var AriaTabs2b = (function() {
	$(function() {
		//for each tabs DIV...
		$("#tabs").each( 
			function(t){
				var tabsDiv=$(this);
				//for each individual tab DIV, set class, and hide it
				$(tabsDiv).find(">div").attr("class","tabPanel").hide();
				//get the list of tab links
				var tabsList=$(this).find("ul:first").attr("class","tabsList"); 
				//for each item in the tabsList...
				$(tabsList).find("li>a").each(
					function(a){
						//create a unique id using the tab link's href
						var tabId="tab-"+$(this).attr("href").slice(1);
						//assign tabId to the tab control, but do not remove the href
						$(this).attr("id",tabId);
						//set the click event for each tab link
						$(this).click(
							function(e){
								//prevent default click event
								e.preventDefault();
								//change state of previously selected tabList item
								$(tabsList).find(">li.current").removeClass("current").find(">a");
								//hide previously selected tabPanel
								$(tabsDiv).find(".tabPanel:visible").hide();
								//show newly selected tabPanel
								$(tabsDiv).find(".tabPanel").eq($(this).parent().index()).show();
								//set state of newly selected tab list item
								$(this).parent().addClass("current");
								$(this).focus();
							}
						);
					}
				);
				
				//set keydown events on tabList item for navigating tabs
				$(tabsList).delegate("a", "keydown",
					function (e) {
						switch (e.which) {
							case 37: case 38:
								if ($(this).parent().prev().length!=0) {
									$(this).parent().prev().find(">a").click();
								} else {
									$(tabsList).find("li:last>a").click();
								}
								break;
							case 39: case 40:
								if ($(this).parent().next().length!=0) {
									$(this).parent().next().find(">a").click();
								} else {
									$(tabsList).find("li:first>a").click();
								}
								break;
						}
					}
				);
				//show the first tabPanel
				$(tabsDiv).find(".tabPanel:first").show();
				//set state for the first tabsList li
				$(tabsList).find("li:first").addClass("current");
		
			}
		);
	});
})();
