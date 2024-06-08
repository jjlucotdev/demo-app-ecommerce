import React, { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

const ResetPassword = (props) => {
    const { email } = props;
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    let token = localStorage.getItem('token');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Passwords do not match',
            });
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to reset your password?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, reset it!',
            cancelButtonText: 'No, cancel!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/update-password`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ email, password }),
                    });

                    const data = await response.json();

                    if (response.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Password reset successfully',
                        });
                        setPassword('');
                        setConfirmPassword('');
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: data.error || 'Error resetting password. Please try again.',
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error resetting password. Please try again.',
                    });
                }
            }
        });
    };

    return (
        <Container className="d-flex justify-content-center align-items-center">
            <Form onSubmit={handleSubmit} className='w-75'>
                <Form.Group controlId="password">
                    <Row className="mt-1 mb-1 justify-content-center">
                        <Col xs={12} md={4}>
                            <Form.Label>New Password:</Form.Label>
                        </Col>
                        <Col xs={12} md={8}>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group controlId="confirmPassword">
                    <Row className="my-2 justify-content-center">
                        <Col xs={12} md={4} className='justify-content-end'>
                            <Form.Label>Confirm Password:</Form.Label>
                        </Col>
                        <Col xs={12} md={8}>
                            <Form.Control
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </Col>
                    </Row>
                </Form.Group>
                <Row className="my-2 justify-content-end">
                    <Col xs={12} md={8} className="d-flex justify-content-end">
                        <Button variant="danger" type="submit">Reset Password</Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
};

export default ResetPassword;
