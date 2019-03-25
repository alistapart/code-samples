/*
 * testUserDevice.js 2.0
 * Authored by Scott Jehl, Filament Group (filamentgroup.com)
 * Date: July 2007 (latest rev. July 2008)
 * Dual licensed under the MIT (filamentgroup.com/examples/mit-license.txt) and GPL (filamentgroup.com/examples/gpl-license.txt) licenses.
  
 * Purpose: This script is used to test the capabilities of a browser and enable development based on the test results
 * Usage: There are many ways to use this script. 
 	- API: 
 		testUserDevice.init();
 		- Pass function as argument to execute scripting upon a passing test:
 		testUserDevice.init( function(){...} );
 		- Optional: for custom test cases, pass argument for Array of test case Objects
 		- Argument schema (per Array Object):
				testName: string
				pass: Array of Strings corresponding to test names
				scripting: Function. Executes upon passing test case.
		- full example:
				testUserDevice.init([{
						testName: 'ajaxCapable', 
						pass: ['ajax'], 
						scripting: function(){ useAjax(); }  
					}]);
					
		--> Explanation of code above:
		testName: 'ajaxCapable' 
			- Upon passing, the following will happen:
			1. 'ajaxCapable' will be added as a class name to the body element. 
			2. Any link elements with a title attribute matching "ajaxCapable" will be enabled
			3. Any link elements with a title attribute matching "not_ajaxCapable" will be disabled
			4. A cookie will be set so this test will not need to run again. cookie: "ajaxCapable=pass"
		pass: ['ajax']
			- To test only certain tests, set 'pass' property to an array of test names. pass: ['test1', test2'] 
		scripting: function(){ useAjax(); }  
			- Upon passing, any scripting passed within this function will execute.

 * Changes: 2.0: Full rewrite. Major enhancements made in speed and flexibility. Not backwards compatible with previous versions due to api changes.
 			1.3: Script now checks to make sure body doesn't already have 'enhanced' class before applying.
 			1.2: class and cookie name has been changed to "enhanced". This may break backward compatibility with older implementations of this test.
 * Additional Info: visit http://alistapart.com/ or http://filamentgroup.com/lab/delivering_the_right_experience_to_the_right_device/
*/
var testUserDevice = {
	init: function(settings){
		//default test - all tests
		var testCases = [{testName: null, pass: null, scripting: null}]; //sample interface for testCases
		var useCookies = true; //set to false to never get or set cookies with this script
		var log = false; //set to false to disable developer console logging
		if(settings){
			if(settings.constructor == Array){ //settings arg can be a full array replacement
				testCases = settings;
			}
			else if(settings.constructor == Function) { //or just a function
				testCases[0].scripting = settings;
			}
		}	
		var capabilities = this.tests; //test results Object
		//run tests as soon as body element is available
		var checkBody = setInterval(bodyReady, 1);
		function bodyReady(){
			if(document.body){
				clearInterval(checkBody); //body is ready, stop asking
				//loop through the tests
				for(var i=0; i<testCases.length; i++){
					var thisTest = testCases[i]; //current set of tests
					if(!thisTest.testName) {thisTest.testName = 'enhanced';}
					var testResult = 'pass'; //innocent until proven...
					if(document.cookie.indexOf(thisTest.testName+'=')>-1 && useCookies){
						var cookiechunk = document.cookie.split(thisTest.testName+'=');
						(cookiechunk.length == 1) ? testResult = cookiechunk[0].split(';')[0] : testResult = cookiechunk[1].split(';')[0];
					}
					else {//test hasn't run before or cookies are disabled, run it
						if(!thisTest.pass){ //if all tests are requested
							var x = 0;
							for(var value in capabilities){
								if(!capabilities[value]()){testResult = 'fail';} //one is all it takes
								if(log){ console.log(value +' = '+ capabilities[value]()); }
							}
						}
						else if(thisTest.pass && thisTest.pass.constructor == Array){ //if only specific tests are requested
							for(var j=0; j<thisTest.pass.length; j++){
								if(!capabilities[thisTest.pass[j]]()){testResult = 'fail';} //one is all it takes
								if(log){ console.log(thisTest.pass[j] +' = '+ capabilities[thisTest.pass[j]]()); }
							}
						}
						//set cookie for future page loads
						if(useCookies){document.cookie = thisTest.testName +'='+ testResult +';';}
						
					}
					//enhance the page based on test results
					if(testResult == 'pass'){
						//add body class				
						if (document.body.className.indexOf(thisTest.testName) <= -1){
							document.body.className += ' '+ thisTest.testName;
						}
						//function to enable alternate stylesheets with title attr's equal to this test's title
						var allLinks = document.getElementsByTagName('link');
						for(var k=0; k<allLinks.length; k++){
							//disable any links with a title attr of "not_" preceding this test's title
							if (allLinks[k].title == 'not_'+thisTest.testName){
								allLinks[k].disabled = true;
								allLinks[k].rel = 'alternate stylesheet';
							}
							//enable any links with a title attr of test's title
							if (allLinks[k].title == thisTest.testName){
								allLinks[k].disabled = true; //opera likes to have it toggled
								allLinks[k].disabled = false;
								allLinks[k].rel = 'stylesheet';
							}
						}
						//if there's a scripting method, init
						if(thisTest.scripting){thisTest.scripting();} 
					}
				}// /test loop
			}// /if doc.body
		}// /bodyReady func
		//test is done, return capabilities object
		return capabilities;
	},	
	tests: {}, //tests object to be populated by test functions
	add: function(testName, testScripting){
		this.tests[testName] = testScripting;
		return this;
	}
};




