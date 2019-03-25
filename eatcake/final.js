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
    if (href.indexOf("#header") != -1) { // back to top
      a.className = "alt";
    } else if ((href.indexOf("#") != -1) && (href.indexOf("header") == -1)) { // jump ref
      var index = href.indexOf("#") + 1;
      href = "javascript:show('" + href.substring(index) + "');";
      a.setAttribute("href",href);
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

function sendFocus(what)
{
  var obj = document.getElementById(what);
  obj.focus();
}

function open_window(href)
{
  var width = parseInt(screen.availWidth * .8);
  var height = parseInt(screen.availHeight * .8);
  var x = parseInt((screen.availWidth/2) - (width/2));
  var y = parseInt((screen.availHeight/2) - (height/2));
  var windowFeatures = "width=" + width + ",height=" + height + ",left=" + x +",screenX=" + x +",top=" + y + ",screenY=" + y;
  var openWindow = this.open(href, "Popup", windowFeatures);
}


window.onload = function()
{
  fixLinks();
  hideDivs("intro");
  sendFocus("navIntro");
}