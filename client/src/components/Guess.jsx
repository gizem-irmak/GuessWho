import React, { useState } from 'react';
import { Form, Container, Button } from 'react-bootstrap';

const Guess = ({onGuessSubmit, guessResult, setGuessResult,}) => {

  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  
  // Define value options based on property
  const propertyValueOptions = {
    nutrition: ['carnivore', 'herbivore', 'omnivore'],
    legs: ['0', '2', '4'],
    color: ['brown', 'white', 'black', 'black and white', 'gray', 'green', 'spots'],
    habitat: ['forest', 'grassland', 'savanna', 'aquatic', 'arctic'],
    size: ['small', 'medium', 'large'],
    behavior: ['solitary', 'social'],
  };

  const handlePropertyChange = (event) => {
    setSelectedProperty(event.target.value);
    setSelectedValue('');
    setGuessResult(null);   // Clear the previous guess result
  };

  const handleValueChange = (event) => {
    setSelectedValue(event.target.value);
    setGuessResult(null);   // Clear the previous guess result
  };

  const handleGuess = () => { 
    if (selectedProperty && selectedValue) {
        onGuessSubmit(selectedProperty, selectedValue);      
    }
  };

  return (
    <Container>
      <h5 className='h5-text'>Guess the Animal</h5>
      <Form className="p-3">
        <Form.Group className='frm-guess' controlId="propertySelect">
          <Form.Label>Select Property:</Form.Label>
          <Form.Control as="select" value={selectedProperty} onChange={handlePropertyChange}>
            <option value="">-- Select Property --</option>
            <option value="nutrition">Nutrition</option>
            <option value="legs">Legs</option>
            <option value="color">Color</option>
            <option value="habitat">Habitat</option>
            <option value="size">Size</option>
            <option value="behavior">Behavior</option>
          </Form.Control>
        </Form.Group>
        {selectedProperty && (
          <Form.Group className='frm-guess' controlId="valueSelect">
            <Form.Label>Select Value:</Form.Label>
            <Form.Control as="select" value={selectedValue} onChange={handleValueChange}>
              <option value="">-- Select Value --</option>
              {propertyValueOptions[selectedProperty].map((value, index) => (
                <option key={index} value={value}> {value} </option>
              ))}
            </Form.Control>
          </Form.Group>
        )}
        {selectedValue && (<Button className='btn-guess btn-block' variant="dark"  onClick={handleGuess} > Submit Guess</Button>)}
        {guessResult !== null && (<p className={guessResult ? 'text-success' : 'text-danger'}> Your Guess : {selectedProperty} - {selectedValue}.   
        {guessResult ? ' Your guess is correct.' : '  Your guess is incorrect.'}</p>)}
      </Form>
    </Container>
  );
};

export default Guess;