//configurable tests 
testUserDevice.tests = {
	getById: function(){
		return document.getElementById ? true : false;
	},
	createEl: function(){
		return document.createElement ? true : false;
	},
	boxmodel: function(){
		var newDiv = document.createElement('div');
		document.body.appendChild(newDiv);
		newDiv.style.width = '20px';
		newDiv.style.padding = '10px';
		var divWidth = newDiv.offsetWidth;
		document.body.removeChild(newDiv);
		return divWidth == 40;
	},
	positioning: function(){
		var newDiv = document.createElement('div');
		document.body.appendChild(newDiv);
		newDiv.style.position = 'absolute';
		newDiv.style.left = '10px';
		var divLeft = newDiv.offsetLeft;
		document.body.removeChild(newDiv);
		return divLeft == 10;
	},
	float: function(){
		var newDiv = document.createElement('div');
		document.body.appendChild(newDiv);
		newDiv.innerHTML = '<div style="width: 5px; float: left;"></div><div style="width: 5px; float: left;"></div>';
		var divTopA = newDiv.childNodes[0].offsetTop;
		var divTopB = newDiv.childNodes[1].offsetTop;
		document.body.removeChild(newDiv);
		return divTopA == divTopB;
	},
	clear: function(){
		var newDiv = document.createElement('div');
		document.body.appendChild(newDiv);
		newDiv.style.visibility = 'hidden';
		newDiv.innerHTML = '<ul><li style="width: 5px; float: left;">test</li><li style="width: 5px; float: left;clear: left;">test</li></ul>';
		var liTopA = newDiv.getElementsByTagName('li')[0].offsetTop;
		var liTopB = newDiv.getElementsByTagName('li')[1].offsetTop;
		document.body.removeChild(newDiv);
		return liTopA != liTopB;
	},
	overflow: function(){
		var newDiv = document.createElement('div');
		document.body.appendChild(newDiv);
		newDiv.innerHTML = '<div style="height: 10px; overflow: hidden;"></div>';
		var divHeight = newDiv.offsetHeight;
		document.body.removeChild(newDiv);
		return divHeight == 10;
	},
	/*//unitless lineheight test - fails firefox 1, but also in iPhone. Pulled for irrellevance to this layout
	lineheight: function(){ 
		var newDiv = document.createElement('div');
		document.body.appendChild(newDiv);
		newDiv.innerHTML = '<div style="line-height: 2; font-size: 10px;">Te<br />st</div>';
		var divHeight = newDiv.offsetHeight;
		document.body.removeChild(newDiv);
		return divHeight == 40;
	},*/
	ajax: function(){
		//factory test borrowed from quirksmode.org
		var XMLHttpFactories = [
			function () {return new XMLHttpRequest()},
			function () {return new ActiveXObject("Msxml2.XMLHTTP")},
			function () {return new ActiveXObject("Msxml3.XMLHTTP")},
			function () {return new ActiveXObject("Microsoft.XMLHTTP")}
		];
		var xmlhttp = false;
		for (var k=0;k<XMLHttpFactories.length;k++) {
			try {xmlhttp = XMLHttpFactories[k]();}
			catch (e) {continue;}
			break;
		}
		return xmlhttp ? true : false;
	},
	resize: function(){
		return (window.onresize == false) ? false : true
	},
	print: function(){
		return window.print ? true : false
	}
};



