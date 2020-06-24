var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');
const validator = require('express-validator');

// display a list of all genres
exports.genre_list = function (req, res, next) {
    Genre.find()
    .populate('genre')
    .sort([['name', 'ascending']])
    .exec(function (err, list_genres) {
        if (err) { return next(err); }
        res.render('genre_list', {title: 'Genre List', genre_list: list_genres});
    });
};

// display details of a specific genre
exports.genre_detail = function (req, res, next) {
    async.parallel({
        genre: function (callback) {
            Genre.findById(req.params.id)
            .exec(callback);
        },
        genre_books: function (callback) {
            Book.find({'genre' : req.params.id})
            .exec(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.genre == null) {
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        res.render('genre_detail', {title:'Genre Details', genre: results.genre, genre_books: results.genre_books});
    });
};

// display genre create form on GET
exports.genre_create_get = function (req, res, next) {
    res.render('genre_form', {title: 'Create Genre'});
};

// handle genre create on POST
exports.genre_create_post = [
    // validate that the name field is not empty
    validator.body('name', 'Genre name is required').trim().isLength({min: 1}),

    // sanitize(escape) the name field
    validator.sanitizeBody('name').escape(),

    // process request after validation and sanitization
    (req, res, next) =>{
        
        //extract the validation errors from a request
        const errors = validator.validationResult(req);
        
        // create a genre object with escaped and trimmed data
        var genre = new Genre(
            {name: req.body.name}
        );
        
        if (!errors.isEmpty()) {
            
            // there are errors. render the form again with sanitized values/error messages
            res.render('genre_form', {title: 'Create Genre', genre: genre, errors: errors.array()});
            return;
        }

        else{
            // data from form is valid
            // check if genre with the same name already exists
            Genre.findOne({'name': req.body.name})
            .exec(function (err, found_genre) {
                if (err) { return next(err); }

                if (found_genre) {
                    // genre exists, redirect to its detail page
                    res.redirect(found_genre.url);
                }

                else{
                    genre.save(function (err) {
                        if (err) { next(err); }

                        // genre saved. return to genre_detail page
                        res.redirect(genre.url);
                    });
                }
            });
        }
    } 
];

// display genre delete form on GET
exports.genre_delete_get = (req, res) =>{
    res.send('NOT IMPLEMENTED: Genre delete GET');
};

// handle genre delete on POST
exports.genre_delete_post = (req, res) =>{
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

// display genre update form on GET
exports.genre_update_get = (req, res) =>{
    res.send('NOT IMPLEMENTED: Genre update GET');
};

// handle genre update on POST
exports.genre_update_post = (req, res) =>{
    res.send('NOT IMPLEMENTED: Genre update POST');
};