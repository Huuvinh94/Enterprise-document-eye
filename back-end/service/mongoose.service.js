const mongoose = require('mongoose');
let count = 0;

const options = {
    autoIndex: false, // Don't build indexes
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    useUnifiedTopology: true,
    useNewUrlParser: true
};

let connectWithRetry;
(connectWithRetry = () => {
    console.log('MongoDB connection with retry')
    mongoose.connect("mongodb://192.168.1.49:27017/meanDB", options).then((res, err) => {
        if (res) {
            console.log('MongoDB is connected')
        } else {
            throw new Error(err);
        }
    }).catch(err => {
        console.log('MongoDB connection unsuccessful, retry after 5 seconds. ', ++count);
        setTimeout(connectWithRetry, 5000)
    })
})();

exports.mongoose = mongoose;