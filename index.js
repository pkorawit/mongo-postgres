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
    dbo.collection("instagrams").find(query).forEach(function (doc) {

        const shortcode = doc.shortcode;
        const full_name = (doc.media.owner.full_name) ? doc.media.owner.full_name : '';
        const username = (doc.media.owner.username) ? doc.media.owner.username : '';
        const location_id = (doc.media.location) ? doc.media.location.id : null;
        const location_name = (doc.media.location) ? doc.media.location.name : '';
        const like_count = (doc.media.edge_media_preview_like.count) ? doc.media.edge_media_preview_like.count : 0;
        const taken_at_timestamp = doc.media.taken_at_timestamp;
        let caption_text = '';
        if(doc.media.edge_media_to_caption){
            if(doc.media.edge_media_to_caption.edges){
                if(doc.media.edge_media_to_caption.edges.length > 0){
                    caption_text = doc.media.edge_media_to_caption.edges[0].node.text
                };
            };
        }
        //insert to db
        var query = `INSERT INTO post (
            shortcode,
            full_name,
            username,
            location_id,
            location_name,
            like_count,
            taken_at_timestamp,
            caption_text
            ) 
            VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8
            )
            `;
        const params = [
            shortcode,
            full_name,
            username,
            location_id,
            location_name,
            like_count,
            taken_at_timestamp,
            caption_text
        ]; 

        pool.query(query, params, (error, result) => {
            if (error) {
                console.log(++i + " " + doc.shortcode + " ERROR " + error);                
            }
            else{
                console.log(++i + " " + doc.shortcode + " inserted");
            }
            doc = null;
        })

    }, function (err) {
        console.log(err);
    });

});