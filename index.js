var gd = require('node-gd'),
    _ = require('underscore'),
    mopen = require('gd-magicopen'),
    i2p = require('gd-image2pixels');


module.exports = function(filename, callback)
{
    mopen(filename, function(err, inputimg){
        if(err) callback(err, null);
        pixels = i2p(inputimg);
        var height = pixels.length;
        var width = pixels[0].length;
        var sortedpixels = _.sortBy(_.flatten(pixels), function(pixel){
            return pixel.red + pixel.green + pixel.blue;
        });
        var outputimg = gd.createTrueColor(width, height);
        for(var i = 0; i < height; i++)
        {
            for(var j = 0; j < width; j++)
            {
                var pixel = sortedpixels[i*width + j];
                var color = gd.trueColor(pixel.red,pixel.green,pixel.blue);
                outputimg.setPixel(j,i,pixel.raw);
            }
        }
        callback(null, outputimg);
    });
};
