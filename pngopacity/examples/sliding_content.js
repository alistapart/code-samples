//---------------------------------------------------------------
// Sliding Content
// Original code by Nick Mealy (www.razorlab.com)
//---------------------------------------------------------------

function SlidingContent(objRef, divId, x, y, dt, sp, type) {
	this.ref = objRef;
	this.x = x;
	this.y = y;
	this.targetX  =x;
	this.targetY = y;
	this.blnSliding = 0;	
	this.distance = dt;
	this.speed = sp;
	this.slidetype = type;
	this.blnStopSlide = 0;
	if (ns){
		if (browserVersion>=5) {
			this.layerObject = document.getElementById(divId).style;
		} else { 
			this.layerObject = eval("document."+divId);
		}
	} else {
		this.layerObject = eval(divId + ".style");
	}
	this.slideTo = sc_slideTo;
	this.stopSlide = sc_stopSlide;
	this.keepSliding = sc_keepSliding;
	this.updateLayer = sc_updateLayer;
}
function sc_updateLayer() {	
	this.layerObject.left = Math.round(this.x);
	this.layerObject.top = Math.round(this.y);

}
function sc_slideTo(x,y, blnInterrupt){
	if (blnInterrupt) {
		this.blnSliding = 0;
	}
	if (!this.blnSliding) {
		this.blnSliding = 1;
		this.blnStopSlide = 0;
		this.targetX = x;
		this.targetY = y;	
		this.keepSliding();
	}
}
function sc_stopSlide() {
	this.blnSliding = 0;
	this.blnStopSlide = 1;
}
function sc_keepSliding() {
	if (!this.blnStopSlide) {

		var dx = 0;
		var dy = 0;

		if (this.slidetype == 'con') {	
			
			if (this.targetX > this.x) { 
				dx = this.distance; 
				if ((this.x + dx) >= this.targetX) {this.blnSliding = 0;dx = 0;this.x = this.targetX;}
			} 
			else if (this.targetX < this.x) { 
				dx = (this.distance * -1); 
				if ((this.x + dx) <= this.targetX) { this.blnSliding = 0;dx = 0;this.x = this.targetX;}
			}			
			if (this.targetY > this.y) { 
				dy = this.distance; 
				if ((this.y + dy) >= this.targetY) {this.blnSliding = 0;dy = 0;this.y = this.targetY;} 
			}
			else if (this.targetY < this.y) { 
				dy = (this.distance * -1); 
				if ((this.y + dy) <= this.targetY) {this.blnSliding = 0; dy = 0;this.y = this.targetY; }
			}
		} else {	
			var dx = (this.targetX - this.x)*(1/this.distance);
			var dy = (this.targetY - this.y)*(1/this.distance);	
		}
		this.x = this.x + dx;
		this.y = this.y + dy;
			
		this.updateLayer();
		if ((this.blnSliding == 0) || (Math.round(this.x - this.targetX) == 0) && (Math.round(this.y - this.targetY) == 0) ) {
			this.blnSliding = 0;
		} else {
			thread = window.setTimeout(this.ref + ".keepSliding()", this.speed);
		}
	}
}
