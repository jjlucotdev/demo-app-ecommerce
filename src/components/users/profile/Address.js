import { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';


export default function Address({ id, address }) {

    const [isDefault, setIsDefault] = useState(address?.isDefault);
    const [isEditing, setIsEditing] = useState(false);
    const [editedAddress, setEditedAddress] = useState(address);
    const [isUpdateLoading, setIsUpdateLoading] = useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedAddress(address);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedAddress({ ...editedAddress, [name]: value });
    };



    const handleSetDefault = () => {
        Swal.fire({
            title: 'Confirmation',
            text: 'Do you want this to be your new default address?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${process.env.REACT_APP_API_BASE_URL}/users/${address._id}/set-default-address`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                .then(res => res.json())
                .then(data => {
                    if (data.message) {
                        setIsDefault(true);
                        Swal.fire({
                            title: 'Default Address Set',
                            icon: 'success',
                            text: data.message
                        });
                    } else {
                        Swal.fire({
                            title: 'Set Default Address Failed',
                            icon: 'error',
                            text: data.error || 'Failed to set default address.'
                        });
                    }
                })
                .catch(error => {
                    Swal.fire({
                        title: 'Set Default Address Failed',
                        icon: 'error',
                        text: 'Failed to set default address. Please try again later.'
                    });
                    console.error('Error setting default address:', error);
                });
            }
        });
    };

    const handleUpdateAddress = () => {
        setIsUpdateLoading(true);
        const { isDefault, ...addressToUpdate } = editedAddress;

        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/${address._id}/update-address`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(addressToUpdate)
        })
        .then(res => res.json())
        .then(data => {
            if (data.message) {
                Swal.fire({
                    title: 'Address Updated',
                    icon: 'success',
                    text: data.message
                });
                setIsEditing(false);
                setIsUpdateLoading(false);
            } else {
                Swal.fire({
                    title: 'Update Failed',
                    icon: 'error',
                    text: data.error || 'Failed to update address.'
                });
                setIsUpdateLoading(false);
            }
        })
        .catch(error => {
            Swal.fire({
                title: 'Update Failed',
                icon: 'error',
                text: 'Failed to update address. Please try again later.'
            });
            console.error('Error updating address:', error);
            setIsUpdateLoading(false);
        });
    };

    const handleDeleteAddress = () => {
        Swal.fire({
            title: 'Confirmation',
            text: 'Do you want to delete this address?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${process.env.REACT_APP_API_BASE_URL}/users/${address._id}/delete-address`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                .then(res => res.json())
                .then(data => {
                    if (data.message) {
                        Swal.fire({
                            title: 'Address Deleted',
                            icon: 'success',
                            text: data.message
                        });
                        setIsDeleteLoading(false);
                    } else {
                        Swal.fire({
                            title: 'Delete Failed',
                            icon: 'error',
                            text: data.error || 'Failed to delete address.'
                        });
                        setIsDeleteLoading(false);
                    }
                })
                .catch(error => {
                    Swal.fire({
                        title: 'Delete Failed',
                        icon: 'error',
                        text: 'Failed to delete address. Please try again later.'
                    });
                    console.error('Error deleting address:', error);
                    setIsDeleteLoading(false);
                });
            }
        });
    };

    return (
        <>
            <Form>
                <Row className="mb-2">
                    <Col xs={1} className="d-flex align-items-center justify-content-center" >
                        <Form.Check 
                            type="radio"
                            name="defaultAddress"
                            checked={isDefault}
                            onChange={handleSetDefault}
                        />
                    </Col>
                    <Col xs={11}>
                        <Row className="mb-2">
                            <Col xs={6} md={1}>
                                <Form.Label className="text-end">Street:</Form.Label>
                            </Col>
                                       
                            <Col xs={6} md={6}>
                                <Form.Control
                                    type="text"
                                    placeholder="Street"
                                    name="street"
                                    value={editedAddress.street}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </Col>
                            <Col xs={6} md={1}>
                                <Form.Label className="text-end">City:</Form.Label>
                            </Col>
                            <Col xs={6} md={4}>
                                <Form.Control
                                    type="text"
                                    placeholder="City"
                                    name="city"
                                    value={editedAddress.city}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </Col>
                           
                        </Row>

                        <Row className="mb-2">
                            <Col xs={6} md={1}>
                                <Form.Label className="text-end">Province:</Form.Label>
                            </Col>
                            <Col xs={6} md={3}>
                                <Form.Control
                                    type="text"
                                    placeholder="Province"
                                    name="province"
                                    value={editedAddress.province}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </Col>
                            <Col xs={6} md={2}>
                                <Form.Label className="text-end">Postal Code:</Form.Label>
                            </Col>
                            <Col xs={6} md={1}>
                                <Form.Control
                                    type="text"
                                    placeholder="Postal Code"
                                    name="postalCode"
                                    value={editedAddress.postalCode}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </Col>
                            <Col xs={6} md={1}>
                                <Form.Label className="text-end">Country:</Form.Label>
                            </Col>
                            <Col xs={6} md={4}>
                                <Form.Control
                                    type="text"
                                    placeholder="Country"
                                    name="country"
                                    value={editedAddress.country}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </Col>
                        </Row>
                    
                        {isEditing ? (
                            <>
                                <Button variant="primary" onClick={handleUpdateAddress} disabled={isUpdateLoading}>
                                    {isUpdateLoading ? <Spinner animation="border" size="sm" /> : 'Update'}
                                </Button>{' '}
                                <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                            </>
                        ) : (
                            <>
                                <Button variant="primary" onClick={handleEdit}>Edit</Button>{' '}
                                <Button variant="danger" onClick={handleDeleteAddress} disabled={isDeleteLoading}>
                                    {isDeleteLoading ? <Spinner animation="border" size="sm" /> : 'Delete'}
                                </Button>
                            </>
                        )}
                    </Col>
                </Row>
            </Form>
        </>
    );
}

