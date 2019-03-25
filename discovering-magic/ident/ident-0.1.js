
     /*
     *  Ident Engine
     *  0.1.2
     *  Copyright 2009, Glenn Jones
     *  Licensed under the MIT license
     *  http://identengine.com/license/
     *  More information on this file: http://identengine.com/
     */


    ident = new function(){};
    
    // Public use
    ident.version = "0.1.2";
    ident.useInwardEdges = true;
    ident.identities = new Array();    
    ident.domains = new Array();
    ident.history = new Array();
    ident.ufParser = null;
    ident.rssParser = null; 
    ident.atomParser = null;
    ident.iconPath = "ident/icons/";
    ident.addPrimaryURL = true;

    
    // Internal use
    ident._startUrl = '';
    ident._apiReturnCount = 0;
    ident._usernames =  new Array();
    ident._primaryCalled = false; 
    ident._secondaryCalled = false; 

    // A updated version of this JSON data can be found at: http://identengine.com/
    ident._endPoints = {"sites": [{"name": "12seconds tv", "domain": "12seconds.tv", "urlmappings": [{"urltemplate": "http://12seconds.tv/channel/{username}", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://12seconds.tv/followers/{username}", "schema": "hCard", "contenttype": "Friends", "mediatype": "Html"}, {"urltemplate": "http://12seconds.tv/followers/{username}?page={pagenumber}", "schema": "hCard", "contenttype": "Friends", "mediatype": "Html"}, {"urltemplate": "http://12seconds.tv/channel/{username}", "schema": "hAtom", "contenttype": "Video", "mediatype": "Html"}]}, {"name": "43things", "domain": "43things.com", "urlmappings": [{"urltemplate": "http://www.43things.com/person/{username}", "schema": "None", "contenttype": "None", "mediatype": "Html"}, {"urltemplate": "http://www.43things.com/rss/uber/author?username={username}", "schema": "Rss", "contenttype": "Activity", "mediatype": "Rss"}]}, {"name": "43people", "domain": "43people.com", "urlmappings": [{"urltemplate": "http://{username}.43people.com/", "schema": "None", "contenttype": "None", "mediatype": "Html"}, {"urltemplate": "http://www.43people.com/rss/uber/person?person={username}", "schema": "Rss", "contenttype": "Activity", "mediatype": "Rss"}]}, {"name": "Backnetwork", "domain": "backnetwork.com", "urlmappings": []}, {"name": "Backtype", "domain": "backtype.com", "urlmappings": [{"urltemplate": "http://www.backtype.com/{username}/", "schema": "None", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://feeds.backtype.com/{username}", "schema": "Rss", "contenttype": "Activity", "mediatype": "Rss"}]}, {"name": "BarCamp Brighton 3", "domain": "barcampbrighton3.backnetwork.com", "urlmappings": [{"urltemplate": "http://barcampbrighton3.backnetwork.com/people/person.aspx?personid={username}", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://barcampbrighton3.backnetwork.com/people/person.aspx?personid={username}", "schema": "XFN-hCard", "contenttype": "Friends", "mediatype": "Html"}]}, {"name": "BarCamp London 5", "domain": "barcamplondon5.backnetwork.com", "urlmappings": [{"urltemplate": "http://barcamplondon5.backnetwork.com/people/person.aspx?personid={username}", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://barcamplondon5.backnetwork.com/people/person.aspx?personid={username}", "schema": "XFN-hCard", "contenttype": "Friends", "mediatype": "Html"}]}, {"name": "Blip.fm", "domain": "blip.fm", "urlmappings": [{"urltemplate": "http://blip.fm/profile/{username}/", "schema": "None", "contenttype": "None", "mediatype": "Html"}, {"urltemplate": "http://blip.fm/feed/{username}", "schema": "Atom", "contenttype": "Audio", "mediatype": "Atom"}]}, {"name": "Blip.tv", "domain": "blip.tv", "urlmappings": [{"urltemplate": "http://{username}.blip.tv/", "schema": "None", "contenttype": "None", "mediatype": "Html"}]}, {"name": "BlogSpot", "domain": "blogspot.com", "urlmappings": []}, {"name": "Blogger", "domain": "blogger.com", "urlmappings": [{"urltemplate": "http://www.blogger.com/profile/{userid}", "schema": "None", "contenttype": "Profile", "mediatype": "Html"}]}, {"name": "Brightkite", "domain": "brightkite.com", "urlmappings": [{"urltemplate": "http://brightkite.com/people/{username}", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://brightkite.com/people/{username}/friends?page={pagenumber}", "schema": "None", "contenttype": "Friends", "mediatype": "Html"}, {"urltemplate": "http://brightkite.com/people/{username}/objects.rss", "schema": "Atom", "contenttype": "Activity", "mediatype": "Atom"}]}, {"name": "ClaimId", "domain": "claimid.com", "urlmappings": [{"urltemplate": "http://claimid.com/{username}", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}]}, {"name": "CoComment", "domain": "cocomment.com", "urlmappings": [{"urltemplate": "http://www.cocomment.com/comments/{username}", "schema": "None", "contenttype": "None", "mediatype": "Html"}, {"urltemplate": "http://www.cocomment.com/webRssUser/{username}.rss", "schema": "Rss", "contenttype": "Activity", "mediatype": "Rss"}]}, {"name": "Corkd", "domain": "corkd.com", "urlmappings": [{"urltemplate": "http://corkd.com/people/{username}", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://corkd.com/people/{username}/buddies?page={pagenumber}", "schema": "XFN", "contenttype": "Friends", "mediatype": "Html"}]}, {"name": "d.construct 08", "domain": "dconstruct08.backnetwork.com", "urlmappings": [{"urltemplate": "http://dconstruct08.backnetwork.com/people/person.aspx?personid={username}", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://dconstruct08.backnetwork.com/people/person.aspx?personid={username}", "schema": "XFN-hCard", "contenttype": "Friends", "mediatype": "Html"}]}, {"name": "Delicious", "domain": "del.icio.us", "urlmappings": [{"urltemplate": "http://feeds.delicious.com/v2/rss/{username}?count=20", "schema": "Atom", "contenttype": "Bookmarks", "mediatype": "Atom"}, {"urltemplate": "http://del.icio.us/rss/{username}", "schema": "Rss", "contenttype": "Bookmarks", "mediatype": "Rss"}, {"urltemplate": "http://del.icio.us/{username}#bundle-tags", "schema": "rel-tag", "contenttype": "Interests", "mediatype": "Html"}, {"urltemplate": "http://del.icio.us/{username}", "schema": "None", "contenttype": "None", "mediatype": "Html"}, {"urltemplate": "http://delicious.com/{username}", "schema": "None", "contenttype": "None", "mediatype": "Html"}]}, {"name": "Digg", "domain": "digg.com", "urlmappings": [{"urltemplate": "http://digg.com/users/{username}", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://digg.com/users/{username}/friends/view/page{pagenumber}", "schema": "XFN-hCard", "contenttype": "Friends", "mediatype": "Html"}]}, {"name": "Disqus", "domain": "disqus.com", "urlmappings": [{"urltemplate": "http://www.disqus.com/people/{username}/", "schema": "None", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://www.disqus.com/people/{username}/comments.rss", "schema": "Rss", "contenttype": "Lifestream", "mediatype": "Rss"}]}, {"name": "Django People", "domain": "djangopeople.net", "urlmappings": [{"urltemplate": "http://djangopeople.net/{username}/", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://djangopeople.net/{username}/", "schema": "XFN", "contenttype": "Services", "mediatype": "Html"}]}, {"name": "Dopplr", "domain": "dopplr.com", "urlmappings": [{"urltemplate": "http://www.dopplr.com/traveller/{username}", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}]}, {"name": "Edenbee", "domain": "edenbee.com", "urlmappings": [{"urltemplate": "http://www.edenbee.com/users/{username}", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://www.edenbee.com/users/{username}/relationships?page=(pagenumber}", "schema": "hCard", "contenttype": "Friends", "mediatype": "Html"}, {"urltemplate": "http://www.edenbee.com/users/{username}/relationships", "schema": "hCard", "contenttype": "Friends", "mediatype": "Html"}, {"urltemplate": "http://edenbee.com/users/{username}", "schema": "None", "contenttype": "None", "mediatype": "Html"}]}, {"name": "Emberapp", "domain": "emberapp.com", "urlmappings": [{"urltemplate": "http://emberapp.com/{username}", "schema": "None", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://emberapp.com/{username}/images.rss", "schema": "None", "contenttype": "Images", "mediatype": "Rss"}]}, {"name": "Facebook", "domain": "facebook.com", "urlmappings": []}, {"name": "FFFFound", "domain": "ffffound.com", "urlmappings": [{"urltemplate": "http://ffffound.com/home/{username}/found/feed", "schema": "Rss", "contenttype": "Images", "mediatype": "Rss"}, {"urltemplate": "http://ffffound.com/home/{username}/found/", "schema": "None", "contenttype": "None", "mediatype": "Html"}]}, {"name": "Flickr", "domain": "flickr.com", "urlmappings": [{"urltemplate": "http://www.flickr.com/people/{username}/", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://api.flickr.com/services/feeds/photos_public.gne?id={userid}&format=rss_200", "schema": "Rss", "contenttype": "Images", "mediatype": "Rss"}, {"urltemplate": "http://api.flickr.com/services/feeds/photos_public.gne?id={userid}&format=atom", "schema": "Atom", "contenttype": "Images", "mediatype": "Atom"}, {"urltemplate": "http://www.flickr.com/photos/{username}/", "schema": "None", "contenttype": "Images", "mediatype": "Html"}, {"urltemplate": "http://www.flickr.com/people/{username}/contacts/?page={pagenumber}", "schema": "None", "contenttype": "Friends", "mediatype": "Html"}]}, {"name": "FOTB 08", "domain": "fotb08.backnetwork.com", "urlmappings": [{"urltemplate": "http://fotb08.backnetwork.com/people/person.aspx?personid={username}", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://fotb08.backnetwork.com/people/person.aspx?personid={username}", "schema": "XFN-hCard", "contenttype": "Friends", "mediatype": "Html"}]}, {"name": "Fotolog", "domain": "fotolog.com", "urlmappings": [{"urltemplate": "http://www.fotolog.com/{username}", "schema": "None", "contenttype": "Profile", "mediatype": "Html"}]}, {"name": "FriendFeed", "domain": "friendfeed.com", "urlmappings": [{"urltemplate": "http://friendfeed.com/{username}", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://friendfeed.com/{username}/services", "schema": "XFN", "contenttype": "Services", "mediatype": "Html"}, {"urltemplate": "http://friendfeed.com/{username}?format=atom", "schema": "Atom", "contenttype": "Lifestream", "mediatype": "Atom"}]}, {"name": "GetSatisfaction", "domain": "getsatisfaction.com", "urlmappings": [{"urltemplate": "http://getsatisfaction.com/people/{username}", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://getsatisfaction.com/people/{username}.rss", "schema": "Rss", "contenttype": "Activity", "mediatype": "Rss"}]}, {"name": "Github", "domain": "github.com", "urlmappings": [{"urltemplate": "http://github.com/{_usernames}/", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://github.com/{username}.atom", "schema": "Atom", "contenttype": "Activity", "mediatype": "Atom"}]}, {"name": "Google", "domain": "google.com", "urlmappings": [{"urltemplate": "http://www.google.com/profiles/{username}", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://www.google.com/profiles/{userid}", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}]}, {"name": "hi5", "domain": "hi5.com", "urlmappings": []}, {"name": "Huffduffer", "domain": "huffduffer.com", "urlmappings": [{"urltemplate": "http://huffduffer.com/{username}", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://huffduffer.com/{username}/rss", "schema": "Rss", "contenttype": "Audio", "mediatype": "Rss"}, {"urltemplate": "http://huffduffer.com/{username}", "schema": "hAtom", "contenttype": "Audio", "mediatype": "Html"}]}, {"name": "Identica", "domain": "identi.ca", "urlmappings": [{"urltemplate": "http://identi.ca/{username}", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://identi.ca/{username}/foaf", "schema": "FOAF", "contenttype": "Profile", "mediatype": "Xml"}, {"urltemplate": "http://identi.ca/{username}/subscriptions?page={pagenumber}", "schema": "hCard", "contenttype": "Friends", "mediatype": "Html"}, {"urltemplate": "http://identi.ca/{username}", "schema": "hAtom", "contenttype": "Status", "mediatype": "Html"}, {"urltemplate": "http://identi.ca/{username}", "schema": "rel-tag", "contenttype": "Interests", "mediatype": "Html"}, {"urltemplate": "http://identi.ca/{username}/all", "schema": "hAtom", "contenttype": "Friends Status", "mediatype": "Html"}]}, {"name": "Jaiku", "domain": "jaiku.com", "urlmappings": [{"urltemplate": "http://{username}.jaiku.com/", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}]}, {"name": "JPG", "domain": "jpgmag.com", "urlmappings": [{"urltemplate": "http://www.jpgmag.com/people/{username}/photos", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://www.jpgmag.com/people/{username}/rss", "schema": "Rss", "contenttype": "Images", "mediatype": "Rss"}, {"urltemplate": "http://www.jpgmag.com/people/{username}/stories/rss", "schema": "Rss", "contenttype": "Entries", "mediatype": "Rss"}, {"urltemplate": "http://www.jpgmag.com/people/{username}/stories", "schema": "None", "contenttype": "None", "mediatype": "Html"}]}, {"name": "krop.com", "domain": "krop.com", "urlmappings": [{"urltemplate": "http://www.krop.com/{username}/resume/", "schema": "None", "contenttype": "Resume", "mediatype": "Html"}, {"urltemplate": "http://www.krop.com/{username}/portfolio/", "schema": "None", "contenttype": "Profile", "mediatype": "Html"}]}, {"name": "Last.fm", "domain": "last.fm", "urlmappings": [{"urltemplate": "http://www.last.fm/user/{username}", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://www.last.fm/user/{username}/friends?page={pagenumber}", "schema": "hCard", "contenttype": "Friends", "mediatype": "Html"}, {"urltemplate": "http://ws.audioscrobbler.com/1.0/user/{username}/recenttracks.rss", "schema": "Rss", "contenttype": "Activity", "mediatype": "Rss"}, {"urltemplate": "http://www.last.fm/user/{username}", "schema": "hCalendar", "contenttype": "Events", "mediatype": "Html"}, {"urltemplate": "http://ws.audioscrobbler.com/1.0/user/{username}/events.rss", "schema": "Rss", "contenttype": "Events", "mediatype": "Rss"}]}, {"name": "Linked-in", "domain": "linkedin.com", "urlmappings": [{"urltemplate": "http://www.linkedin.com/in/{username}", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://www.linkedin.com/in/{username}", "schema": "hResume", "contenttype": "Resume", "mediatype": "Html"}, {"urltemplate": "http://www.linkedin.com/pub/{username}", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://www.linkedin.com/pub/{username}", "schema": "hResume", "contenttype": "Resume", "mediatype": "Html"}]}, {"name": "Livejournal", "domain": "livejournal.com", "urlmappings": [{"urltemplate": "http://{username}.livejournal.com/", "schema": "None", "contenttype": "Profile", "mediatype": "Html"}]}, {"name": "MadgexLab", "domain": "ufapi.lab.madgex.com", "urlmappings": [{"urltemplate": "http://ufapi.lab.madgex.com/profile/{username}", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}]}, {"name": "Mashed 08", "domain": "mashed08.backnetwork.com", "urlmappings": [{"urltemplate": "http://mashed08.backnetwork.com/people/person.aspx?personid={username}", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://mashed08.backnetwork.com/people/person.aspx?personid={username}", "schema": "XFN-hCard", "contenttype": "Friends", "mediatype": "Html"}]}, {"name": "Meetup", "domain": "meetup.com", "urlmappings": []}, {"name": "Microformats.org", "domain": "microformats.org", "urlmappings": [{"urltemplate": "http://microformats.org/wiki/User:{username}", "schema": "hCard", "contenttype": "Profile"}]}, {"name": "Mybloglog", "domain": "mybloglog.com", "urlmappings": [{"urltemplate": "http://www.mybloglog.com/buzz/members/{username}/hcard", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://www.mybloglog.com/buzz/members/{username}/", "schema": "None", "contenttype": "None", "mediatype": "Html"}, {"urltemplate": "http://www.mybloglog.com/buzz/members/{username}/me/rss.xml", "schema": "Atom", "contenttype": "Lifestream", "mediatype": "Atom"}]}, {"name": "My Name is E", "domain": "mynameise.com", "urlmappings": [{"urltemplate": "http://www.mynameise.com/{username}", "schema": "None", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://mynameise.com/{username}", "schema": "None", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://mynameise.com/{username}", "schema": "XFN", "contenttype": "Services", "mediatype": "Html"}]}, {"name": "MyOpenid", "domain": "myopenid.com", "urlmappings": [{"urltemplate": "http://{username}.myopenid.com/", "schema": "None", "contenttype": "None", "mediatype": "Html"}]}, {"name": "MySpace", "domain": "myspace.com", "urlmappings": [{"urltemplate": "http://myspace.com/{username)", "schema": "None", "contenttype": "None", "mediatype": "Html"}, {"urltemplate": "http://www.myspace.com/{username)", "schema": "None", "contenttype": "None", "mediatype": "Html"}]}, {"name": "Newsvine", "domain": "newsvine.com", "urlmappings": [{"urltemplate": "http://{username}.newsvine.com/", "schema": "None", "contenttype": "None", "mediatype": "Html"}]}, {"name": "Odeo", "domain": "odeo.com", "urlmappings": [{"urltemplate": "http://odeo.com/users/{username}", "schema": "None", "contenttype": "None", "mediatype": "Html"}]}, {"name": "Orkut", "domain": "orkut.com", "urlmappings": [{"urltemplate": "http://www.orkut.com/Profile.aspx?uid={userid}", "schema": "None", "contenttype": "None", "mediatype": "Html"}]}, {"name": "Plaxo", "domain": "plaxo.com", "urlmappings": [{"urltemplate": "http://{username}.myplaxo.com/", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}]}, {"name": "Plazes", "domain": "plazes.com", "urlmappings": [{"urltemplate": "http://plazes.com/whereis/{username}", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://plazes.com/whereis/{username}", "schema": "hCalendar", "contenttype": "Events", "mediatype": "Html"}]}, {"name": "Profilactic", "domain": "profilactic.com", "urlmappings": [{"urltemplate": "http://www.profilactic.com/profile/{username}", "schema": "None", "contenttype": "Profile", "mediatype": "Html"}]}, {"name": "Readernaut", "domain": "readernaut.com", "urlmappings": [{"urltemplate": "http://readernaut.com/{username}", "schema": "None", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://readernaut.com/feeds/rss/{username}", "schema": "Rss", "contenttype": "Activity", "mediatype": "Rss"}]}, {"name": "Seesmic", "domain": "seesmic.com", "urlmappings": [{"urltemplate": "http://new.seesmic.com/{username}", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://feeds.seesmic.com/user.{username}.atom", "schema": "Atom", "contenttype": "Video", "mediatype": "Atom"}]}, {"name": "Slideshare", "domain": "slideshare.net", "urlmappings": [{"urltemplate": "http://www.slideshare.net/rss/user/{username}", "schema": "Rss", "contenttype": "Slides", "mediatype": "Rss"}, {"urltemplate": "http://www.slideshare.net/{username}", "schema": "None", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://slideshare.net/{username}", "schema": "None", "contenttype": "Profile", "mediatype": "Html"}]}, {"name": "Stumbleupon", "domain": "stumbleupon.com", "urlmappings": [{"urltemplate": "http://www.stumbleupon.com/stumbler/{username}", "schema": "None", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://rss.stumbleupon.com/user/{username}/favorites", "schema": "Rss", "contenttype": "Bookmarks", "mediatype": "Rss"}]}, {"name": "Technorati", "domain": "technorati.com", "urlmappings": [{"urltemplate": "http://technorati.com/people/technorati/{username}", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}]}, {"name": "Threadless", "domain": "threadless.com", "urlmappings": []}, {"name": "Times People", "domain": "timespeople.nytimes.com", "urlmappings": [{"urltemplate": "http://timespeople.nytimes.com/view/user/{username}/", "schema": "None", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://timespeople.nytimes.com/view/user/{username}/rss.xml", "schema": "Rss", "contenttype": "Activity", "mediatype": "Rss"}]}, {"name": "Tumblr", "domain": "tumblr.com", "urlmappings": [{"urltemplate": "http://{username}.tumblr.com/", "schema": "None", "contenttype": "None", "mediatype": "Html"}, {"urltemplate": "http://{username}.tumblr.com/rss", "schema": "Rss", "contenttype": "Lifestream", "mediatype": "Rss"}]}, {"name": "Twitter", "domain": "twitter.com", "urlmappings": [{"urltemplate": "http://twitter.com/{username}", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://twitter.com/{username}#people", "schema": "XFN-hCard", "contenttype": "Friends", "mediatype": "Html"}, {"urltemplate": "http://twitter.com/{username}", "schema": "hAtom", "contenttype": "Status", "mediatype": "Html"}]}, {"name": "Upcoming", "domain": "upcoming.yahoo.com", "urlmappings": [{"urltemplate": "http://upcoming.yahoo.com/user/{userid}/", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://upcoming.yahoo.com/user/{userid}/", "schema": "hCalendar", "contenttype": "Events", "mediatype": "Html"}, {"urltemplate": "http://upcoming.yahoo.com/user/{userid}/past/", "schema": "hCalendar", "contenttype": "Events", "mediatype": "Html"}, {"urltemplate": "http://upcoming.yahoo.com/syndicate/v2/my_events/{userid}", "schema": "Rss", "contenttype": "Events", "mediatype": "Rss"}]}, {"name": "Vimeo", "domain": "vimeo.com", "urlmappings": [{"urltemplate": "http://www.vimeo.com/{username}", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://www.vimeo.com/{username}/contacts/sort:newest/page:{pagenumber}", "schema": "None", "contenttype": "Friends", "mediatype": "Html"}, {"urltemplate": "http://vimeo.com/{username}/videos/rss", "schema": "Atom", "contenttype": "Video", "mediatype": "Atom"}]}, {"name": "Vox", "domain": "vox.com", "urlmappings": [{"urltemplate": "http://{username}.vimeo.com/profile/", "schema": "hCard", "contenttype": "Profile", "mediatype": "Html"}]}, {"name": "Windows Live", "domain": "spaces.live.com", "urlmappings": [{"urltemplate": "http://{username}.spaces.live.com/", "schema": "None", "contenttype": "Profile", "mediatype": "Html"}]}, {"name": "Yelp", "domain": "yelp.com", "urlmappings": []}, {"name": "Youtube", "domain": "youtube.com", "urlmappings": [{"urltemplate": "http://gdata.youtube.com/feeds/base/users/{username}/uploads?alt=rss&v=2", "schema": "Atom", "contenttype": "Video", "mediatype": "Atom"}, {"urltemplate": "http://youtube.com/rss/user/{username}/videos.rss", "schema": "Rss", "contenttype": "Video", "mediatype": "Rss"}, {"urltemplate": "http://youtube.com/user/{username}", "schema": "None", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://www.youtube.com/profile?user={username}", "schema": "None", "contenttype": "Profile", "mediatype": "Html"}, {"urltemplate": "http://www.youtube.com/user/{username}", "schema": "None", "contenttype": "Profile", "mediatype": "Html"}]}]}
    ident._excludeDomains = ["pownce.com","ma.gnolia.com","huff-duff.com","lastfm.com.br","lastfm.com.tr","lastfm.de","lastfm.es","lastfm.fr","lastfm.it","lastfm.jp","lastfm.pl","lastfm.ru","lastfm.se","cn.last.fm","radio.aol.fr"];
    ident._excludeUrls = ["twitter.com/#replies","twitter.com/#inbox","twitter.com/#favorites","twitter.com/following","twitter.com/followers","identi.ca/group","identi.ca/tag","identi.ca/featured","identi.ca/favorited"];
    
    
    // Describes a profile node for identities collection
    ident.profile = function(url,domain){
        this.name = '';
        this.domain = '';
        this.username = new Array();
        this.profileUrl = domain;
        this.iconUrl = new Array();
    };
    
    // Describes a domain node
    ident.domain = function(url,domain){
        this.name = '';
        this.urls = new Array();
        this.domain = domain;
        this.accounts = new Array();
        this.hashCard = false;
        this.hashResume = false;
    };
    
    // Describes a identity node of a domain
    ident.account = function(sgn,verified,profile,resume,ident,pk){
        this.sgn = sgn;
        this.verified = verified;
        this.profile = profile;
        this.resume = resume;
        this.ident = ident;
        this.pk = pk;
    };
    
    // Describes a API call event
    ident.historyItem = function(url,apiurl){
        this.url = url;
        this.apiurl = apiurl;
        this.domain = ''; 
        this.name = '';
        this.contentType = ''; 
        this.schema = ''; 
        this.rawJSON = '';
    }
    
    // Describes a username object
    ident.username = function(){
        this.name = '';
        this.rank = 0;
    }
    
    // The main public function for startings a searching
    ident.search = function(url) {
        ident.reset();
        
        url = ident.convertShorthandAddress(url);
        
        if(ident.isUrl(url)){
            if(ident.isExcludedUrl(url) == false){
                ident._startUrl = url;
                
                // Append the start URL and start processing
//                ident.appendDomainNode('',url,true,'');
//                ident.postProcessDomainNode();
                
                ident.apiManager();
            }else{
                ident.error('Sorry the web address has to represent a person like profile page or a blog i.e. "http://twitter.com/<strong>glennjones</strong>"');
            }
         }else{
            ident.error('Sorry there seem to be a problem with the format of the web address you entered: "' + url + '"');
         }    
    }
    
    // Controls identity API request
    ident.apiManager = function(json, historyItem) {
       
       if(ident.isUrl(ident._startUrl)){
       
            if(json != null){
                // Parse return data
                ident.parseSGN(json, historyItem);
                ident.statusUpdateEvent(['data-change']);
            }
            
            // Thrid call
            if(ident._primaryCalled == true && ident._secondaryCalled == true ){
                // If the profile module is present
                // To do - Add friendfeed.com, mybloglog.com and blog if found;
            } 
            
            // Second call - using edgeOut and edgeIn
            if(ident._primaryCalled == true && ident._secondaryCalled == false ){
                // Call if we want to use inward edges
                if( ident.useInwardEdges == true ){
                    ident._secondaryCalled = true;
                    ident.getSocialGraphData(ident._startUrl, 1 ); 
                }
            } 
            
            // First call - using edgeOut
            if(ident._primaryCalled == false){
                ident._primaryCalled = true;
                ident.getSocialGraphData(ident._startUrl, 0 );    
            } 
            
        }else{
            ident.error('URL "' + ident._startUrl + '" is in the wrong format');
        }
             
    }
    
    // Resets properties and page elements so they can be reused
    ident.reset = function(){
        ident.domains = new Array();
        ident.history = new Array();
        ident.profiles = new Array();
        ident._apiReturnCount = 0;
        ident._primaryCalled = false; 
        ident._secondaryCalled = false; 
        ident._usernames =  new Array();
        ident.resetTrigger();
    }
    
    
    // Assigns the best parser to use
    ident.registerParser = function(parser){
        if( (parser.parseUf > 0 && ident.ufParser == null) || ( ident.ufParser != null && parser.parseUf > ident.ufParser.parseUf  ))
            ident.ufParser = parser;
            
        if( (parser.parseRss > 0 && ident.rssParser == null ) || ( ident.rssParser != null && parser.parseRss > ident.rssParser.parseRss  ))
            ident.rssParser = parser;
            
        if( (parser.parseAtom > 0 && ident.atomParser == null ) || ( ident.atomParser != null && parser.parseAtom > ident.atomParser.parseAtom  ))
            ident.atomParser = parser; 
          
    }
    
    

    // Fires request to Google Social Graph API for data in JSON format
    ident.getSocialGraphData = function(url, edgeIn ){
            
         // Remove options - only inward bound edges - update code
         var apiurl = "http://socialgraph.apis.google.com/lookup?q=" + encodeURIComponent(url) + "&fme=1&edo=1&edi=" + edgeIn + "&sgn=1&pretty=1&jme=1"; 
            
         var historyItem = new ident.historyItem(url,apiurl);
         historyItem.apiName = 'googlesoicalgraph'; 
         ident.history[ident.history.length] = historyItem;

         ident.GoogleGraphAPICall( apiurl, historyItem );
    };

    

    // Parses the returned JSON data from Google Social Graph API
    ident.parseSGN = function(json, historyItem) {

        // Record the returned API call
        ident._apiReturnCount ++;

        if(json != null)
        {
           historyItem.rawJSON = json;
           
           var queryUrl = ''; 
           for(var item in json.canonical_mapping)
                queryUrl = item; // Canonical url
                
            //First - Load all the sgn nodes 
            for(var item in json.nodes){
                if(item.indexOf('sgn://') > -1){
                    var node = json.nodes[item];
                    var profileUrl = '';
                    var nodeUrl = '';
          
                    if(node['attributes']['profile'] != null)
                        profileUrl = node['attributes']['profile'];
                        
                    if(node['attributes']['url'] != null)
                        nodeUrl = node['attributes']['url'];
                
                    ident.appendDomainNode(item,nodeUrl,true,profileUrl);
                    ident.processClaimedNodes(node);
                }
            }
            
            //Second - Load all non sgn nodes
            for(var item in json.nodes){
                if(item.indexOf('http://') > -1){
                    var node = json.nodes[item];
                    ident.appendDomainNode('',item,false,'');
                    ident.processClaimedNodes(node);
                } 
            }
        }
        
        ident.postProcessDomainNode();
       
    };
    
    
    ident.processClaimedNodes = function(node){
    
        if(node["claimed_nodes"] != null){
            // Load sgn's first
            for(var x = 0; x <= node["claimed_nodes"].length-1; x++){
                var tempNode = node["claimed_nodes"][x];
                if(tempNode.indexOf('sgn://') > -1){
                    ident.appendDomainNode(tempNode,'',true,'');
                }
            }
            // Load http's second
            for(var x = 0; x <= node["claimed_nodes"].length-1; x++){
                var tempNode = node["claimed_nodes"][x];
                if(tempNode.indexOf('http://') > -1){
                    ident.appendDomainNode('',tempNode,true,'');
                }
            } 
        }
        
        // Finds unverified claimed nodes when your check in and out edges
        if(node["unverified_claiming_nodes"] != null){
            // Load sgn's first
            for(var x = 0; x <= node["unverified_claiming_nodes"].length-1; x++){
                var tempNode = node["unverified_claiming_nodes"][x];
                if(tempNode.indexOf('sgn://') > -1){
                    ident.appendDomainNode(tempNode,'',false,'');
                }
            }
            // Load http's second
            for(var x = 0; x <= node["unverified_claiming_nodes"].length-1; x++){
                var tempNode = node["unverified_claiming_nodes"][x];
                if(tempNode.indexOf('http://') > -1){
                    ident.appendDomainNode('',tempNode,false,'');
                }
            }
        }
    
    }
    
    
    // Post processes any domain to find addition hits
    ident.postProcessDomainNode = function(sgn, uri, verified, profile) {
        
        // Loop all the found domains and call the append custom data method
        for (var i = 0; i < ident.domains.length; i++){
            ident.appendCustomSGNData(ident.domains[i]);
        }
        ident.disambiguateNodes();
        
        // Sort the collection of domains into order
        ident.domains.sort(ident.sortByName);
        
        ident.buildIdentitiesCollection();
        
        // After all processing trigger custom update event 
        ident.statusUpdateEvent(['data-change']);  
    };
    
    
    // Post processes any domain to find addition hits
    ident.buildIdentitiesCollection = function() {
          
        ident.identities = new Array(); 
        ident.disambiguateNodes();
            
            
        // Display top URL if its not in social media sites - often blog 
        if(ident.addPrimaryURL){
            var topDeclaredUrl = ident.topDeclaredProfileUrl();
            if(topDeclaredUrl != ''){
                var topDeclaredDomain = ident.parseDomainFromURL( topDeclaredUrl );
                var found = false;
                // Check its not a known soical media site
                for (var y = 0; y < ident._endPoints.sites.length; y++) {
                    if(ident.compareRootDomains(ident._endPoints.sites[y].domain, topDeclaredDomain))
                        found = true;
                }
                if(!found){
                    var profile = new ident.profile();
                    profile.name = '';
                    profile.domain = topDeclaredDomain; 
                    profile.iconUrl = ident.iconPath + 'website.png';  
                    profile.profileUrl = topDeclaredUrl; 
                    ident.identities[ident.identities.length] = profile; 
                }  
            }
        }
            
        // Loop for profiles
        for (var x = 0; x < ident.domains.length; x++) {
            // If we have a named social media site list it
            if( ident.domains[x].name ){ 
               
                for (var y = 0; y < ident.domains[x].accounts.length; y++) {
                    var profile = new ident.profile();
               
                   // Find username/id
                   profile.username = ident.domains[x].accounts[y].ident;
                   if( ident.domains[x].accounts[y].ident == '')
                       profile.username = ident.domains[x].accounts[y].pk;
                       
                   profile.name = ident.domains[x].name;
                   profile.domain = ident.domains[x].domain; 
                   profile.iconUrl = ident.iconPath + ident.domains[x].name.replace(/[\-,., ]/g,'') + '.png';  
                   
                   if(ident.domains[x].accounts[y].profile != '' ){
                        profile.profileUrl = ident.domains[x].accounts[y].profile;
                   }else{
                        // If we have no profile link find any url containing correct username
                        if(ident.domains[x].urls)
                            profile.profileUrl = ident.findUserNameBasedURL(ident.domains[x].urls,profile.username)
                   }  
                   if(profile.profileUrl != '' && profile.username != '')
                        ident.identities[ident.identities.length] = profile;
               }
            }
        } 
    };
    
    
    // Appends a new domain or/and identity node to collection
    ident.appendDomainNode = function(sgn, uri, verified, profile) {
        var domain = '';
        
        if(uri.indexOf('http://') == 0)
            domain = ident.parseDomainFromURL(uri);
       
        if(sgn != '')
            if(sgn.indexOf('sgn://') == 0)
                domain = ident.parseDomainFromSGN(sgn);     
            
               
        if(domain.length > 0)
        {   
            // Have we already got an object for this domain
            found = null;
            for (var i = 0; i < ident.domains.length; i++) {
                if (ident.compareRootDomains(domain, ident.domains[i].domain)) {
                    found = ident.domains[i];
                    break;
                }
            }
            
            // Don't use any domain on the exclude list
            var excludeIt = ident.domainIsExcluded(domain);
            
            // Exclude if its mail info
            if(domain == 'mboxsha1')
                excludeIt = true;
            
            if( excludeIt == false)
            {
                if(found == null){
                    // Create a new domain node
                    var newDomain = new ident.domain('','');
                    newDomain.domain = domain.replace('www.','');
                    ident.domains[ident.domains.length] = newDomain;
                    found = newDomain;
                }
                
                // Append url to the domain array of urls
                if(uri != '')
                    ident.appendUrl(found.urls,uri);

                
                if( sgn != ''){
  
                    // Append identity node
                    var identity = new ident.account('','','','','',''); 
                    identity.verified = verified;
                    identity.profile = profile;
                    identity.sgn = sgn;
                    
                    // Find ident and pk from sgn
                    if(identity.sgn != ''){
                        var parts = new Array();
                        if(identity.sgn.indexOf('/?ident=') > -1){
                            parts = identity.sgn.split('/?ident=');
                            if(parts.length == 2){
                                ident.appendUsername(parts[1]);
                                identity.ident = parts[1];
                            } 
                        }
                        
                        if(identity.sgn.indexOf('/?pk=') > -1){
                           parts = identity.sgn.split('/?pk=');
                           if(parts.length == 2)
                                identity.pk = parts[1]; 
                        }
                     }
                     
                     ident.appendUniqueIdentityNode(found,identity);
                 }       
            }  
        }  
    };
    
    // Find and resolve issue of disambiguity in identity nodes
    ident.disambiguateNodes = function(){
    
        for (var i = 0; i < ident.domains.length; i++) {
            // If we have more then one identity node
            if(ident.domains[i].accounts.length > 1){
                var userBaseNodeCount = 0;
                // Count different _usernames
                for(var z = 0; z <= ident.domains[i].accounts.length-1; z++){
                    if(ident.domains[i].accounts[z].ident != '')
                        userBaseNodeCount ++;
                }
                // If we have more than one username based identity node
                if( userBaseNodeCount > 1){
                    var tempArray = new Array();
                    var topName = ident.topUsername();
                    for(var z = 0; z <= ident.domains[i].accounts.length-1; z++){
                        // Add the username node which matches the most common username
                        if(ident.domains[i].accounts[z].ident == topName )
                            tempArray[tempArray.length] = ident.domains[i].accounts[z];
                        // Add all id based nodes
                        if(ident.domains[i].accounts[z].pk != '' )
                            tempArray[tempArray.length] = ident.domains[i].accounts[z];
                    }
                    ident.domains[i].accounts = tempArray;   
                }
            }
        }
    }
    
    // Search through an array of URLs for the first one containing the username
    ident.findUserNameBasedURL = function(urls, username){
        for (var i = 0; i < urls.length; i++) {
            if(urls[i].indexOf(username) > -1){
                return urls[i];
            }
        }
        return '';
    };
    
    
    // Does domains array contain a given domain object
    ident.domainNodeContains = function(domain){
        found = false;
        for (var i = 0; i < ident.domains.length; i++) {
            if(ident.compareRootDomains(domain, ident.domains[i].domain)){
                found = true;
                break;
            }
        }
        return found;
    }
    
    // Finds out if domain is on the exclude list
    ident.domainIsExcluded = function(domain){
        var excludeIt = false;
        for (var i = 0; i < ident._excludeDomains.length; i++) {
            if (ident.compareRootDomains(domain, ident._excludeDomains[i])) {
                excludeIt = true;
                break;
            }
        }
        return excludeIt;
    }
    
    
    // Checks to see if we have already made a API call
    ident.hasAPIBeenCalled = function(url, schema, apiurl){
        var found = false;
        for (var i = 0; i < ident.history.length; i++) {
            if(apiurl != '')
                if(ident.history[i].apiurl == apiurl)
                    found = true;
            if(url != '' && schema != '' && ident.history[i].schema != '')
                if(ident.history[i].url == url && ident.history[i].schema.indexOf(schema) > -1 )
                    found = true;
        }
        return found;
    };
    
    
    // Sorts objects into order using the name property
    ident.sortByName = function(a, b) {
        var x = a.name.toLowerCase();
        var y = b.name.toLowerCase();
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    };
    
    // Sorts objects into order using the domain property
    ident.sortByDomain = function(a, b) {
        var x = a.domain.toLowerCase();
        var y = b.domain.toLowerCase();
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    };
    
    
    // Parse the username or userid from SGN
    ident.parseUserFromSGN = function(siteNode) {
        var sgn = siteNode.sgn.substring(6,siteNode.sgn.length);
        parts = sgn.split('?');
    
        if(parts[1].indexOf('ident=') > -1){
            siteNode.username =  parts[1].replace('ident=','');
        }
        else{
            siteNode.userid =  parts[1].replace('pk=','');
        }
    };
    
    
    // Append url to collection
    ident.appendUrl = function(urls,url) {    
        var found = false;
        for(var x = 0; x <= urls.length-1; x++){
            if(urls[x] == url){
                found = true;
                break
            }
        }
        if(found == false)
            urls[urls.length] = url;
    };
    
    
    // Append username to collection or up ranking if it exisits
    ident.appendUsername = function(username) {    
        var found = false;
        for(var x = 0; x <= ident._usernames.length-1; x++){
            if(ident._usernames[x].name == username){
                
                found = true;
                ident._usernames[x].rank ++;
                break
            }
        }
        if(found == false)
        {
            var user = new ident.username();
            user.name = username;
            ident._usernames[ident._usernames.length] = user;
        }
    };
    
    
    // Find custom SGN data and append it to collection
    ident.appendCustomSGNData = function(domain) {    
 
        for(var x = 0; x <= ident._endPoints.sites.length-1; x++){
            var testdomain = ident._endPoints.sites[x].domain.replace(' ', '');
             
            if(ident.compareRootDomains(domain.domain,testdomain) ){
                domain.name = ident._endPoints.sites[x].name;
                ident.createCustomSGN(domain, ident._endPoints.sites[x]);
            }
        }
    };
                

    
    // Given a site description from the custom SGN data 
    // Append extra data into collection 
    ident.createCustomSGN = function(domain, siteDescription) {
        
        // Append all the url mapping for this domain
        domain.urlmappings = siteDescription.urlmappings;
      
        // Loop the found urls for this domain and find new sgn's;
        for(var z = 0; z <= domain.urls.length-1; z++){
            
             var url = domain.urls[z];
            
             // Loop all the urlmappings for site description
             for(var y = 0; y <= siteDescription.urlmappings.length-1; y++){
                
                var urlmapping = siteDescription.urlmappings[y];
                var urltemplate = urlmapping.urltemplate;
                
                // The urltemplate contains a username or userid parse it
                if (urltemplate != "" && (urltemplate.indexOf("{username}") > -1 || urltemplate.indexOf("{userid}") > -1)) {
                    // Find the char number where the username/userid starts
                    var start = 0;
                    if( urltemplate.indexOf("{username}") > -1 )
                        start = urltemplate.indexOf("{username}");

                    if (urltemplate.indexOf("{userid}") > -1)
                        start = urltemplate.indexOf("{userid}");
                     
                    var parts = new Array(2); 
                     
                    if (start != 0){
                        parts[0] = urltemplate.toLowerCase().substring(0, start);
                        if (urltemplate.indexOf("{username}"))
                            parts[1] = urltemplate.toLowerCase().substring(start + 10);
                        else
                            parts[1] = urltemplate.toLowerCase().substring(start + 8); 
                    }            
        
                    startMatch = false;
                    endMatch = false;
                    user = url;

                    // Romove unneeded front section of url
                    if (url.indexOf(parts[0]) == 0){
                        startMatch = true;
                        part = parts[0];
                        user = user.substring(part.length, user.length);
                    }
                    
                    // Romove end element
                    if (parts.length == 2){
                        if (parts[1].length > 0){
                            if (ident.endsWith(url,parts[1]) ){
                                endMatch = true;
                                user = user.replace(parts[1], "");
                            }
                            else if (ident.endsWith(url,parts[1] + "/"))
                            {
                                endMatch = true;
                                user = user.replace(parts[1] + "/", "");
                            }
                        }
                        else
                        {
                            endMatch = true;
                        }
                    }
                    
                    // Romove any trailing /
                    if (ident.endsWith(user,"/"))
                        user = user.substring(0, user.length - 1);

                    // If the user contain anymore /
                    if (user.indexOf("/") > -1)
                        endMatch = false;

                    // Remove any querystring additions
                    if (user.indexOf("?") > -1){
                        userParts = user.split('?');
                        user = userParts[0];
                    }
                    
                    // Remove any name additions
                    if (user.indexOf("#") > -1){
                        userParts = user.split('#');
                        user = userParts[0];
                    }
                    
                    if (startMatch && endMatch){
                    
                        var identity = new ident.account('','','','','',''); 
                        identity.verified = false;
                        identity.profile = '';
                           
                        if (urlmapping.urltemplate.indexOf("{username}") > -1){
                            identity.ident = user;
                            ident.appendUsername(user);
                            identity.sgn = "sgn://" + domain.domain + "/?ident=" + user;
                        }

                        if (urlmapping.urltemplate.indexOf("{userid}") > -1){
                            identity.pk = user;
                            identity.sgn = "sgn://" + domain.domain + "/?pk=" + user;
                        }
                        
                        ident.appendProfileData(siteDescription.urlmappings, identity, url, domain);
                        
                        if(ident.domainIsExcluded( domain.domain ) == false)
                            ident.appendUniqueIdentityNode(domain,identity);
                        
                     }                       
                } 
            }
        }  
        
        // Loop all identity nodes to find addional sgn's information 
        for(var z = 0; z <= domain.accounts.length-1; z++){
            ident.appendProfileData(siteDescription.urlmappings,domain.accounts[z], '', domain);
        }
          
    } 
    
    // Looks at current identity nodes and work weather a new one needs appending
    ident.appendUniqueIdentityNode = function(domain,identity)
    {
        var found = null;
        
        // Find any node with sgn
        for(var y = 0; y <= domain.accounts.length-1; y++){
            if(domain.accounts[y].sgn == identity.sgn){
                found = domain.accounts[y];
                break;
            }
        }
             
        if(found == null)
            domain.accounts[domain.accounts.length] = identity;
             
    }
    
    
    // Adds a profile and resume mapping date to identity
    // Pre processed for fast excution for identity and profiles 
    ident.appendProfileData = function(urlmappings, identity, url, domain) {
        
           identity.profile = ident.getAPIEndPoint('Profile','hCard',urlmappings, identity);
           identity.resume = ident.getAPIEndPoint('Resume','hResume',urlmappings, identity);
           
           if(identity.profile != '')
                domain.hashCard = true;
                
           if(identity.resume != '')
                domain.hashResume = true;
    }
    
    
    ident.getAPIEndPoint = function(type, schema, urlmappings, identity, page) {
         var url = '';
         if(urlmappings != undefined){
             if(urlmappings.length){
                 for(var y = 0; y <= urlmappings.length-1; y++){
                    var urlmapping = urlmappings[y];

                    if( urlmapping.contenttype == type && urlmapping.schema == schema ){
                        var found = false;
                        url = urlmapping.urltemplate;
                         
                        if(identity.ident != '' && url.indexOf('{username}') > -1){
                            url = url.replace('{username}',identity.ident);
                            found = true; 
                        }
            
                        if(identity.pk != '' && url.indexOf('{userid}') > -1){
                            url = url.replace('{userid}',identity.pk);
                            found = true; 
                        }

                        // Add page number    
                        if(page != undefined)
                            url = url.replace('{pagenumber}',page);
                            
                        if(!found)
                            url = '';      
               
                    }
                    
                    if(url != '')
                        break;
                }
            }
        }
        return url;
    }
    
    
    
    // Finds the top username by rank
    ident.topUsername = function(){
        var top = new ident.username();
        for(var x = 0; x <= ident._usernames.length-1; x++){
            if(ident._usernames[x].rank > top.rank)
                top = ident._usernames[x];
        }
        return top.name;
    }
 
    // Have all the API calls returned 
    ident.isSearching = function(){
        if(ident._apiReturnCount >= ident.history.length){
            return false;
        }else{
            return true;
        }
    }
    
    // Add top level domain pages to excluded urls list
    ident.buildExcludeUrlList = function(){
        for(var x = 0; x <= ident._endPoints.sites.length-1; x++){
            ident._excludeUrls[ident._excludeUrls.length] = ident._endPoints.sites[x].domain; 
        }
    }
    ident.buildExcludeUrlList();
    
    ident.isExcludedUrl = function(url){
        for(var x = 0; x <= ident._excludeUrls.length-1; x++){
            if(ident.compareUrl(url, 'http://' + ident._excludeUrls[x]))
                return true;
        }
        return false;
    }
    
    // Finds shorthand address
    ident.convertShorthandAddress = function(url){
        var foundUrl = '';
        
        if(url != ''){
            url = url.replace('acct:','');
            url = ident.trim(url,' ');
            var parts = new Array();
            
            // format: glennjones@twitter.com i.e. WebFinger style not email
            if(url.indexOf('@' > -1) && url.indexOf('/') == -1 ){  
                parts = url.split('@');
                parts = [parts[1],parts[0]]
            }
            
            // format: twitter.com/glennjones or twitter/glennjones
            if(url.match(/\//g) != null ){  
                if(url.match(/\//g).length == 1 ){  
                    parts = url.split('\\');
                }
            }
            
            // format: twitter.com glennjones or twitter glennjones
            if(url.indexOf(' ') > -1){ 
                parts = url.split(' ');
            } 
            
            // format: twitter.com glennjones or twitter glennjones
            if(parts.length == 2){   
                var identity = new Object();
                var domainPart = ident.trim(parts[0].toLowerCase(),' ');
                var username = ident.trim(parts[1].toLowerCase(),' ');
                identity.ident = username;
                identity.pk = username;
                for(var x = 0; x <= ident._endPoints.sites.length-1; x++){
                    if(domainPart == ident._endPoints.sites[x].domain){
                       foundUrl = ident.getAPIEndPoint('Profile','hCard',ident._endPoints.sites[x].urlmappings, identity);
                       if(foundUrl == '')
                            foundUrl = ident.getAPIEndPoint('Profile','None',ident._endPoints.sites[x].urlmappings, identity);
                            
                    }

                    if(domainPart == ident._endPoints.sites[x].name.toLowerCase().replace(/\s/g, '')){
                       if(foundUrl == '')
                            foundUrl = ident.getAPIEndPoint('Profile','hCard',ident._endPoints.sites[x].urlmappings, identity);
                                if(foundUrl == '')
                                     foundUrl = ident.getAPIEndPoint('Profile','None',ident._endPoints.sites[x].urlmappings, identity);
                    }
                    
                    if(foundUrl != '')
                       break;
                }
            }
            if(foundUrl != '')
                url = foundUrl;
        }
        
        return url;
    }
 
 
    // Utility functions
    // ----------------------------------------------------
 
 
     // Compares a full domain from url to a root domain
    // ie www.twitter.com to twitter.com = true
    ident.compareRootDomains = function(fullDomain, rootDomain) {
        var same = false;
        if(fullDomain != '' || rootDomain != ''){
            //Remove common subdomain
            fullDomain = fullDomain.toLowerCase().replace('www.','');
            // Look for full match
            if(fullDomain == rootDomain){
                same = true;
            }else{
                // Look for part match
                if( fullDomain.indexOf(rootDomain) > -1)
                    same = true;
            }
        }
        return same;
    };
    
    
    // Compares urls for match
    // ie www.twitter.com/glennjones = twitter.com/GlennJones/ 
    ident.compareUrl = function(urlA, urlB) {
        var same = false;
        
        // Remove url fragments
        if( urlA.indexOf('#') > -1)
            urlA = urlA.split('#')[0];
       
        if( urlB.indexOf('#') > -1)
            urlB = urlB.split('#')[0];
        
        if(urlA != '' || urlB != ''){
            //Remove common subdomain
            urlA = urlA.toLowerCase().replace('www.','');
            urlB = urlB.toLowerCase().replace('www.','');
            
            // Make sure anything ends with / 
            if( ident.endsWith(urlA,'/') == false)
                urlA = urlA + '/';
                
            if( ident.endsWith(urlB,'/') == false)
                urlB = urlB + '/';    
                
            // Look for full match
            if(urlA.toLowerCase() == urlB.toLowerCase())
                same = true;
           
        }
        return same;
    };
 
     // Parses the domain name from a given URL
    ident.parseDomainFromURL = function(url) {
        var domain = "";
        if(url != undefined && url != '')
        {
            if (url.indexOf("//") > 0 ){ 
                var parts = url.split("/");
                domain = parts[2];
            }
        }
        return domain;
    };
    
    // Parses the domain name from a given SGN
    // Structure of sgn - sgn://twitter.com/?pk=12497 or sgn://twitter.com/?ident=glennjones
    ident.parseDomainFromSGN = function(sgn) {
        var domain = "";
        sgn = sgn.substring(6,sgn.length);
        var parts = sgn.split('/');
        if(parts[0].length > -1)
            domain = parts[0];
        return domain;
    };
    
 
    // Very simple endsWith function. Use with care
    ident.endsWith = function(str,test)
    {
        var lastIndex = str.lastIndexOf(test);
        return (lastIndex != -1) && (lastIndex + test.length == str.length);
    }
    
    
    // Returns true/false if obj is a object
    ident.isObject =  function(obj) {
        return (typeof obj == "object");
    };
    
    // Returns true/false if obj is a array
    ident.isArray = function(obj) {
       if (obj.constructor.toString().indexOf("Array") == -1)
          return false;
       else
          return true;
    };
    
    // Returns true/false if obj is a string
    ident.isString = function(obj) {
        return typeof obj == 'string';
    };
    
    // Returns true/false if a string is in an array
    ident.contains = function (array, string) {
        var found = false;
        for (var i = 0; i < array.length; i++) {
            if (array[i] == string) {
                found = true;
                break;
            }
        }
        return found;
    };
    
    ident.isUrl = function(string) {
	    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	    return regexp.test(string);
	 };

 
    // Returns a string value what every is paased
    ident.tidyString = function(str){
        var output = "";
        if(ident.isString(str)){
            if(str != undefined){
                if(str != null){
                    output = ident.trim( str )
                }else{
                    output = '';
                }
            }else{
               output = '';
            }
        }
        return output;
    };
    
    
    ident.trim = function(str, chars) {
        if(str != '' && chars != '')
	        return ident.ltrim(ident.rtrim(str, chars), chars);
	    else
	        return '';
    };
 
    ident.ltrim = function(str, chars) {
	    chars = chars || "\\s";
	    return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
    };
 
    ident.rtrim = function(str, chars) {
	    chars = chars || "\\s";
	    return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
    };
    
    // Checks string is Null or Empty
    ident.isNullorEmpty = function(string){
        if (string == null || string == undefined || string == '' )
            return true
        else
            return false
    };
    
     
    // A helper function to finds a value of a given JSON property
    ident.getNodeVaue = function( test, obj ) {
        // Gets a value from a JSON object
        // vcard[0].url[0]
        var output = null;
        try{
            var currentOject = obj;
            var arrayDots = test.split(".");
            for (var i = 0; i < arrayDots.length; i++) {
                if( arrayDots[i].indexOf('[') > -1 )
                {
                    var arrayAB = arrayDots[i].split("[");
                    var arrayName = arrayAB[0];
                    var arrayPosition = Number( arrayAB[1].substring(0,arrayAB[1].length-1) );
		            
		            if( currentOject[arrayName] != null || currentOject[arrayName] != 'undefined' ) {
		                if( currentOject[arrayName][arrayPosition] != null || currentOject[arrayName][arrayPosition] != 'undefined' )
                   	        currentOject = currentOject[arrayName][arrayPosition];
                   	           
                    }
                    else {
                        currentObject = null; 
                    }    
                }
                else
                {
	                if( currentOject[arrayDots[i]] != null || currentOject[arrayDots[i]] != 'undefined'   )
                	    currentOject = currentOject[arrayDots[i]];    
                }
            }
            output = currentOject;
        }catch(err){
            output = null;
        }
        return output;
    }
    





    // jQuery functions
    // ------------------------------------------------------
    
    ident.GoogleGraphAPICall = function( apiurl, historyItem ){
        jQuery.getJSON(apiurl + "&callback=?", function(json){
            ident.apiManager( json, historyItem );
        });
    }
    
    ident.resetTrigger = function(){
        jQuery(document).trigger('ident:reset');
    }

    ident.statusUpdateEvent = function(){
        if(arguments.length > -1)
            jQuery(document).trigger('ident:update', arguments[0]);
        else
            jQuery(document).trigger('ident:update');
    }
    
    ident.error = function(){
        if(arguments.length > -1)
            jQuery(document).trigger('ident:error', arguments[0]);
        else
            jQuery(document).trigger('ident:error');
            
        ident.reset();     
    }
    
    
   