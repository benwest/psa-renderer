var fs = require('fs')
var express = require('express');
var bodyParser = require('body-parser')
var Canvas = require('canvas');
var ffmpeg = require('fluent-ffmpeg');
var leftPad = require('left-pad');
var execSync = require('child_process').execSync;

var app = express();

app.use( bodyParser.json({limit: '100mb'}) );
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

app.use( express.static('www') );
app.use( '/frames', express.static('frames') );

var draw = require('./www/js/draw');
var bodies = require('./www/js/bodies');

var canvas = new Canvas( 1000, 1000 );
var ctx = canvas.getContext('2d');

function applyTransform ( bodies, frame ) {
    
    bodies.forEach( ( paths, i ) => {
        
        var pathsState = frame[ i ];
        
        paths.forEach( ( path, j ) => {
            
            var pathState = pathsState[ j ];
            
            path.position = pathState.position;
            path.rotation = pathState.rotation;
            path.visible = pathState.visible;
            
        })
        
    })
    
}

function save ( file ) {
    
    fs.writeFileSync( __dirname + file, canvas.toBuffer() );
    
}

function render () {
    
    execSync('ffmpeg -i frames/%05d.png -vcodec png frames/movie.mov')
    
}

app.post( '/render', ( req, res ) => {
    
    var data = JSON.parse( req.body.data );
    
    res.send( data );
    
    data.tape.forEach( ( frame, i ) => {
        
        
        
    })
    
    // req.body.tape.forEach( ( frame, i ) => {
        
    //     applyTransform( bodies, frame );
        
    //     draw( ctx, bodies, req.body.options );
        
    //     save('/frames/' + leftPad( i, 5, '0' ) + '.png');
        
    //     console.log( 'rendered ' + (i + 1) + '/' + req.body.tape.length );
        
    // })
    
    // render();
    
})

app.get('/download', (req, res) => {
    
    res.download( __dirname + '/frames/movie.mov' );
    
})

app.listen( process.env.PORT || 8000, () => console.log('👍🏻') );