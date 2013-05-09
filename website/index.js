var sorter = require('../index.js'),
    express = require('express'),
    config = require('./config.js'),
    fs = require('fs'),
    util = require('util'),
    request = require('request');

var app = express();
app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.render('index.jade',{});
});

app.post('/', function(req, res){
    sorter(req.files.image.path, function(err, outimg){
        if(err) res.send("Failed: " + err);

        //Temporarily save file for upload
        var filename = './tmp/' + req.files.image.name + '-sorted.jpg';
        outimg.saveJpeg(filename, 100, function(err){
            if(err) res.send("Failed: " + err);

            //Get base64 string (wish I could just get a file stream from gd)
            fs.readFile(filename, function(err, image){

                var base64 = image.toString('base64');

                //Dispose of image
                fs.unlink(filename);

                //Upload to imgur
                request({
                    method: "POST",
                    headers: {
                        Authorization: "Client-ID " + config.imgurClientID
                    },
                    url: "https://api.imgur.com/3/image",
                    json: {
                        title: req.body.title,
                        image: base64
                    }
                }, function(error, response, body){
                    if(!error && response.statusCode < 400)
                    {
                        res.redirect("http://imgur.com/" + body.data.id);
                    }
                    else if(error)
                    {
                        res.send("Failed: " + error);
                    }
                    else
                    {
                        res.send("Failed: " + body.error.message);
                    }
                });
            });
            
        });

    });
});

var port = process.env.PORT || 3001;
app.listen(port);
