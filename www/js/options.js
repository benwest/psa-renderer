var gui = require('./gui');

var options = {
    strokeWidth: .3,
    backgroundColor: '#000000',
    strokeColor: '#FFFFFF',
    fill: true,
    fillColor: '#FFFFFF'
}

gui.add( options, 'strokeWidth' ).min(.1).max(1).step(.01).name('Stroke width');
gui.addColor( options, 'backgroundColor' ).name('Background');
gui.addColor( options, 'strokeColor' ).name('Stroke');
gui.add( options, 'fill' ).name('Fill');
gui.addColor( options, 'fillColor' ).name('Fill color');

gui.remember( options );

module.exports = options;