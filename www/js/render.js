var xhr = require('xhr');

module.exports = ( options, tape ) => {
    
    var form = document.getElementById('form');
    var input = document.getElementById('data');
    
    var data = JSON.stringify( { options, tape } );
    
    input.value = data;
    
    form.submit();
    
    // xhr({
    //     method: 'POST',
    //     uri: '/render',
    //     body: { options, tape },
    //     json: true
    // }, ( err, res ) => {
    //     location.href = '/download';
    // })
    
}