<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
	<title>User-Proofing Ajax: Example 2</title>
	<link rel="stylesheet" type="text/css" href="../ajaxy_goodness.css" />
	<script type="text/javascript" src="example-2.js"> </script>
</head>
<body>

<h1>User-Proofing Ajax: Example 2</h1>
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
		<p>Server-side processing delay: <select name="delay" id="server_delay">
				<option>0</option>
				<option>30</option>
				<option>60</option>
			</select> seconds
		</p>
		<p><input type="text" id="item_text" name="item_text" size="50" />
			<input type="submit" value="Add this item to the list" />
			<img id="wait_indicator" src="../images/indicator.gif" alt="Please wait..." />
		</p>
		<div id="wait_error_message">
			<p>Your request was submitted, but a response has not yet been received.  You can wait another few moments to see if the server responds, or reload the page now to see if your changes were saved.</p>
			<p><a href="example-2.php" onclick="abort_request(); location.reload();">Reload this page</a> or <a href="#" onclick="start_wait(); return false;">wait a few moments</a>.</p>
		</div>
	</form>
</div>
<div>
	<p>This version of the app has all the features of <a href="../example-1/example-1.php">Example 1</a>, as well as another error handling feature:  a timer which tracks the amount of time the request has taken, and offers the user the choice of reloading if the request takes too long.  Increase the server-side delay to get a better look.</p>
	<p><a href="?action=reset">Reset list to default values</a></p>
</div>
</body>
</html>