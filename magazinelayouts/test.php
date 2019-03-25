
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
   "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<title>Magazine Layout Example</title>
<link type="text/css" rel="StyleSheet" href="style.css" />
</head>
<body>
<h1>Magazine Layout test script</h1>




<p>Select 2 or more images to view as a magazine layout, then press the button below.</p>

<form action="/d/magazinelayouts/test.php" method="post">
<h3>Landscape Images</h3>
<div class="thumb"><label for="l1"><img src="image.php?file=l1.jpg&size=100" alt="" /><br /><input type="checkbox" name="l1" id="l1" value="l1" /></label></div>
<div class="thumb"><label for="l2"><img src="image.php?file=l2.jpg&size=100" alt="" /><br /><input type="checkbox" name="l2" id="l2" value="l2" /></label></div>
<div class="thumb"><label for="l3"><img src="image.php?file=l3.jpg&size=100" alt="" /><br /><input type="checkbox" name="l3" id="l3" value="l3" /></label></div>
<div class="thumb"><label for="l4"><img src="image.php?file=l4.jpg&size=100" alt="" /><br /><input type="checkbox" name="l4" id="l4" value="l4" /></label></div>
<div class="thumb"><label for="l5"><img src="image.php?file=l5.jpg&size=100" alt="" /><br /><input type="checkbox" name="l5" id="l5" value="l5" /></label></div>
<h3 style="clear: both;">Portrait Images</h3>
<div class="thumb"><label for="p1"><img src="image.php?file=p1.jpg&size=100" alt="" /><br /><input type="checkbox" name="p1" id="p1" value="p1" /></label></div>
<div class="thumb"><label for="p2"><img src="image.php?file=p2.jpg&size=100" alt="" /><br /><input type="checkbox" name="p2" id="p2" value="p2" /></label></div>
<div class="thumb"><label for="p3"><img src="image.php?file=p3.jpg&size=100" alt="" /><br /><input type="checkbox" name="p3" id="p3" value="p3" /></label></div>
<div class="thumb"><label for="p4"><img src="image.php?file=p4.jpg&size=100" alt="" /><br /><input type="checkbox" name="p4" id="p4" value="p4" /></label></div>
<div class="thumb"><label for="p5"><img src="image.php?file=p5.jpg&size=100" alt="" /><br /><input type="checkbox" name="p5" id="p5" value="p5" /></label></div>
<h3 style="clear: both;">Square Images</h3>
<div class="thumb"><label for="s1"><img src="image.php?file=s1.jpg&size=100" alt="" /><br /><input type="checkbox" name="s1" id="s1" value="s1" /></label></div>

<div style="clear: both;"><input type="submit" name="submit" value="View as Magazine Layout" /></div>
These images are all stored at 800px across the longest edge. Calculations for resizing images are done on the fly by the Magazine Layout script.
</form>


</body>
</html>
