     
     /*
     *  Identi Engine - UfXtract Parser Wrapper
     *  0.1.2 
     *  UfXtract microformats parser API calls and processing functions
     *  Copyright 2009, Glenn Jones
     *  Licensed under the MIT license.
     *  http://identengine.com/license/
     *  More information on this file: http://identengine.com/
     *  More information on UfXtract: http://ufxtract.com/
     */


   

  ident.ufxtract = {
  
      parserName: 'ufxtract',
      parseUf: 10,
      parseRss: 0,
      parseAtom: 0,
  
      // Loop through found nodes find hCard, rel=me and hResume info
      findProfiles: function(){
    
        // Find Twitter details before anything else
        ident.ufxtract.findContent( "twitter.com", 'Profile', 'hCard', true );
        
        // Look for all others
        for (var i = 0; i < ident.domains.length; i++) {
            if( ident.domains[i].accounts != null ){
                ident.ufxtract.findContent( ident.domains[i].domain, 'Profile', 'hCard', true );
                ident.ufxtract.findContent( ident.domains[i].domain, 'Resume', 'hResume', true );
                ident.ufxtract.findContent( ident.domains[i].domain, 'Services', 'XFN', true );         
            }
        }
    },
    
    
    // Finds and loads content
    findContent: function( domain, type, schema, onceOnly ){
     
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
        if( name != '' && url != '' ){
            if(onceOnly == true ){
                if(ident.hasAPIBeenCalled( url, schema, '' ) == false){
                    ident.ufxtract.loadContent(url, domain, name, type, schema);
                }
            }else{
                ident.ufxtract.loadContent(url, domain, name, type, schema);
            }
        }  
    },
    
    
    // Loads content
    loadContent: function( url, domain, name, type, schema ){
        if(ident.hasAPIBeenCalled( url, schema, '' ) == false){
            ident.ufxtract._getJson( url, domain, name, type, schema );
        }
     },   
    
    
    // Calls API to get JSON data
    _getJson: function(url, domain, name, type, schema){
    
        if(schema == 'rel-tag'){
            schema = 'tag';
        }
        
        // Update history with API call info
        apiurl = "http://ufxtract.com/api/?url=" + encodeURIComponent(url) + "&format=" + schema + "&output=json";
        var historyItem = new ident.historyItem(url,apiurl);
        historyItem.apiName = 'ufxtract';        
        historyItem.name = name;
        historyItem.domain = domain;        
        historyItem.schema = schema;
        historyItem.contentType = type; 

        ident.appendAllProfileUrls(url);
                   
        if(domain == "twitter.com" && ident.getEnchancedTwitterProfile && schema == "hCard"){
            ident.getEnchancedTwitterProfile(url,'ufxtract');
        }else{
            ident.history[ident.history.length] = historyItem;
            ident.ufxtract._UfXtractAPICall( url, historyItem );
        }
            
    },
    
    // The callback function to parse JSON from API call
    _parseUfData: function(jsonInput, url, historyItem ){
    
        // Check that this returned JSON is for current set of calls
        // Should be in the history collection
        if(ident.hasAPIBeenCalled( url, historyItem.schema, '')) { 
    
            // Record the return api call
            ident._apiReturnCount ++;     
            historyItem.rawJSON = jsonInput; 
            ident.ufxtract._processUfJson( jsonInput, url, historyItem.domain, historyItem.name, historyItem.contentType );
        
            // Reprocess unresolved raw JSON if we have no hCards for domain
            // Sometimes newly added profile data can resolved others
            if( historyItem.schema == 'hCard' ){
                for (var i = 0; i < ident.history.length; i++) {
                    var found = false;
                    for (var y = 0; y < ident.profiles.length; y++) {
                        if(ident.history[i].domain == ident.profiles[y].domain ){
                            found = true;
                        }
                    }
                    if(found == false){
                        ident.ufxtract._processUfJson(ident.history[i].rawJSON, ident.history[i].url, ident.history[i].domain, ident.history[i].name, ident.history[i].contentType);
                    }
                }
             } 
         }  
     },
     
     
     // Process JSON data 
     _processUfJson: function(jsonInput, url, domain, name, type){
     
        if(jsonInput.microformats){
     
            jsonInput = jsonInput.microformats
         
             // Parse hAtom
            if(jsonInput.hentry){
                 if(jsonInput.hentry.length > 0){
                     for (var i = 0; i < jsonInput.hentry.length; i++) {
                        jsonInput.hentry[i].sourceUrl = url;
                        jsonInput.hentry[i].domain = domain;
                        jsonInput.hentry[i].name = name;
                        jsonInput.hentry[i].type = type;
                        ident.postProcesshEntry(jsonInput.hentry[i]);
                        ident.entries[ident.entries.length] = jsonInput.hentry[i];
                     }
                 }
                 // Call content add event
                 ident.contentAddedEvent();
            }
            
            // Parse hCalendar
            if(jsonInput.vevent){
                 if(jsonInput.vevent.length > 0){
                     for (var i = 0; i < jsonInput.vevent.length; i++) {
                        jsonInput.vevent[i].sourceUrl = url;
                        jsonInput.vevent[i].domain = domain;
                        jsonInput.vevent[i].name = name;
                        jsonInput.vevent[i].type = type;
                        ident.postProcesshCalendar(jsonInput.vevent[i]);
                        ident.events[ident.events.length] = jsonInput.vevent[i];
                     }
                 }
                 // Call content add event
                 ident.contentAddedEvent();
            }
            
            // Parse rel-tag
            if(jsonInput.tag){
                 if(jsonInput.tag.length > 0){
                     for (var i = 0; i < jsonInput.tag.length; i++) {
                        jsonInput.tag[i].sourceUrl = url;
                        jsonInput.tag[i].domain = domain;
                        jsonInput.tag[i].name = name;
                        jsonInput.tag[i].type = type;
                        // Hack - deal with delicious issue
                        parts = jsonInput.tag[i].tag.split(";_"); 
                        if(parts.length > 1)
                            jsonInput.tag[i].tag = parts[0];
                        ident.tags[ident.tags.length] = jsonInput.tag[i];
                     }
                 }
                 // Call content add event
                 ident.contentAddedEvent();
            }
         
            // Parse hcards
            if(jsonInput.vcard){
                if(jsonInput.vcard.length > 0){
                    
                    // Finds the profile hCard from a collection of hCards
                    var hCard = ident.findRepresentativehCard( jsonInput.vcard, domain );
                    
                    if(hCard != null)
                    {
                        hCard.sourceUrl = url;
                        hCard.domain = domain;
                        hCard.name = name;
                        
//                        // Restructure to ufJSON
//                        if(hCard.org){
//                            if(hCard.org.length){
//                                var organizationname = hCard.org[0]['organization-name'];
//                                hCard.org = new Array();
//                                var org = new ident.org();
//                                org['organization-name'] = organizationname;
//                                hCard.org[0] = org;
//                            }
//                        }
                        
                        // Capture urls 
                        if(hCard.url){    
                             for (var i = 0; i < hCard.url.length; i++) {
                                ident.appendDeclaredProfileUrl(hCard.url[i]);
                                // Add to domain collection
                                ident.appendDomainNode('',hCard.url[i],false,'');
                                ident.appendAllProfileUrls(hCard.url[i]);
                             }
                            // Post process domain collection
                            ident.postProcessDomainNode();
                        }
                        
                        // Fixes a bug with JSON output - remove with next release 
                        if(hCard.logo)
                            if(ident.isString(hCard.logo) == false)
                                hCard.logo = '';
                                
                        if(hCard.logo)
                            if(ident.isString(hCard.logo) == false)
                                hCard.logo = '';        
                        
                        // Capture formatted name
                        if(hCard.fn)
                            ident.appendFormattedName(hCard.fn.replace('  ',' '));    
                        
                        // Only valid hCard
                        if(hCard.fn != '')
                            ident.profiles[ident.profiles.length] = hCard;
                    }
                }
                ident.createCombinedhCard();
                ident.profileAddedEvent();
             }
             
            // Parse XFN
            if(jsonInput.xfn){
                if(jsonInput.xfn.length){
                    for (var i = 0; i < jsonInput.xfn.length; i++) {
                        jsonInput.xfn[i].sourceUrl = url;
                        jsonInput.xfn[i].domain = domain;
                        jsonInput.xfn[i].name = name;
                        jsonInput.xfn[i].type = type;
                        ident.xfn[ident.xfn.length] = jsonInput.xfn[i];
                        if(ident.containsMe(jsonInput.xfn[i].rel)){
                            ident.mes[ident.mes.length] = jsonInput.xfn[i];
                            // Add to domain collection and profile lists
                            ident.appendDeclaredProfileUrl(jsonInput.xfn[i].link);
                            ident.appendDomainNode('',jsonInput.xfn[i].link,false,'');
                            ident.appendAllProfileUrls(jsonInput.xfn[i].link);
                        }
                    }
                    // Post process domain collection
                    ident.postProcessDomainNode();
                }
            }
             
             // Parse hresume i.e. if Linked-in append extra data to existing hcard 
             if(jsonInput.hresume){        
                for (var i = 0; i < ident.profiles.length; i++) {
                    if( ident.profiles[i].domain == domain ){
                        // If notes does not exisit or is not an arry
                        ident.profiles[i].note = new Array();
                        if( jsonInput.hresume[0].summary != undefined)
                            if( jsonInput.hresume[0].summary != '')    
                                ident.profiles[i].note[0] = jsonInput.hresume[0].summary;
                    }
                }
                // Add hResume to collection
                if(jsonInput.hresume.length > 0){
                    for (var i = 0; i < jsonInput.hresume.length; i++) {
                        jsonInput.hresume[i].sourceUrl = url;
                        jsonInput.hresume[i].domain = domain;
                        jsonInput.hresume[i].name = name;
                        ident.resumes[ident.resumes.length] = jsonInput.hresume[i];
                    }
                }
             }
         }  
     },
     
    // jQuery functions
    // Place together so they be more easily swap out
    // ------------------------------------------------------  
    
    _UfXtractAPICall: function(url, historyItem){
        // JQuery version
        jQuery.getJSON(apiurl + "&callback=?", function(data){
              ident.ufxtract._parseUfData( data, url, historyItem );  
        });
    }  
  
}  
  

// Register this parser with identi engine  
ident.registerParser(ident.ufxtract);




    

     
     
