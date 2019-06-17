var translate = ( path, x, y ) => {
    
    path.position[ 0 ] += x;
    path.position[ 1 ] += y;
    return path;
    
}

var translateAll = ( paths, x, y ) => paths.map( path => translate( path, x, y ) );

var setPosition = ( path, x, y ) => {
    
    path.position[ 0 ] = x;
    path.position[ 1 ] = y;
    return path;
    
}

var lerp = ( a, b, t ) => a + ( b - a ) * t;

var lerpVectors = ( v1, v2, t ) => v1.map( ( x, i ) => lerp( x, v2[ i ], t ) );

var lerpPath = ( path, from, to, t ) => {
    
    path.position = lerpVectors( from.position, to.position, t );
    
    path.rotation = lerp( from.rotation, to.rotation, t );
    
    return path;
    
}

var lerpPaths = ( paths, delay, power, memory ) => {
    
    delay = delay || 0;
    power = power || 5;
    memory = memory || 0;
    
    var count = paths.length - 1;
    var from = paths[ 0 ];
    var to = { position: [0, 0], rotation: 0 }
    
    var prev = paths[ 0 ];
    
    return paths.map( ( path, i ) => {
        var dummy = { position: path.position, rotation: path.rotation }
        var target = lerpPath( dummy, from, to, i / count );
        var d = delay * (1 - Math.pow( 1 - ( i / count ), power ) );
        path.position = lerpVectors( target.position, path.position, d );
        path.rotation = lerp( target.rotation, path.rotation, d );
        var m = memory * Math.pow(  i / count, power );
        path.position = lerpVectors( path.position, prev.position, m );
        path.rotation = lerp( path.rotation, prev.rotation, m );
        return path;
    })
    
}

module.exports = {
    setPosition,
    translate,
    translateAll,
    lerpPaths
}