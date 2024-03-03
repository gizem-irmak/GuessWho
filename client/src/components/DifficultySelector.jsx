import React, { useState } from 'react';
import { ButtonGroup, Button, Container } from 'react-bootstrap';

const DifficultySelector = ({ onDifficultyChange}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  
  const handleDifficultyClick = (difficulty) => {
    setSelectedDifficulty(difficulty);
    onDifficultyChange(difficulty);    
  };

  return (
    <Container fluid className="mt-3 d-flex justify-content-center align-items-center">
    <div className="text-center mt-3" > 
      <h4 className='difficulty-text'>Choose Difficulty:</h4>
      <ButtonGroup size="lg">
        <Button
          variant={selectedDifficulty === 'easy' ? 'secondary' : 'outline-secondary'}
          onClick={() => handleDifficultyClick('easy')}
          className="mx-2"
        >
          Easy
        </Button>
        <Button
          variant={selectedDifficulty === 'medium' ? 'secondary' : 'outline-secondary'}
          onClick={() => handleDifficultyClick('medium')}
          className="mx-2"
        >
          Medium
        </Button>
        <Button
          variant={selectedDifficulty === 'hard' ? 'secondary' : 'outline-secondary'}
          onClick={() => handleDifficultyClick('hard')}
          className="mx-2"
        >
          Hard
        </Button>
      </ButtonGroup>
    </div>
    </Container>
  );
};

export default DifficultySelector;
