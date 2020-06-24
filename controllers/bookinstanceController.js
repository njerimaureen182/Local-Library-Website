var BookInstance = require('../models/bookinstance');

const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

// require the book module
var Book = require('../models/book');

exports.bookinstance_list = function(req, res, next) {

    BookInstance.find()
      .populate('book')
      .exec(function (err, list_bookinstances) {
        if (err) { return next(err); }
        // Successful, so render
        res.render('bookinstance_list', { title: 'Book Instance List', bookinstance_list: list_bookinstances });
      });
      
  };

// display details of a specific book instance
exports.bookinstance_detail = function (req, res, next){
    BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function (err, bookinstance) {
        if (err) { return next(err); }
        if (bookinstance==null) {
            var err = new Error('Book copy not found');
        }

        res.render('bookinstance_detail', {title: 'Copy: ' + bookinstance.book.title, bookinstance: bookinstance});
    });
};

// display book instance create form on GET
exports.bookinstance_create_get = function (req, res, next) {
    Book.find({}, 'title')
    .exec(function (err, books) {
        if (err) { return next(err); }

        // successful so render
        res.render('bookinstance_form', {title: 'Create Bookinstance', book_list: books});
    }); 
};

// handle book instance create on POST
exports.bookinstance_create_post = [
    
    // validate fields
    body('book', 'Book must be specified.').trim().isLength({min:1}),
    body('imprint', 'Imprint must be specified.').trim().isLength({min:1}),
    body('due_back', 'Invalid date.').optional({checkFalsy:true}).isISO8601(),

    // sanitize fields
    sanitizeBody('book').escape(),
    sanitizeBody('imprint').escape(),
    sanitizeBody('status').trim().escape(),
    sanitizeBody('due_back').toDate(),

    // process request after validation and sanitization
    (req, res, next) =>{

        // extract validation errors from a request
        const errors = validationResult(req);

        // create a bookinstance object with escaped and trimmed data
        var bookinstance = new BookInstance({

            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back
        });

        if (!errors.isEmpty()) {
            
            // There are errors. Render form again with sanitized values and error messages
            Book.find({}, 'title')
            .exec(function (err, books) {
                if (err) { return next(err); }
                res.render('bookinstance_form', {title: 'Create BookInstance', book_list: books, selected_book: bookinstance.book._id, errors: errors.array(), bookinstance: bookinstance});
            });

            return;
        }

        else{
            
            // Data from form is valid
            bookinstance.save(function (err) {
                if (err) { return next(err); }

                // successful so redirect to new record
                res.redirect(bookinstance.url);
            }); 
        }
    }
];

// display book instance delete form on GET
exports.bookinstance_delete_get = (req, res) =>{
    res.send('NOT IMPLEMENTED: Book Instance delete GET');
};

// handle book instance delete on POST
exports.bookinstance_delete_post = (req, res) =>{
    res.send('NOT IMPLEMENTED: Book Instance delete POST');
};

// display book instance update form on GET
exports.bookinstance_update_get = (req, res) =>{
    res.send('NOT IMPLEMENTED: Book Instance update GET');
};

// handle book instance update on POST
exports.bookinstance_update_post = (req, res) =>{
    res.send('NOT IMPLEMENTED: Book Instance update POST');
};