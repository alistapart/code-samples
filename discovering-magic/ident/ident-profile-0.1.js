
     /*
     *  Identi Engine - Profiles
     *  0.1.2    
     *  Takes list profiles urls in ident.domains and parses out hCard/hResume data into a combined profiles
     *  Copyright 2009, Glenn Jones
     *  Licensed under the MIT license.
     *  http://identengine.com/license
     *  More information on this file: http://identengine.com/
     */

    // Public use
    ident.combinedProfile; // declared after object constructors 
    ident.profiles = new Array();
    ident.resumes = new Array();
    ident.mes = new Array();
    ident.xfn = new Array();

    
    // Internal use
    ident._allProfileUrls  = new Array();
    ident._explicitlyDeclaredProfileUrls  = new Array();
    ident._formattedNames = new Array();
    
    
    // Describes a formatted name 
    ident.formattedName = function(){
        this.name = '';
        this.rank = 0;
    }  
    
    ident.resetProfiles = function(){
        ident.combinedProfile = new ident.hCard(); 
        ident.profiles = new Array();
        ident.resumes = new Array();
        ident.mes = new Array();
        ident.xfn = new Array();
        ident._allProfileUrls  = new Array();
        ident._explicitlyDeclaredProfileUrls  = new Array();
        ident._formattedNames = new Array(); 
    };
    
    // Object structures are based on ufJSON with the addition of source metadata
    // http://microformats.org/wiki/json
    
    
    // Describes a subset of the hCard name object
    ident.name = function(){
        //Meta properties
        this.domain = '';
        this.sourceUrl = '';
        //Value properties
        this['given-name'] = new Array();
        this['family-name'] = new Array();
        this['honorific-prefix'] = new Array();
    };    
    
    // Describes a hCard adr (address) object
    ident.adr = function(){
        //Meta properties
        this.name = '';
        this.domain = '';
        this.sourceUrl = '';
        //Value properties
        this.type = '';
        this['street-address'] = new Array();
        this['extended-address'] = new Array();
        this.locality = '';
        this.region = '';
        this['postal-code'] = '';
        this['country-name'] = '';
        this['post-office-box'] = '';
    };
    
    // Describes the hCard org (organization) object
    ident.org = function(){
         //Meta properties
        this.domain = '';
        this.sourceUrl = '';
        //Value properties
        this['organization-name'] = '';
        this['organization-unit'] = new Array();
    }
    
    
     // Describes a subset of the hCard object
    ident.hCard = function () {
        //Meta properties
        this.domain = '';
        this.sourceUrl = '';
        this.isRepsentative = false;
        //Value properties
        this.fn = '';
        this.n = new ident.name();
        this.nickname = new Array();
        this.photo = new Array();
        this.logo = new Array();
        this.note = new Array(); 
        this.title = new Array();  
        this.role = ''; 
        this.org = new Array(); 
        this.adr = new Array();
        this.url = new Array();
        this.email = new Array();
        this.tel = new Array(); 
        this.uid = '';
    };
    
    // Proprety has to be created after constructor
    ident.combinedProfile = new ident.hCard();
    
    
    // Describes a subset of the hResume object
    ident.hResume = function () {
        //Meta properties
        this.domain = '';
        this.sourceUrl = '';
        //Value properties
        this.contact = new ident.hCard();
        this.summary
        this.experience = new Array();
        this.education = new Array();  
    }
    
    
    // Describes a hCalendar object
    ident.hCalendar = function(){
        //Meta properties
        this.name = '';
        this.domain = '';
        this.sourceUrl = '';
        //Value properties
        this.category = new Array();
        //this.class = '';
        this.dtend = '';
        this.dtstart = '';
        this.dtstamp = '';
        this.duration = '';
        this['dtend-datetime'] = '';
        this['dtstart-datetime'] = '';
        this['dtstamp-datetime'] = '';
        this['duration-datetime'] = '';
        this.location = '';
        this.status = '';
        this.summary = '';
        this.uid = '';
        this.url = '';
        this['last-modified'] = '';
    };

    
    // Describes a value/type object for in the url, email and tel 
    ident.valueTypeProperty = function(){
        //Meta properties
        this.domain = '';
        this.sourceUrl = '';
        //Value properties
        this.value = '';
        this.type = '';
    };
    
    // Describes a username object
    ident.explicitlyDeclaredProfileUrl = function(){
        this.url = '';
        this.rank = 0;
    }
    
    
    ident.combinedProfile = new ident.hCard();
    
    
    
    // Rates the fullness of a address
    ident.rateAddress = function(testAddress){
        var rating = 0;
        if(testAddress != undefined){
            if(testAddress['extended-address'])
                if (testAddress['extended-address'].length > 0)
                    rating++;
            
            if(testAddress['street-address'])
                if (testAddress['street-address'].length > 0)
                    rating++;

            if (testAddress.locality != "" && testAddress.locality != undefined)
                rating++;

            if (testAddress.region != "" && testAddress.region != undefined)
                rating++;

            if (testAddress['postal-code'] != "" && testAddress['postal-code'] != undefined)
                rating++;

            if (testAddress['country-name'] != "" && testAddress['country-name'] != undefined)
                rating++;
        }
        return rating;
    };
    
 
    

    // Rules for building a combined profile
    // Removed most domain related rules, gone for completeness 23 Aug 09
    ident.createCombinedhCard = function () {
    
        // Reset object structure before adding new data
        var combined = ident.combinedProfile = new ident.hCard();

        for(var x = 0; x <= ident.profiles.length-1; x++){   

            var current = ident.profiles[x]; 
            var sourcedomain = ident.profiles[x].domain;
            var source = ident.profiles[x].sourceUrl;

            if(current.fn)
               combined.fn = ident.addProperties(combined.fn, current.fn, source, sourcedomain);
                    
            if(current.n)
                if(current.n['given-name'])
                    if(current.n['given-name'].length)
                        combined.n = ident.addPropertiesToObject(combined.n, current.n, source, sourcedomain); 
                    
            if(current.role)
                combined.role = ident.addProperties(combined.role, current.role, source, sourcedomain);   
                  
          
            if(current.nickname)
                if(combined.nickname.length)
                    current.nickname[0] = ident.addProperties(combined.nickname[0], current.nickname[0], source, sourcedomain);

            if(current.title)
                if(current.title.length)
                    if(current.domain != "linkedin.com")
                        combined.title[0] = ident.addProperties(combined.title[0], current.title[0], source, sourcedomain);
                             
             if(current.org)
                if(current.org.length)
                    combined.org[0] = ident.addPropertiesToObject(combined.org[0], current.org[0], source, sourcedomain);
            
            // Take first           
            if(current.photo)
                if(current.photo.length)
                    if(combined.photo[0] == undefined)
                        combined.photo[0] = ident.addProperties(combined.photo[0], current.photo[0], source, sourcedomain); 
            
            // Take first
            if(current.logo)
                if(current.logo.length)
                    if(combined.logo[0] == undefined)
                        combined.logo[0] = ident.addProperties(combined.logo[0], current.logo[0], source, sourcedomain); 
                    
            if(current.note)
                if(current.note.length)
                    combined.note[0] = ident.addProperties(combined.note[0], current.note[0], source, sourcedomain); 
                 
             // Collections    
             if(current.adr){
                 var adrValue = 0;                                                           
                 if(combined.adr.length > 0)
                    adrValue = ident.rateAddress(combined.adr[0]);
             
                 if(ident.rateAddress(current.adr[0]) > adrValue )
                    combined.adr[0] = ident.addPropertiesToObject(combined.adr[0], current.adr[0], source, sourcedomain); 
                     
             }
             
             if(current.url)
                 for(var y = 0; y <= current.url.length-1; y++)
                    if( current.url[y].indexOf("http://") > -1)
                        if(ident.containsValue(combined.url, current.url[y]) == false && ident.containsValue(combined.url, current.url[y] + "/") == false)
                            combined.url[combined.url.length++] = ident.addProperties(null, current.url[y], source, sourcedomain); 
                        
             if(current.email)
                 for(var y = 0; y <= current.email.length-1; y++)
                     if( current.email[y].value != undefined)
                        if( current.email[y].value.indexOf("@") > -1)
                            if(ident.containsValue(combined.email, current.email[y].value) == false)
                                combined.email[combined.email.length++] = ident.addPropertiesToObject(null, current.email[y], source, sourcedomain);
                                
             if(current.tel){
                 for(var y = 0; y <= current.tel.length-1; y++){
                    if(ident.containsValue(combined.tel, current.tel[y].value) == false){
                        // Corrects a common error
                        if(current.tel[y].type)
                            if(current.tel[y].type[0] == 'work VOICE')
                                current.tel[y].type[0] = 'work';
                                
                        combined.tel[combined.tel.length++] = ident.addPropertiesToObject(null, current.tel[y], source, sourcedomain);
                    }
                 }
             } 
        }
        
        // Use twitter for note
        for(var x = 0; x <= ident.profiles.length-1; x++){ 
            var current = ident.profiles[x]; 
            var sourcedomain = ident.profiles[x].domain;
            var source = ident.profiles[x].sourceUrl;
            
            if(sourcedomain = "twitter.com"){
                if(current.note)
                    if(current.note.length)
                        combined.note[0] = ident.addProperties(combined.note[0], current.note[0], source, sourcedomain);
                break;            
            }
        }
        
        
        // Use linked-in for note and photo
        for(var x = 0; x <= ident.profiles.length-1; x++){ 
            var current = ident.profiles[x]; 
            var sourcedomain = ident.profiles[x].domain;
            var source = ident.profiles[x].sourceUrl;
           
            if(sourcedomain == "linkedin.com"){
                 
                if(current.photo)
                    if(current.photo.length)
                        combined.photo[0] = ident.addProperties(combined.photo[0], current.photo[0], source, sourcedomain); 
                        
                if(current.note)
                    if(current.note.length)
                        combined.note[0] = ident.addProperties(combined.note[0], current.note[0], source, sourcedomain);         
                
                break;            
            }
        }
        
        
    };
    

    ident.addProperties = function(combined, current, source, sourcedomain){
        if(combined != undefined || combined != null){
            if(combined.value){
                if( current.length > combined.value.length){
                    combined.value = current;
                    combined.sourceUrl = source;
                    combined.domain = sourcedomain;
                    return combined;
                }else{
                    return combined;
                } 
            }else{
                var item = new Object();
                item.value = current;
                item.sourceUrl = source;
                item.domain = sourcedomain;
                return item;
            }
        }else{
            var item = new Object();
            item.value = current;
            item.sourceUrl = source;
            item.domain = sourcedomain;
            return item;
        }
    }
    
    ident.addPropertiesToObject = function(combined, current, source, sourcedomain){
        if(current != undefined){
            var item = current;
            item.sourceUrl = source;
            item.domain = sourcedomain;
            return item;
        }else{
            return null;
        }
    }

    
    
    // Breaks text block at the end of a given sentence
    ident.sentenceTruncate = function (text, number) {
        var output = text;
        if(text != undefined){
            if (text != null) {
                if (text != "" ) {
                    if (text.indexOf('.') > -1) {
                        output = "";
                        var parts = text.split('. ');
                        for(var i = 0; i <= parts.length-1; i++) {
                            if (i < number){
                                output += parts[i] + ". ";
                            }
                        }
                    }
                }
            }
        }
        return output;
    };
    
    

    // Append profile url to _allProfileUrls collection
    ident.appendAllProfileUrls = function(url) {    
        var found = false;
        for(var x = 0; x <= ident._allProfileUrls.length-1; x++){
            if(ident.compareUrl(ident._allProfileUrls[x],url)){
                found = true;
                break;
            }
        }
        if(found == false) 
            ident._allProfileUrls [ident._allProfileUrls.length] = url;
      
    };
    
    
    // Append declared profile url to collection or up ranking if it exisits
    ident.appendDeclaredProfileUrl= function(url) {    
        var found = false;
        for(var x = 0; x <= ident._explicitlyDeclaredProfileUrls.length-1; x++){
            
            if(ident._explicitlyDeclaredProfileUrls[x].url == url){
                found = true;
                ident._explicitlyDeclaredProfileUrls[x].rank ++;
                break
            }
        }
        if(found == false)
        {
            var declaredProfileUrl = new ident.explicitlyDeclaredProfileUrl();
            declaredProfileUrl.url = url;
            ident._explicitlyDeclaredProfileUrls[ident._explicitlyDeclaredProfileUrls.length] = declaredProfileUrl;
        }
    };
    
    
    // Finds the top declared profile Url from hCard Url property
   ident.topDeclaredProfileUrl = function(){
        var top = new ident.explicitlyDeclaredProfileUrl();
        if(ident._explicitlyDeclaredProfileUrls.length > 0)
            top = ident._explicitlyDeclaredProfileUrls[0];
        
        for(var x = 0; x <= ident._explicitlyDeclaredProfileUrls.length-1; x++){
            if(ident._explicitlyDeclaredProfileUrls[x].rank > top.rank)
                top = ident._explicitlyDeclaredProfileUrls[x];
        }
        return top.url;
    };
    
    
     // Finds the top declared formatted name
    ident.topFormattedName = function(){
        var top = new ident.formattedName();
        for(var x = 0; x <= ident._formattedNames.length-1; x++){
            if(ident._formattedNames[x].rank > top.rank)
                top = ident._formattedNames[x];
        }
        return top.name;
    };
    
    
    
    // Append formatted name to collection or up ranking if it exisits
    ident.appendFormattedName = function(fn) {    
        var found = false;
        if(fn != '')
        {
            for(var x = 0; x <= ident._formattedNames.length-1; x++){
                if(ident._formattedNames[x].name.toLowerCase() == fn.toLowerCase()){
                    ident._formattedNames[x].rank ++;
                    found = true;
                    break;
                }
            }
            if(found == false) {
                var formattedName = new ident.formattedName();
                // A number of site have a double space between names
                formattedName.name = fn.replace('  ',' ');
                ident._formattedNames[ident._formattedNames.length] = formattedName;
            }
        }
    };
    
    // Append formatted name to collection or up ranking if it exisits
    ident.containsMe = function(relString) {    
        var found = false;
        if(relString != ''){
            if(relString.indexOf(' ') > -1){
                parts = relString.split(' ');
                for (var x = 0; x < parts.length; x++) {
                    if(parts[x].toLowerCase() == 'me')
                        found = true;
                }
            }else{
                if(relString.toLowerCase() == 'me')
                    found = true;
            }
        }
        return found;
    };
    
     
    // Given an array of hCard on a page return the one which represents the profile
    ident.findRepresentativehCard  = function(hCards, domain){
        
        var foundhCard = null;
        
        // Remove all organisational hCards using fn = org pattern
        var tempArray = new Array();
        for (var x = 0; x < hCards.length; x++) {
            if( hCards[x].fn != hCards[x].org )
                tempArray[tempArray.length] = hCards[x];
        }
        hCards = tempArray;
        
        // If there is only one hCard in array
        if(hCards.length == 1){
            foundhCard = hCards[0];
        }else{
            
            // Check all hCard urls against known profile urls
            if(foundhCard == null){
            
                var topUrl =  ident.topDeclaredProfileUrl();
            
                for (var x = 0; x < hCards.length; x++) {
                    if( hCards[x].url ) {
                        for (var y = 0; y < hCards[x].url.length; y++) {
                            for (var i = 0; i < ident._allProfileUrls.length; i++) {
                                // Check profile urls
                                if( ident.compareUrl( hCards[x].url[y], ident._allProfileUrls[i]) ){
                                    foundhCard = hCards[x];
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            
            // Check to see if we have a name match
            if(foundhCard == null){
                var topName = ident.topFormattedName();
                for (var x = 0; x < hCards.length; x++) {
                    if( hCards[x].fn ) {
                        if( hCards[x].fn.replace('  ',' ') == topName.replace('  ',' ') ){
                            foundhCard = hCards[x];
                            break;
                         }  
                    }
                }
            }
            
        }
        //return foundhCard = hCards[0];
        return foundhCard;
     };
     
     
     // Returns true/false if a property called 'value' is already in an array
    ident.containsValue = function (array, valueString) {
        found = false;
        for (var i = 0; i < array.length; i++) {
            if (array[i].value == valueString) {
                found = true;
                break;
            }
        }
        return found;
    };
    
    
     
 
    
     
     
     
    // jQuery functions
    // Place together so they be more easily swap out
    // ------------------------------------------------------  
     
    var doc = jQuery(document);
    doc.ready(function() {
        // Wire ident.profile.js events into ident.js
        // If we have a microformat (uf) parser loaded.
        if( ident.ufParser != null ){
            doc.bind('ident:update', ident.ufParser.findProfiles);
            doc.bind('ident:reset', ident.resetProfiles);
        }
    });
    
    
    ident.profileAddedEvent = function(){
        ident.statusUpdateEvent(['profile-added']); 
    };
    
 