<?php
/* ----------------------------------------------------------------------------------------
Graceful E-Mail Obfuscation - Non-Javascript fallback page
Last updated: July 31th, 2007 by Roel Van Gils
---------------------------------------------------------------------------------------- */

session_start();
if ( (!$_POST['check']) || ($_POST['check'] && ($_POST['product'] != $_SESSION['result'])) ) { // Prepare a math question
	$digits = array(1 => "one", 2 => "two", 3 => "three", 4 => "four", 5 => "five", 6 => "six", 7 => "seven", 8 => "eight", 9 => "nine"); 	
	define('PRODUCT', 'What is the product of %1$s and %2$s?');
	$x = rand(1,(count($digits)-1)); 
	do { $y = rand(1,(count($digits)-1)); } while ($x == $y);
	$_SESSION['result'] = $x * $y;
	$email = strip_tags(substr(str_rot13($_GET['n']),0,-3) . '...&#64;' . str_rot13($_GET['d']) . '.' . str_rot13($_GET['t']));
}
else { // Correct answer?
	$email = strip_tags(str_rot13($_GET['n']) . '&#64;' . str_rot13($_GET['d']) . '.' . str_rot13($_GET['t'])); // Construeer e-mailadres
	$human = true;
	session_destroy();
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<?php if ($human) : ?><meta http-equiv="refresh" content="0;URL=mailto:<?=$email?>" /><?php endif; ?>
<title>Send an e-mail</title>
</head>

<body>
<?php echo $_GET['product']; ?>
<div id="wrap">
	
	<h1>You're about to send an e-mail to <strong><?php echo $email ?></strong></h1>
	<div id="question">

	<?php if (!$human) : ?>

	<form action="" method="post">	
		<fieldset>
			<legend>Please answer this simple math question to continue (use digits only).</legend>
			<label for="product"><?php printf(PRODUCT, $digits[$x], $digits[$y]) ?></label>
			<input type="text" size="2" maxlength="2" name="product" id="product" />
			<input type="hidden" name="check" value="true" />
			<input type="submit" name="submit" id="submit" value="Continue (compose new message)" />
		</fieldset>
	</form>
	<p><a href="">Give me another question</a></p>
	</div>

	<div id="info">
		<h2>Why must I answer this question?</h2>
		<p>The aim of this check is to protect the owner of the e-mail address from receiving unsolicited e-mail.</p>
		<p>Although spammers can rent or buy existing e-mail lists, many opt to use software known as 'e-mail harvesters' (often referred to as 'spam bots') that extract e-mail addresses from web pages. These e-mail harvesters work very much the same way search engine spiders do and try to collect every e-mail adress they encounter on the web. However, the brute force algorithms they use, are not able to answer the simple question above. So, basically, we're testing whether you're human or not.</p>
		<p><a href="http://en.wikipedia.org/wiki/E-mail_spam" title="Article on Wikipedia">Read more about spam and how to prevent it </a></p>
	</div>
	<?php else : ?>
	<p>We've opened up your e-mail program. If that didn't work, please click <a href="mailto:<? echo $email ?>"><?=$email?></a>.</p>
	<?php endif; ?>
</div>
</body>
</html>