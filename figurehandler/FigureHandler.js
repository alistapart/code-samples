/*------------------------------------------------------------------------------
Function:       FigureHandler()
Author:         Aaron Gustafson (aaron at easy-designs dot net)
Creation Date:  20 August 2007
Version:        0.1
Homepage:       http://code.google.com/p/easy-designs/wiki/FigureHandler
License:        MIT License (see homepage)
Note:           If you change or improve on this script, please let us know by
                emailing the author (above) with a link to your demo page.
------------------------------------------------------------------------------*/
function FigureHandler( id, sizes ){

  // private properties
  if( typeof( sizes ) !== 'object' ){
    var sizes  = { '75-100': 'full-col',
                   '67-75':  'three-quarters-col',
                   '50-67':  'two-thirds-col',
                   '34-50':  'half-col',
                   '25-34':  'third-col',
                   '0-25':   'quarter-col' };
  }
  var selector = '.figure';
  if( typeof( id ) == 'string' ) selector = '#' + id + ' ' + selector;

  // private methods
  function init(){
    $$( selector ).each( function( figure ){
      // get the image width
      var img_width = figure.getElementsByTagName( 'img' )[0].width;
      // determine the relative sizing
      var col_width = parseInt( $( figure.parentNode ).getStyle( 'width' ) );
      var percent = Math.ceil( img_width/col_width * 100 );
      var range, col_class;
      for( var size in sizes ){
        range = size.split( '-' );
        if( percent > range[0] &&
            percent <= range[1] ){
          col_class = sizes[size];
          break;
        }
      }
      figure.addClassName( col_class );
      // set the width of any paragraphs to match
      $A( figure.getElementsByTagName( 'p' ) ).each( function( p ){
        p.style.width = img_width + 'px';
      } );
    });
  }

  // start it up
  init();
}