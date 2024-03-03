import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavBar = ({ loggedIn, onLogout }) => {
  return (
    <Navbar bg="dark" variant="dark" fixed="top" className="navbar-padding">
      <Container>
        <Navbar.Brand href="/"> Guess Who? </Navbar.Brand>
        <Nav className="ml-auto">
          {loggedIn ? (
            <>
              <Nav.Link as={Link} to="/history">
                <span role="img" aria-label="History">&#128197;</span> History
              </Nav.Link>
              <Nav.Link onClick={onLogout}>
                <span role="img" aria-label="Logout">&#128274;</span> Logout
              </Nav.Link>
            </>
          ) : (
            <Nav.Link as={Link} to="/login">
              <span role="img" aria-label="Login">&#128273;</span> Login
            </Nav.Link>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;

