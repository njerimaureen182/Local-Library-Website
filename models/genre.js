var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var GenreSchema = new Schema({

    name:{
        type:String,
        required:true,
        // enum:['Science Fiction', 'French Poetry', 'Military History', 'Romance', 'Fantasy'],
        min:3,
        max:100
    }
});

// virtual for genre's url
GenreSchema.virtual('url').get(function () {
    return '/catalog/genre/' + this._id;
});

// export model
module.exports = mongoose.model('Genre', GenreSchema);