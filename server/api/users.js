const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { createUser, createSession, getUser } = require('../db/neo4j/user');

const A_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

// POST /api/users
// Creates new user in db
router.post('/', async (req, res) => {
  const { username, password } = req.body;
  const hashedPW = await bcrypt.hash(password, 10);

  try {
    const newUser = await createUser(username, hashedPW);
    if (newUser) {
      const newSession = await createSession(username);
      res.cookie('sessionId', newSession.sessionId, {
        maxAge: A_WEEK_IN_SECONDS,
        path: '/',
      });

      //another password emptier:
      newUser.password = ''

      res.status(201).send(newUser);
    } else {
      res.sendStatus(400);
    }
  } catch (e) {
    //this checks the type of error coming from sequelize
    // ARE THERE SIMILAR ERRORS THAT COME FROM CYPHER?
    if(e.errors[0].type === 'unique violation') {
      res.status(400).send({
        emError: 'This email is already taken.'
      })
    } else {
      res.status(500).send({
        emError: null,
        pwError: 'Something went horribly wrong.'
      })
    }
  }
})

// POST /api/users/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body

  if (typeof username !== 'string' || typeof password !== 'string') {
    res.status(400).send({
      message: 'Email and password must both be strings.',
    });
  } else {
    try {
      const foundUser = await getUser(username);

      if (foundUser) {
        //if a user is found, check PW
        const comparisonResult = await bcrypt.compare(password, foundUser.password);
        if (!comparisonResult) {
          //if passwords don't match, send that error
          res.status(401).send({pwError: 'Incorrect password.', emError: null});
        } else {
          // create a new session for the user

          //another password emptier:
          foundUser.password = '';

          const createdSession = await createSession(username);

          res.cookie('sessionId', createdSession.sessionId, {
            maxAge: A_WEEK_IN_SECONDS,
            path: '/',
          });
          res.status(201).send(foundUser);
        }
      } else {
        //if a user isn't found, send such an error
        res.status(404).send({emError: 'User not found.'})
      }
    } catch (e) {
      console.error(e.message)
      res.status(500).send({
        message: e.message,
      })
    }
  }
})

module.exports = router;