var draw = require('./draw');
// var drawFast = require('./drawFast');
var bodies = require('./bodies');
var update = require('./physics')( bodies );
var recorder = require('./recorder');
var options = require('./options');

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
document.body.appendChild( canvas );

function onResize() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
}

window.addEventListener('resize', onResize);

onResize();

// var draw = drawFast( bodies, options );

var tick = () => {
    
    update( bodies );
    
    draw( ctx, bodies, options );
    
    requestAnimationFrame( tick );
    
    recorder.frame( bodies );
    
};

tick();