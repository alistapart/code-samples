
         
     /*
     *  Identi Engine - Twitter YQL
     *  0.1.2 
     *  Uses YQL extended data table support for Twitter.
     *  This fle is optional and is only needed if you want ALL the profile properties from twitter.
     *  Currently a number of properties are not available through hCard parsing alone because of broken implementation on Twitter 
     *  Copyright 2009, Glenn Jones
     *  Licensed under the MIT license.
     *  http://identengine.com/license/
     *  More information on this file: http://identengine.com/identi/
     *  More information on YQL: http://developer.yahoo.com/yql/
     */

    
    // Given url fire API call for JSON data
    ident.getEnchancedTwitterProfile = function(url, apiName){
        
        // Add to API call information into history
        var historyItem = new ident.historyItem(url,'');
        historyItem.apiName = apiName;  // Its a hack      
        historyItem.name = 'Twitter';
        historyItem.domain = 'twitter.com';        
        historyItem.schema = 'hCard';  // Its a hack
        historyItem.contentType = 'Profile'; 
        
        var username = '';
        if(url.indexOf('/') > -1){
            parts = url.split('/');
            username = parts[parts.length-1];
        }
           
        var apiurl = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20twitter.user.profile%20where%20id%3D%27" + username + "%27&format=json&env=http%3A%2F%2Fdatatables.org%2Falltables.env"
        
        historyItem.apiurl = apiurl;
        ident.history[ident.history.length] = historyItem;     
        
        jQuery.getJSON(apiurl + "&callback=?", function(data){
             ident.processEnchancedTwitterJson( data, historyItem, url );
        });
    }
    

	// Processes the raw JSON
	ident.processEnchancedTwitterJson = function(json, historyItem, url ) {
	
	     // Record the return api call
        ident._apiReturnCount++;
    

        // Takes string or objcet
        if(ident.isObject(json))
            yql = json;
        else    
            yql = eval("(" + json + ")");
              
        historyItem.rawJSON = yql;    
            
        var sourceUrl = '';
        var hcard = new ident.hCard();
        hcard.sourceUrl = url;
        hcard.domain = 'twitter.com';
        hcard.name = 'Twitter';
        
        // Walks collection of objects for results  
        if( yql != null){
            if( yql.query != null){
                if( yql.query.results != null){
                    if( yql.query.results.item != null){
                    
                        if( yql.query.results.item.item != null){
                            if( yql.query.results.item.item.length != null){
                                for(var j = 0; j <= yql.query.results.item.item.length-1; j++) {
                                    if(yql.query.results.item.item[j].rel){
                                        if(yql.query.results.item.item[j].rel == "rel:Photo" )
                                            hcard.photo[0] = yql.query.results.item.item[j].resource;
                                    }
                                }
                            }
                       }
                       
                       
                       if( yql.query.results.item.meta != null){
                            if( yql.query.results.item.meta.length != null){
                                for(var j = 0; j <= yql.query.results.item.meta.length-1; j++) {
                                    if(yql.query.results.item.meta[j].property){
                                    
                                        if(yql.query.results.item.meta[j].property == "foaf:name" )
                                            hcard.fn = yql.query.results.item.meta[j].content;
                                            
                                        if(yql.query.results.item.meta[j].property == "foaf:nick" )
                                            hcard.nickname = yql.query.results.item.meta[j].content;
                                            
                                        if(yql.query.results.item.meta[j].property == "foaf:homepage" )
                                            hcard.url[0] = yql.query.results.item.meta[j].content;
                                            
                                        if(yql.query.results.item.meta[j].property == "dc:description" )
                                            hcard.note[0] = yql.query.results.item.meta[j].content;
                                            
                                        if(yql.query.results.item.meta[j].property == "geo:location" ){
                                            var adr = new ident.adr();
                                            adr.locality = yql.query.results.item.meta[j].content;
                                            hcard.adr[0] = adr;
                                        }
                                            
                                    }
                                }
                            }
                       }
                       
                       
                       
                   }
                }
            }
        }
        
        ident.profiles[ident.profiles.length++] = hcard;
        ident.createCombinedhCard();
         
         // Fire custom event for newly add profile
         ident.profileAddedEvent(); 
       
	};
	
	
	
	

