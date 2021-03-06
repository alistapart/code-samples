<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<title>A List Apart: Articles: Flash: A Team Player: Example &ldquo;Ratings&rdquo; page</title>
<script type="text/javascript" src="/js/swfobject.js"></script>
	<style type="text/css">
	<!--
	
	* { margin: 0; padding: 0; line-height: 1.4; }
	body { font: 62.5% Georgia, 'Times New Roman', serif; background-color: #fffdee; color: #332; }
	h1 { margin: 0 0 0.5em 158px; font: normal 17px 'Lucida Grande', 'Lucida Sans Unicode', 'Trebuchet MS', Arial, sans-serif; color: #060; }
	* html h1 { font-size: 1.7em; margin-left: 161px;}
	p { font-size: 12px; margin: 0 0 1em 158px; }
	* html p { font-size: 1.2em; margin-left: 161px; }
	
	ul { margin: 30px 0 0 30px; list-style: none; }
		li { width: 460px; clear: left; float: left; background: transparent url(review_bottom.gif) no-repeat left bottom; margin: 0 0 2em; }
		li img { float: left; }		

		.review { background: transparent url(review_top.gif) no-repeat 0 0; padding: 2em 20px; }

	.buy { display: block; width: 112px; height: 22px; text-indent: -9999px; background: transparent url(buy.gif) no-repeat 0 0; margin: 0 0 0 158px; }
	.buy:hover, .buy:focus { background-position: 0 -22px; }
	* html .buy { margin-left: 161px; }
	
	.rating { display: block; text-indent: -9999px; height: 15px; border-bottom: 1px solid #c1bda1; padding: 0 0 12px; }
	.stars3 { background: transparent url(stars3.gif) no-repeat 0 0; }
	.stars4 { background: transparent url(stars4.gif) no-repeat 0 0; }
	.stars3half { background: transparent url(stars3half.gif) no-repeat 0 0; }
	.shiny { float: left; }
	
	-->
	</style>
	
	<!--[if IE 6]><script type="text/javascript">	try { document.execCommand('BackgroundImageCache', false, true); } catch(e) {}</script><![endif]-->
	
	<script type="text/javascript">
	
		function shinyCDs(){
			
			if(!document.getElementsByTagName || !document.getElementById) { return; }					
			
			var covers = document.getElementsByTagName('img');
			
			for(var i = 0; i < covers.length; i++){

				var newflash, newflash_param;
				
				newflash_div = document.createElement('div');
				newflash_div.className = 'shiny';
				
				covers[i].parentNode.insertBefore(newflash_div, covers[i]);
				
				var so = new SWFObject("covers.swf", "mymovie", "138", "211", "7", "#dbd8b7");
				so.addVariable('jpg', covers[i].getAttribute('src'));
				so.write(newflash_div);

 			}
		
 			while(covers.length > 0){
 				covers[0].parentNode.removeChild(covers[0]);
			}

		
		}
		
		window.onload = shinyCDs;
	
	</script>
	
</head>

<body>

	<ul>

		<li>
			<?php ".review" ?><div class="review">
				
				<img src="request.jpg" alt="Cover of &ldquo;Hey Jacks: The Review&rdquo;" />				
				
				<h1>Hey Jacks: The Request</h1>
				
				<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
				
				<p class="rating stars3">3 out of 5</p>
				
				<a class="buy" href="#" title="Buy this album">Buy this album</a>
			
			</div><?php "/.review" ?>
			
		</li>
	
		<li>
			<?php ".review" ?><div class="review">
				
				<img src="elemental.jpg" alt="Cover of &ldquo;Eksemel: Elemental&rdquo;" />
				
				<h1>Eksemel: Elemental</h1>
				
				<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
				
				<p class="rating stars4">4 out of 5</p>
				
				<a class="buy" href="#" title="Buy this album">Buy this album</a>
			
			</div><?php "/.review" ?>
		
		</li>
		
		<li>	
	
			<?php ".review" ?><div class="review">
			
				<img src="handle.jpg" alt="Cover of &ldquo;ONCLICK: Handle with Caution&rdquo;" />
								
				<h1>ONCLICK: Handle with Caution</h1>
				
				<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
				
				<p class="rating stars3half">3&#189; out of 5</p>
				
				<a class="buy" href="#" title="Buy this album">Buy this album</a>
			
			</div><?php "/.review" ?>
			
		</li>
	
	</ul>
	

</body>
</html>