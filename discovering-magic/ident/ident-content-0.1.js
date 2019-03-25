
     /*
     *  Identi Engine - Content
     *  0.1.2    
     *  Content related collections and methods
     *  Copyright 2009, Glenn Jones
     *  Licensed under the MIT license.
     *  http://identengine.com/license/
     *  More information on this file: http://identengine.com/
     */

    // Public use
    ident.entries = new Array();
    ident.events = new Array();
    ident.tags = new Array();
    

    ident.resetContent = function(){ 
        ident.entries = new Array();
        ident.events = new Array();
        ident.tags = new Array();
    };
    
    // Object structures are based on ufJSON with the addition of source metadata
    // http://microformats.org/wiki/json
    
    
    // Describes a hEntry object
    // Is a superset with the addition of enclosure
    ident.hEntry = function(){
        //Meta properties
        this.name = '';
        this.domain = '';
        this.sourceUrl = '';
        
        //Value properties
        this.author = new ident.hCard();
        this['entry-title'] = '';
        this['entry-content'] = new Array();
        this['entry-summary'] = new Array();
        this.bookmark = new ident.enclosure();
        this.enclosure = new Array();
        this.published = '';
        this.updated = '';
        this['published-datetime'];
        this['updated-datetime'];
        this.tag = new Array();
    };
    
    
    // Describes a hAtom object
    ident.hAtom = function(){
        //Meta properties
        this.domain = '';
        this.sourceUrl = '';
        
        //Value properties
        this.hentry = new Array();
        this.tag = new Array();
    };  
    
    // Describes enclosure
    // Is a superset of uf idea with addition of type and rel
    ident.enclosure = function(){
        this.text = '';
        this.link = '';
        this.type = '';
        this.rel = '';
        this.lenght = '';
    };  
    
    
       
    // Finds and loads content
    ident.findContent = function( domain, type, schema ){
     
        var url = '';
        var name = '';
        for (var i = 0; i < ident.domains.length; i++) {
            if( ident.domains[i].domain == domain ){
                if( ident.domains[i].accounts != null ){
                    var domainNode = ident.domains[i];
                    for (var x = 0; x < domainNode.accounts.length; x++) {
                        var identity = domainNode.accounts[x];
                        url = ident.getAPIEndPoint(type, schema, domainNode.urlmappings, identity, 1); 
                        if( url != '' ){
                            name = domainNode.name;
                            break;
                        }
                    }
                    if( url != '' )
                        break;
                }  
            }
        }
        if( name != '' && url != '' )
            ident.loadContent(url, domain, name, type, schema);  
    }; 
    

    // Loads content
    ident.loadContent = function( url, domain, name, type, schema ){  
        // Work out media type for query
        var mediatype = 'microformats';
        
        if( schema == 'Rss')
            mediatype = 'rss';
            
        if( schema == 'Atom')
            mediatype = 'atom'; 
        
        if(ident.hasAPIBeenCalled( url, schema, '' ) == false){
            if(mediatype == 'microformats')
                ident.ufParser.loadContent( url, domain, name, type, schema );
            if(mediatype == 'rss')
                ident.rssParser.loadContent( url, domain, name, type, schema );
            if(mediatype == 'atom')
                ident.atomParser.loadContent( url, domain, name, type, schema );     
        }
     };  


    // Deals with common issues for hEntry
    ident.postProcesshEntry = function(hentry){
    
         if(hentry['entry-title'] == ''){
            if(hentry['entry-content'].lenght > -1)
                hentry['entry-title'] = hentry['entry-content'][0]
        }
        
        if(hentry.updated == '')
            hentry.updated = hentry.published;
  
        if(hentry.domain == "twitter.com"){
            hentry['published-datetime'] = ident.getTwitterDate( hentry.published );
            hentry['updated-datetime'] = ident.getTwitterDate( hentry.updated );
        } else {
            // Creates JavaScript datatime objects for hEntry properties
            hentry['published-datetime'] = ident.getJavaScriptDates( hentry.published );
            hentry['updated-datetime'] = ident.getJavaScriptDates( hentry.updated );
            hentry['dtstart-datetime'] = ident.getJavaScriptDates( hentry.dtstart );
            hentry['dtend-datetime'] = ident.getJavaScriptDates( hentry.dtend );
        }       
    }
    
    // Creates JavaScript datatime objects for hCalendar properties
    ident.postProcesshCalendar = function(vevent){
        vevent['dtstart-datetime'] = ident.getJavaScriptDates( vevent.dtstart );
        vevent['dtend-datetime'] = ident.getJavaScriptDates( vevent.dtend );
    }
    
    
    // Parses a string into a javascript date object
    ident.getJavaScriptDates = function(string){
        var dateObject;    
        // Standard javascript parse
        if( Date.parse( string ) > 0 )
            dateObject = new Date(Date.parse( string ));
            
        // ISO datetine parse
        if(dateObject == undefined){
            var isodate = new ISODate( string );
            if(isodate.dY > -1 && isodate.dY != undefined ){
                // Date-time or just date
                if(isodate.tH != null && isodate.tM != -1 && isodate.tS != -1){
                    dateObject = new Date( parseInt(isodate.dY), parseInt(isodate.dM-1), parseInt(isodate.dD), parseInt(isodate.tH), parseInt(isodate.tM) , parseInt(isodate.tS) );   
                }else{
                    dateObject = new Date( parseInt(isodate.dY), parseInt(isodate.dM-1), parseInt(isodate.dD) );  
                }
            }
        } 
        return dateObject
    }
    
    
    // Hack to sort out Twitter's incorrect date structure - It should be ISO
    ident.getTwitterDate = function(string){
        // about 1 hour ago
        // about 2 hours ago
        // 9:12 AM Jun 24th
        var dateObject;
        if( string.indexOf('minute') > -1 || string.indexOf('minutes') > -1 || string.indexOf('hour') > -1 || string.indexOf('hours') > -1 || string.indexOf('day') > -1){
        
            number = string.replace('about ','').replace(' hour ago','').replace(' hours ago','').replace(' minutes ago','').replace(' minute ago','')
            var today = new Date();
            
            if( string.indexOf('minute') > -1 || string.indexOf('minutes') > -1)
                today.setTime( today.getTime() - (parseInt(number) * 60 * 1000));
            else
                today.setTime( today.getTime() - (parseInt(number) * 60 * 60 * 1000));
                
            dateObject = today;
        }else{

            var parts = string.split(' ');
            month = 1;
            switch(parts[2]){
                case 'Jan':
                    month = 0
                    break;
                case 'Feb':
                    month = 1
                    break;
                case 'Mar':
                    month = 2
                    break;
                case 'Apr':
                    month = 3
                case 'May':
                    month = 4
                    break;
                case 'Jun':
                    month = 5
                    break;
                case 'Jul':
                    month = 6
                    break;
                case 'Aug':
                    month = 7
                    break;
                case 'Sep':
                    month = 8
                    break;
                case 'Oct':
                    month = 9
                    break;
                case 'Nov':
                    month = 10
                    break;
                case 'Dec':
                    month = 11
                    break;
            }
            
            var timeparts = parts[0].split(':');
            parts[3] = parseInt(parts[3].replace('th','').replace('rd','').replace('nd','').replace('st',''));
            var today = new Date();
            // Hacked in year number - needs a better solution
            dateObject = new Date(today.getFullYear(),month,parts[3],parseInt(timeparts[0]),parseInt(timeparts[1]),0); 
            // Hacked time difference between UfXtract and Twitter API 
            // This should be deal with at HTTP level, but its not need for true microformat dates.
            // If Twitter sort out thier dates this will be fixed
            dateObject.setTime( dateObject.getTime() + (8 * 60 * 60 * 1000) );   
        }
        return dateObject
    }

    
