// Invasion of the Body Switchers
// This copyright statement must remain in place for both personal and commercial use
// ***********************************************************************************
// Creative Commons License -- http://creativecommons.org/licenses/by-nc-nd/2.0/
// Original concept and article by Malarkey (Andy Clarke) -- http://www.stuffandnonsense.co.uk/
// DOM scripting by Brothercake (James Edwards) -- http://www.brothercake.com/
// Create element and attributes based on a method by beetle -- http://www.peterbailey.net/
//************************************************
//open initialisation function
function iotbs() { switcher = new switchManager();
//************************************************



/*****************************************************************************
 Define switching controls
*****************************************************************************/


//create a switcher form ('container-id', 'label')
var screenSwitcher = new bodySwitcher('screen-switcher', 'Screen styles');

//add a new class option ('classname', 'label')
screenSwitcher.defineClass('default', 'Normal contrast');
screenSwitcher.defineClass('high', 'High contrast');
screenSwitcher.defineClass('highvisibility', 'High visibility');


var printSwitcher = new bodySwitcher('print-switcher', 'Print styles');
printSwitcher.defineClass('default', 'Default');
printSwitcher.defineClass('small-sans', 'Small sans');
printSwitcher.defineClass('large-serif', 'Large serif');


var projectionSwitcher = new bodySwitcher('projection-switcher', 'Projection styles');
projectionSwitcher.defineClass('default', 'Default');
projectionSwitcher.defineClass('fluid', 'Fluid layout');


/*****************************************************************************
*****************************************************************************/



//close initialisation function
};


//global preferences manager reference
var switcher;


//setup initialisation function
//.. gecko, safari, konqueror and generic
if(typeof window.addEventListener != 'undefined')
{
	window.addEventListener('load', iotbs, false);
}
//.. opera 7
else if(typeof document.addEventListener != 'undefined')
{
	document.addEventListener('load', iotbs, false);
}
//.. win/ie
else if(typeof window.attachEvent != 'undefined')
{
	window.attachEvent('onload', iotbs);
}


//preferences manager 
function switchManager()
{
	//string for storing the overall custom classname
	//I was originally storing it in the body class name directly
	//but 1.7+ mozilla builds were not honouring the trailing whitespace we need
	this.string  = '';
	
	//store reference to body element
	this.body = document.getElementsByTagName('body')[0];

	//store the initial classname
	this.initial = this.body.className;
	
	//if the default classname is empty, add "iotbs"
	//because we need there to be at least one classname already - 
	//the leading and trailing space in each custom classname is required, 
	//but you can't set the body classname as " something" (beginning with a leading space)
	//because that may not work in Opera 7
	if(this.initial == '')
	{
		this.initial = 'itobs';
	}
	
	//look for a stored cookie
	this.cookie = this.read();

	//if it exists
	if(this.cookie != null)
	{
		//store cookie value to string
		this.string = this.cookie;
		
		//set new body class name
		this.body.className = this.initial + this.string;
	}
	
	//*** dev
	//document.title = '<' + this.body.className.replace(/ /g,'+') + '>   [' + this.string.replace(/ /g,'+') + ']';
	
};

//set a cookie method
switchManager.prototype.set = function(days)
{
	//format expiry date
	this.date = new Date();
	this.date.setTime(this.date.getTime() + ( days *24*60*60*1000));
	
	//store the string, replacing spaces with '#' so that leading spaces are preserved
	this.info = this.string.replace(/ /g,'#');
	
	//if the value is empty, set its expiry in the past to delete the cookie
	if(this.info == '') { this.date.setTime(0); }
	
	//create the cookie
	document.cookie = 'bodySwitcher=' + this.info
		+ '; expires=' + this.date.toGMTString() 
		+ '; path=/';
		
};


