<?php
/* ----------------------------------------------------------------------------------------
Graceful E-Mail Obfuscation - Demos script
Last updated: July 31th, 2007 by Roel Van Gils
---------------------------------------------------------------------------------------- */

if ( (!isset($_POST['text'])) || (strlen($_POST['txt']) != 0)) 
$snippet = <<<EOD
<ul>
  <li>Contact our <a href="mailto:sales@company.com">sales department</a>.</li>
  <li>Contact the <a href="mailto:roel.vangils@company.com">webmaster</a>.</li>
</ul>
EOD;
else $snippet = stripslashes($_POST['text']);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<title>Graceful E-Mail Obfuscation - Demonstration</title></head>
<body>
<h1>Graceful E-Mail Obfuscation - Demonstration</h1>
<h2>Instructions</h2>
<p>Paste some <abbr title="Hypertext Markup Language">HTML</abbr> code that contains one or more references to e-mail addresses and/or mailto links. Note: if you're pasting the source code of an entire web page, make sure the page doesn't have an onLoad handler of its own (in real world situations, you'll need to add the call to makeMailtoLinks() to a global onLoad handler).</p>
<p>Look at the source code to understand what's happening. Try to disable JavaScript (and refresh this page) to see what happens when you click an e-mail link.</p>
<h2>Example <abbr title="Hypertext Markup Language">HTML</abbr></h2>
<form action="" method="post">
<p>
<label for="text">Paste HTML here</label><br />
<textarea name="text" id="text" cols="100" rows="10">
<?php echo str_replace('@','&#64;',htmlentities($snippet)) ?>
</textarea>
<br />
<input type="submit" value="Submit" />
</p>
</form>
<h2>Example output</h2>
<?php echo $snippet ?>
</body>
</html>