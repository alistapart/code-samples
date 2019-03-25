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
      div.style.display = "none";
    }
  }
}

window.onload = function()
{
  hideDivs("intro");
}