// ISO date (Both W3C and RFC3339 standard support) to JavaScript Date    
function ISODate() {
	this.dY;
	this.dM=-1; 
	this.dD=-1;
	this.z=false;
	this.tH;
	this.tM=-1;
	this.tS=-1;
	this.tD=-1;
	this.tzH;
	this.tzM=-1;
	this.tzPN='+';
	this.z = false;
	this.format = 'W3C' // W3C or RFC3339
	
	if(arguments[0])
		this.Parse( arguments[0] );
}

ISODate.prototype.Parse = function( dateString ) {
	
	var dateNormalised = '', parts;
	var datePart = '', timePart = '', timeZonePart = '';
	dateString = dateString.toUpperCase();
	
	// Break on 'T' divider or space
	if( dateString.indexOf('T') > -1 )
	{
		parts = dateString.split('T');		
		datePart = parts[0];
		timePart = parts[1];
		
		// Zulu UTC and time zone break
		if( timePart.indexOf('Z') > -1 || timePart.indexOf('+') > -1 || timePart.indexOf('-') > -1 )
		{
			var tzArray = timePart.split('Z');
			timePart = tzArray[0];
			timeZonePart = tzArray[1];
			this.z = true;
			
			// Timezone
			if( timePart.indexOf('+') > -1 || timePart.indexOf('-') > -1 )
			{
				var position = 0;
				if( timePart.indexOf('+') > -1 )
					position = timePart.indexOf('+');
				else
					position = timePart.indexOf('-');
				
				timeZonePart = timePart.substring(position,timePart.length);
				timePart = timePart.substring(0,position);
			}
		}
		
	}
	else
	{
		datePart = dateString;
	}
	
	if( datePart != '' ) {
		this.ParseDate( datePart );
		if( timePart != '' ){
			this.ParseTime( timePart );
			if( timeZonePart != '' ){
				this.ParseTimeZone( timeZonePart );
			}
		}
	}	
}


