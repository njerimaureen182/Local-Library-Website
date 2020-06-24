var express = require('express');
var router = express.Router();

// require controller modules
var author_controller = require('../controllers/authorController');
var book_controller = require('../controllers/bookController');
var book_instance_controller = require('../controllers/bookinstanceController');
var genre_controller = require('../controllers/genreController');

/// BOOK ROUTES ///

// GET catalog homepage
router.get('/', book_controller.index);

// GET request for creating a book
router.get('/book/create', book_controller.book_create_get);

// POST request for creating a book
router.post('/book/create', book_controller.book_create_post);

// GET request for deleting a book
router.get('/book/:id/delete', book_controller.book_delete_get);

// POST request for deleting a book
router.post('/book/:id/delete', book_controller.book_delete_post);

// GET request for updating a book
router.get('/book/:id/update', book_controller.book_update_get);

// POST request for updating a book
router.post('/book/:id/update', book_controller.book_update_post);

// GET request for one book
router.get('/book/:id', book_controller.book_detail);

// GET request for a list of all books
router.get('/books', book_controller.book_list);


/// AUTHOR ROUTES ///


// GET request for creating author
router.get('/author/create', author_controller.author_create_get);

// POST request for creating author
router.post('/author/create', author_controller.author_create_post);

// GET request to delete author
router.get('/author/:id/delete', author_controller.author_delete_get);

// POST request to delete author
router.post('/author/:id/delete', author_controller.author_delete_post);

// GET request to update author
router.get('/author/:id/update', author_controller.author_update_get);

// POST request to update author
router.post('/author/:id/update',author_controller.author_update_post);

// GET request for one author
router.get('/author/:id', author_controller.author_detail);

// GET request for a list of all authors
router.get('/authors', author_controller.author_list);


/// GENRE ROUTES ///

// GET request to create genre
router.get('/genre/create', genre_controller.genre_create_get);

// POST request to create genre
router.post('/genre/create', genre_controller.genre_create_post);

// GET request to delete genre
router.get('/genre/:id/delete', genre_controller.genre_delete_get);

// POST request to delete genre
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

// GET request to update genre
router.get('/genre/:id/update', genre_controller.genre_update_get);

// POST request to update genre
router.post('/genre/:id/update', genre_controller.genre_update_post);

// GET request for one genre
router.get('/genre/:id', genre_controller.genre_detail);

// GET request for list of all genre
router.get('/genres', genre_controller.genre_list);


/// BOOKINSTANCE ROUTES ///

// GET request to create book instance
router.get('/bookinstance/create', book_instance_controller.bookinstance_create_get);

// POST request to create book instance
router.post('/bookinstance/create', book_instance_controller.bookinstance_create_post);

// GET request to delete book instance
router.get('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_get);

// POST request to delete book instance
router.post('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_post);

// GET request to update book instance
router.get('/bookinstance/:id/update', book_instance_controller.bookinstance_update_get);

// POST request to update book instance
router.post('/bookinstance/:id/update', book_instance_controller.bookinstance_update_post);

// GET request for one book instance
router.get('/bookinstance/:id', book_instance_controller.bookinstance_detail);

// GET request for a list of all book instances
router.get('/bookinstances', book_instance_controller.bookinstance_list); 

// export router module
module.exports = router;

