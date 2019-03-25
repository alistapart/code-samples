function fixLinks()
{
  if (!document.getElementsByTagName) return null;
  var server = document.location.hostname;
  var anchors = document.getElementsByTagName("a");
  for(var i=0; i < anchors.length; i++)
  {
    var a = anchors[i];
    var href = a.href;
    var id = a.id;
    var title = a.title;
    if ((href.indexOf("#") != -1) && (href.indexOf("header") == -1)) { // jump ref
      var index = href.indexOf("#") + 1;
      href = "javascript:show('" + href.substring(index) + "');";
      a.setAttribute("href",href);
    } else if (href.indexOf(server) == -1){ // external link
      if(href.indexOf("mailto:") == -1)
      {
        if ((href.indexOf("http://") != -1) || (href.indexOf("https://") != -1))
        { 
          href = "javascript:open_window('" + href + "');";
          a.setAttribute("href",href);
          title = title + " (this link will open in a new window)";
          a.setAttribute("title",title);
        }
      }
    }
  }
}

function hideDivs(exempt)
{
  if (!document.getElementsByTagName) return null;
  if (!exempt) exempt = "";
  var divs = document.getElementsByTagName("div");
  for(var i=0; i < divs.length; i++)
  {
    var div = divs[i];
    var id = div.id;
    if ((id != "header") && (id != "footer") && (id != exempt))
    {
      div.className = "hidden";
    }
  }
}

function show(what)
{
  if (!document.getElementById) return null;
  showWhat = document.getElementById(what);
  showWhat.className = "";
  hideDivs(what);
}

window.onload = function()
{
  fixLinks();
  hideDivs("intro");
}