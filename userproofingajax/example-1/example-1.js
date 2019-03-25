/* Generic error handler.
 *
 * Currently just an alert, but we'll turn it into a DIV or something
 * later on.
 */
function error(msg) {
	document.getElementById("error_msg").innerHTML = msg;
	document.getElementById("error_msg").style.display = "block";
}

function clear_error() {
	document.getElementById("error_msg").style.display = "none";
}

function start_wait() {
	document.getElementById("wait_indicator").style.display = "inline";	
}

function clear_wait() {
	document.getElementById("wait_indicator").style.display = "none";
}

function submit_form_instead() {
	document.forms[0].submit();
}

/* Let's go Ajax (clap clap clapclapclap)
 */
var req; // our request object

/* Send out a request for an XML document.
 */
function loadXMLDoc(url) {
	if (window.XMLHttpRequest) { 	// native XMLHttpRequest object, Moz family
		req = new XMLHttpRequest();
		req.onreadystatechange = processReqChange;
		req.open("GET", url, true);
		req.send(null);
	} else if (window.ActiveXObject) {	// ActiveX for IE
		req = new ActiveXObject("Microsoft.XMLHTTP");
		if (req) {
			req.onreadystatechange = processReqChange;
			req.open("GET", url, true);
			req.send();
		}
	} else {
		return false;	// no Ajax methods supported
	}
	return true;
}

/* Receive the response for the XML document.
 */
function processReqChange() {
	if (req.readyState == 4) {		// 4 is "complete"
		if (req.status == 200) {		// HTTP OK
			/* The response will contain different data depending on what
			 * function called it.  So we extract the only standard data:
			 * the calling function's name.  We'll extract the data from
			 * the global req at the function level.
			 */
			if (!(response = req.responseXML.documentElement)) {
				// Earlier versions of IE make it this far before choking on the Ajax kool-aid,
				// so we provide a graceful exit to the process.
				submit_form_instead();
			} else {
				method = response.getElementsByTagName('method')[0].firstChild.data;
				eval(method + "_get()");
			}
		} else {
			error(req.status + ": A problem was encountered retrieving the XML data: \n" + req.statusText);
		}
	}
}


/* Sends one arguments to ajax/add.php:
 * 		item_text:  the text of the item to add to the list
 *
 * Returns boolean directive:  does the form get submitted or not?
 *		- true if Ajax functionality is not supported,
 *		- false otherwise.
 */
function add_post() {
	clear_error();
	
	text = document.getElementById("item_text").value;
	url = "ajax_add.php?text=" + text;
	
	/* Make it so.
	 */
	if (loadXMLDoc(url)) {
		start_wait();
		return false; // do not submit the form
	} else {
		return true; // no Ajax compatibility; submit the form
	}
}

/* Receives the results of the add operation.
 * 		<success> 	- the success flag of the operation: 1 if OK, -1 if failed
 *		<index> 	- the list index of the added item
 *		<text> 		- the text of the added item
 */
function add_get() {
	response = req.responseXML.documentElement;	
	success = response.getElementsByTagName('success')[0].firstChild.data;
	errorMsg = response.getElementsByTagName('error')[0].firstChild.data;

	clear_wait();

	if (success != "1" ) {
		error("There was an error adding the item: " + errorMsg.toString());
		return -1;
	}

	listItem = document.createElement("li");
	listItem.id = "item_" + response.getElementsByTagName('index')[0].firstChild.data;
	
	listItem.innerHTML = response.getElementsByTagName('text')[0].firstChild.data;
	
	document.getElementById("the_list").appendChild(listItem);
	document.getElementById("item_text").value = "";
}
