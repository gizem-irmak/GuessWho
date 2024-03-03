import { useState } from 'react';
import {Form, Button} from 'react-bootstrap';

function LoginForm({login}) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (event) => {
      event.preventDefault();
      const credentials = { username, password };     
      login(credentials);
  };
  return (
    <div className='frm-login'>
   <Form className="mx-auto my-auto w-25" onSubmit={handleSubmit}>
  <Form.Group controlId='username' className="mb-3">
    <Form.Label>Email</Form.Label>
    <Form.Control
      type='email'
      value={username}
      onChange={ev => setUsername(ev.target.value)}
      required={true}
    />
  </Form.Group>

  <Form.Group controlId='password' className="mb-3">
    <Form.Label>Password</Form.Label>
    <Form.Control
      type='password'
      value={password}
      onChange={ev => setPassword(ev.target.value)}
      required={true}
      minLength={6}
    />
  </Form.Group>
  <Button type="submit" variant='dark' className="w-100">Login</Button>
</Form>

    </div>
  );
  
 
};

function LogoutButton({logout}) {
  return(
    <Button variant='outline-light' onClick={logout}>Logout</Button>
  )
}

export { LoginForm, LogoutButton };