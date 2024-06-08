import React, { useState, useContext } from 'react';
import { Modal, Button, ListGroup, ProgressBar, InputGroup, FormControl, Row, Col, Collapse } from 'react-bootstrap';
import Swal from 'sweetalert2'; 

export default function ProductDetails({ show, handleClose, product }) {
    const { _id, name, description, price, productImage, reviews } = product;

    const [quantity, setQuantity] = useState(1);
    const [showReviews, setShowReviews] = useState(false);

    const handleQuantityChange = (value) => {
        if (value >= 1) {
            setQuantity(value);
        }
    };

    const getTotalPrice = () => {
        return price * quantity;
    };

    const addToCart = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/addToCart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                cartItems: [{
                    productId: _id,
                    quantity: quantity
                }]
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Product added to cart',
                    icon: 'success'
                });
                handleClose();
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to add product to cart',
                    icon: 'error'
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to add product to cart',
                icon: 'error'
            });
        });
    };

    return (
        <Modal size="lg" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col>
                        <img src={`https://res.cloudinary.com/dgmdxa6y5/image/upload/${productImage}` || 'https://res.cloudinary.com/dgmdxa6y5/image/upload/v1716470796/products/662f78c801047e4064572fa5.png'} alt={name} className="w-100 mb-3" style={{ height: '200px', objectFit: 'cover' }} />
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} md={2}>
                        <strong>Description:</strong>
                    </Col>
                    <Col sm={12} md={10}>
                        {description}
                    </Col>
                </Row>
                <Row className='my-2'>
                    <Col sm={12} md={2}>
                        <strong>Reviews:</strong>
                    </Col>
                    <Col sm={12} md={10}>
                        {reviews && reviews.length > 0 ? (
                            <>
                                {reviews.slice(0, showReviews ? reviews.length : 1).map((review, index) => (
                                    <div key={review._id}>
                                        <ListGroup.Item className="bg-light p-2">
                                            <strong>Rating:</strong> <ProgressBar now={review.rating * 20} label={`${review.rating} / 5`} />
                                            <br />
                                            <strong>Remarks:</strong> {review.remarks}
                                            <br />
                                            <strong>Date:</strong> {new Date(review.createdOn).toLocaleDateString()}
                                        </ListGroup.Item>
                                        <br></br>
                                    </div>
                                ))}
                                {reviews.length > 1 && (
                                    <Button variant="outline-secondary" className="w-100 border-0" onClick={() => setShowReviews(!showReviews)}>
                                        {showReviews ? 'Show Less' : 'Show More'}
                                    </Button>
                                )}
                            </>
                        ) : (
                            <ListGroup.Item className="bg-light">No reviews yet</ListGroup.Item>
                        )}
                    </Col>
                </Row>
                <Row className='my-2'>
                    <Col xs={3} sm={2}>
                        <strong>Price:</strong> 
                    </Col>
                    <Col xs={9} sm={10}>
                        PhP {price}
                    </Col>
                </Row>
                <Row className='my-2'>
                    <Col xs={3} sm={2}>
                        <strong>Sub Total:</strong>
                    </Col>
                    <Col xs={9} sm={10}>
                        <strong>PhP {getTotalPrice()}</strong>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="quantity-label">Quantity</InputGroup.Text>
                    <FormControl
                        type="number"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                        aria-label="Quantity"
                        aria-describedby="quantity-label"
                    />
                    <Button variant="outline-secondary" onClick={() => handleQuantityChange(quantity - 1)}>-</Button>
                    <Button variant="outline-secondary" onClick={() => handleQuantityChange(quantity + 1)}>+</Button>
                </InputGroup>
                <Button variant="primary" className='w-100' onClick={addToCart}>
                    Add to Cart
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
