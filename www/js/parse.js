var DOMParser = DOMParser || require('xmldom').DOMParser;
var parsePathData = require('parse-svg-path');
var absPath = require( 'abs-svg-path' );
var normalizePath = require('normalize-svg-path');

var cmds = {
  'M': 'moveTo',
  'C': 'bezierCurveTo'
};

function parsePath ( node ) {
    
    var data = node.getAttribute( 'd' );
    
    return normalizePath( absPath( parsePathData( data ) ) ).map( path => {
        
        var cmd = cmds[ path[ 0 ] ];
        
        var args = path.slice( 1 );
        
        return [ cmd, args ];
        
    })
    
}

function parseRect( node ) {
    
    var x = Number( node.getAttribute('x') );
    var y = Number( node.getAttribute('y') );
    var hw = Number( node.getAttribute('width') ) / 2;
    var hh = Number( node.getAttribute('height') ) / 2;
    
    return [ 
        [ 'moveTo', [ -hw, -hh ] ],
        [ 'lineTo', [ hw, -hh ] ],
        [ 'lineTo', [ hw, hh ] ],
        [ 'lineTo', [ -hw, hh ] ]
    ];
    
}

module.exports = function parse ( svgString ) {
    
    var parser = new DOMParser();
    var doc = parser.parseFromString( svgString, "image/svg+xml" );
    
    var nodes = doc.getElementsByTagName('svg')[0].childNodes;
    
    return Array.prototype.slice.call( nodes )
        .filter( node => node.nodeType !== 3 )
        .map( node => {
            
            var draws;
            
            switch ( node.nodeName ) {
                
                case 'path':
                    draws = parsePath( node );
                    break;
                    
                case 'rect':
                    draws = parseRect( node );
                    break;
                
            }
            
            return {
                draws,
                position: [0, 0],
                rotation: 0,
                visible: true
            };
            
        })
    
}