var parse = require('./parse');
var transform = require('./transform');

var bodySmall = require('../assets/body_s');
var bodyMedium = require('../assets/body_m');
var bodyLarge = require('../assets/body_l');

module.exports = [{
    svg: bodySmall,
    position: [ 156, -22 ],
    rotation: -18.5
},{
    svg: bodySmall,
    position: [ -29, 60 ],
    rotation: -41.8
},{
    svg: bodyMedium,
    position: [ -70, 233 ],
    rotation: -6.6
},{
    svg: bodyLarge,
    position: [ -15, -172 ],
    rotation: 9.4
},{
    svg: bodyLarge,
    position: [ 51, 51 ],
    rotation: -10.5
}].map( ( o, i ) => {
    
    var svg = o.svg;
    var position = o.position;
    var rotation = o.rotation;
    
    var paths = parse( svg ).reverse();
    
    var x = position[ 0 ];
    var y = position[ 1 ];
    
    transform.translate( paths[ 0 ], x, y );
    paths[ 0 ].rotation = ( rotation / 360 ) * Math.PI * 2;
    
    paths[ paths.length - 1 ].visible = i === 0;
    
    transform.lerpPaths( paths );
    
    return paths;
    
})