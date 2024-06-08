import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';

const PaymentMethod = () => {
    return (
        <div className="mb-4 bg-light">
            <h5 className="bg-dark text-white p-2 mb-3">Payment Method</h5>

            <Row className='m-1'>
                <Col xs={6} md={2}>
                    <strong>Select Method:</strong>
                </Col>
                <Col xs={6} md={10}>
                    <Form.Select aria-label="Select payment method">
                        <option value="cash">Cash on Delivery</option>

                    </Form.Select>
                </Col>
            </Row>
        </div>
    );
}

export default PaymentMethod;
