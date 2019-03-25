/*
	firdom()
	written by Chris Heilmann (http://www.onlinetools.org)
*/

function firdom(){
	if(document.getElementsByTagName && document.createElement){
		for (l=1;l<=6;l++){
			h1s=document.getElementsByTagName('h'+l);
			scanandreplace(h1s,'h'+l);
		}
	}
}
function scanandreplace(h1s,tag){
	for(i=0;i<h1s.length;i++){
		for(f=0;f<replaceImages.length;f++){
			chunks=replaceImages[f].split('|');
			thish1=document.getElementsByTagName(tag)[i];
			if(thish1.firstChild.nodeValue==chunks[0]){
				newImg=document.createElement('img');			
				newImg.setAttribute('alt',chunks[0])
				newImg.setAttribute('src',chunks[1])
				// or newImg.src=chunks[1];
				thish1.replaceChild(newImg,thish1.firstChild)
			}
		}
	}
}
window.onload=firdom;
