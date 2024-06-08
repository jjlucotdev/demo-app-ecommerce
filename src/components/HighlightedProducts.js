import React, { useState, useEffect } from 'react';
import { Carousel, Card, Col } from 'react-bootstrap';
import './OtherComponents.css';

const HighlightedProducts = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/active`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                const featured = data.activeProducts.filter(product => product.isFeatured);
                setFeaturedProducts(featured);
            } catch (error) {
                console.error('Error fetching featured products:', error);
            }
        };

        fetchFeaturedProducts();
    }, []);

    // Splitting featuredProducts into chunks for each page
    const chunkSize = window.innerWidth <= 767 ? 2 : 3;
    const pages = [];
    for (let i = 0; i < featuredProducts.length; i += chunkSize) {
        pages.push(featuredProducts.slice(i, i + chunkSize));
    }

    return (
        <div className="featured-products-carousel">
            <h3 className="m-5 text-center">Featured & Recommended Products</h3>
            <Carousel>
                {pages.map((page, index) => (
                    <Carousel.Item key={index}>
                        <div className="row justify-content-around">
                            {page.map(product => (
                                <Col key={product._id} xs={12} md={6} lg={4}>
                                    <Card style={{ width: '100%', height: '100%' }}>
                                        <Card.Img variant="top" src={`https://res.cloudinary.com/dgmdxa6y5/image/upload/${product.productImage}`} style={{ height: '75%', objectFit: 'cover' }} />
                                        <Card.Body>
                                            <Card.Title>{product.name}</Card.Title>
                                            <Card.Text className="carousel-item-description">
                                                {product.description}
                                            </Card.Text>
                                            <div className="d-flex justify-content-between">
                                                <Card.Text>Price: ${product.price.toFixed(2)}</Card.Text>
                                                <Card.Text>Availability: {product.isActive ? 'Available' : 'Unavailable'}</Card.Text>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
};

export default HighlightedProducts;
