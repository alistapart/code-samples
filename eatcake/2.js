function hideDivs()
{
  if (!document.getElementsByTagName) return null;
  var divs = document.getElementsByTagName("div");
  for(var i=0; i < divs.length; i++)
  {
    var div = divs[i];
    var id = div.id;
    if ((id != "header") && (id != "footer"))
    {
      div.style.display = "none";
    }
  }
}

window.onload = function()
{
  hideDivs();
}