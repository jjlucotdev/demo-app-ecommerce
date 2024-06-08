import React, { useState, useContext, useEffect } from 'react';
import { Modal, Form, Button, FloatingLabel, Row, Col, Badge, Container  } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function Register({ show, handleClose, handleShowLogin }) {
    const { user } = useContext(UserContext);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isActive, setIsActive] = useState(false);

    const [errorFirstName, setErrorFirstName] = useState("");
    const [errorLastName, setErrorLastName] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorMobileNo, setErrorMobileNo] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [errorConfirmPassword, setErrorConfirmPassword] = useState("");

    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [province, setProvince] = useState("");
    const [country, setCountry] = useState("");
    const [postalCode, setPostalCode] = useState("");

    function registerUser(e) {
        e.preventDefault();

        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                mobileNo,
                password,
                address: {
                    street,
                    city,
                    province,
                    country,
                    postalCode
                }
            })
        })
        .then(res => res.json())
        .then(data => {

            if (data.message) {
                setFirstName('');
                setLastName('');
                setEmail('');
                setMobileNo('');
                setPassword('');
                setConfirmPassword('');

                Swal.fire({
                    title: "Registration Successful",
                    icon: "success",
                    text: "Welcome to Guppy Paradaisu"
                });

                handleClose();
            } else {
                if (data.error.includes('Email already exists')) {
                    setErrorEmail(data.error);
                } else if (data.error.includes('First name and last name must be strings')) {
                    setErrorFirstName(data.error);
                    setErrorLastName(data.error);
                } else if (data.error.includes('Email Invalid')) {
                    setErrorEmail(data.error);
                } else if (data.error.includes('Password must be at least 8 characters')) {
                    setErrorPassword(data.error);
                } else if (data.error.includes('Mobile number invalid')) {
                    setErrorMobileNo(data.error);
                } else {
					Swal.fire({
						title: "Something went wrong",
						icon: "error",
						text: "Please try again later."
					});
                }
            }
        });
    }

    useEffect(() => {
        if (
            firstName !== "" &&
            lastName !== "" &&
            email !== "" &&
            mobileNo !== "" &&
            password !== "" &&
            confirmPassword !== "" &&
            password === confirmPassword &&
            mobileNo.length !== ""
        ) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [firstName, lastName, email, mobileNo, password, confirmPassword]);

    return (
        <Modal show={show} onHide={handleClose} size="lg" className='w-100'>
            <Modal.Header closeButton>
                <Modal.Title>Register</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>
                <Form onSubmit={registerUser}  fluid >
					<Row>
						<Col sm='12' >
							<h4>Credentials</h4>
						</Col>
					</Row>
					<Row >
						<Col sm='12'>
							<FloatingLabel controlId="email" label="Email">
								<Form.Control
									type="email"
									placeholder="Email"
									value={email}
									onChange={(e) => {
										setEmail(e.target.value);
										setErrorEmail('');
									}}
									required
									className={`mt-2 ${errorEmail ? 'border border-danger' : ''}`}
								/>
								{errorEmail && <small className="ms-1 mb-2 text-danger">{errorEmail}</small>}
							</FloatingLabel>
						</Col>
					</Row>
					<Row>
						<Col sm='12' md='6'>
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
									className={`mt-2 ${errorPassword ? 'border border-danger' : ''}`}
								/>
								{errorPassword && <small className="ms-1 mb-2 text-danger">{errorPassword}</small>}
							</FloatingLabel>
						</Col>
						<Col sm='12' md='6'>
							<FloatingLabel controlId="confirmPassword" label="Confirm Password">
								<Form.Control
									type="password"
									placeholder="Confirm Password"
									value={confirmPassword}
									onChange={(e) => {
										setConfirmPassword(e.target.value);
										setErrorConfirmPassword('');
									}}
									required
									className={`mt-2 ${errorConfirmPassword ? 'border border-danger' : ''}`}
								/>
								{confirmPassword !== password && <small className="ms-1 mb-2 text-danger">Passwords do not match</small>}
							</FloatingLabel>
						</Col>
					</Row>
					
					
					<Row>
						<Col>
							<h4 className='mt-3'>Basic Information</h4>
						</Col>
					</Row>
					<Row>
						<Col sm='12' md='6'>
							<FloatingLabel controlId="firstName" label="First Name">
								<Form.Control
									type="text"
									placeholder="First Name"
									value={firstName}
									onChange={(e) => {
										setFirstName(e.target.value);
										setErrorFirstName('');
									}}
									required
									className={`mt-2 ${errorFirstName ? 'border border-danger' : ''}`}
								/>
								{errorFirstName && <small className="ms-1 mb-2 text-danger">{errorFirstName}</small>}
							</FloatingLabel>
						</Col>
						<Col sm='12' md='6'>
							<FloatingLabel controlId="lastName" label="Last Name">
								<Form.Control
									type="text"
									placeholder="Last Name"
									value={lastName}
									onChange={(e) => {
										setLastName(e.target.value);
										setErrorLastName('');
									}}
									required
									className={`mt-2 ${errorLastName ? 'border border-danger' : ''}`}
								/>
								{errorLastName && <small className="ms-1 mb-2 text-danger">{errorLastName}</small>}
							</FloatingLabel>
						</Col>
					</Row>
					<Row >
						<Col sm='12' md='6'>
							<FloatingLabel controlId="mobileNo" label="Mobile No">
								<Form.Control
									type="text"
									placeholder="Mobile No"
									value={mobileNo}
									onChange={(e) => {
										setMobileNo(e.target.value);
										setErrorMobileNo('');
									}}
									required
									className={`mt-2 ${errorMobileNo ? 'border border-danger' : ''}`}
								/>
								{errorMobileNo && <small className="ms-1 mb-2 text-danger">{errorMobileNo}</small>}
							</FloatingLabel>
						</Col>
						<Col sm='12' md='6'>
						
						</Col>
					</Row>
					<hr></hr>
					<Row>
						<Col sm='12'>
							<h4 className='mt-3'>Address Details <small><i>(Optional)</i></small></h4>
							<small>Note: This will be set as your default address. You can add or edit it after creating your account.</small>
						</Col>
					</Row>
					<Row>
						<Col sm='12' md='6'>
							<FloatingLabel controlId="street" label="Street">
								<Form.Control
									type="text"
									placeholder="Street"
									value={street}
									onChange={(e) => {
										setStreet(e.target.value);
									}}
									className="mt-2"
								/>
							</FloatingLabel>
						</Col>
						<Col sm='12' md='6'>
							<FloatingLabel controlId="city" label="City">
								<Form.Control
									type="text"
									placeholder="City"
									value={city}
									onChange={(e) => {
										setCity(e.target.value);
									}}
									className="mt-2"
								/>
							</FloatingLabel>
						</Col>
					</Row>
					<Row>
						<Col sm='12' md='4'>
							<FloatingLabel controlId="province" label="Province">
								<Form.Control
									type="text"
									placeholder="Province"
									value={province}
									onChange={(e) => {
										setProvince(e.target.value);
									}}
									className="mt-2"
								/>
							</FloatingLabel>
						</Col>
						<Col sm='12' md='4'>
							<FloatingLabel controlId="postalCode" label="Postal Code">
								<Form.Control
									type="text"
									placeholder="Postal Code"
									value={postalCode}
									onChange={(e) => {
										setPostalCode(e.target.value);
									}}
									className="mt-2"
								/>
							</FloatingLabel>
						</Col>
						<Col sm='12' md='4'>
							<FloatingLabel controlId="country" label="Country">
								<Form.Control
									type="text"
									placeholder="Country"
									value={country}
									onChange={(e) => {
										setCountry(e.target.value);
									}}
									className="mt-2"
								/>
							</FloatingLabel>
						</Col>
					</Row>
                    <Button variant="primary" type="submit" disabled={!isActive} className="mt-3 w-100">
                        Submit
                    </Button>
                </Form>
				<hr className='mt-4 mb-4'></hr>
                <div className="mt-3 text-center">
                    <small>
                        Already have an account? <Button variant="link" size="sm" className='mb-1 p-0' onClick={() => { handleClose(); handleShowLogin(); }}>Log in</Button>
                    </small>
                </div>
            </Modal.Body>
        </Modal>
    );
}
