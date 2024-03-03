
import dayjs from 'dayjs';

const SERVER_URL = 'http://localhost:3001/api/';


 /**  A utility function for parsing the HTTP response  **/
 
function getJson(httpResponsePromise) {
  // server API always return JSON, in case of error the format is the following { error: <message> } 
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {
         // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
         response.json()
            .then( json => resolve(json) )
            .catch( err => reject({ error: "Cannot parse server response" }))
        } else {
          // analyzing the cause of error
          response.json()
            .then(obj => 
              reject(obj)
              ) // error msg in the response body
            .catch(err => reject({ error: "Cannot parse server response" })) // something else
        }
      })
      .catch(err => 
        reject({ error: "Cannot communicate"  })
      ) // connection error
  });
}

// Fetches a list of items categorized as "easy" from a server 
// and returns a Promise that resolves to an array of objects, each containing id, image_url, and properties.
  const getEasyItems = async () => {
    return fetch(SERVER_URL + 'easy')
      .then(response => response.json())
      .then(json => {
        return json.map(item => {
          const clientItem = {
            id: item.id,
            image_url: item.image_url,
            properties: item.properties,
          }     
          return clientItem;
        });
      });
  };


// Fetches a list of items categorized as "medium" from a server 
// and returns a Promise that resolves to an array of objects, each containing id, image_url, and properties.
  const getMediumItems = async () => {
    return fetch(SERVER_URL + 'medium')
      .then(response => response.json())
      .then(json => {
        return json.map(item => {
          const clientItem = {
            id: item.id,
            image_url: item.image_url,
            properties: item.properties,
          }     
          return clientItem;
        });
      });
  };


// Fetches a list of items categorized as "hard" from a server 
// and returns a Promise that resolves to an array of objects, each containing id, image_url, and properties.
  const getHardItems = async () => {
    return fetch(SERVER_URL + 'hard')
      .then(response => response.json())
      .then(json => {
        return json.map(item => {
          const clientItem = {
            id: item.id,
            image_url: item.image_url,
            properties: item.properties,
          }     
          return clientItem;
        });
      });
  };


//Initiates a new game with an "easy" difficulty level. 
  function startEasyGame() {
    return getJson(
      fetch(SERVER_URL + "start-easy/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      })
    );
  };


//Initiates a new game with an "medium" difficulty level. 
  function startMediumGame() {
    return getJson(
      fetch(SERVER_URL + "start-medium/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      })
    );
  };


//Initiates a new game with an "hard" difficulty level. 
  function startHardGame() {
    return getJson(
      fetch(SERVER_URL + "start-hard/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      })
    );
  };


// Submits a player's guess to the server. 
// This allows the server to evaluate the guess and respond with whether it was correct or not in the context of the ongoing game.
  function checkGuess(gameId, selectedProperty, selectedValue) {
    const requestData = {
      gameId: gameId,
      selectedProperty: selectedProperty,
      selectedValue: selectedValue
    };
    return getJson(
      fetch(`${SERVER_URL}guess/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })
    );
  };


// Enables the player to confirm if their selected item matches the secret item in the ongoing game. 
// It does this by sending a request to the server, which then evaluates the match and responds accordingly.
  function checkMatch (gameId) {
    const requestData = {
      gameId: gameId,
    }; 
    return getJson(
      fetch(`${SERVER_URL}match/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })
    );
  };


// Allows a logged-in user to update and store game-related data in the database. 
// This includes information such as the game's start date, user id, difficulty, and score. The function sends this updated information to the server for processing.
  function updateGame(game) {
    return getJson(
      fetch(SERVER_URL + "complete/", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(game)
      })
    )
  };


// Fetches the match history data from the server, processes it, and returns an array of objects containing information about each match.
  const getHistory = async () => {
    return fetch(SERVER_URL + 'history/', { credentials: 'include' })
      .then(response => response.json())
      .then(json => {
        return json.map(match => {
          const clientMatch = {
            id: match.id,
            startDate: dayjs(match.start_date).format('DD/MM/YYYY'),
            difficulty: match.difficulty,
            secretItemId: match.secret_id,
            score: match.score,
          }     
          return clientMatch;
        });
      });
  };


// Fetches detailed information about an item with a specific id from the server.
  const getItemById = async (id) => {
    return getJson( fetch(SERVER_URL + 'items/' + id, { credentials: 'include' }))
      .then( item => {
        const clientItem = {
          id: item.id,
          image_url: item.image_url,
          properties: item.properties,
        }
        return clientItem;
      } )
  };


// Fetches detailed information about a user with a specific id from the server.
  const getUserById = async (id) => {
    return getJson( fetch(SERVER_URL + 'users/' + id, { credentials: 'include' }))
      .then( user => {
        const clientUser = {
          id: user.id,
          username: user.username,
          name: user.name,
          total_score: user.total_score
        }
        return clientUser;
      } )
  };


// Deleting incomplete games or game data associated with anonymous users from the database. 
  function deleteInCompleteGame() {
    return getJson(
      fetch(SERVER_URL + "incomplete/" , {
        method: 'DELETE',
      })
    )
  }
 

/**
 * This function wants username and password inside a "credentials" object.
 * It executes the log-in.
 */
const logIn = async (credentials) => {
  return getJson(fetch(SERVER_URL + 'sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',  // this parameter specifies that authentication cookie must be forwared
    body: JSON.stringify(credentials),
  })
  )
};

/**
 * This function is used to verify if the user is still logged-in.
 * It returns a JSON object with the user info.
 */
const getUserInfo = async () => {
  return getJson(fetch(SERVER_URL + 'sessions/current', {
    // this parameter specifies that authentication cookie must be forwared
    credentials: 'include'
  })
  )
};

/**
 * This function destroy the current user's session and execute the log-out.
 */
const logOut = async() => {
  return getJson(fetch(SERVER_URL + 'sessions/current', {
    method: 'DELETE',
    credentials: 'include'  // this parameter specifies that authentication cookie must be forwared
  })
  )
}

const API = {logIn, getUserInfo, logOut, getEasyItems, getMediumItems, getHardItems,startEasyGame, startMediumGame, startHardGame,  checkGuess, checkMatch, updateGame, getHistory, getUserById, getItemById, deleteInCompleteGame};

export default API;






  