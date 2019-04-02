<?php
/* ----------------------------------------------------------------------------------------
Graceful E-Mail Obfuscation - Prepend this file using Apache's auto_prepend_file directive
Last updated: July 31th, 2007 by Roel Van Gils
---------------------------------------------------------------------------------------- */

require_once("geo.phpclass.php");
$geo = new geo;
$geo->root = "http://www.alistapart.com/d/emailobscuration/geo/demo/"; // Full server path (include trailing slash)
$geo->setTooltipNoJS("To reveal this e-mail address, you\'ll need to answer a simple question"); // When JavaScript is unavailable, this title is added to e-mail links
$geo->setTooltipJS("Send e-mail"); // When JavaScript is available, tooltip will be replaced by this one
$geo->setFolder("contact"); // Choose a faux folder name (update .htaccess as well if you choose something else than 'contact')
$geo->go(); // Encode e-mail links
?>