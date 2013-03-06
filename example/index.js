var sorter = require('../index.js');

sorter('lintwar.png', function(err, output){
    if(err) console.log(err);
    output.savePng('output.png', 0, function(err)
    {
        if(err) console.log(err);
    });
});
