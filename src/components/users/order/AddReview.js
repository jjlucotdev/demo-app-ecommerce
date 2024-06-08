import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { BsStarFill, BsStar } from 'react-icons/bs';
import Swal from 'sweetalert2';

export default function AddReview({ show, handleClose, productId }) {
    const [remarks, setRemarks] = useState('');
    const [rating, setRating] = useState(1);
    const [isRated, setIsRated] = useState(false);

    const handleStarClick = (selectedRating) => {
        setRating(selectedRating);
    };

    const handleSubmit = () => {
        const token = localStorage.getItem('token');

        fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/${productId}/create-review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                rating: rating,
                remarks: remarks
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to submit review');
            }
            setIsRated(true);
            Swal.fire('Review Submitted', 'Thank you for your review!', 'success');
        })
        .catch(error => {
            Swal.fire('Error', error.message || 'Failed to submit review. Please try again later.', 'error');
        });
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(
                    <BsStarFill key={i} onClick={() => handleStarClick(i)} style={{ cursor: 'pointer' }} />
                );
            } else {
                stars.push(
                    <BsStar key={i} onClick={() => handleStarClick(i)} style={{ cursor: 'pointer' }} />
                );
            }
        }
        return stars;
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Review</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isRated && (
                    <p className="text-danger">This item is already reviewed.</p>
                )}
                <Form>
                    <Form.Group controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <div className="d-flex">
                            {renderStars()}
                        </div>
                    </Form.Group>
                    <Form.Group controlId="review">
                        <Form.Label>Remarks</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            disabled={isRated}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleSubmit} disabled={isRated}>
                    Submit
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
