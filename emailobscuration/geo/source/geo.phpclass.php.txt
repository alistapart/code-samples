<?php
/* ----------------------------------------------------------------------------------------
Graceful E-Mail Obfuscation - PHP class (encodes e-mail addresses)
Last updated: July 31th, 2007 by Roel Van Gils
---------------------------------------------------------------------------------------- */

class geo {
	var $buffer;
	var $folder = "contact"; // Name of virtual folder (should be the same in your .htaccess file)
	var $tooltip_js_on; // When JavaScript is enabled, this tooltip is added to mail links (client side)
	var $tooltip_js_off; // When JavaScript is unavailable, this tooltip is added to mail links (server side)
	var $rot13 = true; // ROT13 encryption strengthens obfuscation 

	function go() { ob_start(array(&$this, "prepareOutput"));	}

	function prepareOutput($output) { // Replaces e-mail links with user defined URL patterns and insert JavaScript reference
		switch($this->rot13) {
			case true : // with ROT13 encryption enabled
				$parsed = preg_replace("/[\"\']mailto:([A-Za-z0-9._%-]+)\@([A-Za-z0-9._%-]+)\.([A-Za-z.]{2,4})[\"\'\?]/e", "'\"'.$this->folder.'/'.str_rot13('\\1').'+'.str_rot13('\\2').'+'.str_rot13('\\3').'\" rel=\"nofollow\" title=\"$this->tooltip_js_off\"'", $output);
				break;
			default : // with ROT13 encryption disabled
				$parsed = preg_replace("/\"mailto:([A-Za-z0-9._%-]+)\@([A-Za-z0-9._%-]+)\.([A-Za-z.]{2,4})\"/", "\"{$this->folder}/\\1+\\2+\\3\" rel=\"nofollow\"", $output);
				break;
		};
		$parsed = preg_replace("/([A-Za-z0-9._%-]+)\@/e", "substr('\\1',0,-3).'...&#64;'", $parsed); // To be sure, truncate e-mail addresses that are *not* linked (bill.ga...@microsoft.com)
		$close_head = array("</head>", "</HEAD>");
		return str_replace($close_head, $this->dropJS() . "\n</head>", $parsed);
	}

	function dropJS() { // Prepares reference to external JavaScript (required for 'decoding' email addresses)
		return "\n<script type=\"text/javascript\" src=\"" . $this->root . "geo.js.php?folder=" . urlencode($this->folder) . "&amp;tooltip_js_on=" . urlencode($this->tooltip_js_on) . "&amp;tooltip_js_off=" . urlencode($this->tooltip_js_off) . "&amp;rot13={$this->rot13}\"></script>";
	}
	
	function setTooltipJS($tooltip) {
		$this->tooltip_js_on = $tooltip;
	}
	function setTooltipNoJS($tooltip) {
		$this->tooltip_js_off = $tooltip;
	}
	function setFolder($folder) {
		$this->folder = $folder;
	}
}
?>