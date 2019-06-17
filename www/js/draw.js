function drawPath( ctx, path ) {
    
    if ( !path.visible ) return;
    
    ctx.save();
    
    ctx.translate( path.position[ 0 ], path.position[ 1 ] );
    ctx.rotate( path.rotation );
    
    path.draws.forEach( draw => {
        
        var method = draw[ 0 ];
        var args = draw[ 1 ];
        
        ctx[ method ].apply( ctx, args );
        
    })
    
    ctx.restore();
    
}

function draw ( ctx, bodies, options ) {
    
    ctx.fillStyle = options.backgroundColor;
    ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
    
    ctx.save();
    
    ctx.translate( ctx.canvas.width / 2, ctx.canvas.height / 2 );
    // ctx.scale( options.scale, options.scale );
    
    ctx.strokeStyle = options.strokeColor;
    ctx.lineWidth = options.strokeWidth;
    
    ctx.beginPath();
    
    bodies.forEach( paths => {
        
        paths.forEach( path => drawPath( ctx, path ) );
        
    })
    
    ctx.stroke();
    
    if ( options.fill ) {
        
        ctx.fillStyle = options.fillColor;
        
        bodies.forEach( paths => {
            
            var rect = paths[ 0 ];
            
            ctx.beginPath();
            drawPath( ctx, rect );
            ctx.fill();
            
            ctx.beginPath();
            drawPath( ctx, rect );
            ctx.stroke();
            
        })

    }
    
    ctx.restore();
    
}

draw.drawPath = drawPath;

module.exports = draw;