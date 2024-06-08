import React, { useEffect, useState } from 'react';
import { Accordion, ListGroup, Row, Col, Card, Spinner, Button, FormControl, InputGroup, OverlayTrigger, Tooltip, Container, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { AiFillDelete, AiOutlineSave, AiOutlineEdit, AiOutlineReload, AiOutlineCloseCircle, AiOutlineShoppingCart, AiOutlineShopping    } from 'react-icons/ai';
import UserDetails from '../components/users/profile/UserDetails';
import PaymentMethod from '../components/users/order/PaymentMethod';
import FeatureProducts from '../components/users/order/FeatureProducts';
import Footer from '../components/Footer';

export default function Cart() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState({});
    const [emptyCart, setEmptyCart] = useState("");

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.cart) {
                    fetchProductNames(data.cart.cartItems).then(cartItems => {
                        setCart({ ...data.cart, cartItems });
                    });

                } else if (data.message) {
                    setEmptyCart(data.message);
                }

            })
            .catch(error => {
                console.error('Error fetching cart:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to fetch cart',
                    icon: 'error'
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const fetchProductNames = async (cartItems) => {
        return Promise.all(cartItems.map(async (item) => {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${item.productId}`);
            const productData = await response.json();
            return {
                ...item,
                productName: productData.product.name
            };
        }));
    };

    const updateCartQuantity = (productId, quantity) => {
        if (quantity <= 0) return;
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/updateQuantity`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ productId, quantity })
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    fetchCart();
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed to update cart quantity',
                        icon: 'error'
                    });
                }
            })
            .catch(error => {
                console.error('Error updating cart quantity:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to update cart quantity',
                    icon: 'error'
                });
            });
    };

    const removeFromCart = (productId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to remove this item from your cart?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/${productId}/removeFromCart`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.message) {
                            fetchCart();
                        } else {
                            Swal.fire({
                                title: 'Error!',
                                text: 'Failed to remove item from cart',
                                icon: 'error'
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Error removing item from cart:', error);
                        Swal.fire({
                            title: 'Error!',
                            text: 'Failed to remove item from cart',
                            icon: 'error'
                        });
                    });
            }
        });
    };

    const clearCart = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to clear all items from the cart?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, clear it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/clearCart`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.message) {
                            fetchCart();
                            Swal.fire(
                                'Cleared!',
                                'Your cart has been cleared.',
                                'success'
                            );
                        } else {
                            Swal.fire({
                                title: 'Error!',
                                text: 'Failed to clear cart',
                                icon: 'error'
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Error clearing cart:', error);
                        Swal.fire({
                            title: 'Error!',
                            text: 'Failed to clear cart',
                            icon: 'error'
                        });
                    });
            }
        });
    };

    const handleEditToggle = (productId) => {
        setEditing({ ...editing, [productId]: !editing[productId] });
        if (editing[productId]) {
            const item = cart.cartItems.find(item => item.productId === productId);
            updateCartQuantity(productId, item.quantity);
        }
    };

    const handleInputChange = (productId, value) => {
        const updatedCart = cart.cartItems.map(item => {
            if (item.productId === productId) {
                return { ...item, quantity: value };
            }
            return item;
        });
        setCart({ ...cart, cartItems: updatedCart });
    };

    const checkout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to proceed with the checkout now?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, proceed',
            cancelButtonText: 'No, cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/checkout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data) {
                            Swal.fire({
                                title: 'YAY!',
                                text: 'Thank you for ordering!',
                                icon: 'success'
                            });
                            fetchCart();
                        } else {
                            Swal.fire({
                                title: 'Error!',
                                text: 'Failed to checkout',
                                icon: 'error'
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Error during checkout:', error);
                        Swal.fire({
                            title: 'Error!',
                            text: 'Failed to checkout',
                            icon: 'error'
                        });
                    });
            }
        });
    };

    const cancelEditing = () => {
        setEditing({});
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
        <Container fluid className='bg-light'>
            <Row>
                <Col md={8}>
                    <div className="d-flex align-items-center my-2">
                        <h4 className="m-0">
                            <AiOutlineShoppingCart size={24} />
                            <strong className="ms-2">CART</strong>
                        </h4>
                    </div>
                    <Card className='w-100'>
                        <Card.Body>
                            <UserDetails />
                            <PaymentMethod />
    
                            <div className="mb-2">
                                <Accordion defaultActiveKey="0">
                                    <Accordion.Item eventKey="0">
                                        <Card.Header className='d-flex justify-content-between align-items-center'>
                                            <span>Cart Items</span>
                                            {!cart ? (
                                                <div className="d-flex justify-content-end">
                                                    <span></span>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="d-flex justify-content-end">
                                                        <OverlayTrigger
                                                            placement="top"
                                                            overlay={<Tooltip id="tooltip-refresh">Refresh</Tooltip>}
                                                        >
                                                            <Button
                                                                variant="outline-secondary"
                                                                size="sm"
                                                                onClick={() => {
                                                                    fetchCart();
                                                                }}
                                                                className='me-1'
                                                            >
                                                                <AiOutlineReload />
                                                            </Button>
                                                        </OverlayTrigger>
    
                                                        <OverlayTrigger
                                                            placement="top"
                                                            overlay={<Tooltip id="tooltip-delete">Clear Cart</Tooltip>}
                                                        >
                                                            <Button
                                                                variant="outline-danger"
                                                                size="sm"
                                                                onClick={clearCart}
                                                            >
                                                                <AiFillDelete />
                                                            </Button>
                                                        </OverlayTrigger>
                                                    </div>
                                                </>
                                            )}
                                        </Card.Header>
                                        <Accordion.Body>
                                            {emptyCart && !cart ? (
                                                <div>No available items in cart.</div>
                                            ) : (
                                                <ListGroup variant="flush">
                                                    {cart && cart.cartItems && cart.cartItems.map(item => (
                                                        <ListGroup.Item key={item.productId}>
                                                            <Row>
                                                                <Col sm={6} md={2}>
                                                                    <strong>Name:</strong>
                                                                </Col>
                                                                <Col sm={6} md={2}>
                                                                    {item.productName}
                                                                </Col>
                                                                <Col sm={6} md={1}>
                                                                    <strong>Qty:</strong>
                                                                </Col>
                                                                <Col sm={6} md={2}>
                                                                    {editing[item.productId] ? (
                                                                        <InputGroup>
                                                                            <Button
                                                                                variant="outline-secondary"
                                                                                size="sm"
                                                                                onClick={() => handleInputChange(item.productId, item.quantity - 1)}
                                                                                disabled={item.quantity <= 1}
                                                                            >
                                                                                -
                                                                            </Button>
                                                                            <FormControl
                                                                                type="number"
                                                                                value={item.quantity}
                                                                                onChange={(e) => handleInputChange(item.productId, parseInt(e.target.value))}
                                                                            />
                                                                            <Button
                                                                                variant="outline-secondary"
                                                                                size="sm"
                                                                                onClick={() => handleInputChange(item.productId, item.quantity + 1)}
                                                                            >
                                                                                +
                                                                            </Button>
                                                                        </InputGroup>
                                                                    ) : (
                                                                        <span>{item.quantity}</span>
                                                                    )}
                                                                </Col>
                                                                <Col sm={6} md={2} className="text-md-end mb-1 mb-md-0">
                                                                    <strong>Subtotal:</strong>
                                                                </Col>
                                                                <Col sm={6} md={1} className="text-md-start mb-1 mb-md-0">
                                                                    {item.subtotal}
                                                                </Col>
                                                                <Col sm={6} md={2}>
                                                                    <OverlayTrigger
                                                                        placement="top"
                                                                        overlay={<Tooltip id={`tooltip-edit-${item.productId}`}>{editing[item.productId] ? 'Save' : 'Edit'}</Tooltip>}
                                                                    >
                                                                        <span>
                                                                            <Button variant="outline-primary" size="sm" onClick={() => handleEditToggle(item.productId)}>
                                                                                {editing[item.productId] ? <AiOutlineSave /> : <AiOutlineEdit />}
                                                                            </Button>
                                                                            <span className="visually-hidden">{editing[item.productId] ? 'Save' : 'Edit'}</span>
                                                                        </span>
                                                                    </OverlayTrigger>
                                                                    {" "}
                                                                    {editing[item.productId] && (
                                                                        <OverlayTrigger
                                                                            placement="top"
                                                                            overlay={<Tooltip id={`tooltip-cancel-${item.productId}`}>Cancel</Tooltip>}
                                                                        >
                                                                            <Button variant="outline-secondary" size="sm" onClick={() => cancelEditing()}>
                                                                                <AiOutlineCloseCircle />
                                                                            </Button> 
                                                                        </OverlayTrigger>
                                                                    )}
                                                                    {" "}
                                                                    <OverlayTrigger
                                                                        placement="top"
                                                                        overlay={<Tooltip id={`tooltip-remove-${item.productId}`}>Remove</Tooltip>}
                                                                    >
                                                                        <Button variant="outline-danger" size="sm" onClick={() => removeFromCart(item.productId)}>
                                                                            <AiFillDelete />
                                                                        </Button>
                                                                    </OverlayTrigger>
                                                                </Col>
                                                            </Row>
                                                        </ListGroup.Item>
                                                    ))}
                                                </ListGroup>
                                            )}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </div>
                            {emptyCart && !cart ? (
                                <div className="d-flex justify-content-end">
                                    <h3>Total: 0</h3>
                                </div>
                            ) : (
                                <div className="d-flex justify-content-end">
                                    <h3>Total: {" " + (cart ? cart.totalPrice : 0)}</h3>
                                </div>
                            )}
                        </Card.Body>
                        <Card.Footer className="d-flex justify-content-end">
                            <Button variant="danger" size="lg" onClick={checkout} className="d-flex align-items-center">
                                <AiOutlineShopping size={24} className="me-2" />
                                <span>Checkout</span>
                            </Button>
                        </Card.Footer>
                    </Card>
                </Col>
                <Col md={4} className='mb-3'>
                    <FeatureProducts />
                </Col>
            </Row>
            <Footer />
        </Container>
    );
    
}


