/*
 *	function showlinks()
 *	Adds a navigation dropdown to the document, which gets
 *  populated by the data in the LINK tags of the document
 *  written by Christian Heilmann (http://icant.co.uk/)
 */
function showlinks()
{
// variables to change
	var elementid='linksnavigation'; 
	var elementtype='div';
	var dropdownlabel='Quick Jump to:';
	var dropdownbutton='jump';
	var dropdownid='linksnavigationdropdown';
// Check for DOM capabilities
	if(document.getElementById && document.createTextNode)
	{
// get all link elements of the current page and check if there are some
		pagelinks=document.getElementsByTagName('link');
		if(pagelinks.length>0)
		{
// creating local variables
			var ispage,linksgen,pagelinks,linksdiv,linksform,count;
			var linkslabel,linkssel,linkssubmit,newop,relatt,sel;
			var count=0; 
// check if the parent element already exists, if not, create it
			if(document.getElementById(elementid))
			{
				linksdiv=document.getElementById(elementid);
				linksgen=false;
			} else {
				linksgen=true;
				linksdiv=document.createElement(elementtype);
				linksdiv.setAttribute('id',elementid);
			}
// create dropdown form
			linksform=document.createElement('form');	
			linkslabel=document.createElement('label')
			linkslabel.appendChild(document.createTextNode(dropdownlabel));
			linkslabel.setAttribute('for',dropdownid);
			linkssel=document.createElement('select')
			linkssel.setAttribute('id',dropdownid);
			linkssubmit=document.createElement('input');
			linkssubmit.setAttribute('type','submit');
			linkssubmit.setAttribute('value',dropdownbutton);
// loop over link elements
			for(i=0;i<pagelinks.length;i++)
			{
// grab the rel attribute, and don't take any containing sheet
				relatt=pagelinks[i].getAttribute('rel');
				if(!/sheet/i.test(relatt))
				{
// create the dropdown options from the title and href attributes 
					newop=document.createElement('option');
					newop.appendChild(document.createTextNode(pagelinks[i].getAttribute('title')));
					newop.setAttribute('value',pagelinks[i].getAttribute('href'));
// check if the current location contains the href link
					if(document.location.href.indexOf(pagelinks[i].getAttribute('href'))!=-1){
						ispage=count;
					}
					linkssel.appendChild(newop)
					count++;
				}
			}	
// set the selection to the current page
			linkssel.selectedIndex=ispage?ispage:0;
			
// add the javascript to send the browser to the dropdown location
			linksform.onsubmit=function(){
				sel=document.getElementById(dropdownid);
				self.location=sel.options[sel.selectedIndex].value;
				return false;
			};
// assemble the form HTML and append it to the element
			linksform.appendChild(linkslabel);
			linksform.appendChild(linkssel);
			linksform.appendChild(linkssubmit);
			linksdiv.appendChild(linksform);
// add the element as the first body child if it is not there yet
			if(linksgen)
			{
				document.body.insertBefore(linksdiv,document.body.firstChild);
			}
		}
	}
}
// call showlinks when the page is loaded
window.onload=showlinks