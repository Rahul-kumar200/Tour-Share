const {MongoClient} =  require('mongodb')

let dbConnection;

module.exports = {
    connectToDb : (cb)=>{
        MongoClient.connect('mongodb+srv://rahulkr15aug:vmerVaXcjkKaD324@cluster0.9bnbula.mongodb.net/Sharetour')
        .then((client)=>{
            dbConnection = client.db();
            return cb()
        })
        .catch(err=>{
            console.log(err)
            return cb(err)
        })
    } ,

    getDb : ()=> dbConnection
}


