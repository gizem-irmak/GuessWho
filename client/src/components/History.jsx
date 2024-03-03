import React from 'react';
import { Container, Table } from 'react-bootstrap';
import '../App.css';


export default function History ( {completedMatches, totalScore} ) {


  return (
    <Container className="text-center mt-3">
    <div className='history'>
      <h2>Match History</h2>
       <p>Total Score: {totalScore} </p> 
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Difficulty</th>
            <th>Secret Item</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {completedMatches.map((match) => (
            <tr key={match.id}>
              <td>{match.startDate}</td>
              <td>{match.difficulty}</td>
              <td><img src={match.secretImageUrl} alt="Item" className="animal-history" /></td>
              <td>{match.score}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      </div>
    </Container>
  );
}




