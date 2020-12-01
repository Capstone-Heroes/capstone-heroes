const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const { getUser } = require('../db/neo4j/user');
const { createSession } = require('../db/neo4j/session');
const A_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;
import asyncHandler from 'express-async-handler';

// GET /api/auth/whoami
authRouter.get('/whoami', (req, res, next) => {
  if (req.user) {
    res.send(req.user.username);
  } else {
    res.sendStatus(401);
  }
});

// POST /api/auth/signin
authRouter.post(
  '/signin',
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (typeof username !== 'string' || typeof password !== 'string') {
      res.status(400).send({
        message: 'Please enter a valid username and password.',
      });
    } else {
      try {
        const foundUser = await getUser(username);

        if (foundUser) {
          //if a user is found, check PW
          const comparisonResult = await bcrypt.compare(
            password,
            foundUser.password
          );
          if (!comparisonResult) {
            //if passwords don't match, send that error
            // res
            //   .status(401)
            //   .send({ pwError: 'Incorrect password.', unError: null });
            res.status(401).send({ message: 'Invalid username or password' });
          } else {
            // clear password
            foundUser.password = '';
            // create a new session for the user
            const createdSession = await createSession(username);
            res.cookie('sessionId', createdSession.sessionId, {
              maxAge: A_WEEK_IN_SECONDS,
              path: '/',
            });
            res.status(201).send(foundUser);
          }
        } else {
          //if a user isn't found, send such an error
          res.status(404).send({ unError: 'User not found.' });
        }
      } catch (e) {
        console.error(e.message);
        res.status(500).send({
          message: e.message,
        });
      }
    }
  })
);

module.exports = authRouter;
