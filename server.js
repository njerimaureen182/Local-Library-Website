const express = require('express')
const {check, validationResult} = require('express-validator');
const app = express();
// const port = 2020;

app.use(express.json());

// app.post('/user', (req, res) =>{
//     User.create({
//         username: req.body.username,
//         password: req.body.password
//     }).then(user => res.json(user));

// });

app.post('/user', [
    // username must be an email
    check('username').isEmail(),
    // password must be at least 5 chars long
    check('password').isLength({ min: 5 })
  ], (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  
    User.create({
      username: req.body.username,
      password: req.body.password
    }).then(user => res.json(user));
  });

// app.listen(port, () =>{
//     console.log(`app is listening on port ${port}!`);
// });