import { useState, useEffect, useContext } from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { Navigate } from 'react-router-dom';
import UserContext from '../UserContext';
import ResetPassword from '../components/users/profile/ResetPassword';
import Address from '../components/users/profile/Address';
import AddAddress from '../components/users/profile/AddAddress';
import Accordion from 'react-bootstrap/Accordion';
import { Container } from 'react-bootstrap';
import UploadProfile from '../components/users/profile/UploadProfile';

export default function Profile() {
    const { user } = useContext(UserContext);
    const [details, setDetails] = useState({});
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchProfileDetails();
    }, []);

    const fetchProfileDetails = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.user._id) {
                setDetails(data.user);
                setFirstName(data.user.firstName);
                setLastName(data.user.lastName);
                setEmail(data.user.email);
                setMobileNo(data.user.mobileNo);
            } else if (data.error === "User not found") {
                Swal.fire({
                    title: "User not found",
                    icon: "error",
                    text: "Something went wrong, kindly contact us for assistance."
                });
            } else {
                Swal.fire({
                    title: "Something went wrong",
                    icon: "error",
                    text: "Something went wrong, kindly contact us for assistance."
                });
            }
        });
    };

    const handleUpdate = () => {
        if (isEditing) {
            Swal.fire({
                title: 'Confirm Update',
                text: 'Are you sure you want to update your profile?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, update',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                   fetch(`${process.env.REACT_APP_API_BASE_URL}/users/updateProfile`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({
                            firstName,
                            lastName,
                            mobileNo
                        })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.message) {
                            Swal.fire({
                                title: 'Update Successful',
                                icon: 'success',
                                text: data.message
                            });
                            setIsEditing(false); // Stop editing after successful update
                        } else {
                            Swal.fire({
                                title: 'Update Failed',
                                icon: 'error',
                                text: data.error || 'Failed to update profile.'
                            });
                        }
                    })
                    .catch(error => {
                        Swal.fire({
                            title: 'Update Failed',
                            icon: 'error',
                            text: 'Failed to update profile. Please try again later.'
                        });
                        console.error('Error updating profile:', error);
                    });
                }
            });
        } else {
            setIsEditing(true);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFirstName(details.firstName);
        setLastName(details.lastName);
        setMobileNo(details.mobileNo);
    };

  
    return (
        (user.id === null) ?
        <Navigate to="/" /> :
        <>
            <Container fluid>
                <Row className="mt-3 mb-3">
                    <h1>Profile</h1>
                </Row>
                <Row className="mt-3 mb-3">
                    <Col xs={12} md={3}>
                        <UploadProfile details={details} ></UploadProfile>
                       
                    </Col>
                    <Col xs={12} md={9}>
                        <Accordion defaultActiveKey={['0']} alwaysOpen>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header><strong>Basic Information</strong></Accordion.Header>
                                <Accordion.Body>
                                    <Row className="mt-1 mb-3">
                                        <Col xs={6} md={2}>
                                            <Form.Label className="text-end">Email:</Form.Label>
                                        </Col>
                                        <Col xs={6} md={6}>
                                            <Form.Control
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                disabled
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="mt-1 mb-1">
                                        <Col xs={6} md={2}>
                                            <Form.Label className="justify-content-center">First Name:</Form.Label>
                                        </Col>
                                        <Col xs={6} md={4}>
                                            <Form.Control
                                                type="text"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                disabled={!isEditing}
                                            />
                                        </Col>
                                        <Col xs={6} md={2}>
                                            <Form.Label className="text-end">Last Name:</Form.Label>
                                        </Col>
                                        <Col xs={6} md={4}>
                                            <Form.Control
                                                type="text"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                disabled={!isEditing}
                                            />
                                        </Col>
                                    </Row>
                                    
                                    <Row className="mt-1 mb-1">
                                        <Col xs={6} md={2}>
                                            <Form.Label className="text-end">Mobile Number:</Form.Label>
                                        </Col>
                                        <Col xs={6} md={4}>
                                            <Form.Control
                                                type="text"
                                                value={mobileNo}
                                                onChange={(e) => setMobileNo(e.target.value)}
                                                disabled={!isEditing}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="mt-2">
                                        <Col className='d-flex justify-content-end'>
                                            <Button variant={isEditing ? "primary" : "danger"} onClick={handleUpdate} className="m-1">
                                                {isEditing ? 'Update' : 'Edit'}
                                            </Button>
                                            {isEditing && (
                                                <Button variant="danger" className="m-1" onClick={handleCancel}>
                                                    Cancel
                                                </Button>
                                            )}
                                        </Col>
                                    </Row>      
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header><strong>Address Information</strong></Accordion.Header>
                                <Accordion.Body>
                                    <Row className="mt-1 mb-1">
                                        <Col xs={1} className="d-flex align-items-center justify-content-center">
                                            <small>Default</small>
                                        </Col>
                                    </Row>
                                    <Row className="mt-1 mb-1">
                                        {details.addresses && details.addresses.length > 0 ? (
                                            details.addresses.map(address => (
                                                <Col key={address._id} sm={12} className="mb-4">
                                                    <Address id={details._id} address={address}></Address>
                                                </Col>
                                            ))
                                        ) : (
                                            <p>No addresses available.</p>
                                        )}
                                    </Row>
                                    <Row className="mt-2">
                                        <Col className='d-flex justify-content-end'>
                                            <Button variant="success" onClick={() => setShowModal(true)}>Add New Address</Button>
                                        </Col>
                                    </Row>    
                                </Accordion.Body>
                            </Accordion.Item>

                            <AddAddress id={details._id} showModal={showModal} setShowModal={setShowModal} />

                            <Accordion.Item eventKey="2">
                                <Accordion.Header><strong>Security</strong></Accordion.Header>
                                <Accordion.Body>
                                    <Row className="mt-1 mb-1">
                                        <Col>
                                            <ResetPassword email={details.email} />
                                        </Col>
                                    </Row>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                       
                    </Col>
                </Row>
            </Container>
        </>
    );
}
