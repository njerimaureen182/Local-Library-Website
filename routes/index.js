var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Hey Team Express! My name is Maureen. Pleased to meet you!'});
// });

// GET catalog home page
router.get('/', (req, res) =>{
	res.redirect('/catalog');
});

module.exports = router;
