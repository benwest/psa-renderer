var drawPath = require('./draw').drawPath;

var SIZE = [500, 500];

module.exports = function ( bodies, options ) {
    
    var canvasGroups = bodies.map( paths => paths.map( path => {
        
        var canvas = document.createElement( 'canvas' );
        var ctx = canvas.getContext('2d');
        
        canvas.width = SIZE[ 0 ];
        canvas.height = SIZE[ 1 ];
        
        ctx.strokeStyle = options.strokeColor;
        ctx.lineWidth = options.strokeWidth;
        
        // ctx.translate( SIZE[0] / 2, SIZE[1] / 2 );
        
        drawPath( ctx, path );
        
        // document.body.appendChild( canvas );
        
        return canvas;
        
    }))
    
    return function draw ( ctx, bodies ) {
        
        ctx.fillStyle = options.backgroundColor;
        ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
        
        ctx.save();
        
        ctx.translate( ctx.canvas.width / 2, ctx.canvas.height / 2 );
        
        canvasGroups.forEach( ( canvases, i ) => {
            
            var paths = bodies[ i ];
            
            canvases.forEach( ( canvas, j ) => {
                
                var path = paths[ j ];
                
                ctx.save();
    
                ctx.translate( path.position[ 0 ], path.position[ 1 ] );
                ctx.rotate( path.rotation );
                
                ctx.drawImage( canvas, -SIZE[ 0 ] / 2, -SIZE[ 1 ] / 2 );
                
                ctx.restore();
                
            })
            
        })
        
        ctx.restore();
        
    }
    
}