import React, { useEffect, useState } from 'react';
import { Card, ListGroup, Row, Spinner, Col, Button, Modal, Pagination } from 'react-bootstrap';
import Swal from 'sweetalert2';
import AddReview from './AddReview';
import { FaStar } from 'react-icons/fa';
import { AiOutlineShoppingCart } from 'react-icons/ai';

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [currentReviewId, setCurrentReviewId] = useState(null); 
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchOrders();
    }, [currentPage]);

    const fetchOrders = () => {
        const limit = 5;
        const offset = (currentPage - 1) * limit;
        fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/my-orders?limit=${limit}&offset=${offset}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.orders) {
                const ordersWithNames = data.orders.map(async (order) => {
                    const productsOrdered = await fetchProductNames(order.productsOrdered);
                    return { ...order, productsOrdered };
                });
                Promise.all(ordersWithNames).then(setOrders);
            } else {
                setOrders([]);
            }
        })
        .catch(error => {
            console.error('Error fetching order history:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to fetch order history',
                icon: 'error'
            });
        })
        .finally(() => {
            setLoading(false);
        });
    };
    
    const fetchProductNames = async (productsOrdered) => {
        return Promise.all(productsOrdered.map(async (item) => {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${item.productId}`);
            const productData = await response.json();
            return {
                ...item,
                productName: productData.product.name,
                reviews: item.reviews 
            };
        }));
    };

    const handleReviewClick = (productId, reviewId) => {
        setCurrentProductId(productId);
        setCurrentReviewId(reviewId);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentProductId(null);
        setCurrentReviewId(null);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) {
        return (
            <Row className="justify-content-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Row>
        );
    }

    return (
        <div>
            <h4><strong><AiOutlineShoppingCart size={24} /> ORDER HISTORY</strong> </h4>
            {orders.length === 0 ? (
                <Card className='w-100'>
                    <Card.Body>
                        <Card.Title>Order History</Card.Title>
                        <ListGroup variant="flush">
                            <ListGroup.Item>No orders found.</ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                </Card>
            ) : (
                orders.map(order => (
                    <Card key={order._id} className="mb-3 w-100">
                        <Card.Body className='bg-light'>
                            <Card.Title className="bg-dark text-white p-2">Order ID: {order._id}</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col xs={6} md={3}>
                                            <strong>Date:</strong> {new Date(order.orderedOn).toLocaleDateString()}
                                        </Col>
                                        <Col xs={6} md={3}>
                                            <strong>Total:</strong> ₱ {order.totalPrice.toFixed(2)}
                                        </Col>
                                        <Col xs={6} md={3}>
                                            <strong>Status:</strong> {order.status}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col xs={12}>
                                            <strong>Items:</strong>
                                            <ListGroup variant="flush">
                                                {order.productsOrdered.map(item => (
                                                    <ListGroup.Item key={item.productId}>
                                                        <Row>
                                                            <Col xs={12} md={6}>
                                                                {item.productName} - {item.quantity} x ₱{item.subtotal.toFixed(2)}
                                                            </Col>
                                                            <Col xs={12} md={6} className="text-md-end">
                                                                <Button
                                                                    variant={item.rated ? "primary" : "outline-primary"} 
                                                                    size="sm"
                                                                    className="ms-2"
                                                                    onClick={() => handleReviewClick(item.productId, item.review)} 
                                                                  
                                                                >
                                                                    <FaStar />
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                ))
            )}
            <Pagination className="justify-content-center">
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                <Pagination.Item active>{currentPage}</Pagination.Item>
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={orders.length < 5} />
            </Pagination>
            <AddReview
                show={showModal}
                handleClose={handleCloseModal}
                productId={currentProductId}
            />
        </div>
    );
}