ISODate.prototype.ParseDate = function( dateString ) {
	var dateNormalised = '', parts;
	// YYYY-MM-DD ie 2008-05-01 and YYYYMMDD ie 20080501
	parts = dateString.match(/(\d\d\d\d)?-?(\d\d)?-?(\d\d)?/);
	if( parts[1] ) { this.dY = parts[1] };
	if( parts[2] ) { this.dM = parts[2] };
	if( parts[3] ) { this.dD = parts[3] };
}

ISODate.prototype.ParseTime = function( timeString ) {
	var timeNormalised = '';
	// Finds timezone HH:MM:SS and HHMMSS  ie 13:30:45, 133045 and 13:30:45.0135
	var parts = timeString.match(/(\d\d)?:?(\d\d)?:?(\d\d)?.?([0-9]+)?/);
	timeSegment = timeString;
	if( parts[1] ) { this.tH = parts[1] };
	if( parts[2] ) { this.tM = parts[2] };
	if( parts[3] ) { this.tS = parts[3] };
	if( parts[4] ) { this.tD = parts[4] };
}

ISODate.prototype.ParseTimeZone = function( timeString ) {
	var timeNormalised = '';
	// Finds timezone +HH:MM and +HHMM  ie +13:30 and +1330
	var parts = timeString.match(/([-+]{1})?(\d\d)?:?(\d\d)?/);
	if( parts[1] ) { this.tzPN = parts[1] };
	if( parts[2] ) { this.tzH = parts[2] };
	if( parts[3] ) { this.tzM = parts[3] };
}

// Returns datetime in W3C Note datetime profile or RFC 3339 profile
ISODate.prototype.toString = function() {
	if(this.format == 'W3C') {
		dsep = '-';
		tsep = ':';
	}
	if(this.format == 'RFC3339') {
		dsep = '';
		tsep = '';
	}
	
	var output='';
	if( typeof( this.dY ) != 'undefined' ){			
		output = this.dY;
		if( this.dM > 0 && this.dM < 13  ){ 
			output += dsep + this.dM;	
			if(this.dD > 0 && this.dD < 32  ){ 
				output += dsep + this.dD;
				// Time and can only be created with a full date
				if( typeof( this.tH ) != 'undefined' ){
					if( this.tH > -1 && this.tH < 25 ) {
						output += 'T' + this.tH
						if(  this.tM > -1 && this.tM < 61 ) {
							output += tsep + this.tM;
							if(  this.tS > -1 && this.tS < 61 ) {
								output += tsep + this.tS;
								if(  this.tD > -1 )
									output += '.' + this.tD; 
							}
						}
							// Time zone offset can only be created with a hour
							if(this.z) { output += 'Z' };
							if( typeof( this.tzH ) != 'undefined' ){
								if( this.tzH > -1 && this.tzH < 25 ) {
									output += this.tzPN + this.tzH
									if( this.tzM > -1 && this.tzM < 61 ) 
										output += tsep + this.tzM;
								}
							}
					}	
				}	
			}
		}	
	}
	return output;
}



    ident.contentAddedEvent = function(){
        ident.statusUpdateEvent(['content-added']); 
    };
    
 
 
     // jQuery functions
    // Place together so they be more easily swap out
    // ------------------------------------------------------  
     
    var doc = jQuery(document);
    doc.ready(function() {
        // Wire ident.content.js events into ident.js
        if( ident.ufParser != null ){
            doc.bind('ident:reset', ident.resetContent);
        }
    });