addEvent(window, "load", zoom_init);


function zoom_init() {
	
if (!document.getElementsByTagName || !document.getElementById) return;

var injectionpt = document.getElementById("zoomctrl");
var body = document.getElementsByTagName("body")[0];
var toglink = injectionpt.appendChild(document.createElement('a'));


if (!injectionpt || !body || !toglink) return;

toglink.className = "zoom";
toglink.href='#';
toglink.appendChild(document.createTextNode('Zoom Layout'));

toglink.onclick = function() {
		if (this.childNodes[0].nodeValue == "Zoom Layout")
		{
			this.childNodes[0].nodeValue = 'Normal Layout';
			body.className += " zoom";
	
		} else {
			this.childNodes[0].nodeValue = 'Zoom Layout';
			body.className = body.className.replace("zoom","");
		}
		
		return false;
	}
}
	

function addEvent(elm, evType, fn, useCapture)  {
    if (elm.addEventListener) {
    elm.addEventListener(evType, fn, useCapture);
    return true;
    } else if (elm.attachEvent) {
    var r = elm.attachEvent("on"+evType, fn);
    return r;
    }
} 
