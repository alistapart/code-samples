
         
     /*
     *  Identi Engine - YQL Parser Wrapper
     *  0.1.2 
     *  YQL microformats parser API calls and processing functions
     *  Copyright 2009, Glenn Jones
     *  Licensed under the MIT license.
     *  http://identengine.com/license/
     *  More information on this file: http://identengine.com/
     *  More information on YQL: http://developer.yahoo.com/yql/
     */


  ident.yql = {
  
      parserName: 'yql',
      parseUf: 5,
      parseRss: 10,
      parseAtom: 10,
  
       // Loops through the current accounts and calls getJSON method
        findProfiles: function(){
        
            // Find Twitter details before anything else
            ident.yql.findContent( "twitter.com", 'Profile', 'hCard', true );
            
            // Look for all others
            for (var i = 0; i < ident.domains.length; i++) {
                if( ident.domains[i].accounts != null ){
                    ident.yql.findContent( ident.domains[i].domain, 'Profile', 'hCard', true );
                    ident.yql.findContent( ident.domains[i].domain, 'Resume', 'hResume', true );
                    ident.yql.findContent( ident.domains[i].domain, 'Services', 'XFN', true );         
                }
            }
        }, 
    
        
        // Finds and loads content
        findContent: function( domain, type, schema ){
         
            var url = '';
            var name = '';
            for (var i = 0; i < ident.domains.length; i++) {
                if( ident.domains[i].domain == domain ){
                    if( ident.domains[i].accounts != null ){
                        var domainNode = ident.domains[i];
                        for (var x = 0; x < domainNode.accounts.length; x++) {
                            var identity = domainNode.accounts[x];
                            var url = ident.getAPIEndPoint(type, schema, domainNode.urlmappings, identity, 1); 
                            if( url != '' ){
                                name = domainNode.name;
                                break;
                            }
                        }
                    }  
                }
            }
            if( name != '' && url != '' )
                ident.yql.loadContent(url, domain, name, type, schema);  
        },
    
    
        // Loads content
        loadContent: function( url, domain, name, type, schema ){  
            if(ident.hasAPIBeenCalled( url, schema, '' ) == false){
                ident.yql.getJson( url, domain, name, type, schema );
            }
        },   
    
    
       
    
        // Given url fire API call for JSON data
       getJson: function(url, domain, name, type, schema){
            
            // Remove any name / segment targetting from the urls
            // This does not work with YQL
            if( url.indexOf('#') > 0){
                var parts = url.split('#');
                url = parts[0];
            }
            
            // Add to API call information into history
            var historyItem = new ident.historyItem(url,'');
            historyItem.apiName = 'yql';        
            historyItem.name = name;
            historyItem.domain = domain;        
            historyItem.schema = schema;
            historyItem.contentType = type; 
            
            // Work out media type for query
            var mediatype = 'microformats';
            if( schema == 'Rss')
                mediatype = 'rss';
                
             if( schema == 'Atom')
                mediatype = 'atom'; 
            
            query = "select * from " + mediatype + " where url='" + url +  "'";           
            apiurl = "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(query) + "&format=json";
            
            historyItem.apiurl = apiurl; 
            
            if(domain == "twitter.com" && ident.getEnchancedTwitterProfile && schema == "hCard"){
                ident.getEnchancedTwitterProfile(url);
            }else{
                ident.history[ident.history.length] = historyItem;
                jQuery.getJSON(apiurl + "&callback=?", function(data){
                    ident.yql.processJson( data, domain, name, type, historyItem, mediatype );
                });
            }  

            
        },
    

	        // Processes the raw JSON
	        processJson: function(json, domain, name, type, historyItem, mediatype ) {
        	
	             // Record the return api call
                ident._apiReturnCount ++;    

                // Takes string or objcet
                if(ident.isObject(json))
                    yql = json;
            else    
                yql = eval("(" + json + ")");
                
            historyItem.rawJSON = yql;  
            
            if( mediatype == 'rss' || mediatype == 'atom' ){ 
                if(yql.query){
                    if(yql.query.results){
                        // Atom has a entry object
                        if(yql.query.results.entry){
                            if(yql.query.results.entry.length == null){
                                singleEntry = yql.query.results.entry
                                yql.query.results.entry = new Array();
                                yql.query.results.entry[0] = singleEntry;  
                            }
                            if(yql.query.results.entry.length){
                                for(var x = 0; x <= yql.query.results.entry.length-1; x++){
                                    hentry = ident.yql.parseAtomItem( yql.query.results.entry[x] );   
                                    hentry.domain = domain;
                                    hentry.name = name;
                                    hentry.type = type;
                                    hentry.sourceUrl = historyItem.url;
                                    ident.postProcesshEntry(hentry);   
                                    ident.entries[ident.entries.length] = hentry;
                                }
                                ident.contentAddedEvent();
                            }
                        }
                        // Rss has a Item object
                        if(yql.query.results.item){
                            if(yql.query.results.item.length == null){
                                singleItem = yql.query.results.item
                                yql.query.results.item = new Array();
                                yql.query.results.item[0] = singleItem;  
                            }
                            if(yql.query.results.item.length){
                                for(var x = 0; x <= yql.query.results.item.length-1; x++){
                                    hentry = ident.yql.parseRssItem( yql.query.results.item[x] );   
                                    hentry.domain = domain;
                                    hentry.name = name;
                                    hentry.type = type;
                                    hentry.sourceUrl = historyItem.url;
                                    ident.postProcesshEntry(hentry);   
                                    ident.entries[ident.entries.length] = hentry;   
                                }
                                ident.contentAddedEvent();
                            }
                        }
                    }
                } 
            }
            
            
            if( mediatype == 'microformats' ){ 
                
                var UnStructuredhCards = null;
                var UnStructuredhResumes = null;
                var UnStructuredhEntry = null;
                var UnStructuredXFN = null;
                
                var ufCollection = new Array();
                var sourceUrl = '';
                
                // Walks collection of objects for results  
                if( yql != null){
                    if( yql.query != null){
                        if( yql.query.results != null){
                        
                            // Result structure
                            if( yql.query.results.result != null){
                            
                                // The url the uf was parsed from
                                if(yql.query.results.result.url != null)
                                    sourceUrl = yql.query.results.result.url;
                               
                                if( yql.query.results.result.feed != null){
                                    if( yql.query.results.result.feed.adjunct != null){
                                        if( yql.query.results.result.feed.adjunct.length != null){
                                           for(var x = 0; x <= yql.query.results.result.feed.adjunct.length-1; x++){
                                               var adjunct = yql.query.results.result.feed.adjunct[x];
                                               if( adjunct.id == "com.yahoo.page.uf.hcard" )
                                                    UnStructuredhCards = adjunct;

                                               if( adjunct.id == "com.yahoo.page.uf.hresume" )
                                                    UnStructuredhResumes = adjunct;

                                               if( adjunct.id == "com.yahoo.page.uf.hentry" )
                                                    UnStructuredhEntry = adjunct;
                                               
                                               if( adjunct.id == "com.yahoo.page.uf.xfn" )
                                                    UnStructuredXFN = adjunct;
      
                                           }
                                        }else{
                                               var adjunct = yql.query.results.result.feed.adjunct;
                                               if( adjunct.id == "com.yahoo.page.uf.hcard" )
                                                    UnStructuredhCards = adjunct;

                                               if( adjunct.id == "com.yahoo.page.uf.hresume" )
                                                    UnStructuredhResumes = adjunct;

                                               if( adjunct.id == "com.yahoo.page.uf.hentry" )
                                                    UnStructuredhEntry = adjunct;
                                               
                                               if( adjunct.id == "com.yahoo.page.uf.xfn" )
                                                    UnStructuredXFN = adjunct;
                                        
                                        }
                                    }
                                }else{
                                    // If we cannot find anything it is most likly not in the Yahoo index
                                    historyItem.error = true;
                                    historyItem.errorMessage = 'Not Found'; 
                                }
                            }   
                        }
                    }
                }
                
                
                // Process an hCard data
                if(UnStructuredhCards != null ){
                    hCards = ident.yql.parsehCards(UnStructuredhCards, domain, name, sourceUrl);
                    ufCollection[ufCollection.length] = {'vcard': hCards };
                    var hCard = null;
                    
                    // If we only found one hCard add to the collection
                    if( hCards.length == 1 )
                        hCard = hCards[0];
                        
                    // If we found more than one hCard tey and find the representative one
                    if( hCards.length > 1 )
                        hCard = ident.findRepresentativehCard(hCards,domain);

                    // If we have a hCard add it to the collection
                    if( hCard != null){
                    
                        // Capture url 
                        if(hCard.url){    
                             for (var i = 0; i < hCard.url.length; i++) {
                                ident.appendDeclaredProfileUrl(hCard.url[i]);
                             }
                        }
                        
                        // Capture formatted name
                        if(hCard.fn)
                            ident.appendFormattedName(hCard.fn.replace('  ',' ')); 
                             
                        ident.profiles[ident.profiles.length++] = hCard;
                        ident.createCombinedhCard();
                        
                        // After all processing trigger custom update events 
                        jQuery(document).trigger('identify:profileAdded');
                        jQuery(document).trigger('identify:statusUpdate',['data-change']);   
                    }
                }
                
                // Process an XFN data
                if(UnStructuredXFN != null ){
                    ident.yql.parseXFN(UnStructuredXFN, domain, name, sourceUrl);
                }
                
                
                // Process an hResume data
                if(UnStructuredhResumes != null ){
                    var hResume = ident.yql.parsehResumes(UnStructuredhResumes, domain, name, sourceUrl);
                    ufCollection[ufCollection.length] = {'hresume': hResume };
                    if(hResume.summary != ''){
                        // Find hCard to append data to -
                        for (var i = 0; i < ident.profiles.length; i++) {
                            if( hResume.domain == ident.profiles[i].domain ){
                                // Adds the summary of hResume to hCard note
                                var note = new ident.valueTypeProperty();
                                note.domain = domain;
                                note.sourceUrl = sourceUrl;
                                note.value = hResume.summary;
                                ident.profiles[i].note[0] = note;
                            }
                        }
                    }
                    
                    jQuery(document).trigger('identify:statusUpdate',['data-change']);   
                    // Needs full: 
                    // Contact hcard parsing
                    // Eduction and experience hCalandar parsing
                    
                    ident.resumes[ident.resumes.length++] = hResume;
                }
                
                historyItem.uf = ufCollection;
            
            }
      
	    },
    	
    	
	    // Takes a Atom and turns into a hEntry superset format
	    parseAtomItem: function(item){
	        hentry = new ident.hEntry();
	        hentry.id = item.id;
	        hentry.author.fn = item.author.name; 
	        hentry.author.url[0] = item.author.uri;
    	    
	        hentry.published = item.published;
            hentry.updated = item.updated;
            hentry['entry-title'] = item.title;
            hentry['entry-content'][0] = item.content.content;   
            //hentry['entry-summary'][0] = ''; 
    	    
	        // Has href rel type
	        if(item.link){
	            if(item.link.length){
	                for (var i = 0; i < item.link.length; i++) {
	                    enclosure = new ident.enclosure();
	                    enclosure.link = item.link[i].href;
	                    enclosure.type = item.link[i].type;
	                    enclosure.rel = item.link[i].rel;
	                    hentry.enclosure[hentry.enclosure.length] = enclosure;
	                }    
	            }
	        } 
            
            return hentry;  
	    },
    	
    	
        // Takes a RSS and turns into a hEntry superset format
	    parseRssItem: function(item){
	        hentry = new ident.hEntry();
    	    
	        if(item.id)
	            hentry.id = item.id;
    	    
	        if(item.author){
	            if(item.author.fn)
	                hentry.author.fn = item.author.name;   
	            if(item.author.url)
	                hentry.author.url[0] = item.author.uri;
    	            
    	            
	        }
    	    
	        if(item.pubDate)
                hentry.published = item.pubDate;  
            
            if(item.title)    
                hentry['entry-title'] = item.title;
                
            if(item.description)    
                hentry['entry-content'][0] = item.description;      
            
            // Calendar date info
            if(item.summary)    
                hentry.summary = item.summary;
                
            if(item.dtstart)    
                hentry.dtstart = item.dtstart;
                
            if(item.dtend)    
                hentry.dtend = item.dtend;
                
            if(item.location)    
                hentry.location = item.location;

            // x-calconnect-venue
            if(item['x-calconnect-venue']){
                if(item['x-calconnect-venue'].adr){
                    venueAdr = item['x-calconnect-venue'].adr;
                    hentry.venue = new Object();
                    
                    if(venueAdr['x-calconnect-venue-name'])
                        hentry.location = venueAdr['x-calconnect-venue-name'];
                     
                    if(venueAdr['x-calconnect-street']){
                        hentry.venue['street-address'] = new Array();
                        hentry.venue['street-address'][0] = venueAdr['x-calconnect-street']; 
                    }

                    if(venueAdr['x-calconnect-city'])
                        hentry.venue.locality = venueAdr['x-calconnect-city']; 
                        
                    if(venueAdr['x-calconnect-region'])
                        hentry.venue.region = venueAdr['x-calconnect-region']; 
                    
                    if(venueAdr['x-calconnect-postalcode'])
                        hentry.venue['post-office-box'] = venueAdr['x-calconnect-postalcode']; 
                  
                    if(venueAdr['x-calconnect-country'])
                        hentry.venue['country-name'] = venueAdr['x-calconnect-country']; 
                                            
                }    
            }
    	    
	        if(item.enclosure){
    	        enclosure = new ident.enclosure();
                enclosure.link = item.enclosure.url;
                enclosure.type = item.enclosure.type;
                enclosure.length = item.enclosure.length;
                hentry.enclosure[hentry.enclosure.length] = enclosure;
	        } 
    	        
            if(item.date)
                hentry.published = item.date;
                
            if(item.link)
                hentry.link = item.link;
            
            return hentry;  
	    },
    	

        // Loops through YQL format JSON and turns it into standard ufJSON format for processing
        parsehCards: function(obj, domain, name, sourceUrl){
            
            var hCards = new Array();
            
            // Parse object
            if( obj != null ) {
                if( obj.item != null) {
                
                    // If not an array turn it into one
                    if( ident.isArray(obj.item) == false ) {
                        obj.item = new Array( obj.item );
                    }
                    
                    // Loop the unstructure collection
                    for(var j = 0; j <= obj.item.length-1; j++) {
                    
                        if( obj.item[j].type != null)
                        {
                        
                            var hCard = new ident.hCard();
                            hCard.domain = domain;
                            hCard.name = name;
                            hCard.sourceUrl = sourceUrl;
                        
                            // From the meta group
                            if( obj.item[j].type.meta != null)
                            {
                                if( ident.isArray(obj.item[j].type.meta) )
                                {
                                    for(var x = 0; x <= obj.item[j].type.meta.length-1; x++)
                                    {
                                        if(obj.item[j].type.meta[x].property == "vcard:fn")
                                            hCard.fn = obj.item[j].type.meta[x].content
                                            
                                        if(obj.item[j].type.meta[x].property == "vcard:tel"){
                                            var tel = new ident.valueTypeProperty();
                                            tel.domain = domain;
                                            tel.sourceUrl = sourceUrl;
                                            
                                            // Find work type
                                            if( obj.item[j].type.meta[x].content.toLowerCase().indexOf('work') > -1)
                                                tel.type = 'work';
                                                
                                            // Break part type and value    
                                            if( obj.item[j].type.meta[x].content.indexOf(' : ') > 0){
                                                var parts = obj.item[j].type.meta[x].content.split(' : ');
                                                tel.value = parts[1];
                                            }else{
                                                tel.value = obj.item[j].type.meta[x].content;
                                            }     
                                            
                                            hCard.tel[hCard.tel.length] = tel;
                                        }
                                            
                                        if(obj.item[j].type.meta[x].property == "vcard:email"){
                                            var email = new ident.valueTypeProperty();
                                            email.domain = domain;
                                            email.sourceUrl = sourceUrl;
                                            email.valueOf = obj.item[j].type.meta[x].content;
                                            hCard.email[hCard.email.length] = email; 
                                            
                                        }
                                            
                                         if(obj.item[j].type.meta[x].property == "vcard:title")
                                            if( obj.item[j].type.meta[x].content != undefined )
                                                hCard.title[hCard.title.length] = obj.item[j].type.meta[x].content;
                                                
                                         // Role is so misunderstsood, for the time been I am using to fill title    
                                         if(obj.item[j].type.meta[x].property == "vcard:role")
                                            if( obj.item[j].type.meta[x].content != undefined )
                                                hCard.title[hCard.title.length] = obj.item[j].type.meta[x].content;
                                    }
                                }
                                else{
                                    if(obj.item[j].type.meta.property == "vcard:fn")
                                        hCard.fn = obj.item[j].type.meta.content
                                }
                            } 
                            
                            // From the item group
                            if( obj.item[j].type.item != null)
                            {
                                if( ident.isArray(obj.item[j].type.item) )
                                {
                                    for(var x = 0; x <= obj.item[j].type.item.length-1; x++)
                                    {
                                        if(obj.item[j].type.item[x].rel == "vcard:photo")
                                            hCard.photo[hCard.photo.length] = obj.item[j].type.item[x].resource
                                            
                                        if(obj.item[j].type.item[x].rel == "vcard:url")
                                            hCard.url[hCard.url.length] = obj.item[j].type.item[x].resource;
                                              
                                              
                                        if(obj.item[j].type.item[x].rel == "vcard:org"){
                                            if( obj.item[j].type.item[x].type != null){
                                                if( obj.item[j].type.item[x].type.meta != null){    
                                                    if(obj.item[j].type.item[x].type.meta.property == "vcard:organization-name"){
                                                        var org = new ident.org();
                                                        org["organization-name"] = obj.item[j].type.item[x].type.meta.content;
                                                        org.domain = domain;
                                                        org.sourceUrl = sourceUrl;
                                                        hCard.org[hCard.org.length] = org;    
                                                    }
                                                }
                                            }
                                        }
                                            
                                        if(obj.item[j].type.item[x].rel == "vcard:adr")
                                        {
                                            if( obj.item[j].type.item[x].type != null)
                                            {
                                                if( obj.item[j].type.item[x].type.meta != null)
                                                {
                                                    var adrObj = null;
                                                
                                                    if( ident.isArray(obj.item[j].type.item[x].type.meta) )
                                                    {
                                                        hCard.adr[0] = new ident.adr();
                                                        hCard.adr[0].domain = domain;
                                                        hCard.adr[0].sourceUrl = sourceUrl;
                                                    
                                                        for(var y = 0; y <= obj.item[j].type.item[x].type.meta.length-1; y++) 
                                                        {
                                                            var adrObj = obj.item[j].type.item[x].type.meta[y];
                                                            
                                                            
                                                            if(adrObj.property == "vcard:extended-address")
                                                                hCard.adr[0]["extended-address"][0] = adrObj.content;
                                                                
                                                            if(adrObj.property == "vcard:street-address")
                                                                hCard.adr[0]["street-address"][0] = adrObj.content;
                                                                
                                                             if(adrObj.property == "vcard:locality")
                                                                hCard.adr[0].locality = adrObj.content;
                                                                
                                                             if(adrObj.property == "vcard:region")
                                                                hCard.adr[0].region = adrObj.content;
                                                                
                                                             if(adrObj.property == "vcard:postal-code")
                                                                hCard.adr[0]["postal-code"] = adrObj.content;
                                                                
                                                             if(adrObj.property == "vcard:country-name" )
                                                                hCard.adr[0]["country-name"] = adrObj.content;
                                                        }
                                                    }
                                                    else{
                                                        var adrObj = obj.item[j].type.item[x].type.meta;
                                                        hCard.adr[0] = new ident.adr();
                                                        
                                                        if(adrObj.property == "vcard:extended-address")
                                                            hCard.adr[0]["extended-address"][0] = adrObj.content;
                                                            
                                                        if(adrObj.property == "vcard:street-address")
                                                            hCard.adr[0]["street-address"][0] = adrObj.content;
                                                            
                                                         if(adrObj.property == "vcard:locality")
                                                            hCard.adr[0].locality = adrObj.content;
                                                            
                                                         if(adrObj.property == "vcard:region")
                                                            hCard.adr[0].region = adrObj.content;
                                                            
                                                         if(adrObj.property == "vcard:postal-code")
                                                            hCard.adr[0]["postal-code"] = adrObj.content;
                                                            
                                                         if(adrObj.property == "vcard:country-name" )
                                                            hCard.adr[0]["country-name"] = adrObj.content;
                                                    
                                                    }
                                                }
                                            }
                                        }
                                     }  
                                 }else{
                                    if(obj.item[j].type.item.rel == "vcard:url")
                                        hCard.url[hCard.url.length++] = obj.item[j].type.item.resource;    
                                } 
                            } 
                        } 
                      // Add the found hCard to the collection  
                      if(hCard.fn != '')  
                        hCards[hCards.length] = hCard;                     
                    }
                }
            }   
            return hCards;  
       },     
         
         
       // Parse out just hResume summary 
       // Loops through YQL format JSON and turns it into standard ufJSON format for processing
       parsehResumes: function(obj, domain, name, sourceUrl){ 
        
            var hResume = new ident.hResume();
            hResume.domain = domain;
            hResume.sourceUrl = sourceUrl;
            
            if( obj != null){
                if( obj.item != null){
                    if( obj.item.type != null){
                        if( obj.item.type.meta != null){
                            if(obj.item.type.meta.property == "resume:summary") {
                         	    if( obj.item.type.meta.content != undefined ) {
                                   hResume.summary = obj.item.type.meta.content;
                                }
                            }
                        }
                    }
                }
            }
            return hResume;
       },
       
       
       // Parse XFNy
       // Loops through YQL format JSON and turns it into standard ufJSON format for processing
       parseXFN: function(obj, domain, name, sourceUrl){ 
       
            // Loop the unstructure collection
            for(var j = 0; j <= obj.item.length-1; j++) {
                var xfn = new Object();
                xfn.domain = domain;
                xfn.sourceUrl = sourceUrl;
                xfn.name = name;
            
                if(obj.item[j].rel == "xfn:me") {
                   xfn.link = obj.item[j].item.resource;
                   ident.mes[ident.mes.length] = xfn;
                   ident.xfn[ident.xfn.length] = xfn;
                   // Add to domain collection and profile lists
                   ident.appendDeclaredProfileUrl(xfn.link);
                   ident.appendDomainNode('',xfn.link,false,'');
                   ident.appendAllProfileUrls(xfn.link); 
                }   
            }
            
            // Post process domain collection
            ident.postProcessDomainNode();
       },
       
       

	    // Returns the string values from a YQL JSON node tree
	    parseObjectsToString:  function(obj, str){
	        if(ident.isObject(obj)){
	            for(prop in obj){
	                if(typeof obj[prop] == 'string')
	                    if(prop == 'content')
                            str += obj[prop];
                    if(ident.isObject(obj[prop]))
                        str = ident.yql.parseObjectsToString( obj[prop], str)  
                }
	        }
	        return str;
	    }
}	



// Register this parser with identi engine  
ident.registerParser(ident.yql);