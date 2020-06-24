var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;

// author model
var AuthorSchema = new Schema({

    first_name:{
        type:String,
        required:true, 
        max:100
    },
    family_name:{
        type:String, 
        required:true, 
        max:100
    },
    date_of_birth:{
        type:Date
    },
    date_of_death:{
        type:Date
    }
});

/* virtuals for author's full name. virtuals are document properties you can get and set but don't get persisted to mongoDB. The getters are useful for combining fields while setters are useful for de-composing a single value into multiple values for storage*/
AuthorSchema.virtual('name').get(function () {
    /* to avoid errors in cases where an author doesn't have a first or family name. we want to make sure we handle the exception by returning an empty string for that case */

    var fullname = '';

    if (this.first_name && this.family_name) {
        fullname = this.family_name + ', ' + this.first_name
    }
    if (!this.first_name || !this.family_name) {
        fullname = ''
    }

    return fullname;

});

// virtual for lifespan
// AuthorSchema
// .virtual('lifespan')
// .get(function () {
//     return (this.date_of_death.getYear() - this.date_of_birth.getYear()).toString();
// });

// AuthorSchema
// .virtual('lifespan_dob')
// .get(function () {
//     return this.date_of_birth ? moment(this.date_of_birth).format('Do MMMM, YYYY') : '';
// });

// AuthorSchema
// .virtual('lifespan_dod')
// .get(function () {
//     return this.date_of_death ? moment(this.date_of_death).format('Do MMMM, YYYY') : '';
// });

AuthorSchema
.virtual('lifespan')
.get(function () {

    var shelflife = '';

    if (this.date_of_birth && this.date_of_death) {
        shelflife = moment(this.date_of_birth).format('Do MMMM, YYYY') + ' - ' + moment(this.date_of_death)
        .format('Do MMMM, YYYY');
    }

    if (this.date_of_birth && this.date_of_death==null) {
        shelflife = moment(this.date_of_birth).format('Do MMMM, YYYY') + ' - unknown';
    }

    if (this.date_of_birth==null && this.date_of_death==null) {
        shelflife = 'Lifespan unknown';    
    }

    return shelflife;
});

// virtual for author's url
AuthorSchema.virtual('url').get(function () {
    return '/catalog/author/' + this._id;
});



// export model from schema
module.exports = mongoose.model('Author', AuthorSchema);

















