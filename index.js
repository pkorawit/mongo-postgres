var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://mean.psu.ac.th:27017/";

const Pool = require('pg').Pool
const pool = new Pool({
    user: 'ptei',
    host: 'mean.psu.ac.th',
    database: 'ptei',
    password: 'zxc123**',
    port: 5432,
})

MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("ptie");
    var query = { "media.taken_at_timestamp": { "$gte": 1543597201, $lt: 1553965201 } };
    var i = 0;
    dbo.collection("instagrams").find(query).limit(1000).forEach(function (doc) {
        //insert to db
        var query = `INSERT INTO post (
            shortcode,
            full_name,
            username,
            profile_pic_url,
            location_id,
            location_name,
            like_count,
            taken_at_timestamp,
            caption_text
            ) 
            VALUES (
                '${doc.shortcode}',
                '${doc.media.owner.full_name}',
                '${doc.media.owner.username}',
                '${doc.media.owner.profile_pic_url}',
                ${(doc.media.location) ? doc.media.location.id : null},
                '${(doc.media.location) ? doc.media.location.name : ''}',
                ${doc.media.edge_media_preview_like.count},
                ${doc.media.taken_at_timestamp},
                '${(doc.media.edge_media_to_caption.edges.node) ? doc.media.edge_media_to_caption.edges[0].node.text : ''}'
            )
            `;
        // pool.query(query, (error, result) => {
        //     if (error) {
        //         console.log(++i + " " + doc.shortcode + " ERROR");
        //     }
        //     else{
        //         console.log(++i + " " + doc.shortcode + " inserted");
        //     }
            
        // })

        console.log(++i + " " + (doc.media.edge_media_to_caption.edges) ? doc.media.edge_media_to_caption.edges[0].node.text : '');

    }, function (err) {
        console.log(err);
    });

});