var gui = require('./gui');
var options = require('./options');
var render = require('./render');

var recorder = {
    recording: false,
    tape: [],
    frame: ( bodies, options ) => {
        if( !recorder.recording ) return;
        recorder.tape.push(bodies.map( paths => paths.map( path => {
            return {
                position: [ path.position[0], path.position[1] ],
                rotation: path.rotation,
                visible: path.visible
            }
        })))
    },
    record: () => {
        if( recorder.recording ) {
            recorder.recording = false;
            render(options, recorder.tape);
            
        } else {
            recorder.tape = [];
            recorder.recording = true;
        }
    }
}

gui.add( recorder, 'record' );

module.exports = recorder;