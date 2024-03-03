/*** Importing modules ***/
const express = require('express');
const morgan = require('morgan');   // logging middleware
const cors = require('cors');


const itemDao = require('./dao-items');   // module for accessing the items table in the DB
const userDao = require('./dao-users');  // module for accessing the users table in the DB
const gameDao= require('./dao-games');  // module for accessing the games table in the DB


/*** init express and set-up the middlewares ***/
const app = express();
app.use(morgan('dev'));
app.use(express.json());


/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));


/*** Passport ***/

/** Authentication-related imports **/
const passport = require('passport');                              // authentication middleware
const LocalStrategy = require('passport-local');                   // authentication strategy (username and password)

/** Set up authentication strategy to search in the DB a user with a matching password.
 * The user object will contain other information extracted by the method userDao.getUser (i.e., id, username, name).
 **/
passport.use(new LocalStrategy(async function verify(username, password, callback) {
  const user = await userDao.getUser(username, password)
  if(!user)
    return callback(null, false, 'Incorrect username or password');  
    
  return callback(null, user); // NOTE: user info in the session (all fields returned by userDao.getUser, i.e, id, username, name)
}));

// Serializing in the session the user object given from LocalStrategy(verify).
passport.serializeUser(function (user, callback) { // this user is id + username + name 
  callback(null, user);
});

// Starting from the data in the session, we extract the current (logged-in) user.
passport.deserializeUser(function (user, callback) { // this user is id + email + name 
  return callback(null, user); // this will be available in req.user
});

/** Creating the session */
const session = require('express-session');

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));


/** Defining authentication verification middleware **/
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}


/*** Users APIs ***/

// POST /api/sessions 
// This route is used for performing login.
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => { 
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json({ error: info});
      }
      // success, perform the login and extablish a login session
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        // this is coming from userDao.getUser() in LocalStratecy Verify Fn
        return res.json(req.user);
      });
  })(req, res, next);
});

// GET /api/sessions/current
// This route checks whether the user is logged in or not.
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

// DELETE /api/session/current
// This route is used for loggin out the current user.
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.status(200).json({});
  });
});


/*** Items APIs ***/

// GET /api/easy
// Retrieves a list of items categorized as "easy" (12 items)
app.get('/api/easy', (req, res) => {
  itemDao.getEasyItems()
    .then(items => res.json(items))
    .catch((err) => res.status(500).json(err));
});


// GET /api/medium
// Retrieves a list of items categorized as "medium" (24 items)
app.get('/api/medium', (req, res) => {
  itemDao.getMediumItems()
    .then(items => res.json(items))
    .catch((err) => res.status(500).json(err));
});


// GET /api/hard
// Retrieves a list of items categorized as "hard"  (36 items)
app.get('/api/hard', (req, res) => {
  itemDao.getHardItems()
    .then(items => res.json(items))
    .catch((err) => res.status(500).json(err));
});


// POST /api/start-easy
// Starts a new game categorized as "easy". It randomly selects a secret item among 12 items, creates a new game in the database.
app.post('/api/start-easy', async (req, res) => {
  try {
   const secretItemId = Math.floor(Math.random() * 12) + 1; 
   const game = await gameDao.addGame(secretItemId);   // Insert the game information into the database
   res.json({ message: 'Game started successfully', gameId: game.id });
  } catch (err) {
   res.status(503).json({ error: `Failed to start the game: ${err.message}` });
  }
  });

 
// POST /api/start-medium
// Starts a new game categorized as "medium". It randomly selects a secret item among 24 items, creates a new game in the database.
app.post('/api/start-medium', async (req, res) => {  
  try {
    const secretItemId = Math.floor(Math.random() * 24) + 1;    
    const game = await gameDao.addGame(secretItemId);  // Insert the game information into the database 
    res.json({ message: 'Game started successfully', gameId: game.id });
  } catch (err) {
    res.status(503).json({ error: `Failed to start the game: ${err.message}` });
  }
  });

  
// POST /api/start-hard
// Starts a new game categorized as "hard". It randomly selects a secret item among 36 items, creates a new game in the database.
app.post('/api/start-hard', async (req, res) => {
  try {
    const secretItemId = Math.floor(Math.random() * 36) + 1;
    const game = await gameDao.addGame(secretItemId);
    res.json({ message: 'Game started successfully', gameId: game.id });
  } catch (err) {
    res.status(503).json({ error: `Failed to start the game: ${err.message}` });
  }
  });
 

