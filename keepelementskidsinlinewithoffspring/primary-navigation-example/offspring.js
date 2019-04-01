/* 
	Offspring.js -- adds the following classes as needed:
	
		.first-child
		.last-child
		.only-child
		.nth-child-odd
		.nth-child-even
		.nth-child-##
		
	================================================================== */


var offspring = {
	firstChildClass: "first-child",
	lastChildClass:  "last-child",
	oddChildClass:   "nth-child-odd",
	evenChildClass:  "nth-child-even",
	onlyChildClass:  "only-child",
	nthChildClassPrefix:   "nth-child-",
	
	classNamesArray: [],
	classNameSubstringsArray: [],
	
	cacheLevel: 0, // current size of the classNames cache
	
	nthChildren: [],
	
	regularHashTable: [],
	regularHashTableArray: [],
	
	lastChildHashTable: [],
	lastChildHashTableArray: [],

	// Initialize
	init: function() {
		
		/* Set the values for classNamesArray & classNameSubstringArray */
		
		// this represents all possible offspring-related classnames
		this.classNamesArray = [this.firstChildClass, this.lastChildClass, this.oddChildClass, this.evenChildClass, this.onlyChildClass];
		
		// this represents a list of substrings to match such as for removing classNames
		this.classNameSubstringsArray = [this.nthChildClassPrefix];
		
		var _this = this; // Closure
		
		this.addEvent(window, "load", function() {
			_this.onload();
		});
	
	},

	// Executed once the page has loaded
	onload: function() {

		this.traverseChildren(document.getElementsByTagName("body")[0]);
	},

	// Recursive
	
	/* 
		If "shouldRemoveOldOffspringClassesFirst" is deined and set to true 
	 	(it's opt8ional), traverseChildren will remove old Offspring-related
	 	classes before applying new ones to a node. This could be useful
	 	for reapplying classes if the DOM is rejiggered.
	*/
	
	traverseChildren: function(parent, shouldRemoveOldOffspringClassesFirst) {
		
		// If the node has no children, exit
		if (!parent.childNodes.length) return;
		
		/* This way, if shouldRemoveOldOffspringClassesFirst isn't sent in,
			its value is affirmatively set to false */
		if (!shouldRemoveOldOffspringClassesFirst)
		{
			var shouldRemoveOldOffspringClassesFirst = false;
		}
		
		/* First, gather up all the element nodes */
		var childElementNodes = [];
		
		var testNode = parent.childNodes[0]; // initialize
		
		while (testNode)
		{
			if (testNode.nodeType == 1)
			{
				childElementNodes.push(testNode);
			}
			testNode = testNode.nextSibling;
		}
		
		/* 
			empty this variable to ensure that the JavaScript 
			interpreter doesn't have to update the variable's 
			nodelist as DOM changes are made 
		*/
		testNode = null; 
		
		var childElementNodesLength = childElementNodes.length;
		
		// If no element nodes were found, exit
		if (!childElementNodesLength) return;
		
		// Make sure that the CSS-classnames cache has enough entries to cover 
		// the number of child nodes
		if (childElementNodesLength > this.cacheLevel)
		{
			this.fillCacheTo(childElementNodesLength);
		}
		
		var lastIndex = childElementNodesLength - 1; // index of the last element node
		
		/* ==== Add the classes ====== */
		
		switch (shouldRemoveOldOffspringClassesFirst)
		{
			case true: // shouldRemoveOldOffspringClassesFirst is true
			
					// First, take care of all but the last element
					for (var i = 0; i < lastIndex; i++)
					{
						var currentElement = childElementNodes[i];

						this.removeMultipleClassNames(currentElement, this.classNamesArray, this.classNameSubstringsArray);		

						// argument syntax: node to act upon, current index, boolean for whether isLast
						this._addOffspringClassNames(currentElement, i, false);
						this.traverseChildren(currentElement);
					}

					currentElement = null; // prevent memory leaks

					// Then, take care of the last one
					var lastElement = childElementNodes[lastIndex];

					this.removeMultipleClassNames(lastElement, this.classNamesArray, this.classNameSubstringsArray);		

					this._addOffspringClassNames(lastElement, lastIndex, true);
					this.traverseChildren(lastElement);
					
					break;
					
				case false: // shouldRemoveOldOffspringClassesFirst is false
				
					// First, take care of all but the last element
					for (var i = 0; i < lastIndex; i++)
					{
						var currentElement = childElementNodes[i];

						// argument syntax: node to act upon, current index, boolean for whether isLast
						this._addOffspringClassNames(currentElement, i, false);
						this.traverseChildren(currentElement);
					}

					currentElement = null; // prevent memory leaks

					/* 
						Then, take care of the last one
						(this set of code isn't integrated into
						the for-loop above so as to avoid having
						an addiitional if-statement inside there) 
					*/
					var lastElement = childElementNodes[lastIndex];

					this._addOffspringClassNames(lastElement, lastIndex, true);
					this.traverseChildren(lastElement);
					
					break;
			
		} // end of switch-statement for shouldRemoveOldOffspringClassesFirst
		
		// prevent memory leaks
		lastElement = null; 
		parent = null;
		
	},
	
	/*
		This function adds the Offspring classnames to a given element, 
		given its position among it siblings (with zero being "first")
		and whether it's the last element in its set.
	*/
	_addOffspringClassNames: function(element, index, isLastElement) {
		
		index++; // normalize since the arrays are indexed with a "1" starting point
		
		// Steps if the element has no existing classnames...
		
		if ((!element.className) || (!element.className.length))
		{
			switch (isLastElement)
			{
				case false: // it isn't the last element
						element.className = this.regularHashTable[index];
						return;
						break;
					
				case true: // it is the last element
				 		element.className = this.lastChildHashTable[index];
						return;
						break;
						
			} // end of isLastElement switch-statement
			
		} // end of if-statement for checking whether the element has no existing className
		
		// At this point, the incoming element already has className(s)
		
		switch (isLastElement)
		{
			case false: // it isn't the last element
					var applicableClassNames = this.regularHashTableArray[index];
					break;
					
			case true: // it is the last element
					var applicableClassNames = this.lastChildHashTableArray[index];
					break;
					
		} // end of isLastElement switch-statement
		
		var originalClassNames = element.className.split(' ');			
		
		var classNamesToAdd = originalClassNames; // initialize
		
		for (var i = 0, applicableClassNamesLength = applicableClassNames.length; i < applicableClassNamesLength; i++)
		{
			var alreadyThere = false; // boolean for whether a given class name is already assigned to the element
			
			var testApplicableClassName = applicableClassNames[i];
			
			for (var j = 0, originalClassNamesLength = originalClassNames.length; j < originalClassNamesLength; j++)
			{
				if (originalClassNames[j] == testApplicableClassName)
				{
					alreadyThere = true;
					break;
				} // end of if-statement for checking if the element already has a given className
				
			} // end of the originalClassNames for-loop
			
			if (!alreadyThere)
			{
				classNamesToAdd.push(testApplicableClassName);
			}
			
		} // end of applicableClassNames for-loop
		
		
		// Then, after checking over the element's existing classNames, add the new version
		element.className = classNamesToAdd.join(' ');
		element = null; // prevent memory leaks
		
		return;
		
	}, // end of _addOffspringClassNames()
	
	// This fills the className caches to the specified amount
	fillCacheTo: function(fillAmount) {
		
		var fillAmount = fillAmount || 15; // default value
		
		if (!this.cacheLevel) this.cacheLevel = 0; // set this to a default value if needed
		
		// If the cache level is already full enough, exit
		if (this.cacheLevel >= fillAmount) return;
		
		var startingPoint = this.cacheLevel++;
		
		var isOdd = !((startingPoint % 2) == 0); // initialize
		
		// cache these object name resolutions
		var firstChildClass = this.firstChildClass;
		var lastChildClass = this.lastChildClass;
		var oddChildClass = this.oddChildClass;
		var evenChildClass = this.evenChildClass;
		var onlyChildClass = this.onlyChildClass; // Node to self: Don't forget to account for this guy
		var nthChildClassPrefix = this.nthChildClassPrefix;
		
		for (var i = startingPoint; i <= fillAmount; i++)
		{
			this.nthChildren[i] = [nthChildClassPrefix, i].join('');
			
			var nthChildrenI = this.nthChildren[i]; // cache this look-up
			
			switch (i)
			{
				case 1:
						this.regularHashTableArray[i] = [firstChildClass, oddChildClass, nthChildrenI];
						this.lastChildHashTableArray[i] = [firstChildClass, oddChildClass, onlyChildClass, nthChildrenI, lastChildClass];
						break;
						
				default:
						switch (isOdd)
						{
							case true: // "odd" is true
									this.regularHashTableArray[i] = [oddChildClass, nthChildrenI];
									this.lastChildHashTableArray[i] = [oddChildClass, nthChildrenI, lastChildClass];
									break;
									
							case false: // "odd" is false
									this.regularHashTableArray[i] = [evenChildClass, nthChildrenI];
									this.lastChildHashTableArray[i] = [evenChildClass, nthChildrenI, lastChildClass];
									break;
							
						} // end of isOdd switch-statement
						
						
			} // end of switch-statement for i
			
			// Now make the joined versions for a given "i"
			
			this.regularHashTable[i] = this.regularHashTableArray[i].join(' ');
			this.lastChildHashTable[i] = this.lastChildHashTableArray[i].join(' ');
			
			isOdd = !isOdd; // flip the isOdd flag
			
		} // end of filling for-loop
		
		// If it got this far, the cacheLevel must made it to the fill amount, so update that
		this.cacheLevel = fillAmount;
		
	}, // end of fillCacheTo()
	
	/* Returns true if testString is found in the array,
		or returns false otherwise */
	_checkIfStringFoundInArray: function(testString, testArray) {
		
		// Loop through all testArray[] and if/when there's a match, return true
		for (var i = 0, len=testArray.length; i < len; i++) 
		{
			if (testString == testArray[i]) return true;
		}
		
		// If it got this far, it must not have found the string in the array
		return false;
		
	}, // end of _checkIfStringFoundInArray
	
	/* Returns true if the beginning of testString matches one of the substrings 
		in the array. Otherwise, it returns false.
		
		For example, given the array ['plum', 'orange', 'pine'] and
		the testString 'pineapples', the function would return true. However,
		given the testString 'range', it would return false (since none of
		the strings in the array start with 'range')
	*/
	_checkIfStringMatchInSubstringArray: function(testString, testArray) {
		
		// Loop through all testArray[] and if/when there's a match, return true
		for (var i = 0, len=testArray.length; i < len; i++) 
		{
			var currentArrayItem = testArray[i];
			
			/* string.substr() accepts two parameters:
				- The starting point of the substring
				- The length of the substring
			*/
			var testSubstring = testString.substr(0, currentArrayItem.length);
			
			if (testSubstring == currentArrayItem) return true;
		}
		
		// If it got this far, it must not have found the string in the array
		return false;
		
	}, // end of _checkIfStringMatchInSubstringArray
	
	/*
		This removes multiple classnames from an element. It does this by
		checking each of an element's class names against  
		classNameStrings[] for an exact match and, if a given class name
		didn't match there, it's then checked to see if it matches
		as a substring against classNAmeSubstrings[]. 
		
		Of note, when comparing substrings, this intentionally only compares
		the beginning of the strings for a match. So, for example, "ora" would
		match as a substring of "orange", but "range" would not match as a substring
		of "orange". It was done this way because that was the only type of substring-
		comparison that was needed in this case, and a more thorough substring
		comparison would needlesslly use processor time.
	*/
	removeMultipleClassNames: function(element, classNameStrings, classNameSubstrings) {
		
		if (!element) return;
		var newClassName = '';
		var classNamesArray = element.className.split(' ');
		
    	for (var i = 0, len = classNamesArray.length; i < len; i++) 
		{
			var currentClassName = classNamesArray[i];
			
			var isStringInClassNameStrings = this._checkIfStringFoundInArray(currentClassName, classNameStrings);
			
			if (isStringInClassNameStrings) continue;
			
			var isStringMatchingClassNameSubstrings = this._checkIfStringMatchInSubstringArray(currentClassName, classNameSubstrings);
			
			if (isStringMatchingClassNameSubstrings) continue;
      		
			// If it got this far, it must not have matched any of the potential classNameStrings
			// or classNameRegexes, so add the current iteration to the neClassName
			
			if (i > 0) newClassName = newClassName + ' ';
    		newClassName = newClassName + currentClassName;

    	}
   		element.className = newClassName;

	}, // end of removeMultipleClassNames

	// Flexible JavaScript Events - John Resig
	// http://ejohn.org/projects/flexible-javascript-events/
	//===========================================================================

	addEvent: function( obj, type, fn ) {
		if (obj.addEventListener)
			obj.addEventListener( type, fn, false );
		else if (obj.attachEvent)
		{
			obj["e"+type+fn] = fn;
			obj[type+fn] = function() { obj["e"+type+fn]( window.event ); }
			obj.attachEvent( "on"+type, obj[type+fn] );
		}
	},

	removeEvent: function( obj, type, fn ) {
		if (obj.removeEventListener)
			obj.removeEventListener( type, fn, false );
		else if (obj.detachEvent)
		{
			obj.detachEvent( "on"+type, obj[type+fn] );
			obj[type+fn] = null;
			obj["e"+type+fn] = null;
		}
	}
}


// Kick off
offspring.init();