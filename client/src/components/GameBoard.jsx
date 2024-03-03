import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import DifficultySelector from './DifficultySelector';
import Item from './Item'; // Assuming you have the Item component
import Guess from './Guess';
import '../App.css';
import { useNavigate } from 'react-router-dom';



export default function GameBoard({items, onDifficultyChange, onStartGame, onGuessSubmit, enabledItems, gameStarted, guessResult, setGuessResult, difficultySelected, onSelectItem, isWin, isLost, score, user}) {
  const navigate = useNavigate();
  return (
    <div className="game-board">
      {!difficultySelected && <h1 className='text-center mt-3' style={{ fontWeight: 'bold' }}>  WELCOME TO <br/> WILD ANIMALS GUESS WHO GAME !</h1>}
      {!gameStarted && <DifficultySelector onDifficultyChange={onDifficultyChange} />} 
      {difficultySelected && !gameStarted && (
          <div className="text-center mt-3">
            <Button onClick={onStartGame} variant="dark" size="lg" className='start-btn'> Start Game </Button>
          </div>
        )}
      <Container fluid>
        <Row>
          {items.map((item) => (
            <Col key={item.id} xs={4} md={3} lg={2}>
              <Item item={item} isEnabled={enabledItems.some(enabledItem => enabledItem.id === item.id)} onSelectItem={onSelectItem} isWin={isWin} isLost={isLost}/>
            </Col>
          ))}
        </Row>
        {gameStarted && !isWin && !isLost && (<Guess onGuessSubmit={onGuessSubmit} guessResult={guessResult} setGuessResult={setGuessResult} />)}
        {isWin && <p className="big-bold-text text-success">Congratulations! You Win!</p>}
        {isLost && <p className="big-bold-text text-danger">Oops! You lose!</p>}
        {(isWin || isLost) && score !== undefined && (<p className="big-bold-text"> Your Score: {score} </p>)}   
        <div className="text-center mt-3">
            {(isWin || isLost) && <Button  onClick={() => { 
              navigate('/'); 
              window.location.reload(); }}  
              variant="dark" size="lg" className='start-btn'> Play Again </Button>}
        </div>   
      </Container>
    </div> 
  );
}



