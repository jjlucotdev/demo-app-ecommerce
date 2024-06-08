import { Modal, Form, Button, FloatingLabel } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../UserContext';
import Products from './Products';
import Swal from 'sweetalert2';

export default function Login({ show, setShow, openRegister }) {
    const { user, setUser } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(true);

    const [errorEmail, setErrorEmail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');

    function authenticate(e) {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.access) {
                localStorage.setItem('token', data.access);
                retrieveUserDetails(data.access);
                Swal.fire({
                    title: "Login Successful",
                    icon: "success",
                    text: "Welcome to GuppyParadaisu"
                });
                setShow(false);
                <Navigate to="/products" element={<Products />}/>


            } else {
                if (data.error === 'Email and password do not match') {
                    setErrorPassword(data.error);
                } else if (data.error === "No email found") {
                    setErrorEmail(data.error);
                } else {
                    Swal.fire({
                        title: "Authentication failed",
                        icon: "error",
                        text: "Check your login details and try again"
                    });
                }
            }
        });
        setEmail('');
        setPassword('');
    }

    const retrieveUserDetails = (token) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setUser({
                id: data.user._id,
                isAdmin: data.user.isAdmin
            });
        });
    }

    useEffect(() => {
        setIsActive(email !== '' && password !== '');
    }, [email, password]);

    return (
        <Modal show={show} onHide={() => setShow(false)} dialogClassName='rounded-0'>
            <Modal.Header closeButton>
                <Modal.Title className="text-center"></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="text-center mb-3">
                    <h1 id="logo">GuppyParadaisu</h1>
                </div>
                <Form onSubmit={authenticate}>
                    <FloatingLabel controlId="userEmail" label="Email address">
                        <Form.Control 
                            type="email" 
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setErrorEmail('');
                            }}
                            required
                            className={`mt-2 mb-2 ${errorEmail ? 'border border-danger' : ''}`}
                        />
                        {errorEmail && <small className="text-danger">{errorEmail}</small>}
                    </FloatingLabel>
                    
                    <FloatingLabel controlId="password" label="Password">
                        <Form.Control 
                            type="password" 
                            placeholder="Password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setErrorPassword('');
                            }}
                            required
                            className={`mt-2 mb-2 ${errorPassword ? 'border border-danger' : ''}`}
                        />
                        {errorPassword && <small className="text-danger">{errorPassword}</small>}
                    </FloatingLabel>

                    <Button variant="primary" type="submit" disabled={!isActive} className="mt-3 w-100">
                        Sign in
                    </Button>
                </Form>
                <hr></hr>
                <p className="mt-3 text-center">
                    Don't have an account yet? 
                    <a onClick={openRegister} style={{cursor: 'pointer'}}> Sign up here</a>.
                </p>
            </Modal.Body>
        </Modal>
    );
}
