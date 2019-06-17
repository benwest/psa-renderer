var vec2 = require('gl-vec2');
var gui = require('./gui');
var zip = require('lodash/zip');
var transform = require('./transform');

var { World, Body, Box, LinearSpring, RotationalSpring } = require('p2');

module.exports = function( bodies ) {
    
    var options = {
        linear: {
            stiffness: 100,
            damping: 500
        },
        rotational: {
            stiffness: 500000,
            damping: 50000
        },
        collisionResponse: true,
        delay: 0,
        power: 5,
        memory: 0
    }
    
    var center = vec2.fromValues( window.innerWidth / 2, window.innerHeight / 2 );
    
    var world = new World({
        gravity: [ 0, 0 ]
    });
    
    var [ origins, rects, linearSprings, rotationalSprings ] = zip( ...bodies.map( paths => {
        
        var { position, rotation, draws } = paths[ 0 ];
        
        var w = draws[ 0 ][ 1 ][ 0 ] * -2
        var h = draws[ 0 ][ 1 ][ 1 ] * -2
        
        var origin = {
            position: position.slice(),
            angle: rotation
        }
        
        var body = new Body({
            mass: 100,//( w * h ) / 1000,
            position: position.slice(),
            angle: rotation
        })
        
        var shape = new Box({
            width: w,
            height: h
        })
        
        body.addShape( shape );
        
        world.addBody( body );
        
        var pin = new Body({
            mass: 0,
            position: position.slice()
        })
        
        world.addBody( pin );
        
        var lSpring = new LinearSpring( body, pin, options.linear );
        world.addSpring( lSpring );
        
        var rSpring = new RotationalSpring( body, pin, options.rotational );
        world.addSpring( rSpring );
        
        return [ origin, body, lSpring, rSpring ];
        
    }))
    
    var mousedown = false;
    var mouse = vec2.create();
    
    window.addEventListener( 'mousedown', () => mousedown = true );
    window.addEventListener( 'touchstart', () => mousedown = true );
    window.addEventListener( 'mouseup', () => mousedown = false );
    window.addEventListener( 'touchend', () => mousedown = false );
    window.addEventListener( 'mousemove', e => vec2.set( mouse, e.clientX, e.clientY ) );
    window.addEventListener( 'touchmove', e => {
        var t = e.touches[ 0 ];
        vec2.set( mouse, t.clientX, t.clientY )
    })
    
    var updateArray = ( array, property ) => value => {
        array.forEach( obj => obj[ property ] = value );
    }
    var addArrayGUI = ( gui, array, obj, prop, min, max, step ) => {
        var ctrl = gui.add( obj, prop, min, max );
        if ( step !== undefined ) ctrl.step( step );
        ctrl.onChange( updateArray( array, prop ) )
        return ctrl;
    }
    
    addArrayGUI( gui, linearSprings, options.linear, 'stiffness', 0, 1000 ).name('Snap Position');
    // fl.add( options.linear, 'stiffness', 0, 1000 );
    // fl.add( options.linear, 'damping', 0, 2 ).step(.01);
    addArrayGUI( gui, rotationalSprings, options.rotational, 'stiffness', 0, 1000000 ).name('Snap Rotation');
    // fr.add( options.rotational, 'stiffness', 0, 1000 );
    // fr.add( options.rotational, 'damping', 0, 2 ).step(.01);
    
    addArrayGUI( gui, rects, options, 'collisionResponse' ).name( 'Collisions' )
    
    gui.add(options, 'delay', 0, .95 ).step(.01);
    gui.add(options, 'power', 1, 20 );
    gui.add(options, 'memory', 0, 1 );
    
    var then;
    
    return function update ( bodies ) {
        
        var now = Date.now();
        
        var dT = then ? Math.min( now - then, 16 ) / 1000 : 0;
        
        world.step( 1 / 60, dT );
        
        rects.forEach( ( rect, i ) => {
            
            var paths = bodies[ i ];
            var origin = origins[ i ];
            var rectPath = paths[ 0 ];
            
            rect.angularVelocity *= .95;
            
            var f = vec2.create();
            vec2.subtract( f, origin.position, rect.position );
            vec2.scale( f, f, 10 );
            rect.applyImpulse( f );
            
            vec2.scale( rect.velocity, rect.velocity, .99 )
            
            rectPath.position = rect.interpolatedPosition.slice();
            rectPath.rotation = rect.interpolatedAngle;
            
            transform.lerpPaths( paths, options.delay, options.power, options.memory );
            
        })
        
        if ( mousedown ) {
        
            var click = vec2.create();
            vec2.subtract( click, mouse, center );
            
            rects.forEach( rect => {
                
                var force = vec2.create();
                
                vec2.subtract( force, rect.position, click );
                
                var d = vec2.length( force );
                
                vec2.normalize( force, force );
                
                var power = Math.max( 400 - d, 0 ) / 400;
                
                vec2.scale( force, force, power * 100000 )
                
                var localClick = vec2.create();
                
                rect.toLocalFrame( localClick, click );
                
                rect.applyImpulse( force, localClick );
                
            })
        
        }
    
        then = now;
        
    }
    
}