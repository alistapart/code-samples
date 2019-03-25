
     /*
     *  Copyright 2009, Glenn Jones
     *  A simple method for displaying how different types of "web addresses" can be used with the Ident Engine
     *  Licensed under the MIT license.
     *  http://identengine.com/license/
     *  More information on this file: http://identengine.com/identi/
     */


webAddress = {

    timerId1: null,
    timerId2: null,
    animate: true,
    string1: '',
    string2: '',
    elt: null,
    prefix: 'i.e.',

    personasUserNames:  new Array(),
    accountMappings: new Array(),
    
    accountMapping: function(uritemplate,name){
        this.uritemplate = uritemplate;
        this.name = name;
    },  
      
    init: function(){
        this.personasUserNames[0] = "johnsmith";
        this.personasUserNames[1] = "janeblack";    
        this.accountMappings[0] = new this.accountMapping('http://twitter.com/{username}','twitter');
        this.accountMappings[1] = new this.accountMapping('http://friendfeed.com/{username}','friendfeed');
        this.accountMappings[2] = new this.accountMapping('http://www.flickr.com/people/{username}/','flickr');
        this.accountMappings[3] = new this.accountMapping('http://huffduffer.com/{username}','huffduffer');
        this.accountMappings[4] = new this.accountMapping('http://digg.com/users/{username}','digg');
        this.accountMappings[5] = new this.accountMapping('http://www.linkedin.com/in/{username}','linkedin');
    },
    
    setWebAddress: function(){
        if( this.personasUserNames.length == 0)
            this.init();
    
        var accountNum = Math.ceil(this.accountMappings.length * Math.random())
        var personasNum = Math.ceil(this.personasUserNames.length * Math.random())
        var account = this.accountMappings[accountNum-1];
        var personas = this.personasUserNames[personasNum-1];    
        
        this.string1 =  account.uritemplate.replace('{username}',personas);
        this.string2 =  account.name + ' ' + personas;
        
        $(this.elt).css({ opacity: 0 });
        $(this.elt).html("<span>" + this.prefix + " " + this.string1 + "</span>").animate( { opacity: 1 } , 250 ).animate( { opacity: 1 } , 3250 ).animate( { opacity: 0 } , 250 );
    },
    
    setString2: function(){
        $(this.elt).html("<span>" + this.prefix + " " + this.string2 + "</span>").animate( { opacity: 1 } , 250 ).animate( { opacity: 1 } , 3250 ).animate( { opacity: 0 } , 250 );
    },

    stopAnimate: function(){
      this.clear();
      animate = false; 
    },

    startAnimate: function(){
       animate = true; 
       this.update();
    },
  
    update: function(){
        if(animate) {
            this.clear();
            this.setWebAddress();
            this.timerId1 = setTimeout ("webAddress.setString2()", 4000);
            this.timerId2 = setTimeout ("webAddress.update()", 8000);
        }       
    },
    
    clear: function(){
        clearTimeout(this.timerId1);
        clearTimeout(this.timerId2);
    }
    
    
}

