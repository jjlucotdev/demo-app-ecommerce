import React, { useEffect, useState } from 'react';
import { Spinner, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function UserDetails() {
    const [userDetails, setUserDetails] = useState(null);
    const [defaultAddress, setDefaultAddress] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data) {
                setUserDetails(data.user);
                const defaultAddr = data.user.addresses.find(addr => addr.isDefault);
                setDefaultAddress(defaultAddr);
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to fetch user details',
                    icon: 'error'
                });
            }
        })
        .catch(error => {
            console.error('Error fetching user details:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to fetch user details',
                icon: 'error'
            });
        })
        .finally(() => {
            setLoading(false);
        });
    };

    if (loading) {
        return (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        );
    }

    return (
        <div className="mb-4 bg-light">
            <h5 className="bg-dark text-white p-2 mb-3">Delivery Address</h5>
            {userDetails ? (
                <>
                    <Row className='m-1'>
                        <Col xs={6} md={2}>
                            <strong>Name:</strong> 
                        </Col>
                        <Col xs={6} md={10}>
                            <p>{userDetails.firstName} {userDetails.lastName}</p>
                        </Col>
                    </Row>
                    <Row className='m-1'>
                        <Col xs={6} md={2}>
                            <strong>Email:</strong>
                        </Col>
                        <Col xs={6} md={4}>
                            <p>{userDetails.email}</p>
                        </Col>
                        <Col xs={6} md={2}>
                            <strong>Mobile#:</strong> 
                        </Col>
                        <Col xs={6} md={4}>
                            <p>{userDetails.mobileNo}</p>
                        </Col>
                    </Row>
                    <Row className='m-1'>
                        <Col xs={6} md={2}>
                            <strong>Address:</strong>
                        </Col>
                        <Col xs={6} md={10}>
                            <p> {defaultAddress ? `${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.province}, ${defaultAddress.postalCode}` : 'No default address found'}</p>
                        </Col>
                    </Row>
                </>
            ) : (
                <p>No user details available.</p>
            )}
        </div>
    );
}
