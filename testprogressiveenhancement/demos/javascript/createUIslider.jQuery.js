/*
 * --------------------------------------------------------------------
 * jQuery-Plugin - creates a UI slider component from a select element
 * by Scott Jehl, scott@filamentgroup.com
 * http://www.filamentgroup.com
 * reference article: http://www.filamentgroup.com/lab/...
 * demo page: still in alpha
 * 
 * Copyright (c) 2008 Filament Group, Inc
 * Licensed under GPL (http://www.opensource.org/licenses/gpl-license.php)
 *
 * Usage Notes: please refer to our article above for documentation
 *  
 * Version: 1.0, 04.10.08
 * Changelog:
 * 	
 * --------------------------------------------------------------------
 */


$.fn.createUISlider = function(settings){
	var selects = $(this);
	var sliderAPI = {};

	//id attrs
	var elIds = (function(){
		var tempArr = [];
		selects.each(function(){
			tempArr.push($(this).attr('id'));
		});
		return tempArr;
	})();
	
	//presets by selected indexes
	var presets = (function(){
		var indexes = [];
		selects.each(function(){
			indexes.push($(this).find('option:selected').get(0).index);
		});
		return indexes;
	})();
	
	
	//array of all options
	var options = (function(){
		var opts = [];
		selects.eq(0).find('option').each(function(i){
			opts.push({
				value: $(this).attr('value'),
				text: $(this).text()
			});
		});
		return opts;
	})();
	
	//opt groups if present
	var groups = (function(){
		if(selects.eq(0).find('optgroup').size()>0){
			var groupedData = [];
			selects.eq(0).find('optgroup').each(function(i){
				groupedData[i] = {};
				groupedData[i].label = $(this).attr('label');
				groupedData[i].options = [];
				$(this).find('option').each(function(){
					groupedData[i].options.push($(this).get(0).index);
				});
			});
			return groupedData;
		}
		else return false;
	})();
	
	sliderAPI.range = selects.length > 1;//boolean for whether it's a range or not
	sliderAPI.minValue = 0;//set min value to 0 (maps to first option index)
	sliderAPI.maxValue = 100;//options.length-1;//set max value to last option index
	sliderAPI.steps = options.length-1;
	sliderAPI.stepping = true;
	sliderAPI.handles = (function(){//set starting locations to selected index, if applicable
		var tempArr = [];
		selects.each(function(i){
			tempArr[i] = {
				start: presets[i],
				min: sliderAPI.minValue,
				max: sliderAPI.maxValue,
				id: 'handle_'+i
			};
		});
		return tempArr;
	})();
	sliderAPI.slide = function(e, ui) {//slide function
		var that = $(this);
		var currValue = ui.value;

		var currIndex = Math.round(currValue / sliderAPI.maxValue * (options.length-1));

		var currValue = options[currIndex].value;
		var currText = options[currIndex].text;
		//handle feedback tooltip and aria attrs
		var feedback = ui.handle.find('.handleFeedback'); 
		feedback.html(currText).parent().attr('aria-valuetext', currValue).attr('aria-valuenow', currValue);
		
		//control original select menu
		var currSelect = $('#'+ui.handle.attr('id').split('handle_')[1]);

		
		currSelect.find('option').eq(currIndex).attr('selected', 'selected');
	}

	//create slider component div
	var sliderComponent = $('<div class="sliderComponent"></div>');

	//CREATE TRACK
	sliderComponent.append('<div class="sliderTrack"></div>');
	var sliderTrack = sliderComponent.find('.sliderTrack');
	
	//CREATE HANDLES
	selects.each(function(i){
		sliderTrack.append('<div id="handle_'+elIds[i]+'" tabindex="'+ i+1 +'" class="ui-slider-handle" role="slider" aria-valuemin="'+ sliderAPI.minValue +'" aria-valuemax="'+  sliderAPI.maxValue +'"><span class="handleFeedback"></span></div>');
	});
	

	
	//CREATE SCALE AND TICS
	sliderComponent.width(220);

	if(groups) {//write dl
		var scale = sliderComponent.append('<dl class="sliderScale clearfix"></dl>').find('.sliderScale:eq(0)');
		$(groups).each(function(){
			scale.append('<dt class="'+ this.label.camelize(true) +'">'+this.label+'</dt>');//class name becomes camelCased label
			$(this.options).each(function(i){
				scale.append('<dd>'+options[i].text+'<span class="tic"></span></dd>');
			});
		});
	}
	else {//write ol
		var scale = sliderComponent.append('<ol class="sliderScale clearfix"></ol>').find('.sliderScale:eq(0)');
		$(options).each(function(){
			scale.append('<li>'+this.value+'<span class="tic"></span></li>');
		});
		scale.find('li:first-child').addClass('first');
		scale.find('li:last-child').addClass('last');
	}



	sliderComponent.find('.sliderScale li, .sliderScale dd').each(function(i){
		$(this).css({
			'left': Math.round((100 / options.length)*i) + '%'
		});
	});

	
	return {'markup': sliderComponent, 'options': sliderAPI};
}






//UTIL FUNCTIONS

//camelize function, converts spaced string to camelCase
String.prototype.camelize=function(lowFirstLetter)
  {
    var str=this.toLowerCase();
    var str_path=str.split('/');
    for(var i=0;i<str_path.length;i++)
    {
      var str_arr=str_path[i].split(' ');
      var initX=((lowFirstLetter&&i+1==str_path.length)?(1):(0));
      for(var x=initX;x<str_arr.length;x++)
        str_arr[x]=str_arr[x].charAt(0).toUpperCase()+str_arr[x].substring(1);
      str_path[i]=str_arr.join('');
    }
    str=str_path.join('::');
    return str;
  };
  
//array.indexof function: gets location of a val in an array
Array.prototype.indexOf = function( v, b, s ) {
 for( var i = +b || 0, l = this.length; i < l; i++ ) {
  if( this[i]===v || s && this[i]==v ) { return i; }
 }
 return -1;
};