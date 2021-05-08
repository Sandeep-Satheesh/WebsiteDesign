var express = require("express"); 
var cors = require('cors');

const {MongoClient} = require('mongodb');

var app = express();
app.use(express.json());
app.use(cors());

app.post('/authUser', function(req, res) {
    console.log('User attempting login with credentials: ' + req.body.uIDhash + ", " + req.body.pwdHash);
    authUser(req.body.uIDhash, req.body.pwdHash, res).catch(console.error);
});

app.post('/regUser', function(req, res) {
   console.log('Registering user with credentials: ' + req.body.uIDhash + ', ' + req.body.pwdHash);
   regUser(req.body, res).catch(console.error);
});

const uri = "mongodb+srv://admin:admin@cluster0.ts4h7.mongodb.net/users?retryWrites=true&w=majority";

async function regUser(userCredentials, clientRes) {
    var rec = {};
    rec[userCredentials.uIDhash] = userCredentials;
    var uIDhash = rec[userCredentials.uIDhash]['uIDhash'];
    
    delete rec[userCredentials.uIDhash]['uIDhash'];
    console.log(rec);
    
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connecting to cloud users DB...");
    try {
        await client.connect(function(err, cl) {
            
            if (err) throw(err);
            try {
                var query = {};
                query[uIDhash] = {'$exists' : true};
                const userDetails = cl.db("users").collection("userDetails");
                userDetails.findOne(query, function (err, res) {
                        console.log(query);
                        if (err) throw err;
                        else {
                            console.log("FOUND:");
                            console.log(res);
                            if (res != null) {
                                console.log('User already exists!!!');
                                clientRes.end("USRALRDYREG");
                            }
                            else {
                                userDetails.insertOne(rec);
                                clientRes.end("OK");
                            }
                        }
                        cl.close();
                    });

            } catch (err) {
                console.log(err);
                clientRes.end('ERR');
                cl.close();
            }
        });
    } catch (e) {
        console.error(e);
    }
}
async function authUser(uIDhash, pwdHash, clientRes) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connecting to cloud users DB...");
            try {
                await client.connect(function(err, cl) {
                    if (err) throw(err);
                    var query = {};
                    query[uIDhash] = {'$exists' : true};
                    try {
                        cl.db("users")
                            .collection("userDetails")
                            .findOne(query, function (err, res) {
                                console.log(query);
                                if (err) throw err;
                                else {
                                    var respData = {};
                                    
                                    console.log("FOUND:");
                                    console.log(res);
                                    if (res != null && res[uIDhash]['pwdHash'] === pwdHash) {
                                        delete res[uIDhash]['pwdHash'];
                                        respData = JSON.parse(JSON.stringify(res[uIDhash]));
                                        console.log('User authenticated!!!');
                                        respData['response'] = 'OK';
                                    }
                                    else {
                                        respData = {};
                                        respData['response'] = 'BADAUTH';
                                        console.log('Bad auth!');
                                    }
                                    clientRes.end(JSON.stringify(respData));
                                }
                                cl.close();
                            });
                        
                    } catch (err) {
                        console.log(err);
                        clientRes.end(JSON.stringify({response : 'ERR'}));
                        cl.close();
                    }
                });
            } catch (e) {
                console.error(e);
                clientRes.end(JSON.stringify({response : 'ERR'}));
            } 
}


var port = process.env.PORT || 2002;
app.listen(port,function(){  
    console.log("Login auth server is running on port " + port);  
});