// POST /api/guess
// Evaluates a player's guess in the context of an ongoing game by comparing the selected value with the secret item's value for that property. 
// It returns a response indicating that the guess was correct or incorrect, without returning any information about the secret item.
app.post('/api/guess', async (req, res) => {
  const { gameId, selectedProperty, selectedValue } = req.body;
  try {
    // Fetch the game from the database based on the gameId
    const game = await gameDao.getGameById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    } 
    // Fetch the secret item from the database
    const secretItem = await itemDao.getItemById(game.secret_id); 
    if (!secretItem) {
      return res.status(404).json({ message: 'Secret item not found' });
    }  
    const parsedProperties = JSON.parse(secretItem.properties); 
    // Access the value of the selected property in the parsed properties
    const selectedPropertyValue = parsedProperties[selectedProperty]; 
    if (selectedPropertyValue === selectedValue) {
      res.json({ isCorrect: true, message: 'Congratulations! Your guess is correct.' });
    } else {
      res.json({ isCorrect: false, message: 'Oops! Your guess is incorrect.' });
    }
  } catch (err) {
    res.status(500).json({ error: `An error occurred: ${err.message}` });
  }
});


// POST /api/match
// Checks if the item selected by the user matches the secret item for the given ongoing game 
// Since this action terminate the game, it responds with the secretItemId of the game, allowing the client to verify if the user's selection is correct.
app.post('/api/match', async (req, res) => {
  const { gameId } = req.body; 
  try {
    // Fetch the game from the database based on the gameId
    const game = await gameDao.getGameById(gameId);  
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }      
    const secretItemId = game.secret_id
    res.json({ secretItemId: secretItemId });  
  } catch (err) {
    res.status(500).json({ error: `An error occurred: ${err.message}` });
  }
});
  

// PUT /api/complete
// Updates the game's information in the database, including the start date, difficulty, and score for logged in user termination of the game.
// It also updates the user's total score in the database.
app.put('/api/complete', isLoggedIn, async (req, res) => {  
  const game = {
    gameId: req.body.gameId,
    userId: req.user.id,
    startDate: req.body.startDate,
    difficulty: req.body.difficulty,
    score: req.body.score,
  };
  try {
    const updatedGame = await gameDao.updateGame(game.gameId, game.userId, game.startDate, game.difficulty, game.score);
    const updatedTotalScore = await userDao.updateTotalScore(game.userId, game.score); 
    if (!updatedGame || !updatedTotalScore) {
       res.status(404).json({ error: 'Game or total score not updated.' });
    } else {
      res.json({ updatedGame, updatedTotalScore });
    }
  } catch (err) {
    res.status(503).json({ error: `Database error during the update: ${err}` });
  }
});


// GET /api/history
// Retrieves the match history for a logged-in user.
app.get('/api/history', isLoggedIn, (req, res) => {
  gameDao.getHistory(req.user.id)
    .then(games => res.json(games))
    .catch((err) => res.status(500).json(err)); 
});


// GET /api/items/:id
// Retrieves detailed information about a specific item by its ID. 
app.get('/api/items/:id', isLoggedIn, async (req, res) => {
  try {
    const result = await itemDao.getItemById(req.params.id);
    if (result.error)
      res.status(404).json(result);
    else
      res.json(result);
  } catch (err) {
    res.status(500).end();
  }
});


// GET /api/users/:id
// Retrieves detailed information about a specific user by their ID. 
app.get('/api/users/:id', isLoggedIn, async (req, res) => {
  try {
    const result = await userDao.getUserById(req.params.id); 
    if (result.error)
      res.status(404).json(result);
    else
      res.json(result);
  } catch (err) {
    res.status(500).end();
  }
});


// DELETE /api/incomplete
// Cleans up incomplete or anonymous user data.
app.delete('/api/incomplete', async (req, res) => {
  try {
    const result = await gameDao.deleteGames();
    if (result == null)
      return res.status(200).json({}); 
    else
      return res.status(404).json(result);
  } catch (err) {
    res.status(503).json({ error: `Database error during the deletion of film ` });
  }
});


// Activating the server
const PORT = 3001;
app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));

