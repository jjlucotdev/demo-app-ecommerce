import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import OrderHistory from '../components/users/order/OrderHistory'; 
import FeatureProducts from '../components/users/order/FeatureProducts'; 
import Footer from '../components/Footer';

export default function UserOrder() {
    return (
        <Container fluid className="mt-4 bg-light">
            <Row className='mb-4'>
                <Col xs={12} md={8} className="mb-4 mb-md-0">
                    <OrderHistory />
                </Col>
                <Col xs={12} md={4}>
                    <FeatureProducts />
                </Col>
            </Row>
            <Footer/>
        </Container>
    );
}
