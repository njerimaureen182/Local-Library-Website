var Author = require('../models/author');
var Book = require('../models/book');
var async = require('async');
const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');
// display a list of all authors
exports.author_list = function (req, res, next) {
    Author.find()
    .populate('author')
    .sort([['family_name', 'ascending']])
    .exec(function (err, list_authors) {
        if (err) { return next(err); }
        res.render('author_list', {title: 'Author List', author_list: list_authors});
    });
};

// display details of a specific author
exports.author_detail = function (req, res, next) {
    async.parallel({
        author: function (callback) {
            Author.findById(req.params.id)
            .exec(callback)
        },
        author_books: function (callback) {
            Book.find({'author': req.params.id}, 'title summary')
            .exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.author==null) {
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }

        res.render('author_detail', {title: 'Author Details', author: results.author, 
        author_books: results.author_books});
    });
};

// display author create form on GET
exports.author_create_get = function(req, res, next) {
    res.render('author_form', {title: 'Create Author'});
};

// handle author create on POST
exports.author_create_post = [
    // validate fields
    body('first_name').isLength({min:1}).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').isLength({min:1}).trim().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({checkFalsy: true}).isISO8601(),
    body('date_of_death', 'Invalid date of death').optional({checkFalsy: true}).isISO8601(),

    // sanitize fields
    sanitizeBody('first_name').escape(),
    sanitizeBody('family_name').escape(),
    sanitizeBody('date_of_birth').toDate(),
    sanitizeBody('date_of_death').toDate(),

    // process request after validation and sanitization
    (req, res, next) =>{
        // Extract the validation errors from a request
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // there are errors. render form again with sanitized values/error messages
            res.render('author_form', {title: 'Create Author', author: req.body, errors: errors.array()});
            return;
        }

        else{
            // data from form is valid
            // create an author object with escaped and trimmed data
            var author = new Author(
                {
                    first_name: req.body.first_name,
                    family_name: req.body.family_name,
                    date_of_birth: req.body.date_of_birth,
                    date_of_death: req.body.date_of_death
                }
            );

            author.save(function (err) {
                if (err) { return next(err); }

                // successful - redirect to new author record
                res.redirect(author.url);
            });
        }
    }
];
    

// display author delete form on GET
exports.author_delete_get = (req, res, next) =>{
    async.parallel({
        author: function(callback){
            Author.findById(req.params.id).exec(callback)
        },

        authors_books: function (callback) {
            Book.find({'author': req.params.id}).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.author==null) {
            
            // no results
            res.redirect('/catalog/authors'); 
        }

        // successful so render
        res.render('author_delete', {title: 'Delete Author', author: results.author, author_books: 
        results.authors_books});
    });
};

// handle author delete on POST
exports.author_delete_post = (req, res, next) =>{

    async.parallel({
        author: function (callback) {

            Author.findById(req.body.authorid).exec(callback)
            
        },

        authors_books: function (callback) {
            Book.find({'author': req.body.authorid}).exec(callback)
        },

    }, function (err, results) {
        if (err) { return next(err); }

        // success
        if (results.authors_books.length > 0) {

            // author has books. render in the same way as for GET route
            res.render('author_delete', {title: 'Delete Author', author: results.author, author_books: results.authors_books});

            return;
        }

        else{
            // author has no books. delete object and redirect to the list of authors
            Author.findByIdAndRemove(req.body.authorid, 
                
                function deleteAuthor(err) {
                    if (err) { return next(err); }

                    // success - go to author list
                    res.redirect('/catalog/authors');   
            });
        }
    });
};

// display author update form on GET
exports.author_update_get = (req, res) =>{
    res.send('NOT IMPLEMENTED: Author update GET');
};

// handle author update on POST
exports.author_update_post = (req, res) =>{
    res.send('NOT IMPLEMENTED: Author update POST');
};