//read a cookie method
switchManager.prototype.read = function()
{
	//set null reference so we always have something to return
	this.cookie = null;
	
	//if a cookie exists
	if(document.cookie)
	{
		//if it's our cookie
		if(document.cookie.indexOf('bodySwitcher')!=-1)
		{
			//extract and store relevant information (turning '#' back into spaces)
			this.cookie = document.cookie.split('bodySwitcher=');
			this.cookie = this.cookie[1].split(';');
			this.cookie = this.cookie[0].replace(/#/g,' ');
		}
	}
	
	return this.cookie;
};


//switcher form constructor
function bodySwitcher(divid, label)
{

	//create an associate array of classnames for this option
	//so we can later iterate through and remove them from the custom classname string
	this.classes = [];

	//start counting options, because we'll need the index of each option as it's created
	//so that an option can be selected by default if necessary
	this.options = 0;
	
	//outer form
	this.attrs = { 'action' : '' };
	this.form = this.createElement('form', this.attrs);
	document.getElementById(divid).appendChild(this.form);

	//fieldset inside form
	this.fieldset = this.createElement('fieldset');
	this.form.appendChild(this.fieldset);

	//label inside fieldset
	this.attrs = { 'for' : 'select-' + divid };
	this.label = this.createElement('label', this.attrs);
	this.fieldset.appendChild(this.label);

	//span inside label containing label text
	this.attrs = { 'text' : label };
	this.span = this.createElement('span', this.attrs);
	this.label.appendChild(this.span);

	//select inside label
	this.attrs = { 'id' : 'select-' + divid };
	this.select = this.createElement('select', this.attrs);
	this.label.appendChild(this.select);

	//create a global [within this scope] reference to 'this'
	var self = this;

	//bind onchange handler
	this.select.onchange = function()
	{

		//run through classnames array
		this.classLen = self.classes.length;
		for(var i=0; i < this.classLen; i++)
		{
			//remove this key (custom class name) from string
			switcher.string = switcher.string.replace(' ' + self.classes[i] + ' ','');
		}

		//get new value from option
		this.chosen = this.options[this.options.selectedIndex].value;

		//if it isn't default then add to string
		//we need both a leading and a trailing space to work with 
		//to avoid confusion with identical leading or trailing substrings in classnames,
		//such as "high" and "highcontrast" or "large-serif" and "small-serif"
		if(this.chosen != 'default')
		{
			switcher.string += ' ' + this.chosen + ' ';	
		}
		
		//set new body class name
		switcher.body.className = switcher.initial + switcher.string;

		//store changes to a cookie which expires a year from now
		switcher.set(365)
		
		//*** dev
		//document.title = '<' + switcher.body.className.replace(/ /g,'+') + '>   [' + switcher.string.replace(/ /g,'+') + ']';

	};

};

//add a new class option method
bodySwitcher.prototype.defineClass = function(key, val)
{
	//option inside select
	this.attrs = { 'value' : key, 'text' : val }; 
	this.option = this.createElement('option', this.attrs);
	this.select.appendChild(this.option);

	//check for cookie value 
	if(switcher.cookie != null)
	{
		//if value contains this key
		if(switcher.cookie.indexOf(' ' + key + ' ')!=-1)
		{
			//select this option
			this.select.selectedIndex = this.options;
		}
	}
	
	//store the classname 
	this.classes[this.options] = key;

	//increase option count
	this.options ++;

};

//create element and attributes method -- http://www.codingforums.com/showthread.php?s=&postid=151108
bodySwitcher.prototype.createElement = function(tag, attrs)
{
	//detect support for namespaced element creation, in case we're in the XML DOM
	this.ele = (typeof document.createElementNS != 'undefined') ? document.createElementNS('http://www.w3.org/1999/xhtml',tag) : document.createElement(tag);

	//run through attributes argument
	if(typeof attrs != 'undefined')
	{
		for(var i in attrs)
		{
			switch(i)
			{
				//create a text node
				case 'text' :
					this.ele.appendChild(document.createTextNode(attrs[i]));
					break;
				
				//create a class name
				case 'class' : 
					this.ele.className = attrs[i];
					break;
				
				//create a for attribute 
				case 'for' : 
					this.ele.setAttribute('htmlFor',attrs[i]);
					break;
				
				//create a generic attribute using IE-safe attribute creation
				default : 
					this.ele.setAttribute(i,'');
					this.ele[i] = attrs[i];
					break;
			}
		}
	}
	return this.ele;
};
