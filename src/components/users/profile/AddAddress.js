import { useState } from 'react';
import { Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Swal from 'sweetalert2';

export default function AddAddress({ id, showModal, setShowModal }) {
    const [newAddress, setNewAddress] = useState({ street: '', city: '', province: '', postalCode: '', country: '', pinLocation: [10.6782, 122.9547] });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAddress({ ...newAddress, [name]: value });
    };

    const handleMapClick = (event) => {
        const { lat, lng } = event.latlng;
        setNewAddress({ ...newAddress, pinLocation: [lat, lng] });
    };

    const handleAddAddress = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/add-address`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(newAddress)
        })
        .then(res => res.json())
        .then(data => {
            if (data.message) {
                Swal.fire({
                    title: 'Address Added',
                    icon: 'success',
                    text: data.message
                });
                setNewAddress({ street: '', city: '', province: '', postalCode: '', country: '', pinLocation: [10.6782, 122.9547] });
                setShowModal(false);
            } else {
                Swal.fire({
                    title: 'Add Address Failed',
                    icon: 'error',
                    text: data.error || 'Failed to add address.'
                });
            }
        })
        .catch(error => {
            Swal.fire({
                title: 'Add Address Failed',
                icon: 'error',
                text: 'Failed to add address. Please try again later.'
            });
            console.error('Error adding address:', error);
        });
    };

    return (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Address</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form fluid className='mb-4'>
                    <Row className="mb-2">
                        <Col xs={12} >
                            <Form.Control
                                type="text"
                                placeholder="Street"
                                name="street"
                                value={newAddress.street}
                                onChange={handleInputChange}
                            />
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col xs={12} md={6}>
                            <Form.Control
                                type="text"
                                placeholder="City"
                                name="city"
                                value={newAddress.city}
                                onChange={handleInputChange}
                            />
                        </Col>
                        <Col xs={12} md={6}>
                            <Form.Control
                                type="text"
                                placeholder="Province"
                                name="province"
                                value={newAddress.province}
                                onChange={handleInputChange}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={4}>
                            <Form.Control
                                type="text"
                                placeholder="Postal Code"
                                name="postalCode"
                                value={newAddress.postalCode}
                                onChange={handleInputChange}
                            />
                        </Col>
                        <Col xs={12} md={8}>
                            <Form.Control
                                type="text"
                                placeholder="Country"
                                name="country"
                                value={newAddress.country}
                                onChange={handleInputChange}
                            />
                        </Col>
                    </Row>
                </Form>

                {/* <MapContainer center={newAddress.pinLocation} zoom={13} style={{ height: '300px', width: '100%' }} onClick={handleMapClick}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={newAddress.pinLocation}>
                        <Popup>{newAddress.pinLocation}</Popup>
                    </Marker>
                </MapContainer> */}

            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleAddAddress}>Save</Button>
            </Modal.Footer>
        </Modal>
    );
}
