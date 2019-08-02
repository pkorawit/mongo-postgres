var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://mean.psu.ac.th:27017/";

MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("ptie");
    var query = { "media.taken_at_timestamp": { "$gte": 1543597201, $lt: 1553965201 } };
    var i = 0;
    dbo.collection("instagrams").find(query).limit(100000).forEach(function (doc) {
        // handle
        console.log(++i + " " + doc.shortcode);      
        if(i>100000) db.close();
    }, function (err) {
        console.log(err);
    });
    
});