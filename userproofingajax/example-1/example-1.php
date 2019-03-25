<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
	<title>User-Proofing Ajax: Example 1</title>
	<link rel="stylesheet" type="text/css" href="../ajaxy_goodness.css" />
	<script type="text/javascript" src="example-1.js"> </script>
</head>
<body>

<h1>User-Proofing Ajax: Example 1</h1>
<div>
	<ul id="the_list">
		<li id="item_0">my first list item</li>
<li id="item_1">my second list item</li>
<li id="item_2">my third list item</li>
	</ul>
</div>
<div id="error_msg">
	
</div>
<div>
	<form action="traditional_add.php" method="get" onsubmit="return add_post();">
		<p><input type="text" id="item_text" name="item_text" size="50" />
			<input type="submit" value="Add this item to the list" />
			<img id="wait_indicator" src="../images/indicator.gif" alt="Please wait..." />
		</p>
	</form>
</div>
<div>
	<p>This is an Ajax app with what you might call the factory default usability settings.  It supports browsers with scripting turned off, and it will give you a helpful error message if you try to add a blank or duplicate item, but it won't do anything beyond that.</p>
	<p>This list is built using cookie-based session management.  Cookies must be enabled for this app to work perfectly (although the Ajax bits will still work fine, really).</p>
	<p><a href="?action=reset">Reset list to default values</a></p>
</div>
</body>
</html>