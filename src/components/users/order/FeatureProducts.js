import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductDetails from '../ProductDetails';

export default function FeatureProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/active`)
            .then(response => response.json())
            .then(data => {
                if (data.activeProducts) {
                    const randomProducts = getRandomProducts(data.activeProducts, 6);
                    setProducts(randomProducts);
                } else {
                    setProducts([]);
                }
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const getRandomProducts = (products, count) => {
        const shuffled = products.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    const handleViewDetails = (product) => {
        setSelectedProduct(product);
    };

    const defaultImage = '/logo192.png';

    return (
        <>
            <h4>Items you might also like: </h4>
            <Row xs={1} md={2} className="g-4">
                {products.map(product => (
                    <Col key={product._id}>
                        <Card className='w-100 h-100'>
                            <Card.Img variant="top" src={`https://res.cloudinary.com/dgmdxa6y5/image/upload/${product.productImage}` || 'https://res.cloudinary.com/dgmdxa6y5/image/upload/v1716470796/products/662f78c801047e4064572fa5.png'} alt={product.name} style={{ height: '200px', objectFit: 'cover' }} />
                            <Card.Body>
                                <Card.Title className="fw-bold text-uppercase">{product.name}</Card.Title>
                                <hr></hr>
                                <Card.Text>Price: ₱ {product.price.toFixed(2)}</Card.Text>
                              
                            </Card.Body>
                            <Card.Footer>
                                <Button className="btn btn-primary w-100" onClick={() => handleViewDetails(product)}>
                                    View Details
                                </Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
            {selectedProduct && (
                <ProductDetails show={true} handleClose={() => setSelectedProduct(null)} product={selectedProduct} />
            )}
        </>
    );
}
