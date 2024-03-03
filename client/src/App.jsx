import './App.css'
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap/';
import {BrowserRouter, Routes, Route, Outlet, Navigate} from 'react-router-dom';
import GameBoard from './components/GameBoard';
import Navigation from './components/Navigation'; 
import History from './components/History'; 
import API from './API.js';
import { useState, useEffect } from 'react';
import { LoginForm } from './components/Auth';
import dayjs from 'dayjs';



function App() {

  const [items, setItems] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [enabledItems, setEnabledItems] = useState([]);
  const [gameId, setGameId] = useState('');
  const [guessResult, setGuessResult] = useState(null);
  const [difficultySelected, setDifficultySelected] = useState('');
  const [isWin, setIsWin] = useState(false);
  const [isLost, setIsLost] = useState(false);
  const [score, setScore] = useState(0);
  const [nGuesses, setNGuesses] = useState(0); 

  // This state keeps track if the user is currently logged-in.
  const [loggedIn, setLoggedIn] = useState(false);

  // This state contains the user's info.
  const [user, setUser] = useState(null);

  const [completedMatches, setCompletedMatches,] = useState([]);
  const [totalScore, setTotalScore] = useState(0);

  const [updatedGame, setUpdatedGame] = useState(null);

 
  useEffect(() => {
    const init = async () => {
      try {
        const user = await API.getUserInfo();  // here you have the user info, if already logged in
        setUser(user);
        setLoggedIn(true); 
      } catch (err) {
        setUser(null);
        setLoggedIn(false); 
      }
    };
    init();
  }, []);  // This useEffect is called only the first time the component is mounted.
  

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setUser(user);
    }catch(err) {
      console.error('Error occurred during login:', err);     
    }
  };


  const handleLogout = async () => {
    try {
      await API.logOut(); // Perform the logout API request 
      // Reset states and data
      setLoggedIn(false);
      setUser(null);
      setMessage('');
    } catch (error) {
      console.error('Error occurred during logout:', error);
    }
  };
  

  useEffect(() => {
    if (enabledItems.length === 1 && !isWin && !isLost) {
      setScore(Math.max(items.length - nGuesses, 0));  // Calculate score
      setIsWin(true);
    }
  }, [enabledItems]);


  useEffect(() => {
    if (loggedIn) {
      const currentDate = dayjs();
      const game = { 
       gameId: gameId,
       startDate: currentDate.format('YYYY-MM-DD HH:mm:ss'),
       difficulty: difficultySelected,
       score: score,
      }
      UpdateGameInfo(game); 
    }
  }, [isWin, isLost]);


  useEffect(() => {
    deleteGames();
  }, [updatedGame]);

  const deleteGames = async () => {
    try {
      const deletionCompleted = await API.deleteInCompleteGame();
    }catch(err) {
      console.error('Error occurred during deleting incomplete and anonymous user games.', err);     
    }
  };


  const UpdateGameInfo = async (game) => {
    try {
      const updatedGame = await API.updateGame(game); 
      setUpdatedGame(updatedGame);
    }catch(err) {
      console.error('Error occurred during updating game.', err);     
    }
  };


  const handleDifficultyChange = async (difficulty) => { 
    if(difficulty =='easy') {
      const easyItems = await API.getEasyItems();
      setItems(easyItems);   
    }
    if(difficulty =='medium'){
      const mediumItems = await API.getMediumItems();
      setItems(mediumItems); 
    }
    if(difficulty =='hard'){
      const hardItems = await API.getHardItems();
      setItems(hardItems);  
    }
    setDifficultySelected(difficulty);
  };

  
  const handleStart = async () => {

    if (difficultySelected == 'easy') {
       const responseEasy = await API.startEasyGame();   
       setGameId(responseEasy.gameId);
    }
    if (difficultySelected == 'medium') {
       const responseMedium = await API.startMediumGame();
       setGameId(responseMedium.gameId);
    }
    if (difficultySelected == 'hard') {
       const responseHard = await API.startHardGame();
       setGameId(responseHard.gameId);
  }
    setGameStarted(true);
    setEnabledItems([...items]);
    setIsWin(false); // Reset win status
    setNGuesses(0); // Reset number of guesses
    setScore(0); // Reset score
  };


  const handleGuessSubmit = async (selectedProperty, selectedValue) => {
    const response = await API.checkGuess(gameId, selectedProperty, selectedValue);
  
    if (response.isCorrect !== undefined) {
      // Update enabled items based on response
      if (response.isCorrect) {
        setEnabledItems((prevEnabledItems) =>
          prevEnabledItems.filter((item) => {
            const parsedProperties = JSON.parse(item.properties);
            const selectedPropertyValue = parsedProperties[selectedProperty];
            return selectedPropertyValue === selectedValue;
          })
        );
      } else {
        setEnabledItems((prevEnabledItems) =>
          prevEnabledItems.filter((item) => {
            const parsedProperties = JSON.parse(item.properties);
            const selectedPropertyValue = parsedProperties[selectedProperty];
            return selectedPropertyValue !== selectedValue;
          })
        );
      }
      setGuessResult(response.isCorrect);
      setNGuesses((nGuesses) => nGuesses + 1); // Increment number of guesses

    } else {
      // Handle the case where the response does not contain the expected "isCorrect" field
      setGuessResult('unknown');
      alert('An error occurred. Please try again later.');
    }
  };
  
  const handleSelectItem = async (selectedItem) => {

     const selectedItemId = selectedItem.id;
     const response = await API.checkMatch(gameId);

     if (response.secretItemId !== undefined) {
      
      if (response.secretItemId == selectedItemId) {
          setIsWin(true);
          setScore(Math.max(items.length - nGuesses, 0)); // Calculate score      
      } else {
          setIsLost(true);
          setScore(0);         
      }
      setEnabledItems((prevEnabledItems) =>
          prevEnabledItems.filter((item) => {
          return item.id == response.secretItemId; }));  
     } else {
      // Handle the case where the response does not contain the expected "secretItemId" field
      alert('An error occurred. Please try again later.');
     }

  };


  useEffect(() => {
    if (user) {
      // Fetch the user's completed matches and total score from the API
      getCompletedMatches(user);
      getUserTotalScore(user);
    }
  }, [user, updatedGame ]);


  const getCompletedMatches = async (user) => {
    try {
      const matches = await API.getHistory(user.id);
      // Use Promise.all to fetch secret item image URLs for all matches concurrently
      const matchesWithSecretImageUrls = await Promise.all(
        matches.map(async (match) => {
          try {
            const secretItem = await API.getItemById(match.secretItemId);
            const secretImageUrl = secretItem.image_url;
            match.secretImageUrl = secretImageUrl;
            return match;
          } catch (error) {
            console.error(`Error fetching secret item image URL for match with ID ${match.id}:`, error);
            return match; // Return the match object without the secretImageUrl property
          }
        })
      ); 
      setCompletedMatches(matchesWithSecretImageUrls);
    } catch (error) {
      console.error('Error fetching completed matches:', error);
    }
  };
  
   const getUserTotalScore = async (user) => {
    try {
      const userInfo = await API.getUserById(user.id);
      setTotalScore(userInfo.total_score);
    } catch (error) {
      console.error('Error fetching completed matches:', error);
    }
  };


  return (
    <BrowserRouter>
    <Routes>
      <Route element={
        <>
          <Navigation loggedIn={loggedIn} onLogout={handleLogout}/>
          <Container fluid className="mt-3">
            <Outlet/>
          </Container>
        </>} >
          
        <Route index 
          element={<GameBoard onDifficultyChange={handleDifficultyChange} items={items} onGuessSubmit={handleGuessSubmit} onStartGame={handleStart} enabledItems={enabledItems} gameStarted={gameStarted} guessResult={guessResult} setGuessResult={setGuessResult} difficultySelected={difficultySelected} onSelectItem={handleSelectItem} isWin={isWin} isLost={isLost} score={score}/>}/>
         <Route path='history' 
          element={<History completedMatches={completedMatches} totalScore={totalScore}/> } />      
        <Route path='/login' element= {loggedIn ? <Navigate replace to='/' /> : <LoginForm login={handleLogin} />} />

      </Route>
    </Routes>
    </BrowserRouter>
  );
  }
export default App


