var express = require("express");  
var path  = require('path');
var multer = require('multer');
var crypto = require('crypto');
var cors = require('cors');
var fs = require('fs');
var fileName = 'ThumbImg';
var filePath = '../../publishedAds/';
var userIDhash = "";
var timeStamp = 0;

var app = express();
app.use(cors());

var storage = multer.diskStorage({  
      destination: function (req, file, callback) {
        callback(null, '../../data/publishedAds/');  
      },  
      filename: function (req, file, callback) {  
        fileName = 'ThumbImg' + path.extname(file.originalname);
        callback(null, fileName);  
      }  
    });  
var upload = multer({ storage : storage}).single('thumbImg');

app.use(express.json());
app.use(upload);

/*
    Step 1: Create MD5 hash of the user ID
    Step 2: Create folder for the user as: ./publishedAds/<userIDhash>/<currentTimeStamp>.
    Step 3: Perform image upload to root uploads directory.
    Step 4: Move the image and data that directory and place it in the path mentioned above.
    Step 5: write out a text file containing the JSON for all the details received from the form.
    Step 6: Update new arrivals JSON.
*/

function step1(str) {
    userIDhash = crypto.createHash('md5').update(str).digest('hex');
}

function step2() {
    filePath = '../../data/publishedAds/';
    if (!fs.existsSync(filePath))
        fs.mkdirSync(filePath);
    
    
    filePath += userIDhash;
    filePath += '/';
    if (!fs.existsSync(filePath))
        fs.mkdirSync(filePath);
    
    timeStamp = Date.now();
    filePath += timeStamp;

    if (!fs.existsSync(filePath))
        fs.mkdirSync(filePath);
    
    filePath += '/';
}

function processMetadata(metadata) {
    metadata["ArrivalTime"] = timeStamp;
    metadata["Available"] = "YES";
    metadata["ImgLink"] = filePath + fileName;
    return metadata;
}

function updateNewArrivals(newData) {
    var temp = [];
    try {
      var data = JSON.parse(fs.readFileSync('../../newarrivalspage/newarrivals.json', 'utf-8'));
      if (data.length >= 25) {
        temp.push(newData);
        for (var i = 0; i < data.length - 1; i++)
            temp.push(data[i]);
        
        data = temp;
      }
      else {
        var temp = [];
        temp.push(newData);
        for (var i = 0; i < data.length; i++)
            temp.push(data[i]);
          
        data = temp;   
      }
      fs.writeFileSync('../../newarrivalspage/newarrivals.json', JSON.stringify(data));
      console.log('New arrival' + newData + " was written successfully!");
        
    } catch (err) {
      console.log(err);
      return null;
    }
}

function getNewArrivals() {
    try {
        const data = fs.readFileSync('../../newarrivalspage/newarrivals.json', 'utf-8');
        return data;
    } catch (err) {
        console.log(err);
        return null;
    }
}

app.get('/getNewArrivals', function(req, res) {
    console.log('New arrivals list requested!');
    var newArrivals = getNewArrivals();
    if (!newArrivals) res.send('ERR');
    else res.send(newArrivals);
    
    res.end("");
});


app.post('/createAd', function (req, res) {
    step1(req.body.UploaderID);
    var metadata = req.body;
    
    step2();
    
    //step 3:
    upload(req,res,function(err) {  
        if(err) {  
            return res.end("Error uploading file: " + err);  
        }
        //step 4:
        fs.rename('../../data/publishedAds/' + fileName, filePath + fileName, (err) => {
            if (err)
                return res.end("Renaming error: " + err);
            else {
                //step 5:
                metadata = processMetadata(metadata);
                fs.writeFile(filePath + "meta.txt", JSON.stringify(metadata), function(err) {
                   if (err)
                       return res.end("Error: Could not write metadata to the file! Desc:\n" + err);
                    else {
                        updateNewArrivals(metadata);
                        return res.end("SUCCESS");
                    }
                });
            }
        });
    
    });
});  

var port = process.env.PORT || 2000;
app.listen(port,function(){  
    console.log("New arrivals server is running on port " + port);  
});